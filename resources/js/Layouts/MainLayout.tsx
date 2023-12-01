import * as React from 'react';
import { Navbar } from '@/Components/Navbar';
import { ThemeProvider } from '@/Components/ThemeProvider';

export default function MainLayout({
    children,
}: {
    children: React.JSX.Element;
}): React.JSX.Element {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="mx-auto my-auto max-w-screen-xl px-6 lg:px-8">
                <Navbar />
                {children}
            </div>
        </ThemeProvider>
    );
}
