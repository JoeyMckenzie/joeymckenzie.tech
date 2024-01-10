import { j as e, a as t, d as n } from "./app-754fd55e.js";
import { M as a } from "./MainLayout-6cb07c7b.js";
function i() {
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(t, { title: "Bio | joeymckenzie.tech" }),
      e.jsx(a, {
        children: e.jsxs("div", {
          children: [
            e.jsx("h2", {
              className: "text-4xl font-bold tracking-tight sm:text-center",
              children: "Bio.",
            }),
            e.jsxs("div", {
              className:
                "prose mx-auto flex max-w-2xl flex-col text-justify leading-6 dark:prose-invert",
              children: [
                e.jsxs("p", {
                  className: "mt-6",
                  children: [
                    "I'm Joey. I've got a passion for the web and developing services and applications with performance in mind. I've spent nearly a decade working on technologies across the stack, from Java, IBM, .NET, and most of the major web frontend frameworks you'll see folks arguing about over on",
                    " ",
                    e.jsx("a", {
                      href: "https://reddit.com/r/webdev",
                      children: "r/webdev",
                    }),
                    ".",
                  ],
                }),
                e.jsx("p", {
                  children:
                    "By day, I'm a Senior Software Engineer working on mostly .NET technologies in the web space. I've worked professionally as a developer in healthcare, insurance, SaaS startups, manufacturing, and now finance. I enjoy building fast and efficient web services, exploring new technologies, and arguing with other developers about the value of pre-commit hooks when used wisely.",
                }),
                e.jsxs("p", {
                  children: [
                    "In my spare time, I like to do things with TypeScript, PHP (pause for audible gasps) and Rust (I'm even writing some cool stuff about",
                    " ",
                    e.jsx("a", {
                      href: "https://fullstackrust.netlify.app/",
                      children: "Rust!",
                    }),
                    "), contributing to projects I find interesting and exploring new frontiers. I like to write about things I come across in the wild (of software), design, frameworks, and language features among other things. If I find the time, you can catch any of my content on",
                    " ",
                    e.jsx("a", {
                      href: "https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#",
                      children: "YouTube",
                    }),
                    " ",
                    "or streaming live on",
                    " ",
                    e.jsx("a", {
                      href: "https://twitch.tv/JoeTheDevMan",
                      children: "Twitch",
                    }),
                    ". Checkout my ",
                    e.jsx(n, { href: route("blogs"), children: "blog" }),
                    " ",
                    "for things I publish that mostly deal with my questionable takes on development.",
                  ],
                }),
                e.jsx("p", {
                  children:
                    "Outside of refactoring legacy code and convincing managers that estimates are not deadlines, I enjoy spending time with my wife and dog, family and friends, and sampling the latest installment of adult beverages at my local breweries.",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
export { i as default };
