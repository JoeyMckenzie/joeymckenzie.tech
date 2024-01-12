import type { IconBaseProps } from "react-icons";
import { SiNextdotjs, SiTurso, SiVercel } from "react-icons/si";

function ContentLayerIcon(props: IconBaseProps) {
  return (
    <svg
      {...props}
      width="22"
      height="24"
      viewBox="0 0 22 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Contentlayer.dev</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.43 0.92268C11.1426 0.398115 12.1177 0.407491 12.82 0.945665L19.9928 6.44198C21.0266 7.23419 21.0266 8.78771 19.9928 9.57992L17.2573 11.6761L20.0379 13.9037C21.0493 14.7139 21.022 16.2574 19.9826 17.0315L12.62 22.5153C11.8634 23.0788 10.8134 23.0332 10.1089 22.4063L4.34789 17.2802L3.54224 16.5903C-0.0530112 13.5114 0.390183 7.84094 4.41274 5.35212L10.43 0.92268ZM16.1955 10.8254L12.8515 8.14659C12.1375 7.57457 11.1235 7.56365 10.3972 8.12017L7.92298 10.0161C6.88913 10.8084 6.88913 12.3619 7.92298 13.1541L10.4154 15.064C11.129 15.6108 12.1224 15.6108 12.836 15.064L16.1773 12.5036L19.2086 14.932C19.5457 15.2021 19.5366 15.7166 19.1901 15.9747L11.8275 21.4585C11.5753 21.6463 11.2253 21.6311 10.9905 21.4221L5.2248 16.2918L4.40495 15.5895C1.48255 13.0869 1.84941 8.47338 5.13088 6.46078L5.15471 6.44617L11.2165 1.98398C11.454 1.80913 11.779 1.81225 12.0132 1.99164L19.1859 7.48796C19.5305 7.75203 19.5305 8.26987 19.1859 8.53394L16.1955 10.8254ZM15.1155 11.653L12.0291 14.018C11.7913 14.2003 11.4601 14.2003 11.2223 14.018L8.72984 12.1081C8.38523 11.844 8.38523 11.3262 8.72984 11.0621L11.2041 9.16615C11.4462 8.98065 11.7842 8.98429 12.0222 9.17496L15.1155 11.653Z"
        fill="#7C3AED"
        stroke="#7C3AED"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function DrizzleIcon(props: IconBaseProps) {
  return (
    <svg
      className="p-1"
      {...props}
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Drizzle ORM</title>
      <rect
        width="9.63139"
        height="40.8516"
        rx="4.8157"
        transform="matrix(0.873028 0.48767 -0.497212 0.867629 43.4805 67.3037)"
        fill="currentColor"
      />
      <rect
        width="9.63139"
        height="40.8516"
        rx="4.8157"
        transform="matrix(0.873028 0.48767 -0.497212 0.867629 76.9395 46.5342)"
        fill="currentColor"
      />
      <rect
        width="9.63139"
        height="40.8516"
        rx="4.8157"
        transform="matrix(0.873028 0.48767 -0.497212 0.867629 128.424 46.5352)"
        fill="currentColor"
      />
      <rect
        width="9.63139"
        height="40.8516"
        rx="4.8157"
        transform="matrix(0.873028 0.48767 -0.497212 0.867629 94.957 67.3037)"
        fill="currentColor"
      />
    </svg>
  );
}

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
  {
    display: "Turso",
    href: "https://turso.tech",
    icon: (props: IconBaseProps) => <SiTurso {...props} />,
  },
  // {
  //   display: "Contentlayer",
  //   href: "https://contentlayer.dev",
  //   icon: (props: IconBaseProps) => <ContentLayerIcon {...props} />,
  // },
  // {
  //   display: "Drizzle",
  //   href: "https://orm.drizzle.team/",
  //   icon: (props: IconBaseProps) => <DrizzleIcon {...props} />,
  // },
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
          <provider.icon className="h-5 w-5 text-neutral-900 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 dark:text-neutral-100" />
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
