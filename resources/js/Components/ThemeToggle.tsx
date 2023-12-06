import * as React from 'react';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { type Theme, useTheme } from '@/Components/ThemeProvider';

const themes: Theme[] = ['light', 'dark', 'system'];

export function ThemeToggle(): React.JSX.Element {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="flex flex-col items-center"
            >
                {themes.map((theme) => (
                    <DropdownMenuItem
                        key={theme}
                        className="flex w-full justify-center"
                        onClick={() => {
                            setTheme(theme);
                        }}
                    >
                        {theme.replace(/\b\w/g, (t) => t.toUpperCase())}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
