import {
  j as $,
  $ as U,
  q as ao,
  r as a,
  d as Hr,
  b as Jt,
  c as Yr,
  e as Xr,
} from "./app-754fd55e.js";
function qr() {
  return $.jsxs("svg", {
    className:
      "h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110",
    enableBackground: "new 0 0 512 512",
    viewBox: "0 0 512 512",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      $.jsx("title", { children: "Torchlight" }),
      $.jsx("path", {
        d: "m359.42 231.71-29.15 58.28-47.12 222.01h-54.3l-47.12-222.01-29.15-58.28z",
        fill: "#a34f3e",
      }),
      $.jsx("path", {
        d: "m359.42 231.71-29.15 58.28-47.12 222.01h-27.15v-280.29z",
        fill: "#873f2e",
      }),
      $.jsx("path", {
        d: "m256 2.64c-8.52-1.73-17.35-2.64-26.39-2.64h-63.45v30c2.45 0 4.9.2 7.29.59 20.62 3.36 21.6 31.21 4.94 43.88-26.28 19.97-34.64 58.76-20.79 96.5 15.04 41.01 51.5 69.03 96.81 69.03.53 0 1.06 0 1.59-.02 55.55-.94 102.64-51.12 104.87-102.79 2.86-66.02-42.97-121.97-104.87-134.55z",
        fill: "#fed843",
      }),
      $.jsx("path", {
        d: "m360.87 137.19c-2.23 51.67-49.32 101.85-104.87 102.79v-237.34c61.9 12.58 107.73 68.53 104.87 134.55z",
        fill: "#fabe2c",
      }),
      $.jsx("path", {
        d: "m301 195c0 24.81-20.19 45-45 45s-45-20.19-45-45c0-20.12 9.69-25.58 45-90 35.37 64.54 45 69.91 45 90z",
        fill: "#fabe2c",
      }),
      $.jsx("path", {
        d: "m301 195c0 24.81-20.19 45-45 45v-135c35.37 64.54 45 69.91 45 90z",
        fill: "#ff9100",
      }),
      $.jsx("path", { d: "m151 270h210v30h-210z", fill: "#c86e59" }),
      $.jsx("path", { d: "m256 270h105v30h-105z", fill: "#a34f3e" }),
      $.jsx("path", { d: "m121 210h270v30h-270z", fill: "#c86e59" }),
      $.jsx("path", { d: "m256 210h135v30h-135z", fill: "#a34f3e" }),
    ],
  });
}
const je = /^[a-z0-9]+(-[a-z0-9]+)*$/,
  wt = (e, t, n, o = "") => {
    const r = e.split(":");
    if (e.slice(0, 1) === "@") {
      if (r.length < 2 || r.length > 3) return null;
      o = r.shift().slice(1);
    }
    if (r.length > 3 || !r.length) return null;
    if (r.length > 1) {
      const c = r.pop(),
        l = r.pop(),
        u = { provider: r.length > 0 ? r[0] : o, prefix: l, name: c };
      return t && !lt(u) ? null : u;
    }
    const i = r[0],
      s = i.split("-");
    if (s.length > 1) {
      const c = { provider: o, prefix: s.shift(), name: s.join("-") };
      return t && !lt(c) ? null : c;
    }
    if (n && o === "") {
      const c = { provider: o, prefix: "", name: i };
      return t && !lt(c, n) ? null : c;
    }
    return null;
  },
  lt = (e, t) =>
    e
      ? !!(
          (e.provider === "" || e.provider.match(je)) &&
          ((t && e.prefix === "") || e.prefix.match(je)) &&
          e.name.match(je)
        )
      : !1,
  lo = Object.freeze({ left: 0, top: 0, width: 16, height: 16 }),
  mt = Object.freeze({ rotate: 0, vFlip: !1, hFlip: !1 }),
  en = Object.freeze({ ...lo, ...mt }),
  Dt = Object.freeze({ ...en, body: "", hidden: !1 });
function Zr(e, t) {
  const n = {};
  !e.hFlip != !t.hFlip && (n.hFlip = !0),
    !e.vFlip != !t.vFlip && (n.vFlip = !0);
  const o = ((e.rotate || 0) + (t.rotate || 0)) % 4;
  return o && (n.rotate = o), n;
}
function Sn(e, t) {
  const n = Zr(e, t);
  for (const o in Dt)
    o in mt
      ? o in e && !(o in n) && (n[o] = mt[o])
      : o in t
        ? (n[o] = t[o])
        : o in e && (n[o] = e[o]);
  return n;
}
function Qr(e, t) {
  const n = e.icons,
    o = e.aliases || Object.create(null),
    r = Object.create(null);
  function i(s) {
    if (n[s]) return (r[s] = []);
    if (!(s in r)) {
      r[s] = null;
      const c = o[s] && o[s].parent,
        l = c && i(c);
      l && (r[s] = [c].concat(l));
    }
    return r[s];
  }
  return (t || Object.keys(n).concat(Object.keys(o))).forEach(i), r;
}
function Jr(e, t, n) {
  const o = e.icons,
    r = e.aliases || Object.create(null);
  let i = {};
  function s(c) {
    i = Sn(o[c] || r[c], i);
  }
  return s(t), n.forEach(s), Sn(e, i);
}
function uo(e, t) {
  const n = [];
  if (typeof e != "object" || typeof e.icons != "object") return n;
  e.not_found instanceof Array &&
    e.not_found.forEach((r) => {
      t(r, null), n.push(r);
    });
  const o = Qr(e);
  for (const r in o) {
    const i = o[r];
    i && (t(r, Jr(e, r, i)), n.push(r));
  }
  return n;
}
const ei = { provider: "", aliases: {}, not_found: {}, ...lo };
function Pt(e, t) {
  for (const n in t) if (n in e && typeof e[n] != typeof t[n]) return !1;
  return !0;
}
function fo(e) {
  if (typeof e != "object" || e === null) return null;
  const t = e;
  if (
    typeof t.prefix != "string" ||
    !e.icons ||
    typeof e.icons != "object" ||
    !Pt(e, ei)
  )
    return null;
  const n = t.icons;
  for (const r in n) {
    const i = n[r];
    if (!r.match(je) || typeof i.body != "string" || !Pt(i, Dt)) return null;
  }
  const o = t.aliases || Object.create(null);
  for (const r in o) {
    const i = o[r],
      s = i.parent;
    if (!r.match(je) || typeof s != "string" || (!n[s] && !o[s]) || !Pt(i, Dt))
      return null;
  }
  return t;
}
const Rn = Object.create(null);
function ti(e, t) {
  return {
    provider: e,
    prefix: t,
    icons: Object.create(null),
    missing: new Set(),
  };
}
function we(e, t) {
  const n = Rn[e] || (Rn[e] = Object.create(null));
  return n[t] || (n[t] = ti(e, t));
}
function tn(e, t) {
  return fo(t)
    ? uo(t, (n, o) => {
        o ? (e.icons[n] = o) : e.missing.add(n);
      })
    : [];
}
function ni(e, t, n) {
  try {
    if (typeof n.body == "string") return (e.icons[t] = { ...n }), !0;
  } catch {}
  return !1;
}
let Be = !1;
function po(e) {
  return typeof e == "boolean" && (Be = e), Be;
}
function oi(e) {
  const t = typeof e == "string" ? wt(e, !0, Be) : e;
  if (t) {
    const n = we(t.provider, t.prefix),
      o = t.name;
    return n.icons[o] || (n.missing.has(o) ? null : void 0);
  }
}
function ri(e, t) {
  const n = wt(e, !0, Be);
  if (!n) return !1;
  const o = we(n.provider, n.prefix);
  return ni(o, n.name, t);
}
function ii(e, t) {
  if (typeof e != "object") return !1;
  if ((typeof t != "string" && (t = e.provider || ""), Be && !t && !e.prefix)) {
    let r = !1;
    return (
      fo(e) &&
        ((e.prefix = ""),
        uo(e, (i, s) => {
          s && ri(i, s) && (r = !0);
        })),
      r
    );
  }
  const n = e.prefix;
  if (!lt({ provider: t, prefix: n, name: "a" })) return !1;
  const o = we(t, n);
  return !!tn(o, e);
}
const mo = Object.freeze({ width: null, height: null }),
  ho = Object.freeze({ ...mo, ...mt }),
  si = /(-?[0-9.]*[0-9]+[0-9.]*)/g,
  ci = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function Pn(e, t, n) {
  if (t === 1) return e;
  if (((n = n || 100), typeof e == "number")) return Math.ceil(e * t * n) / n;
  if (typeof e != "string") return e;
  const o = e.split(si);
  if (o === null || !o.length) return e;
  const r = [];
  let i = o.shift(),
    s = ci.test(i);
  for (;;) {
    if (s) {
      const c = parseFloat(i);
      isNaN(c) ? r.push(i) : r.push(Math.ceil(c * t * n) / n);
    } else r.push(i);
    if (((i = o.shift()), i === void 0)) return r.join("");
    s = !s;
  }
}
const ai = (e) => e === "unset" || e === "undefined" || e === "none";
function li(e, t) {
  const n = { ...en, ...e },
    o = { ...ho, ...t },
    r = { left: n.left, top: n.top, width: n.width, height: n.height };
  let i = n.body;
  [n, o].forEach((g) => {
    const p = [],
      v = g.hFlip,
      x = g.vFlip;
    let b = g.rotate;
    v
      ? x
        ? (b += 2)
        : (p.push(
            "translate(" +
              (r.width + r.left).toString() +
              " " +
              (0 - r.top).toString() +
              ")",
          ),
          p.push("scale(-1 1)"),
          (r.top = r.left = 0))
      : x &&
        (p.push(
          "translate(" +
            (0 - r.left).toString() +
            " " +
            (r.height + r.top).toString() +
            ")",
        ),
        p.push("scale(1 -1)"),
        (r.top = r.left = 0));
    let w;
    switch ((b < 0 && (b -= Math.floor(b / 4) * 4), (b = b % 4), b)) {
      case 1:
        (w = r.height / 2 + r.top),
          p.unshift("rotate(90 " + w.toString() + " " + w.toString() + ")");
        break;
      case 2:
        p.unshift(
          "rotate(180 " +
            (r.width / 2 + r.left).toString() +
            " " +
            (r.height / 2 + r.top).toString() +
            ")",
        );
        break;
      case 3:
        (w = r.width / 2 + r.left),
          p.unshift("rotate(-90 " + w.toString() + " " + w.toString() + ")");
        break;
    }
    b % 2 === 1 &&
      (r.left !== r.top && ((w = r.left), (r.left = r.top), (r.top = w)),
      r.width !== r.height &&
        ((w = r.width), (r.width = r.height), (r.height = w))),
      p.length && (i = '<g transform="' + p.join(" ") + '">' + i + "</g>");
  });
  const s = o.width,
    c = o.height,
    l = r.width,
    u = r.height;
  let f, d;
  s === null
    ? ((d = c === null ? "1em" : c === "auto" ? u : c), (f = Pn(d, l / u)))
    : ((f = s === "auto" ? l : s),
      (d = c === null ? Pn(f, u / l) : c === "auto" ? u : c));
  const h = {},
    m = (g, p) => {
      ai(p) || (h[g] = p.toString());
    };
  return (
    m("width", f),
    m("height", d),
    (h.viewBox =
      r.left.toString() +
      " " +
      r.top.toString() +
      " " +
      l.toString() +
      " " +
      u.toString()),
    { attributes: h, body: i }
  );
}
const ui = /\sid="(\S+)"/g,
  di =
    "IconifyId" +
    Date.now().toString(16) +
    ((Math.random() * 16777216) | 0).toString(16);
let fi = 0;
function pi(e, t = di) {
  const n = [];
  let o;
  for (; (o = ui.exec(e)); ) n.push(o[1]);
  if (!n.length) return e;
  const r = "suffix" + ((Math.random() * 16777216) | Date.now()).toString(16);
  return (
    n.forEach((i) => {
      const s = typeof t == "function" ? t(i) : t + (fi++).toString(),
        c = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      e = e.replace(
        new RegExp('([#;"])(' + c + ')([")]|\\.[a-z])', "g"),
        "$1" + s + r + "$3",
      );
    }),
    (e = e.replace(new RegExp(r, "g"), "")),
    e
  );
}
const Lt = Object.create(null);
function mi(e, t) {
  Lt[e] = t;
}
function Ft(e) {
  return Lt[e] || Lt[""];
}
function nn(e) {
  let t;
  if (typeof e.resources == "string") t = [e.resources];
  else if (((t = e.resources), !(t instanceof Array) || !t.length)) return null;
  return {
    resources: t,
    path: e.path || "/",
    maxURL: e.maxURL || 500,
    rotate: e.rotate || 750,
    timeout: e.timeout || 5e3,
    random: e.random === !0,
    index: e.index || 0,
    dataAfterTimeout: e.dataAfterTimeout !== !1,
  };
}
const on = Object.create(null),
  De = ["https://api.simplesvg.com", "https://api.unisvg.com"],
  ut = [];
for (; De.length > 0; )
  De.length === 1 || Math.random() > 0.5
    ? ut.push(De.shift())
    : ut.push(De.pop());
on[""] = nn({ resources: ["https://api.iconify.design"].concat(ut) });
function hi(e, t) {
  const n = nn(t);
  return n === null ? !1 : ((on[e] = n), !0);
}
function rn(e) {
  return on[e];
}
const gi = () => {
  let e;
  try {
    if (((e = fetch), typeof e == "function")) return e;
  } catch {}
};
let Mn = gi();
function vi(e, t) {
  const n = rn(e);
  if (!n) return 0;
  let o;
  if (!n.maxURL) o = 0;
  else {
    let r = 0;
    n.resources.forEach((s) => {
      r = Math.max(r, s.length);
    });
    const i = t + ".json?icons=";
    o = n.maxURL - r - n.path.length - i.length;
  }
  return o;
}
function bi(e) {
  return e === 404;
}
const xi = (e, t, n) => {
  const o = [],
    r = vi(e, t),
    i = "icons";
  let s = { type: i, provider: e, prefix: t, icons: [] },
    c = 0;
  return (
    n.forEach((l, u) => {
      (c += l.length + 1),
        c >= r &&
          u > 0 &&
          (o.push(s),
          (s = { type: i, provider: e, prefix: t, icons: [] }),
          (c = l.length)),
        s.icons.push(l);
    }),
    o.push(s),
    o
  );
};
function wi(e) {
  if (typeof e == "string") {
    const t = rn(e);
    if (t) return t.path;
  }
  return "/";
}
const yi = (e, t, n) => {
    if (!Mn) {
      n("abort", 424);
      return;
    }
    let o = wi(t.provider);
    switch (t.type) {
      case "icons": {
        const i = t.prefix,
          c = t.icons.join(","),
          l = new URLSearchParams({ icons: c });
        o += i + ".json?" + l.toString();
        break;
      }
      case "custom": {
        const i = t.uri;
        o += i.slice(0, 1) === "/" ? i.slice(1) : i;
        break;
      }
      default:
        n("abort", 400);
        return;
    }
    let r = 503;
    Mn(e + o)
      .then((i) => {
        const s = i.status;
        if (s !== 200) {
          setTimeout(() => {
            n(bi(s) ? "abort" : "next", s);
          });
          return;
        }
        return (r = 501), i.json();
      })
      .then((i) => {
        if (typeof i != "object" || i === null) {
          setTimeout(() => {
            i === 404 ? n("abort", i) : n("next", r);
          });
          return;
        }
        setTimeout(() => {
          n("success", i);
        });
      })
      .catch(() => {
        n("next", r);
      });
  },
  $i = { prepare: xi, send: yi };
function Ci(e) {
  const t = { loaded: [], missing: [], pending: [] },
    n = Object.create(null);
  e.sort((r, i) =>
    r.provider !== i.provider
      ? r.provider.localeCompare(i.provider)
      : r.prefix !== i.prefix
        ? r.prefix.localeCompare(i.prefix)
        : r.name.localeCompare(i.name),
  );
  let o = { provider: "", prefix: "", name: "" };
  return (
    e.forEach((r) => {
      if (
        o.name === r.name &&
        o.prefix === r.prefix &&
        o.provider === r.provider
      )
        return;
      o = r;
      const i = r.provider,
        s = r.prefix,
        c = r.name,
        l = n[i] || (n[i] = Object.create(null)),
        u = l[s] || (l[s] = we(i, s));
      let f;
      c in u.icons
        ? (f = t.loaded)
        : s === "" || u.missing.has(c)
          ? (f = t.missing)
          : (f = t.pending);
      const d = { provider: i, prefix: s, name: c };
      f.push(d);
    }),
    t
  );
}
function go(e, t) {
  e.forEach((n) => {
    const o = n.loaderCallbacks;
    o && (n.loaderCallbacks = o.filter((r) => r.id !== t));
  });
}
function Ei(e) {
  e.pendingCallbacksFlag ||
    ((e.pendingCallbacksFlag = !0),
    setTimeout(() => {
      e.pendingCallbacksFlag = !1;
      const t = e.loaderCallbacks ? e.loaderCallbacks.slice(0) : [];
      if (!t.length) return;
      let n = !1;
      const o = e.provider,
        r = e.prefix;
      t.forEach((i) => {
        const s = i.icons,
          c = s.pending.length;
        (s.pending = s.pending.filter((l) => {
          if (l.prefix !== r) return !0;
          const u = l.name;
          if (e.icons[u]) s.loaded.push({ provider: o, prefix: r, name: u });
          else if (e.missing.has(u))
            s.missing.push({ provider: o, prefix: r, name: u });
          else return (n = !0), !0;
          return !1;
        })),
          s.pending.length !== c &&
            (n || go([e], i.id),
            i.callback(
              s.loaded.slice(0),
              s.missing.slice(0),
              s.pending.slice(0),
              i.abort,
            ));
      });
    }));
}
let Si = 0;
function Ri(e, t, n) {
  const o = Si++,
    r = go.bind(null, n, o);
  if (!t.pending.length) return r;
  const i = { id: o, icons: t, callback: e, abort: r };
  return (
    n.forEach((s) => {
      (s.loaderCallbacks || (s.loaderCallbacks = [])).push(i);
    }),
    r
  );
}
function Pi(e, t = !0, n = !1) {
  const o = [];
  return (
    e.forEach((r) => {
      const i = typeof r == "string" ? wt(r, t, n) : r;
      i && o.push(i);
    }),
    o
  );
}
var Mi = {
  resources: [],
  index: 0,
  timeout: 2e3,
  rotate: 750,
  random: !1,
  dataAfterTimeout: !1,
};
function Ti(e, t, n, o) {
  const r = e.resources.length,
    i = e.random ? Math.floor(Math.random() * r) : e.index;
  let s;
  if (e.random) {
    let C = e.resources.slice(0);
    for (s = []; C.length > 1; ) {
      const S = Math.floor(Math.random() * C.length);
      s.push(C[S]), (C = C.slice(0, S).concat(C.slice(S + 1)));
    }
    s = s.concat(C);
  } else s = e.resources.slice(i).concat(e.resources.slice(0, i));
  const c = Date.now();
  let l = "pending",
    u = 0,
    f,
    d = null,
    h = [],
    m = [];
  typeof o == "function" && m.push(o);
  function g() {
    d && (clearTimeout(d), (d = null));
  }
  function p() {
    l === "pending" && (l = "aborted"),
      g(),
      h.forEach((C) => {
        C.status === "pending" && (C.status = "aborted");
      }),
      (h = []);
  }
  function v(C, S) {
    S && (m = []), typeof C == "function" && m.push(C);
  }
  function x() {
    return {
      startTime: c,
      payload: t,
      status: l,
      queriesSent: u,
      queriesPending: h.length,
      subscribe: v,
      abort: p,
    };
  }
  function b() {
    (l = "failed"),
      m.forEach((C) => {
        C(void 0, f);
      });
  }
  function w() {
    h.forEach((C) => {
      C.status === "pending" && (C.status = "aborted");
    }),
      (h = []);
  }
  function y(C, S, R) {
    const _ = S !== "success";
    switch (((h = h.filter((k) => k !== C)), l)) {
      case "pending":
        break;
      case "failed":
        if (_ || !e.dataAfterTimeout) return;
        break;
      default:
        return;
    }
    if (S === "abort") {
      (f = R), b();
      return;
    }
    if (_) {
      (f = R), h.length || (s.length ? E() : b());
      return;
    }
    if ((g(), w(), !e.random)) {
      const k = e.resources.indexOf(C.resource);
      k !== -1 && k !== e.index && (e.index = k);
    }
    (l = "completed"),
      m.forEach((k) => {
        k(R);
      });
  }
  function E() {
    if (l !== "pending") return;
    g();
    const C = s.shift();
    if (C === void 0) {
      if (h.length) {
        d = setTimeout(() => {
          g(), l === "pending" && (w(), b());
        }, e.timeout);
        return;
      }
      b();
      return;
    }
    const S = {
      status: "pending",
      resource: C,
      callback: (R, _) => {
        y(S, R, _);
      },
    };
    h.push(S), u++, (d = setTimeout(E, e.rotate)), n(C, t, S.callback);
  }
  return setTimeout(E), x;
}
function vo(e) {
  const t = { ...Mi, ...e };
  let n = [];
  function o() {
    n = n.filter((c) => c().status === "pending");
  }
  function r(c, l, u) {
    const f = Ti(t, c, l, (d, h) => {
      o(), u && u(d, h);
    });
    return n.push(f), f;
  }
  function i(c) {
    return n.find((l) => c(l)) || null;
  }
  return {
    query: r,
    find: i,
    setIndex: (c) => {
      t.index = c;
    },
    getIndex: () => t.index,
    cleanup: o,
  };
}
function Tn() {}
const Mt = Object.create(null);
function _i(e) {
  if (!Mt[e]) {
    const t = rn(e);
    if (!t) return;
    const n = vo(t),
      o = { config: t, redundancy: n };
    Mt[e] = o;
  }
  return Mt[e];
}
function Ii(e, t, n) {
  let o, r;
  if (typeof e == "string") {
    const i = Ft(e);
    if (!i) return n(void 0, 424), Tn;
    r = i.send;
    const s = _i(e);
    s && (o = s.redundancy);
  } else {
    const i = nn(e);
    if (i) {
      o = vo(i);
      const s = e.resources ? e.resources[0] : "",
        c = Ft(s);
      c && (r = c.send);
    }
  }
  return !o || !r ? (n(void 0, 424), Tn) : o.query(t, r, n)().abort;
}
const _n = "iconify2",
  We = "iconify",
  bo = We + "-count",
  In = We + "-version",
  xo = 36e5,
  Ai = 168;
function jt(e, t) {
  try {
    return e.getItem(t);
  } catch {}
}
function sn(e, t, n) {
  try {
    return e.setItem(t, n), !0;
  } catch {}
}
function An(e, t) {
  try {
    e.removeItem(t);
  } catch {}
}
function zt(e, t) {
  return sn(e, bo, t.toString());
}
function Bt(e) {
  return parseInt(jt(e, bo)) || 0;
}
const yt = { local: !0, session: !0 },
  wo = { local: new Set(), session: new Set() };
let cn = !1;
function Oi(e) {
  cn = e;
}
let et = typeof window > "u" ? {} : window;
function yo(e) {
  const t = e + "Storage";
  try {
    if (et && et[t] && typeof et[t].length == "number") return et[t];
  } catch {}
  yt[e] = !1;
}
function $o(e, t) {
  const n = yo(e);
  if (!n) return;
  const o = jt(n, In);
  if (o !== _n) {
    if (o) {
      const c = Bt(n);
      for (let l = 0; l < c; l++) An(n, We + l.toString());
    }
    sn(n, In, _n), zt(n, 0);
    return;
  }
  const r = Math.floor(Date.now() / xo) - Ai,
    i = (c) => {
      const l = We + c.toString(),
        u = jt(n, l);
      if (typeof u == "string") {
        try {
          const f = JSON.parse(u);
          if (
            typeof f == "object" &&
            typeof f.cached == "number" &&
            f.cached > r &&
            typeof f.provider == "string" &&
            typeof f.data == "object" &&
            typeof f.data.prefix == "string" &&
            t(f, c)
          )
            return !0;
        } catch {}
        An(n, l);
      }
    };
  let s = Bt(n);
  for (let c = s - 1; c >= 0; c--)
    i(c) || (c === s - 1 ? (s--, zt(n, s)) : wo[e].add(c));
}
function Co() {
  if (!cn) {
    Oi(!0);
    for (const e in yt)
      $o(e, (t) => {
        const n = t.data,
          o = t.provider,
          r = n.prefix,
          i = we(o, r);
        if (!tn(i, n).length) return !1;
        const s = n.lastModified || -1;
        return (
          (i.lastModifiedCached = i.lastModifiedCached
            ? Math.min(i.lastModifiedCached, s)
            : s),
          !0
        );
      });
  }
}
function ki(e, t) {
  const n = e.lastModifiedCached;
  if (n && n >= t) return n === t;
  if (((e.lastModifiedCached = t), n))
    for (const o in yt)
      $o(o, (r) => {
        const i = r.data;
        return (
          r.provider !== e.provider ||
          i.prefix !== e.prefix ||
          i.lastModified === t
        );
      });
  return !0;
}
function Ni(e, t) {
  cn || Co();
  function n(o) {
    let r;
    if (!yt[o] || !(r = yo(o))) return;
    const i = wo[o];
    let s;
    if (i.size) i.delete((s = Array.from(i).shift()));
    else if (((s = Bt(r)), !zt(r, s + 1))) return;
    const c = {
      cached: Math.floor(Date.now() / xo),
      provider: e.provider,
      data: t,
    };
    return sn(r, We + s.toString(), JSON.stringify(c));
  }
  (t.lastModified && !ki(e, t.lastModified)) ||
    (Object.keys(t.icons).length &&
      (t.not_found && ((t = Object.assign({}, t)), delete t.not_found),
      n("local") || n("session")));
}
function On() {}
function Di(e) {
  e.iconsLoaderFlag ||
    ((e.iconsLoaderFlag = !0),
    setTimeout(() => {
      (e.iconsLoaderFlag = !1), Ei(e);
    }));
}
function Li(e, t) {
  e.iconsToLoad
    ? (e.iconsToLoad = e.iconsToLoad.concat(t).sort())
    : (e.iconsToLoad = t),
    e.iconsQueueFlag ||
      ((e.iconsQueueFlag = !0),
      setTimeout(() => {
        e.iconsQueueFlag = !1;
        const { provider: n, prefix: o } = e,
          r = e.iconsToLoad;
        delete e.iconsToLoad;
        let i;
        if (!r || !(i = Ft(n))) return;
        i.prepare(n, o, r).forEach((c) => {
          Ii(n, c, (l) => {
            if (typeof l != "object")
              c.icons.forEach((u) => {
                e.missing.add(u);
              });
            else
              try {
                const u = tn(e, l);
                if (!u.length) return;
                const f = e.pendingIcons;
                f &&
                  u.forEach((d) => {
                    f.delete(d);
                  }),
                  Ni(e, l);
              } catch (u) {
                console.error(u);
              }
            Di(e);
          });
        });
      }));
}
const Fi = (e, t) => {
  const n = Pi(e, !0, po()),
    o = Ci(n);
  if (!o.pending.length) {
    let l = !0;
    return (
      t &&
        setTimeout(() => {
          l && t(o.loaded, o.missing, o.pending, On);
        }),
      () => {
        l = !1;
      }
    );
  }
  const r = Object.create(null),
    i = [];
  let s, c;
  return (
    o.pending.forEach((l) => {
      const { provider: u, prefix: f } = l;
      if (f === c && u === s) return;
      (s = u), (c = f), i.push(we(u, f));
      const d = r[u] || (r[u] = Object.create(null));
      d[f] || (d[f] = []);
    }),
    o.pending.forEach((l) => {
      const { provider: u, prefix: f, name: d } = l,
        h = we(u, f),
        m = h.pendingIcons || (h.pendingIcons = new Set());
      m.has(d) || (m.add(d), r[u][f].push(d));
    }),
    i.forEach((l) => {
      const { provider: u, prefix: f } = l;
      r[u][f].length && Li(l, r[u][f]);
    }),
    t ? Ri(t, o, i) : On
  );
};
function ji(e, t) {
  const n = { ...e };
  for (const o in t) {
    const r = t[o],
      i = typeof r;
    o in mo
      ? (r === null || (r && (i === "string" || i === "number"))) && (n[o] = r)
      : i === typeof n[o] && (n[o] = o === "rotate" ? r % 4 : r);
  }
  return n;
}
const zi = /[\s,]+/;
function Bi(e, t) {
  t.split(zi).forEach((n) => {
    switch (n.trim()) {
      case "horizontal":
        e.hFlip = !0;
        break;
      case "vertical":
        e.vFlip = !0;
        break;
    }
  });
}
function Wi(e, t = 0) {
  const n = e.replace(/^-?[0-9.]*/, "");
  function o(r) {
    for (; r < 0; ) r += 4;
    return r % 4;
  }
  if (n === "") {
    const r = parseInt(e);
    return isNaN(r) ? 0 : o(r);
  } else if (n !== e) {
    let r = 0;
    switch (n) {
      case "%":
        r = 25;
        break;
      case "deg":
        r = 90;
    }
    if (r) {
      let i = parseFloat(e.slice(0, e.length - n.length));
      return isNaN(i) ? 0 : ((i = i / r), i % 1 === 0 ? o(i) : 0);
    }
  }
  return t;
}
function Ui(e, t) {
  let n =
    e.indexOf("xlink:") === -1
      ? ""
      : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const o in t) n += " " + o + '="' + t[o] + '"';
  return '<svg xmlns="http://www.w3.org/2000/svg"' + n + ">" + e + "</svg>";
}
function Gi(e) {
  return e
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/\s+/g, " ");
}
function Vi(e) {
  return "data:image/svg+xml," + Gi(e);
}
function Ki(e) {
  return 'url("' + Vi(e) + '")';
}
let ze;
function Hi() {
  try {
    ze = window.trustedTypes.createPolicy("iconify", { createHTML: (e) => e });
  } catch {
    ze = null;
  }
}
function Yi(e) {
  return ze === void 0 && Hi(), ze ? ze.createHTML(e) : e;
}
const Eo = { ...ho, inline: !1 },
  Xi = {
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    "aria-hidden": !0,
    role: "img",
  },
  qi = { display: "inline-block" },
  Wt = { backgroundColor: "currentColor" },
  So = { backgroundColor: "transparent" },
  kn = { Image: "var(--svg)", Repeat: "no-repeat", Size: "100% 100%" },
  Nn = { WebkitMask: Wt, mask: Wt, background: So };
for (const e in Nn) {
  const t = Nn[e];
  for (const n in kn) t[e + n] = kn[n];
}
const Zi = { ...Eo, inline: !0 };
function Dn(e) {
  return e + (e.match(/^[-0-9.]+$/) ? "px" : "");
}
const Qi = (e, t, n, o) => {
  const r = n ? Zi : Eo,
    i = ji(r, t),
    s = t.mode || "svg",
    c = {},
    l = t.style || {},
    u = { ...(s === "svg" ? Xi : {}), ref: o };
  for (let x in t) {
    const b = t[x];
    if (b !== void 0)
      switch (x) {
        case "icon":
        case "style":
        case "children":
        case "onLoad":
        case "mode":
        case "_ref":
        case "_inline":
          break;
        case "inline":
        case "hFlip":
        case "vFlip":
          i[x] = b === !0 || b === "true" || b === 1;
          break;
        case "flip":
          typeof b == "string" && Bi(i, b);
          break;
        case "color":
          c.color = b;
          break;
        case "rotate":
          typeof b == "string"
            ? (i[x] = Wi(b))
            : typeof b == "number" && (i[x] = b);
          break;
        case "ariaHidden":
        case "aria-hidden":
          b !== !0 && b !== "true" && delete u["aria-hidden"];
          break;
        default:
          r[x] === void 0 && (u[x] = b);
      }
  }
  const f = li(e, i),
    d = f.attributes;
  if ((i.inline && (c.verticalAlign = "-0.125em"), s === "svg")) {
    (u.style = { ...c, ...l }), Object.assign(u, d);
    let x = 0,
      b = t.id;
    return (
      typeof b == "string" && (b = b.replace(/-/g, "_")),
      (u.dangerouslySetInnerHTML = {
        __html: Yi(pi(f.body, b ? () => b + "ID" + x++ : "iconifyReact")),
      }),
      U.createElement("svg", u)
    );
  }
  const { body: h, width: m, height: g } = e,
    p = s === "mask" || (s === "bg" ? !1 : h.indexOf("currentColor") !== -1),
    v = Ui(h, { ...d, width: m + "", height: g + "" });
  return (
    (u.style = {
      ...c,
      "--svg": Ki(v),
      width: Dn(d.width),
      height: Dn(d.height),
      ...qi,
      ...(p ? Wt : So),
      ...l,
    }),
    U.createElement("span", u)
  );
};
po(!0);
mi("", $i);
if (typeof document < "u" && typeof window < "u") {
  Co();
  const e = window;
  if (e.IconifyPreload !== void 0) {
    const t = e.IconifyPreload,
      n = "Invalid IconifyPreload syntax.";
    typeof t == "object" &&
      t !== null &&
      (t instanceof Array ? t : [t]).forEach((o) => {
        try {
          (typeof o != "object" ||
            o === null ||
            o instanceof Array ||
            typeof o.icons != "object" ||
            typeof o.prefix != "string" ||
            !ii(o)) &&
            console.error(n);
        } catch {
          console.error(n);
        }
      });
  }
  if (e.IconifyProviders !== void 0) {
    const t = e.IconifyProviders;
    if (typeof t == "object" && t !== null)
      for (let n in t) {
        const o = "IconifyProviders[" + n + "] is invalid.";
        try {
          const r = t[n];
          if (typeof r != "object" || !r || r.resources === void 0) continue;
          hi(n, r) || console.error(o);
        } catch {
          console.error(o);
        }
      }
  }
}
class Ro extends U.Component {
  constructor(t) {
    super(t), (this.state = { icon: null });
  }
  _abortLoading() {
    this._loading && (this._loading.abort(), (this._loading = null));
  }
  _setData(t) {
    this.state.icon !== t && this.setState({ icon: t });
  }
  _checkIcon(t) {
    const n = this.state,
      o = this.props.icon;
    if (typeof o == "object" && o !== null && typeof o.body == "string") {
      (this._icon = ""),
        this._abortLoading(),
        (t || n.icon === null) && this._setData({ data: o });
      return;
    }
    let r;
    if (typeof o != "string" || (r = wt(o, !1, !0)) === null) {
      this._abortLoading(), this._setData(null);
      return;
    }
    const i = oi(r);
    if (!i) {
      (!this._loading || this._loading.name !== o) &&
        (this._abortLoading(),
        (this._icon = ""),
        this._setData(null),
        i !== null &&
          (this._loading = {
            name: o,
            abort: Fi([r], this._checkIcon.bind(this, !1)),
          }));
      return;
    }
    if (this._icon !== o || n.icon === null) {
      this._abortLoading(), (this._icon = o);
      const s = ["iconify"];
      r.prefix !== "" && s.push("iconify--" + r.prefix),
        r.provider !== "" && s.push("iconify--" + r.provider),
        this._setData({ data: i, classes: s }),
        this.props.onLoad && this.props.onLoad(o);
    }
  }
  componentDidMount() {
    this._checkIcon(!1);
  }
  componentDidUpdate(t) {
    t.icon !== this.props.icon && this._checkIcon(!0);
  }
  componentWillUnmount() {
    this._abortLoading();
  }
  render() {
    const t = this.props,
      n = this.state.icon;
    if (n === null)
      return t.children ? t.children : U.createElement("span", {});
    let o = t;
    return (
      n.classes &&
        (o = {
          ...t,
          className:
            (typeof t.className == "string" ? t.className + " " : "") +
            n.classes.join(" "),
        }),
      Qi({ ...en, ...n.data }, o, t._inline, t._ref)
    );
  }
}
const an = U.forwardRef(function (t, n) {
  const o = { ...t, _ref: n, _inline: !1 };
  return U.createElement(Ro, o);
});
U.forwardRef(function (t, n) {
  const o = { ...t, _ref: n, _inline: !0 };
  return U.createElement(Ro, o);
});
const Ji = [
  { display: "Larvel", href: "https://laravel.com", icon: "logos:laravel" },
  { display: "React", href: "https://reactjs.org", icon: "logos:react" },
  {
    display: "Inertia.js",
    href: "https://inertiajs.com",
    icon: "simple-icons:inertia",
  },
  {
    display: "Digital Ocean",
    href: "https://digitalocean.com",
    icon: "gg:digitalocean",
  },
];
function es() {
  const t = ao().props.commit ?? "",
    n = t.substring(0, 6),
    o = `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${t}`;
  return $.jsxs("div", {
    className: "mx-auto inline-flex flex-row items-center gap-x-2 md:mx-0",
    children: [
      $.jsx("p", {
        className: "font-ubuntu text-center text-xs leading-5",
        children: "Powered by",
      }),
      Ji.map(({ icon: r, href: i, display: s }) =>
        $.jsxs(
          "a",
          {
            href: i,
            children: [
              $.jsx("span", { className: "sr-only", children: s }),
              $.jsx(an, {
                icon: r,
                className:
                  "h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110",
              }),
            ],
          },
          s,
        ),
      ),
      $.jsxs("a", {
        href: "https://torchlight.dev",
        children: [
          $.jsx("span", { className: "sr-only", children: "Torchlight" }),
          $.jsx(qr, {}),
        ],
      }),
      $.jsx("a", {
        href: o,
        className: "font-ubuntu text-center text-xs leading-5 hover:underline",
        children: n,
      }),
    ],
  });
}
const ts = [
  {
    href: "https://twitter.com/_joeyMcKenzie",
    display: "Twitter",
    icon: "simple-icons:x",
  },
  {
    href: "https://github.com/JoeyMcKenzie",
    display: "GitHub",
    icon: "mdi:github",
  },
  {
    href: "https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#",
    display: "YouTube",
    icon: "mdi:youtube",
  },
  {
    href: "https://twitch.tv/JoeTheDevMan",
    display: "Twitch",
    icon: "mdi:twitch",
  },
  {
    href: "https://linkedin.com/in/JoeyMcKenzie",
    display: "LinkedIn",
    icon: "mdi:linkedin",
  },
];
function ns() {
  return $.jsx("div", {
    className: "flex justify-center space-x-4",
    children: ts.map(({ href: e, icon: t, display: n }) =>
      $.jsxs(
        "a",
        {
          href: e,
          children: [
            $.jsx("span", { className: "sr-only", children: n }),
            $.jsx(an, {
              icon: t,
              className:
                "h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110",
            }),
          ],
        },
        t,
      ),
    ),
  });
}
function os({ children: e }) {
  return $.jsx("div", {
    className: "flex flex-col space-y-1",
    children: $.jsxs("div", {
      className: "flex flex-row items-center justify-center space-x-2",
      children: [
        e,
        $.jsx("div", {
          className: "flex flex-col",
          children: $.jsx("h4", {
            className: "text-xs text-neutral-500",
            children: "Not currently listening",
          }),
        }),
      ],
    }),
  });
}
function rs({ nowPlaying: e, children: t }) {
  return $.jsxs("a", {
    href: e.href,
    className: "flex flex-col space-y-1",
    rel: "noreferrer",
    target: "_blank",
    children: [
      $.jsx("h2", {
        className: "font-ubuntu inline-flex justify-center text-xs",
        children: "Now listening",
      }),
      $.jsxs("div", {
        className: "flex flex-row items-center justify-center space-x-2",
        children: [
          t,
          $.jsx("img", {
            src: e.albumImageSrc,
            alt: "Spotify listening to",
            className: "rounded-sm",
            height: "30",
            width: "30",
          }),
          $.jsxs("div", {
            className: "flex max-w-[16rem] flex-col",
            children: [
              $.jsx("h4", {
                className:
                  "line-clamp-1 overflow-hidden text-ellipsis text-xs font-semibold",
                children: e.trackTitle,
              }),
              $.jsx("p", { className: "text-xs", children: e.artist }),
            ],
          }),
        ],
      }),
    ],
  });
}
function is({ children: e }) {
  const n = ao().props.spotify,
    o = (n == null ? void 0 : n.nowPlaying) ?? !1;
  return $.jsxs($.Fragment, {
    children: [
      o && n !== void 0 && $.jsx(rs, { nowPlaying: n, children: e }),
      !o && $.jsx(os, { children: e }),
    ],
  });
}
function ss() {
  return $.jsxs("div", {
    className:
      "max-w-screen-4xl mx-auto mt-auto flex w-full flex-col items-center justify-evenly gap-y-8 p-12 sm:flex-row sm:items-end",
    children: [
      $.jsx(ns, {}),
      $.jsx(is, {
        children: $.jsx(an, {
          className: "h-6 w-6",
          icon: "logos:spotify-icon",
        }),
      }),
      $.jsx(es, {}),
    ],
  });
}
function T() {
  return (
    (T = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var o in n)
              Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
          }
          return e;
        }),
    T.apply(this, arguments)
  );
}
function cs(e, t) {
  typeof e == "function" ? e(t) : e != null && (e.current = t);
}
function $t(...e) {
  return (t) => e.forEach((n) => cs(n, t));
}
function X(...e) {
  return a.useCallback($t(...e), e);
}
const Me = a.forwardRef((e, t) => {
  const { children: n, ...o } = e,
    r = a.Children.toArray(n),
    i = r.find(ls);
  if (i) {
    const s = i.props.children,
      c = r.map((l) =>
        l === i
          ? a.Children.count(s) > 1
            ? a.Children.only(null)
            : a.isValidElement(s)
              ? s.props.children
              : null
          : l,
      );
    return a.createElement(
      Ut,
      T({}, o, { ref: t }),
      a.isValidElement(s) ? a.cloneElement(s, void 0, c) : null,
    );
  }
  return a.createElement(Ut, T({}, o, { ref: t }), n);
});
Me.displayName = "Slot";
const Ut = a.forwardRef((e, t) => {
  const { children: n, ...o } = e;
  return a.isValidElement(n)
    ? a.cloneElement(n, { ...us(o, n.props), ref: t ? $t(t, n.ref) : n.ref })
    : a.Children.count(n) > 1
      ? a.Children.only(null)
      : null;
});
Ut.displayName = "SlotClone";
const as = ({ children: e }) => a.createElement(a.Fragment, null, e);
function ls(e) {
  return a.isValidElement(e) && e.type === as;
}
function us(e, t) {
  const n = { ...t };
  for (const o in t) {
    const r = e[o],
      i = t[o];
    /^on[A-Z]/.test(o)
      ? r && i
        ? (n[o] = (...c) => {
            i(...c), r(...c);
          })
        : r && (n[o] = r)
      : o === "style"
        ? (n[o] = { ...r, ...i })
        : o === "className" && (n[o] = [r, i].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function Po(e) {
  var t,
    n,
    o = "";
  if (typeof e == "string" || typeof e == "number") o += e;
  else if (typeof e == "object")
    if (Array.isArray(e))
      for (t = 0; t < e.length; t++)
        e[t] && (n = Po(e[t])) && (o && (o += " "), (o += n));
    else for (t in e) e[t] && (o && (o += " "), (o += t));
  return o;
}
function Mo() {
  for (var e, t, n = 0, o = ""; n < arguments.length; )
    (e = arguments[n++]) && (t = Po(e)) && (o && (o += " "), (o += t));
  return o;
}
const Ln = (e) => (typeof e == "boolean" ? "".concat(e) : e === 0 ? "0" : e),
  Fn = Mo,
  ds = (e, t) => (n) => {
    var o;
    if ((t == null ? void 0 : t.variants) == null)
      return Fn(
        e,
        n == null ? void 0 : n.class,
        n == null ? void 0 : n.className,
      );
    const { variants: r, defaultVariants: i } = t,
      s = Object.keys(r).map((u) => {
        const f = n == null ? void 0 : n[u],
          d = i == null ? void 0 : i[u];
        if (f === null) return null;
        const h = Ln(f) || Ln(d);
        return r[u][h];
      }),
      c =
        n &&
        Object.entries(n).reduce((u, f) => {
          let [d, h] = f;
          return h === void 0 || (u[d] = h), u;
        }, {}),
      l =
        t == null || (o = t.compoundVariants) === null || o === void 0
          ? void 0
          : o.reduce((u, f) => {
              let { class: d, className: h, ...m } = f;
              return Object.entries(m).every((g) => {
                let [p, v] = g;
                return Array.isArray(v)
                  ? v.includes({ ...i, ...c }[p])
                  : { ...i, ...c }[p] === v;
              })
                ? [...u, d, h]
                : u;
            }, []);
    return Fn(
      e,
      s,
      l,
      n == null ? void 0 : n.class,
      n == null ? void 0 : n.className,
    );
  },
  ln = "-";
function fs(e) {
  const t = ms(e),
    { conflictingClassGroups: n, conflictingClassGroupModifiers: o } = e;
  function r(s) {
    const c = s.split(ln);
    return c[0] === "" && c.length !== 1 && c.shift(), To(c, t) || ps(s);
  }
  function i(s, c) {
    const l = n[s] || [];
    return c && o[s] ? [...l, ...o[s]] : l;
  }
  return { getClassGroupId: r, getConflictingClassGroupIds: i };
}
function To(e, t) {
  var s;
  if (e.length === 0) return t.classGroupId;
  const n = e[0],
    o = t.nextPart.get(n),
    r = o ? To(e.slice(1), o) : void 0;
  if (r) return r;
  if (t.validators.length === 0) return;
  const i = e.join(ln);
  return (s = t.validators.find(({ validator: c }) => c(i))) == null
    ? void 0
    : s.classGroupId;
}
const jn = /^\[(.+)\]$/;
function ps(e) {
  if (jn.test(e)) {
    const t = jn.exec(e)[1],
      n = t == null ? void 0 : t.substring(0, t.indexOf(":"));
    if (n) return "arbitrary.." + n;
  }
}
function ms(e) {
  const { theme: t, prefix: n } = e,
    o = { nextPart: new Map(), validators: [] };
  return (
    gs(Object.entries(e.classGroups), n).forEach(([i, s]) => {
      Gt(s, o, i, t);
    }),
    o
  );
}
function Gt(e, t, n, o) {
  e.forEach((r) => {
    if (typeof r == "string") {
      const i = r === "" ? t : zn(t, r);
      i.classGroupId = n;
      return;
    }
    if (typeof r == "function") {
      if (hs(r)) {
        Gt(r(o), t, n, o);
        return;
      }
      t.validators.push({ validator: r, classGroupId: n });
      return;
    }
    Object.entries(r).forEach(([i, s]) => {
      Gt(s, zn(t, i), n, o);
    });
  });
}
function zn(e, t) {
  let n = e;
  return (
    t.split(ln).forEach((o) => {
      n.nextPart.has(o) ||
        n.nextPart.set(o, { nextPart: new Map(), validators: [] }),
        (n = n.nextPart.get(o));
    }),
    n
  );
}
function hs(e) {
  return e.isThemeGetter;
}
function gs(e, t) {
  return t
    ? e.map(([n, o]) => {
        const r = o.map((i) =>
          typeof i == "string"
            ? t + i
            : typeof i == "object"
              ? Object.fromEntries(
                  Object.entries(i).map(([s, c]) => [t + s, c]),
                )
              : i,
        );
        return [n, r];
      })
    : e;
}
function vs(e) {
  if (e < 1) return { get: () => {}, set: () => {} };
  let t = 0,
    n = new Map(),
    o = new Map();
  function r(i, s) {
    n.set(i, s), t++, t > e && ((t = 0), (o = n), (n = new Map()));
  }
  return {
    get(i) {
      let s = n.get(i);
      if (s !== void 0) return s;
      if ((s = o.get(i)) !== void 0) return r(i, s), s;
    },
    set(i, s) {
      n.has(i) ? n.set(i, s) : r(i, s);
    },
  };
}
const _o = "!";
function bs(e) {
  const t = e.separator,
    n = t.length === 1,
    o = t[0],
    r = t.length;
  return function (s) {
    const c = [];
    let l = 0,
      u = 0,
      f;
    for (let p = 0; p < s.length; p++) {
      let v = s[p];
      if (l === 0) {
        if (v === o && (n || s.slice(p, p + r) === t)) {
          c.push(s.slice(u, p)), (u = p + r);
          continue;
        }
        if (v === "/") {
          f = p;
          continue;
        }
      }
      v === "[" ? l++ : v === "]" && l--;
    }
    const d = c.length === 0 ? s : s.substring(u),
      h = d.startsWith(_o),
      m = h ? d.substring(1) : d,
      g = f && f > u ? f - u : void 0;
    return {
      modifiers: c,
      hasImportantModifier: h,
      baseClassName: m,
      maybePostfixModifierPosition: g,
    };
  };
}
function xs(e) {
  if (e.length <= 1) return e;
  const t = [];
  let n = [];
  return (
    e.forEach((o) => {
      o[0] === "[" ? (t.push(...n.sort(), o), (n = [])) : n.push(o);
    }),
    t.push(...n.sort()),
    t
  );
}
function ws(e) {
  return { cache: vs(e.cacheSize), splitModifiers: bs(e), ...fs(e) };
}
const ys = /\s+/;
function $s(e, t) {
  const {
      splitModifiers: n,
      getClassGroupId: o,
      getConflictingClassGroupIds: r,
    } = t,
    i = new Set();
  return e
    .trim()
    .split(ys)
    .map((s) => {
      const {
        modifiers: c,
        hasImportantModifier: l,
        baseClassName: u,
        maybePostfixModifierPosition: f,
      } = n(s);
      let d = o(f ? u.substring(0, f) : u),
        h = !!f;
      if (!d) {
        if (!f) return { isTailwindClass: !1, originalClassName: s };
        if (((d = o(u)), !d))
          return { isTailwindClass: !1, originalClassName: s };
        h = !1;
      }
      const m = xs(c).join(":");
      return {
        isTailwindClass: !0,
        modifierId: l ? m + _o : m,
        classGroupId: d,
        originalClassName: s,
        hasPostfixModifier: h,
      };
    })
    .reverse()
    .filter((s) => {
      if (!s.isTailwindClass) return !0;
      const { modifierId: c, classGroupId: l, hasPostfixModifier: u } = s,
        f = c + l;
      return i.has(f)
        ? !1
        : (i.add(f), r(l, u).forEach((d) => i.add(c + d)), !0);
    })
    .reverse()
    .map((s) => s.originalClassName)
    .join(" ");
}
function Cs() {
  let e = 0,
    t,
    n,
    o = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (n = Io(t)) && (o && (o += " "), (o += n));
  return o;
}
function Io(e) {
  if (typeof e == "string") return e;
  let t,
    n = "";
  for (let o = 0; o < e.length; o++)
    e[o] && (t = Io(e[o])) && (n && (n += " "), (n += t));
  return n;
}
function Es(e, ...t) {
  let n,
    o,
    r,
    i = s;
  function s(l) {
    const u = t.reduce((f, d) => d(f), e());
    return (n = ws(u)), (o = n.cache.get), (r = n.cache.set), (i = c), c(l);
  }
  function c(l) {
    const u = o(l);
    if (u) return u;
    const f = $s(l, n);
    return r(l, f), f;
  }
  return function () {
    return i(Cs.apply(null, arguments));
  };
}
function F(e) {
  const t = (n) => n[e] || [];
  return (t.isThemeGetter = !0), t;
}
const Ao = /^\[(?:([a-z-]+):)?(.+)\]$/i,
  Ss = /^\d+\/\d+$/,
  Rs = new Set(["px", "full", "screen"]),
  Ps = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  Ms =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  Ts = /^-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  _s =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
function ee(e) {
  return xe(e) || Rs.has(e) || Ss.test(e);
}
function fe(e) {
  return Ie(e, "length", Fs);
}
function xe(e) {
  return !!e && !Number.isNaN(Number(e));
}
function tt(e) {
  return Ie(e, "number", xe);
}
function Le(e) {
  return !!e && Number.isInteger(Number(e));
}
function Is(e) {
  return e.endsWith("%") && xe(e.slice(0, -1));
}
function I(e) {
  return Ao.test(e);
}
function pe(e) {
  return Ps.test(e);
}
const As = new Set(["length", "size", "percentage"]);
function Os(e) {
  return Ie(e, As, Oo);
}
function ks(e) {
  return Ie(e, "position", Oo);
}
const Ns = new Set(["image", "url"]);
function Ds(e) {
  return Ie(e, Ns, zs);
}
function Ls(e) {
  return Ie(e, "", js);
}
function Fe() {
  return !0;
}
function Ie(e, t, n) {
  const o = Ao.exec(e);
  return o
    ? o[1]
      ? typeof t == "string"
        ? o[1] === t
        : t.has(o[1])
      : n(o[2])
    : !1;
}
function Fs(e) {
  return Ms.test(e);
}
function Oo() {
  return !1;
}
function js(e) {
  return Ts.test(e);
}
function zs(e) {
  return _s.test(e);
}
function Bs() {
  const e = F("colors"),
    t = F("spacing"),
    n = F("blur"),
    o = F("brightness"),
    r = F("borderColor"),
    i = F("borderRadius"),
    s = F("borderSpacing"),
    c = F("borderWidth"),
    l = F("contrast"),
    u = F("grayscale"),
    f = F("hueRotate"),
    d = F("invert"),
    h = F("gap"),
    m = F("gradientColorStops"),
    g = F("gradientColorStopPositions"),
    p = F("inset"),
    v = F("margin"),
    x = F("opacity"),
    b = F("padding"),
    w = F("saturate"),
    y = F("scale"),
    E = F("sepia"),
    C = F("skew"),
    S = F("space"),
    R = F("translate"),
    _ = () => ["auto", "contain", "none"],
    k = () => ["auto", "hidden", "clip", "visible", "scroll"],
    L = () => ["auto", I, t],
    P = () => [I, t],
    G = () => ["", ee, fe],
    A = () => ["auto", xe, I],
    D = () => [
      "bottom",
      "center",
      "left",
      "left-bottom",
      "left-top",
      "right",
      "right-bottom",
      "right-top",
      "top",
    ],
    O = () => ["solid", "dashed", "dotted", "double", "none"],
    B = () => [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "color-dodge",
      "color-burn",
      "hard-light",
      "soft-light",
      "difference",
      "exclusion",
      "hue",
      "saturation",
      "color",
      "luminosity",
      "plus-lighter",
    ],
    W = () => [
      "start",
      "end",
      "center",
      "between",
      "around",
      "evenly",
      "stretch",
    ],
    M = () => ["", "0", I],
    j = () => [
      "auto",
      "avoid",
      "all",
      "avoid-page",
      "page",
      "left",
      "right",
      "column",
    ],
    z = () => [xe, tt],
    V = () => [xe, I];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Fe],
      spacing: [ee, fe],
      blur: ["none", "", pe, I],
      brightness: z(),
      borderColor: [e],
      borderRadius: ["none", "", "full", pe, I],
      borderSpacing: P(),
      borderWidth: G(),
      contrast: z(),
      grayscale: M(),
      hueRotate: V(),
      invert: M(),
      gap: P(),
      gradientColorStops: [e],
      gradientColorStopPositions: [Is, fe],
      inset: L(),
      margin: L(),
      opacity: z(),
      padding: P(),
      saturate: z(),
      scale: z(),
      sepia: M(),
      skew: V(),
      space: P(),
      translate: P(),
    },
    classGroups: {
      aspect: [{ aspect: ["auto", "square", "video", I] }],
      container: ["container"],
      columns: [{ columns: [pe] }],
      "break-after": [{ "break-after": j() }],
      "break-before": [{ "break-before": j() }],
      "break-inside": [
        { "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] },
      ],
      "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
      box: [{ box: ["border", "content"] }],
      display: [
        "block",
        "inline-block",
        "inline",
        "flex",
        "inline-flex",
        "table",
        "inline-table",
        "table-caption",
        "table-cell",
        "table-column",
        "table-column-group",
        "table-footer-group",
        "table-header-group",
        "table-row-group",
        "table-row",
        "flow-root",
        "grid",
        "inline-grid",
        "contents",
        "list-item",
        "hidden",
      ],
      float: [{ float: ["right", "left", "none"] }],
      clear: [{ clear: ["left", "right", "both", "none"] }],
      isolation: ["isolate", "isolation-auto"],
      "object-fit": [
        { object: ["contain", "cover", "fill", "none", "scale-down"] },
      ],
      "object-position": [{ object: [...D(), I] }],
      overflow: [{ overflow: k() }],
      "overflow-x": [{ "overflow-x": k() }],
      "overflow-y": [{ "overflow-y": k() }],
      overscroll: [{ overscroll: _() }],
      "overscroll-x": [{ "overscroll-x": _() }],
      "overscroll-y": [{ "overscroll-y": _() }],
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      inset: [{ inset: [p] }],
      "inset-x": [{ "inset-x": [p] }],
      "inset-y": [{ "inset-y": [p] }],
      start: [{ start: [p] }],
      end: [{ end: [p] }],
      top: [{ top: [p] }],
      right: [{ right: [p] }],
      bottom: [{ bottom: [p] }],
      left: [{ left: [p] }],
      visibility: ["visible", "invisible", "collapse"],
      z: [{ z: ["auto", Le, I] }],
      basis: [{ basis: L() }],
      "flex-direction": [
        { flex: ["row", "row-reverse", "col", "col-reverse"] },
      ],
      "flex-wrap": [{ flex: ["wrap", "wrap-reverse", "nowrap"] }],
      flex: [{ flex: ["1", "auto", "initial", "none", I] }],
      grow: [{ grow: M() }],
      shrink: [{ shrink: M() }],
      order: [{ order: ["first", "last", "none", Le, I] }],
      "grid-cols": [{ "grid-cols": [Fe] }],
      "col-start-end": [{ col: ["auto", { span: ["full", Le, I] }, I] }],
      "col-start": [{ "col-start": A() }],
      "col-end": [{ "col-end": A() }],
      "grid-rows": [{ "grid-rows": [Fe] }],
      "row-start-end": [{ row: ["auto", { span: [Le, I] }, I] }],
      "row-start": [{ "row-start": A() }],
      "row-end": [{ "row-end": A() }],
      "grid-flow": [
        { "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] },
      ],
      "auto-cols": [{ "auto-cols": ["auto", "min", "max", "fr", I] }],
      "auto-rows": [{ "auto-rows": ["auto", "min", "max", "fr", I] }],
      gap: [{ gap: [h] }],
      "gap-x": [{ "gap-x": [h] }],
      "gap-y": [{ "gap-y": [h] }],
      "justify-content": [{ justify: ["normal", ...W()] }],
      "justify-items": [
        { "justify-items": ["start", "end", "center", "stretch"] },
      ],
      "justify-self": [
        { "justify-self": ["auto", "start", "end", "center", "stretch"] },
      ],
      "align-content": [{ content: ["normal", ...W(), "baseline"] }],
      "align-items": [
        { items: ["start", "end", "center", "baseline", "stretch"] },
      ],
      "align-self": [
        { self: ["auto", "start", "end", "center", "stretch", "baseline"] },
      ],
      "place-content": [{ "place-content": [...W(), "baseline"] }],
      "place-items": [
        { "place-items": ["start", "end", "center", "baseline", "stretch"] },
      ],
      "place-self": [
        { "place-self": ["auto", "start", "end", "center", "stretch"] },
      ],
      p: [{ p: [b] }],
      px: [{ px: [b] }],
      py: [{ py: [b] }],
      ps: [{ ps: [b] }],
      pe: [{ pe: [b] }],
      pt: [{ pt: [b] }],
      pr: [{ pr: [b] }],
      pb: [{ pb: [b] }],
      pl: [{ pl: [b] }],
      m: [{ m: [v] }],
      mx: [{ mx: [v] }],
      my: [{ my: [v] }],
      ms: [{ ms: [v] }],
      me: [{ me: [v] }],
      mt: [{ mt: [v] }],
      mr: [{ mr: [v] }],
      mb: [{ mb: [v] }],
      ml: [{ ml: [v] }],
      "space-x": [{ "space-x": [S] }],
      "space-x-reverse": ["space-x-reverse"],
      "space-y": [{ "space-y": [S] }],
      "space-y-reverse": ["space-y-reverse"],
      w: [{ w: ["auto", "min", "max", "fit", I, t] }],
      "min-w": [{ "min-w": ["min", "max", "fit", I, ee] }],
      "max-w": [
        {
          "max-w": [
            "0",
            "none",
            "full",
            "min",
            "max",
            "fit",
            "prose",
            { screen: [pe] },
            pe,
            I,
          ],
        },
      ],
      h: [{ h: [I, t, "auto", "min", "max", "fit"] }],
      "min-h": [{ "min-h": ["min", "max", "fit", ee, I] }],
      "max-h": [{ "max-h": [I, t, "min", "max", "fit"] }],
      "font-size": [{ text: ["base", pe, fe] }],
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      "font-style": ["italic", "not-italic"],
      "font-weight": [
        {
          font: [
            "thin",
            "extralight",
            "light",
            "normal",
            "medium",
            "semibold",
            "bold",
            "extrabold",
            "black",
            tt,
          ],
        },
      ],
      "font-family": [{ font: [Fe] }],
      "fvn-normal": ["normal-nums"],
      "fvn-ordinal": ["ordinal"],
      "fvn-slashed-zero": ["slashed-zero"],
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      "fvn-fraction": ["diagonal-fractions", "stacked-fractons"],
      tracking: [
        {
          tracking: [
            "tighter",
            "tight",
            "normal",
            "wide",
            "wider",
            "widest",
            I,
          ],
        },
      ],
      "line-clamp": [{ "line-clamp": ["none", xe, tt] }],
      leading: [
        {
          leading: [
            "none",
            "tight",
            "snug",
            "normal",
            "relaxed",
            "loose",
            ee,
            I,
          ],
        },
      ],
      "list-image": [{ "list-image": ["none", I] }],
      "list-style-type": [{ list: ["none", "disc", "decimal", I] }],
      "list-style-position": [{ list: ["inside", "outside"] }],
      "placeholder-color": [{ placeholder: [e] }],
      "placeholder-opacity": [{ "placeholder-opacity": [x] }],
      "text-alignment": [
        { text: ["left", "center", "right", "justify", "start", "end"] },
      ],
      "text-color": [{ text: [e] }],
      "text-opacity": [{ "text-opacity": [x] }],
      "text-decoration": [
        "underline",
        "overline",
        "line-through",
        "no-underline",
      ],
      "text-decoration-style": [{ decoration: [...O(), "wavy"] }],
      "text-decoration-thickness": [
        { decoration: ["auto", "from-font", ee, fe] },
      ],
      "underline-offset": [{ "underline-offset": ["auto", ee, I] }],
      "text-decoration-color": [{ decoration: [e] }],
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      indent: [{ indent: P() }],
      "vertical-align": [
        {
          align: [
            "baseline",
            "top",
            "middle",
            "bottom",
            "text-top",
            "text-bottom",
            "sub",
            "super",
            I,
          ],
        },
      ],
      whitespace: [
        {
          whitespace: [
            "normal",
            "nowrap",
            "pre",
            "pre-line",
            "pre-wrap",
            "break-spaces",
          ],
        },
      ],
      break: [{ break: ["normal", "words", "all", "keep"] }],
      hyphens: [{ hyphens: ["none", "manual", "auto"] }],
      content: [{ content: ["none", I] }],
      "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
      "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
      "bg-opacity": [{ "bg-opacity": [x] }],
      "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
      "bg-position": [{ bg: [...D(), ks] }],
      "bg-repeat": [
        { bg: ["no-repeat", { repeat: ["", "x", "y", "round", "space"] }] },
      ],
      "bg-size": [{ bg: ["auto", "cover", "contain", Os] }],
      "bg-image": [
        {
          bg: [
            "none",
            { "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"] },
            Ds,
          ],
        },
      ],
      "bg-color": [{ bg: [e] }],
      "gradient-from-pos": [{ from: [g] }],
      "gradient-via-pos": [{ via: [g] }],
      "gradient-to-pos": [{ to: [g] }],
      "gradient-from": [{ from: [m] }],
      "gradient-via": [{ via: [m] }],
      "gradient-to": [{ to: [m] }],
      rounded: [{ rounded: [i] }],
      "rounded-s": [{ "rounded-s": [i] }],
      "rounded-e": [{ "rounded-e": [i] }],
      "rounded-t": [{ "rounded-t": [i] }],
      "rounded-r": [{ "rounded-r": [i] }],
      "rounded-b": [{ "rounded-b": [i] }],
      "rounded-l": [{ "rounded-l": [i] }],
      "rounded-ss": [{ "rounded-ss": [i] }],
      "rounded-se": [{ "rounded-se": [i] }],
      "rounded-ee": [{ "rounded-ee": [i] }],
      "rounded-es": [{ "rounded-es": [i] }],
      "rounded-tl": [{ "rounded-tl": [i] }],
      "rounded-tr": [{ "rounded-tr": [i] }],
      "rounded-br": [{ "rounded-br": [i] }],
      "rounded-bl": [{ "rounded-bl": [i] }],
      "border-w": [{ border: [c] }],
      "border-w-x": [{ "border-x": [c] }],
      "border-w-y": [{ "border-y": [c] }],
      "border-w-s": [{ "border-s": [c] }],
      "border-w-e": [{ "border-e": [c] }],
      "border-w-t": [{ "border-t": [c] }],
      "border-w-r": [{ "border-r": [c] }],
      "border-w-b": [{ "border-b": [c] }],
      "border-w-l": [{ "border-l": [c] }],
      "border-opacity": [{ "border-opacity": [x] }],
      "border-style": [{ border: [...O(), "hidden"] }],
      "divide-x": [{ "divide-x": [c] }],
      "divide-x-reverse": ["divide-x-reverse"],
      "divide-y": [{ "divide-y": [c] }],
      "divide-y-reverse": ["divide-y-reverse"],
      "divide-opacity": [{ "divide-opacity": [x] }],
      "divide-style": [{ divide: O() }],
      "border-color": [{ border: [r] }],
      "border-color-x": [{ "border-x": [r] }],
      "border-color-y": [{ "border-y": [r] }],
      "border-color-t": [{ "border-t": [r] }],
      "border-color-r": [{ "border-r": [r] }],
      "border-color-b": [{ "border-b": [r] }],
      "border-color-l": [{ "border-l": [r] }],
      "divide-color": [{ divide: [r] }],
      "outline-style": [{ outline: ["", ...O()] }],
      "outline-offset": [{ "outline-offset": [ee, I] }],
      "outline-w": [{ outline: [ee, fe] }],
      "outline-color": [{ outline: [e] }],
      "ring-w": [{ ring: G() }],
      "ring-w-inset": ["ring-inset"],
      "ring-color": [{ ring: [e] }],
      "ring-opacity": [{ "ring-opacity": [x] }],
      "ring-offset-w": [{ "ring-offset": [ee, fe] }],
      "ring-offset-color": [{ "ring-offset": [e] }],
      shadow: [{ shadow: ["", "inner", "none", pe, Ls] }],
      "shadow-color": [{ shadow: [Fe] }],
      opacity: [{ opacity: [x] }],
      "mix-blend": [{ "mix-blend": B() }],
      "bg-blend": [{ "bg-blend": B() }],
      filter: [{ filter: ["", "none"] }],
      blur: [{ blur: [n] }],
      brightness: [{ brightness: [o] }],
      contrast: [{ contrast: [l] }],
      "drop-shadow": [{ "drop-shadow": ["", "none", pe, I] }],
      grayscale: [{ grayscale: [u] }],
      "hue-rotate": [{ "hue-rotate": [f] }],
      invert: [{ invert: [d] }],
      saturate: [{ saturate: [w] }],
      sepia: [{ sepia: [E] }],
      "backdrop-filter": [{ "backdrop-filter": ["", "none"] }],
      "backdrop-blur": [{ "backdrop-blur": [n] }],
      "backdrop-brightness": [{ "backdrop-brightness": [o] }],
      "backdrop-contrast": [{ "backdrop-contrast": [l] }],
      "backdrop-grayscale": [{ "backdrop-grayscale": [u] }],
      "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [f] }],
      "backdrop-invert": [{ "backdrop-invert": [d] }],
      "backdrop-opacity": [{ "backdrop-opacity": [x] }],
      "backdrop-saturate": [{ "backdrop-saturate": [w] }],
      "backdrop-sepia": [{ "backdrop-sepia": [E] }],
      "border-collapse": [{ border: ["collapse", "separate"] }],
      "border-spacing": [{ "border-spacing": [s] }],
      "border-spacing-x": [{ "border-spacing-x": [s] }],
      "border-spacing-y": [{ "border-spacing-y": [s] }],
      "table-layout": [{ table: ["auto", "fixed"] }],
      caption: [{ caption: ["top", "bottom"] }],
      transition: [
        {
          transition: [
            "none",
            "all",
            "",
            "colors",
            "opacity",
            "shadow",
            "transform",
            I,
          ],
        },
      ],
      duration: [{ duration: V() }],
      ease: [{ ease: ["linear", "in", "out", "in-out", I] }],
      delay: [{ delay: V() }],
      animate: [{ animate: ["none", "spin", "ping", "pulse", "bounce", I] }],
      transform: [{ transform: ["", "gpu", "none"] }],
      scale: [{ scale: [y] }],
      "scale-x": [{ "scale-x": [y] }],
      "scale-y": [{ "scale-y": [y] }],
      rotate: [{ rotate: [Le, I] }],
      "translate-x": [{ "translate-x": [R] }],
      "translate-y": [{ "translate-y": [R] }],
      "skew-x": [{ "skew-x": [C] }],
      "skew-y": [{ "skew-y": [C] }],
      "transform-origin": [
        {
          origin: [
            "center",
            "top",
            "top-right",
            "right",
            "bottom-right",
            "bottom",
            "bottom-left",
            "left",
            "top-left",
            I,
          ],
        },
      ],
      accent: [{ accent: ["auto", e] }],
      appearance: ["appearance-none"],
      cursor: [
        {
          cursor: [
            "auto",
            "default",
            "pointer",
            "wait",
            "text",
            "move",
            "help",
            "not-allowed",
            "none",
            "context-menu",
            "progress",
            "cell",
            "crosshair",
            "vertical-text",
            "alias",
            "copy",
            "no-drop",
            "grab",
            "grabbing",
            "all-scroll",
            "col-resize",
            "row-resize",
            "n-resize",
            "e-resize",
            "s-resize",
            "w-resize",
            "ne-resize",
            "nw-resize",
            "se-resize",
            "sw-resize",
            "ew-resize",
            "ns-resize",
            "nesw-resize",
            "nwse-resize",
            "zoom-in",
            "zoom-out",
            I,
          ],
        },
      ],
      "caret-color": [{ caret: [e] }],
      "pointer-events": [{ "pointer-events": ["none", "auto"] }],
      resize: [{ resize: ["none", "y", "x", ""] }],
      "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
      "scroll-m": [{ "scroll-m": P() }],
      "scroll-mx": [{ "scroll-mx": P() }],
      "scroll-my": [{ "scroll-my": P() }],
      "scroll-ms": [{ "scroll-ms": P() }],
      "scroll-me": [{ "scroll-me": P() }],
      "scroll-mt": [{ "scroll-mt": P() }],
      "scroll-mr": [{ "scroll-mr": P() }],
      "scroll-mb": [{ "scroll-mb": P() }],
      "scroll-ml": [{ "scroll-ml": P() }],
      "scroll-p": [{ "scroll-p": P() }],
      "scroll-px": [{ "scroll-px": P() }],
      "scroll-py": [{ "scroll-py": P() }],
      "scroll-ps": [{ "scroll-ps": P() }],
      "scroll-pe": [{ "scroll-pe": P() }],
      "scroll-pt": [{ "scroll-pt": P() }],
      "scroll-pr": [{ "scroll-pr": P() }],
      "scroll-pb": [{ "scroll-pb": P() }],
      "scroll-pl": [{ "scroll-pl": P() }],
      "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
      "snap-stop": [{ snap: ["normal", "always"] }],
      "snap-type": [{ snap: ["none", "x", "y", "both"] }],
      "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
      touch: [{ touch: ["auto", "none", "manipulation"] }],
      "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
      "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
      "touch-pz": ["touch-pinch-zoom"],
      select: [{ select: ["none", "text", "all", "auto"] }],
      "will-change": [
        { "will-change": ["auto", "scroll", "contents", "transform", I] },
      ],
      fill: [{ fill: [e, "none"] }],
      "stroke-w": [{ stroke: [ee, fe, tt] }],
      stroke: [{ stroke: [e, "none"] }],
      sr: ["sr-only", "not-sr-only"],
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: [
        "inset-x",
        "inset-y",
        "start",
        "end",
        "top",
        "right",
        "bottom",
        "left",
      ],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      "font-size": ["leading"],
      "fvn-normal": [
        "fvn-ordinal",
        "fvn-slashed-zero",
        "fvn-figure",
        "fvn-spacing",
        "fvn-fraction",
      ],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      rounded: [
        "rounded-s",
        "rounded-e",
        "rounded-t",
        "rounded-r",
        "rounded-b",
        "rounded-l",
        "rounded-ss",
        "rounded-se",
        "rounded-ee",
        "rounded-es",
        "rounded-tl",
        "rounded-tr",
        "rounded-br",
        "rounded-bl",
      ],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": [
        "border-w-s",
        "border-w-e",
        "border-w-t",
        "border-w-r",
        "border-w-b",
        "border-w-l",
      ],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": [
        "border-color-t",
        "border-color-r",
        "border-color-b",
        "border-color-l",
      ],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": [
        "scroll-mx",
        "scroll-my",
        "scroll-ms",
        "scroll-me",
        "scroll-mt",
        "scroll-mr",
        "scroll-mb",
        "scroll-ml",
      ],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": [
        "scroll-px",
        "scroll-py",
        "scroll-ps",
        "scroll-pe",
        "scroll-pt",
        "scroll-pr",
        "scroll-pb",
        "scroll-pl",
      ],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"],
    },
    conflictingClassGroupModifiers: { "font-size": ["leading"] },
  };
}
const Ws = Es(Bs);
function ae(...e) {
  return Ws(Mo(e));
}
const Us = ds(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
      variants: {
        variant: {
          default:
            "bg-primary text-primary-foreground shadow hover:bg-primary/90",
          destructive:
            "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
          outline:
            "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
          secondary:
            "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
          default: "h-9 px-4 py-2",
          sm: "h-8 rounded-md px-3 text-xs",
          lg: "h-10 rounded-md px-8",
          icon: "h-9 w-9",
        },
      },
      defaultVariants: { variant: "default", size: "default" },
    },
  ),
  un = a.forwardRef(
    ({ className: e, variant: t, size: n, asChild: o = !1, ...r }, i) => {
      const s = o ? Me : "button";
      return $.jsx(s, {
        className: ae(Us({ variant: t, size: n, className: e })),
        ref: i,
        ...r,
      });
    },
  );
un.displayName = "Button";
function Gs() {
  return $.jsx("div", {
    className: "space-x-2",
    children: Uu.map(({ display: e, name: t }) =>
      $.jsx(
        Hr,
        {
          href: route(t),
          children: $.jsx(un, { variant: "outline", children: e }),
        },
        t,
      ),
    ),
  });
} /**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Vs = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
}; /**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ks = (e) =>
    e
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase()
      .trim(),
  ko = (e, t) => {
    const n = a.forwardRef(
      (
        {
          color: o = "currentColor",
          size: r = 24,
          strokeWidth: i = 2,
          absoluteStrokeWidth: s,
          className: c = "",
          children: l,
          ...u
        },
        f,
      ) =>
        a.createElement(
          "svg",
          {
            ref: f,
            ...Vs,
            width: r,
            height: r,
            stroke: o,
            strokeWidth: s ? (Number(i) * 24) / Number(r) : i,
            className: ["lucide", `lucide-${Ks(e)}`, c].join(" "),
            ...u,
          },
          [
            ...t.map(([d, h]) => a.createElement(d, h)),
            ...(Array.isArray(l) ? l : [l]),
          ],
        ),
    );
    return (n.displayName = `${e}`), n;
  }; /**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hs = ko("Moon", [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }],
]); /**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ys = ko("Sun", [
    ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M12 20v2", key: "1lh1kg" }],
    ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
    ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "M20 12h2", key: "1q8mjw" }],
    ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
    ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }],
  ]),
  Xs = { theme: "system", setTheme: () => null },
  No = a.createContext(Xs);
function qs({
  children: e,
  defaultTheme: t = "system",
  storageKey: n = "vite-ui-theme",
  ...o
}) {
  if (typeof window > "u") return null;
  const [r, i] = a.useState(() => localStorage.getItem(n) ?? t);
  a.useEffect(() => {
    const c = window.document.documentElement;
    if ((c.classList.remove("light", "dark"), r === "system")) {
      const l = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      c.classList.add(l);
      return;
    }
    c.classList.add(r);
  }, [r]);
  const s = {
    theme: r,
    setTheme: (c) => {
      localStorage.setItem(n, c), i(c);
    },
  };
  return $.jsx(No.Provider, { ...o, value: s, children: e });
}
const Zs = () => {
  const e = a.useContext(No);
  if (e === void 0)
    throw new Error("useTheme must be used within a ThemeProvider");
  return e;
};
function N(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function (r) {
    if ((e == null || e(r), n === !1 || !r.defaultPrevented))
      return t == null ? void 0 : t(r);
  };
}
function He(e, t = []) {
  let n = [];
  function o(i, s) {
    const c = a.createContext(s),
      l = n.length;
    n = [...n, s];
    function u(d) {
      const { scope: h, children: m, ...g } = d,
        p = (h == null ? void 0 : h[e][l]) || c,
        v = a.useMemo(() => g, Object.values(g));
      return a.createElement(p.Provider, { value: v }, m);
    }
    function f(d, h) {
      const m = (h == null ? void 0 : h[e][l]) || c,
        g = a.useContext(m);
      if (g) return g;
      if (s !== void 0) return s;
      throw new Error(`\`${d}\` must be used within \`${i}\``);
    }
    return (u.displayName = i + "Provider"), [u, f];
  }
  const r = () => {
    const i = n.map((s) => a.createContext(s));
    return function (c) {
      const l = (c == null ? void 0 : c[e]) || i;
      return a.useMemo(() => ({ [`__scope${e}`]: { ...c, [e]: l } }), [c, l]);
    };
  };
  return (r.scopeName = e), [o, Qs(r, ...t)];
}
function Qs(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const o = e.map((r) => ({ useScope: r(), scopeName: r.scopeName }));
    return function (i) {
      const s = o.reduce((c, { useScope: l, scopeName: u }) => {
        const d = l(i)[`__scope${u}`];
        return { ...c, ...d };
      }, {});
      return a.useMemo(() => ({ [`__scope${t.scopeName}`]: s }), [s]);
    };
  };
  return (n.scopeName = t.scopeName), n;
}
function oe(e) {
  const t = a.useRef(e);
  return (
    a.useEffect(() => {
      t.current = e;
    }),
    a.useMemo(
      () =>
        (...n) => {
          var o;
          return (o = t.current) === null || o === void 0
            ? void 0
            : o.call(t, ...n);
        },
      [],
    )
  );
}
function Do({ prop: e, defaultProp: t, onChange: n = () => {} }) {
  const [o, r] = Js({ defaultProp: t, onChange: n }),
    i = e !== void 0,
    s = i ? e : o,
    c = oe(n),
    l = a.useCallback(
      (u) => {
        if (i) {
          const d = typeof u == "function" ? u(e) : u;
          d !== e && c(d);
        } else r(u);
      },
      [i, e, r, c],
    );
  return [s, l];
}
function Js({ defaultProp: e, onChange: t }) {
  const n = a.useState(e),
    [o] = n,
    r = a.useRef(o),
    i = oe(t);
  return (
    a.useEffect(() => {
      r.current !== o && (i(o), (r.current = o));
    }, [o, r, i]),
    n
  );
}
const ec = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "span",
    "svg",
    "ul",
  ],
  Z = ec.reduce((e, t) => {
    const n = a.forwardRef((o, r) => {
      const { asChild: i, ...s } = o,
        c = i ? Me : t;
      return (
        a.useEffect(() => {
          window[Symbol.for("radix-ui")] = !0;
        }, []),
        a.createElement(c, T({}, s, { ref: r }))
      );
    });
    return (n.displayName = `Primitive.${t}`), { ...e, [t]: n };
  }, {});
function Lo(e, t) {
  e && Jt.flushSync(() => e.dispatchEvent(t));
}
function Fo(e) {
  const t = e + "CollectionProvider",
    [n, o] = He(t),
    [r, i] = n(t, { collectionRef: { current: null }, itemMap: new Map() }),
    s = (m) => {
      const { scope: g, children: p } = m,
        v = U.useRef(null),
        x = U.useRef(new Map()).current;
      return U.createElement(r, { scope: g, itemMap: x, collectionRef: v }, p);
    },
    c = e + "CollectionSlot",
    l = U.forwardRef((m, g) => {
      const { scope: p, children: v } = m,
        x = i(c, p),
        b = X(g, x.collectionRef);
      return U.createElement(Me, { ref: b }, v);
    }),
    u = e + "CollectionItemSlot",
    f = "data-radix-collection-item",
    d = U.forwardRef((m, g) => {
      const { scope: p, children: v, ...x } = m,
        b = U.useRef(null),
        w = X(g, b),
        y = i(u, p);
      return (
        U.useEffect(
          () => (
            y.itemMap.set(b, { ref: b, ...x }), () => void y.itemMap.delete(b)
          ),
        ),
        U.createElement(Me, { [f]: "", ref: w }, v)
      );
    });
  function h(m) {
    const g = i(e + "CollectionConsumer", m);
    return U.useCallback(() => {
      const v = g.collectionRef.current;
      if (!v) return [];
      const x = Array.from(v.querySelectorAll(`[${f}]`));
      return Array.from(g.itemMap.values()).sort(
        (y, E) => x.indexOf(y.ref.current) - x.indexOf(E.ref.current),
      );
    }, [g.collectionRef, g.itemMap]);
  }
  return [{ Provider: s, Slot: l, ItemSlot: d }, h, o];
}
const tc = a.createContext(void 0);
function jo(e) {
  const t = a.useContext(tc);
  return e || t || "ltr";
}
function nc(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = oe(e);
  a.useEffect(() => {
    const o = (r) => {
      r.key === "Escape" && n(r);
    };
    return (
      t.addEventListener("keydown", o),
      () => t.removeEventListener("keydown", o)
    );
  }, [n, t]);
}
const Vt = "dismissableLayer.update",
  oc = "dismissableLayer.pointerDownOutside",
  rc = "dismissableLayer.focusOutside";
let Bn;
const ic = a.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
  }),
  sc = a.forwardRef((e, t) => {
    var n;
    const {
        disableOutsidePointerEvents: o = !1,
        onEscapeKeyDown: r,
        onPointerDownOutside: i,
        onFocusOutside: s,
        onInteractOutside: c,
        onDismiss: l,
        ...u
      } = e,
      f = a.useContext(ic),
      [d, h] = a.useState(null),
      m =
        (n = d == null ? void 0 : d.ownerDocument) !== null && n !== void 0
          ? n
          : globalThis == null
            ? void 0
            : globalThis.document,
      [, g] = a.useState({}),
      p = X(t, (R) => h(R)),
      v = Array.from(f.layers),
      [x] = [...f.layersWithOutsidePointerEventsDisabled].slice(-1),
      b = v.indexOf(x),
      w = d ? v.indexOf(d) : -1,
      y = f.layersWithOutsidePointerEventsDisabled.size > 0,
      E = w >= b,
      C = cc((R) => {
        const _ = R.target,
          k = [...f.branches].some((L) => L.contains(_));
        !E ||
          k ||
          (i == null || i(R),
          c == null || c(R),
          R.defaultPrevented || l == null || l());
      }, m),
      S = ac((R) => {
        const _ = R.target;
        [...f.branches].some((L) => L.contains(_)) ||
          (s == null || s(R),
          c == null || c(R),
          R.defaultPrevented || l == null || l());
      }, m);
    return (
      nc((R) => {
        w === f.layers.size - 1 &&
          (r == null || r(R),
          !R.defaultPrevented && l && (R.preventDefault(), l()));
      }, m),
      a.useEffect(() => {
        if (d)
          return (
            o &&
              (f.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((Bn = m.body.style.pointerEvents),
                (m.body.style.pointerEvents = "none")),
              f.layersWithOutsidePointerEventsDisabled.add(d)),
            f.layers.add(d),
            Wn(),
            () => {
              o &&
                f.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (m.body.style.pointerEvents = Bn);
            }
          );
      }, [d, m, o, f]),
      a.useEffect(
        () => () => {
          d &&
            (f.layers.delete(d),
            f.layersWithOutsidePointerEventsDisabled.delete(d),
            Wn());
        },
        [d, f],
      ),
      a.useEffect(() => {
        const R = () => g({});
        return (
          document.addEventListener(Vt, R),
          () => document.removeEventListener(Vt, R)
        );
      }, []),
      a.createElement(
        Z.div,
        T({}, u, {
          ref: p,
          style: {
            pointerEvents: y ? (E ? "auto" : "none") : void 0,
            ...e.style,
          },
          onFocusCapture: N(e.onFocusCapture, S.onFocusCapture),
          onBlurCapture: N(e.onBlurCapture, S.onBlurCapture),
          onPointerDownCapture: N(
            e.onPointerDownCapture,
            C.onPointerDownCapture,
          ),
        }),
      )
    );
  });
function cc(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = oe(e),
    o = a.useRef(!1),
    r = a.useRef(() => {});
  return (
    a.useEffect(() => {
      const i = (c) => {
          if (c.target && !o.current) {
            let u = function () {
              zo(oc, n, l, { discrete: !0 });
            };
            const l = { originalEvent: c };
            c.pointerType === "touch"
              ? (t.removeEventListener("click", r.current),
                (r.current = u),
                t.addEventListener("click", r.current, { once: !0 }))
              : u();
          } else t.removeEventListener("click", r.current);
          o.current = !1;
        },
        s = window.setTimeout(() => {
          t.addEventListener("pointerdown", i);
        }, 0);
      return () => {
        window.clearTimeout(s),
          t.removeEventListener("pointerdown", i),
          t.removeEventListener("click", r.current);
      };
    }, [t, n]),
    { onPointerDownCapture: () => (o.current = !0) }
  );
}
function ac(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = oe(e),
    o = a.useRef(!1);
  return (
    a.useEffect(() => {
      const r = (i) => {
        i.target &&
          !o.current &&
          zo(rc, n, { originalEvent: i }, { discrete: !1 });
      };
      return (
        t.addEventListener("focusin", r),
        () => t.removeEventListener("focusin", r)
      );
    }, [t, n]),
    {
      onFocusCapture: () => (o.current = !0),
      onBlurCapture: () => (o.current = !1),
    }
  );
}
function Wn() {
  const e = new CustomEvent(Vt);
  document.dispatchEvent(e);
}
function zo(e, t, n, { discrete: o }) {
  const r = n.originalEvent.target,
    i = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && r.addEventListener(e, t, { once: !0 }),
    o ? Lo(r, i) : r.dispatchEvent(i);
}
let Tt = 0;
function lc() {
  a.useEffect(() => {
    var e, t;
    const n = document.querySelectorAll("[data-radix-focus-guard]");
    return (
      document.body.insertAdjacentElement(
        "afterbegin",
        (e = n[0]) !== null && e !== void 0 ? e : Un(),
      ),
      document.body.insertAdjacentElement(
        "beforeend",
        (t = n[1]) !== null && t !== void 0 ? t : Un(),
      ),
      Tt++,
      () => {
        Tt === 1 &&
          document
            .querySelectorAll("[data-radix-focus-guard]")
            .forEach((o) => o.remove()),
          Tt--;
      }
    );
  }, []);
}
function Un() {
  const e = document.createElement("span");
  return (
    e.setAttribute("data-radix-focus-guard", ""),
    (e.tabIndex = 0),
    (e.style.cssText =
      "outline: none; opacity: 0; position: fixed; pointer-events: none"),
    e
  );
}
const _t = "focusScope.autoFocusOnMount",
  It = "focusScope.autoFocusOnUnmount",
  Gn = { bubbles: !1, cancelable: !0 },
  uc = a.forwardRef((e, t) => {
    const {
        loop: n = !1,
        trapped: o = !1,
        onMountAutoFocus: r,
        onUnmountAutoFocus: i,
        ...s
      } = e,
      [c, l] = a.useState(null),
      u = oe(r),
      f = oe(i),
      d = a.useRef(null),
      h = X(t, (p) => l(p)),
      m = a.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    a.useEffect(() => {
      if (o) {
        let p = function (w) {
            if (m.paused || !c) return;
            const y = w.target;
            c.contains(y) ? (d.current = y) : me(d.current, { select: !0 });
          },
          v = function (w) {
            if (m.paused || !c) return;
            const y = w.relatedTarget;
            y !== null && (c.contains(y) || me(d.current, { select: !0 }));
          },
          x = function (w) {
            if (document.activeElement === document.body)
              for (const E of w) E.removedNodes.length > 0 && me(c);
          };
        document.addEventListener("focusin", p),
          document.addEventListener("focusout", v);
        const b = new MutationObserver(x);
        return (
          c && b.observe(c, { childList: !0, subtree: !0 }),
          () => {
            document.removeEventListener("focusin", p),
              document.removeEventListener("focusout", v),
              b.disconnect();
          }
        );
      }
    }, [o, c, m.paused]),
      a.useEffect(() => {
        if (c) {
          Kn.add(m);
          const p = document.activeElement;
          if (!c.contains(p)) {
            const x = new CustomEvent(_t, Gn);
            c.addEventListener(_t, u),
              c.dispatchEvent(x),
              x.defaultPrevented ||
                (dc(gc(Bo(c)), { select: !0 }),
                document.activeElement === p && me(c));
          }
          return () => {
            c.removeEventListener(_t, u),
              setTimeout(() => {
                const x = new CustomEvent(It, Gn);
                c.addEventListener(It, f),
                  c.dispatchEvent(x),
                  x.defaultPrevented || me(p ?? document.body, { select: !0 }),
                  c.removeEventListener(It, f),
                  Kn.remove(m);
              }, 0);
          };
        }
      }, [c, u, f, m]);
    const g = a.useCallback(
      (p) => {
        if ((!n && !o) || m.paused) return;
        const v = p.key === "Tab" && !p.altKey && !p.ctrlKey && !p.metaKey,
          x = document.activeElement;
        if (v && x) {
          const b = p.currentTarget,
            [w, y] = fc(b);
          w && y
            ? !p.shiftKey && x === y
              ? (p.preventDefault(), n && me(w, { select: !0 }))
              : p.shiftKey &&
                x === w &&
                (p.preventDefault(), n && me(y, { select: !0 }))
            : x === b && p.preventDefault();
        }
      },
      [n, o, m.paused],
    );
    return a.createElement(
      Z.div,
      T({ tabIndex: -1 }, s, { ref: h, onKeyDown: g }),
    );
  });
function dc(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const o of e)
    if ((me(o, { select: t }), document.activeElement !== n)) return;
}
function fc(e) {
  const t = Bo(e),
    n = Vn(t, e),
    o = Vn(t.reverse(), e);
  return [n, o];
}
function Bo(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (o) => {
        const r = o.tagName === "INPUT" && o.type === "hidden";
        return o.disabled || o.hidden || r
          ? NodeFilter.FILTER_SKIP
          : o.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function Vn(e, t) {
  for (const n of e) if (!pc(n, { upTo: t })) return n;
}
function pc(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function mc(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function me(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && mc(e) && t && e.select();
  }
}
const Kn = hc();
function hc() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), (e = Hn(e, t)), e.unshift(t);
    },
    remove(t) {
      var n;
      (e = Hn(e, t)), (n = e[0]) === null || n === void 0 || n.resume();
    },
  };
}
function Hn(e, t) {
  const n = [...e],
    o = n.indexOf(t);
  return o !== -1 && n.splice(o, 1), n;
}
function gc(e) {
  return e.filter((t) => t.tagName !== "A");
}
const Te =
    globalThis != null && globalThis.document ? a.useLayoutEffect : () => {},
  vc = Yr["useId".toString()] || (() => {});
let bc = 0;
function Kt(e) {
  const [t, n] = a.useState(vc());
  return (
    Te(() => {
      e || n((o) => o ?? String(bc++));
    }, [e]),
    e || (t ? `radix-${t}` : "")
  );
}
const xc = ["top", "right", "bottom", "left"],
  he = Math.min,
  H = Math.max,
  ht = Math.round,
  nt = Math.floor,
  ge = (e) => ({ x: e, y: e }),
  wc = { left: "right", right: "left", bottom: "top", top: "bottom" },
  yc = { start: "end", end: "start" };
function Ht(e, t, n) {
  return H(e, he(t, n));
}
function ie(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function se(e) {
  return e.split("-")[0];
}
function Ae(e) {
  return e.split("-")[1];
}
function dn(e) {
  return e === "x" ? "y" : "x";
}
function fn(e) {
  return e === "y" ? "height" : "width";
}
function Oe(e) {
  return ["top", "bottom"].includes(se(e)) ? "y" : "x";
}
function pn(e) {
  return dn(Oe(e));
}
function $c(e, t, n) {
  n === void 0 && (n = !1);
  const o = Ae(e),
    r = pn(e),
    i = fn(r);
  let s =
    r === "x"
      ? o === (n ? "end" : "start")
        ? "right"
        : "left"
      : o === "start"
        ? "bottom"
        : "top";
  return t.reference[i] > t.floating[i] && (s = gt(s)), [s, gt(s)];
}
function Cc(e) {
  const t = gt(e);
  return [Yt(e), t, Yt(t)];
}
function Yt(e) {
  return e.replace(/start|end/g, (t) => yc[t]);
}
function Ec(e, t, n) {
  const o = ["left", "right"],
    r = ["right", "left"],
    i = ["top", "bottom"],
    s = ["bottom", "top"];
  switch (e) {
    case "top":
    case "bottom":
      return n ? (t ? r : o) : t ? o : r;
    case "left":
    case "right":
      return t ? i : s;
    default:
      return [];
  }
}
function Sc(e, t, n, o) {
  const r = Ae(e);
  let i = Ec(se(e), n === "start", o);
  return (
    r && ((i = i.map((s) => s + "-" + r)), t && (i = i.concat(i.map(Yt)))), i
  );
}
function gt(e) {
  return e.replace(/left|right|bottom|top/g, (t) => wc[t]);
}
function Rc(e) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...e };
}
function Wo(e) {
  return typeof e != "number"
    ? Rc(e)
    : { top: e, right: e, bottom: e, left: e };
}
function vt(e) {
  return {
    ...e,
    top: e.y,
    left: e.x,
    right: e.x + e.width,
    bottom: e.y + e.height,
  };
}
function Yn(e, t, n) {
  let { reference: o, floating: r } = e;
  const i = Oe(t),
    s = pn(t),
    c = fn(s),
    l = se(t),
    u = i === "y",
    f = o.x + o.width / 2 - r.width / 2,
    d = o.y + o.height / 2 - r.height / 2,
    h = o[c] / 2 - r[c] / 2;
  let m;
  switch (l) {
    case "top":
      m = { x: f, y: o.y - r.height };
      break;
    case "bottom":
      m = { x: f, y: o.y + o.height };
      break;
    case "right":
      m = { x: o.x + o.width, y: d };
      break;
    case "left":
      m = { x: o.x - r.width, y: d };
      break;
    default:
      m = { x: o.x, y: o.y };
  }
  switch (Ae(t)) {
    case "start":
      m[s] -= h * (n && u ? -1 : 1);
      break;
    case "end":
      m[s] += h * (n && u ? -1 : 1);
      break;
  }
  return m;
}
const Pc = async (e, t, n) => {
  const {
      placement: o = "bottom",
      strategy: r = "absolute",
      middleware: i = [],
      platform: s,
    } = n,
    c = i.filter(Boolean),
    l = await (s.isRTL == null ? void 0 : s.isRTL(t));
  let u = await s.getElementRects({ reference: e, floating: t, strategy: r }),
    { x: f, y: d } = Yn(u, o, l),
    h = o,
    m = {},
    g = 0;
  for (let p = 0; p < c.length; p++) {
    const { name: v, fn: x } = c[p],
      {
        x: b,
        y: w,
        data: y,
        reset: E,
      } = await x({
        x: f,
        y: d,
        initialPlacement: o,
        placement: h,
        strategy: r,
        middlewareData: m,
        rects: u,
        platform: s,
        elements: { reference: e, floating: t },
      });
    if (
      ((f = b ?? f),
      (d = w ?? d),
      (m = { ...m, [v]: { ...m[v], ...y } }),
      E && g <= 50)
    ) {
      g++,
        typeof E == "object" &&
          (E.placement && (h = E.placement),
          E.rects &&
            (u =
              E.rects === !0
                ? await s.getElementRects({
                    reference: e,
                    floating: t,
                    strategy: r,
                  })
                : E.rects),
          ({ x: f, y: d } = Yn(u, h, l))),
        (p = -1);
      continue;
    }
  }
  return { x: f, y: d, placement: h, strategy: r, middlewareData: m };
};
async function Ue(e, t) {
  var n;
  t === void 0 && (t = {});
  const { x: o, y: r, platform: i, rects: s, elements: c, strategy: l } = e,
    {
      boundary: u = "clippingAncestors",
      rootBoundary: f = "viewport",
      elementContext: d = "floating",
      altBoundary: h = !1,
      padding: m = 0,
    } = ie(t, e),
    g = Wo(m),
    v = c[h ? (d === "floating" ? "reference" : "floating") : d],
    x = vt(
      await i.getClippingRect({
        element:
          (n = await (i.isElement == null ? void 0 : i.isElement(v))) == null ||
          n
            ? v
            : v.contextElement ||
              (await (i.getDocumentElement == null
                ? void 0
                : i.getDocumentElement(c.floating))),
        boundary: u,
        rootBoundary: f,
        strategy: l,
      }),
    ),
    b = d === "floating" ? { ...s.floating, x: o, y: r } : s.reference,
    w = await (i.getOffsetParent == null
      ? void 0
      : i.getOffsetParent(c.floating)),
    y = (await (i.isElement == null ? void 0 : i.isElement(w)))
      ? (await (i.getScale == null ? void 0 : i.getScale(w))) || { x: 1, y: 1 }
      : { x: 1, y: 1 },
    E = vt(
      i.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
            rect: b,
            offsetParent: w,
            strategy: l,
          })
        : b,
    );
  return {
    top: (x.top - E.top + g.top) / y.y,
    bottom: (E.bottom - x.bottom + g.bottom) / y.y,
    left: (x.left - E.left + g.left) / y.x,
    right: (E.right - x.right + g.right) / y.x,
  };
}
const Xn = (e) => ({
    name: "arrow",
    options: e,
    async fn(t) {
      const {
          x: n,
          y: o,
          placement: r,
          rects: i,
          platform: s,
          elements: c,
          middlewareData: l,
        } = t,
        { element: u, padding: f = 0 } = ie(e, t) || {};
      if (u == null) return {};
      const d = Wo(f),
        h = { x: n, y: o },
        m = pn(r),
        g = fn(m),
        p = await s.getDimensions(u),
        v = m === "y",
        x = v ? "top" : "left",
        b = v ? "bottom" : "right",
        w = v ? "clientHeight" : "clientWidth",
        y = i.reference[g] + i.reference[m] - h[m] - i.floating[g],
        E = h[m] - i.reference[m],
        C = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(u));
      let S = C ? C[w] : 0;
      (!S || !(await (s.isElement == null ? void 0 : s.isElement(C)))) &&
        (S = c.floating[w] || i.floating[g]);
      const R = y / 2 - E / 2,
        _ = S / 2 - p[g] / 2 - 1,
        k = he(d[x], _),
        L = he(d[b], _),
        P = k,
        G = S - p[g] - L,
        A = S / 2 - p[g] / 2 + R,
        D = Ht(P, A, G),
        O =
          !l.arrow &&
          Ae(r) != null &&
          A != D &&
          i.reference[g] / 2 - (A < P ? k : L) - p[g] / 2 < 0,
        B = O ? (A < P ? A - P : A - G) : 0;
      return {
        [m]: h[m] + B,
        data: {
          [m]: D,
          centerOffset: A - D - B,
          ...(O && { alignmentOffset: B }),
        },
        reset: O,
      };
    },
  }),
  Mc = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: "flip",
        options: e,
        async fn(t) {
          var n, o;
          const {
              placement: r,
              middlewareData: i,
              rects: s,
              initialPlacement: c,
              platform: l,
              elements: u,
            } = t,
            {
              mainAxis: f = !0,
              crossAxis: d = !0,
              fallbackPlacements: h,
              fallbackStrategy: m = "bestFit",
              fallbackAxisSideDirection: g = "none",
              flipAlignment: p = !0,
              ...v
            } = ie(e, t);
          if ((n = i.arrow) != null && n.alignmentOffset) return {};
          const x = se(r),
            b = se(c) === c,
            w = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)),
            y = h || (b || !p ? [gt(c)] : Cc(c));
          !h && g !== "none" && y.push(...Sc(c, p, g, w));
          const E = [c, ...y],
            C = await Ue(t, v),
            S = [];
          let R = ((o = i.flip) == null ? void 0 : o.overflows) || [];
          if ((f && S.push(C[x]), d)) {
            const P = $c(r, s, w);
            S.push(C[P[0]], C[P[1]]);
          }
          if (
            ((R = [...R, { placement: r, overflows: S }]),
            !S.every((P) => P <= 0))
          ) {
            var _, k;
            const P = (((_ = i.flip) == null ? void 0 : _.index) || 0) + 1,
              G = E[P];
            if (G)
              return {
                data: { index: P, overflows: R },
                reset: { placement: G },
              };
            let A =
              (k = R.filter((D) => D.overflows[0] <= 0).sort(
                (D, O) => D.overflows[1] - O.overflows[1],
              )[0]) == null
                ? void 0
                : k.placement;
            if (!A)
              switch (m) {
                case "bestFit": {
                  var L;
                  const D =
                    (L = R.map((O) => [
                      O.placement,
                      O.overflows
                        .filter((B) => B > 0)
                        .reduce((B, W) => B + W, 0),
                    ]).sort((O, B) => O[1] - B[1])[0]) == null
                      ? void 0
                      : L[0];
                  D && (A = D);
                  break;
                }
                case "initialPlacement":
                  A = c;
                  break;
              }
            if (r !== A) return { reset: { placement: A } };
          }
          return {};
        },
      }
    );
  };
function qn(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width,
  };
}
function Zn(e) {
  return xc.some((t) => e[t] >= 0);
}
const Tc = function (e) {
  return (
    e === void 0 && (e = {}),
    {
      name: "hide",
      options: e,
      async fn(t) {
        const { rects: n } = t,
          { strategy: o = "referenceHidden", ...r } = ie(e, t);
        switch (o) {
          case "referenceHidden": {
            const i = await Ue(t, { ...r, elementContext: "reference" }),
              s = qn(i, n.reference);
            return {
              data: { referenceHiddenOffsets: s, referenceHidden: Zn(s) },
            };
          }
          case "escaped": {
            const i = await Ue(t, { ...r, altBoundary: !0 }),
              s = qn(i, n.floating);
            return { data: { escapedOffsets: s, escaped: Zn(s) } };
          }
          default:
            return {};
        }
      },
    }
  );
};
async function _c(e, t) {
  const { placement: n, platform: o, elements: r } = e,
    i = await (o.isRTL == null ? void 0 : o.isRTL(r.floating)),
    s = se(n),
    c = Ae(n),
    l = Oe(n) === "y",
    u = ["left", "top"].includes(s) ? -1 : 1,
    f = i && l ? -1 : 1,
    d = ie(t, e);
  let {
    mainAxis: h,
    crossAxis: m,
    alignmentAxis: g,
  } = typeof d == "number"
    ? { mainAxis: d, crossAxis: 0, alignmentAxis: null }
    : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...d };
  return (
    c && typeof g == "number" && (m = c === "end" ? g * -1 : g),
    l ? { x: m * f, y: h * u } : { x: h * u, y: m * f }
  );
}
const Ic = function (e) {
    return (
      e === void 0 && (e = 0),
      {
        name: "offset",
        options: e,
        async fn(t) {
          var n, o;
          const { x: r, y: i, placement: s, middlewareData: c } = t,
            l = await _c(t, e);
          return s === ((n = c.offset) == null ? void 0 : n.placement) &&
            (o = c.arrow) != null &&
            o.alignmentOffset
            ? {}
            : { x: r + l.x, y: i + l.y, data: { ...l, placement: s } };
        },
      }
    );
  },
  Ac = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: "shift",
        options: e,
        async fn(t) {
          const { x: n, y: o, placement: r } = t,
            {
              mainAxis: i = !0,
              crossAxis: s = !1,
              limiter: c = {
                fn: (v) => {
                  let { x, y: b } = v;
                  return { x, y: b };
                },
              },
              ...l
            } = ie(e, t),
            u = { x: n, y: o },
            f = await Ue(t, l),
            d = Oe(se(r)),
            h = dn(d);
          let m = u[h],
            g = u[d];
          if (i) {
            const v = h === "y" ? "top" : "left",
              x = h === "y" ? "bottom" : "right",
              b = m + f[v],
              w = m - f[x];
            m = Ht(b, m, w);
          }
          if (s) {
            const v = d === "y" ? "top" : "left",
              x = d === "y" ? "bottom" : "right",
              b = g + f[v],
              w = g - f[x];
            g = Ht(b, g, w);
          }
          const p = c.fn({ ...t, [h]: m, [d]: g });
          return { ...p, data: { x: p.x - n, y: p.y - o } };
        },
      }
    );
  },
  Oc = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        options: e,
        fn(t) {
          const { x: n, y: o, placement: r, rects: i, middlewareData: s } = t,
            { offset: c = 0, mainAxis: l = !0, crossAxis: u = !0 } = ie(e, t),
            f = { x: n, y: o },
            d = Oe(r),
            h = dn(d);
          let m = f[h],
            g = f[d];
          const p = ie(c, t),
            v =
              typeof p == "number"
                ? { mainAxis: p, crossAxis: 0 }
                : { mainAxis: 0, crossAxis: 0, ...p };
          if (l) {
            const w = h === "y" ? "height" : "width",
              y = i.reference[h] - i.floating[w] + v.mainAxis,
              E = i.reference[h] + i.reference[w] - v.mainAxis;
            m < y ? (m = y) : m > E && (m = E);
          }
          if (u) {
            var x, b;
            const w = h === "y" ? "width" : "height",
              y = ["top", "left"].includes(se(r)),
              E =
                i.reference[d] -
                i.floating[w] +
                ((y && ((x = s.offset) == null ? void 0 : x[d])) || 0) +
                (y ? 0 : v.crossAxis),
              C =
                i.reference[d] +
                i.reference[w] +
                (y ? 0 : ((b = s.offset) == null ? void 0 : b[d]) || 0) -
                (y ? v.crossAxis : 0);
            g < E ? (g = E) : g > C && (g = C);
          }
          return { [h]: m, [d]: g };
        },
      }
    );
  },
  kc = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: "size",
        options: e,
        async fn(t) {
          const { placement: n, rects: o, platform: r, elements: i } = t,
            { apply: s = () => {}, ...c } = ie(e, t),
            l = await Ue(t, c),
            u = se(n),
            f = Ae(n),
            d = Oe(n) === "y",
            { width: h, height: m } = o.floating;
          let g, p;
          u === "top" || u === "bottom"
            ? ((g = u),
              (p =
                f ===
                ((await (r.isRTL == null ? void 0 : r.isRTL(i.floating)))
                  ? "start"
                  : "end")
                  ? "left"
                  : "right"))
            : ((p = u), (g = f === "end" ? "top" : "bottom"));
          const v = m - l[g],
            x = h - l[p],
            b = !t.middlewareData.shift;
          let w = v,
            y = x;
          if (d) {
            const C = h - l.left - l.right;
            y = f || b ? he(x, C) : C;
          } else {
            const C = m - l.top - l.bottom;
            w = f || b ? he(v, C) : C;
          }
          if (b && !f) {
            const C = H(l.left, 0),
              S = H(l.right, 0),
              R = H(l.top, 0),
              _ = H(l.bottom, 0);
            d
              ? (y = h - 2 * (C !== 0 || S !== 0 ? C + S : H(l.left, l.right)))
              : (w = m - 2 * (R !== 0 || _ !== 0 ? R + _ : H(l.top, l.bottom)));
          }
          await s({ ...t, availableWidth: y, availableHeight: w });
          const E = await r.getDimensions(i.floating);
          return h !== E.width || m !== E.height
            ? { reset: { rects: !0 } }
            : {};
        },
      }
    );
  };
function ve(e) {
  return Uo(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Y(e) {
  var t;
  return (
    (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) ||
    window
  );
}
function le(e) {
  var t;
  return (t = (Uo(e) ? e.ownerDocument : e.document) || window.document) == null
    ? void 0
    : t.documentElement;
}
function Uo(e) {
  return e instanceof Node || e instanceof Y(e).Node;
}
function ce(e) {
  return e instanceof Element || e instanceof Y(e).Element;
}
function re(e) {
  return e instanceof HTMLElement || e instanceof Y(e).HTMLElement;
}
function Qn(e) {
  return typeof ShadowRoot > "u"
    ? !1
    : e instanceof ShadowRoot || e instanceof Y(e).ShadowRoot;
}
function Ye(e) {
  const { overflow: t, overflowX: n, overflowY: o, display: r } = q(e);
  return (
    /auto|scroll|overlay|hidden|clip/.test(t + o + n) &&
    !["inline", "contents"].includes(r)
  );
}
function Nc(e) {
  return ["table", "td", "th"].includes(ve(e));
}
function mn(e) {
  const t = hn(),
    n = q(e);
  return (
    n.transform !== "none" ||
    n.perspective !== "none" ||
    (n.containerType ? n.containerType !== "normal" : !1) ||
    (!t && (n.backdropFilter ? n.backdropFilter !== "none" : !1)) ||
    (!t && (n.filter ? n.filter !== "none" : !1)) ||
    ["transform", "perspective", "filter"].some((o) =>
      (n.willChange || "").includes(o),
    ) ||
    ["paint", "layout", "strict", "content"].some((o) =>
      (n.contain || "").includes(o),
    )
  );
}
function Dc(e) {
  let t = _e(e);
  for (; re(t) && !Ct(t); ) {
    if (mn(t)) return t;
    t = _e(t);
  }
  return null;
}
function hn() {
  return typeof CSS > "u" || !CSS.supports
    ? !1
    : CSS.supports("-webkit-backdrop-filter", "none");
}
function Ct(e) {
  return ["html", "body", "#document"].includes(ve(e));
}
function q(e) {
  return Y(e).getComputedStyle(e);
}
function Et(e) {
  return ce(e)
    ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
    : { scrollLeft: e.pageXOffset, scrollTop: e.pageYOffset };
}
function _e(e) {
  if (ve(e) === "html") return e;
  const t = e.assignedSlot || e.parentNode || (Qn(e) && e.host) || le(e);
  return Qn(t) ? t.host : t;
}
function Go(e) {
  const t = _e(e);
  return Ct(t)
    ? e.ownerDocument
      ? e.ownerDocument.body
      : e.body
    : re(t) && Ye(t)
      ? t
      : Go(t);
}
function Ge(e, t, n) {
  var o;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const r = Go(e),
    i = r === ((o = e.ownerDocument) == null ? void 0 : o.body),
    s = Y(r);
  return i
    ? t.concat(
        s,
        s.visualViewport || [],
        Ye(r) ? r : [],
        s.frameElement && n ? Ge(s.frameElement) : [],
      )
    : t.concat(r, Ge(r, [], n));
}
function Vo(e) {
  const t = q(e);
  let n = parseFloat(t.width) || 0,
    o = parseFloat(t.height) || 0;
  const r = re(e),
    i = r ? e.offsetWidth : n,
    s = r ? e.offsetHeight : o,
    c = ht(n) !== i || ht(o) !== s;
  return c && ((n = i), (o = s)), { width: n, height: o, $: c };
}
function gn(e) {
  return ce(e) ? e : e.contextElement;
}
function Pe(e) {
  const t = gn(e);
  if (!re(t)) return ge(1);
  const n = t.getBoundingClientRect(),
    { width: o, height: r, $: i } = Vo(t);
  let s = (i ? ht(n.width) : n.width) / o,
    c = (i ? ht(n.height) : n.height) / r;
  return (
    (!s || !Number.isFinite(s)) && (s = 1),
    (!c || !Number.isFinite(c)) && (c = 1),
    { x: s, y: c }
  );
}
const Lc = ge(0);
function Ko(e) {
  const t = Y(e);
  return !hn() || !t.visualViewport
    ? Lc
    : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
}
function Fc(e, t, n) {
  return t === void 0 && (t = !1), !n || (t && n !== Y(e)) ? !1 : t;
}
function ye(e, t, n, o) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(),
    i = gn(e);
  let s = ge(1);
  t && (o ? ce(o) && (s = Pe(o)) : (s = Pe(e)));
  const c = Fc(i, n, o) ? Ko(i) : ge(0);
  let l = (r.left + c.x) / s.x,
    u = (r.top + c.y) / s.y,
    f = r.width / s.x,
    d = r.height / s.y;
  if (i) {
    const h = Y(i),
      m = o && ce(o) ? Y(o) : o;
    let g = h.frameElement;
    for (; g && o && m !== h; ) {
      const p = Pe(g),
        v = g.getBoundingClientRect(),
        x = q(g),
        b = v.left + (g.clientLeft + parseFloat(x.paddingLeft)) * p.x,
        w = v.top + (g.clientTop + parseFloat(x.paddingTop)) * p.y;
      (l *= p.x),
        (u *= p.y),
        (f *= p.x),
        (d *= p.y),
        (l += b),
        (u += w),
        (g = Y(g).frameElement);
    }
  }
  return vt({ width: f, height: d, x: l, y: u });
}
function jc(e) {
  let { rect: t, offsetParent: n, strategy: o } = e;
  const r = re(n),
    i = le(n);
  if (n === i) return t;
  let s = { scrollLeft: 0, scrollTop: 0 },
    c = ge(1);
  const l = ge(0);
  if (
    (r || (!r && o !== "fixed")) &&
    ((ve(n) !== "body" || Ye(i)) && (s = Et(n)), re(n))
  ) {
    const u = ye(n);
    (c = Pe(n)), (l.x = u.x + n.clientLeft), (l.y = u.y + n.clientTop);
  }
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - s.scrollLeft * c.x + l.x,
    y: t.y * c.y - s.scrollTop * c.y + l.y,
  };
}
function zc(e) {
  return Array.from(e.getClientRects());
}
function Ho(e) {
  return ye(le(e)).left + Et(e).scrollLeft;
}
function Bc(e) {
  const t = le(e),
    n = Et(e),
    o = e.ownerDocument.body,
    r = H(t.scrollWidth, t.clientWidth, o.scrollWidth, o.clientWidth),
    i = H(t.scrollHeight, t.clientHeight, o.scrollHeight, o.clientHeight);
  let s = -n.scrollLeft + Ho(e);
  const c = -n.scrollTop;
  return (
    q(o).direction === "rtl" && (s += H(t.clientWidth, o.clientWidth) - r),
    { width: r, height: i, x: s, y: c }
  );
}
function Wc(e, t) {
  const n = Y(e),
    o = le(e),
    r = n.visualViewport;
  let i = o.clientWidth,
    s = o.clientHeight,
    c = 0,
    l = 0;
  if (r) {
    (i = r.width), (s = r.height);
    const u = hn();
    (!u || (u && t === "fixed")) && ((c = r.offsetLeft), (l = r.offsetTop));
  }
  return { width: i, height: s, x: c, y: l };
}
function Uc(e, t) {
  const n = ye(e, !0, t === "fixed"),
    o = n.top + e.clientTop,
    r = n.left + e.clientLeft,
    i = re(e) ? Pe(e) : ge(1),
    s = e.clientWidth * i.x,
    c = e.clientHeight * i.y,
    l = r * i.x,
    u = o * i.y;
  return { width: s, height: c, x: l, y: u };
}
function Jn(e, t, n) {
  let o;
  if (t === "viewport") o = Wc(e, n);
  else if (t === "document") o = Bc(le(e));
  else if (ce(t)) o = Uc(t, n);
  else {
    const r = Ko(e);
    o = { ...t, x: t.x - r.x, y: t.y - r.y };
  }
  return vt(o);
}
function Yo(e, t) {
  const n = _e(e);
  return n === t || !ce(n) || Ct(n)
    ? !1
    : q(n).position === "fixed" || Yo(n, t);
}
function Gc(e, t) {
  const n = t.get(e);
  if (n) return n;
  let o = Ge(e, [], !1).filter((c) => ce(c) && ve(c) !== "body"),
    r = null;
  const i = q(e).position === "fixed";
  let s = i ? _e(e) : e;
  for (; ce(s) && !Ct(s); ) {
    const c = q(s),
      l = mn(s);
    !l && c.position === "fixed" && (r = null),
      (
        i
          ? !l && !r
          : (!l &&
              c.position === "static" &&
              !!r &&
              ["absolute", "fixed"].includes(r.position)) ||
            (Ye(s) && !l && Yo(e, s))
      )
        ? (o = o.filter((f) => f !== s))
        : (r = c),
      (s = _e(s));
  }
  return t.set(e, o), o;
}
function Vc(e) {
  let { element: t, boundary: n, rootBoundary: o, strategy: r } = e;
  const s = [...(n === "clippingAncestors" ? Gc(t, this._c) : [].concat(n)), o],
    c = s[0],
    l = s.reduce(
      (u, f) => {
        const d = Jn(t, f, r);
        return (
          (u.top = H(d.top, u.top)),
          (u.right = he(d.right, u.right)),
          (u.bottom = he(d.bottom, u.bottom)),
          (u.left = H(d.left, u.left)),
          u
        );
      },
      Jn(t, c, r),
    );
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top,
  };
}
function Kc(e) {
  return Vo(e);
}
function Hc(e, t, n) {
  const o = re(t),
    r = le(t),
    i = n === "fixed",
    s = ye(e, !0, i, t);
  let c = { scrollLeft: 0, scrollTop: 0 };
  const l = ge(0);
  if (o || (!o && !i))
    if (((ve(t) !== "body" || Ye(r)) && (c = Et(t)), o)) {
      const u = ye(t, !0, i, t);
      (l.x = u.x + t.clientLeft), (l.y = u.y + t.clientTop);
    } else r && (l.x = Ho(r));
  return {
    x: s.left + c.scrollLeft - l.x,
    y: s.top + c.scrollTop - l.y,
    width: s.width,
    height: s.height,
  };
}
function eo(e, t) {
  return !re(e) || q(e).position === "fixed" ? null : t ? t(e) : e.offsetParent;
}
function Xo(e, t) {
  const n = Y(e);
  if (!re(e)) return n;
  let o = eo(e, t);
  for (; o && Nc(o) && q(o).position === "static"; ) o = eo(o, t);
  return o &&
    (ve(o) === "html" ||
      (ve(o) === "body" && q(o).position === "static" && !mn(o)))
    ? n
    : o || Dc(e) || n;
}
const Yc = async function (e) {
  let { reference: t, floating: n, strategy: o } = e;
  const r = this.getOffsetParent || Xo,
    i = this.getDimensions;
  return {
    reference: Hc(t, await r(n), o),
    floating: { x: 0, y: 0, ...(await i(n)) },
  };
};
function Xc(e) {
  return q(e).direction === "rtl";
}
const qc = {
  convertOffsetParentRelativeRectToViewportRelativeRect: jc,
  getDocumentElement: le,
  getClippingRect: Vc,
  getOffsetParent: Xo,
  getElementRects: Yc,
  getClientRects: zc,
  getDimensions: Kc,
  getScale: Pe,
  isElement: ce,
  isRTL: Xc,
};
function Zc(e, t) {
  let n = null,
    o;
  const r = le(e);
  function i() {
    clearTimeout(o), n && n.disconnect(), (n = null);
  }
  function s(c, l) {
    c === void 0 && (c = !1), l === void 0 && (l = 1), i();
    const { left: u, top: f, width: d, height: h } = e.getBoundingClientRect();
    if ((c || t(), !d || !h)) return;
    const m = nt(f),
      g = nt(r.clientWidth - (u + d)),
      p = nt(r.clientHeight - (f + h)),
      v = nt(u),
      b = {
        rootMargin: -m + "px " + -g + "px " + -p + "px " + -v + "px",
        threshold: H(0, he(1, l)) || 1,
      };
    let w = !0;
    function y(E) {
      const C = E[0].intersectionRatio;
      if (C !== l) {
        if (!w) return s();
        C
          ? s(!1, C)
          : (o = setTimeout(() => {
              s(!1, 1e-7);
            }, 100));
      }
      w = !1;
    }
    try {
      n = new IntersectionObserver(y, { ...b, root: r.ownerDocument });
    } catch {
      n = new IntersectionObserver(y, b);
    }
    n.observe(e);
  }
  return s(!0), i;
}
function Qc(e, t, n, o) {
  o === void 0 && (o = {});
  const {
      ancestorScroll: r = !0,
      ancestorResize: i = !0,
      elementResize: s = typeof ResizeObserver == "function",
      layoutShift: c = typeof IntersectionObserver == "function",
      animationFrame: l = !1,
    } = o,
    u = gn(e),
    f = r || i ? [...(u ? Ge(u) : []), ...Ge(t)] : [];
  f.forEach((x) => {
    r && x.addEventListener("scroll", n, { passive: !0 }),
      i && x.addEventListener("resize", n);
  });
  const d = u && c ? Zc(u, n) : null;
  let h = -1,
    m = null;
  s &&
    ((m = new ResizeObserver((x) => {
      let [b] = x;
      b &&
        b.target === u &&
        m &&
        (m.unobserve(t),
        cancelAnimationFrame(h),
        (h = requestAnimationFrame(() => {
          m && m.observe(t);
        }))),
        n();
    })),
    u && !l && m.observe(u),
    m.observe(t));
  let g,
    p = l ? ye(e) : null;
  l && v();
  function v() {
    const x = ye(e);
    p &&
      (x.x !== p.x ||
        x.y !== p.y ||
        x.width !== p.width ||
        x.height !== p.height) &&
      n(),
      (p = x),
      (g = requestAnimationFrame(v));
  }
  return (
    n(),
    () => {
      f.forEach((x) => {
        r && x.removeEventListener("scroll", n),
          i && x.removeEventListener("resize", n);
      }),
        d && d(),
        m && m.disconnect(),
        (m = null),
        l && cancelAnimationFrame(g);
    }
  );
}
const Jc = (e, t, n) => {
    const o = new Map(),
      r = { platform: qc, ...n },
      i = { ...r.platform, _c: o };
    return Pc(e, t, { ...r, platform: i });
  },
  ea = (e) => {
    function t(n) {
      return {}.hasOwnProperty.call(n, "current");
    }
    return {
      name: "arrow",
      options: e,
      fn(n) {
        const { element: o, padding: r } = typeof e == "function" ? e(n) : e;
        return o && t(o)
          ? o.current != null
            ? Xn({ element: o.current, padding: r }).fn(n)
            : {}
          : o
            ? Xn({ element: o, padding: r }).fn(n)
            : {};
      },
    };
  };
var dt = typeof document < "u" ? a.useLayoutEffect : a.useEffect;
function bt(e, t) {
  if (e === t) return !0;
  if (typeof e != typeof t) return !1;
  if (typeof e == "function" && e.toString() === t.toString()) return !0;
  let n, o, r;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (((n = e.length), n != t.length)) return !1;
      for (o = n; o-- !== 0; ) if (!bt(e[o], t[o])) return !1;
      return !0;
    }
    if (((r = Object.keys(e)), (n = r.length), n !== Object.keys(t).length))
      return !1;
    for (o = n; o-- !== 0; ) if (!{}.hasOwnProperty.call(t, r[o])) return !1;
    for (o = n; o-- !== 0; ) {
      const i = r[o];
      if (!(i === "_owner" && e.$$typeof) && !bt(e[i], t[i])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function qo(e) {
  return typeof window > "u"
    ? 1
    : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function to(e, t) {
  const n = qo(e);
  return Math.round(t * n) / n;
}
function no(e) {
  const t = a.useRef(e);
  return (
    dt(() => {
      t.current = e;
    }),
    t
  );
}
function ta(e) {
  e === void 0 && (e = {});
  const {
      placement: t = "bottom",
      strategy: n = "absolute",
      middleware: o = [],
      platform: r,
      elements: { reference: i, floating: s } = {},
      transform: c = !0,
      whileElementsMounted: l,
      open: u,
    } = e,
    [f, d] = a.useState({
      x: 0,
      y: 0,
      strategy: n,
      placement: t,
      middlewareData: {},
      isPositioned: !1,
    }),
    [h, m] = a.useState(o);
  bt(h, o) || m(o);
  const [g, p] = a.useState(null),
    [v, x] = a.useState(null),
    b = a.useCallback(
      (O) => {
        O != C.current && ((C.current = O), p(O));
      },
      [p],
    ),
    w = a.useCallback(
      (O) => {
        O !== S.current && ((S.current = O), x(O));
      },
      [x],
    ),
    y = i || g,
    E = s || v,
    C = a.useRef(null),
    S = a.useRef(null),
    R = a.useRef(f),
    _ = no(l),
    k = no(r),
    L = a.useCallback(() => {
      if (!C.current || !S.current) return;
      const O = { placement: t, strategy: n, middleware: h };
      k.current && (O.platform = k.current),
        Jc(C.current, S.current, O).then((B) => {
          const W = { ...B, isPositioned: !0 };
          P.current &&
            !bt(R.current, W) &&
            ((R.current = W),
            Jt.flushSync(() => {
              d(W);
            }));
        });
    }, [h, t, n, k]);
  dt(() => {
    u === !1 &&
      R.current.isPositioned &&
      ((R.current.isPositioned = !1), d((O) => ({ ...O, isPositioned: !1 })));
  }, [u]);
  const P = a.useRef(!1);
  dt(
    () => (
      (P.current = !0),
      () => {
        P.current = !1;
      }
    ),
    [],
  ),
    dt(() => {
      if ((y && (C.current = y), E && (S.current = E), y && E)) {
        if (_.current) return _.current(y, E, L);
        L();
      }
    }, [y, E, L, _]);
  const G = a.useMemo(
      () => ({ reference: C, floating: S, setReference: b, setFloating: w }),
      [b, w],
    ),
    A = a.useMemo(() => ({ reference: y, floating: E }), [y, E]),
    D = a.useMemo(() => {
      const O = { position: n, left: 0, top: 0 };
      if (!A.floating) return O;
      const B = to(A.floating, f.x),
        W = to(A.floating, f.y);
      return c
        ? {
            ...O,
            transform: "translate(" + B + "px, " + W + "px)",
            ...(qo(A.floating) >= 1.5 && { willChange: "transform" }),
          }
        : { position: n, left: B, top: W };
    }, [n, c, A.floating, f.x, f.y]);
  return a.useMemo(
    () => ({ ...f, update: L, refs: G, elements: A, floatingStyles: D }),
    [f, L, G, A, D],
  );
}
function na(e) {
  const [t, n] = a.useState(void 0);
  return (
    Te(() => {
      if (e) {
        n({ width: e.offsetWidth, height: e.offsetHeight });
        const o = new ResizeObserver((r) => {
          if (!Array.isArray(r) || !r.length) return;
          const i = r[0];
          let s, c;
          if ("borderBoxSize" in i) {
            const l = i.borderBoxSize,
              u = Array.isArray(l) ? l[0] : l;
            (s = u.inlineSize), (c = u.blockSize);
          } else (s = e.offsetWidth), (c = e.offsetHeight);
          n({ width: s, height: c });
        });
        return o.observe(e, { box: "border-box" }), () => o.unobserve(e);
      } else n(void 0);
    }, [e]),
    t
  );
}
const Zo = "Popper",
  [Qo, Jo] = He(Zo),
  [oa, er] = Qo(Zo),
  ra = (e) => {
    const { __scopePopper: t, children: n } = e,
      [o, r] = a.useState(null);
    return a.createElement(oa, { scope: t, anchor: o, onAnchorChange: r }, n);
  },
  ia = "PopperAnchor",
  sa = a.forwardRef((e, t) => {
    const { __scopePopper: n, virtualRef: o, ...r } = e,
      i = er(ia, n),
      s = a.useRef(null),
      c = X(t, s);
    return (
      a.useEffect(() => {
        i.onAnchorChange((o == null ? void 0 : o.current) || s.current);
      }),
      o ? null : a.createElement(Z.div, T({}, r, { ref: c }))
    );
  }),
  tr = "PopperContent",
  [ca, Ku] = Qo(tr),
  aa = a.forwardRef((e, t) => {
    var n, o, r, i, s, c, l, u;
    const {
        __scopePopper: f,
        side: d = "bottom",
        sideOffset: h = 0,
        align: m = "center",
        alignOffset: g = 0,
        arrowPadding: p = 0,
        avoidCollisions: v = !0,
        collisionBoundary: x = [],
        collisionPadding: b = 0,
        sticky: w = "partial",
        hideWhenDetached: y = !1,
        updatePositionStrategy: E = "optimized",
        onPlaced: C,
        ...S
      } = e,
      R = er(tr, f),
      [_, k] = a.useState(null),
      L = X(t, (Ne) => k(Ne)),
      [P, G] = a.useState(null),
      A = na(P),
      D = (n = A == null ? void 0 : A.width) !== null && n !== void 0 ? n : 0,
      O = (o = A == null ? void 0 : A.height) !== null && o !== void 0 ? o : 0,
      B = d + (m !== "center" ? "-" + m : ""),
      W =
        typeof b == "number"
          ? b
          : { top: 0, right: 0, bottom: 0, left: 0, ...b },
      M = Array.isArray(x) ? x : [x],
      j = M.length > 0,
      z = { padding: W, boundary: M.filter(la), altBoundary: j },
      {
        refs: V,
        floatingStyles: ue,
        placement: ke,
        isPositioned: be,
        middlewareData: J,
      } = ta({
        strategy: "fixed",
        placement: B,
        whileElementsMounted: (...Ne) =>
          Qc(...Ne, { animationFrame: E === "always" }),
        elements: { reference: R.anchor },
        middleware: [
          Ic({ mainAxis: h + O, alignmentAxis: g }),
          v &&
            Ac({
              mainAxis: !0,
              crossAxis: !1,
              limiter: w === "partial" ? Oc() : void 0,
              ...z,
            }),
          v && Mc({ ...z }),
          kc({
            ...z,
            apply: ({
              elements: Ne,
              rects: En,
              availableWidth: Ur,
              availableHeight: Gr,
            }) => {
              const { width: Vr, height: Kr } = En.reference,
                Je = Ne.floating.style;
              Je.setProperty("--radix-popper-available-width", `${Ur}px`),
                Je.setProperty("--radix-popper-available-height", `${Gr}px`),
                Je.setProperty("--radix-popper-anchor-width", `${Vr}px`),
                Je.setProperty("--radix-popper-anchor-height", `${Kr}px`);
            },
          }),
          P && ea({ element: P, padding: p }),
          ua({ arrowWidth: D, arrowHeight: O }),
          y && Tc({ strategy: "referenceHidden", ...z }),
        ],
      }),
      [de, Ze] = nr(ke),
      K = oe(C);
    Te(() => {
      be && (K == null || K());
    }, [be, K]);
    const Qe = (r = J.arrow) === null || r === void 0 ? void 0 : r.x,
      jr = (i = J.arrow) === null || i === void 0 ? void 0 : i.y,
      zr =
        ((s = J.arrow) === null || s === void 0 ? void 0 : s.centerOffset) !==
        0,
      [Br, Wr] = a.useState();
    return (
      Te(() => {
        _ && Wr(window.getComputedStyle(_).zIndex);
      }, [_]),
      a.createElement(
        "div",
        {
          ref: V.setFloating,
          "data-radix-popper-content-wrapper": "",
          style: {
            ...ue,
            transform: be ? ue.transform : "translate(0, -200%)",
            minWidth: "max-content",
            zIndex: Br,
            "--radix-popper-transform-origin": [
              (c = J.transformOrigin) === null || c === void 0 ? void 0 : c.x,
              (l = J.transformOrigin) === null || l === void 0 ? void 0 : l.y,
            ].join(" "),
          },
          dir: e.dir,
        },
        a.createElement(
          ca,
          {
            scope: f,
            placedSide: de,
            onArrowChange: G,
            arrowX: Qe,
            arrowY: jr,
            shouldHideArrow: zr,
          },
          a.createElement(
            Z.div,
            T({ "data-side": de, "data-align": Ze }, S, {
              ref: L,
              style: {
                ...S.style,
                animation: be ? void 0 : "none",
                opacity:
                  (u = J.hide) !== null && u !== void 0 && u.referenceHidden
                    ? 0
                    : void 0,
              },
            }),
          ),
        ),
      )
    );
  });
function la(e) {
  return e !== null;
}
const ua = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var n, o, r, i, s;
    const { placement: c, rects: l, middlewareData: u } = t,
      d =
        ((n = u.arrow) === null || n === void 0 ? void 0 : n.centerOffset) !==
        0,
      h = d ? 0 : e.arrowWidth,
      m = d ? 0 : e.arrowHeight,
      [g, p] = nr(c),
      v = { start: "0%", center: "50%", end: "100%" }[p],
      x =
        ((o = (r = u.arrow) === null || r === void 0 ? void 0 : r.x) !== null &&
        o !== void 0
          ? o
          : 0) +
        h / 2,
      b =
        ((i = (s = u.arrow) === null || s === void 0 ? void 0 : s.y) !== null &&
        i !== void 0
          ? i
          : 0) +
        m / 2;
    let w = "",
      y = "";
    return (
      g === "bottom"
        ? ((w = d ? v : `${x}px`), (y = `${-m}px`))
        : g === "top"
          ? ((w = d ? v : `${x}px`), (y = `${l.floating.height + m}px`))
          : g === "right"
            ? ((w = `${-m}px`), (y = d ? v : `${b}px`))
            : g === "left" &&
              ((w = `${l.floating.width + m}px`), (y = d ? v : `${b}px`)),
      { data: { x: w, y } }
    );
  },
});
function nr(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
const da = ra,
  fa = sa,
  pa = aa,
  ma = a.forwardRef((e, t) => {
    var n;
    const {
      container: o = globalThis == null ||
      (n = globalThis.document) === null ||
      n === void 0
        ? void 0
        : n.body,
      ...r
    } = e;
    return o
      ? Xr.createPortal(a.createElement(Z.div, T({}, r, { ref: t })), o)
      : null;
  });
function ha(e, t) {
  return a.useReducer((n, o) => {
    const r = t[n][o];
    return r ?? n;
  }, e);
}
const Xe = (e) => {
  const { present: t, children: n } = e,
    o = ga(t),
    r =
      typeof n == "function" ? n({ present: o.isPresent }) : a.Children.only(n),
    i = X(o.ref, r.ref);
  return typeof n == "function" || o.isPresent
    ? a.cloneElement(r, { ref: i })
    : null;
};
Xe.displayName = "Presence";
function ga(e) {
  const [t, n] = a.useState(),
    o = a.useRef({}),
    r = a.useRef(e),
    i = a.useRef("none"),
    s = e ? "mounted" : "unmounted",
    [c, l] = ha(s, {
      mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
      unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
      unmounted: { MOUNT: "mounted" },
    });
  return (
    a.useEffect(() => {
      const u = ot(o.current);
      i.current = c === "mounted" ? u : "none";
    }, [c]),
    Te(() => {
      const u = o.current,
        f = r.current;
      if (f !== e) {
        const h = i.current,
          m = ot(u);
        e
          ? l("MOUNT")
          : m === "none" || (u == null ? void 0 : u.display) === "none"
            ? l("UNMOUNT")
            : l(f && h !== m ? "ANIMATION_OUT" : "UNMOUNT"),
          (r.current = e);
      }
    }, [e, l]),
    Te(() => {
      if (t) {
        const u = (d) => {
            const m = ot(o.current).includes(d.animationName);
            d.target === t && m && Jt.flushSync(() => l("ANIMATION_END"));
          },
          f = (d) => {
            d.target === t && (i.current = ot(o.current));
          };
        return (
          t.addEventListener("animationstart", f),
          t.addEventListener("animationcancel", u),
          t.addEventListener("animationend", u),
          () => {
            t.removeEventListener("animationstart", f),
              t.removeEventListener("animationcancel", u),
              t.removeEventListener("animationend", u);
          }
        );
      } else l("ANIMATION_END");
    }, [t, l]),
    {
      isPresent: ["mounted", "unmountSuspended"].includes(c),
      ref: a.useCallback((u) => {
        u && (o.current = getComputedStyle(u)), n(u);
      }, []),
    }
  );
}
function ot(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
const At = "rovingFocusGroup.onEntryFocus",
  va = { bubbles: !1, cancelable: !0 },
  vn = "RovingFocusGroup",
  [Xt, or, ba] = Fo(vn),
  [xa, rr] = He(vn, [ba]),
  [wa, ya] = xa(vn),
  $a = a.forwardRef((e, t) =>
    a.createElement(
      Xt.Provider,
      { scope: e.__scopeRovingFocusGroup },
      a.createElement(
        Xt.Slot,
        { scope: e.__scopeRovingFocusGroup },
        a.createElement(Ca, T({}, e, { ref: t })),
      ),
    ),
  ),
  Ca = a.forwardRef((e, t) => {
    const {
        __scopeRovingFocusGroup: n,
        orientation: o,
        loop: r = !1,
        dir: i,
        currentTabStopId: s,
        defaultCurrentTabStopId: c,
        onCurrentTabStopIdChange: l,
        onEntryFocus: u,
        ...f
      } = e,
      d = a.useRef(null),
      h = X(t, d),
      m = jo(i),
      [g = null, p] = Do({ prop: s, defaultProp: c, onChange: l }),
      [v, x] = a.useState(!1),
      b = oe(u),
      w = or(n),
      y = a.useRef(!1),
      [E, C] = a.useState(0);
    return (
      a.useEffect(() => {
        const S = d.current;
        if (S)
          return S.addEventListener(At, b), () => S.removeEventListener(At, b);
      }, [b]),
      a.createElement(
        wa,
        {
          scope: n,
          orientation: o,
          dir: m,
          loop: r,
          currentTabStopId: g,
          onItemFocus: a.useCallback((S) => p(S), [p]),
          onItemShiftTab: a.useCallback(() => x(!0), []),
          onFocusableItemAdd: a.useCallback(() => C((S) => S + 1), []),
          onFocusableItemRemove: a.useCallback(() => C((S) => S - 1), []),
        },
        a.createElement(
          Z.div,
          T({ tabIndex: v || E === 0 ? -1 : 0, "data-orientation": o }, f, {
            ref: h,
            style: { outline: "none", ...e.style },
            onMouseDown: N(e.onMouseDown, () => {
              y.current = !0;
            }),
            onFocus: N(e.onFocus, (S) => {
              const R = !y.current;
              if (S.target === S.currentTarget && R && !v) {
                const _ = new CustomEvent(At, va);
                if ((S.currentTarget.dispatchEvent(_), !_.defaultPrevented)) {
                  const k = w().filter((D) => D.focusable),
                    L = k.find((D) => D.active),
                    P = k.find((D) => D.id === g),
                    A = [L, P, ...k].filter(Boolean).map((D) => D.ref.current);
                  ir(A);
                }
              }
              y.current = !1;
            }),
            onBlur: N(e.onBlur, () => x(!1)),
          }),
        ),
      )
    );
  }),
  Ea = "RovingFocusGroupItem",
  Sa = a.forwardRef((e, t) => {
    const {
        __scopeRovingFocusGroup: n,
        focusable: o = !0,
        active: r = !1,
        tabStopId: i,
        ...s
      } = e,
      c = Kt(),
      l = i || c,
      u = ya(Ea, n),
      f = u.currentTabStopId === l,
      d = or(n),
      { onFocusableItemAdd: h, onFocusableItemRemove: m } = u;
    return (
      a.useEffect(() => {
        if (o) return h(), () => m();
      }, [o, h, m]),
      a.createElement(
        Xt.ItemSlot,
        { scope: n, id: l, focusable: o, active: r },
        a.createElement(
          Z.span,
          T({ tabIndex: f ? 0 : -1, "data-orientation": u.orientation }, s, {
            ref: t,
            onMouseDown: N(e.onMouseDown, (g) => {
              o ? u.onItemFocus(l) : g.preventDefault();
            }),
            onFocus: N(e.onFocus, () => u.onItemFocus(l)),
            onKeyDown: N(e.onKeyDown, (g) => {
              if (g.key === "Tab" && g.shiftKey) {
                u.onItemShiftTab();
                return;
              }
              if (g.target !== g.currentTarget) return;
              const p = Ma(g, u.orientation, u.dir);
              if (p !== void 0) {
                g.preventDefault();
                let x = d()
                  .filter((b) => b.focusable)
                  .map((b) => b.ref.current);
                if (p === "last") x.reverse();
                else if (p === "prev" || p === "next") {
                  p === "prev" && x.reverse();
                  const b = x.indexOf(g.currentTarget);
                  x = u.loop ? Ta(x, b + 1) : x.slice(b + 1);
                }
                setTimeout(() => ir(x));
              }
            }),
          }),
        ),
      )
    );
  }),
  Ra = {
    ArrowLeft: "prev",
    ArrowUp: "prev",
    ArrowRight: "next",
    ArrowDown: "next",
    PageUp: "first",
    Home: "first",
    PageDown: "last",
    End: "last",
  };
function Pa(e, t) {
  return t !== "rtl"
    ? e
    : e === "ArrowLeft"
      ? "ArrowRight"
      : e === "ArrowRight"
        ? "ArrowLeft"
        : e;
}
function Ma(e, t, n) {
  const o = Pa(e.key, n);
  if (
    !(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(o)) &&
    !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(o))
  )
    return Ra[o];
}
function ir(e) {
  const t = document.activeElement;
  for (const n of e)
    if (n === t || (n.focus(), document.activeElement !== t)) return;
}
function Ta(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
const _a = $a,
  Ia = Sa;
var Aa = function (e) {
    if (typeof document > "u") return null;
    var t = Array.isArray(e) ? e[0] : e;
    return t.ownerDocument.body;
  },
  Ee = new WeakMap(),
  rt = new WeakMap(),
  it = {},
  Ot = 0,
  sr = function (e) {
    return e && (e.host || sr(e.parentNode));
  },
  Oa = function (e, t) {
    return t
      .map(function (n) {
        if (e.contains(n)) return n;
        var o = sr(n);
        return o && e.contains(o)
          ? o
          : (console.error(
              "aria-hidden",
              n,
              "in not contained inside",
              e,
              ". Doing nothing",
            ),
            null);
      })
      .filter(function (n) {
        return !!n;
      });
  },
  ka = function (e, t, n, o) {
    var r = Oa(t, Array.isArray(e) ? e : [e]);
    it[n] || (it[n] = new WeakMap());
    var i = it[n],
      s = [],
      c = new Set(),
      l = new Set(r),
      u = function (d) {
        !d || c.has(d) || (c.add(d), u(d.parentNode));
      };
    r.forEach(u);
    var f = function (d) {
      !d ||
        l.has(d) ||
        Array.prototype.forEach.call(d.children, function (h) {
          if (c.has(h)) f(h);
          else {
            var m = h.getAttribute(o),
              g = m !== null && m !== "false",
              p = (Ee.get(h) || 0) + 1,
              v = (i.get(h) || 0) + 1;
            Ee.set(h, p),
              i.set(h, v),
              s.push(h),
              p === 1 && g && rt.set(h, !0),
              v === 1 && h.setAttribute(n, "true"),
              g || h.setAttribute(o, "true");
          }
        });
    };
    return (
      f(t),
      c.clear(),
      Ot++,
      function () {
        s.forEach(function (d) {
          var h = Ee.get(d) - 1,
            m = i.get(d) - 1;
          Ee.set(d, h),
            i.set(d, m),
            h || (rt.has(d) || d.removeAttribute(o), rt.delete(d)),
            m || d.removeAttribute(n);
        }),
          Ot--,
          Ot ||
            ((Ee = new WeakMap()),
            (Ee = new WeakMap()),
            (rt = new WeakMap()),
            (it = {}));
      }
    );
  },
  Na = function (e, t, n) {
    n === void 0 && (n = "data-aria-hidden");
    var o = Array.from(Array.isArray(e) ? e : [e]),
      r = t || Aa(e);
    return r
      ? (o.push.apply(o, Array.from(r.querySelectorAll("[aria-live]"))),
        ka(o, r, n, "aria-hidden"))
      : function () {
          return null;
        };
  },
  ne = function () {
    return (
      (ne =
        Object.assign ||
        function (t) {
          for (var n, o = 1, r = arguments.length; o < r; o++) {
            n = arguments[o];
            for (var i in n)
              Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
          }
          return t;
        }),
      ne.apply(this, arguments)
    );
  };
function cr(e, t) {
  var n = {};
  for (var o in e)
    Object.prototype.hasOwnProperty.call(e, o) &&
      t.indexOf(o) < 0 &&
      (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, o[r]) &&
        (n[o[r]] = e[o[r]]);
  return n;
}
function Da(e, t, n) {
  if (n || arguments.length === 2)
    for (var o = 0, r = t.length, i; o < r; o++)
      (i || !(o in t)) &&
        (i || (i = Array.prototype.slice.call(t, 0, o)), (i[o] = t[o]));
  return e.concat(i || Array.prototype.slice.call(t));
}
var ft = "right-scroll-bar-position",
  pt = "width-before-scroll-bar",
  La = "with-scroll-bars-hidden",
  Fa = "--removed-body-scroll-bar-size";
function ja(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function za(e, t) {
  var n = a.useState(function () {
    return {
      value: e,
      callback: t,
      facade: {
        get current() {
          return n.value;
        },
        set current(o) {
          var r = n.value;
          r !== o && ((n.value = o), n.callback(o, r));
        },
      },
    };
  })[0];
  return (n.callback = t), n.facade;
}
function Ba(e, t) {
  return za(t || null, function (n) {
    return e.forEach(function (o) {
      return ja(o, n);
    });
  });
}
function Wa(e) {
  return e;
}
function Ua(e, t) {
  t === void 0 && (t = Wa);
  var n = [],
    o = !1,
    r = {
      read: function () {
        if (o)
          throw new Error(
            "Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.",
          );
        return n.length ? n[n.length - 1] : e;
      },
      useMedium: function (i) {
        var s = t(i, o);
        return (
          n.push(s),
          function () {
            n = n.filter(function (c) {
              return c !== s;
            });
          }
        );
      },
      assignSyncMedium: function (i) {
        for (o = !0; n.length; ) {
          var s = n;
          (n = []), s.forEach(i);
        }
        n = {
          push: function (c) {
            return i(c);
          },
          filter: function () {
            return n;
          },
        };
      },
      assignMedium: function (i) {
        o = !0;
        var s = [];
        if (n.length) {
          var c = n;
          (n = []), c.forEach(i), (s = n);
        }
        var l = function () {
            var f = s;
            (s = []), f.forEach(i);
          },
          u = function () {
            return Promise.resolve().then(l);
          };
        u(),
          (n = {
            push: function (f) {
              s.push(f), u();
            },
            filter: function (f) {
              return (s = s.filter(f)), n;
            },
          });
      },
    };
  return r;
}
function Ga(e) {
  e === void 0 && (e = {});
  var t = Ua(null);
  return (t.options = ne({ async: !0, ssr: !1 }, e)), t;
}
var ar = function (e) {
  var t = e.sideCar,
    n = cr(e, ["sideCar"]);
  if (!t)
    throw new Error(
      "Sidecar: please provide `sideCar` property to import the right car",
    );
  var o = t.read();
  if (!o) throw new Error("Sidecar medium not found");
  return a.createElement(o, ne({}, n));
};
ar.isSideCarExport = !0;
function Va(e, t) {
  return e.useMedium(t), ar;
}
var lr = Ga(),
  kt = function () {},
  St = a.forwardRef(function (e, t) {
    var n = a.useRef(null),
      o = a.useState({
        onScrollCapture: kt,
        onWheelCapture: kt,
        onTouchMoveCapture: kt,
      }),
      r = o[0],
      i = o[1],
      s = e.forwardProps,
      c = e.children,
      l = e.className,
      u = e.removeScrollBar,
      f = e.enabled,
      d = e.shards,
      h = e.sideCar,
      m = e.noIsolation,
      g = e.inert,
      p = e.allowPinchZoom,
      v = e.as,
      x = v === void 0 ? "div" : v,
      b = cr(e, [
        "forwardProps",
        "children",
        "className",
        "removeScrollBar",
        "enabled",
        "shards",
        "sideCar",
        "noIsolation",
        "inert",
        "allowPinchZoom",
        "as",
      ]),
      w = h,
      y = Ba([n, t]),
      E = ne(ne({}, b), r);
    return a.createElement(
      a.Fragment,
      null,
      f &&
        a.createElement(w, {
          sideCar: lr,
          removeScrollBar: u,
          shards: d,
          noIsolation: m,
          inert: g,
          setCallbacks: i,
          allowPinchZoom: !!p,
          lockRef: n,
        }),
      s
        ? a.cloneElement(a.Children.only(c), ne(ne({}, E), { ref: y }))
        : a.createElement(x, ne({}, E, { className: l, ref: y }), c),
    );
  });
St.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
St.classNames = { fullWidth: pt, zeroRight: ft };
var oo,
  Ka = function () {
    if (oo) return oo;
    if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
  };
function Ha() {
  if (!document) return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = Ka();
  return t && e.setAttribute("nonce", t), e;
}
function Ya(e, t) {
  e.styleSheet
    ? (e.styleSheet.cssText = t)
    : e.appendChild(document.createTextNode(t));
}
function Xa(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var qa = function () {
    var e = 0,
      t = null;
    return {
      add: function (n) {
        e == 0 && (t = Ha()) && (Ya(t, n), Xa(t)), e++;
      },
      remove: function () {
        e--,
          !e && t && (t.parentNode && t.parentNode.removeChild(t), (t = null));
      },
    };
  },
  Za = function () {
    var e = qa();
    return function (t, n) {
      a.useEffect(
        function () {
          return (
            e.add(t),
            function () {
              e.remove();
            }
          );
        },
        [t && n],
      );
    };
  },
  ur = function () {
    var e = Za(),
      t = function (n) {
        var o = n.styles,
          r = n.dynamic;
        return e(o, r), null;
      };
    return t;
  },
  Qa = { left: 0, top: 0, right: 0, gap: 0 },
  Nt = function (e) {
    return parseInt(e || "", 10) || 0;
  },
  Ja = function (e) {
    var t = window.getComputedStyle(document.body),
      n = t[e === "padding" ? "paddingLeft" : "marginLeft"],
      o = t[e === "padding" ? "paddingTop" : "marginTop"],
      r = t[e === "padding" ? "paddingRight" : "marginRight"];
    return [Nt(n), Nt(o), Nt(r)];
  },
  el = function (e) {
    if ((e === void 0 && (e = "margin"), typeof window > "u")) return Qa;
    var t = Ja(e),
      n = document.documentElement.clientWidth,
      o = window.innerWidth;
    return {
      left: t[0],
      top: t[1],
      right: t[2],
      gap: Math.max(0, o - n + t[2] - t[0]),
    };
  },
  tl = ur(),
  nl = function (e, t, n, o) {
    var r = e.left,
      i = e.top,
      s = e.right,
      c = e.gap;
    return (
      n === void 0 && (n = "margin"),
      `
  .`
        .concat(
          La,
          ` {
   overflow: hidden `,
        )
        .concat(
          o,
          `;
   padding-right: `,
        )
        .concat(c, "px ")
        .concat(
          o,
          `;
  }
  body {
    overflow: hidden `,
        )
        .concat(
          o,
          `;
    overscroll-behavior: contain;
    `,
        )
        .concat(
          [
            t && "position: relative ".concat(o, ";"),
            n === "margin" &&
              `
    padding-left: `
                .concat(
                  r,
                  `px;
    padding-top: `,
                )
                .concat(
                  i,
                  `px;
    padding-right: `,
                )
                .concat(
                  s,
                  `px;
    margin-left:0;
    margin-top:0;
    margin-right: `,
                )
                .concat(c, "px ")
                .concat(
                  o,
                  `;
    `,
                ),
            n === "padding" &&
              "padding-right: ".concat(c, "px ").concat(o, ";"),
          ]
            .filter(Boolean)
            .join(""),
          `
  }
  
  .`,
        )
        .concat(
          ft,
          ` {
    right: `,
        )
        .concat(c, "px ")
        .concat(
          o,
          `;
  }
  
  .`,
        )
        .concat(
          pt,
          ` {
    margin-right: `,
        )
        .concat(c, "px ")
        .concat(
          o,
          `;
  }
  
  .`,
        )
        .concat(ft, " .")
        .concat(
          ft,
          ` {
    right: 0 `,
        )
        .concat(
          o,
          `;
  }
  
  .`,
        )
        .concat(pt, " .")
        .concat(
          pt,
          ` {
    margin-right: 0 `,
        )
        .concat(
          o,
          `;
  }
  
  body {
    `,
        )
        .concat(Fa, ": ")
        .concat(
          c,
          `px;
  }
`,
        )
    );
  },
  ol = function (e) {
    var t = e.noRelative,
      n = e.noImportant,
      o = e.gapMode,
      r = o === void 0 ? "margin" : o,
      i = a.useMemo(
        function () {
          return el(r);
        },
        [r],
      );
    return a.createElement(tl, { styles: nl(i, !t, r, n ? "" : "!important") });
  },
  qt = !1;
if (typeof window < "u")
  try {
    var st = Object.defineProperty({}, "passive", {
      get: function () {
        return (qt = !0), !0;
      },
    });
    window.addEventListener("test", st, st),
      window.removeEventListener("test", st, st);
  } catch {
    qt = !1;
  }
var Se = qt ? { passive: !1 } : !1,
  rl = function (e) {
    return e.tagName === "TEXTAREA";
  },
  dr = function (e, t) {
    var n = window.getComputedStyle(e);
    return (
      n[t] !== "hidden" &&
      !(n.overflowY === n.overflowX && !rl(e) && n[t] === "visible")
    );
  },
  il = function (e) {
    return dr(e, "overflowY");
  },
  sl = function (e) {
    return dr(e, "overflowX");
  },
  ro = function (e, t) {
    var n = t;
    do {
      typeof ShadowRoot < "u" && n instanceof ShadowRoot && (n = n.host);
      var o = fr(e, n);
      if (o) {
        var r = pr(e, n),
          i = r[1],
          s = r[2];
        if (i > s) return !0;
      }
      n = n.parentNode;
    } while (n && n !== document.body);
    return !1;
  },
  cl = function (e) {
    var t = e.scrollTop,
      n = e.scrollHeight,
      o = e.clientHeight;
    return [t, n, o];
  },
  al = function (e) {
    var t = e.scrollLeft,
      n = e.scrollWidth,
      o = e.clientWidth;
    return [t, n, o];
  },
  fr = function (e, t) {
    return e === "v" ? il(t) : sl(t);
  },
  pr = function (e, t) {
    return e === "v" ? cl(t) : al(t);
  },
  ll = function (e, t) {
    return e === "h" && t === "rtl" ? -1 : 1;
  },
  ul = function (e, t, n, o, r) {
    var i = ll(e, window.getComputedStyle(t).direction),
      s = i * o,
      c = n.target,
      l = t.contains(c),
      u = !1,
      f = s > 0,
      d = 0,
      h = 0;
    do {
      var m = pr(e, c),
        g = m[0],
        p = m[1],
        v = m[2],
        x = p - v - i * g;
      (g || x) && fr(e, c) && ((d += x), (h += g)), (c = c.parentNode);
    } while ((!l && c !== document.body) || (l && (t.contains(c) || t === c)));
    return (
      ((f && ((r && d === 0) || (!r && s > d))) ||
        (!f && ((r && h === 0) || (!r && -s > h)))) &&
        (u = !0),
      u
    );
  },
  ct = function (e) {
    return "changedTouches" in e
      ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
      : [0, 0];
  },
  io = function (e) {
    return [e.deltaX, e.deltaY];
  },
  so = function (e) {
    return e && "current" in e ? e.current : e;
  },
  dl = function (e, t) {
    return e[0] === t[0] && e[1] === t[1];
  },
  fl = function (e) {
    return `
  .block-interactivity-`
      .concat(
        e,
        ` {pointer-events: none;}
  .allow-interactivity-`,
      )
      .concat(
        e,
        ` {pointer-events: all;}
`,
      );
  },
  pl = 0,
  Re = [];
function ml(e) {
  var t = a.useRef([]),
    n = a.useRef([0, 0]),
    o = a.useRef(),
    r = a.useState(pl++)[0],
    i = a.useState(function () {
      return ur();
    })[0],
    s = a.useRef(e);
  a.useEffect(
    function () {
      s.current = e;
    },
    [e],
  ),
    a.useEffect(
      function () {
        if (e.inert) {
          document.body.classList.add("block-interactivity-".concat(r));
          var p = Da([e.lockRef.current], (e.shards || []).map(so), !0).filter(
            Boolean,
          );
          return (
            p.forEach(function (v) {
              return v.classList.add("allow-interactivity-".concat(r));
            }),
            function () {
              document.body.classList.remove("block-interactivity-".concat(r)),
                p.forEach(function (v) {
                  return v.classList.remove("allow-interactivity-".concat(r));
                });
            }
          );
        }
      },
      [e.inert, e.lockRef.current, e.shards],
    );
  var c = a.useCallback(function (p, v) {
      if ("touches" in p && p.touches.length === 2)
        return !s.current.allowPinchZoom;
      var x = ct(p),
        b = n.current,
        w = "deltaX" in p ? p.deltaX : b[0] - x[0],
        y = "deltaY" in p ? p.deltaY : b[1] - x[1],
        E,
        C = p.target,
        S = Math.abs(w) > Math.abs(y) ? "h" : "v";
      if ("touches" in p && S === "h" && C.type === "range") return !1;
      var R = ro(S, C);
      if (!R) return !0;
      if ((R ? (E = S) : ((E = S === "v" ? "h" : "v"), (R = ro(S, C))), !R))
        return !1;
      if (
        (!o.current && "changedTouches" in p && (w || y) && (o.current = E), !E)
      )
        return !0;
      var _ = o.current || E;
      return ul(_, v, p, _ === "h" ? w : y, !0);
    }, []),
    l = a.useCallback(function (p) {
      var v = p;
      if (!(!Re.length || Re[Re.length - 1] !== i)) {
        var x = "deltaY" in v ? io(v) : ct(v),
          b = t.current.filter(function (E) {
            return E.name === v.type && E.target === v.target && dl(E.delta, x);
          })[0];
        if (b && b.should) {
          v.cancelable && v.preventDefault();
          return;
        }
        if (!b) {
          var w = (s.current.shards || [])
              .map(so)
              .filter(Boolean)
              .filter(function (E) {
                return E.contains(v.target);
              }),
            y = w.length > 0 ? c(v, w[0]) : !s.current.noIsolation;
          y && v.cancelable && v.preventDefault();
        }
      }
    }, []),
    u = a.useCallback(function (p, v, x, b) {
      var w = { name: p, delta: v, target: x, should: b };
      t.current.push(w),
        setTimeout(function () {
          t.current = t.current.filter(function (y) {
            return y !== w;
          });
        }, 1);
    }, []),
    f = a.useCallback(function (p) {
      (n.current = ct(p)), (o.current = void 0);
    }, []),
    d = a.useCallback(function (p) {
      u(p.type, io(p), p.target, c(p, e.lockRef.current));
    }, []),
    h = a.useCallback(function (p) {
      u(p.type, ct(p), p.target, c(p, e.lockRef.current));
    }, []);
  a.useEffect(function () {
    return (
      Re.push(i),
      e.setCallbacks({
        onScrollCapture: d,
        onWheelCapture: d,
        onTouchMoveCapture: h,
      }),
      document.addEventListener("wheel", l, Se),
      document.addEventListener("touchmove", l, Se),
      document.addEventListener("touchstart", f, Se),
      function () {
        (Re = Re.filter(function (p) {
          return p !== i;
        })),
          document.removeEventListener("wheel", l, Se),
          document.removeEventListener("touchmove", l, Se),
          document.removeEventListener("touchstart", f, Se);
      }
    );
  }, []);
  var m = e.removeScrollBar,
    g = e.inert;
  return a.createElement(
    a.Fragment,
    null,
    g ? a.createElement(i, { styles: fl(r) }) : null,
    m ? a.createElement(ol, { gapMode: "margin" }) : null,
  );
}
const hl = Va(lr, ml);
var mr = a.forwardRef(function (e, t) {
  return a.createElement(St, ne({}, e, { ref: t, sideCar: hl }));
});
mr.classNames = St.classNames;
const gl = mr,
  Zt = ["Enter", " "],
  vl = ["ArrowDown", "PageUp", "Home"],
  hr = ["ArrowUp", "PageDown", "End"],
  bl = [...vl, ...hr],
  xl = { ltr: [...Zt, "ArrowRight"], rtl: [...Zt, "ArrowLeft"] },
  wl = { ltr: ["ArrowLeft"], rtl: ["ArrowRight"] },
  Rt = "Menu",
  [Ve, yl, $l] = Fo(Rt),
  [$e, gr] = He(Rt, [$l, Jo, rr]),
  bn = Jo(),
  vr = rr(),
  [Cl, Ce] = $e(Rt),
  [El, qe] = $e(Rt),
  Sl = (e) => {
    const {
        __scopeMenu: t,
        open: n = !1,
        children: o,
        dir: r,
        onOpenChange: i,
        modal: s = !0,
      } = e,
      c = bn(t),
      [l, u] = a.useState(null),
      f = a.useRef(!1),
      d = oe(i),
      h = jo(r);
    return (
      a.useEffect(() => {
        const m = () => {
            (f.current = !0),
              document.addEventListener("pointerdown", g, {
                capture: !0,
                once: !0,
              }),
              document.addEventListener("pointermove", g, {
                capture: !0,
                once: !0,
              });
          },
          g = () => (f.current = !1);
        return (
          document.addEventListener("keydown", m, { capture: !0 }),
          () => {
            document.removeEventListener("keydown", m, { capture: !0 }),
              document.removeEventListener("pointerdown", g, { capture: !0 }),
              document.removeEventListener("pointermove", g, { capture: !0 });
          }
        );
      }, []),
      a.createElement(
        da,
        c,
        a.createElement(
          Cl,
          {
            scope: t,
            open: n,
            onOpenChange: d,
            content: l,
            onContentChange: u,
          },
          a.createElement(
            El,
            {
              scope: t,
              onClose: a.useCallback(() => d(!1), [d]),
              isUsingKeyboardRef: f,
              dir: h,
              modal: s,
            },
            o,
          ),
        ),
      )
    );
  },
  br = a.forwardRef((e, t) => {
    const { __scopeMenu: n, ...o } = e,
      r = bn(n);
    return a.createElement(fa, T({}, r, o, { ref: t }));
  }),
  xr = "MenuPortal",
  [Rl, wr] = $e(xr, { forceMount: void 0 }),
  Pl = (e) => {
    const { __scopeMenu: t, forceMount: n, children: o, container: r } = e,
      i = Ce(xr, t);
    return a.createElement(
      Rl,
      { scope: t, forceMount: n },
      a.createElement(
        Xe,
        { present: n || i.open },
        a.createElement(ma, { asChild: !0, container: r }, o),
      ),
    );
  },
  te = "MenuContent",
  [Ml, xn] = $e(te),
  Tl = a.forwardRef((e, t) => {
    const n = wr(te, e.__scopeMenu),
      { forceMount: o = n.forceMount, ...r } = e,
      i = Ce(te, e.__scopeMenu),
      s = qe(te, e.__scopeMenu);
    return a.createElement(
      Ve.Provider,
      { scope: e.__scopeMenu },
      a.createElement(
        Xe,
        { present: o || i.open },
        a.createElement(
          Ve.Slot,
          { scope: e.__scopeMenu },
          s.modal
            ? a.createElement(_l, T({}, r, { ref: t }))
            : a.createElement(Il, T({}, r, { ref: t })),
        ),
      ),
    );
  }),
  _l = a.forwardRef((e, t) => {
    const n = Ce(te, e.__scopeMenu),
      o = a.useRef(null),
      r = X(t, o);
    return (
      a.useEffect(() => {
        const i = o.current;
        if (i) return Na(i);
      }, []),
      a.createElement(
        wn,
        T({}, e, {
          ref: r,
          trapFocus: n.open,
          disableOutsidePointerEvents: n.open,
          disableOutsideScroll: !0,
          onFocusOutside: N(e.onFocusOutside, (i) => i.preventDefault(), {
            checkForDefaultPrevented: !1,
          }),
          onDismiss: () => n.onOpenChange(!1),
        }),
      )
    );
  }),
  Il = a.forwardRef((e, t) => {
    const n = Ce(te, e.__scopeMenu);
    return a.createElement(
      wn,
      T({}, e, {
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        disableOutsideScroll: !1,
        onDismiss: () => n.onOpenChange(!1),
      }),
    );
  }),
  wn = a.forwardRef((e, t) => {
    const {
        __scopeMenu: n,
        loop: o = !1,
        trapFocus: r,
        onOpenAutoFocus: i,
        onCloseAutoFocus: s,
        disableOutsidePointerEvents: c,
        onEntryFocus: l,
        onEscapeKeyDown: u,
        onPointerDownOutside: f,
        onFocusOutside: d,
        onInteractOutside: h,
        onDismiss: m,
        disableOutsideScroll: g,
        ...p
      } = e,
      v = Ce(te, n),
      x = qe(te, n),
      b = bn(n),
      w = vr(n),
      y = yl(n),
      [E, C] = a.useState(null),
      S = a.useRef(null),
      R = X(t, S, v.onContentChange),
      _ = a.useRef(0),
      k = a.useRef(""),
      L = a.useRef(0),
      P = a.useRef(null),
      G = a.useRef("right"),
      A = a.useRef(0),
      D = g ? gl : a.Fragment,
      O = g ? { as: Me, allowPinchZoom: !0 } : void 0,
      B = (M) => {
        var j, z;
        const V = k.current + M,
          ue = y().filter((K) => !K.disabled),
          ke = document.activeElement,
          be =
            (j = ue.find((K) => K.ref.current === ke)) === null || j === void 0
              ? void 0
              : j.textValue,
          J = ue.map((K) => K.textValue),
          de = Hl(J, V, be),
          Ze =
            (z = ue.find((K) => K.textValue === de)) === null || z === void 0
              ? void 0
              : z.ref.current;
        (function K(Qe) {
          (k.current = Qe),
            window.clearTimeout(_.current),
            Qe !== "" && (_.current = window.setTimeout(() => K(""), 1e3));
        })(V),
          Ze && setTimeout(() => Ze.focus());
      };
    a.useEffect(() => () => window.clearTimeout(_.current), []), lc();
    const W = a.useCallback((M) => {
      var j, z;
      return (
        G.current ===
          ((j = P.current) === null || j === void 0 ? void 0 : j.side) &&
        Xl(M, (z = P.current) === null || z === void 0 ? void 0 : z.area)
      );
    }, []);
    return a.createElement(
      Ml,
      {
        scope: n,
        searchRef: k,
        onItemEnter: a.useCallback(
          (M) => {
            W(M) && M.preventDefault();
          },
          [W],
        ),
        onItemLeave: a.useCallback(
          (M) => {
            var j;
            W(M) ||
              ((j = S.current) === null || j === void 0 || j.focus(), C(null));
          },
          [W],
        ),
        onTriggerLeave: a.useCallback(
          (M) => {
            W(M) && M.preventDefault();
          },
          [W],
        ),
        pointerGraceTimerRef: L,
        onPointerGraceIntentChange: a.useCallback((M) => {
          P.current = M;
        }, []),
      },
      a.createElement(
        D,
        O,
        a.createElement(
          uc,
          {
            asChild: !0,
            trapped: r,
            onMountAutoFocus: N(i, (M) => {
              var j;
              M.preventDefault(),
                (j = S.current) === null || j === void 0 || j.focus();
            }),
            onUnmountAutoFocus: s,
          },
          a.createElement(
            sc,
            {
              asChild: !0,
              disableOutsidePointerEvents: c,
              onEscapeKeyDown: u,
              onPointerDownOutside: f,
              onFocusOutside: d,
              onInteractOutside: h,
              onDismiss: m,
            },
            a.createElement(
              _a,
              T({ asChild: !0 }, w, {
                dir: x.dir,
                orientation: "vertical",
                loop: o,
                currentTabStopId: E,
                onCurrentTabStopIdChange: C,
                onEntryFocus: N(l, (M) => {
                  x.isUsingKeyboardRef.current || M.preventDefault();
                }),
              }),
              a.createElement(
                pa,
                T(
                  {
                    role: "menu",
                    "aria-orientation": "vertical",
                    "data-state": Sr(v.open),
                    "data-radix-menu-content": "",
                    dir: x.dir,
                  },
                  b,
                  p,
                  {
                    ref: R,
                    style: { outline: "none", ...p.style },
                    onKeyDown: N(p.onKeyDown, (M) => {
                      const z =
                          M.target.closest("[data-radix-menu-content]") ===
                          M.currentTarget,
                        V = M.ctrlKey || M.altKey || M.metaKey,
                        ue = M.key.length === 1;
                      z &&
                        (M.key === "Tab" && M.preventDefault(),
                        !V && ue && B(M.key));
                      const ke = S.current;
                      if (M.target !== ke || !bl.includes(M.key)) return;
                      M.preventDefault();
                      const J = y()
                        .filter((de) => !de.disabled)
                        .map((de) => de.ref.current);
                      hr.includes(M.key) && J.reverse(), Vl(J);
                    }),
                    onBlur: N(e.onBlur, (M) => {
                      M.currentTarget.contains(M.target) ||
                        (window.clearTimeout(_.current), (k.current = ""));
                    }),
                    onPointerMove: N(
                      e.onPointerMove,
                      Ke((M) => {
                        const j = M.target,
                          z = A.current !== M.clientX;
                        if (M.currentTarget.contains(j) && z) {
                          const V = M.clientX > A.current ? "right" : "left";
                          (G.current = V), (A.current = M.clientX);
                        }
                      }),
                    ),
                  },
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }),
  Al = a.forwardRef((e, t) => {
    const { __scopeMenu: n, ...o } = e;
    return a.createElement(Z.div, T({}, o, { ref: t }));
  }),
  Qt = "MenuItem",
  co = "menu.itemSelect",
  yn = a.forwardRef((e, t) => {
    const { disabled: n = !1, onSelect: o, ...r } = e,
      i = a.useRef(null),
      s = qe(Qt, e.__scopeMenu),
      c = xn(Qt, e.__scopeMenu),
      l = X(t, i),
      u = a.useRef(!1),
      f = () => {
        const d = i.current;
        if (!n && d) {
          const h = new CustomEvent(co, { bubbles: !0, cancelable: !0 });
          d.addEventListener(co, (m) => (o == null ? void 0 : o(m)), {
            once: !0,
          }),
            Lo(d, h),
            h.defaultPrevented ? (u.current = !1) : s.onClose();
        }
      };
    return a.createElement(
      yr,
      T({}, r, {
        ref: l,
        disabled: n,
        onClick: N(e.onClick, f),
        onPointerDown: (d) => {
          var h;
          (h = e.onPointerDown) === null || h === void 0 || h.call(e, d),
            (u.current = !0);
        },
        onPointerUp: N(e.onPointerUp, (d) => {
          var h;
          u.current ||
            (h = d.currentTarget) === null ||
            h === void 0 ||
            h.click();
        }),
        onKeyDown: N(e.onKeyDown, (d) => {
          const h = c.searchRef.current !== "";
          n ||
            (h && d.key === " ") ||
            (Zt.includes(d.key) &&
              (d.currentTarget.click(), d.preventDefault()));
        }),
      }),
    );
  }),
  yr = a.forwardRef((e, t) => {
    const { __scopeMenu: n, disabled: o = !1, textValue: r, ...i } = e,
      s = xn(Qt, n),
      c = vr(n),
      l = a.useRef(null),
      u = X(t, l),
      [f, d] = a.useState(!1),
      [h, m] = a.useState("");
    return (
      a.useEffect(() => {
        const g = l.current;
        if (g) {
          var p;
          m(((p = g.textContent) !== null && p !== void 0 ? p : "").trim());
        }
      }, [i.children]),
      a.createElement(
        Ve.ItemSlot,
        { scope: n, disabled: o, textValue: r ?? h },
        a.createElement(
          Ia,
          T({ asChild: !0 }, c, { focusable: !o }),
          a.createElement(
            Z.div,
            T(
              {
                role: "menuitem",
                "data-highlighted": f ? "" : void 0,
                "aria-disabled": o || void 0,
                "data-disabled": o ? "" : void 0,
              },
              i,
              {
                ref: u,
                onPointerMove: N(
                  e.onPointerMove,
                  Ke((g) => {
                    o
                      ? s.onItemLeave(g)
                      : (s.onItemEnter(g),
                        g.defaultPrevented || g.currentTarget.focus());
                  }),
                ),
                onPointerLeave: N(
                  e.onPointerLeave,
                  Ke((g) => s.onItemLeave(g)),
                ),
                onFocus: N(e.onFocus, () => d(!0)),
                onBlur: N(e.onBlur, () => d(!1)),
              },
            ),
          ),
        ),
      )
    );
  }),
  Ol = a.forwardRef((e, t) => {
    const { checked: n = !1, onCheckedChange: o, ...r } = e;
    return a.createElement(
      Cr,
      { scope: e.__scopeMenu, checked: n },
      a.createElement(
        yn,
        T(
          { role: "menuitemcheckbox", "aria-checked": xt(n) ? "mixed" : n },
          r,
          {
            ref: t,
            "data-state": $n(n),
            onSelect: N(
              r.onSelect,
              () => (o == null ? void 0 : o(xt(n) ? !0 : !n)),
              { checkForDefaultPrevented: !1 },
            ),
          },
        ),
      ),
    );
  }),
  kl = "MenuRadioGroup",
  [Hu, Nl] = $e(kl, { value: void 0, onValueChange: () => {} }),
  Dl = "MenuRadioItem",
  Ll = a.forwardRef((e, t) => {
    const { value: n, ...o } = e,
      r = Nl(Dl, e.__scopeMenu),
      i = n === r.value;
    return a.createElement(
      Cr,
      { scope: e.__scopeMenu, checked: i },
      a.createElement(
        yn,
        T({ role: "menuitemradio", "aria-checked": i }, o, {
          ref: t,
          "data-state": $n(i),
          onSelect: N(
            o.onSelect,
            () => {
              var s;
              return (s = r.onValueChange) === null || s === void 0
                ? void 0
                : s.call(r, n);
            },
            { checkForDefaultPrevented: !1 },
          ),
        }),
      ),
    );
  }),
  $r = "MenuItemIndicator",
  [Cr, Fl] = $e($r, { checked: !1 }),
  jl = a.forwardRef((e, t) => {
    const { __scopeMenu: n, forceMount: o, ...r } = e,
      i = Fl($r, n);
    return a.createElement(
      Xe,
      { present: o || xt(i.checked) || i.checked === !0 },
      a.createElement(
        Z.span,
        T({}, r, { ref: t, "data-state": $n(i.checked) }),
      ),
    );
  }),
  zl = a.forwardRef((e, t) => {
    const { __scopeMenu: n, ...o } = e;
    return a.createElement(
      Z.div,
      T({ role: "separator", "aria-orientation": "horizontal" }, o, { ref: t }),
    );
  }),
  Bl = "MenuSub",
  [Yu, Er] = $e(Bl),
  at = "MenuSubTrigger",
  Wl = a.forwardRef((e, t) => {
    const n = Ce(at, e.__scopeMenu),
      o = qe(at, e.__scopeMenu),
      r = Er(at, e.__scopeMenu),
      i = xn(at, e.__scopeMenu),
      s = a.useRef(null),
      { pointerGraceTimerRef: c, onPointerGraceIntentChange: l } = i,
      u = { __scopeMenu: e.__scopeMenu },
      f = a.useCallback(() => {
        s.current && window.clearTimeout(s.current), (s.current = null);
      }, []);
    return (
      a.useEffect(() => f, [f]),
      a.useEffect(() => {
        const d = c.current;
        return () => {
          window.clearTimeout(d), l(null);
        };
      }, [c, l]),
      a.createElement(
        br,
        T({ asChild: !0 }, u),
        a.createElement(
          yr,
          T(
            {
              id: r.triggerId,
              "aria-haspopup": "menu",
              "aria-expanded": n.open,
              "aria-controls": r.contentId,
              "data-state": Sr(n.open),
            },
            e,
            {
              ref: $t(t, r.onTriggerChange),
              onClick: (d) => {
                var h;
                (h = e.onClick) === null || h === void 0 || h.call(e, d),
                  !(e.disabled || d.defaultPrevented) &&
                    (d.currentTarget.focus(), n.open || n.onOpenChange(!0));
              },
              onPointerMove: N(
                e.onPointerMove,
                Ke((d) => {
                  i.onItemEnter(d),
                    !d.defaultPrevented &&
                      !e.disabled &&
                      !n.open &&
                      !s.current &&
                      (i.onPointerGraceIntentChange(null),
                      (s.current = window.setTimeout(() => {
                        n.onOpenChange(!0), f();
                      }, 100)));
                }),
              ),
              onPointerLeave: N(
                e.onPointerLeave,
                Ke((d) => {
                  var h;
                  f();
                  const m =
                    (h = n.content) === null || h === void 0
                      ? void 0
                      : h.getBoundingClientRect();
                  if (m) {
                    var g;
                    const p =
                        (g = n.content) === null || g === void 0
                          ? void 0
                          : g.dataset.side,
                      v = p === "right",
                      x = v ? -5 : 5,
                      b = m[v ? "left" : "right"],
                      w = m[v ? "right" : "left"];
                    i.onPointerGraceIntentChange({
                      area: [
                        { x: d.clientX + x, y: d.clientY },
                        { x: b, y: m.top },
                        { x: w, y: m.top },
                        { x: w, y: m.bottom },
                        { x: b, y: m.bottom },
                      ],
                      side: p,
                    }),
                      window.clearTimeout(c.current),
                      (c.current = window.setTimeout(
                        () => i.onPointerGraceIntentChange(null),
                        300,
                      ));
                  } else {
                    if ((i.onTriggerLeave(d), d.defaultPrevented)) return;
                    i.onPointerGraceIntentChange(null);
                  }
                }),
              ),
              onKeyDown: N(e.onKeyDown, (d) => {
                const h = i.searchRef.current !== "";
                if (
                  !(e.disabled || (h && d.key === " ")) &&
                  xl[o.dir].includes(d.key)
                ) {
                  var m;
                  n.onOpenChange(!0),
                    (m = n.content) === null || m === void 0 || m.focus(),
                    d.preventDefault();
                }
              }),
            },
          ),
        ),
      )
    );
  }),
  Ul = "MenuSubContent",
  Gl = a.forwardRef((e, t) => {
    const n = wr(te, e.__scopeMenu),
      { forceMount: o = n.forceMount, ...r } = e,
      i = Ce(te, e.__scopeMenu),
      s = qe(te, e.__scopeMenu),
      c = Er(Ul, e.__scopeMenu),
      l = a.useRef(null),
      u = X(t, l);
    return a.createElement(
      Ve.Provider,
      { scope: e.__scopeMenu },
      a.createElement(
        Xe,
        { present: o || i.open },
        a.createElement(
          Ve.Slot,
          { scope: e.__scopeMenu },
          a.createElement(
            wn,
            T({ id: c.contentId, "aria-labelledby": c.triggerId }, r, {
              ref: u,
              align: "start",
              side: s.dir === "rtl" ? "left" : "right",
              disableOutsidePointerEvents: !1,
              disableOutsideScroll: !1,
              trapFocus: !1,
              onOpenAutoFocus: (f) => {
                var d;
                s.isUsingKeyboardRef.current &&
                  ((d = l.current) === null || d === void 0 || d.focus()),
                  f.preventDefault();
              },
              onCloseAutoFocus: (f) => f.preventDefault(),
              onFocusOutside: N(e.onFocusOutside, (f) => {
                f.target !== c.trigger && i.onOpenChange(!1);
              }),
              onEscapeKeyDown: N(e.onEscapeKeyDown, (f) => {
                s.onClose(), f.preventDefault();
              }),
              onKeyDown: N(e.onKeyDown, (f) => {
                const d = f.currentTarget.contains(f.target),
                  h = wl[s.dir].includes(f.key);
                if (d && h) {
                  var m;
                  i.onOpenChange(!1),
                    (m = c.trigger) === null || m === void 0 || m.focus(),
                    f.preventDefault();
                }
              }),
            }),
          ),
        ),
      ),
    );
  });
function Sr(e) {
  return e ? "open" : "closed";
}
function xt(e) {
  return e === "indeterminate";
}
function $n(e) {
  return xt(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
function Vl(e) {
  const t = document.activeElement;
  for (const n of e)
    if (n === t || (n.focus(), document.activeElement !== t)) return;
}
function Kl(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
function Hl(e, t, n) {
  const r = t.length > 1 && Array.from(t).every((u) => u === t[0]) ? t[0] : t,
    i = n ? e.indexOf(n) : -1;
  let s = Kl(e, Math.max(i, 0));
  r.length === 1 && (s = s.filter((u) => u !== n));
  const l = s.find((u) => u.toLowerCase().startsWith(r.toLowerCase()));
  return l !== n ? l : void 0;
}
function Yl(e, t) {
  const { x: n, y: o } = e;
  let r = !1;
  for (let i = 0, s = t.length - 1; i < t.length; s = i++) {
    const c = t[i].x,
      l = t[i].y,
      u = t[s].x,
      f = t[s].y;
    l > o != f > o && n < ((u - c) * (o - l)) / (f - l) + c && (r = !r);
  }
  return r;
}
function Xl(e, t) {
  if (!t) return !1;
  const n = { x: e.clientX, y: e.clientY };
  return Yl(n, t);
}
function Ke(e) {
  return (t) => (t.pointerType === "mouse" ? e(t) : void 0);
}
const ql = Sl,
  Zl = br,
  Ql = Pl,
  Jl = Tl,
  eu = Al,
  tu = yn,
  nu = Ol,
  ou = Ll,
  ru = jl,
  iu = zl,
  su = Wl,
  cu = Gl,
  Rr = "DropdownMenu",
  [au, Xu] = He(Rr, [gr]),
  Q = gr(),
  [lu, Pr] = au(Rr),
  uu = (e) => {
    const {
        __scopeDropdownMenu: t,
        children: n,
        dir: o,
        open: r,
        defaultOpen: i,
        onOpenChange: s,
        modal: c = !0,
      } = e,
      l = Q(t),
      u = a.useRef(null),
      [f = !1, d] = Do({ prop: r, defaultProp: i, onChange: s });
    return a.createElement(
      lu,
      {
        scope: t,
        triggerId: Kt(),
        triggerRef: u,
        contentId: Kt(),
        open: f,
        onOpenChange: d,
        onOpenToggle: a.useCallback(() => d((h) => !h), [d]),
        modal: c,
      },
      a.createElement(
        ql,
        T({}, l, { open: f, onOpenChange: d, dir: o, modal: c }),
        n,
      ),
    );
  },
  du = "DropdownMenuTrigger",
  fu = a.forwardRef((e, t) => {
    const { __scopeDropdownMenu: n, disabled: o = !1, ...r } = e,
      i = Pr(du, n),
      s = Q(n);
    return a.createElement(
      Zl,
      T({ asChild: !0 }, s),
      a.createElement(
        Z.button,
        T(
          {
            type: "button",
            id: i.triggerId,
            "aria-haspopup": "menu",
            "aria-expanded": i.open,
            "aria-controls": i.open ? i.contentId : void 0,
            "data-state": i.open ? "open" : "closed",
            "data-disabled": o ? "" : void 0,
            disabled: o,
          },
          r,
          {
            ref: $t(t, i.triggerRef),
            onPointerDown: N(e.onPointerDown, (c) => {
              !o &&
                c.button === 0 &&
                c.ctrlKey === !1 &&
                (i.onOpenToggle(), i.open || c.preventDefault());
            }),
            onKeyDown: N(e.onKeyDown, (c) => {
              o ||
                (["Enter", " "].includes(c.key) && i.onOpenToggle(),
                c.key === "ArrowDown" && i.onOpenChange(!0),
                ["Enter", " ", "ArrowDown"].includes(c.key) &&
                  c.preventDefault());
            }),
          },
        ),
      ),
    );
  }),
  pu = (e) => {
    const { __scopeDropdownMenu: t, ...n } = e,
      o = Q(t);
    return a.createElement(Ql, T({}, o, n));
  },
  mu = "DropdownMenuContent",
  hu = a.forwardRef((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = Pr(mu, n),
      i = Q(n),
      s = a.useRef(!1);
    return a.createElement(
      Jl,
      T({ id: r.contentId, "aria-labelledby": r.triggerId }, i, o, {
        ref: t,
        onCloseAutoFocus: N(e.onCloseAutoFocus, (c) => {
          var l;
          s.current ||
            (l = r.triggerRef.current) === null ||
            l === void 0 ||
            l.focus(),
            (s.current = !1),
            c.preventDefault();
        }),
        onInteractOutside: N(e.onInteractOutside, (c) => {
          const l = c.detail.originalEvent,
            u = l.button === 0 && l.ctrlKey === !0,
            f = l.button === 2 || u;
          (!r.modal || f) && (s.current = !0);
        }),
        style: {
          ...e.style,
          "--radix-dropdown-menu-content-transform-origin":
            "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width":
            "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height":
            "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width":
            "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height":
            "var(--radix-popper-anchor-height)",
        },
      }),
    );
  }),
  gu = a.forwardRef((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = Q(n);
    return a.createElement(eu, T({}, r, o, { ref: t }));
  }),
  vu = a.forwardRef((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = Q(n);
    return a.createElement(tu, T({}, r, o, { ref: t }));
  }),
  bu = a.forwardRef((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = Q(n);
    return a.createElement(nu, T({}, r, o, { ref: t }));
  }),
  xu = a.forwardRef((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = Q(n);
    return a.createElement(ou, T({}, r, o, { ref: t }));
  }),
  wu = a.forwardRef((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = Q(n);
    return a.createElement(ru, T({}, r, o, { ref: t }));
  }),
  yu = a.forwardRef((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = Q(n);
    return a.createElement(iu, T({}, r, o, { ref: t }));
  }),
  $u = a.forwardRef((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = Q(n);
    return a.createElement(su, T({}, r, o, { ref: t }));
  }),
  Cu = a.forwardRef((e, t) => {
    const { __scopeDropdownMenu: n, ...o } = e,
      r = Q(n);
    return a.createElement(
      cu,
      T({}, r, o, {
        ref: t,
        style: {
          ...e.style,
          "--radix-dropdown-menu-content-transform-origin":
            "var(--radix-popper-transform-origin)",
          "--radix-dropdown-menu-content-available-width":
            "var(--radix-popper-available-width)",
          "--radix-dropdown-menu-content-available-height":
            "var(--radix-popper-available-height)",
          "--radix-dropdown-menu-trigger-width":
            "var(--radix-popper-anchor-width)",
          "--radix-dropdown-menu-trigger-height":
            "var(--radix-popper-anchor-height)",
        },
      }),
    );
  }),
  Eu = uu,
  Su = fu,
  Ru = pu,
  Mr = hu,
  Tr = gu,
  _r = vu,
  Ir = bu,
  Ar = xu,
  Or = wu,
  kr = yu,
  Nr = $u,
  Dr = Cu;
function Cn(e, t) {
  if (e == null) return {};
  var n = {},
    o = Object.keys(e),
    r,
    i;
  for (i = 0; i < o.length; i++)
    (r = o[i]), !(t.indexOf(r) >= 0) && (n[r] = e[r]);
  return n;
}
var Pu = ["color"],
  Mu = a.forwardRef(function (e, t) {
    var n = e.color,
      o = n === void 0 ? "currentColor" : n,
      r = Cn(e, Pu);
    return a.createElement(
      "svg",
      Object.assign(
        {
          width: "15",
          height: "15",
          viewBox: "0 0 15 15",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        r,
        { ref: t },
      ),
      a.createElement("path", {
        d: "M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z",
        fill: o,
        fillRule: "evenodd",
        clipRule: "evenodd",
      }),
    );
  }),
  Tu = ["color"],
  _u = a.forwardRef(function (e, t) {
    var n = e.color,
      o = n === void 0 ? "currentColor" : n,
      r = Cn(e, Tu);
    return a.createElement(
      "svg",
      Object.assign(
        {
          width: "15",
          height: "15",
          viewBox: "0 0 15 15",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        r,
        { ref: t },
      ),
      a.createElement("path", {
        d: "M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z",
        fill: o,
        fillRule: "evenodd",
        clipRule: "evenodd",
      }),
    );
  }),
  Iu = ["color"],
  Au = a.forwardRef(function (e, t) {
    var n = e.color,
      o = n === void 0 ? "currentColor" : n,
      r = Cn(e, Iu);
    return a.createElement(
      "svg",
      Object.assign(
        {
          width: "15",
          height: "15",
          viewBox: "0 0 15 15",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        r,
        { ref: t },
      ),
      a.createElement("path", {
        d: "M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z",
        fill: o,
      }),
    );
  });
const Ou = Eu,
  ku = Su,
  Nu = a.forwardRef(({ className: e, inset: t, children: n, ...o }, r) =>
    $.jsxs(Nr, {
      ref: r,
      className: ae(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
        t && "pl-8",
        e,
      ),
      ...o,
      children: [n, $.jsx(_u, { className: "ml-auto h-4 w-4" })],
    }),
  );
Nu.displayName = Nr.displayName;
const Du = a.forwardRef(({ className: e, ...t }, n) =>
  $.jsx(Dr, {
    ref: n,
    className: ae(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      e,
    ),
    ...t,
  }),
);
Du.displayName = Dr.displayName;
const Lr = a.forwardRef(({ className: e, sideOffset: t = 4, ...n }, o) =>
  $.jsx(Ru, {
    children: $.jsx(Mr, {
      ref: o,
      sideOffset: t,
      className: ae(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        e,
      ),
      ...n,
    }),
  }),
);
Lr.displayName = Mr.displayName;
const Fr = a.forwardRef(({ className: e, inset: t, ...n }, o) =>
  $.jsx(_r, {
    ref: o,
    className: ae(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      t && "pl-8",
      e,
    ),
    ...n,
  }),
);
Fr.displayName = _r.displayName;
const Lu = a.forwardRef(({ className: e, children: t, checked: n, ...o }, r) =>
  $.jsxs(Ir, {
    ref: r,
    className: ae(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e,
    ),
    checked: n,
    ...o,
    children: [
      $.jsx("span", {
        className:
          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: $.jsx(Or, { children: $.jsx(Mu, { className: "h-4 w-4" }) }),
      }),
      t,
    ],
  }),
);
Lu.displayName = Ir.displayName;
const Fu = a.forwardRef(({ className: e, children: t, ...n }, o) =>
  $.jsxs(Ar, {
    ref: o,
    className: ae(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      e,
    ),
    ...n,
    children: [
      $.jsx("span", {
        className:
          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: $.jsx(Or, {
          children: $.jsx(Au, { className: "h-4 w-4 fill-current" }),
        }),
      }),
      t,
    ],
  }),
);
Fu.displayName = Ar.displayName;
const ju = a.forwardRef(({ className: e, inset: t, ...n }, o) =>
  $.jsx(Tr, {
    ref: o,
    className: ae("px-2 py-1.5 text-sm font-semibold", t && "pl-8", e),
    ...n,
  }),
);
ju.displayName = Tr.displayName;
const zu = a.forwardRef(({ className: e, ...t }, n) =>
  $.jsx(kr, { ref: n, className: ae("-mx-1 my-1 h-px bg-muted", e), ...t }),
);
zu.displayName = kr.displayName;
const Bu = ["light", "dark", "system"];
function Wu() {
  const { setTheme: e } = Zs();
  return $.jsxs(Ou, {
    children: [
      $.jsx(ku, {
        asChild: !0,
        children: $.jsxs(un, {
          variant: "outline",
          size: "icon",
          children: [
            $.jsx(Ys, {
              className:
                "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0",
            }),
            $.jsx(Hs, {
              className:
                "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100",
            }),
            $.jsx("span", { className: "sr-only", children: "Toggle theme" }),
          ],
        }),
      }),
      $.jsx(Lr, {
        align: "end",
        children: Bu.map((t) =>
          $.jsx(
            Fr,
            {
              onClick: () => {
                e(t);
              },
              children: t.replace(/\b\w/g, (n) => n.toUpperCase()),
            },
            t,
          ),
        ),
      }),
    ],
  });
}
const Uu = [
  { display: "Home", name: "home" },
  { display: "Now", name: "now" },
  { display: "Blog", name: "blogs" },
];
function Gu() {
  return $.jsx("header", {
    children: $.jsxs("nav", {
      className: "flex flex-row items-center justify-center gap-x-2 px-6 py-8",
      children: [$.jsx(Gs, {}), $.jsx(Wu, {})],
    }),
  });
}
function qu({ children: e }) {
  return $.jsx(qs, {
    defaultTheme: "dark",
    storageKey: "vite-ui-theme",
    children: $.jsxs("div", {
      className: "mx-auto my-auto max-w-screen-2xl px-4 lg:px-8",
      children: [$.jsx(Gu, {}), e, $.jsx(ss, {})],
    }),
  });
}
export { un as B, an as I, qu as M, ae as a, ds as b, ko as c };
