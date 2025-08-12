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
let isAnimating = $state(false);

onMount(() => {
	mode = getStoredTheme();
	if (mode === "auto") {
		mode = LIGHT_MODE;
		setTheme(mode);
	}
	applyThemeToDocument(mode);
});

/**
 * Handle theme toggle with smooth animated transition effect
 * @param event Mouse event for click coordinates
 * @param newMode The target theme mode
 */
function triggerThemeTransition(event: MouseEvent, newMode: LIGHT_DARK_MODE) {
	if (isAnimating || mode === newMode) return;

	isAnimating = true;

	const trigger = () => {
		mode = newMode;
		setTheme(mode);
		applyThemeToDocument(mode);
	};

	let transition: ViewTransition;
	transition = document.startViewTransition?.(trigger);
	if (!transition) {
		// 降级处理：如果不支持 View Transition API
		trigger();
		isAnimating = false;
		return;
	}

	// 获取点击坐标用于径向动画起点
	const x = event.clientX;
	const y = event.clientY;

	transition.ready.then(() => {
		// 使用更大的半径和更平滑的缓动函数
		const endRadius = Math.hypot(
			Math.max(x, innerWidth - x),
			Math.max(y, innerHeight - y),
		);

		// 创建更平滑的圆形扩散动画
		const clipPath = [
			`circle(0px at ${x}px ${y}px)`,
			`circle(${endRadius}px at ${x}px ${y}px)`,
		];

		document.documentElement.animate(
			{
				clipPath: newMode === DARK_MODE ? clipPath : [...clipPath].reverse(),
			},
			{
				duration: 600,
				easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // 更平滑的缓动
				pseudoElement:
					newMode === DARK_MODE
						? "::view-transition-new(root)"
						: "::view-transition-old(root)",
			},
		);
	});

	transition.finished.then(() => {
		isAnimating = false;
	});
}

function switchScheme(newMode: LIGHT_DARK_MODE, event?: MouseEvent): void {
	if (event) {
		triggerThemeTransition(event, newMode);
	} else {
		// 如果没有事件对象，使用默认切换
		mode = newMode;
		setTheme(mode);
		applyThemeToDocument(mode);
	}
	hidePanel();
}

function toggleScheme(event: MouseEvent): void {
	const newMode = mode === LIGHT_MODE ? DARK_MODE : LIGHT_MODE;
	triggerThemeTransition(event, newMode);
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
                    onclick={(e) => switchScheme(LIGHT_MODE, e)}
            >
                <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.lightMode)}
            </button>
            <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95"
                    class:current-theme-btn={mode === DARK_MODE}
                    onclick={(e) => switchScheme(DARK_MODE, e)}
            >
                <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.darkMode)}
            </button>
        </div>
    </div>
</div>

<style>
.current-theme-btn {
    background-color: var(--btn-plain-bg-hover);
}

/* 优化 View Transitions 样式，减少阴影效果 */
:global(::view-transition-old(root)),
:global(::view-transition-new(root)) {
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  /* 移除可能产生阴影的样式 */
  box-shadow: none;
  filter: none;
}

/* 确保过渡期间层级正确，避免阴影重叠 */
:global(::view-transition-old(root)) {
  z-index: 1;
}

:global(::view-transition-new(root)) {
  z-index: 2;
}

/* 确保过渡容器没有额外的阴影或边框 */
:global(::view-transition-group(root)) {
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 移除可能的默认过渡效果 */
:global(html) {
  view-transition-name: root;
}
</style>