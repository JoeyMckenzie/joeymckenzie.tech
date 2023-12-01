import * as React from 'react';
import PoweredBy from '@/Components/PoweredBy';

export default function Footer(): React.JSX.Element {
    return (
        <div className="max-w-screen-4xl mx-auto mt-auto flex w-full flex-col items-center justify-evenly gap-y-8 p-12 sm:flex-row sm:items-end">
            {/* <SocialIcons />
        <SpotifyNowPlaying>
            <Icon class="h-6 w-6" icon="logos:spotify-icon" />
        </SpotifyNowPlaying> */}
            <PoweredBy />
        </div>
    );
}
