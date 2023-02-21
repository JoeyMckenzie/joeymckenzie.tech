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
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="bg-neutral-900">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Navbar />
          {children}
          <Footer listeningTo={listentingTo} />
        </div>
      </body>
    </html>
  );
}
