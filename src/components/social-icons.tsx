import { IconBaseProps } from "react-icons";
import { FaGithub, FaLinkedin, FaTwitch, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const socials = [
  {
    href: "https://twitter.com/_joeyMcKenzie",
    display: "Twitter",
    icon: (props: IconBaseProps) => <FaXTwitter {...props} />,
  },
  {
    href: "https://github.com/JoeyMcKenzie",
    display: "GitHub",
    icon: (props: IconBaseProps) => <FaGithub {...props} />,
  },
  {
    href: "https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#",
    display: "YouTube",
    icon: (props: IconBaseProps) => <FaYoutube {...props} />,
  },
  {
    href: "https://twitch.tv/JoeTheDevMan",
    display: "Twitch",
    icon: (props: IconBaseProps) => <FaTwitch {...props} />,
  },
  {
    href: "https://linkedin.com/in/JoeyMcKenzie",
    display: "LinkedIn",
    icon: (props: IconBaseProps) => <FaLinkedin {...props} />,
  },
];

export function SocialIcons() {
  return (
    <div className="flex justify-center space-x-4">
      {socials.map((social) => (
        <a key={social.display} href={social.href}>
          <span className="sr-only">{social.display}</span>
          <social.icon className="h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" />
        </a>
      ))}
    </div>
  );
}
