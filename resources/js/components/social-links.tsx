import { SiGithub, SiX } from '@icons-pack/react-simple-icons';
import type { IconType } from '@icons-pack/react-simple-icons';
import { cn } from '@/lib/utils';

// LinkedIn is intentionally not shipped by simple-icons (removed over a trademark request), so it stays as a raw SVG path.
const LINKEDIN_PATH =
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

const LinkedInIcon = ({ className }: { className?: string }) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('fill-current', className)}
        aria-hidden="true"
    >
        <path d={LINKEDIN_PATH} />
    </svg>
);

type SocialIcon = IconType | typeof LinkedInIcon;

const socials: { label: string; href: string; Icon: SocialIcon }[] = [
    {
        label: 'GitHub',
        href: 'https://github.com/joeymckenzie',
        Icon: SiGithub,
    },
    { label: 'X', href: 'https://x.com/_joeyMcKenzie', Icon: SiX },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/joeymckenzie',
        Icon: LinkedInIcon,
    },
];

export default function SocialLinks({ className }: { className?: string }) {
    return (
        <div className={cn('flex items-center gap-3.5', className)}>
            {socials.map(({ label, href, Icon }) => (
                <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="text-subtle transition-colors hover:text-iris"
                >
                    <Icon className="size-3.5" aria-hidden="true" />
                </a>
            ))}
        </div>
    );
}
