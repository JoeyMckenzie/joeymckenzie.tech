import { type AxiosInstance } from "axios";
import type ziggyRoute from "ziggy-js";
import { type Config as ZiggyConfig } from "ziggy-js";

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    // biome-ignore lint/style/noVar: route needs to be globally lifted
    var route: typeof ziggyRoute;

    // biome-ignore lint/style/noVar: ziggy needs to be globally lifted
    var Ziggy: ZiggyConfig;
}
