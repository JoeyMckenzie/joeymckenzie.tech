import Navbar from './+Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="bg-white dark:bg-stone-900">
        <Navbar />
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
      </body>
    </html>
  );
}
