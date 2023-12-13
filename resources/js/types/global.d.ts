import { type AxiosInstance } from "axios";
import type ziggyRoute from "ziggy-js";
import { type Config as ZiggyConfig } from "ziggy-js";

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    // biome-ignore lint/style/noVar: SSR server errors for some reason, I'll fix it eventually...
    var route: typeof ziggyRoute;
    // biome-ignore lint/style/noVar: SSR server errors for some reason, I'll fix it eventually...
    var Ziggy: ZiggyConfig;
}
