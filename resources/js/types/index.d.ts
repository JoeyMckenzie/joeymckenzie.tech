export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
};

export type NowPlaying = {
    nowPlaying: boolean;
    albumImageSrc?: string;
    artist?: string;
    href?: string;
    trackTitle?: string;
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    commit: string;
    laravelVersion: string;
    phpVersion: string;
    spotify?: NowPlaying;
    auth: {
        user: User;
    };
};
