import { cache, createAsync } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { getSpotifyNowPlaying } from "~/lib/spotify";

const getSpotifyTracking = cache(async () => {
	"use server";
	return await getSpotifyNowPlaying();
}, "spotify");

export const route = {
	load: () => getSpotifyTracking(),
};

export default function Counter() {
	const spotify = createAsync(getSpotifyTracking);
	const [count, setCount] = createSignal(0);

	createEffect(() => console.log("spotify", spotify()));

	return (
		<button
			type="button"
			class="w-[200px] rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
			onClick={() => setCount(count() + 1)}
		>
			Clicks: {count()}
		</button>
	);
}
