import { IconBaseProps } from "react-icons";
import { FaExternalLinkAlt, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "./ui/button";

const socials = [
  {
    href: "https://github.com/joeymckenzie",
    display: "GitHub",
    icon: (props: IconBaseProps) => <FaGithub {...props} />,
  },
  {
    href: "https://linkedin.com/in/JoeyMcKenzie",
    display: "LinkedIn",
    icon: (props: IconBaseProps) => <FaLinkedin {...props} />,
  },
  {
    href: "https://x.com/_joeyMcKenzie",
    display: "Twitter",
    icon: (props: IconBaseProps) => <FaXTwitter {...props} />,
  },
];

export function SocialButtons() {
  return (
    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4 py-8 sm:grid-cols-3">
      {socials.map((social) => (
        <div key={social.display}>
          <a href={social.href}>
            <Button
              className="flex justify-center items-center w-full flex-row gap-x-3"
              variant="outline"
            >
              <social.icon className="h-4 w-4" />
              {social.display}
              <FaExternalLinkAlt className="h-3 w-3" />
            </Button>
          </a>
        </div>
      ))}
    </div>
  );
}
