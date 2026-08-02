import { usePage } from '@inertiajs/react';

import { AppLogoIcon } from '@/components/app-logo-icon';

export function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md border border-hairline bg-canvas text-iris">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-display text-base leading-tight font-medium tracking-tight text-prose">
                    {name}
                </span>
            </div>
        </>
    );
}
