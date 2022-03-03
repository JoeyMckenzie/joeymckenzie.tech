import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useContext, useEffect } from 'react';
import frontMatters from '@/public/frontmatters.json';
import { BlogSearchContext } from '@/lib/contexts/blog-search.context';
import CodeSnippets from '@/components/CodeSnippets';
import BlogPreviewContainer from '@/components/BlogPreviewContainer';
import ContactForm from '@/components/ContactForm';
import Intro from '@/components/Intro';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  EMPTY,
  firstValueFrom,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
  timeout,
} from 'rxjs';
import { GitHubApiResponse } from '@/lib/types/github.types';

interface IndexProps {
  githubMeta: GitHubApiResponse[];
}

/*export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  const githubApiResponse = await firstValueFrom(
    fromFetch('https://api.github.com/users/joeymckenzie/repos', {
      method: 'GET',
      headers: {
        Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    }).pipe(
      take(1),
      timeout(3000),
      shareReplay(1),
      switchMap((response) => response.json()),
      map((data) => data as GitHubApiResponse[]),
      catchError((error) => {
        console.error(error);
        return EMPTY;
      })
    )
  );

  return {
    props: {
      githubMeta: githubApiResponse,
    },
  };
};*/

const Index: NextPage<IndexProps> = ({ githubMeta }) => {
  const { setFrontMatters } = useContext(BlogSearchContext);

  // useEffect(() => console.log(githubMeta), [githubMeta]);

  useEffect(
    () => setFrontMatters(frontMatters.frontMatters),
    [setFrontMatters]
  );

  return (
    <>
      <Head>
        <title>joeymckenzie.tech</title>
        <meta title="joeymckenzie.tech" />
      </Head>
      <Intro />
      <BlogPreviewContainer />
      <CodeSnippets />
      <ContactForm />
    </>
  );
};

export default Index;
