import { fromFetch } from 'rxjs/fetch';
import { catchError, EMPTY, filter, firstValueFrom, forkJoin, map } from 'rxjs';
import { GitHubMeta, GitHubReposApiResponse } from '@/lib/types/github.types';

const API_BASE_URL = 'https://api.github.com/repos/joeymckenzie';
const PROJECT_REPOS = [
  'BlazorConduit',
  'StateManagementWithFluxor',
  'Dappery',
  'realworld-dotnet-clean-architecture',
  'realworld-go-kit',
  'nextjs-typescript-tailwind-template',
];

export function getProjectRepos() {
  const repoRequests = PROJECT_REPOS.map((repo) =>
    fromFetch<GitHubReposApiResponse>(`${API_BASE_URL}/${repo}`, {
      method: 'GET',
      headers: {
        Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      selector: (response) => response.json(),
    }).pipe(
      catchError((error) => {
        console.error(error);
        return EMPTY;
      }),
      filter((repo) => !!repo),
      map(
        (repo) =>
          ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language,
            openIssues: repo.open_issues_count,
            stars: repo.stargazers_count,
            forks: repo.forks,
            issuesLink: `https://github.com/JoeyMckenzie/${repo.name}/issues/new`,
          } as GitHubMeta)
      )
    )
  );

  return firstValueFrom(forkJoin(repoRequests));
}
