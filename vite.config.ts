import { defineConfig } from "@solidjs/start/config";
import { fileURLToPath } from "url";

export default defineConfig({
	assetsInclude: ["**/*.md"],
	server: {
		fs: {
			strict: false,
		},
	},
	resolve: {
		alias: [
			{
				find: "contentlayer/generated",
				replacement: fileURLToPath(
					new URL("./.contentlayer/generated", import.meta.url),
				),
			},
		],
	},
	envFile: true,
});
