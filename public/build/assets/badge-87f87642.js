import { j as o } from "./app-754fd55e.js";
import { a as n, b as a } from "./MainLayout-6cb07c7b.js";
const s = a(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
function u({ className: r, variant: e, ...t }) {
  return o.jsx("div", { className: n(s({ variant: e }), r), ...t });
}
export { u as B };
