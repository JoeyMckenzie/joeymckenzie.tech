import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
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
    <html lang="en" className="dark">
      <body className={`${figtree.className} mx-auto flex flex-col`}>
        <Navbar />
        <div className="container mx-auto sm:px-6 lg:px-8">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
