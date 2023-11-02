import { SiNextdotjs, SiVercel } from 'react-icons/si';

const commitSha = process.env.VERCEL_GIT_COMMIT_SHA ?? '';
const commitShaForDisplay = commitSha.substring(0, 6);
const commitUrl = `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${commitSha}`;

export function PoweredBy() {
  return (
    <div className="mx-auto inline-flex flex-row items-center gap-x-2 md:mx-0">
      <p className="font-ubuntu text-center text-xs leading-5">Powered by</p>
      <a href="https://nextjs.org">
        <span className="sr-only">Next.js</span>
        <SiNextdotjs className="h-4 w-4 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" />
      </a>
      <a href="https://vercel.com">
        <span className="sr-only">Vercel</span>
        <SiVercel className="h-4 w-4 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" />
      </a>
      <a href={commitUrl} className="font-ubuntu text-center text-xs leading-5">
        {commitShaForDisplay}
      </a>
    </div>
  );
}
