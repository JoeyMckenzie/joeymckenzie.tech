import typography from "@tailwindcss/typography";
import daisy from "daisyui";
import { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default ({
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		fontFamily: {
			sans: ["Figtree", ...defaultTheme.fontFamily.sans],
		},
	},
	daisyui: {
		themes: ["light", "dark", "forest"],
	},
	plugins: [typography, daisy],
} satisfies Config);
