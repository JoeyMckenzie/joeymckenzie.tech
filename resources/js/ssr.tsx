import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";

const appName = import.meta.env.VITE_APP_NAME ?? "joeymckenzie.tech";

createServer(
    async (page) =>
        await createInertiaApp({
            page,
            render: ReactDOMServer.renderToString,
            title: (title) => `${title} - ${appName}`,
            resolve: async (name) =>
                await resolvePageComponent(
                    `./Pages/${name}.tsx`,
                    import.meta.glob("./Pages/**/*.tsx"),
                ),
            setup: ({ App, props }) => <App {...props} />,
        }),
);
