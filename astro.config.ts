import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import { defineConfig, fontProviders } from "astro/config"

const appHost = process.env.APP_HOST ?? "joeymckenzie.tech.test"
const vitePort = Number(process.env.VITE_PORT ?? 4321)

export default defineConfig({
    site: "https://joeymckenzie.tech",
    integrations: [mdx(), sitemap()],
    server: {
        host: "127.0.0.1",
        port: vitePort,
        allowedHosts: [appHost],
    },
    markdown: {
        shikiConfig: {
            themes: {
                light: "catppuccin-latte",
                dark: "tokyo-night",
            },
            wrap: false,
        },
    },
    fonts: [
        {
            provider: fontProviders.google(),
            name: "Geist",
            cssVariable: "--font-body",
            weights: [400, 500, 600],
            styles: ["normal"],
            subsets: ["latin"],
            fallbacks: ["system-ui", "sans-serif"],
            display: "swap",
        },
        {
            provider: fontProviders.google(),
            name: "JetBrains Mono",
            cssVariable: "--font-mono",
            // 700 is for headings, which now belong to the mono face -- 500
            // reads weak at display sizes.
            weights: [400, 500, 700],
            styles: ["normal"],
            subsets: ["latin"],
            fallbacks: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
            display: "swap",
        },
    ],
})
