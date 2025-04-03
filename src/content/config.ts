import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z
		.object({
			title: z.string(),
			date: z.coerce.date().optional(),
			published: z.coerce.date().optional(),
			updated: z.coerce.date().optional(),
			draft: z.boolean().optional().default(false),
			description: z.string().optional().default(""),
			image: z.string().optional().default(""),
			// cover字段
			cover: z.string().optional(),
			tags: z.array(z.string()).optional().default([]),
			// 处理单复数情况
			category: z.string().optional().default(""),
			categories: z.string().or(z.array(z.string())).optional(), // 支持字符串或数组
			lang: z.string().optional().default(""),
			// abbrlink: z.number().or(z.string()).optional(), // abbrlink

			/* For internal use */
			prevTitle: z.string().default(""),
			prevSlug: z.string().default(""),
			nextTitle: z.string().default(""),
			nextSlug: z.string().default(""),
		})
		.transform((data) => {
			const finalImage = data.image || data.cover || "";
			// 处理分类数据（兼容单复数）
			let finalCategory = data.category || "";

			if (data.categories) {
				// 如果categories是数组，取第一个元素
				if (Array.isArray(data.categories)) {
					finalCategory = data.categories[0] || finalCategory;
				}
				// 如果categories是字符串
				else if (typeof data.categories === "string") {
					finalCategory = data.categories || finalCategory;
				}
			}

			return {
				...data,
				published: data.published ?? data.date,
				image: finalImage,
				category: finalCategory,
				// 移除categories字段，避免混淆
				categories: undefined,
			};
		}),
});

export const collections = {
	posts: postsCollection,
};
