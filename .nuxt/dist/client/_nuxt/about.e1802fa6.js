import { u as r, _ as c } from './SectionHeader.vue.6eb24204.js';
import { _ as d } from './_plugin-vue_export-helper.c27b6911.js';
import { o as t, c as o, f as l, g as m, b as e } from './entry.f0151a78.js';
import './HtmlTag.vue.10b495f0.js';
const g = {},
  h = {
    class:
      'prose mx-auto flex max-w-2xl flex-col text-justify text-sm leading-6 text-neutral-400',
  },
  f = l(
    '<p class="mt-6"> I&#39;m Joey. I&#39;ve got a passion for the web and developing services and applications with performance in mind. I&#39;ve spent nearly a decade working on technologies across the stack, from Java, IBM, .NET, and most of the major web frontend frameworks you&#39;ll see folks arguing about over on <a class="text-indigo-400 hover:text-indigo-500" href="https://reddit.com/r/webdev">r/webdev</a>. </p><p> By day, I&#39;m a Senior Software Engineer working on mostly .NET technologies in the web space. I&#39;ve worked professionally as a developer in healthcare, insurance, SaaS startups, manufacturing, and now finance. I enjoy building fast and efficient web services, exploring new technologies, and arguing with other developers about the value of pre-commit hooks when used wisely. </p><p> In my spare time, I work primarily within the TypeScript and Rust ecosystems (I&#39;m even writing a <a class="text-indigo-400 hover:text-indigo-500" href="https://fullstackrust.netlify.app/"> Rust web series!</a>), contributing to projects I find interesting and exploring new frontiers. I like to write about things I come across in the wild (of software), design, frameworks, and language features among other things. If I find the time, you can catch any of my content on <a class="text-indigo-400 hover:text-indigo-500" href="https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#"> YouTube </a> or streaming live on <a class="text-indigo-400 hover:text-indigo-500" href="https://twitch.tv/JoeTheDevMan">Twitch</a>. Checkout my <a href="/blog" class="text-indigo-400 hover:text-indigo-500"> blog</a> for things I publish that mostly deal with my questionable takes on development. </p><p> Outside of refactoring legacy code and convincing managers that estimates are not deadlines, I enjoy spending time with my wife and dog, family and friends, and sampling the latest installment of adult beverages at my local breweries. </p>',
    4,
  ),
  p = [f];
function u(n, a) {
  return t(), o('div', h, p);
}
const w = d(g, [['render', u]]),
  k = m({
    __name: 'about',
    setup(n) {
      return (
        r({
          title: 'joeymckenzie.tech',
          ogTitle: 'About | joeymckenzie.tech',
          description: 'A blog about code, software, and sometimes beer.',
          ogDescription: 'A blog about code, software, and sometimes beer.',
          ogImage: 'https://joeymckenzie.tech/favicon-32x32.png',
          twitterCard: 'summary_large_image',
        }),
        (a, _) => {
          const i = c,
            s = w;
          return t(), o('div', null, [e(i, { title: 'Bio' }), e(s)]);
        }
      );
    },
  });
export { k as default };
