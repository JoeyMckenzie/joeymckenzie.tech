import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';

const figtree = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'joeymckenzie.tech',
  description: 'A blog about software, technology, and sometimes beer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${figtree.className} h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="mx-auto my-auto max-w-screen-2xl px-6 lg:px-8">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
