/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates an APlayer component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.title - The song title.
 * @param {string} properties.author - The song author/artist.
 * @param {string} properties.url - The audio file URL.
 * @param {string} properties.pic - The cover image URL.
 * @param {boolean} [properties.showlrc=false] - Whether to show lyrics.
 * @param {boolean} [properties.fixed=false] - Whether to use fixed mode.
 * @param {boolean} [properties.mini=false] - Whether to use mini mode.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created APlayer component.
 */
export function APlayerComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0)
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("aplayer" directive must be leaf type "::aplayer{title="..." author="..." url="..." pic="..."}")',
		]);

	if (!properties.title || !properties.author || !properties.url)
		return h(
			"div",
			{ class: "hidden" },
			'Invalid APlayer configuration. ("title", "author", and "url" attributes are required)',
		);

	const playerUuid = `AP${Math.random().toString(36).slice(-6)}`; // Collisions are not important

	// 创建播放器容器
	const nPlayerContainer = h(`div#${playerUuid}-player`, {
		class: "aplayer-container",
	});

	// 创建初始化脚本
	const nScript = h(
		`script#${playerUuid}-script`,
		{ type: "text/javascript", defer: true },
		`
		// 确保 APlayer CSS 已加载
		if (!document.querySelector('link[href*="aplayer"]')) {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css';
			document.head.appendChild(link);
		}
		
		// 确保 APlayer JS 已加载
		if (typeof APlayer === 'undefined') {
			const script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js';
			script.onload = function() {
				initPlayer_${playerUuid}();
			};
			document.head.appendChild(script);
		} else {
			initPlayer_${playerUuid}();
		}
		
		function initPlayer_${playerUuid}() {
			const container = document.getElementById('${playerUuid}-player');
			if (container && typeof APlayer !== 'undefined') {
				const player = new APlayer({
					container: container,
					showlrc: ${properties.showlrc || false},
					fixed: ${properties.fixed || false},
					mini: ${properties.mini || false},
					audio: [{
						title: '${properties.title.replace(/'/g, "\\'").replace(/"/g, '\\"')}',
						artist: '${properties.author.replace(/'/g, "\\'").replace(/"/g, '\\"')}',
						url: '${properties.url}',
						pic: '${properties.pic || ""}'
					}]
				});
				console.log("[APLAYER] Loaded player for ${properties.title} | ${playerUuid}.");
			}
		}
		`,
	);

	return h(
		`div#${playerUuid}-wrapper`,
		{
			class: "aplayer-wrapper",
			"data-title": properties.title,
			"data-author": properties.author,
		},
		[nPlayerContainer, nScript],
	);
}
