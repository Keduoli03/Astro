/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates an admonition component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} [properties.title] - An optional title.
 * @param {('tip'|'note'|'important'|'caution'|'warning')} type - The admonition type.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created admonition component.
 */
export function AdmonitionComponent(properties, children, type) {
	// 统一将 type 转换为小写，这样 IMPORTANT 和 important 都会被处理为 important
	const normalizedType = type.toLowerCase();
	const label = properties?.title;

	return h("blockquote", { class: `admonition bdm-${normalizedType}` }, [
		h(
			"span",
			{ class: "bdm-title" },
			label ? label : normalizedType.toUpperCase(),
		),
		...children,
	]);
}
