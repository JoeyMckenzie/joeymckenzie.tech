import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import * as React from "react";
import { hydrateRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME ?? "joeymckenzie.tech";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) =>
        await resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        hydrateRoot(el, <App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
})
    .then(() => {
        console.log("inertia successfully initialized!");
    })
    .catch(console.error);
