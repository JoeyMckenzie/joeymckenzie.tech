import { r, j as e, d as g, q as h, a as p } from "./app-754fd55e.js";
import { B as f } from "./BlogPreviews-2baf582e.js";
import {
  c as u,
  a as o,
  b as j,
  B as c,
  I as i,
  M as y,
} from "./MainLayout-6cb07c7b.js";
import "./badge-87f87642.js"; /**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const w = u("Terminal", [
    ["polyline", { points: "4 17 10 11 4 5", key: "akl6gq" }],
    ["line", { x1: "12", x2: "20", y1: "19", y2: "19", key: "q2wloq" }],
  ]),
  b = j(
    "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
    {
      variants: {
        variant: {
          default: "bg-background text-foreground",
          destructive:
            "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        },
      },
      defaultVariants: { variant: "default" },
    },
  ),
  d = r.forwardRef(({ className: t, variant: a, ...s }, n) =>
    e.jsx("div", {
      ref: n,
      role: "alert",
      className: o(b({ variant: a }), t),
      ...s,
    }),
  );
d.displayName = "Alert";
const m = r.forwardRef(({ className: t, ...a }, s) =>
  e.jsx("h5", {
    ref: s,
    className: o("mb-1 font-medium leading-none tracking-tight", t),
    ...a,
  }),
);
m.displayName = "AlertTitle";
const x = r.forwardRef(({ className: t, ...a }, s) =>
  e.jsx("div", {
    ref: s,
    className: o("text-sm [&_p]:leading-relaxed", t),
    ...a,
  }),
);
x.displayName = "AlertDescription";
function v({ title: t, description: a }) {
  return e.jsxs(
    d,
    {
      children: [
        e.jsx(w, { className: "h-4 w-4" }),
        e.jsx(m, { className: "font-bold", children: t }),
        e.jsx(x, { children: a }),
      ],
    },
    "title",
  );
}
function N({ notes: t }) {
  return e.jsxs("div", {
    className: "pb-4 sm:pb-16",
    children: [
      e.jsx("h2", {
        className:
          "pb-4 pt-8 text-left text-4xl font-bold tracking-tight sm:text-center",
        children: "Note to self.",
      }),
      e.jsx("div", {
        className:
          "mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3",
        children: t.map(({ title: a, description: s }, n) =>
          e.jsx(v, { title: a, description: s }, `note-${n}`),
        ),
      }),
    ],
  });
}
const k = [
  {
    href: "https://github.com/joeymckenzie",
    icon: "mdi:github",
    display: "GitHub",
    external: "gg:external",
  },
  {
    href: "https://linkedin.com/in/JoeyMcKenzie",
    icon: "mdi:linkedin",
    display: "LinkedIn",
    external: "gg:external",
  },
  {
    href: "https://x.com/_joeyMcKenzie",
    icon: "mdi:twitter",
    display: "Twitter",
    external: "gg:external",
  },
  {
    href: "https://resume.joeymckenzie.tech/JoeyMcKenzie_resume.pdf",
    icon: "carbon:identification",
    display: "Specs",
    external: "material-symbols:download-sharp",
    download: !0,
  },
];
function z() {
  return e.jsx("div", {
    className:
      "mx-auto grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4 py-8 sm:grid-cols-4",
    children: k.map(
      ({ display: t, href: a, icon: s, external: n, download: l = !1 }) =>
        e.jsxs(
          "div",
          {
            children: [
              !l &&
                e.jsx(g, {
                  href: a,
                  children: e.jsxs(c, {
                    className: "flex w-full flex-row gap-x-2",
                    variant: "outline",
                    children: [
                      e.jsx(i, { icon: s, className: "h-5 w-5" }),
                      t,
                      e.jsx(i, { icon: n, className: "h-5 w-5" }),
                    ],
                  }),
                }),
              l &&
                e.jsx("a", {
                  href: "https://resume.joeymckenzie.tech/JoeyMcKenzie_resume.pdf",
                  download: "JoeyMcKenzie_resume.pdf",
                  children: e.jsxs(c, {
                    className: "flex w-full flex-row gap-x-2",
                    variant: "outline",
                    children: [
                      e.jsx(i, { icon: s, className: "h-5 w-5" }),
                      t,
                      e.jsx(i, { icon: n, className: "h-5 w-5" }),
                    ],
                  }),
                }),
            ],
          },
          s,
        ),
    ),
  });
}
function T({ frontMatters: t }) {
  const s = h().props.notes ?? [];
  return e.jsxs(e.Fragment, {
    children: [
      e.jsxs(p, {
        children: [
          e.jsx("title", {
            children: "Bears. Beets. Battlestar Galactiga. | joeymckenzie.tech",
          }),
          e.jsx("meta", {
            content:
              "A blog about software, technology, and sometimes beer. Mostly beer.",
            name: "description",
          }),
          e.jsx("meta", {
            content: "software, programming, technology",
            name: "keywords",
          }),
        ],
      }),
      e.jsx(y, {
        children: e.jsxs(e.Fragment, {
          children: [
            e.jsx("h2", {
              className: "text-4xl font-bold tracking-tight sm:text-center",
              children: "Hi, I'm Joey.",
            }),
            e.jsxs("p", {
              className:
                "prose mx-auto mt-6 text-justify leading-6 dark:prose-invert",
              children: [
                "I'm a",
                " ",
                e.jsx("span", {
                  className: "font-semibold",
                  children: "Senior Software Engineer",
                }),
                " ",
                "based in Northern California working in fintech. I enjoy writing about software, design, dad jokes, and cheap beer among a few other things. I like building fast, efficient web services, learning new things, and writing code in the open source ecosystem.",
              ],
            }),
            e.jsx(z, {}),
            e.jsx("h2", {
              className:
                "pb-4 pt-8 text-right text-4xl font-bold tracking-tight sm:text-center",
              children: "Latest thoughts.",
            }),
            e.jsx(f, { frontMatters: t }),
            e.jsx(N, { notes: s }),
          ],
        }),
      }),
    ],
  });
}
export { T as default };
