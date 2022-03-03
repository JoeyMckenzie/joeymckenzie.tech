import { fromFetch } from 'rxjs/fetch';
import { catchError, EMPTY, filter, forkJoin, map, timeout } from 'rxjs';
import { GitHubMeta, GitHubReposApiResponse } from '@/lib/types/github.types';

const TIMEOUT = 5000;
const API_BASE_URL = 'https://api.github.com/repos/joeymckenzie';
const PROJECT_REPOS = [
  'BlazorConduit',
  'StateManagementWithFluxor',
  'Dappery',
  'realworld-dotnet-clean-architecture',
  'realworld-fullstack-go-nextjs',
  'nextjs-typescript-tailwind-template',
];

export function getProjectRepos() {
  const repoRequests = PROJECT_REPOS.map((repo) =>
    getRepo(repo).pipe(
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

  return forkJoin(repoRequests);
}

export function getRepo(name: string) {
  return fromFetch<GitHubReposApiResponse>(`${API_BASE_URL}/${name}`, {
    method: 'GET',
    headers: {
      Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
    selector: (response) => response.json(),
  }).pipe(
    timeout(TIMEOUT),
    catchError((error) => {
      console.error(error);
      return EMPTY;
    })
  );
}
