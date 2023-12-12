import DesktopMenu from "@/Components/DesktopMenu";
import { ThemeToggle } from "@/Components/ThemeToggle";
import * as React from "react";

type NavLinkProps = {
    name: string;
    display: string;
};

export const links: NavLinkProps[] = [
    {
        display: "Home",
        name: "home",
    },
    {
        display: "Now",
        name: "now",
    },
    {
        display: "Blog",
        name: "blogs",
    },
];

export function Navbar(): React.JSX.Element {
    return (
        <header>
            <nav className="flex flex-row items-center justify-center gap-x-2 px-6 py-8">
                <DesktopMenu />
                <ThemeToggle />
            </nav>
        </header>
    );
}
