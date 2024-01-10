import { j as e, a as o } from "./app-754fd55e.js";
import { B as s } from "./BlogPreviews-2baf582e.js";
import { M as a } from "./MainLayout-6cb07c7b.js";
import "./badge-87f87642.js";
function m({ frontMatters: t }) {
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(o, { title: "Blog | joeymckenzie.tech" }),
      e.jsx(a, {
        children: e.jsxs(e.Fragment, {
          children: [
            e.jsxs("div", {
              className: "pb-12",
              children: [
                e.jsx("h2", {
                  className: "text-4xl font-bold tracking-tight sm:text-center",
                  children: "Blog.",
                }),
                e.jsxs("p", {
                  className:
                    "prose mx-auto mt-6 text-justify leading-6 dark:prose-invert",
                  children: [
                    "I write about a lot of things, mainly languages, ecosystems, and software design. I consider my writing a journal of technologies I've worked with at some point during my career, and I'm always happy to field questions and conversations from interested readers. Feel free to",
                    " ",
                    e.jsx("a", {
                      href: "mailto:joey.mckenzie27@gmail.com",
                      children: "contact",
                    }),
                    " ",
                    "me about any of the writing I do here, or to simply say hello!",
                  ],
                }),
              ],
            }),
            e.jsx(s, { frontMatters: t }),
          ],
        }),
      }),
    ],
  });
}
export { m as default };
