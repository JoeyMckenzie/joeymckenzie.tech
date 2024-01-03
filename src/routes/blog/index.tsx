import { cache, createAsync } from "@solidjs/router";
import { createEffect } from "solid-js";
import { getViewCounts } from "~/lib/db";

const getBlogViewCounts = cache(async () => {
	"use server";
	return await getViewCounts();
}, "viewCounts");

export const route = {
	load: () => getBlogViewCounts(),
};

export default function Blog() {
	const viewCounts = createAsync(getBlogViewCounts);

	createEffect(() => console.log("viewCounts", viewCounts()));

	return <h1>hello</h1>;
}
