import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// `text-*` is ambiguous: Tailwind resolves it against both the font-size scale
// and the colour scale, and tailwind-merge cannot tell which a project-defined
// name belongs to. It guesses colour, so `cn("text-primary-foreground",
// "text-label")` dropped the colour and left the active tag badge rendering
// near-white on amber at 1.6:1. Naming the custom font sizes here puts them in
// the right group, so a size and a colour can coexist on one element.
//
// These three are the `--text-*` tokens declared in `app/globals.css`. A new
// one has to be added here too.
const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            "font-size": [{ text: ["display", "title", "label"] }],
        },
    },
});

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
