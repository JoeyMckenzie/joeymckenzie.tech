'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { IconBaseProps } from 'react-icons';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiDownload, FiExternalLink } from 'react-icons/fi';

const socials = [
  {
    href: 'https://github.com/joeymckenzie',
    icon: (props: IconBaseProps) => <FaGithub {...props} />,
    display: 'GitHub',
    external: (props: IconBaseProps) => <FiExternalLink {...props} />,
  },
  {
    href: 'https://linkedin.com/in/JoeyMcKenzie',
    icon: (props: IconBaseProps) => <FaLinkedin {...props} />,
    display: 'LinkedIn',
    external: (props: IconBaseProps) => <FiExternalLink {...props} />,
  },
  {
    href: 'https://x.com/_joeyMcKenzie',
    icon: (props: IconBaseProps) => <FaTwitter {...props} />,
    display: 'Twitter',
    external: (props: IconBaseProps) => <FiExternalLink {...props} />,
  },
  {
    href: 'https://resume.joeymckenzie.tech/JoeyMcKenzie_resume.pdf',
    icon: (props: IconBaseProps) => <BsFillPersonLinesFill {...props} />,
    display: 'Resume',
    external: (props: IconBaseProps) => (
      <FiDownload download="resume" {...props} />
    ),
  },
];

export function SocialsButtons() {
  return (
    <NavigationMenu className="mx-auto py-8">
      <NavigationMenuList className="grid grid-cols-2 gap-x-2 gap-y-2 sm:grid-cols-4">
        {socials.map((social, index) => (
          <NavigationMenuItem key={`social-${index}`}>
            <NavigationMenuLink
              href={social.href}
              className={navigationMenuTriggerStyle()}
            >
              <span className="flex flex-row items-center justify-center gap-x-2">
                <social.icon className="h-4 w-4" />
                {social.display}
                <social.external className="h-4 w-4" />
              </span>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
