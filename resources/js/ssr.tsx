import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import route from '../../vendor/tightenco/ziggy/dist/index.m';
import { type RouteName } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME ?? 'joeymckenzie.tech';

createServer(
    async (page) =>
        await createInertiaApp({
            page,
            render: ReactDOMServer.renderToString,
            title: (title) => `${title} - ${appName}`,
            resolve: async (name) =>
                await resolvePageComponent(
                    `./Pages/${name}.tsx`,
                    import.meta.glob('./Pages/**/*.tsx'),
                ),
            setup: ({ App, props }) => {
                global.route<RouteName> = (name, params, absolute) =>
                    route(name, params, absolute, {
                        // @ts-expect-error ziggy will be defined
                        ...page.props.ziggy,
                        // @ts-expect-error ziggy will be defined
                        location: new URL(page.props.ziggy.location),
                    });

                return <App {...props} />;
            },
        }),
);
