import Footer from './+Footer';
import Navbar from './+Navbar';
import Navlinks from './+Navlinks';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
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
        </div>
      </body>
    </html>
  );
}
