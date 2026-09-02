import { SocialLinks } from "@/components/social-links";
import { site } from "@/lib/site";

export function SiteFooter() {
    return (
        <footer className="mt-20 border-t">
            <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 px-4 py-8">
                <p className="text-muted-foreground font-mono text-xs">
                    &copy; {new Date().getFullYear()} {site.author}
                    <span className="px-1.5 opacity-50" aria-hidden="true">
                        &middot;
                    </span>
                    <a href="/rss.xml" className="hover:text-foreground">
                        rss
                    </a>
                </p>
                <SocialLinks size={16} />
            </div>
        </footer>
    );
}
