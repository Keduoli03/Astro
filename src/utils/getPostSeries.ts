import { getCollection } from "astro:content";
import type { BlogPostData } from "@/types/config";

export async function getPostSeries(
	seriesName: string,
): Promise<{ body: string; data: BlogPostData; slug: string }[]> {
	const posts = (await getCollection("posts", ({ data }) => {
		return (
			(import.meta.env.PROD ? data.draft !== true : true) &&
			data.series === seriesName
		);
	})) as unknown as { body: string; data: BlogPostData; slug: string }[];

	posts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? 1 : -1;
	});

	return posts;
}
