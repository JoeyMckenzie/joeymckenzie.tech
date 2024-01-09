import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Post = defineDocumentType(() => ({
	name: "Post",
	filePathPattern:
		process.env.NODE_ENV === "production" ? "*[!draft]/*.md" : "**/*.md",
	contentType: "markdown",
	fields: {
		title: { type: "string", required: true },
		description: { type: "string", required: true },
		pubDate: { type: "date", required: true },
		category: { type: "string", required: true },
		heroImage: { type: "string", required: true },
		draft: { type: "boolean", required: false, default: false },
		keywords: { type: "list", of: { type: "string" }, required: true },
	},
	computedFields: {
		url: {
			type: "string",
			resolve: (post) => `/blog/${post._raw.flattenedPath}`,
		},
	},
}));

export default makeSource({
	contentDirPath: "./content",
	documentTypes: [Post],
	// markdown: {
	// 	rehypePlugins: [
	// 		rehypeHighlight,
	// 		[
	// 			rehypePrettyCode,
	// 			{
	// 				theme: "one-dark-pro",
	// 			},
	// 		],
	// 	],
	// },
});
