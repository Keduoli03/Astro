<script lang="ts">
import { DARK_MODE, LIGHT_MODE } from "@constants/constants.ts";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
	applyThemeToDocument,
	getStoredTheme,
	setTheme,
} from "@utils/setting-utils.ts";
import { onMount } from "svelte";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE];
let mode: LIGHT_DARK_MODE = $state(LIGHT_MODE);
let isAnimating = $state(false); // 修改这行，添加 $state()

onMount(() => {
	mode = getStoredTheme();
	// 如果是AUTO_MODE，默认设置为LIGHT_MODE
	if (mode === "auto") {
		mode = LIGHT_MODE;
		setTheme(mode);
	}
	applyThemeToDocument(mode);

	// 添加CSS变量用于动画
	const root = document.documentElement;
	root.style.setProperty("--theme-transition-duration", "0.5s");
});

function createRippleEffect(button: HTMLElement, newMode: LIGHT_DARK_MODE) {
	const rect = button.getBoundingClientRect();
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;

	// 创建波纹效果
	const ripple = document.createElement("div");
	ripple.className = "theme-ripple";
	ripple.style.cssText = `
		position: fixed;
		top: ${centerY}px;
		left: ${centerX}px;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: ${newMode === DARK_MODE ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"};
		pointer-events: none;
		z-index: 9998;
		transform: translate(-50%, -50%);
		transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	`;

	document.body.appendChild(ripple);

	// 计算覆盖全屏所需的大小
	const maxSize =
		Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * 2;

	// 触发波纹动画
	requestAnimationFrame(() => {
		ripple.style.width = `${maxSize}px`;
		ripple.style.height = `${maxSize}px`;
	});

	// 清理波纹
	setTimeout(() => {
		ripple.remove();
	}, 600);
}

function switchScheme(newMode: LIGHT_DARK_MODE): void {
	if (isAnimating || mode === newMode) return;

	isAnimating = true;

	// 简化切换逻辑，避免多次刷新
	mode = newMode;
	setTheme(mode);
	applyThemeToDocument(mode);

	// 简单的过渡效果
	document.documentElement.style.transition =
		"background-color 0.3s ease, color 0.3s ease";

	setTimeout(() => {
		isAnimating = false;
		document.documentElement.style.transition = "";
	}, 300);

	hidePanel();
}

function toggleScheme(): void {
	const newMode = mode === LIGHT_MODE ? DARK_MODE : LIGHT_MODE;
	switchScheme(newMode);
}

function showPanel(): void {
	if (isAnimating) return;
	const panel = document.querySelector("#light-dark-panel");
	panel?.classList.remove("float-panel-closed");
}

function hidePanel(): void {
	const panel = document.querySelector("#light-dark-panel");
	panel?.classList.add("float-panel-closed");
}
</script>

<!-- z-50 make the panel higher than other float panels -->
<div class="relative z-50" role="menu" tabindex="-1" onmouseleave={hidePanel}>
    <button 
        aria-label="Light/Dark Mode" 
        role="menuitem" 
        class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 transition-all duration-200" 
        class:opacity-75={isAnimating}
        id="scheme-switch" 
        onclick={toggleScheme} 
        onmouseenter={showPanel}
    >
        <div class="absolute transition-all duration-300" class:opacity-0={mode !== LIGHT_MODE} class:scale-0={mode !== LIGHT_MODE}>
            <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]"></Icon>
        </div>
        <div class="absolute transition-all duration-300" class:opacity-0={mode !== DARK_MODE} class:scale-0={mode !== DARK_MODE}>
            <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem]"></Icon>
        </div>
    </button>
    <div id="light-dark-panel" class="float-panel float-panel-closed absolute transition-all top-11 right-0 whitespace-nowrap">
        <div class="flex flex-col">
            <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
                    class:current-theme-btn={mode === LIGHT_MODE}
                    onclick={() => switchScheme(LIGHT_MODE)}
            >
                <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.lightMode)}
            </button>
            <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95"
                    class:current-theme-btn={mode === DARK_MODE}
                    onclick={() => switchScheme(DARK_MODE)}
            >
                <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.darkMode)}
            </button>
        </div>
    </div>
</div>

<style>
.current-theme-btn {
    @apply bg-[var(--btn-plain-bg-hover)];
}

:global(.theme-transitioning *) {
    transition: background-color var(--theme-transition-duration, 0.5s) ease,
                color var(--theme-transition-duration, 0.5s) ease,
                border-color var(--theme-transition-duration, 0.5s) ease,
                box-shadow var(--theme-transition-duration, 0.5s) ease !important;
}

/* View Transitions API 样式 */
:global(::view-transition-old(root)),
:global(::view-transition-new(root)) {
  animation-duration: 0.5s;
}

:global(::view-transition-old(root)) {
  animation-name: fade-out;
}

:global(::view-transition-new(root)) {
  animation-name: fade-in;
}

@keyframes fade-out {
  to {
    opacity: 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}
</style>
