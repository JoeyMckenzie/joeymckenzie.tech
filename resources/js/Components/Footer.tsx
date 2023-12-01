import * as React from 'react';
import PoweredBy from '@/Components/PoweredBy';
import SocialIcons from '@/Components/SocialIcons';
import { Icon } from '@iconify/react';
import SpotifyTracker from '@/Components/SpotifyTracker';

export default function Footer(): React.JSX.Element {
    return (
        <div className="max-w-screen-4xl mx-auto mt-auto flex w-full flex-col items-center justify-evenly gap-y-8 p-12 sm:flex-row sm:items-end">
            <SocialIcons />
            <SpotifyTracker>
                <Icon className="h-6 w-6" icon="logos:spotify-icon" />
            </SpotifyTracker>
            <PoweredBy />
        </div>
    );
}
