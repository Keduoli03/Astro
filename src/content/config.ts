import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z
		.object({
			title: z.string(),
			published: z.coerce.date().optional(),
			updated: z.coerce.date().optional(),
			draft: z.boolean().optional().default(false),
			description: z.string().optional().default(""),
			image: z.string().optional().default(""),
			// tags: z.array(z.string()).optional().default([]),
			tags: z
				.union([
					z
						.string()
						.transform((val) => [val]), // 单字符串转数组
					z.array(z.string()), // 直接支持数组
				])
				.optional()
				.default([]),
			category: z.string().optional().default(""),
			lang: z.string().optional().default(""),
			series: z.string().optional(),
			/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
			// 自己加的字段
			date: z.coerce.date().optional(), // Obsidian文章创建时间
			cover: z.string().optional().catch(undefined), // 无效值直接移除，因为我有时候可能忘记封面导致值为null
			categories: z.string().or(z.array(z.string())).optional(),
			status: z.string().optional(),
			slug: z
      			.union([
        		z.string(),
        		z.number().transform((num) => String(num)), // 数字转字符串
      			]).optional() // 允许为空（如果由文件名自动生成）
      			.default(""), // 默认值为空字符串
		})
		.transform((data) => {
			// 处理分类逻辑
			let finalCategory = data.category || "";
			if (data.categories) {
				finalCategory = Array.isArray(data.categories)
					? data.categories[0] || finalCategory
					: data.categories || finalCategory;
			}

			// 自动处理封面逻辑
			const finalImage = data.image || (data.cover ? data.cover : undefined);

			return {
				...data,
				published: data.published ?? data.date,
				image: finalImage, // 只有有效值才会保留
				category: finalCategory,
				// 明确移除不需要的字段
				...(data.cover === undefined ? {} : { cover: undefined }),
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
