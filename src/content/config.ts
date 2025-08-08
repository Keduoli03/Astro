import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z
		.object({
			title: z.string(),
			description: z.string().optional().default(""),
			published: z.coerce.date().optional(),
			updated: z.coerce.date().optional(),
			draft: z.boolean().optional().default(false),
			// 添加置顶字段
			pinned: z.boolean().optional().default(false),
			tags: z
				.union([z.string().transform((val) => [val]), z.array(z.string())])
				.optional()
				.default([]),
			category: z.string().optional().default(""),
			lang: z.string().optional().default(""),
			series: z.string().optional(),
			// 内部使用字段保留
			prevTitle: z.string().default(""),
			prevSlug: z.string().default(""),
			nextTitle: z.string().default(""),
			nextSlug: z.string().default(""),
			// 你实际使用的字段
			date: z.coerce.date().optional(),
			cover: z.string().nullable().optional(),
			categories: z.string().or(z.array(z.string())).optional(),
			status: z.string().optional(),
			slug: z
				.union([z.string(), z.number().transform((num) => String(num))])
				.optional()
				.default(""),
		})
		.transform((data) => {
			// 处理分类逻辑
			let finalCategory = data.category || "";
			if (data.categories) {
				finalCategory = Array.isArray(data.categories)
					? data.categories[0] || finalCategory
					: data.categories || finalCategory;
			}

			return {
				...data,
				published: data.published ?? data.date ?? new Date(),
				// 统一使用cover作为图片字段
				image: data.cover,
				category: finalCategory,
				// 清理不需要的字段
				categories: undefined,
			};
		}),
});
const specCollection = defineCollection({
	schema: z.object({}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
