import { getCurrentlyListeningTo } from '@/lib/spotify';
import Footer from './+Footer';
import Navbar from './+Navbar';
import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const listentingTo = await getCurrentlyListeningTo();

  return (
    <html lang="en" className="h-full">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="h-full bg-neutral-900">
        <Navbar />
        <div className="mx-auto max-w-screen-md sm:px-6 lg:px-8">
          {children}
        </div>
        <Footer listeningTo={listentingTo} />
      </body>
    </html>
  );
}
