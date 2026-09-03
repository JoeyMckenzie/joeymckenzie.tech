import { SocialLinks } from "@/components/social-links";
import { site } from "@/lib/site";

export function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 px-4 py-10">
                <p className="text-muted-foreground text-label tracking-label font-mono uppercase">
                    &copy; {new Date().getFullYear()} {site.author}
                    <span className="px-2 opacity-40" aria-hidden="true">
                        /
                    </span>
                    <a
                        href="/rss.xml"
                        className="hover:text-primary transition-colors duration-200"
                    >
                        rss
                    </a>
                </p>
                <SocialLinks size={16} />
            </div>
        </footer>
    );
}
