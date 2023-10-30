import { IconBaseProps } from 'react-icons';
import {
  FaGithub,
  FaLinkedin,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

const socials = [
  {
    href: 'https://github.com/joeymckenzie',
    icon: (props: IconBaseProps) => <FaGithub {...props} />,
    display: 'GitHub',
  },
  {
    href: 'https://linkedin.com/in/JoeyMcKenzie',
    icon: (props: IconBaseProps) => <FaLinkedin {...props} />,
    display: 'LinkedIn',
  },
  {
    href: 'https://x.com/_joeyMcKenzie',
    icon: (props: IconBaseProps) => <FaTwitter {...props} />,
    display: 'Twitter',
  },
  {
    href: 'https://twitch.tv/JoeTheDevMan',
    icon: (props: IconBaseProps) => <FaTwitch {...props} />,
    display: 'Twitch',
  },
  {
    href: 'https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#',
    icon: (props: IconBaseProps) => <FaYoutube {...props} />,
    display: 'YouTube',
  },
];

export function SocialIcons() {
  return (
    <div className="flex justify-center space-x-6 md:order-2">
      {socials.map((social, index) => (
        <a
          key={`social-icons-${index}`}
          href="https://twitter.com/_joeyMcKenzie"
        >
          <span className="sr-only">{social.display}</span>
          <social.icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
