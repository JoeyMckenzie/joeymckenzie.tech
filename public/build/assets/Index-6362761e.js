import { j as e, a as s, d as a } from "./app-754fd55e.js";
import { B as i } from "./badge-87f87642.js";
import { M as n, B as l } from "./MainLayout-6cb07c7b.js";
function o({ post: t }) {
  const r = new Date(t.published_date ?? "").toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(s, {
        title: `${t.title} | joeymckenzie.tech`,
        children: e.jsx("meta", { name: "keywords", content: t.keywords }),
      }),
      e.jsx(n, {
        children: e.jsxs("div", {
          className: "flex flex-col justify-center",
          children: [
            e.jsxs("article", {
              className:
                "prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-pre:text-sm prose-img:mx-auto prose-img:rounded-md",
              children: [
                e.jsx("h1", {
                  className: "text-center text-2xl",
                  children: t.title,
                }),
                e.jsxs("div", {
                  className:
                    "flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight",
                  children: [
                    e.jsx("time", { dateTime: t.published_date, children: r }),
                    e.jsx(i, { children: t.category }),
                    e.jsxs("p", { children: [t.views, " views"] }),
                  ],
                }),
                e.jsx("img", {
                  alt: `${t.title} blog meme`,
                  src: t.hero_image,
                  height: "400",
                  width: "500",
                }),
                e.jsx("div", {
                  dangerouslySetInnerHTML: { __html: t.parsed_content },
                }),
              ],
            }),
            e.jsx(a, {
              href: route("blogs"),
              className: "mx-auto max-w-md",
              children: e.jsx(l, {
                variant: "secondary",
                children: " Back to blogs",
              }),
            }),
          ],
        }),
      }),
    ],
  });
}
export { o as default };
