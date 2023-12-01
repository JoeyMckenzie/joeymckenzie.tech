import './bootstrap';
import '../css/app.css';

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME ?? 'joeymckenzie.tech';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) =>
        await resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
})
    .then(() => {
        console.log('inertia successfully initialized!');
    })
    .catch(console.error);
