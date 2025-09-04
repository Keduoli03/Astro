/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a MetingJS component.
 */
export function MetingComponent(properties, config = {}) {
	if (!properties.server || !properties.type || !properties.id)
		return h(
			"div",
			{ class: "hidden" },
			'Invalid MetingJS configuration. ("server", "type", and "id" attributes are required)',
		);

	// 检查是否提供了 API 配置
	if (!config.api) {
		return h(
			"div",
			{ class: "hidden" },
			"MetingJS API not configured. Please add API configuration in astro.config.mjs",
		);
	}

	const uniqueId = `meting-${Math.random().toString(36).substr(2, 9)}`;

	// 创建容器
	const container = h("div", {
		id: uniqueId,
		class: `meting-container ${uniqueId}`,
	});

	// 创建样式标签
	const styleTag = h(
		"style",
		{},
		`
		.${uniqueId} {
			margin: 20px 0;
		}
		`,
	);

	// 创建脚本标签
	const scriptTag = h(
		"script",
		{},
		`
		(function() {
			let initialized = false;
			
			function initMeting() {
				if (initialized) return;
				
				const container = document.getElementById('${uniqueId}');
				if (!container) {
					setTimeout(initMeting, 100);
					return;
				}
				
				// 确保 APlayer CSS 已加载
				if (!document.querySelector('link[href*="aplayer"]')) {
					const link = document.createElement('link');
					link.rel = 'stylesheet';
					link.href = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css';
					document.head.appendChild(link);
				}
				
				// 加载 APlayer JS
				if (typeof APlayer === 'undefined') {
					const aplayerScript = document.createElement('script');
					aplayerScript.src = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js';
					aplayerScript.onload = function() {
						loadMetingScript();
					};
					document.head.appendChild(aplayerScript);
				} else {
					loadMetingScript();
				}
				
				function loadMetingScript() {
					if (!window.customElements.get('meting-js')) {
						const metingScript = document.createElement('script');
						metingScript.src = 'https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js';
						metingScript.onload = function() {
							createMetingElement();
						};
						metingScript.onerror = function() {
							console.error('[METING] 加载失败');
						};
						document.head.appendChild(metingScript);
					} else {
						createMetingElement();
					}
				}
				
				function createMetingElement() {
					if (initialized) return;
					initialized = true;
					
					const metingElement = document.createElement('meting-js');
					metingElement.setAttribute('server', '${properties.server}');
					metingElement.setAttribute('type', '${properties.type}');
					metingElement.setAttribute('id', '${properties.id}');
					// 修改这一行：从 data-api 改为 api
					metingElement.setAttribute('api', '${config.api}');
					
					// 添加可选属性
					${properties.autoplay ? `metingElement.setAttribute('autoplay', '${properties.autoplay}');` : ""}
					${properties.theme ? `metingElement.setAttribute('theme', '${properties.theme}');` : ""}
					${properties.loop ? `metingElement.setAttribute('loop', '${properties.loop}');` : ""}
					${properties.order ? `metingElement.setAttribute('order', '${properties.order}');` : ""}
					${properties.preload ? `metingElement.setAttribute('preload', '${properties.preload}');` : ""}
					${properties.volume ? `metingElement.setAttribute('volume', '${properties.volume}');` : ""}
					${properties.mutex !== undefined ? `metingElement.setAttribute('mutex', '${properties.mutex}');` : ""}
					${properties.lrctype !== undefined ? `metingElement.setAttribute('lrctype', '${properties.lrctype}');` : ""}
					${properties.listfolded !== undefined ? `metingElement.setAttribute('listfolded', '${properties.listfolded}');` : ""}
					${properties.listmaxheight ? `metingElement.setAttribute('listmaxheight', '${properties.listmaxheight}');` : ""}
					${properties.storagename ? `metingElement.setAttribute('storagename', '${properties.storagename}');` : ""}
					
					container.appendChild(metingElement);
					console.log('[METING] 初始化完成:', '${properties.server}:${properties.type}:${properties.id}');
				}
			}
			
			// 等待 DOM 加载完成
			if (document.readyState === 'loading') {
				document.addEventListener('DOMContentLoaded', initMeting);
			} else {
				initMeting();
			}
		})();
		`,
	);

	return h("div", { class: "meting-wrapper" }, [
		styleTag,
		container,
		scriptTag,
	]);
}
