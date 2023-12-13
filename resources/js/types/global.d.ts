import { type AxiosInstance } from "axios";
import type ziggyRoute from "ziggy-js";
import { type Config as ZiggyConfig } from "ziggy-js";

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    let route: typeof ziggyRoute;

    let Ziggy: ZiggyConfig;
}
