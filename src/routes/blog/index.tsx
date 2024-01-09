import { cache, createAsync } from "@solidjs/router";
import { createEffect } from "solid-js";
import { getPostPreviews } from "~/lib/loaders";

const loadPosts = cache(async () => {
	"use server";
	return await getPostPreviews();
}, "posts");

export const route = {
	load: () => loadPosts(),
};

export default function Blog() {
	const posts = createAsync(loadPosts);

	createEffect(() => console.log("posts", posts()));

	return <h1>hello</h1>;
}
