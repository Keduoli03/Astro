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
let initialized = false;

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

const search = async (): Promise<void> => {
	if (!keyword) {
		result = [];
		return;
	}

	if (!initialized) return;

	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(keyword);
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else if (import.meta.env.DEV) {
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
	const initializeSearch = () => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";
		if (keyword) search();
	};

	if (import.meta.env.DEV) {
		initializeSearch();
	} else {
		document.addEventListener("pagefindready", initializeSearch);
		document.addEventListener("pagefindloaderror", initializeSearch);

		setTimeout(() => {
			if (!initialized) initializeSearch();
		}, 2000);
	}

	// ESC键关闭面板
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closeSearchPanel();
	});
});

$: if (initialized && keyword) {
	search();
}
</script>

<!-- 搜索面板 -->
<div 
  id="search-panel" 
  class="hidden fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300" 
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
    
    <!-- 搜索结果 -->
    {#if isSearching}
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
