// @ts-check

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
    fonts: [
        {
            provider: fontProviders.local(),
            name: "Atkinson",
            cssVariable: "--font-atkinson",
            fallbacks: ["sans-serif"],
            options: {
                variants: [
                    {
                        src: ["./src/assets/fonts/atkinson-regular.woff"],
                        weight: 400,
                        style: "normal",
                        display: "swap",
                    },
                    {
                        src: ["./src/assets/fonts/atkinson-bold.woff"],
                        weight: 700,
                        style: "normal",
                        display: "swap",
                    },
                ],
            },
        },
    ],
})
