import { defineComponent, unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./MainLayout-CkkG4NM4.js";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
import "@vueuse/components";
import "@iconify/vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Now",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Now.</title>`);
          } else {
            return [
              createVNode("title", null, "Now.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="pt-12 text-center text-4xl font-semibold tracking-tight"${_scopeId}> Now. </h2><div class="prose mx-auto flex max-w-2xl flex-col leading-6 dark:prose-invert"${_scopeId}><p class="mt-6"${_scopeId}> A few things I&#39;m working on <a href="https://nownownow.com/about"${_scopeId}>now</a>: </p><ul${_scopeId}><li${_scopeId}> I&#39;m part of team modernizing fintech systems from legacy .NET applications to modern .NET microservices running on <a href="https://docs.aws.amazon.com/"${_scopeId}>AWS</a>. I spend most of time architecting serverless workloads with the likes of things like <a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-rust.html"${_scopeId}> Lambda</a>, <a href="https://www.docker.com/"${_scopeId}>Docker</a>, <a href="https://aws.amazon.com/sqs/"${_scopeId}>SQS</a>, <a href="https://aws.amazon.com/sns/"${_scopeId}>SNS</a>, and the whole lot. </li><li${_scopeId}> I&#39;m learning PHP and <a href="https://laravel.com"${_scopeId}>Laravel</a> and very unexpectedly having an absolute blast doing so. The website you&#39;re currently reading is written with Laravel and React with the help of <a href="https://inertiajs.com/"${_scopeId}>Inertia</a> served from a droplet on <a href="https://digitalocean.com/"${_scopeId}>DigitalOcean</a> - I even `);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route(
                "blog.post",
                "content-driven-websites-with-php-and-laravel"
              )
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` wrote about it `);
                } else {
                  return [
                    createTextVNode(" wrote about it ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(` on my blog! </li><li${_scopeId}> In the name of learning of PHP, I&#39;m also working on a <a href="https://packagist.org/packages/bubblehearth/bubblehearth"${_scopeId}> Composer package</a> that wraps the <a href="https://develop.battle.net/"${_scopeId}>Blizzard Game Data APIs</a> with an easy-to-use and (hopefully) elegant PHP library. </li><li${_scopeId}> I&#39;m doing <a href="https://adventofcode.com/"${_scopeId}>Advent of Code</a> this year in <a href="https://github.com/JoeyMckenzie/advent-of-code-2023"${_scopeId}> PHP</a> . Another year, another round of string split mania... </li><li${_scopeId}> I write a lot of <a href="https://www.rust-lang.org/"${_scopeId}>Rust</a> in my spare time and have contributed some small libraries and crates <a href="https://crates.io/crates/newswrap"${_scopeId}>here</a> and <a href="https://github.com/JoeyMckenzie/bubblehearth"${_scopeId}>there</a>. </li></ul></div>`);
          } else {
            return [
              createVNode("h2", { class: "pt-12 text-center text-4xl font-semibold tracking-tight" }, " Now. "),
              createVNode("div", { class: "prose mx-auto flex max-w-2xl flex-col leading-6 dark:prose-invert" }, [
                createVNode("p", { class: "mt-6" }, [
                  createTextVNode(" A few things I'm working on "),
                  createVNode("a", { href: "https://nownownow.com/about" }, "now"),
                  createTextVNode(": ")
                ]),
                createVNode("ul", null, [
                  createVNode("li", null, [
                    createTextVNode(" I'm part of team modernizing fintech systems from legacy .NET applications to modern .NET microservices running on "),
                    createVNode("a", { href: "https://docs.aws.amazon.com/" }, "AWS"),
                    createTextVNode(". I spend most of time architecting serverless workloads with the likes of things like "),
                    createVNode("a", { href: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-rust.html" }, " Lambda"),
                    createTextVNode(", "),
                    createVNode("a", { href: "https://www.docker.com/" }, "Docker"),
                    createTextVNode(", "),
                    createVNode("a", { href: "https://aws.amazon.com/sqs/" }, "SQS"),
                    createTextVNode(", "),
                    createVNode("a", { href: "https://aws.amazon.com/sns/" }, "SNS"),
                    createTextVNode(", and the whole lot. ")
                  ]),
                  createVNode("li", null, [
                    createTextVNode(" I'm learning PHP and "),
                    createVNode("a", { href: "https://laravel.com" }, "Laravel"),
                    createTextVNode(" and very unexpectedly having an absolute blast doing so. The website you're currently reading is written with Laravel and React with the help of "),
                    createVNode("a", { href: "https://inertiajs.com/" }, "Inertia"),
                    createTextVNode(" served from a droplet on "),
                    createVNode("a", { href: "https://digitalocean.com/" }, "DigitalOcean"),
                    createTextVNode(" - I even "),
                    createVNode(unref(Link), {
                      href: _ctx.route(
                        "blog.post",
                        "content-driven-websites-with-php-and-laravel"
                      )
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" wrote about it ")
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    createTextVNode(" on my blog! ")
                  ]),
                  createVNode("li", null, [
                    createTextVNode(" In the name of learning of PHP, I'm also working on a "),
                    createVNode("a", { href: "https://packagist.org/packages/bubblehearth/bubblehearth" }, " Composer package"),
                    createTextVNode(" that wraps the "),
                    createVNode("a", { href: "https://develop.battle.net/" }, "Blizzard Game Data APIs"),
                    createTextVNode(" with an easy-to-use and (hopefully) elegant PHP library. ")
                  ]),
                  createVNode("li", null, [
                    createTextVNode(" I'm doing "),
                    createVNode("a", { href: "https://adventofcode.com/" }, "Advent of Code"),
                    createTextVNode(" this year in "),
                    createVNode("a", { href: "https://github.com/JoeyMckenzie/advent-of-code-2023" }, " PHP"),
                    createTextVNode(" . Another year, another round of string split mania... ")
                  ]),
                  createVNode("li", null, [
                    createTextVNode(" I write a lot of "),
                    createVNode("a", { href: "https://www.rust-lang.org/" }, "Rust"),
                    createTextVNode(" in my spare time and have contributed some small libraries and crates "),
                    createVNode("a", { href: "https://crates.io/crates/newswrap" }, "here"),
                    createTextVNode(" and "),
                    createVNode("a", { href: "https://github.com/JoeyMckenzie/bubblehearth" }, "there"),
                    createTextVNode(". ")
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Now.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
