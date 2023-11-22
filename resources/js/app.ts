import './bootstrap';
import '../css/app.css';

import { createApp, DefineComponent, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy/dist/vue.m';
import * as Sentry from '@sentry/vue';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob<DefineComponent>('./Pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .use((app) =>
                Sentry.init({
                    dsn: import.meta.env.VITE_SENTRY_DSN_PUBLIC,
                    app,
                }),
            )
            .mount(el);

        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN_PUBLIC,
        });
    },
    progress: {
        color: '#4B5563',
    },
})
    .then(() => console.log('inertia successfully initialized'))
    .catch(console.error);
