import type { APIRoute } from "astro";
import { getSortedPosts } from "@/utils/content-utils";
import { getPostUrlBySlug } from "@/utils/url-utils";

export const GET: APIRoute = async () => {
	try {
		const posts = await getSortedPosts();

		const postsData = posts.map((post) => ({
			slug: post.slug,
			title: post.data.title,
			series: post.data.series,
			published: post.data.published,
			url: getPostUrlBySlug(post.slug),
		}));

		return new Response(JSON.stringify(postsData), {
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
