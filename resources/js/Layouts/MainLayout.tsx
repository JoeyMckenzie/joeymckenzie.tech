import Footer from "@/Components/Footer";
import { Navbar } from "@/Components/Navbar";
import { ThemeProvider } from "@/Components/ThemeProvider";
import * as React from "react";

export default function MainLayout({
    children,
}: {
    children: React.JSX.Element;
}): React.JSX.Element {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="mx-auto my-auto max-w-screen-2xl px-4 lg:px-8">
                <Navbar />
                {children}
                <Footer />
            </div>
        </ThemeProvider>
    );
}
