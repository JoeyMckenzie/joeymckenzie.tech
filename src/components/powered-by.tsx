import type { IconBaseProps } from "react-icons";
import { SiNextdotjs, SiVercel } from "react-icons/si";

const poweredBy = [
  {
    display: "Next.js",
    href: "https://nextjs.org",
    icon: (props: IconBaseProps) => <SiNextdotjs {...props} />,
  },
  {
    display: "Vercel",
    href: "https://vercel.com",
    icon: (props: IconBaseProps) => <SiVercel {...props} />,
  },
];

export function PoweredBy(): React.JSX.Element {
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA ?? "";
  const commitShaForDisplay = commitSha.substring(0, 6);
  const commitUrl = `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${commitSha}`;

  return (
    <div className="mx-auto inline-flex flex-row items-center gap-x-2 md:mx-0">
      <p className="font-ubuntu text-center text-xs leading-5">Powered by</p>
      {poweredBy.map((provider) => (
        <a key={provider.display} href={provider.href}>
          <span className="sr-only">{provider.display}</span>
          <provider.icon className="h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" />
        </a>
      ))}

      <a
        href={commitUrl}
        className="font-ubuntu text-center text-xs leading-5 hover:underline"
      >
        {commitShaForDisplay}
      </a>
    </div>
  );
}
