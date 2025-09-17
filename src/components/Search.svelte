<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import type { SearchResult } from "@/global";

// 导出open方法供外部调用
export function openSearchPanel() {
	const panel = document.getElementById("search-panel");
	panel?.classList.remove("hidden");
	document.getElementById("search-input")?.focus();
}

export function closeSearchPanel() {
	const panel = document.getElementById("search-panel");
	panel?.classList.add("hidden");
}

// 处理面板点击事件
function handlePanelClick(e: MouseEvent) {
	if (e.target === e.currentTarget) {
		closeSearchPanel();
	}
}

let keyword = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let pagefindLoading = false;

const fakeResult: SearchResult[] = [
	{
		url: url("/"),
		meta: { title: "This Is a Fake Search Result" },
		excerpt:
			"Because the search cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: url("/"),
		meta: { title: "If You Want to Test the Search" },
		excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
	},
];

// 动态加载Pagefind
const loadPagefind = async (): Promise<boolean> => {
	if (pagefindLoaded) return true;
	if (pagefindLoading) {
		// 如果正在加载，等待加载完成
		while (pagefindLoading) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		return pagefindLoaded;
	}

	pagefindLoading = true;

	try {
		// 创建 script 标签加载 pagefind.js
		const script = document.createElement("script");
		script.src = "/pagefind/pagefind.js";
		script.type = "module"; // 设置为 ES 模块，支持 import.meta 语法
		script.async = true;

		const loadPromise = new Promise<boolean>((resolve) => {
			script.onload = async () => {
				console.log("Pagefind script loaded successfully");

				// 等待 window.pagefind 初始化
				let attempts = 0;
				const maxAttempts = 50;

				while (attempts < maxAttempts && !window.pagefind) {
					await new Promise((resolve) => setTimeout(resolve, 100));
					attempts++;
				}

				if (window.pagefind) {
					console.log("Pagefind initialized successfully");
					pagefindLoaded = true;
					resolve(true);
				} else {
					console.error("Pagefind not available after loading script");
					resolve(false);
				}
			};

			script.onerror = (error) => {
				console.error("Failed to load pagefind script:", error);
				resolve(false);
			};
		});

		document.head.appendChild(script);
		return await loadPromise;
	} catch (error) {
		console.error("加载 Pagefind 时出错:", error);
		return false;
	} finally {
		pagefindLoading = false;
	}
};

const search = async (): Promise<void> => {
	if (!keyword) {
		result = [];
		return;
	}

	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (import.meta.env.PROD) {
			// 在生产环境中按需加载Pagefind
			const loaded = await loadPagefind();
			if (loaded && window.pagefind) {
				const response = await window.pagefind.search(keyword);
				searchResults = await Promise.all(
					response.results.map((item) => item.data()),
				);
			} else {
				console.warn("Pagefind failed to load, showing fallback message");
				searchResults = [
					{
						url: url("/"),
						meta: { title: "搜索功能暂时不可用" },
						excerpt: "搜索功能加载失败，请刷新页面重试。",
					},
				];
			}
		} else if (import.meta.env.DEV) {
			// 开发环境使用模拟数据
			searchResults = fakeResult;
		}

		result = searchResults;
	} catch (error) {
		console.error("Search error:", error);
		result = [];
	} finally {
		isSearching = false;
	}
};

onMount(() => {
	// ESC键关闭面板
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closeSearchPanel();
	});
});

$: if (keyword) {
	search();
}
</script>

<!-- 搜索面板 -->
<div 
  id="search-panel" 
  class="hidden fixed inset-0 z-[60] items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300" 
  on:click={handlePanelClick}
  on:keydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      closeSearchPanel();
    }
  }}
  role="dialog"
  aria-modal="true"
  tabindex="0"
>
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div 
    class="w-full max-w-2xl bg-[var(--card-bg)] border border-[var(--line-divider)] rounded-xl shadow-2xl p-6 transform transition-all duration-300" 
    on:click|stopPropagation
    on:keydown|stopPropagation
    role="dialog"
    aria-label="搜索面板内容"
  >
    <!-- 搜索输入框 -->
    <div class="flex relative items-center h-12 rounded-xl mb-4
        bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
        dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
        border-2 border-transparent focus-within:border-[var(--primary)]">
      <Icon icon="material-symbols:search" class="absolute text-xl pointer-events-none ml-4 transition my-auto text-black/30 dark:text-white/30" />
      <input 
        id="search-input"
        bind:value={keyword}
        placeholder={i18n(I18nKey.search)}
        class="pl-12 pr-4 absolute inset-0 text-base bg-transparent outline-0 text-black/70 dark:text-white/70 placeholder:text-black/40 dark:placeholder:text-white/40"
        autocomplete="off"
      >
    </div>
    
    <!-- 搜索状态提示 -->
    {#if pagefindLoading}
      <div class="text-sm text-black/50 dark:text-white/50 text-center py-4">
        正在加载搜索功能...
      </div>
    {:else if isSearching}
      <div class="text-sm text-black/50 dark:text-white/50 text-center py-4">
        {i18n(I18nKey.search)}...
      </div>
    {:else if result.length > 0}
      <div class="max-h-80 overflow-y-auto">
        {#each result as item}
          <a href={item.url} class="block p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5 last:border-b-0">
            <div class="font-medium text-black/80 dark:text-white/80 mb-1">{item.meta.title}</div>
            <div class="text-sm text-black/60 dark:text-white/60 line-clamp-2">{@html item.excerpt}</div>
          </a>
        {/each}
      </div>
    {:else if keyword}
      <div class="text-sm text-black/50 dark:text-white/50 text-center py-4">
        {i18n(I18nKey.noResultsFound)}
      </div>
    {:else}
      <div class="text-sm text-black/50 dark:text-white/50 text-center py-4">
        {i18n(I18nKey.searchPrompt)}
      </div>
    {/if}
    
    <!-- 搜索提示 -->
    <div class="text-sm text-black/50 dark:text-white/50 mt-3 text-center">
      {i18n(I18nKey.searchHint)}
    </div>
  </div>
</div>

<!-- 点击背景关闭面板 -->
<div 
  class="fixed inset-0 -z-10" 
  on:click={closeSearchPanel}
  on:keydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      closeSearchPanel();
    }
  }}
  role="button"
  tabindex="0"
></div>
