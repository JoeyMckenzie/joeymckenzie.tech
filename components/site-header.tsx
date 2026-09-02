import Link from "next/link";

import { SocialLinks } from "@/components/social-links";
import { Button } from "@/components/ui/button";
import { nav } from "@/lib/site";

export function SiteHeader() {
    return (
        <header className="border-b">
            <nav className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-0.5">
                    {nav.map((item) => (
                        <Button
                            key={item.href}
                            variant="ghost"
                            size="sm"
                            className="font-mono"
                            render={<Link href={item.href} />}
                            nativeButton={false}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
                <SocialLinks size={16} className="max-sm:hidden" />
            </nav>
        </header>
    );
}
