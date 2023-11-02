import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { getSpotifyNowPlaying } from '@/lib/spotify';
import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';

const figtree = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'joeymckenzie.tech',
  description: 'A blog about software, technology, and sometimes beer.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nowPlaying = await getSpotifyNowPlaying();

  return (
    <html lang="en" className="dark">
      <body className={figtree.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="mx-auto max-w-screen-2xl px-6 lg:px-8">
            {children}
          </div>
          <Footer nowPlaying={nowPlaying} />
        </ThemeProvider>
      </body>
    </html>
  );
}
