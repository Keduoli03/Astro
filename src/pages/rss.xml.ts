import { siteConfig } from "@/config";
import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

const parser = new MarkdownIt();

export async function GET(context: APIContext) {
	const blog = await getSortedPosts();

	return rss({
		stylesheet: "/rss.xsl", // 确保启用XSLT
		title: siteConfig.title,
		description: siteConfig.subtitle || "No description",
		site: context.site ?? "https://www.blueke.top",
		items: blog.map((post) => {
			const content =
				typeof post.body === "string" ? post.body : String(post.body || "");

			return {
				title: post.data.title,
				pubDate: post.data.published,
				description: post.data.description || "",
				link: `/posts/${post.slug}/`,
				content: sanitizeHtml(parser.render(content), {
					allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
				}),
				categories: post.data.tags ?? [],
			};
		}),
		customData: `<language>${siteConfig.lang}</language>`,
	});
}
