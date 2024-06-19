import { version, ref, watchEffect, watch, getCurrentInstance, defineAsyncComponent, defineComponent, h, inject, computed, unref, provide, createElementBlock, shallowReactive, Suspense, nextTick, Fragment, Transition, useSSRContext, hasInjectionContext, mergeProps, resolveComponent, withCtx, createVNode, openBlock, createBlock, createCommentVNode, createApp, effectScope, reactive, getCurrentScope, shallowRef, toRef, onServerPrefetch, onErrorCaptured, resolveDynamicComponent, isRef, isReadonly, toValue, createTextVNode, isShallow, isReactive, toRaw } from 'vue';
import vt from 'node:http';
import Bs from 'node:https';
import st from 'node:zlib';
import me, { PassThrough, pipeline } from 'node:stream';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promisify, deprecate, types } from 'node:util';
import { format as format$1 } from 'node:url';
import { isIP } from 'node:net';
import { statSync, promises, createReadStream } from 'node:fs';
import { basename } from 'node:path';
import { b as baseURL } from '../routes/renderer.mjs';
import { h as createError$1, L as createHooks, M as sanitizeStatusCode, t as toRouteMatcher, v as createRouter$1 } from '../runtime.mjs';
import { CapoPlugin, getActiveHead } from 'unhead';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode, ssrRenderAttrs } from 'vue/server-renderer';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import '@unhead/shared';
import 'fs';
import 'path';
import '@iconify/utils';
import 'consola/core';

function createContext$1(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers$1.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers$1.delete(onLeave);
      }
    }
  };
}
function createNamespace$1(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext$1({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey$2 = "__unctx__";
const defaultNamespace = _globalThis$1[globalKey$2] || (_globalThis$1[globalKey$2] = createNamespace$1());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey$1 = "__unctx_async_handlers__";
const asyncHandlers$1 = _globalThis$1[asyncHandlersKey$1] || (_globalThis$1[asyncHandlersKey$1] = /* @__PURE__ */ new Set());

var _a, _b;
var t$1 = Object.defineProperty;
var o$1 = (e, l2) => t$1(e, "name", { value: l2, configurable: true });
var n$1 = typeof globalThis < "u" ? globalThis : typeof global < "u" ? global : typeof self < "u" ? self : {};
function f$1(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
o$1(f$1, "getDefaultExportFromCjs");
var As = Object.defineProperty;
var n = (i, o2) => As(i, "name", { value: o2, configurable: true });
var fi = (i, o2, a2) => {
  if (!o2.has(i)) throw TypeError("Cannot " + a2);
};
var O = (i, o2, a2) => (fi(i, o2, "read from private field"), a2 ? a2.call(i) : o2.get(i)), be = (i, o2, a2) => {
  if (o2.has(i)) throw TypeError("Cannot add the same private member more than once");
  o2 instanceof WeakSet ? o2.add(i) : o2.set(i, a2);
}, X = (i, o2, a2, u) => (fi(i, o2, "write to private field"), o2.set(i, a2), a2);
var ve, kt, bt, Cr, Ve, Wt, qt, Ot, ee, zt, Ne, He, It;
function js(i) {
  if (!/^data:/i.test(i)) throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  i = i.replace(/\r?\n/g, "");
  const o2 = i.indexOf(",");
  if (o2 === -1 || o2 <= 4) throw new TypeError("malformed data: URI");
  const a2 = i.substring(5, o2).split(";");
  let u = "", l2 = false;
  const p2 = a2[0] || "text/plain";
  let h2 = p2;
  for (let E = 1; E < a2.length; E++) a2[E] === "base64" ? l2 = true : a2[E] && (h2 += `;${a2[E]}`, a2[E].indexOf("charset=") === 0 && (u = a2[E].substring(8)));
  !a2[0] && !u.length && (h2 += ";charset=US-ASCII", u = "US-ASCII");
  const g2 = l2 ? "base64" : "ascii", A2 = unescape(i.substring(o2 + 1)), w = Buffer.from(A2, g2);
  return w.type = p2, w.typeFull = h2, w.charset = u, w;
}
n(js, "dataUriToBuffer");
var pr = { exports: {} };
/**
* @license
* web-streams-polyfill v3.3.3
* Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
* This code is released under the MIT license.
* SPDX-License-Identifier: MIT
*/
var di;
function Ls() {
  return di || (di = 1, function(i, o2) {
    (function(a2, u) {
      u(o2);
    })(n$1, function(a2) {
      function u() {
      }
      n(u, "noop");
      function l2(e) {
        return typeof e == "object" && e !== null || typeof e == "function";
      }
      n(l2, "typeIsObject");
      const p2 = u;
      function h2(e, t2) {
        try {
          Object.defineProperty(e, "name", { value: t2, configurable: true });
        } catch {
        }
      }
      n(h2, "setFunctionName");
      const g2 = Promise, A2 = Promise.prototype.then, w = Promise.reject.bind(g2);
      function E(e) {
        return new g2(e);
      }
      n(E, "newPromise");
      function T(e) {
        return E((t2) => t2(e));
      }
      n(T, "promiseResolvedWith");
      function b(e) {
        return w(e);
      }
      n(b, "promiseRejectedWith");
      function q(e, t2, r) {
        return A2.call(e, t2, r);
      }
      n(q, "PerformPromiseThen");
      function _(e, t2, r) {
        q(q(e, t2, r), void 0, p2);
      }
      n(_, "uponPromise");
      function V(e, t2) {
        _(e, t2);
      }
      n(V, "uponFulfillment");
      function I(e, t2) {
        _(e, void 0, t2);
      }
      n(I, "uponRejection");
      function F(e, t2, r) {
        return q(e, t2, r);
      }
      n(F, "transformPromiseWith");
      function Q(e) {
        q(e, void 0, p2);
      }
      n(Q, "setPromiseIsHandledToTrue");
      let ge = n((e) => {
        if (typeof queueMicrotask == "function") ge = queueMicrotask;
        else {
          const t2 = T(void 0);
          ge = n((r) => q(t2, r), "_queueMicrotask");
        }
        return ge(e);
      }, "_queueMicrotask");
      function z(e, t2, r) {
        if (typeof e != "function") throw new TypeError("Argument is not a function");
        return Function.prototype.apply.call(e, t2, r);
      }
      n(z, "reflectCall");
      function j(e, t2, r) {
        try {
          return T(z(e, t2, r));
        } catch (s2) {
          return b(s2);
        }
      }
      n(j, "promiseCall");
      const U = 16384, bn = class bn {
        constructor() {
          this._cursor = 0, this._size = 0, this._front = { _elements: [], _next: void 0 }, this._back = this._front, this._cursor = 0, this._size = 0;
        }
        get length() {
          return this._size;
        }
        push(t2) {
          const r = this._back;
          let s2 = r;
          r._elements.length === U - 1 && (s2 = { _elements: [], _next: void 0 }), r._elements.push(t2), s2 !== r && (this._back = s2, r._next = s2), ++this._size;
        }
        shift() {
          const t2 = this._front;
          let r = t2;
          const s2 = this._cursor;
          let f2 = s2 + 1;
          const c = t2._elements, d2 = c[s2];
          return f2 === U && (r = t2._next, f2 = 0), --this._size, this._cursor = f2, t2 !== r && (this._front = r), c[s2] = void 0, d2;
        }
        forEach(t2) {
          let r = this._cursor, s2 = this._front, f2 = s2._elements;
          for (; (r !== f2.length || s2._next !== void 0) && !(r === f2.length && (s2 = s2._next, f2 = s2._elements, r = 0, f2.length === 0)); ) t2(f2[r]), ++r;
        }
        peek() {
          const t2 = this._front, r = this._cursor;
          return t2._elements[r];
        }
      };
      n(bn, "SimpleQueue");
      let D = bn;
      const Ft = Symbol("[[AbortSteps]]"), Qn = Symbol("[[ErrorSteps]]"), Ar = Symbol("[[CancelSteps]]"), Br = Symbol("[[PullSteps]]"), kr = Symbol("[[ReleaseSteps]]");
      function Yn(e, t2) {
        e._ownerReadableStream = t2, t2._reader = e, t2._state === "readable" ? qr(e) : t2._state === "closed" ? Li(e) : Gn(e, t2._storedError);
      }
      n(Yn, "ReadableStreamReaderGenericInitialize");
      function Wr(e, t2) {
        const r = e._ownerReadableStream;
        return ie(r, t2);
      }
      n(Wr, "ReadableStreamReaderGenericCancel");
      function _e(e) {
        const t2 = e._ownerReadableStream;
        t2._state === "readable" ? Or(e, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")) : $i(e, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")), t2._readableStreamController[kr](), t2._reader = void 0, e._ownerReadableStream = void 0;
      }
      n(_e, "ReadableStreamReaderGenericRelease");
      function jt(e) {
        return new TypeError("Cannot " + e + " a stream using a released reader");
      }
      n(jt, "readerLockException");
      function qr(e) {
        e._closedPromise = E((t2, r) => {
          e._closedPromise_resolve = t2, e._closedPromise_reject = r;
        });
      }
      n(qr, "defaultReaderClosedPromiseInitialize");
      function Gn(e, t2) {
        qr(e), Or(e, t2);
      }
      n(Gn, "defaultReaderClosedPromiseInitializeAsRejected");
      function Li(e) {
        qr(e), Zn(e);
      }
      n(Li, "defaultReaderClosedPromiseInitializeAsResolved");
      function Or(e, t2) {
        e._closedPromise_reject !== void 0 && (Q(e._closedPromise), e._closedPromise_reject(t2), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0);
      }
      n(Or, "defaultReaderClosedPromiseReject");
      function $i(e, t2) {
        Gn(e, t2);
      }
      n($i, "defaultReaderClosedPromiseResetToRejected");
      function Zn(e) {
        e._closedPromise_resolve !== void 0 && (e._closedPromise_resolve(void 0), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0);
      }
      n(Zn, "defaultReaderClosedPromiseResolve");
      const Kn = Number.isFinite || function(e) {
        return typeof e == "number" && isFinite(e);
      }, Di = Math.trunc || function(e) {
        return e < 0 ? Math.ceil(e) : Math.floor(e);
      };
      function Mi(e) {
        return typeof e == "object" || typeof e == "function";
      }
      n(Mi, "isDictionary");
      function ue(e, t2) {
        if (e !== void 0 && !Mi(e)) throw new TypeError(`${t2} is not an object.`);
      }
      n(ue, "assertDictionary");
      function Z(e, t2) {
        if (typeof e != "function") throw new TypeError(`${t2} is not a function.`);
      }
      n(Z, "assertFunction");
      function Ui(e) {
        return typeof e == "object" && e !== null || typeof e == "function";
      }
      n(Ui, "isObject");
      function Jn(e, t2) {
        if (!Ui(e)) throw new TypeError(`${t2} is not an object.`);
      }
      n(Jn, "assertObject");
      function Se(e, t2, r) {
        if (e === void 0) throw new TypeError(`Parameter ${t2} is required in '${r}'.`);
      }
      n(Se, "assertRequiredArgument");
      function zr(e, t2, r) {
        if (e === void 0) throw new TypeError(`${t2} is required in '${r}'.`);
      }
      n(zr, "assertRequiredField");
      function Ir(e) {
        return Number(e);
      }
      n(Ir, "convertUnrestrictedDouble");
      function Xn(e) {
        return e === 0 ? 0 : e;
      }
      n(Xn, "censorNegativeZero");
      function xi(e) {
        return Xn(Di(e));
      }
      n(xi, "integerPart");
      function Fr(e, t2) {
        const s2 = Number.MAX_SAFE_INTEGER;
        let f2 = Number(e);
        if (f2 = Xn(f2), !Kn(f2)) throw new TypeError(`${t2} is not a finite number`);
        if (f2 = xi(f2), f2 < 0 || f2 > s2) throw new TypeError(`${t2} is outside the accepted range of 0 to ${s2}, inclusive`);
        return !Kn(f2) || f2 === 0 ? 0 : f2;
      }
      n(Fr, "convertUnsignedLongLongWithEnforceRange");
      function jr(e, t2) {
        if (!We(e)) throw new TypeError(`${t2} is not a ReadableStream.`);
      }
      n(jr, "assertReadableStream");
      function Qe(e) {
        return new fe(e);
      }
      n(Qe, "AcquireReadableStreamDefaultReader");
      function eo(e, t2) {
        e._reader._readRequests.push(t2);
      }
      n(eo, "ReadableStreamAddReadRequest");
      function Lr(e, t2, r) {
        const f2 = e._reader._readRequests.shift();
        r ? f2._closeSteps() : f2._chunkSteps(t2);
      }
      n(Lr, "ReadableStreamFulfillReadRequest");
      function Lt(e) {
        return e._reader._readRequests.length;
      }
      n(Lt, "ReadableStreamGetNumReadRequests");
      function to(e) {
        const t2 = e._reader;
        return !(t2 === void 0 || !Ee(t2));
      }
      n(to, "ReadableStreamHasDefaultReader");
      const mn = class mn {
        constructor(t2) {
          if (Se(t2, 1, "ReadableStreamDefaultReader"), jr(t2, "First parameter"), qe(t2)) throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          Yn(this, t2), this._readRequests = new D();
        }
        get closed() {
          return Ee(this) ? this._closedPromise : b($t("closed"));
        }
        cancel(t2 = void 0) {
          return Ee(this) ? this._ownerReadableStream === void 0 ? b(jt("cancel")) : Wr(this, t2) : b($t("cancel"));
        }
        read() {
          if (!Ee(this)) return b($t("read"));
          if (this._ownerReadableStream === void 0) return b(jt("read from"));
          let t2, r;
          const s2 = E((c, d2) => {
            t2 = c, r = d2;
          });
          return mt(this, { _chunkSteps: (c) => t2({ value: c, done: false }), _closeSteps: () => t2({ value: void 0, done: true }), _errorSteps: (c) => r(c) }), s2;
        }
        releaseLock() {
          if (!Ee(this)) throw $t("releaseLock");
          this._ownerReadableStream !== void 0 && Ni(this);
        }
      };
      n(mn, "ReadableStreamDefaultReader");
      let fe = mn;
      Object.defineProperties(fe.prototype, { cancel: { enumerable: true }, read: { enumerable: true }, releaseLock: { enumerable: true }, closed: { enumerable: true } }), h2(fe.prototype.cancel, "cancel"), h2(fe.prototype.read, "read"), h2(fe.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(fe.prototype, Symbol.toStringTag, { value: "ReadableStreamDefaultReader", configurable: true });
      function Ee(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_readRequests") ? false : e instanceof fe;
      }
      n(Ee, "IsReadableStreamDefaultReader");
      function mt(e, t2) {
        const r = e._ownerReadableStream;
        r._disturbed = true, r._state === "closed" ? t2._closeSteps() : r._state === "errored" ? t2._errorSteps(r._storedError) : r._readableStreamController[Br](t2);
      }
      n(mt, "ReadableStreamDefaultReaderRead");
      function Ni(e) {
        _e(e);
        const t2 = new TypeError("Reader was released");
        ro(e, t2);
      }
      n(Ni, "ReadableStreamDefaultReaderRelease");
      function ro(e, t2) {
        const r = e._readRequests;
        e._readRequests = new D(), r.forEach((s2) => {
          s2._errorSteps(t2);
        });
      }
      n(ro, "ReadableStreamDefaultReaderErrorReadRequests");
      function $t(e) {
        return new TypeError(`ReadableStreamDefaultReader.prototype.${e} can only be used on a ReadableStreamDefaultReader`);
      }
      n($t, "defaultReaderBrandCheckException");
      const Hi = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
      }).prototype), yn = class yn {
        constructor(t2, r) {
          this._ongoingPromise = void 0, this._isFinished = false, this._reader = t2, this._preventCancel = r;
        }
        next() {
          const t2 = n(() => this._nextSteps(), "nextSteps");
          return this._ongoingPromise = this._ongoingPromise ? F(this._ongoingPromise, t2, t2) : t2(), this._ongoingPromise;
        }
        return(t2) {
          const r = n(() => this._returnSteps(t2), "returnSteps");
          return this._ongoingPromise ? F(this._ongoingPromise, r, r) : r();
        }
        _nextSteps() {
          if (this._isFinished) return Promise.resolve({ value: void 0, done: true });
          const t2 = this._reader;
          let r, s2;
          const f2 = E((d2, m) => {
            r = d2, s2 = m;
          });
          return mt(t2, { _chunkSteps: (d2) => {
            this._ongoingPromise = void 0, ge(() => r({ value: d2, done: false }));
          }, _closeSteps: () => {
            this._ongoingPromise = void 0, this._isFinished = true, _e(t2), r({ value: void 0, done: true });
          }, _errorSteps: (d2) => {
            this._ongoingPromise = void 0, this._isFinished = true, _e(t2), s2(d2);
          } }), f2;
        }
        _returnSteps(t2) {
          if (this._isFinished) return Promise.resolve({ value: t2, done: true });
          this._isFinished = true;
          const r = this._reader;
          if (!this._preventCancel) {
            const s2 = Wr(r, t2);
            return _e(r), F(s2, () => ({ value: t2, done: true }));
          }
          return _e(r), T({ value: t2, done: true });
        }
      };
      n(yn, "ReadableStreamAsyncIteratorImpl");
      let Dt = yn;
      const no = { next() {
        return oo(this) ? this._asyncIteratorImpl.next() : b(io("next"));
      }, return(e) {
        return oo(this) ? this._asyncIteratorImpl.return(e) : b(io("return"));
      } };
      Object.setPrototypeOf(no, Hi);
      function Vi(e, t2) {
        const r = Qe(e), s2 = new Dt(r, t2), f2 = Object.create(no);
        return f2._asyncIteratorImpl = s2, f2;
      }
      n(Vi, "AcquireReadableStreamAsyncIterator");
      function oo(e) {
        if (!l2(e) || !Object.prototype.hasOwnProperty.call(e, "_asyncIteratorImpl")) return false;
        try {
          return e._asyncIteratorImpl instanceof Dt;
        } catch {
          return false;
        }
      }
      n(oo, "IsReadableStreamAsyncIterator");
      function io(e) {
        return new TypeError(`ReadableStreamAsyncIterator.${e} can only be used on a ReadableSteamAsyncIterator`);
      }
      n(io, "streamAsyncIteratorBrandCheckException");
      const ao = Number.isNaN || function(e) {
        return e !== e;
      };
      var $r, Dr, Mr;
      function yt(e) {
        return e.slice();
      }
      n(yt, "CreateArrayFromList");
      function so(e, t2, r, s2, f2) {
        new Uint8Array(e).set(new Uint8Array(r, s2, f2), t2);
      }
      n(so, "CopyDataBlockBytes");
      let we = n((e) => (typeof e.transfer == "function" ? we = n((t2) => t2.transfer(), "TransferArrayBuffer") : typeof structuredClone == "function" ? we = n((t2) => structuredClone(t2, { transfer: [t2] }), "TransferArrayBuffer") : we = n((t2) => t2, "TransferArrayBuffer"), we(e)), "TransferArrayBuffer"), Ae = n((e) => (typeof e.detached == "boolean" ? Ae = n((t2) => t2.detached, "IsDetachedBuffer") : Ae = n((t2) => t2.byteLength === 0, "IsDetachedBuffer"), Ae(e)), "IsDetachedBuffer");
      function lo(e, t2, r) {
        if (e.slice) return e.slice(t2, r);
        const s2 = r - t2, f2 = new ArrayBuffer(s2);
        return so(f2, 0, e, t2, s2), f2;
      }
      n(lo, "ArrayBufferSlice");
      function Mt(e, t2) {
        const r = e[t2];
        if (r != null) {
          if (typeof r != "function") throw new TypeError(`${String(t2)} is not a function`);
          return r;
        }
      }
      n(Mt, "GetMethod");
      function Qi(e) {
        const t2 = { [Symbol.iterator]: () => e.iterator }, r = async function* () {
          return yield* t2;
        }(), s2 = r.next;
        return { iterator: r, nextMethod: s2, done: false };
      }
      n(Qi, "CreateAsyncFromSyncIterator");
      const Ur = (Mr = ($r = Symbol.asyncIterator) !== null && $r !== void 0 ? $r : (Dr = Symbol.for) === null || Dr === void 0 ? void 0 : Dr.call(Symbol, "Symbol.asyncIterator")) !== null && Mr !== void 0 ? Mr : "@@asyncIterator";
      function uo(e, t2 = "sync", r) {
        if (r === void 0) if (t2 === "async") {
          if (r = Mt(e, Ur), r === void 0) {
            const c = Mt(e, Symbol.iterator), d2 = uo(e, "sync", c);
            return Qi(d2);
          }
        } else r = Mt(e, Symbol.iterator);
        if (r === void 0) throw new TypeError("The object is not iterable");
        const s2 = z(r, e, []);
        if (!l2(s2)) throw new TypeError("The iterator method must return an object");
        const f2 = s2.next;
        return { iterator: s2, nextMethod: f2, done: false };
      }
      n(uo, "GetIterator");
      function Yi(e) {
        const t2 = z(e.nextMethod, e.iterator, []);
        if (!l2(t2)) throw new TypeError("The iterator.next() method must return an object");
        return t2;
      }
      n(Yi, "IteratorNext");
      function Gi(e) {
        return !!e.done;
      }
      n(Gi, "IteratorComplete");
      function Zi(e) {
        return e.value;
      }
      n(Zi, "IteratorValue");
      function Ki(e) {
        return !(typeof e != "number" || ao(e) || e < 0);
      }
      n(Ki, "IsNonNegativeNumber");
      function fo(e) {
        const t2 = lo(e.buffer, e.byteOffset, e.byteOffset + e.byteLength);
        return new Uint8Array(t2);
      }
      n(fo, "CloneAsUint8Array");
      function xr(e) {
        const t2 = e._queue.shift();
        return e._queueTotalSize -= t2.size, e._queueTotalSize < 0 && (e._queueTotalSize = 0), t2.value;
      }
      n(xr, "DequeueValue");
      function Nr(e, t2, r) {
        if (!Ki(r) || r === 1 / 0) throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
        e._queue.push({ value: t2, size: r }), e._queueTotalSize += r;
      }
      n(Nr, "EnqueueValueWithSize");
      function Ji(e) {
        return e._queue.peek().value;
      }
      n(Ji, "PeekQueueValue");
      function Be(e) {
        e._queue = new D(), e._queueTotalSize = 0;
      }
      n(Be, "ResetQueue");
      function co(e) {
        return e === DataView;
      }
      n(co, "isDataViewConstructor");
      function Xi(e) {
        return co(e.constructor);
      }
      n(Xi, "isDataView");
      function ea(e) {
        return co(e) ? 1 : e.BYTES_PER_ELEMENT;
      }
      n(ea, "arrayBufferViewElementSize");
      const gn = class gn {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get view() {
          if (!Hr(this)) throw Zr("view");
          return this._view;
        }
        respond(t2) {
          if (!Hr(this)) throw Zr("respond");
          if (Se(t2, 1, "respond"), t2 = Fr(t2, "First parameter"), this._associatedReadableByteStreamController === void 0) throw new TypeError("This BYOB request has been invalidated");
          if (Ae(this._view.buffer)) throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");
          Ht(this._associatedReadableByteStreamController, t2);
        }
        respondWithNewView(t2) {
          if (!Hr(this)) throw Zr("respondWithNewView");
          if (Se(t2, 1, "respondWithNewView"), !ArrayBuffer.isView(t2)) throw new TypeError("You can only respond with array buffer views");
          if (this._associatedReadableByteStreamController === void 0) throw new TypeError("This BYOB request has been invalidated");
          if (Ae(t2.buffer)) throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
          Vt(this._associatedReadableByteStreamController, t2);
        }
      };
      n(gn, "ReadableStreamBYOBRequest");
      let Re = gn;
      Object.defineProperties(Re.prototype, { respond: { enumerable: true }, respondWithNewView: { enumerable: true }, view: { enumerable: true } }), h2(Re.prototype.respond, "respond"), h2(Re.prototype.respondWithNewView, "respondWithNewView"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Re.prototype, Symbol.toStringTag, { value: "ReadableStreamBYOBRequest", configurable: true });
      const _n = class _n {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get byobRequest() {
          if (!ze(this)) throw _t("byobRequest");
          return Gr(this);
        }
        get desiredSize() {
          if (!ze(this)) throw _t("desiredSize");
          return Ro(this);
        }
        close() {
          if (!ze(this)) throw _t("close");
          if (this._closeRequested) throw new TypeError("The stream has already been closed; do not close it again!");
          const t2 = this._controlledReadableByteStream._state;
          if (t2 !== "readable") throw new TypeError(`The stream (in ${t2} state) is not in the readable state and cannot be closed`);
          gt(this);
        }
        enqueue(t2) {
          if (!ze(this)) throw _t("enqueue");
          if (Se(t2, 1, "enqueue"), !ArrayBuffer.isView(t2)) throw new TypeError("chunk must be an array buffer view");
          if (t2.byteLength === 0) throw new TypeError("chunk must have non-zero byteLength");
          if (t2.buffer.byteLength === 0) throw new TypeError("chunk's buffer must have non-zero byteLength");
          if (this._closeRequested) throw new TypeError("stream is closed or draining");
          const r = this._controlledReadableByteStream._state;
          if (r !== "readable") throw new TypeError(`The stream (in ${r} state) is not in the readable state and cannot be enqueued to`);
          Nt(this, t2);
        }
        error(t2 = void 0) {
          if (!ze(this)) throw _t("error");
          K2(this, t2);
        }
        [Ar](t2) {
          ho(this), Be(this);
          const r = this._cancelAlgorithm(t2);
          return xt(this), r;
        }
        [Br](t2) {
          const r = this._controlledReadableByteStream;
          if (this._queueTotalSize > 0) {
            wo(this, t2);
            return;
          }
          const s2 = this._autoAllocateChunkSize;
          if (s2 !== void 0) {
            let f2;
            try {
              f2 = new ArrayBuffer(s2);
            } catch (d2) {
              t2._errorSteps(d2);
              return;
            }
            const c = { buffer: f2, bufferByteLength: s2, byteOffset: 0, byteLength: s2, bytesFilled: 0, minimumFill: 1, elementSize: 1, viewConstructor: Uint8Array, readerType: "default" };
            this._pendingPullIntos.push(c);
          }
          eo(r, t2), Ie(this);
        }
        [kr]() {
          if (this._pendingPullIntos.length > 0) {
            const t2 = this._pendingPullIntos.peek();
            t2.readerType = "none", this._pendingPullIntos = new D(), this._pendingPullIntos.push(t2);
          }
        }
      };
      n(_n, "ReadableByteStreamController");
      let te = _n;
      Object.defineProperties(te.prototype, { close: { enumerable: true }, enqueue: { enumerable: true }, error: { enumerable: true }, byobRequest: { enumerable: true }, desiredSize: { enumerable: true } }), h2(te.prototype.close, "close"), h2(te.prototype.enqueue, "enqueue"), h2(te.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(te.prototype, Symbol.toStringTag, { value: "ReadableByteStreamController", configurable: true });
      function ze(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledReadableByteStream") ? false : e instanceof te;
      }
      n(ze, "IsReadableByteStreamController");
      function Hr(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_associatedReadableByteStreamController") ? false : e instanceof Re;
      }
      n(Hr, "IsReadableStreamBYOBRequest");
      function Ie(e) {
        if (!ia(e)) return;
        if (e._pulling) {
          e._pullAgain = true;
          return;
        }
        e._pulling = true;
        const r = e._pullAlgorithm();
        _(r, () => (e._pulling = false, e._pullAgain && (e._pullAgain = false, Ie(e)), null), (s2) => (K2(e, s2), null));
      }
      n(Ie, "ReadableByteStreamControllerCallPullIfNeeded");
      function ho(e) {
        Qr(e), e._pendingPullIntos = new D();
      }
      n(ho, "ReadableByteStreamControllerClearPendingPullIntos");
      function Vr(e, t2) {
        let r = false;
        e._state === "closed" && (r = true);
        const s2 = po(t2);
        t2.readerType === "default" ? Lr(e, s2, r) : ca(e, s2, r);
      }
      n(Vr, "ReadableByteStreamControllerCommitPullIntoDescriptor");
      function po(e) {
        const t2 = e.bytesFilled, r = e.elementSize;
        return new e.viewConstructor(e.buffer, e.byteOffset, t2 / r);
      }
      n(po, "ReadableByteStreamControllerConvertPullIntoDescriptor");
      function Ut(e, t2, r, s2) {
        e._queue.push({ buffer: t2, byteOffset: r, byteLength: s2 }), e._queueTotalSize += s2;
      }
      n(Ut, "ReadableByteStreamControllerEnqueueChunkToQueue");
      function bo(e, t2, r, s2) {
        let f2;
        try {
          f2 = lo(t2, r, r + s2);
        } catch (c) {
          throw K2(e, c), c;
        }
        Ut(e, f2, 0, s2);
      }
      n(bo, "ReadableByteStreamControllerEnqueueClonedChunkToQueue");
      function mo(e, t2) {
        t2.bytesFilled > 0 && bo(e, t2.buffer, t2.byteOffset, t2.bytesFilled), Ye(e);
      }
      n(mo, "ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue");
      function yo(e, t2) {
        const r = Math.min(e._queueTotalSize, t2.byteLength - t2.bytesFilled), s2 = t2.bytesFilled + r;
        let f2 = r, c = false;
        const d2 = s2 % t2.elementSize, m = s2 - d2;
        m >= t2.minimumFill && (f2 = m - t2.bytesFilled, c = true);
        const R = e._queue;
        for (; f2 > 0; ) {
          const y = R.peek(), C = Math.min(f2, y.byteLength), P = t2.byteOffset + t2.bytesFilled;
          so(t2.buffer, P, y.buffer, y.byteOffset, C), y.byteLength === C ? R.shift() : (y.byteOffset += C, y.byteLength -= C), e._queueTotalSize -= C, go(e, C, t2), f2 -= C;
        }
        return c;
      }
      n(yo, "ReadableByteStreamControllerFillPullIntoDescriptorFromQueue");
      function go(e, t2, r) {
        r.bytesFilled += t2;
      }
      n(go, "ReadableByteStreamControllerFillHeadPullIntoDescriptor");
      function _o(e) {
        e._queueTotalSize === 0 && e._closeRequested ? (xt(e), Pt(e._controlledReadableByteStream)) : Ie(e);
      }
      n(_o, "ReadableByteStreamControllerHandleQueueDrain");
      function Qr(e) {
        e._byobRequest !== null && (e._byobRequest._associatedReadableByteStreamController = void 0, e._byobRequest._view = null, e._byobRequest = null);
      }
      n(Qr, "ReadableByteStreamControllerInvalidateBYOBRequest");
      function Yr(e) {
        for (; e._pendingPullIntos.length > 0; ) {
          if (e._queueTotalSize === 0) return;
          const t2 = e._pendingPullIntos.peek();
          yo(e, t2) && (Ye(e), Vr(e._controlledReadableByteStream, t2));
        }
      }
      n(Yr, "ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue");
      function ta(e) {
        const t2 = e._controlledReadableByteStream._reader;
        for (; t2._readRequests.length > 0; ) {
          if (e._queueTotalSize === 0) return;
          const r = t2._readRequests.shift();
          wo(e, r);
        }
      }
      n(ta, "ReadableByteStreamControllerProcessReadRequestsUsingQueue");
      function ra(e, t2, r, s2) {
        const f2 = e._controlledReadableByteStream, c = t2.constructor, d2 = ea(c), { byteOffset: m, byteLength: R } = t2, y = r * d2;
        let C;
        try {
          C = we(t2.buffer);
        } catch (B) {
          s2._errorSteps(B);
          return;
        }
        const P = { buffer: C, bufferByteLength: C.byteLength, byteOffset: m, byteLength: R, bytesFilled: 0, minimumFill: y, elementSize: d2, viewConstructor: c, readerType: "byob" };
        if (e._pendingPullIntos.length > 0) {
          e._pendingPullIntos.push(P), Po(f2, s2);
          return;
        }
        if (f2._state === "closed") {
          const B = new c(P.buffer, P.byteOffset, 0);
          s2._closeSteps(B);
          return;
        }
        if (e._queueTotalSize > 0) {
          if (yo(e, P)) {
            const B = po(P);
            _o(e), s2._chunkSteps(B);
            return;
          }
          if (e._closeRequested) {
            const B = new TypeError("Insufficient bytes to fill elements in the given buffer");
            K2(e, B), s2._errorSteps(B);
            return;
          }
        }
        e._pendingPullIntos.push(P), Po(f2, s2), Ie(e);
      }
      n(ra, "ReadableByteStreamControllerPullInto");
      function na(e, t2) {
        t2.readerType === "none" && Ye(e);
        const r = e._controlledReadableByteStream;
        if (Kr(r)) for (; vo(r) > 0; ) {
          const s2 = Ye(e);
          Vr(r, s2);
        }
      }
      n(na, "ReadableByteStreamControllerRespondInClosedState");
      function oa(e, t2, r) {
        if (go(e, t2, r), r.readerType === "none") {
          mo(e, r), Yr(e);
          return;
        }
        if (r.bytesFilled < r.minimumFill) return;
        Ye(e);
        const s2 = r.bytesFilled % r.elementSize;
        if (s2 > 0) {
          const f2 = r.byteOffset + r.bytesFilled;
          bo(e, r.buffer, f2 - s2, s2);
        }
        r.bytesFilled -= s2, Vr(e._controlledReadableByteStream, r), Yr(e);
      }
      n(oa, "ReadableByteStreamControllerRespondInReadableState");
      function So(e, t2) {
        const r = e._pendingPullIntos.peek();
        Qr(e), e._controlledReadableByteStream._state === "closed" ? na(e, r) : oa(e, t2, r), Ie(e);
      }
      n(So, "ReadableByteStreamControllerRespondInternal");
      function Ye(e) {
        return e._pendingPullIntos.shift();
      }
      n(Ye, "ReadableByteStreamControllerShiftPendingPullInto");
      function ia(e) {
        const t2 = e._controlledReadableByteStream;
        return t2._state !== "readable" || e._closeRequested || !e._started ? false : !!(to(t2) && Lt(t2) > 0 || Kr(t2) && vo(t2) > 0 || Ro(e) > 0);
      }
      n(ia, "ReadableByteStreamControllerShouldCallPull");
      function xt(e) {
        e._pullAlgorithm = void 0, e._cancelAlgorithm = void 0;
      }
      n(xt, "ReadableByteStreamControllerClearAlgorithms");
      function gt(e) {
        const t2 = e._controlledReadableByteStream;
        if (!(e._closeRequested || t2._state !== "readable")) {
          if (e._queueTotalSize > 0) {
            e._closeRequested = true;
            return;
          }
          if (e._pendingPullIntos.length > 0) {
            const r = e._pendingPullIntos.peek();
            if (r.bytesFilled % r.elementSize !== 0) {
              const s2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              throw K2(e, s2), s2;
            }
          }
          xt(e), Pt(t2);
        }
      }
      n(gt, "ReadableByteStreamControllerClose");
      function Nt(e, t2) {
        const r = e._controlledReadableByteStream;
        if (e._closeRequested || r._state !== "readable") return;
        const { buffer: s2, byteOffset: f2, byteLength: c } = t2;
        if (Ae(s2)) throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
        const d2 = we(s2);
        if (e._pendingPullIntos.length > 0) {
          const m = e._pendingPullIntos.peek();
          if (Ae(m.buffer)) throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
          Qr(e), m.buffer = we(m.buffer), m.readerType === "none" && mo(e, m);
        }
        if (to(r)) if (ta(e), Lt(r) === 0) Ut(e, d2, f2, c);
        else {
          e._pendingPullIntos.length > 0 && Ye(e);
          const m = new Uint8Array(d2, f2, c);
          Lr(r, m, false);
        }
        else Kr(r) ? (Ut(e, d2, f2, c), Yr(e)) : Ut(e, d2, f2, c);
        Ie(e);
      }
      n(Nt, "ReadableByteStreamControllerEnqueue");
      function K2(e, t2) {
        const r = e._controlledReadableByteStream;
        r._state === "readable" && (ho(e), Be(e), xt(e), Zo(r, t2));
      }
      n(K2, "ReadableByteStreamControllerError");
      function wo(e, t2) {
        const r = e._queue.shift();
        e._queueTotalSize -= r.byteLength, _o(e);
        const s2 = new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
        t2._chunkSteps(s2);
      }
      n(wo, "ReadableByteStreamControllerFillReadRequestFromQueue");
      function Gr(e) {
        if (e._byobRequest === null && e._pendingPullIntos.length > 0) {
          const t2 = e._pendingPullIntos.peek(), r = new Uint8Array(t2.buffer, t2.byteOffset + t2.bytesFilled, t2.byteLength - t2.bytesFilled), s2 = Object.create(Re.prototype);
          sa(s2, e, r), e._byobRequest = s2;
        }
        return e._byobRequest;
      }
      n(Gr, "ReadableByteStreamControllerGetBYOBRequest");
      function Ro(e) {
        const t2 = e._controlledReadableByteStream._state;
        return t2 === "errored" ? null : t2 === "closed" ? 0 : e._strategyHWM - e._queueTotalSize;
      }
      n(Ro, "ReadableByteStreamControllerGetDesiredSize");
      function Ht(e, t2) {
        const r = e._pendingPullIntos.peek();
        if (e._controlledReadableByteStream._state === "closed") {
          if (t2 !== 0) throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
        } else {
          if (t2 === 0) throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
          if (r.bytesFilled + t2 > r.byteLength) throw new RangeError("bytesWritten out of range");
        }
        r.buffer = we(r.buffer), So(e, t2);
      }
      n(Ht, "ReadableByteStreamControllerRespond");
      function Vt(e, t2) {
        const r = e._pendingPullIntos.peek();
        if (e._controlledReadableByteStream._state === "closed") {
          if (t2.byteLength !== 0) throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
        } else if (t2.byteLength === 0) throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
        if (r.byteOffset + r.bytesFilled !== t2.byteOffset) throw new RangeError("The region specified by view does not match byobRequest");
        if (r.bufferByteLength !== t2.buffer.byteLength) throw new RangeError("The buffer of view has different capacity than byobRequest");
        if (r.bytesFilled + t2.byteLength > r.byteLength) throw new RangeError("The region specified by view is larger than byobRequest");
        const f2 = t2.byteLength;
        r.buffer = we(t2.buffer), So(e, f2);
      }
      n(Vt, "ReadableByteStreamControllerRespondWithNewView");
      function To(e, t2, r, s2, f2, c, d2) {
        t2._controlledReadableByteStream = e, t2._pullAgain = false, t2._pulling = false, t2._byobRequest = null, t2._queue = t2._queueTotalSize = void 0, Be(t2), t2._closeRequested = false, t2._started = false, t2._strategyHWM = c, t2._pullAlgorithm = s2, t2._cancelAlgorithm = f2, t2._autoAllocateChunkSize = d2, t2._pendingPullIntos = new D(), e._readableStreamController = t2;
        const m = r();
        _(T(m), () => (t2._started = true, Ie(t2), null), (R) => (K2(t2, R), null));
      }
      n(To, "SetUpReadableByteStreamController");
      function aa(e, t2, r) {
        const s2 = Object.create(te.prototype);
        let f2, c, d2;
        t2.start !== void 0 ? f2 = n(() => t2.start(s2), "startAlgorithm") : f2 = n(() => {
        }, "startAlgorithm"), t2.pull !== void 0 ? c = n(() => t2.pull(s2), "pullAlgorithm") : c = n(() => T(void 0), "pullAlgorithm"), t2.cancel !== void 0 ? d2 = n((R) => t2.cancel(R), "cancelAlgorithm") : d2 = n(() => T(void 0), "cancelAlgorithm");
        const m = t2.autoAllocateChunkSize;
        if (m === 0) throw new TypeError("autoAllocateChunkSize must be greater than 0");
        To(e, s2, f2, c, d2, r, m);
      }
      n(aa, "SetUpReadableByteStreamControllerFromUnderlyingSource");
      function sa(e, t2, r) {
        e._associatedReadableByteStreamController = t2, e._view = r;
      }
      n(sa, "SetUpReadableStreamBYOBRequest");
      function Zr(e) {
        return new TypeError(`ReadableStreamBYOBRequest.prototype.${e} can only be used on a ReadableStreamBYOBRequest`);
      }
      n(Zr, "byobRequestBrandCheckException");
      function _t(e) {
        return new TypeError(`ReadableByteStreamController.prototype.${e} can only be used on a ReadableByteStreamController`);
      }
      n(_t, "byteStreamControllerBrandCheckException");
      function la(e, t2) {
        ue(e, t2);
        const r = e == null ? void 0 : e.mode;
        return { mode: r === void 0 ? void 0 : ua(r, `${t2} has member 'mode' that`) };
      }
      n(la, "convertReaderOptions");
      function ua(e, t2) {
        if (e = `${e}`, e !== "byob") throw new TypeError(`${t2} '${e}' is not a valid enumeration value for ReadableStreamReaderMode`);
        return e;
      }
      n(ua, "convertReadableStreamReaderMode");
      function fa(e, t2) {
        var r;
        ue(e, t2);
        const s2 = (r = e == null ? void 0 : e.min) !== null && r !== void 0 ? r : 1;
        return { min: Fr(s2, `${t2} has member 'min' that`) };
      }
      n(fa, "convertByobReadOptions");
      function Co(e) {
        return new ce(e);
      }
      n(Co, "AcquireReadableStreamBYOBReader");
      function Po(e, t2) {
        e._reader._readIntoRequests.push(t2);
      }
      n(Po, "ReadableStreamAddReadIntoRequest");
      function ca(e, t2, r) {
        const f2 = e._reader._readIntoRequests.shift();
        r ? f2._closeSteps(t2) : f2._chunkSteps(t2);
      }
      n(ca, "ReadableStreamFulfillReadIntoRequest");
      function vo(e) {
        return e._reader._readIntoRequests.length;
      }
      n(vo, "ReadableStreamGetNumReadIntoRequests");
      function Kr(e) {
        const t2 = e._reader;
        return !(t2 === void 0 || !Fe(t2));
      }
      n(Kr, "ReadableStreamHasBYOBReader");
      const Sn = class Sn {
        constructor(t2) {
          if (Se(t2, 1, "ReadableStreamBYOBReader"), jr(t2, "First parameter"), qe(t2)) throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          if (!ze(t2._readableStreamController)) throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
          Yn(this, t2), this._readIntoRequests = new D();
        }
        get closed() {
          return Fe(this) ? this._closedPromise : b(Qt("closed"));
        }
        cancel(t2 = void 0) {
          return Fe(this) ? this._ownerReadableStream === void 0 ? b(jt("cancel")) : Wr(this, t2) : b(Qt("cancel"));
        }
        read(t2, r = {}) {
          if (!Fe(this)) return b(Qt("read"));
          if (!ArrayBuffer.isView(t2)) return b(new TypeError("view must be an array buffer view"));
          if (t2.byteLength === 0) return b(new TypeError("view must have non-zero byteLength"));
          if (t2.buffer.byteLength === 0) return b(new TypeError("view's buffer must have non-zero byteLength"));
          if (Ae(t2.buffer)) return b(new TypeError("view's buffer has been detached"));
          let s2;
          try {
            s2 = fa(r, "options");
          } catch (y) {
            return b(y);
          }
          const f2 = s2.min;
          if (f2 === 0) return b(new TypeError("options.min must be greater than 0"));
          if (Xi(t2)) {
            if (f2 > t2.byteLength) return b(new RangeError("options.min must be less than or equal to view's byteLength"));
          } else if (f2 > t2.length) return b(new RangeError("options.min must be less than or equal to view's length"));
          if (this._ownerReadableStream === void 0) return b(jt("read from"));
          let c, d2;
          const m = E((y, C) => {
            c = y, d2 = C;
          });
          return Eo(this, t2, f2, { _chunkSteps: (y) => c({ value: y, done: false }), _closeSteps: (y) => c({ value: y, done: true }), _errorSteps: (y) => d2(y) }), m;
        }
        releaseLock() {
          if (!Fe(this)) throw Qt("releaseLock");
          this._ownerReadableStream !== void 0 && da(this);
        }
      };
      n(Sn, "ReadableStreamBYOBReader");
      let ce = Sn;
      Object.defineProperties(ce.prototype, { cancel: { enumerable: true }, read: { enumerable: true }, releaseLock: { enumerable: true }, closed: { enumerable: true } }), h2(ce.prototype.cancel, "cancel"), h2(ce.prototype.read, "read"), h2(ce.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ce.prototype, Symbol.toStringTag, { value: "ReadableStreamBYOBReader", configurable: true });
      function Fe(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_readIntoRequests") ? false : e instanceof ce;
      }
      n(Fe, "IsReadableStreamBYOBReader");
      function Eo(e, t2, r, s2) {
        const f2 = e._ownerReadableStream;
        f2._disturbed = true, f2._state === "errored" ? s2._errorSteps(f2._storedError) : ra(f2._readableStreamController, t2, r, s2);
      }
      n(Eo, "ReadableStreamBYOBReaderRead");
      function da(e) {
        _e(e);
        const t2 = new TypeError("Reader was released");
        Ao(e, t2);
      }
      n(da, "ReadableStreamBYOBReaderRelease");
      function Ao(e, t2) {
        const r = e._readIntoRequests;
        e._readIntoRequests = new D(), r.forEach((s2) => {
          s2._errorSteps(t2);
        });
      }
      n(Ao, "ReadableStreamBYOBReaderErrorReadIntoRequests");
      function Qt(e) {
        return new TypeError(`ReadableStreamBYOBReader.prototype.${e} can only be used on a ReadableStreamBYOBReader`);
      }
      n(Qt, "byobReaderBrandCheckException");
      function St(e, t2) {
        const { highWaterMark: r } = e;
        if (r === void 0) return t2;
        if (ao(r) || r < 0) throw new RangeError("Invalid highWaterMark");
        return r;
      }
      n(St, "ExtractHighWaterMark");
      function Yt(e) {
        const { size: t2 } = e;
        return t2 || (() => 1);
      }
      n(Yt, "ExtractSizeAlgorithm");
      function Gt(e, t2) {
        ue(e, t2);
        const r = e == null ? void 0 : e.highWaterMark, s2 = e == null ? void 0 : e.size;
        return { highWaterMark: r === void 0 ? void 0 : Ir(r), size: s2 === void 0 ? void 0 : ha(s2, `${t2} has member 'size' that`) };
      }
      n(Gt, "convertQueuingStrategy");
      function ha(e, t2) {
        return Z(e, t2), (r) => Ir(e(r));
      }
      n(ha, "convertQueuingStrategySize");
      function pa(e, t2) {
        ue(e, t2);
        const r = e == null ? void 0 : e.abort, s2 = e == null ? void 0 : e.close, f2 = e == null ? void 0 : e.start, c = e == null ? void 0 : e.type, d2 = e == null ? void 0 : e.write;
        return { abort: r === void 0 ? void 0 : ba(r, e, `${t2} has member 'abort' that`), close: s2 === void 0 ? void 0 : ma(s2, e, `${t2} has member 'close' that`), start: f2 === void 0 ? void 0 : ya(f2, e, `${t2} has member 'start' that`), write: d2 === void 0 ? void 0 : ga(d2, e, `${t2} has member 'write' that`), type: c };
      }
      n(pa, "convertUnderlyingSink");
      function ba(e, t2, r) {
        return Z(e, r), (s2) => j(e, t2, [s2]);
      }
      n(ba, "convertUnderlyingSinkAbortCallback");
      function ma(e, t2, r) {
        return Z(e, r), () => j(e, t2, []);
      }
      n(ma, "convertUnderlyingSinkCloseCallback");
      function ya(e, t2, r) {
        return Z(e, r), (s2) => z(e, t2, [s2]);
      }
      n(ya, "convertUnderlyingSinkStartCallback");
      function ga(e, t2, r) {
        return Z(e, r), (s2, f2) => j(e, t2, [s2, f2]);
      }
      n(ga, "convertUnderlyingSinkWriteCallback");
      function Bo(e, t2) {
        if (!Ge(e)) throw new TypeError(`${t2} is not a WritableStream.`);
      }
      n(Bo, "assertWritableStream");
      function _a2(e) {
        if (typeof e != "object" || e === null) return false;
        try {
          return typeof e.aborted == "boolean";
        } catch {
          return false;
        }
      }
      n(_a2, "isAbortSignal");
      const Sa = typeof AbortController == "function";
      function wa() {
        if (Sa) return new AbortController();
      }
      n(wa, "createAbortController");
      const wn = class wn {
        constructor(t2 = {}, r = {}) {
          t2 === void 0 ? t2 = null : Jn(t2, "First parameter");
          const s2 = Gt(r, "Second parameter"), f2 = pa(t2, "First parameter");
          if (Wo(this), f2.type !== void 0) throw new RangeError("Invalid type is specified");
          const d2 = Yt(s2), m = St(s2, 1);
          Ia(this, f2, m, d2);
        }
        get locked() {
          if (!Ge(this)) throw er("locked");
          return Ze(this);
        }
        abort(t2 = void 0) {
          return Ge(this) ? Ze(this) ? b(new TypeError("Cannot abort a stream that already has a writer")) : Zt(this, t2) : b(er("abort"));
        }
        close() {
          return Ge(this) ? Ze(this) ? b(new TypeError("Cannot close a stream that already has a writer")) : he(this) ? b(new TypeError("Cannot close an already-closing stream")) : qo(this) : b(er("close"));
        }
        getWriter() {
          if (!Ge(this)) throw er("getWriter");
          return ko(this);
        }
      };
      n(wn, "WritableStream");
      let de = wn;
      Object.defineProperties(de.prototype, { abort: { enumerable: true }, close: { enumerable: true }, getWriter: { enumerable: true }, locked: { enumerable: true } }), h2(de.prototype.abort, "abort"), h2(de.prototype.close, "close"), h2(de.prototype.getWriter, "getWriter"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(de.prototype, Symbol.toStringTag, { value: "WritableStream", configurable: true });
      function ko(e) {
        return new re(e);
      }
      n(ko, "AcquireWritableStreamDefaultWriter");
      function Ra(e, t2, r, s2, f2 = 1, c = () => 1) {
        const d2 = Object.create(de.prototype);
        Wo(d2);
        const m = Object.create(ke.prototype);
        return Lo(d2, m, e, t2, r, s2, f2, c), d2;
      }
      n(Ra, "CreateWritableStream");
      function Wo(e) {
        e._state = "writable", e._storedError = void 0, e._writer = void 0, e._writableStreamController = void 0, e._writeRequests = new D(), e._inFlightWriteRequest = void 0, e._closeRequest = void 0, e._inFlightCloseRequest = void 0, e._pendingAbortRequest = void 0, e._backpressure = false;
      }
      n(Wo, "InitializeWritableStream");
      function Ge(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_writableStreamController") ? false : e instanceof de;
      }
      n(Ge, "IsWritableStream");
      function Ze(e) {
        return e._writer !== void 0;
      }
      n(Ze, "IsWritableStreamLocked");
      function Zt(e, t2) {
        var r;
        if (e._state === "closed" || e._state === "errored") return T(void 0);
        e._writableStreamController._abortReason = t2, (r = e._writableStreamController._abortController) === null || r === void 0 || r.abort(t2);
        const s2 = e._state;
        if (s2 === "closed" || s2 === "errored") return T(void 0);
        if (e._pendingAbortRequest !== void 0) return e._pendingAbortRequest._promise;
        let f2 = false;
        s2 === "erroring" && (f2 = true, t2 = void 0);
        const c = E((d2, m) => {
          e._pendingAbortRequest = { _promise: void 0, _resolve: d2, _reject: m, _reason: t2, _wasAlreadyErroring: f2 };
        });
        return e._pendingAbortRequest._promise = c, f2 || Xr(e, t2), c;
      }
      n(Zt, "WritableStreamAbort");
      function qo(e) {
        const t2 = e._state;
        if (t2 === "closed" || t2 === "errored") return b(new TypeError(`The stream (in ${t2} state) is not in the writable state and cannot be closed`));
        const r = E((f2, c) => {
          const d2 = { _resolve: f2, _reject: c };
          e._closeRequest = d2;
        }), s2 = e._writer;
        return s2 !== void 0 && e._backpressure && t2 === "writable" && ln(s2), Fa(e._writableStreamController), r;
      }
      n(qo, "WritableStreamClose");
      function Ta(e) {
        return E((r, s2) => {
          const f2 = { _resolve: r, _reject: s2 };
          e._writeRequests.push(f2);
        });
      }
      n(Ta, "WritableStreamAddWriteRequest");
      function Jr(e, t2) {
        if (e._state === "writable") {
          Xr(e, t2);
          return;
        }
        en(e);
      }
      n(Jr, "WritableStreamDealWithRejection");
      function Xr(e, t2) {
        const r = e._writableStreamController;
        e._state = "erroring", e._storedError = t2;
        const s2 = e._writer;
        s2 !== void 0 && zo(s2, t2), !Aa(e) && r._started && en(e);
      }
      n(Xr, "WritableStreamStartErroring");
      function en(e) {
        e._state = "errored", e._writableStreamController[Qn]();
        const t2 = e._storedError;
        if (e._writeRequests.forEach((f2) => {
          f2._reject(t2);
        }), e._writeRequests = new D(), e._pendingAbortRequest === void 0) {
          Kt(e);
          return;
        }
        const r = e._pendingAbortRequest;
        if (e._pendingAbortRequest = void 0, r._wasAlreadyErroring) {
          r._reject(t2), Kt(e);
          return;
        }
        const s2 = e._writableStreamController[Ft](r._reason);
        _(s2, () => (r._resolve(), Kt(e), null), (f2) => (r._reject(f2), Kt(e), null));
      }
      n(en, "WritableStreamFinishErroring");
      function Ca(e) {
        e._inFlightWriteRequest._resolve(void 0), e._inFlightWriteRequest = void 0;
      }
      n(Ca, "WritableStreamFinishInFlightWrite");
      function Pa(e, t2) {
        e._inFlightWriteRequest._reject(t2), e._inFlightWriteRequest = void 0, Jr(e, t2);
      }
      n(Pa, "WritableStreamFinishInFlightWriteWithError");
      function va(e) {
        e._inFlightCloseRequest._resolve(void 0), e._inFlightCloseRequest = void 0, e._state === "erroring" && (e._storedError = void 0, e._pendingAbortRequest !== void 0 && (e._pendingAbortRequest._resolve(), e._pendingAbortRequest = void 0)), e._state = "closed";
        const r = e._writer;
        r !== void 0 && Uo(r);
      }
      n(va, "WritableStreamFinishInFlightClose");
      function Ea(e, t2) {
        e._inFlightCloseRequest._reject(t2), e._inFlightCloseRequest = void 0, e._pendingAbortRequest !== void 0 && (e._pendingAbortRequest._reject(t2), e._pendingAbortRequest = void 0), Jr(e, t2);
      }
      n(Ea, "WritableStreamFinishInFlightCloseWithError");
      function he(e) {
        return !(e._closeRequest === void 0 && e._inFlightCloseRequest === void 0);
      }
      n(he, "WritableStreamCloseQueuedOrInFlight");
      function Aa(e) {
        return !(e._inFlightWriteRequest === void 0 && e._inFlightCloseRequest === void 0);
      }
      n(Aa, "WritableStreamHasOperationMarkedInFlight");
      function Ba(e) {
        e._inFlightCloseRequest = e._closeRequest, e._closeRequest = void 0;
      }
      n(Ba, "WritableStreamMarkCloseRequestInFlight");
      function ka(e) {
        e._inFlightWriteRequest = e._writeRequests.shift();
      }
      n(ka, "WritableStreamMarkFirstWriteRequestInFlight");
      function Kt(e) {
        e._closeRequest !== void 0 && (e._closeRequest._reject(e._storedError), e._closeRequest = void 0);
        const t2 = e._writer;
        t2 !== void 0 && an(t2, e._storedError);
      }
      n(Kt, "WritableStreamRejectCloseAndClosedPromiseIfNeeded");
      function tn(e, t2) {
        const r = e._writer;
        r !== void 0 && t2 !== e._backpressure && (t2 ? xa(r) : ln(r)), e._backpressure = t2;
      }
      n(tn, "WritableStreamUpdateBackpressure");
      const Rn = class Rn {
        constructor(t2) {
          if (Se(t2, 1, "WritableStreamDefaultWriter"), Bo(t2, "First parameter"), Ze(t2)) throw new TypeError("This stream has already been locked for exclusive writing by another writer");
          this._ownerWritableStream = t2, t2._writer = this;
          const r = t2._state;
          if (r === "writable") !he(t2) && t2._backpressure ? rr(this) : xo(this), tr(this);
          else if (r === "erroring") sn(this, t2._storedError), tr(this);
          else if (r === "closed") xo(this), Ma(this);
          else {
            const s2 = t2._storedError;
            sn(this, s2), Mo(this, s2);
          }
        }
        get closed() {
          return je(this) ? this._closedPromise : b(Le("closed"));
        }
        get desiredSize() {
          if (!je(this)) throw Le("desiredSize");
          if (this._ownerWritableStream === void 0) throw Rt("desiredSize");
          return za(this);
        }
        get ready() {
          return je(this) ? this._readyPromise : b(Le("ready"));
        }
        abort(t2 = void 0) {
          return je(this) ? this._ownerWritableStream === void 0 ? b(Rt("abort")) : Wa(this, t2) : b(Le("abort"));
        }
        close() {
          if (!je(this)) return b(Le("close"));
          const t2 = this._ownerWritableStream;
          return t2 === void 0 ? b(Rt("close")) : he(t2) ? b(new TypeError("Cannot close an already-closing stream")) : Oo(this);
        }
        releaseLock() {
          if (!je(this)) throw Le("releaseLock");
          this._ownerWritableStream !== void 0 && Io(this);
        }
        write(t2 = void 0) {
          return je(this) ? this._ownerWritableStream === void 0 ? b(Rt("write to")) : Fo(this, t2) : b(Le("write"));
        }
      };
      n(Rn, "WritableStreamDefaultWriter");
      let re = Rn;
      Object.defineProperties(re.prototype, { abort: { enumerable: true }, close: { enumerable: true }, releaseLock: { enumerable: true }, write: { enumerable: true }, closed: { enumerable: true }, desiredSize: { enumerable: true }, ready: { enumerable: true } }), h2(re.prototype.abort, "abort"), h2(re.prototype.close, "close"), h2(re.prototype.releaseLock, "releaseLock"), h2(re.prototype.write, "write"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(re.prototype, Symbol.toStringTag, { value: "WritableStreamDefaultWriter", configurable: true });
      function je(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_ownerWritableStream") ? false : e instanceof re;
      }
      n(je, "IsWritableStreamDefaultWriter");
      function Wa(e, t2) {
        const r = e._ownerWritableStream;
        return Zt(r, t2);
      }
      n(Wa, "WritableStreamDefaultWriterAbort");
      function Oo(e) {
        const t2 = e._ownerWritableStream;
        return qo(t2);
      }
      n(Oo, "WritableStreamDefaultWriterClose");
      function qa(e) {
        const t2 = e._ownerWritableStream, r = t2._state;
        return he(t2) || r === "closed" ? T(void 0) : r === "errored" ? b(t2._storedError) : Oo(e);
      }
      n(qa, "WritableStreamDefaultWriterCloseWithErrorPropagation");
      function Oa(e, t2) {
        e._closedPromiseState === "pending" ? an(e, t2) : Ua(e, t2);
      }
      n(Oa, "WritableStreamDefaultWriterEnsureClosedPromiseRejected");
      function zo(e, t2) {
        e._readyPromiseState === "pending" ? No(e, t2) : Na(e, t2);
      }
      n(zo, "WritableStreamDefaultWriterEnsureReadyPromiseRejected");
      function za(e) {
        const t2 = e._ownerWritableStream, r = t2._state;
        return r === "errored" || r === "erroring" ? null : r === "closed" ? 0 : $o(t2._writableStreamController);
      }
      n(za, "WritableStreamDefaultWriterGetDesiredSize");
      function Io(e) {
        const t2 = e._ownerWritableStream, r = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
        zo(e, r), Oa(e, r), t2._writer = void 0, e._ownerWritableStream = void 0;
      }
      n(Io, "WritableStreamDefaultWriterRelease");
      function Fo(e, t2) {
        const r = e._ownerWritableStream, s2 = r._writableStreamController, f2 = ja(s2, t2);
        if (r !== e._ownerWritableStream) return b(Rt("write to"));
        const c = r._state;
        if (c === "errored") return b(r._storedError);
        if (he(r) || c === "closed") return b(new TypeError("The stream is closing or closed and cannot be written to"));
        if (c === "erroring") return b(r._storedError);
        const d2 = Ta(r);
        return La(s2, t2, f2), d2;
      }
      n(Fo, "WritableStreamDefaultWriterWrite");
      const jo = {}, Tn = class Tn {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get abortReason() {
          if (!rn(this)) throw on("abortReason");
          return this._abortReason;
        }
        get signal() {
          if (!rn(this)) throw on("signal");
          if (this._abortController === void 0) throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
          return this._abortController.signal;
        }
        error(t2 = void 0) {
          if (!rn(this)) throw on("error");
          this._controlledWritableStream._state === "writable" && Do(this, t2);
        }
        [Ft](t2) {
          const r = this._abortAlgorithm(t2);
          return Jt(this), r;
        }
        [Qn]() {
          Be(this);
        }
      };
      n(Tn, "WritableStreamDefaultController");
      let ke = Tn;
      Object.defineProperties(ke.prototype, { abortReason: { enumerable: true }, signal: { enumerable: true }, error: { enumerable: true } }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ke.prototype, Symbol.toStringTag, { value: "WritableStreamDefaultController", configurable: true });
      function rn(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledWritableStream") ? false : e instanceof ke;
      }
      n(rn, "IsWritableStreamDefaultController");
      function Lo(e, t2, r, s2, f2, c, d2, m) {
        t2._controlledWritableStream = e, e._writableStreamController = t2, t2._queue = void 0, t2._queueTotalSize = void 0, Be(t2), t2._abortReason = void 0, t2._abortController = wa(), t2._started = false, t2._strategySizeAlgorithm = m, t2._strategyHWM = d2, t2._writeAlgorithm = s2, t2._closeAlgorithm = f2, t2._abortAlgorithm = c;
        const R = nn(t2);
        tn(e, R);
        const y = r(), C = T(y);
        _(C, () => (t2._started = true, Xt(t2), null), (P) => (t2._started = true, Jr(e, P), null));
      }
      n(Lo, "SetUpWritableStreamDefaultController");
      function Ia(e, t2, r, s2) {
        const f2 = Object.create(ke.prototype);
        let c, d2, m, R;
        t2.start !== void 0 ? c = n(() => t2.start(f2), "startAlgorithm") : c = n(() => {
        }, "startAlgorithm"), t2.write !== void 0 ? d2 = n((y) => t2.write(y, f2), "writeAlgorithm") : d2 = n(() => T(void 0), "writeAlgorithm"), t2.close !== void 0 ? m = n(() => t2.close(), "closeAlgorithm") : m = n(() => T(void 0), "closeAlgorithm"), t2.abort !== void 0 ? R = n((y) => t2.abort(y), "abortAlgorithm") : R = n(() => T(void 0), "abortAlgorithm"), Lo(e, f2, c, d2, m, R, r, s2);
      }
      n(Ia, "SetUpWritableStreamDefaultControllerFromUnderlyingSink");
      function Jt(e) {
        e._writeAlgorithm = void 0, e._closeAlgorithm = void 0, e._abortAlgorithm = void 0, e._strategySizeAlgorithm = void 0;
      }
      n(Jt, "WritableStreamDefaultControllerClearAlgorithms");
      function Fa(e) {
        Nr(e, jo, 0), Xt(e);
      }
      n(Fa, "WritableStreamDefaultControllerClose");
      function ja(e, t2) {
        try {
          return e._strategySizeAlgorithm(t2);
        } catch (r) {
          return wt(e, r), 1;
        }
      }
      n(ja, "WritableStreamDefaultControllerGetChunkSize");
      function $o(e) {
        return e._strategyHWM - e._queueTotalSize;
      }
      n($o, "WritableStreamDefaultControllerGetDesiredSize");
      function La(e, t2, r) {
        try {
          Nr(e, t2, r);
        } catch (f2) {
          wt(e, f2);
          return;
        }
        const s2 = e._controlledWritableStream;
        if (!he(s2) && s2._state === "writable") {
          const f2 = nn(e);
          tn(s2, f2);
        }
        Xt(e);
      }
      n(La, "WritableStreamDefaultControllerWrite");
      function Xt(e) {
        const t2 = e._controlledWritableStream;
        if (!e._started || t2._inFlightWriteRequest !== void 0) return;
        if (t2._state === "erroring") {
          en(t2);
          return;
        }
        if (e._queue.length === 0) return;
        const s2 = Ji(e);
        s2 === jo ? $a(e) : Da(e, s2);
      }
      n(Xt, "WritableStreamDefaultControllerAdvanceQueueIfNeeded");
      function wt(e, t2) {
        e._controlledWritableStream._state === "writable" && Do(e, t2);
      }
      n(wt, "WritableStreamDefaultControllerErrorIfNeeded");
      function $a(e) {
        const t2 = e._controlledWritableStream;
        Ba(t2), xr(e);
        const r = e._closeAlgorithm();
        Jt(e), _(r, () => (va(t2), null), (s2) => (Ea(t2, s2), null));
      }
      n($a, "WritableStreamDefaultControllerProcessClose");
      function Da(e, t2) {
        const r = e._controlledWritableStream;
        ka(r);
        const s2 = e._writeAlgorithm(t2);
        _(s2, () => {
          Ca(r);
          const f2 = r._state;
          if (xr(e), !he(r) && f2 === "writable") {
            const c = nn(e);
            tn(r, c);
          }
          return Xt(e), null;
        }, (f2) => (r._state === "writable" && Jt(e), Pa(r, f2), null));
      }
      n(Da, "WritableStreamDefaultControllerProcessWrite");
      function nn(e) {
        return $o(e) <= 0;
      }
      n(nn, "WritableStreamDefaultControllerGetBackpressure");
      function Do(e, t2) {
        const r = e._controlledWritableStream;
        Jt(e), Xr(r, t2);
      }
      n(Do, "WritableStreamDefaultControllerError");
      function er(e) {
        return new TypeError(`WritableStream.prototype.${e} can only be used on a WritableStream`);
      }
      n(er, "streamBrandCheckException$2");
      function on(e) {
        return new TypeError(`WritableStreamDefaultController.prototype.${e} can only be used on a WritableStreamDefaultController`);
      }
      n(on, "defaultControllerBrandCheckException$2");
      function Le(e) {
        return new TypeError(`WritableStreamDefaultWriter.prototype.${e} can only be used on a WritableStreamDefaultWriter`);
      }
      n(Le, "defaultWriterBrandCheckException");
      function Rt(e) {
        return new TypeError("Cannot " + e + " a stream using a released writer");
      }
      n(Rt, "defaultWriterLockException");
      function tr(e) {
        e._closedPromise = E((t2, r) => {
          e._closedPromise_resolve = t2, e._closedPromise_reject = r, e._closedPromiseState = "pending";
        });
      }
      n(tr, "defaultWriterClosedPromiseInitialize");
      function Mo(e, t2) {
        tr(e), an(e, t2);
      }
      n(Mo, "defaultWriterClosedPromiseInitializeAsRejected");
      function Ma(e) {
        tr(e), Uo(e);
      }
      n(Ma, "defaultWriterClosedPromiseInitializeAsResolved");
      function an(e, t2) {
        e._closedPromise_reject !== void 0 && (Q(e._closedPromise), e._closedPromise_reject(t2), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0, e._closedPromiseState = "rejected");
      }
      n(an, "defaultWriterClosedPromiseReject");
      function Ua(e, t2) {
        Mo(e, t2);
      }
      n(Ua, "defaultWriterClosedPromiseResetToRejected");
      function Uo(e) {
        e._closedPromise_resolve !== void 0 && (e._closedPromise_resolve(void 0), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0, e._closedPromiseState = "resolved");
      }
      n(Uo, "defaultWriterClosedPromiseResolve");
      function rr(e) {
        e._readyPromise = E((t2, r) => {
          e._readyPromise_resolve = t2, e._readyPromise_reject = r;
        }), e._readyPromiseState = "pending";
      }
      n(rr, "defaultWriterReadyPromiseInitialize");
      function sn(e, t2) {
        rr(e), No(e, t2);
      }
      n(sn, "defaultWriterReadyPromiseInitializeAsRejected");
      function xo(e) {
        rr(e), ln(e);
      }
      n(xo, "defaultWriterReadyPromiseInitializeAsResolved");
      function No(e, t2) {
        e._readyPromise_reject !== void 0 && (Q(e._readyPromise), e._readyPromise_reject(t2), e._readyPromise_resolve = void 0, e._readyPromise_reject = void 0, e._readyPromiseState = "rejected");
      }
      n(No, "defaultWriterReadyPromiseReject");
      function xa(e) {
        rr(e);
      }
      n(xa, "defaultWriterReadyPromiseReset");
      function Na(e, t2) {
        sn(e, t2);
      }
      n(Na, "defaultWriterReadyPromiseResetToRejected");
      function ln(e) {
        e._readyPromise_resolve !== void 0 && (e._readyPromise_resolve(void 0), e._readyPromise_resolve = void 0, e._readyPromise_reject = void 0, e._readyPromiseState = "fulfilled");
      }
      n(ln, "defaultWriterReadyPromiseResolve");
      function Ha() {
        if (typeof globalThis < "u") return globalThis;
        if (typeof self < "u") return self;
        if (typeof n$1 < "u") return n$1;
      }
      n(Ha, "getGlobals");
      const un = Ha();
      function Va(e) {
        if (!(typeof e == "function" || typeof e == "object") || e.name !== "DOMException") return false;
        try {
          return new e(), true;
        } catch {
          return false;
        }
      }
      n(Va, "isDOMExceptionConstructor");
      function Qa() {
        const e = un == null ? void 0 : un.DOMException;
        return Va(e) ? e : void 0;
      }
      n(Qa, "getFromGlobal");
      function Ya() {
        const e = n(function(r, s2) {
          this.message = r || "", this.name = s2 || "Error", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
        }, "DOMException");
        return h2(e, "DOMException"), e.prototype = Object.create(Error.prototype), Object.defineProperty(e.prototype, "constructor", { value: e, writable: true, configurable: true }), e;
      }
      n(Ya, "createPolyfill");
      const Ga = Qa() || Ya();
      function Ho(e, t2, r, s2, f2, c) {
        const d2 = Qe(e), m = ko(t2);
        e._disturbed = true;
        let R = false, y = T(void 0);
        return E((C, P) => {
          let B;
          if (c !== void 0) {
            if (B = n(() => {
              const S = c.reason !== void 0 ? c.reason : new Ga("Aborted", "AbortError"), v = [];
              s2 || v.push(() => t2._state === "writable" ? Zt(t2, S) : T(void 0)), f2 || v.push(() => e._state === "readable" ? ie(e, S) : T(void 0)), N(() => Promise.all(v.map((k2) => k2())), true, S);
            }, "abortAlgorithm"), c.aborted) {
              B();
              return;
            }
            c.addEventListener("abort", B);
          }
          function ae() {
            return E((S, v) => {
              function k2(Y) {
                Y ? S() : q(nt(), k2, v);
              }
              n(k2, "next"), k2(false);
            });
          }
          n(ae, "pipeLoop");
          function nt() {
            return R ? T(true) : q(m._readyPromise, () => E((S, v) => {
              mt(d2, { _chunkSteps: (k2) => {
                y = q(Fo(m, k2), void 0, u), S(false);
              }, _closeSteps: () => S(true), _errorSteps: v });
            }));
          }
          if (n(nt, "pipeStep"), Te(e, d2._closedPromise, (S) => (s2 ? J(true, S) : N(() => Zt(t2, S), true, S), null)), Te(t2, m._closedPromise, (S) => (f2 ? J(true, S) : N(() => ie(e, S), true, S), null)), x(e, d2._closedPromise, () => (r ? J() : N(() => qa(m)), null)), he(t2) || t2._state === "closed") {
            const S = new TypeError("the destination writable stream closed before all data could be piped to it");
            f2 ? J(true, S) : N(() => ie(e, S), true, S);
          }
          Q(ae());
          function Oe() {
            const S = y;
            return q(y, () => S !== y ? Oe() : void 0);
          }
          n(Oe, "waitForWritesToFinish");
          function Te(S, v, k2) {
            S._state === "errored" ? k2(S._storedError) : I(v, k2);
          }
          n(Te, "isOrBecomesErrored");
          function x(S, v, k2) {
            S._state === "closed" ? k2() : V(v, k2);
          }
          n(x, "isOrBecomesClosed");
          function N(S, v, k2) {
            if (R) return;
            R = true, t2._state === "writable" && !he(t2) ? V(Oe(), Y) : Y();
            function Y() {
              return _(S(), () => Ce(v, k2), (ot) => Ce(true, ot)), null;
            }
            n(Y, "doTheRest");
          }
          n(N, "shutdownWithAction");
          function J(S, v) {
            R || (R = true, t2._state === "writable" && !he(t2) ? V(Oe(), () => Ce(S, v)) : Ce(S, v));
          }
          n(J, "shutdown");
          function Ce(S, v) {
            return Io(m), _e(d2), c !== void 0 && c.removeEventListener("abort", B), S ? P(v) : C(void 0), null;
          }
          n(Ce, "finalize");
        });
      }
      n(Ho, "ReadableStreamPipeTo");
      const Cn = class Cn {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get desiredSize() {
          if (!nr(this)) throw ir("desiredSize");
          return fn(this);
        }
        close() {
          if (!nr(this)) throw ir("close");
          if (!Je(this)) throw new TypeError("The stream is not in a state that permits close");
          $e(this);
        }
        enqueue(t2 = void 0) {
          if (!nr(this)) throw ir("enqueue");
          if (!Je(this)) throw new TypeError("The stream is not in a state that permits enqueue");
          return Ke(this, t2);
        }
        error(t2 = void 0) {
          if (!nr(this)) throw ir("error");
          oe(this, t2);
        }
        [Ar](t2) {
          Be(this);
          const r = this._cancelAlgorithm(t2);
          return or(this), r;
        }
        [Br](t2) {
          const r = this._controlledReadableStream;
          if (this._queue.length > 0) {
            const s2 = xr(this);
            this._closeRequested && this._queue.length === 0 ? (or(this), Pt(r)) : Tt(this), t2._chunkSteps(s2);
          } else eo(r, t2), Tt(this);
        }
        [kr]() {
        }
      };
      n(Cn, "ReadableStreamDefaultController");
      let ne = Cn;
      Object.defineProperties(ne.prototype, { close: { enumerable: true }, enqueue: { enumerable: true }, error: { enumerable: true }, desiredSize: { enumerable: true } }), h2(ne.prototype.close, "close"), h2(ne.prototype.enqueue, "enqueue"), h2(ne.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ne.prototype, Symbol.toStringTag, { value: "ReadableStreamDefaultController", configurable: true });
      function nr(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledReadableStream") ? false : e instanceof ne;
      }
      n(nr, "IsReadableStreamDefaultController");
      function Tt(e) {
        if (!Vo(e)) return;
        if (e._pulling) {
          e._pullAgain = true;
          return;
        }
        e._pulling = true;
        const r = e._pullAlgorithm();
        _(r, () => (e._pulling = false, e._pullAgain && (e._pullAgain = false, Tt(e)), null), (s2) => (oe(e, s2), null));
      }
      n(Tt, "ReadableStreamDefaultControllerCallPullIfNeeded");
      function Vo(e) {
        const t2 = e._controlledReadableStream;
        return !Je(e) || !e._started ? false : !!(qe(t2) && Lt(t2) > 0 || fn(e) > 0);
      }
      n(Vo, "ReadableStreamDefaultControllerShouldCallPull");
      function or(e) {
        e._pullAlgorithm = void 0, e._cancelAlgorithm = void 0, e._strategySizeAlgorithm = void 0;
      }
      n(or, "ReadableStreamDefaultControllerClearAlgorithms");
      function $e(e) {
        if (!Je(e)) return;
        const t2 = e._controlledReadableStream;
        e._closeRequested = true, e._queue.length === 0 && (or(e), Pt(t2));
      }
      n($e, "ReadableStreamDefaultControllerClose");
      function Ke(e, t2) {
        if (!Je(e)) return;
        const r = e._controlledReadableStream;
        if (qe(r) && Lt(r) > 0) Lr(r, t2, false);
        else {
          let s2;
          try {
            s2 = e._strategySizeAlgorithm(t2);
          } catch (f2) {
            throw oe(e, f2), f2;
          }
          try {
            Nr(e, t2, s2);
          } catch (f2) {
            throw oe(e, f2), f2;
          }
        }
        Tt(e);
      }
      n(Ke, "ReadableStreamDefaultControllerEnqueue");
      function oe(e, t2) {
        const r = e._controlledReadableStream;
        r._state === "readable" && (Be(e), or(e), Zo(r, t2));
      }
      n(oe, "ReadableStreamDefaultControllerError");
      function fn(e) {
        const t2 = e._controlledReadableStream._state;
        return t2 === "errored" ? null : t2 === "closed" ? 0 : e._strategyHWM - e._queueTotalSize;
      }
      n(fn, "ReadableStreamDefaultControllerGetDesiredSize");
      function Za(e) {
        return !Vo(e);
      }
      n(Za, "ReadableStreamDefaultControllerHasBackpressure");
      function Je(e) {
        const t2 = e._controlledReadableStream._state;
        return !e._closeRequested && t2 === "readable";
      }
      n(Je, "ReadableStreamDefaultControllerCanCloseOrEnqueue");
      function Qo(e, t2, r, s2, f2, c, d2) {
        t2._controlledReadableStream = e, t2._queue = void 0, t2._queueTotalSize = void 0, Be(t2), t2._started = false, t2._closeRequested = false, t2._pullAgain = false, t2._pulling = false, t2._strategySizeAlgorithm = d2, t2._strategyHWM = c, t2._pullAlgorithm = s2, t2._cancelAlgorithm = f2, e._readableStreamController = t2;
        const m = r();
        _(T(m), () => (t2._started = true, Tt(t2), null), (R) => (oe(t2, R), null));
      }
      n(Qo, "SetUpReadableStreamDefaultController");
      function Ka(e, t2, r, s2) {
        const f2 = Object.create(ne.prototype);
        let c, d2, m;
        t2.start !== void 0 ? c = n(() => t2.start(f2), "startAlgorithm") : c = n(() => {
        }, "startAlgorithm"), t2.pull !== void 0 ? d2 = n(() => t2.pull(f2), "pullAlgorithm") : d2 = n(() => T(void 0), "pullAlgorithm"), t2.cancel !== void 0 ? m = n((R) => t2.cancel(R), "cancelAlgorithm") : m = n(() => T(void 0), "cancelAlgorithm"), Qo(e, f2, c, d2, m, r, s2);
      }
      n(Ka, "SetUpReadableStreamDefaultControllerFromUnderlyingSource");
      function ir(e) {
        return new TypeError(`ReadableStreamDefaultController.prototype.${e} can only be used on a ReadableStreamDefaultController`);
      }
      n(ir, "defaultControllerBrandCheckException$1");
      function Ja(e, t2) {
        return ze(e._readableStreamController) ? es(e) : Xa(e);
      }
      n(Ja, "ReadableStreamTee");
      function Xa(e, t2) {
        const r = Qe(e);
        let s2 = false, f2 = false, c = false, d2 = false, m, R, y, C, P;
        const B = E((x) => {
          P = x;
        });
        function ae() {
          return s2 ? (f2 = true, T(void 0)) : (s2 = true, mt(r, { _chunkSteps: (N) => {
            ge(() => {
              f2 = false;
              const J = N, Ce = N;
              c || Ke(y._readableStreamController, J), d2 || Ke(C._readableStreamController, Ce), s2 = false, f2 && ae();
            });
          }, _closeSteps: () => {
            s2 = false, c || $e(y._readableStreamController), d2 || $e(C._readableStreamController), (!c || !d2) && P(void 0);
          }, _errorSteps: () => {
            s2 = false;
          } }), T(void 0));
        }
        n(ae, "pullAlgorithm");
        function nt(x) {
          if (c = true, m = x, d2) {
            const N = yt([m, R]), J = ie(e, N);
            P(J);
          }
          return B;
        }
        n(nt, "cancel1Algorithm");
        function Oe(x) {
          if (d2 = true, R = x, c) {
            const N = yt([m, R]), J = ie(e, N);
            P(J);
          }
          return B;
        }
        n(Oe, "cancel2Algorithm");
        function Te() {
        }
        return n(Te, "startAlgorithm"), y = Ct(Te, ae, nt), C = Ct(Te, ae, Oe), I(r._closedPromise, (x) => (oe(y._readableStreamController, x), oe(C._readableStreamController, x), (!c || !d2) && P(void 0), null)), [y, C];
      }
      n(Xa, "ReadableStreamDefaultTee");
      function es(e) {
        let t2 = Qe(e), r = false, s2 = false, f2 = false, c = false, d2 = false, m, R, y, C, P;
        const B = E((S) => {
          P = S;
        });
        function ae(S) {
          I(S._closedPromise, (v) => (S !== t2 || (K2(y._readableStreamController, v), K2(C._readableStreamController, v), (!c || !d2) && P(void 0)), null));
        }
        n(ae, "forwardReaderError");
        function nt() {
          Fe(t2) && (_e(t2), t2 = Qe(e), ae(t2)), mt(t2, { _chunkSteps: (v) => {
            ge(() => {
              s2 = false, f2 = false;
              const k2 = v;
              let Y = v;
              if (!c && !d2) try {
                Y = fo(v);
              } catch (ot) {
                K2(y._readableStreamController, ot), K2(C._readableStreamController, ot), P(ie(e, ot));
                return;
              }
              c || Nt(y._readableStreamController, k2), d2 || Nt(C._readableStreamController, Y), r = false, s2 ? Te() : f2 && x();
            });
          }, _closeSteps: () => {
            r = false, c || gt(y._readableStreamController), d2 || gt(C._readableStreamController), y._readableStreamController._pendingPullIntos.length > 0 && Ht(y._readableStreamController, 0), C._readableStreamController._pendingPullIntos.length > 0 && Ht(C._readableStreamController, 0), (!c || !d2) && P(void 0);
          }, _errorSteps: () => {
            r = false;
          } });
        }
        n(nt, "pullWithDefaultReader");
        function Oe(S, v) {
          Ee(t2) && (_e(t2), t2 = Co(e), ae(t2));
          const k2 = v ? C : y, Y = v ? y : C;
          Eo(t2, S, 1, { _chunkSteps: (it) => {
            ge(() => {
              s2 = false, f2 = false;
              const at = v ? d2 : c;
              if (v ? c : d2) at || Vt(k2._readableStreamController, it);
              else {
                let ui;
                try {
                  ui = fo(it);
                } catch (kn) {
                  K2(k2._readableStreamController, kn), K2(Y._readableStreamController, kn), P(ie(e, kn));
                  return;
                }
                at || Vt(k2._readableStreamController, it), Nt(Y._readableStreamController, ui);
              }
              r = false, s2 ? Te() : f2 && x();
            });
          }, _closeSteps: (it) => {
            r = false;
            const at = v ? d2 : c, fr = v ? c : d2;
            at || gt(k2._readableStreamController), fr || gt(Y._readableStreamController), it !== void 0 && (at || Vt(k2._readableStreamController, it), !fr && Y._readableStreamController._pendingPullIntos.length > 0 && Ht(Y._readableStreamController, 0)), (!at || !fr) && P(void 0);
          }, _errorSteps: () => {
            r = false;
          } });
        }
        n(Oe, "pullWithBYOBReader");
        function Te() {
          if (r) return s2 = true, T(void 0);
          r = true;
          const S = Gr(y._readableStreamController);
          return S === null ? nt() : Oe(S._view, false), T(void 0);
        }
        n(Te, "pull1Algorithm");
        function x() {
          if (r) return f2 = true, T(void 0);
          r = true;
          const S = Gr(C._readableStreamController);
          return S === null ? nt() : Oe(S._view, true), T(void 0);
        }
        n(x, "pull2Algorithm");
        function N(S) {
          if (c = true, m = S, d2) {
            const v = yt([m, R]), k2 = ie(e, v);
            P(k2);
          }
          return B;
        }
        n(N, "cancel1Algorithm");
        function J(S) {
          if (d2 = true, R = S, c) {
            const v = yt([m, R]), k2 = ie(e, v);
            P(k2);
          }
          return B;
        }
        n(J, "cancel2Algorithm");
        function Ce() {
        }
        return n(Ce, "startAlgorithm"), y = Go(Ce, Te, N), C = Go(Ce, x, J), ae(t2), [y, C];
      }
      n(es, "ReadableByteStreamTee");
      function ts(e) {
        return l2(e) && typeof e.getReader < "u";
      }
      n(ts, "isReadableStreamLike");
      function rs(e) {
        return ts(e) ? os(e.getReader()) : ns(e);
      }
      n(rs, "ReadableStreamFrom");
      function ns(e) {
        let t2;
        const r = uo(e, "async"), s2 = u;
        function f2() {
          let d2;
          try {
            d2 = Yi(r);
          } catch (R) {
            return b(R);
          }
          const m = T(d2);
          return F(m, (R) => {
            if (!l2(R)) throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
            if (Gi(R)) $e(t2._readableStreamController);
            else {
              const C = Zi(R);
              Ke(t2._readableStreamController, C);
            }
          });
        }
        n(f2, "pullAlgorithm");
        function c(d2) {
          const m = r.iterator;
          let R;
          try {
            R = Mt(m, "return");
          } catch (P) {
            return b(P);
          }
          if (R === void 0) return T(void 0);
          let y;
          try {
            y = z(R, m, [d2]);
          } catch (P) {
            return b(P);
          }
          const C = T(y);
          return F(C, (P) => {
            if (!l2(P)) throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
          });
        }
        return n(c, "cancelAlgorithm"), t2 = Ct(s2, f2, c, 0), t2;
      }
      n(ns, "ReadableStreamFromIterable");
      function os(e) {
        let t2;
        const r = u;
        function s2() {
          let c;
          try {
            c = e.read();
          } catch (d2) {
            return b(d2);
          }
          return F(c, (d2) => {
            if (!l2(d2)) throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
            if (d2.done) $e(t2._readableStreamController);
            else {
              const m = d2.value;
              Ke(t2._readableStreamController, m);
            }
          });
        }
        n(s2, "pullAlgorithm");
        function f2(c) {
          try {
            return T(e.cancel(c));
          } catch (d2) {
            return b(d2);
          }
        }
        return n(f2, "cancelAlgorithm"), t2 = Ct(r, s2, f2, 0), t2;
      }
      n(os, "ReadableStreamFromDefaultReader");
      function is(e, t2) {
        ue(e, t2);
        const r = e, s2 = r == null ? void 0 : r.autoAllocateChunkSize, f2 = r == null ? void 0 : r.cancel, c = r == null ? void 0 : r.pull, d2 = r == null ? void 0 : r.start, m = r == null ? void 0 : r.type;
        return { autoAllocateChunkSize: s2 === void 0 ? void 0 : Fr(s2, `${t2} has member 'autoAllocateChunkSize' that`), cancel: f2 === void 0 ? void 0 : as(f2, r, `${t2} has member 'cancel' that`), pull: c === void 0 ? void 0 : ss(c, r, `${t2} has member 'pull' that`), start: d2 === void 0 ? void 0 : ls(d2, r, `${t2} has member 'start' that`), type: m === void 0 ? void 0 : us(m, `${t2} has member 'type' that`) };
      }
      n(is, "convertUnderlyingDefaultOrByteSource");
      function as(e, t2, r) {
        return Z(e, r), (s2) => j(e, t2, [s2]);
      }
      n(as, "convertUnderlyingSourceCancelCallback");
      function ss(e, t2, r) {
        return Z(e, r), (s2) => j(e, t2, [s2]);
      }
      n(ss, "convertUnderlyingSourcePullCallback");
      function ls(e, t2, r) {
        return Z(e, r), (s2) => z(e, t2, [s2]);
      }
      n(ls, "convertUnderlyingSourceStartCallback");
      function us(e, t2) {
        if (e = `${e}`, e !== "bytes") throw new TypeError(`${t2} '${e}' is not a valid enumeration value for ReadableStreamType`);
        return e;
      }
      n(us, "convertReadableStreamType");
      function fs(e, t2) {
        return ue(e, t2), { preventCancel: !!(e == null ? void 0 : e.preventCancel) };
      }
      n(fs, "convertIteratorOptions");
      function Yo(e, t2) {
        ue(e, t2);
        const r = e == null ? void 0 : e.preventAbort, s2 = e == null ? void 0 : e.preventCancel, f2 = e == null ? void 0 : e.preventClose, c = e == null ? void 0 : e.signal;
        return c !== void 0 && cs(c, `${t2} has member 'signal' that`), { preventAbort: !!r, preventCancel: !!s2, preventClose: !!f2, signal: c };
      }
      n(Yo, "convertPipeOptions");
      function cs(e, t2) {
        if (!_a2(e)) throw new TypeError(`${t2} is not an AbortSignal.`);
      }
      n(cs, "assertAbortSignal");
      function ds(e, t2) {
        ue(e, t2);
        const r = e == null ? void 0 : e.readable;
        zr(r, "readable", "ReadableWritablePair"), jr(r, `${t2} has member 'readable' that`);
        const s2 = e == null ? void 0 : e.writable;
        return zr(s2, "writable", "ReadableWritablePair"), Bo(s2, `${t2} has member 'writable' that`), { readable: r, writable: s2 };
      }
      n(ds, "convertReadableWritablePair");
      const Pn = class Pn {
        constructor(t2 = {}, r = {}) {
          t2 === void 0 ? t2 = null : Jn(t2, "First parameter");
          const s2 = Gt(r, "Second parameter"), f2 = is(t2, "First parameter");
          if (cn(this), f2.type === "bytes") {
            if (s2.size !== void 0) throw new RangeError("The strategy for a byte stream cannot have a size function");
            const c = St(s2, 0);
            aa(this, f2, c);
          } else {
            const c = Yt(s2), d2 = St(s2, 1);
            Ka(this, f2, d2, c);
          }
        }
        get locked() {
          if (!We(this)) throw De("locked");
          return qe(this);
        }
        cancel(t2 = void 0) {
          return We(this) ? qe(this) ? b(new TypeError("Cannot cancel a stream that already has a reader")) : ie(this, t2) : b(De("cancel"));
        }
        getReader(t2 = void 0) {
          if (!We(this)) throw De("getReader");
          return la(t2, "First parameter").mode === void 0 ? Qe(this) : Co(this);
        }
        pipeThrough(t2, r = {}) {
          if (!We(this)) throw De("pipeThrough");
          Se(t2, 1, "pipeThrough");
          const s2 = ds(t2, "First parameter"), f2 = Yo(r, "Second parameter");
          if (qe(this)) throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
          if (Ze(s2.writable)) throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
          const c = Ho(this, s2.writable, f2.preventClose, f2.preventAbort, f2.preventCancel, f2.signal);
          return Q(c), s2.readable;
        }
        pipeTo(t2, r = {}) {
          if (!We(this)) return b(De("pipeTo"));
          if (t2 === void 0) return b("Parameter 1 is required in 'pipeTo'.");
          if (!Ge(t2)) return b(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
          let s2;
          try {
            s2 = Yo(r, "Second parameter");
          } catch (f2) {
            return b(f2);
          }
          return qe(this) ? b(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")) : Ze(t2) ? b(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")) : Ho(this, t2, s2.preventClose, s2.preventAbort, s2.preventCancel, s2.signal);
        }
        tee() {
          if (!We(this)) throw De("tee");
          const t2 = Ja(this);
          return yt(t2);
        }
        values(t2 = void 0) {
          if (!We(this)) throw De("values");
          const r = fs(t2, "First parameter");
          return Vi(this, r.preventCancel);
        }
        [Ur](t2) {
          return this.values(t2);
        }
        static from(t2) {
          return rs(t2);
        }
      };
      n(Pn, "ReadableStream");
      let L = Pn;
      Object.defineProperties(L, { from: { enumerable: true } }), Object.defineProperties(L.prototype, { cancel: { enumerable: true }, getReader: { enumerable: true }, pipeThrough: { enumerable: true }, pipeTo: { enumerable: true }, tee: { enumerable: true }, values: { enumerable: true }, locked: { enumerable: true } }), h2(L.from, "from"), h2(L.prototype.cancel, "cancel"), h2(L.prototype.getReader, "getReader"), h2(L.prototype.pipeThrough, "pipeThrough"), h2(L.prototype.pipeTo, "pipeTo"), h2(L.prototype.tee, "tee"), h2(L.prototype.values, "values"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(L.prototype, Symbol.toStringTag, { value: "ReadableStream", configurable: true }), Object.defineProperty(L.prototype, Ur, { value: L.prototype.values, writable: true, configurable: true });
      function Ct(e, t2, r, s2 = 1, f2 = () => 1) {
        const c = Object.create(L.prototype);
        cn(c);
        const d2 = Object.create(ne.prototype);
        return Qo(c, d2, e, t2, r, s2, f2), c;
      }
      n(Ct, "CreateReadableStream");
      function Go(e, t2, r) {
        const s2 = Object.create(L.prototype);
        cn(s2);
        const f2 = Object.create(te.prototype);
        return To(s2, f2, e, t2, r, 0, void 0), s2;
      }
      n(Go, "CreateReadableByteStream");
      function cn(e) {
        e._state = "readable", e._reader = void 0, e._storedError = void 0, e._disturbed = false;
      }
      n(cn, "InitializeReadableStream");
      function We(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_readableStreamController") ? false : e instanceof L;
      }
      n(We, "IsReadableStream");
      function qe(e) {
        return e._reader !== void 0;
      }
      n(qe, "IsReadableStreamLocked");
      function ie(e, t2) {
        if (e._disturbed = true, e._state === "closed") return T(void 0);
        if (e._state === "errored") return b(e._storedError);
        Pt(e);
        const r = e._reader;
        if (r !== void 0 && Fe(r)) {
          const f2 = r._readIntoRequests;
          r._readIntoRequests = new D(), f2.forEach((c) => {
            c._closeSteps(void 0);
          });
        }
        const s2 = e._readableStreamController[Ar](t2);
        return F(s2, u);
      }
      n(ie, "ReadableStreamCancel");
      function Pt(e) {
        e._state = "closed";
        const t2 = e._reader;
        if (t2 !== void 0 && (Zn(t2), Ee(t2))) {
          const r = t2._readRequests;
          t2._readRequests = new D(), r.forEach((s2) => {
            s2._closeSteps();
          });
        }
      }
      n(Pt, "ReadableStreamClose");
      function Zo(e, t2) {
        e._state = "errored", e._storedError = t2;
        const r = e._reader;
        r !== void 0 && (Or(r, t2), Ee(r) ? ro(r, t2) : Ao(r, t2));
      }
      n(Zo, "ReadableStreamError");
      function De(e) {
        return new TypeError(`ReadableStream.prototype.${e} can only be used on a ReadableStream`);
      }
      n(De, "streamBrandCheckException$1");
      function Ko(e, t2) {
        ue(e, t2);
        const r = e == null ? void 0 : e.highWaterMark;
        return zr(r, "highWaterMark", "QueuingStrategyInit"), { highWaterMark: Ir(r) };
      }
      n(Ko, "convertQueuingStrategyInit");
      const Jo = n((e) => e.byteLength, "byteLengthSizeFunction");
      h2(Jo, "size");
      const vn = class vn {
        constructor(t2) {
          Se(t2, 1, "ByteLengthQueuingStrategy"), t2 = Ko(t2, "First parameter"), this._byteLengthQueuingStrategyHighWaterMark = t2.highWaterMark;
        }
        get highWaterMark() {
          if (!ei(this)) throw Xo("highWaterMark");
          return this._byteLengthQueuingStrategyHighWaterMark;
        }
        get size() {
          if (!ei(this)) throw Xo("size");
          return Jo;
        }
      };
      n(vn, "ByteLengthQueuingStrategy");
      let Xe = vn;
      Object.defineProperties(Xe.prototype, { highWaterMark: { enumerable: true }, size: { enumerable: true } }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Xe.prototype, Symbol.toStringTag, { value: "ByteLengthQueuingStrategy", configurable: true });
      function Xo(e) {
        return new TypeError(`ByteLengthQueuingStrategy.prototype.${e} can only be used on a ByteLengthQueuingStrategy`);
      }
      n(Xo, "byteLengthBrandCheckException");
      function ei(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_byteLengthQueuingStrategyHighWaterMark") ? false : e instanceof Xe;
      }
      n(ei, "IsByteLengthQueuingStrategy");
      const ti = n(() => 1, "countSizeFunction");
      h2(ti, "size");
      const En = class En {
        constructor(t2) {
          Se(t2, 1, "CountQueuingStrategy"), t2 = Ko(t2, "First parameter"), this._countQueuingStrategyHighWaterMark = t2.highWaterMark;
        }
        get highWaterMark() {
          if (!ni(this)) throw ri("highWaterMark");
          return this._countQueuingStrategyHighWaterMark;
        }
        get size() {
          if (!ni(this)) throw ri("size");
          return ti;
        }
      };
      n(En, "CountQueuingStrategy");
      let et = En;
      Object.defineProperties(et.prototype, { highWaterMark: { enumerable: true }, size: { enumerable: true } }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(et.prototype, Symbol.toStringTag, { value: "CountQueuingStrategy", configurable: true });
      function ri(e) {
        return new TypeError(`CountQueuingStrategy.prototype.${e} can only be used on a CountQueuingStrategy`);
      }
      n(ri, "countBrandCheckException");
      function ni(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_countQueuingStrategyHighWaterMark") ? false : e instanceof et;
      }
      n(ni, "IsCountQueuingStrategy");
      function hs(e, t2) {
        ue(e, t2);
        const r = e == null ? void 0 : e.cancel, s2 = e == null ? void 0 : e.flush, f2 = e == null ? void 0 : e.readableType, c = e == null ? void 0 : e.start, d2 = e == null ? void 0 : e.transform, m = e == null ? void 0 : e.writableType;
        return { cancel: r === void 0 ? void 0 : ys(r, e, `${t2} has member 'cancel' that`), flush: s2 === void 0 ? void 0 : ps(s2, e, `${t2} has member 'flush' that`), readableType: f2, start: c === void 0 ? void 0 : bs(c, e, `${t2} has member 'start' that`), transform: d2 === void 0 ? void 0 : ms(d2, e, `${t2} has member 'transform' that`), writableType: m };
      }
      n(hs, "convertTransformer");
      function ps(e, t2, r) {
        return Z(e, r), (s2) => j(e, t2, [s2]);
      }
      n(ps, "convertTransformerFlushCallback");
      function bs(e, t2, r) {
        return Z(e, r), (s2) => z(e, t2, [s2]);
      }
      n(bs, "convertTransformerStartCallback");
      function ms(e, t2, r) {
        return Z(e, r), (s2, f2) => j(e, t2, [s2, f2]);
      }
      n(ms, "convertTransformerTransformCallback");
      function ys(e, t2, r) {
        return Z(e, r), (s2) => j(e, t2, [s2]);
      }
      n(ys, "convertTransformerCancelCallback");
      const An = class An {
        constructor(t2 = {}, r = {}, s2 = {}) {
          t2 === void 0 && (t2 = null);
          const f2 = Gt(r, "Second parameter"), c = Gt(s2, "Third parameter"), d2 = hs(t2, "First parameter");
          if (d2.readableType !== void 0) throw new RangeError("Invalid readableType specified");
          if (d2.writableType !== void 0) throw new RangeError("Invalid writableType specified");
          const m = St(c, 0), R = Yt(c), y = St(f2, 1), C = Yt(f2);
          let P;
          const B = E((ae) => {
            P = ae;
          });
          gs(this, B, y, C, m, R), Ss(this, d2), d2.start !== void 0 ? P(d2.start(this._transformStreamController)) : P(void 0);
        }
        get readable() {
          if (!oi(this)) throw li("readable");
          return this._readable;
        }
        get writable() {
          if (!oi(this)) throw li("writable");
          return this._writable;
        }
      };
      n(An, "TransformStream");
      let tt = An;
      Object.defineProperties(tt.prototype, { readable: { enumerable: true }, writable: { enumerable: true } }), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(tt.prototype, Symbol.toStringTag, { value: "TransformStream", configurable: true });
      function gs(e, t2, r, s2, f2, c) {
        function d2() {
          return t2;
        }
        n(d2, "startAlgorithm");
        function m(B) {
          return Ts(e, B);
        }
        n(m, "writeAlgorithm");
        function R(B) {
          return Cs(e, B);
        }
        n(R, "abortAlgorithm");
        function y() {
          return Ps(e);
        }
        n(y, "closeAlgorithm"), e._writable = Ra(d2, m, y, R, r, s2);
        function C() {
          return vs(e);
        }
        n(C, "pullAlgorithm");
        function P(B) {
          return Es(e, B);
        }
        n(P, "cancelAlgorithm"), e._readable = Ct(d2, C, P, f2, c), e._backpressure = void 0, e._backpressureChangePromise = void 0, e._backpressureChangePromise_resolve = void 0, ar(e, true), e._transformStreamController = void 0;
      }
      n(gs, "InitializeTransformStream");
      function oi(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_transformStreamController") ? false : e instanceof tt;
      }
      n(oi, "IsTransformStream");
      function ii(e, t2) {
        oe(e._readable._readableStreamController, t2), dn(e, t2);
      }
      n(ii, "TransformStreamError");
      function dn(e, t2) {
        lr(e._transformStreamController), wt(e._writable._writableStreamController, t2), hn(e);
      }
      n(dn, "TransformStreamErrorWritableAndUnblockWrite");
      function hn(e) {
        e._backpressure && ar(e, false);
      }
      n(hn, "TransformStreamUnblockWrite");
      function ar(e, t2) {
        e._backpressureChangePromise !== void 0 && e._backpressureChangePromise_resolve(), e._backpressureChangePromise = E((r) => {
          e._backpressureChangePromise_resolve = r;
        }), e._backpressure = t2;
      }
      n(ar, "TransformStreamSetBackpressure");
      const Bn = class Bn {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get desiredSize() {
          if (!sr(this)) throw ur("desiredSize");
          const t2 = this._controlledTransformStream._readable._readableStreamController;
          return fn(t2);
        }
        enqueue(t2 = void 0) {
          if (!sr(this)) throw ur("enqueue");
          ai(this, t2);
        }
        error(t2 = void 0) {
          if (!sr(this)) throw ur("error");
          ws(this, t2);
        }
        terminate() {
          if (!sr(this)) throw ur("terminate");
          Rs(this);
        }
      };
      n(Bn, "TransformStreamDefaultController");
      let pe = Bn;
      Object.defineProperties(pe.prototype, { enqueue: { enumerable: true }, error: { enumerable: true }, terminate: { enumerable: true }, desiredSize: { enumerable: true } }), h2(pe.prototype.enqueue, "enqueue"), h2(pe.prototype.error, "error"), h2(pe.prototype.terminate, "terminate"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(pe.prototype, Symbol.toStringTag, { value: "TransformStreamDefaultController", configurable: true });
      function sr(e) {
        return !l2(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledTransformStream") ? false : e instanceof pe;
      }
      n(sr, "IsTransformStreamDefaultController");
      function _s(e, t2, r, s2, f2) {
        t2._controlledTransformStream = e, e._transformStreamController = t2, t2._transformAlgorithm = r, t2._flushAlgorithm = s2, t2._cancelAlgorithm = f2, t2._finishPromise = void 0, t2._finishPromise_resolve = void 0, t2._finishPromise_reject = void 0;
      }
      n(_s, "SetUpTransformStreamDefaultController");
      function Ss(e, t2) {
        const r = Object.create(pe.prototype);
        let s2, f2, c;
        t2.transform !== void 0 ? s2 = n((d2) => t2.transform(d2, r), "transformAlgorithm") : s2 = n((d2) => {
          try {
            return ai(r, d2), T(void 0);
          } catch (m) {
            return b(m);
          }
        }, "transformAlgorithm"), t2.flush !== void 0 ? f2 = n(() => t2.flush(r), "flushAlgorithm") : f2 = n(() => T(void 0), "flushAlgorithm"), t2.cancel !== void 0 ? c = n((d2) => t2.cancel(d2), "cancelAlgorithm") : c = n(() => T(void 0), "cancelAlgorithm"), _s(e, r, s2, f2, c);
      }
      n(Ss, "SetUpTransformStreamDefaultControllerFromTransformer");
      function lr(e) {
        e._transformAlgorithm = void 0, e._flushAlgorithm = void 0, e._cancelAlgorithm = void 0;
      }
      n(lr, "TransformStreamDefaultControllerClearAlgorithms");
      function ai(e, t2) {
        const r = e._controlledTransformStream, s2 = r._readable._readableStreamController;
        if (!Je(s2)) throw new TypeError("Readable side is not in a state that permits enqueue");
        try {
          Ke(s2, t2);
        } catch (c) {
          throw dn(r, c), r._readable._storedError;
        }
        Za(s2) !== r._backpressure && ar(r, true);
      }
      n(ai, "TransformStreamDefaultControllerEnqueue");
      function ws(e, t2) {
        ii(e._controlledTransformStream, t2);
      }
      n(ws, "TransformStreamDefaultControllerError");
      function si(e, t2) {
        const r = e._transformAlgorithm(t2);
        return F(r, void 0, (s2) => {
          throw ii(e._controlledTransformStream, s2), s2;
        });
      }
      n(si, "TransformStreamDefaultControllerPerformTransform");
      function Rs(e) {
        const t2 = e._controlledTransformStream, r = t2._readable._readableStreamController;
        $e(r);
        const s2 = new TypeError("TransformStream terminated");
        dn(t2, s2);
      }
      n(Rs, "TransformStreamDefaultControllerTerminate");
      function Ts(e, t2) {
        const r = e._transformStreamController;
        if (e._backpressure) {
          const s2 = e._backpressureChangePromise;
          return F(s2, () => {
            const f2 = e._writable;
            if (f2._state === "erroring") throw f2._storedError;
            return si(r, t2);
          });
        }
        return si(r, t2);
      }
      n(Ts, "TransformStreamDefaultSinkWriteAlgorithm");
      function Cs(e, t2) {
        const r = e._transformStreamController;
        if (r._finishPromise !== void 0) return r._finishPromise;
        const s2 = e._readable;
        r._finishPromise = E((c, d2) => {
          r._finishPromise_resolve = c, r._finishPromise_reject = d2;
        });
        const f2 = r._cancelAlgorithm(t2);
        return lr(r), _(f2, () => (s2._state === "errored" ? rt(r, s2._storedError) : (oe(s2._readableStreamController, t2), pn(r)), null), (c) => (oe(s2._readableStreamController, c), rt(r, c), null)), r._finishPromise;
      }
      n(Cs, "TransformStreamDefaultSinkAbortAlgorithm");
      function Ps(e) {
        const t2 = e._transformStreamController;
        if (t2._finishPromise !== void 0) return t2._finishPromise;
        const r = e._readable;
        t2._finishPromise = E((f2, c) => {
          t2._finishPromise_resolve = f2, t2._finishPromise_reject = c;
        });
        const s2 = t2._flushAlgorithm();
        return lr(t2), _(s2, () => (r._state === "errored" ? rt(t2, r._storedError) : ($e(r._readableStreamController), pn(t2)), null), (f2) => (oe(r._readableStreamController, f2), rt(t2, f2), null)), t2._finishPromise;
      }
      n(Ps, "TransformStreamDefaultSinkCloseAlgorithm");
      function vs(e) {
        return ar(e, false), e._backpressureChangePromise;
      }
      n(vs, "TransformStreamDefaultSourcePullAlgorithm");
      function Es(e, t2) {
        const r = e._transformStreamController;
        if (r._finishPromise !== void 0) return r._finishPromise;
        const s2 = e._writable;
        r._finishPromise = E((c, d2) => {
          r._finishPromise_resolve = c, r._finishPromise_reject = d2;
        });
        const f2 = r._cancelAlgorithm(t2);
        return lr(r), _(f2, () => (s2._state === "errored" ? rt(r, s2._storedError) : (wt(s2._writableStreamController, t2), hn(e), pn(r)), null), (c) => (wt(s2._writableStreamController, c), hn(e), rt(r, c), null)), r._finishPromise;
      }
      n(Es, "TransformStreamDefaultSourceCancelAlgorithm");
      function ur(e) {
        return new TypeError(`TransformStreamDefaultController.prototype.${e} can only be used on a TransformStreamDefaultController`);
      }
      n(ur, "defaultControllerBrandCheckException");
      function pn(e) {
        e._finishPromise_resolve !== void 0 && (e._finishPromise_resolve(), e._finishPromise_resolve = void 0, e._finishPromise_reject = void 0);
      }
      n(pn, "defaultControllerFinishPromiseResolve");
      function rt(e, t2) {
        e._finishPromise_reject !== void 0 && (Q(e._finishPromise), e._finishPromise_reject(t2), e._finishPromise_resolve = void 0, e._finishPromise_reject = void 0);
      }
      n(rt, "defaultControllerFinishPromiseReject");
      function li(e) {
        return new TypeError(`TransformStream.prototype.${e} can only be used on a TransformStream`);
      }
      n(li, "streamBrandCheckException"), a2.ByteLengthQueuingStrategy = Xe, a2.CountQueuingStrategy = et, a2.ReadableByteStreamController = te, a2.ReadableStream = L, a2.ReadableStreamBYOBReader = ce, a2.ReadableStreamBYOBRequest = Re, a2.ReadableStreamDefaultController = ne, a2.ReadableStreamDefaultReader = fe, a2.TransformStream = tt, a2.TransformStreamDefaultController = pe, a2.WritableStream = de, a2.WritableStreamDefaultController = ke, a2.WritableStreamDefaultWriter = re;
    });
  }(pr, pr.exports)), pr.exports;
}
n(Ls, "requirePonyfill_es2018");
const $s = 65536;
if (!globalThis.ReadableStream) try {
  const i = require("node:process"), { emitWarning: o2 } = i;
  try {
    i.emitWarning = () => {
    }, Object.assign(globalThis, require("node:stream/web")), i.emitWarning = o2;
  } catch (a2) {
    throw i.emitWarning = o2, a2;
  }
} catch {
  Object.assign(globalThis, Ls());
}
try {
  const { Blob: i } = require("buffer");
  i && !i.prototype.stream && (i.prototype.stream = n(function(a2) {
    let u = 0;
    const l2 = this;
    return new ReadableStream({ type: "bytes", async pull(p2) {
      const g2 = await l2.slice(u, Math.min(l2.size, u + $s)).arrayBuffer();
      u += g2.byteLength, p2.enqueue(new Uint8Array(g2)), u === l2.size && p2.close();
    } });
  }, "name"));
} catch {
}
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
const hi = 65536;
async function* qn(i, o2 = true) {
  for (const a2 of i) if ("stream" in a2) yield* a2.stream();
  else if (ArrayBuffer.isView(a2)) if (o2) {
    let u = a2.byteOffset;
    const l2 = a2.byteOffset + a2.byteLength;
    for (; u !== l2; ) {
      const p2 = Math.min(l2 - u, hi), h2 = a2.buffer.slice(u, u + p2);
      u += h2.byteLength, yield new Uint8Array(h2);
    }
  } else yield a2;
  else {
    let u = 0, l2 = a2;
    for (; u !== l2.size; ) {
      const h2 = await l2.slice(u, Math.min(l2.size, u + hi)).arrayBuffer();
      u += h2.byteLength, yield new Uint8Array(h2);
    }
  }
}
n(qn, "toIterator");
const pi = (Ve = class {
  constructor(o2 = [], a2 = {}) {
    be(this, ve, []);
    be(this, kt, "");
    be(this, bt, 0);
    be(this, Cr, "transparent");
    if (typeof o2 != "object" || o2 === null) throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
    if (typeof o2[Symbol.iterator] != "function") throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
    if (typeof a2 != "object" && typeof a2 != "function") throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
    a2 === null && (a2 = {});
    const u = new TextEncoder();
    for (const p2 of o2) {
      let h2;
      ArrayBuffer.isView(p2) ? h2 = new Uint8Array(p2.buffer.slice(p2.byteOffset, p2.byteOffset + p2.byteLength)) : p2 instanceof ArrayBuffer ? h2 = new Uint8Array(p2.slice(0)) : p2 instanceof Ve ? h2 = p2 : h2 = u.encode(`${p2}`), X(this, bt, O(this, bt) + (ArrayBuffer.isView(h2) ? h2.byteLength : h2.size)), O(this, ve).push(h2);
    }
    X(this, Cr, `${a2.endings === void 0 ? "transparent" : a2.endings}`);
    const l2 = a2.type === void 0 ? "" : String(a2.type);
    X(this, kt, /^[\x20-\x7E]*$/.test(l2) ? l2 : "");
  }
  get size() {
    return O(this, bt);
  }
  get type() {
    return O(this, kt);
  }
  async text() {
    const o2 = new TextDecoder();
    let a2 = "";
    for await (const u of qn(O(this, ve), false)) a2 += o2.decode(u, { stream: true });
    return a2 += o2.decode(), a2;
  }
  async arrayBuffer() {
    const o2 = new Uint8Array(this.size);
    let a2 = 0;
    for await (const u of qn(O(this, ve), false)) o2.set(u, a2), a2 += u.length;
    return o2.buffer;
  }
  stream() {
    const o2 = qn(O(this, ve), true);
    return new globalThis.ReadableStream({ type: "bytes", async pull(a2) {
      const u = await o2.next();
      u.done ? a2.close() : a2.enqueue(u.value);
    }, async cancel() {
      await o2.return();
    } });
  }
  slice(o2 = 0, a2 = this.size, u = "") {
    const { size: l2 } = this;
    let p2 = o2 < 0 ? Math.max(l2 + o2, 0) : Math.min(o2, l2), h2 = a2 < 0 ? Math.max(l2 + a2, 0) : Math.min(a2, l2);
    const g2 = Math.max(h2 - p2, 0), A2 = O(this, ve), w = [];
    let E = 0;
    for (const b of A2) {
      if (E >= g2) break;
      const q = ArrayBuffer.isView(b) ? b.byteLength : b.size;
      if (p2 && q <= p2) p2 -= q, h2 -= q;
      else {
        let _;
        ArrayBuffer.isView(b) ? (_ = b.subarray(p2, Math.min(q, h2)), E += _.byteLength) : (_ = b.slice(p2, Math.min(q, h2)), E += _.size), h2 -= q, w.push(_), p2 = 0;
      }
    }
    const T = new Ve([], { type: String(u).toLowerCase() });
    return X(T, bt, g2), X(T, ve, w), T;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](o2) {
    return o2 && typeof o2 == "object" && typeof o2.constructor == "function" && (typeof o2.stream == "function" || typeof o2.arrayBuffer == "function") && /^(Blob|File)$/.test(o2[Symbol.toStringTag]);
  }
}, ve = /* @__PURE__ */ new WeakMap(), kt = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ new WeakMap(), Cr = /* @__PURE__ */ new WeakMap(), n(Ve, "Blob"), Ve);
Object.defineProperties(pi.prototype, { size: { enumerable: true }, type: { enumerable: true }, slice: { enumerable: true } });
const Ds = pi, ut = Ds, Ms = (Ot = class extends ut {
  constructor(a2, u, l2 = {}) {
    if (arguments.length < 2) throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
    super(a2, l2);
    be(this, Wt, 0);
    be(this, qt, "");
    l2 === null && (l2 = {});
    const p2 = l2.lastModified === void 0 ? Date.now() : Number(l2.lastModified);
    Number.isNaN(p2) || X(this, Wt, p2), X(this, qt, String(u));
  }
  get name() {
    return O(this, qt);
  }
  get lastModified() {
    return O(this, Wt);
  }
  get [Symbol.toStringTag]() {
    return "File";
  }
  static [Symbol.hasInstance](a2) {
    return !!a2 && a2 instanceof ut && /^(File)$/.test(a2[Symbol.toStringTag]);
  }
}, Wt = /* @__PURE__ */ new WeakMap(), qt = /* @__PURE__ */ new WeakMap(), n(Ot, "File"), Ot), Us = Ms, On = Us;
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
var { toStringTag: Et, iterator: xs, hasInstance: Ns } = Symbol, bi = Math.random, Hs = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","), mi = n((i, o2, a2) => (i += "", /^(Blob|File)$/.test(o2 && o2[Et]) ? [(a2 = a2 !== void 0 ? a2 + "" : o2[Et] == "File" ? o2.name : "blob", i), o2.name !== a2 || o2[Et] == "blob" ? new On([o2], a2, o2) : o2] : [i, o2 + ""]), "f"), zn = n((i, o2) => (o2 ? i : i.replace(/\r?\n|\r/g, `\r
`)).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), "e$1"), Me = n((i, o2, a2) => {
  if (o2.length < a2) throw new TypeError(`Failed to execute '${i}' on 'FormData': ${a2} arguments required, but only ${o2.length} present.`);
}, "x");
const br = (zt = class {
  constructor(...o2) {
    be(this, ee, []);
    if (o2.length) throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.");
  }
  get [Et]() {
    return "FormData";
  }
  [xs]() {
    return this.entries();
  }
  static [Ns](o2) {
    return o2 && typeof o2 == "object" && o2[Et] === "FormData" && !Hs.some((a2) => typeof o2[a2] != "function");
  }
  append(...o2) {
    Me("append", arguments, 2), O(this, ee).push(mi(...o2));
  }
  delete(o2) {
    Me("delete", arguments, 1), o2 += "", X(this, ee, O(this, ee).filter(([a2]) => a2 !== o2));
  }
  get(o2) {
    Me("get", arguments, 1), o2 += "";
    for (var a2 = O(this, ee), u = a2.length, l2 = 0; l2 < u; l2++) if (a2[l2][0] === o2) return a2[l2][1];
    return null;
  }
  getAll(o2, a2) {
    return Me("getAll", arguments, 1), a2 = [], o2 += "", O(this, ee).forEach((u) => u[0] === o2 && a2.push(u[1])), a2;
  }
  has(o2) {
    return Me("has", arguments, 1), o2 += "", O(this, ee).some((a2) => a2[0] === o2);
  }
  forEach(o2, a2) {
    Me("forEach", arguments, 1);
    for (var [u, l2] of this) o2.call(a2, l2, u, this);
  }
  set(...o2) {
    Me("set", arguments, 2);
    var a2 = [], u = true;
    o2 = mi(...o2), O(this, ee).forEach((l2) => {
      l2[0] === o2[0] ? u && (u = !a2.push(o2)) : a2.push(l2);
    }), u && a2.push(o2), X(this, ee, a2);
  }
  *entries() {
    yield* O(this, ee);
  }
  *keys() {
    for (var [o2] of this) yield o2;
  }
  *values() {
    for (var [, o2] of this) yield o2;
  }
}, ee = /* @__PURE__ */ new WeakMap(), n(zt, "FormData"), zt);
function Vs(i, o2 = ut) {
  var a2 = `${bi()}${bi()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), u = [], l2 = `--${a2}\r
Content-Disposition: form-data; name="`;
  return i.forEach((p2, h2) => typeof p2 == "string" ? u.push(l2 + zn(h2) + `"\r
\r
${p2.replace(new RegExp("\\r(?!\\n)|(?<!\\r)\\n", "g"), `\r
`)}\r
`) : u.push(l2 + zn(h2) + `"; filename="${zn(p2.name, 1)}"\r
Content-Type: ${p2.type || "application/octet-stream"}\r
\r
`, p2, `\r
`)), u.push(`--${a2}--`), new o2(u, { type: "multipart/form-data; boundary=" + a2 });
}
n(Vs, "formDataToBlob");
const Un = class Un2 extends Error {
  constructor(o2, a2) {
    super(o2), Error.captureStackTrace(this, this.constructor), this.type = a2;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
n(Un, "FetchBaseError");
let ft = Un;
const xn = class xn2 extends ft {
  constructor(o2, a2, u) {
    super(o2, a2), u && (this.code = this.errno = u.code, this.erroredSysCall = u.syscall);
  }
};
n(xn, "FetchError");
let G = xn;
const mr = Symbol.toStringTag, yi = n((i) => typeof i == "object" && typeof i.append == "function" && typeof i.delete == "function" && typeof i.get == "function" && typeof i.getAll == "function" && typeof i.has == "function" && typeof i.set == "function" && typeof i.sort == "function" && i[mr] === "URLSearchParams", "isURLSearchParameters"), yr = n((i) => i && typeof i == "object" && typeof i.arrayBuffer == "function" && typeof i.type == "string" && typeof i.stream == "function" && typeof i.constructor == "function" && /^(Blob|File)$/.test(i[mr]), "isBlob"), Qs = n((i) => typeof i == "object" && (i[mr] === "AbortSignal" || i[mr] === "EventTarget"), "isAbortSignal"), Ys = n((i, o2) => {
  const a2 = new URL(o2).hostname, u = new URL(i).hostname;
  return a2 === u || a2.endsWith(`.${u}`);
}, "isDomainOrSubdomain"), Gs = n((i, o2) => {
  const a2 = new URL(o2).protocol, u = new URL(i).protocol;
  return a2 === u;
}, "isSameProtocol"), Zs = promisify(me.pipeline), H$1 = Symbol("Body internals"), Nn = class Nn2 {
  constructor(o2, { size: a2 = 0 } = {}) {
    let u = null;
    o2 === null ? o2 = null : yi(o2) ? o2 = Buffer$1.from(o2.toString()) : yr(o2) || Buffer$1.isBuffer(o2) || (types.isAnyArrayBuffer(o2) ? o2 = Buffer$1.from(o2) : ArrayBuffer.isView(o2) ? o2 = Buffer$1.from(o2.buffer, o2.byteOffset, o2.byteLength) : o2 instanceof me || (o2 instanceof br ? (o2 = Vs(o2), u = o2.type.split("=")[1]) : o2 = Buffer$1.from(String(o2))));
    let l2 = o2;
    Buffer$1.isBuffer(o2) ? l2 = me.Readable.from(o2) : yr(o2) && (l2 = me.Readable.from(o2.stream())), this[H$1] = { body: o2, stream: l2, boundary: u, disturbed: false, error: null }, this.size = a2, o2 instanceof me && o2.on("error", (p2) => {
      const h2 = p2 instanceof ft ? p2 : new G(`Invalid response body while trying to fetch ${this.url}: ${p2.message}`, "system", p2);
      this[H$1].error = h2;
    });
  }
  get body() {
    return this[H$1].stream;
  }
  get bodyUsed() {
    return this[H$1].disturbed;
  }
  async arrayBuffer() {
    const { buffer: o2, byteOffset: a2, byteLength: u } = await In(this);
    return o2.slice(a2, a2 + u);
  }
  async formData() {
    const o2 = this.headers.get("content-type");
    if (o2.startsWith("application/x-www-form-urlencoded")) {
      const u = new br(), l2 = new URLSearchParams(await this.text());
      for (const [p2, h2] of l2) u.append(p2, h2);
      return u;
    }
    const { toFormData: a2 } = await import('./multipart-parser-BbRUkfiG.mjs');
    return a2(this.body, o2);
  }
  async blob() {
    const o2 = this.headers && this.headers.get("content-type") || this[H$1].body && this[H$1].body.type || "", a2 = await this.arrayBuffer();
    return new ut([a2], { type: o2 });
  }
  async json() {
    const o2 = await this.text();
    return JSON.parse(o2);
  }
  async text() {
    const o2 = await In(this);
    return new TextDecoder().decode(o2);
  }
  buffer() {
    return In(this);
  }
};
n(Nn, "Body");
let Ue = Nn;
Ue.prototype.buffer = deprecate(Ue.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer"), Object.defineProperties(Ue.prototype, { body: { enumerable: true }, bodyUsed: { enumerable: true }, arrayBuffer: { enumerable: true }, blob: { enumerable: true }, json: { enumerable: true }, text: { enumerable: true }, data: { get: deprecate(() => {
}, "data doesn't exist, use json(), text(), arrayBuffer(), or body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (response)") } });
async function In(i) {
  if (i[H$1].disturbed) throw new TypeError(`body used already for: ${i.url}`);
  if (i[H$1].disturbed = true, i[H$1].error) throw i[H$1].error;
  const { body: o2 } = i;
  if (o2 === null) return Buffer$1.alloc(0);
  if (!(o2 instanceof me)) return Buffer$1.alloc(0);
  const a2 = [];
  let u = 0;
  try {
    for await (const l2 of o2) {
      if (i.size > 0 && u + l2.length > i.size) {
        const p2 = new G(`content size at ${i.url} over limit: ${i.size}`, "max-size");
        throw o2.destroy(p2), p2;
      }
      u += l2.length, a2.push(l2);
    }
  } catch (l2) {
    throw l2 instanceof ft ? l2 : new G(`Invalid response body while trying to fetch ${i.url}: ${l2.message}`, "system", l2);
  }
  if (o2.readableEnded === true || o2._readableState.ended === true) try {
    return a2.every((l2) => typeof l2 == "string") ? Buffer$1.from(a2.join("")) : Buffer$1.concat(a2, u);
  } catch (l2) {
    throw new G(`Could not create Buffer from response body for ${i.url}: ${l2.message}`, "system", l2);
  }
  else throw new G(`Premature close of server response while trying to fetch ${i.url}`);
}
n(In, "consumeBody");
const Fn = n((i, o2) => {
  let a2, u, { body: l2 } = i[H$1];
  if (i.bodyUsed) throw new Error("cannot clone body after it is used");
  return l2 instanceof me && typeof l2.getBoundary != "function" && (a2 = new PassThrough({ highWaterMark: o2 }), u = new PassThrough({ highWaterMark: o2 }), l2.pipe(a2), l2.pipe(u), i[H$1].stream = a2, l2 = u), l2;
}, "clone"), Ks = deprecate((i) => i.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167"), gi = n((i, o2) => i === null ? null : typeof i == "string" ? "text/plain;charset=UTF-8" : yi(i) ? "application/x-www-form-urlencoded;charset=UTF-8" : yr(i) ? i.type || null : Buffer$1.isBuffer(i) || types.isAnyArrayBuffer(i) || ArrayBuffer.isView(i) ? null : i instanceof br ? `multipart/form-data; boundary=${o2[H$1].boundary}` : i && typeof i.getBoundary == "function" ? `multipart/form-data;boundary=${Ks(i)}` : i instanceof me ? null : "text/plain;charset=UTF-8", "extractContentType"), Js = n((i) => {
  const { body: o2 } = i[H$1];
  return o2 === null ? 0 : yr(o2) ? o2.size : Buffer$1.isBuffer(o2) ? o2.length : o2 && typeof o2.getLengthSync == "function" && o2.hasKnownLength && o2.hasKnownLength() ? o2.getLengthSync() : null;
}, "getTotalBytes"), Xs = n(async (i, { body: o2 }) => {
  o2 === null ? i.end() : await Zs(o2, i);
}, "writeToStream"), gr = typeof vt.validateHeaderName == "function" ? vt.validateHeaderName : (i) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(i)) {
    const o2 = new TypeError(`Header name must be a valid HTTP token [${i}]`);
    throw Object.defineProperty(o2, "code", { value: "ERR_INVALID_HTTP_TOKEN" }), o2;
  }
}, jn = typeof vt.validateHeaderValue == "function" ? vt.validateHeaderValue : (i, o2) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(o2)) {
    const a2 = new TypeError(`Invalid character in header content ["${i}"]`);
    throw Object.defineProperty(a2, "code", { value: "ERR_INVALID_CHAR" }), a2;
  }
}, Pr = class Pr2 extends URLSearchParams {
  constructor(o2) {
    let a2 = [];
    if (o2 instanceof Pr2) {
      const u = o2.raw();
      for (const [l2, p2] of Object.entries(u)) a2.push(...p2.map((h2) => [l2, h2]));
    } else if (o2 != null) if (typeof o2 == "object" && !types.isBoxedPrimitive(o2)) {
      const u = o2[Symbol.iterator];
      if (u == null) a2.push(...Object.entries(o2));
      else {
        if (typeof u != "function") throw new TypeError("Header pairs must be iterable");
        a2 = [...o2].map((l2) => {
          if (typeof l2 != "object" || types.isBoxedPrimitive(l2)) throw new TypeError("Each header pair must be an iterable object");
          return [...l2];
        }).map((l2) => {
          if (l2.length !== 2) throw new TypeError("Each header pair must be a name/value tuple");
          return [...l2];
        });
      }
    } else throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    return a2 = a2.length > 0 ? a2.map(([u, l2]) => (gr(u), jn(u, String(l2)), [String(u).toLowerCase(), String(l2)])) : void 0, super(a2), new Proxy(this, { get(u, l2, p2) {
      switch (l2) {
        case "append":
        case "set":
          return (h2, g2) => (gr(h2), jn(h2, String(g2)), URLSearchParams.prototype[l2].call(u, String(h2).toLowerCase(), String(g2)));
        case "delete":
        case "has":
        case "getAll":
          return (h2) => (gr(h2), URLSearchParams.prototype[l2].call(u, String(h2).toLowerCase()));
        case "keys":
          return () => (u.sort(), new Set(URLSearchParams.prototype.keys.call(u)).keys());
        default:
          return Reflect.get(u, l2, p2);
      }
    } });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(o2) {
    const a2 = this.getAll(o2);
    if (a2.length === 0) return null;
    let u = a2.join(", ");
    return /^content-encoding$/i.test(o2) && (u = u.toLowerCase()), u;
  }
  forEach(o2, a2 = void 0) {
    for (const u of this.keys()) Reflect.apply(o2, a2, [this.get(u), u, this]);
  }
  *values() {
    for (const o2 of this.keys()) yield this.get(o2);
  }
  *entries() {
    for (const o2 of this.keys()) yield [o2, this.get(o2)];
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((o2, a2) => (o2[a2] = this.getAll(a2), o2), {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((o2, a2) => {
      const u = this.getAll(a2);
      return a2 === "host" ? o2[a2] = u[0] : o2[a2] = u.length > 1 ? u : u[0], o2;
    }, {});
  }
};
n(Pr, "Headers");
let ye = Pr;
Object.defineProperties(ye.prototype, ["get", "entries", "forEach", "values"].reduce((i, o2) => (i[o2] = { enumerable: true }, i), {}));
function el(i = []) {
  return new ye(i.reduce((o2, a2, u, l2) => (u % 2 === 0 && o2.push(l2.slice(u, u + 2)), o2), []).filter(([o2, a2]) => {
    try {
      return gr(o2), jn(o2, String(a2)), true;
    } catch {
      return false;
    }
  }));
}
n(el, "fromRawHeaders");
const tl = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]), Ln = n((i) => tl.has(i), "isRedirect"), se = Symbol("Response internals"), xe = class xe2 extends Ue {
  constructor(o2 = null, a2 = {}) {
    super(o2, a2);
    const u = a2.status != null ? a2.status : 200, l2 = new ye(a2.headers);
    if (o2 !== null && !l2.has("Content-Type")) {
      const p2 = gi(o2, this);
      p2 && l2.append("Content-Type", p2);
    }
    this[se] = { type: "default", url: a2.url, status: u, statusText: a2.statusText || "", headers: l2, counter: a2.counter, highWaterMark: a2.highWaterMark };
  }
  get type() {
    return this[se].type;
  }
  get url() {
    return this[se].url || "";
  }
  get status() {
    return this[se].status;
  }
  get ok() {
    return this[se].status >= 200 && this[se].status < 300;
  }
  get redirected() {
    return this[se].counter > 0;
  }
  get statusText() {
    return this[se].statusText;
  }
  get headers() {
    return this[se].headers;
  }
  get highWaterMark() {
    return this[se].highWaterMark;
  }
  clone() {
    return new xe2(Fn(this, this.highWaterMark), { type: this.type, url: this.url, status: this.status, statusText: this.statusText, headers: this.headers, ok: this.ok, redirected: this.redirected, size: this.size, highWaterMark: this.highWaterMark });
  }
  static redirect(o2, a2 = 302) {
    if (!Ln(a2)) throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    return new xe2(null, { headers: { location: new URL(o2).toString() }, status: a2 });
  }
  static error() {
    const o2 = new xe2(null, { status: 0, statusText: "" });
    return o2[se].type = "error", o2;
  }
  static json(o2 = void 0, a2 = {}) {
    const u = JSON.stringify(o2);
    if (u === void 0) throw new TypeError("data is not JSON serializable");
    const l2 = new ye(a2 && a2.headers);
    return l2.has("content-type") || l2.set("content-type", "application/json"), new xe2(u, { ...a2, headers: l2 });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
n(xe, "Response");
let le = xe;
Object.defineProperties(le.prototype, { type: { enumerable: true }, url: { enumerable: true }, status: { enumerable: true }, ok: { enumerable: true }, redirected: { enumerable: true }, statusText: { enumerable: true }, headers: { enumerable: true }, clone: { enumerable: true } });
const rl = n((i) => {
  if (i.search) return i.search;
  const o2 = i.href.length - 1, a2 = i.hash || (i.href[o2] === "#" ? "#" : "");
  return i.href[o2 - a2.length] === "?" ? "?" : "";
}, "getSearch");
function _i(i, o2 = false) {
  return i == null || (i = new URL(i), /^(about|blob|data):$/.test(i.protocol)) ? "no-referrer" : (i.username = "", i.password = "", i.hash = "", o2 && (i.pathname = "", i.search = ""), i);
}
n(_i, "stripURLForUseAsAReferrer");
const Si = /* @__PURE__ */ new Set(["", "no-referrer", "no-referrer-when-downgrade", "same-origin", "origin", "strict-origin", "origin-when-cross-origin", "strict-origin-when-cross-origin", "unsafe-url"]), nl = "strict-origin-when-cross-origin";
function ol(i) {
  if (!Si.has(i)) throw new TypeError(`Invalid referrerPolicy: ${i}`);
  return i;
}
n(ol, "validateReferrerPolicy");
function il(i) {
  if (/^(http|ws)s:$/.test(i.protocol)) return true;
  const o2 = i.host.replace(/(^\[)|(]$)/g, ""), a2 = isIP(o2);
  return a2 === 4 && /^127\./.test(o2) || a2 === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(o2) ? true : i.host === "localhost" || i.host.endsWith(".localhost") ? false : i.protocol === "file:";
}
n(il, "isOriginPotentiallyTrustworthy");
function ct(i) {
  return /^about:(blank|srcdoc)$/.test(i) || i.protocol === "data:" || /^(blob|filesystem):$/.test(i.protocol) ? true : il(i);
}
n(ct, "isUrlPotentiallyTrustworthy");
function al(i, { referrerURLCallback: o2, referrerOriginCallback: a2 } = {}) {
  if (i.referrer === "no-referrer" || i.referrerPolicy === "") return null;
  const u = i.referrerPolicy;
  if (i.referrer === "about:client") return "no-referrer";
  const l2 = i.referrer;
  let p2 = _i(l2), h2 = _i(l2, true);
  p2.toString().length > 4096 && (p2 = h2), o2 && (p2 = o2(p2)), a2 && (h2 = a2(h2));
  const g2 = new URL(i.url);
  switch (u) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return h2;
    case "unsafe-url":
      return p2;
    case "strict-origin":
      return ct(p2) && !ct(g2) ? "no-referrer" : h2.toString();
    case "strict-origin-when-cross-origin":
      return p2.origin === g2.origin ? p2 : ct(p2) && !ct(g2) ? "no-referrer" : h2;
    case "same-origin":
      return p2.origin === g2.origin ? p2 : "no-referrer";
    case "origin-when-cross-origin":
      return p2.origin === g2.origin ? p2 : h2;
    case "no-referrer-when-downgrade":
      return ct(p2) && !ct(g2) ? "no-referrer" : p2;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${u}`);
  }
}
n(al, "determineRequestsReferrer");
function sl(i) {
  const o2 = (i.get("referrer-policy") || "").split(/[,\s]+/);
  let a2 = "";
  for (const u of o2) u && Si.has(u) && (a2 = u);
  return a2;
}
n(sl, "parseReferrerPolicyFromHeader");
const $ = Symbol("Request internals"), At = n((i) => typeof i == "object" && typeof i[$] == "object", "isRequest"), ll = deprecate(() => {
}, ".data is not a valid RequestInit property, use .body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (request)"), vr = class vr2 extends Ue {
  constructor(o2, a2 = {}) {
    let u;
    if (At(o2) ? u = new URL(o2.url) : (u = new URL(o2), o2 = {}), u.username !== "" || u.password !== "") throw new TypeError(`${u} is an url with embedded credentials.`);
    let l2 = a2.method || o2.method || "GET";
    if (/^(delete|get|head|options|post|put)$/i.test(l2) && (l2 = l2.toUpperCase()), !At(a2) && "data" in a2 && ll(), (a2.body != null || At(o2) && o2.body !== null) && (l2 === "GET" || l2 === "HEAD")) throw new TypeError("Request with GET/HEAD method cannot have body");
    const p2 = a2.body ? a2.body : At(o2) && o2.body !== null ? Fn(o2) : null;
    super(p2, { size: a2.size || o2.size || 0 });
    const h2 = new ye(a2.headers || o2.headers || {});
    if (p2 !== null && !h2.has("Content-Type")) {
      const w = gi(p2, this);
      w && h2.set("Content-Type", w);
    }
    let g2 = At(o2) ? o2.signal : null;
    if ("signal" in a2 && (g2 = a2.signal), g2 != null && !Qs(g2)) throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
    let A2 = a2.referrer == null ? o2.referrer : a2.referrer;
    if (A2 === "") A2 = "no-referrer";
    else if (A2) {
      const w = new URL(A2);
      A2 = /^about:(\/\/)?client$/.test(w) ? "client" : w;
    } else A2 = void 0;
    this[$] = { method: l2, redirect: a2.redirect || o2.redirect || "follow", headers: h2, parsedURL: u, signal: g2, referrer: A2 }, this.follow = a2.follow === void 0 ? o2.follow === void 0 ? 20 : o2.follow : a2.follow, this.compress = a2.compress === void 0 ? o2.compress === void 0 ? true : o2.compress : a2.compress, this.counter = a2.counter || o2.counter || 0, this.agent = a2.agent || o2.agent, this.highWaterMark = a2.highWaterMark || o2.highWaterMark || 16384, this.insecureHTTPParser = a2.insecureHTTPParser || o2.insecureHTTPParser || false, this.referrerPolicy = a2.referrerPolicy || o2.referrerPolicy || "";
  }
  get method() {
    return this[$].method;
  }
  get url() {
    return format$1(this[$].parsedURL);
  }
  get headers() {
    return this[$].headers;
  }
  get redirect() {
    return this[$].redirect;
  }
  get signal() {
    return this[$].signal;
  }
  get referrer() {
    if (this[$].referrer === "no-referrer") return "";
    if (this[$].referrer === "client") return "about:client";
    if (this[$].referrer) return this[$].referrer.toString();
  }
  get referrerPolicy() {
    return this[$].referrerPolicy;
  }
  set referrerPolicy(o2) {
    this[$].referrerPolicy = ol(o2);
  }
  clone() {
    return new vr2(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
n(vr, "Request");
let dt = vr;
Object.defineProperties(dt.prototype, { method: { enumerable: true }, url: { enumerable: true }, headers: { enumerable: true }, redirect: { enumerable: true }, clone: { enumerable: true }, signal: { enumerable: true }, referrer: { enumerable: true }, referrerPolicy: { enumerable: true } });
const ul = n((i) => {
  const { parsedURL: o2 } = i[$], a2 = new ye(i[$].headers);
  a2.has("Accept") || a2.set("Accept", "*/*");
  let u = null;
  if (i.body === null && /^(post|put)$/i.test(i.method) && (u = "0"), i.body !== null) {
    const g2 = Js(i);
    typeof g2 == "number" && !Number.isNaN(g2) && (u = String(g2));
  }
  u && a2.set("Content-Length", u), i.referrerPolicy === "" && (i.referrerPolicy = nl), i.referrer && i.referrer !== "no-referrer" ? i[$].referrer = al(i) : i[$].referrer = "no-referrer", i[$].referrer instanceof URL && a2.set("Referer", i.referrer), a2.has("User-Agent") || a2.set("User-Agent", "node-fetch"), i.compress && !a2.has("Accept-Encoding") && a2.set("Accept-Encoding", "gzip, deflate, br");
  let { agent: l2 } = i;
  typeof l2 == "function" && (l2 = l2(o2));
  const p2 = rl(o2), h2 = { path: o2.pathname + p2, method: i.method, headers: a2[Symbol.for("nodejs.util.inspect.custom")](), insecureHTTPParser: i.insecureHTTPParser, agent: l2 };
  return { parsedURL: o2, options: h2 };
}, "getNodeRequestOptions"), Hn = class Hn2 extends ft {
  constructor(o2, a2 = "aborted") {
    super(o2, a2);
  }
};
n(Hn, "AbortError");
let _r = Hn;
/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
if (!globalThis.DOMException) try {
  const { MessageChannel: i } = require("worker_threads"), o2 = new i().port1, a2 = new ArrayBuffer();
  o2.postMessage(a2, [a2, a2]);
} catch (i) {
  i.constructor.name === "DOMException" && (globalThis.DOMException = i.constructor);
}
var fl = globalThis.DOMException;
const cl = f$1(fl), { stat: $n } = promises;
n((i, o2) => wi(statSync(i), i, o2), "blobFromSync");
n((i, o2) => $n(i).then((a2) => wi(a2, i, o2)), "blobFrom");
n((i, o2) => $n(i).then((a2) => Ri(a2, i, o2)), "fileFrom");
n((i, o2) => Ri(statSync(i), i, o2), "fileFromSync");
const wi = n((i, o2, a2 = "") => new ut([new Sr({ path: o2, size: i.size, lastModified: i.mtimeMs, start: 0 })], { type: a2 }), "fromBlob"), Ri = n((i, o2, a2 = "") => new On([new Sr({ path: o2, size: i.size, lastModified: i.mtimeMs, start: 0 })], basename(o2), { type: a2, lastModified: i.mtimeMs }), "fromFile"), Er = class Er2 {
  constructor(o2) {
    be(this, Ne, void 0);
    be(this, He, void 0);
    X(this, Ne, o2.path), X(this, He, o2.start), this.size = o2.size, this.lastModified = o2.lastModified;
  }
  slice(o2, a2) {
    return new Er2({ path: O(this, Ne), lastModified: this.lastModified, size: a2 - o2, start: O(this, He) + o2 });
  }
  async *stream() {
    const { mtimeMs: o2 } = await $n(O(this, Ne));
    if (o2 > this.lastModified) throw new cl("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.", "NotReadableError");
    yield* createReadStream(O(this, Ne), { start: O(this, He), end: O(this, He) + this.size - 1 });
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
};
Ne = /* @__PURE__ */ new WeakMap(), He = /* @__PURE__ */ new WeakMap(), n(Er, "BlobDataItem");
let Sr = Er;
const ml = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
async function Ti(i, o2) {
  return new Promise((a2, u) => {
    const l2 = new dt(i, o2), { parsedURL: p2, options: h2 } = ul(l2);
    if (!ml.has(p2.protocol)) throw new TypeError(`node-fetch cannot load ${i}. URL scheme "${p2.protocol.replace(/:$/, "")}" is not supported.`);
    if (p2.protocol === "data:") {
      const _ = js(l2.url), V = new le(_, { headers: { "Content-Type": _.typeFull } });
      a2(V);
      return;
    }
    const g2 = (p2.protocol === "https:" ? Bs : vt).request, { signal: A2 } = l2;
    let w = null;
    const E = n(() => {
      const _ = new _r("The operation was aborted.");
      u(_), l2.body && l2.body instanceof me.Readable && l2.body.destroy(_), !(!w || !w.body) && w.body.emit("error", _);
    }, "abort");
    if (A2 && A2.aborted) {
      E();
      return;
    }
    const T = n(() => {
      E(), q();
    }, "abortAndFinalize"), b = g2(p2.toString(), h2);
    A2 && A2.addEventListener("abort", T);
    const q = n(() => {
      b.abort(), A2 && A2.removeEventListener("abort", T);
    }, "finalize");
    b.on("error", (_) => {
      u(new G(`request to ${l2.url} failed, reason: ${_.message}`, "system", _)), q();
    }), yl(b, (_) => {
      w && w.body && w.body.destroy(_);
    }), process.version < "v14" && b.on("socket", (_) => {
      let V;
      _.prependListener("end", () => {
        V = _._eventsCount;
      }), _.prependListener("close", (I) => {
        if (w && V < _._eventsCount && !I) {
          const F = new Error("Premature close");
          F.code = "ERR_STREAM_PREMATURE_CLOSE", w.body.emit("error", F);
        }
      });
    }), b.on("response", (_) => {
      b.setTimeout(0);
      const V = el(_.rawHeaders);
      if (Ln(_.statusCode)) {
        const z = V.get("Location");
        let j = null;
        try {
          j = z === null ? null : new URL(z, l2.url);
        } catch {
          if (l2.redirect !== "manual") {
            u(new G(`uri requested responds with an invalid redirect URL: ${z}`, "invalid-redirect")), q();
            return;
          }
        }
        switch (l2.redirect) {
          case "error":
            u(new G(`uri requested responds with a redirect, redirect mode is set to error: ${l2.url}`, "no-redirect")), q();
            return;
          case "manual":
            break;
          case "follow": {
            if (j === null) break;
            if (l2.counter >= l2.follow) {
              u(new G(`maximum redirect reached at: ${l2.url}`, "max-redirect")), q();
              return;
            }
            const U = { headers: new ye(l2.headers), follow: l2.follow, counter: l2.counter + 1, agent: l2.agent, compress: l2.compress, method: l2.method, body: Fn(l2), signal: l2.signal, size: l2.size, referrer: l2.referrer, referrerPolicy: l2.referrerPolicy };
            if (!Ys(l2.url, j) || !Gs(l2.url, j)) for (const Ft of ["authorization", "www-authenticate", "cookie", "cookie2"]) U.headers.delete(Ft);
            if (_.statusCode !== 303 && l2.body && o2.body instanceof me.Readable) {
              u(new G("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), q();
              return;
            }
            (_.statusCode === 303 || (_.statusCode === 301 || _.statusCode === 302) && l2.method === "POST") && (U.method = "GET", U.body = void 0, U.headers.delete("content-length"));
            const D = sl(V);
            D && (U.referrerPolicy = D), a2(Ti(new dt(j, U))), q();
            return;
          }
          default:
            return u(new TypeError(`Redirect option '${l2.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      A2 && _.once("end", () => {
        A2.removeEventListener("abort", T);
      });
      let I = pipeline(_, new PassThrough(), (z) => {
        z && u(z);
      });
      process.version < "v12.10" && _.on("aborted", T);
      const F = { url: l2.url, status: _.statusCode, statusText: _.statusMessage, headers: V, size: l2.size, counter: l2.counter, highWaterMark: l2.highWaterMark }, Q = V.get("Content-Encoding");
      if (!l2.compress || l2.method === "HEAD" || Q === null || _.statusCode === 204 || _.statusCode === 304) {
        w = new le(I, F), a2(w);
        return;
      }
      const ge = { flush: st.Z_SYNC_FLUSH, finishFlush: st.Z_SYNC_FLUSH };
      if (Q === "gzip" || Q === "x-gzip") {
        I = pipeline(I, st.createGunzip(ge), (z) => {
          z && u(z);
        }), w = new le(I, F), a2(w);
        return;
      }
      if (Q === "deflate" || Q === "x-deflate") {
        const z = pipeline(_, new PassThrough(), (j) => {
          j && u(j);
        });
        z.once("data", (j) => {
          (j[0] & 15) === 8 ? I = pipeline(I, st.createInflate(), (U) => {
            U && u(U);
          }) : I = pipeline(I, st.createInflateRaw(), (U) => {
            U && u(U);
          }), w = new le(I, F), a2(w);
        }), z.once("end", () => {
          w || (w = new le(I, F), a2(w));
        });
        return;
      }
      if (Q === "br") {
        I = pipeline(I, st.createBrotliDecompress(), (z) => {
          z && u(z);
        }), w = new le(I, F), a2(w);
        return;
      }
      w = new le(I, F), a2(w);
    }), Xs(b, l2).catch(u);
  });
}
n(Ti, "fetch$1");
function yl(i, o2) {
  const a2 = Buffer$1.from(`0\r
\r
`);
  let u = false, l2 = false, p2;
  i.on("response", (h2) => {
    const { headers: g2 } = h2;
    u = g2["transfer-encoding"] === "chunked" && !g2["content-length"];
  }), i.on("socket", (h2) => {
    const g2 = n(() => {
      if (u && !l2) {
        const w = new Error("Premature close");
        w.code = "ERR_STREAM_PREMATURE_CLOSE", o2(w);
      }
    }, "onSocketClose"), A2 = n((w) => {
      l2 = Buffer$1.compare(w.slice(-5), a2) === 0, !l2 && p2 && (l2 = Buffer$1.compare(p2.slice(-3), a2.slice(0, 3)) === 0 && Buffer$1.compare(w.slice(-2), a2.slice(3)) === 0), p2 = w;
    }, "onData");
    h2.prependListener("close", g2), h2.on("data", A2), i.on("close", () => {
      h2.removeListener("close", g2), h2.removeListener("data", A2);
    });
  });
}
n(yl, "fixResponseChunkedTransferBadEnding");
const Ci = /* @__PURE__ */ new WeakMap(), Dn = /* @__PURE__ */ new WeakMap();
function W$1(i) {
  const o2 = Ci.get(i);
  return console.assert(o2 != null, "'this' is expected an Event object, but got", i), o2;
}
n(W$1, "pd");
function Pi(i) {
  if (i.passiveListener != null) {
    typeof console < "u" && typeof console.error == "function" && console.error("Unable to preventDefault inside passive event listener invocation.", i.passiveListener);
    return;
  }
  i.event.cancelable && (i.canceled = true, typeof i.event.preventDefault == "function" && i.event.preventDefault());
}
n(Pi, "setCancelFlag");
function ht(i, o2) {
  Ci.set(this, { eventTarget: i, event: o2, eventPhase: 2, currentTarget: i, canceled: false, stopped: false, immediateStopped: false, passiveListener: null, timeStamp: o2.timeStamp || Date.now() }), Object.defineProperty(this, "isTrusted", { value: false, enumerable: true });
  const a2 = Object.keys(o2);
  for (let u = 0; u < a2.length; ++u) {
    const l2 = a2[u];
    l2 in this || Object.defineProperty(this, l2, vi(l2));
  }
}
n(ht, "Event"), ht.prototype = { get type() {
  return W$1(this).event.type;
}, get target() {
  return W$1(this).eventTarget;
}, get currentTarget() {
  return W$1(this).currentTarget;
}, composedPath() {
  const i = W$1(this).currentTarget;
  return i == null ? [] : [i];
}, get NONE() {
  return 0;
}, get CAPTURING_PHASE() {
  return 1;
}, get AT_TARGET() {
  return 2;
}, get BUBBLING_PHASE() {
  return 3;
}, get eventPhase() {
  return W$1(this).eventPhase;
}, stopPropagation() {
  const i = W$1(this);
  i.stopped = true, typeof i.event.stopPropagation == "function" && i.event.stopPropagation();
}, stopImmediatePropagation() {
  const i = W$1(this);
  i.stopped = true, i.immediateStopped = true, typeof i.event.stopImmediatePropagation == "function" && i.event.stopImmediatePropagation();
}, get bubbles() {
  return !!W$1(this).event.bubbles;
}, get cancelable() {
  return !!W$1(this).event.cancelable;
}, preventDefault() {
  Pi(W$1(this));
}, get defaultPrevented() {
  return W$1(this).canceled;
}, get composed() {
  return !!W$1(this).event.composed;
}, get timeStamp() {
  return W$1(this).timeStamp;
}, get srcElement() {
  return W$1(this).eventTarget;
}, get cancelBubble() {
  return W$1(this).stopped;
}, set cancelBubble(i) {
  if (!i) return;
  const o2 = W$1(this);
  o2.stopped = true, typeof o2.event.cancelBubble == "boolean" && (o2.event.cancelBubble = true);
}, get returnValue() {
  return !W$1(this).canceled;
}, set returnValue(i) {
  i || Pi(W$1(this));
}, initEvent() {
} }, Object.defineProperty(ht.prototype, "constructor", { value: ht, configurable: true, writable: true });
function vi(i) {
  return { get() {
    return W$1(this).event[i];
  }, set(o2) {
    W$1(this).event[i] = o2;
  }, configurable: true, enumerable: true };
}
n(vi, "defineRedirectDescriptor");
function gl(i) {
  return { value() {
    const o2 = W$1(this).event;
    return o2[i].apply(o2, arguments);
  }, configurable: true, enumerable: true };
}
n(gl, "defineCallDescriptor");
function _l(i, o2) {
  const a2 = Object.keys(o2);
  if (a2.length === 0) return i;
  function u(l2, p2) {
    i.call(this, l2, p2);
  }
  n(u, "CustomEvent"), u.prototype = Object.create(i.prototype, { constructor: { value: u, configurable: true, writable: true } });
  for (let l2 = 0; l2 < a2.length; ++l2) {
    const p2 = a2[l2];
    if (!(p2 in i.prototype)) {
      const g2 = typeof Object.getOwnPropertyDescriptor(o2, p2).value == "function";
      Object.defineProperty(u.prototype, p2, g2 ? gl(p2) : vi(p2));
    }
  }
  return u;
}
n(_l, "defineWrapper");
function Ei(i) {
  if (i == null || i === Object.prototype) return ht;
  let o2 = Dn.get(i);
  return o2 == null && (o2 = _l(Ei(Object.getPrototypeOf(i)), i), Dn.set(i, o2)), o2;
}
n(Ei, "getWrapper");
function Sl(i, o2) {
  const a2 = Ei(Object.getPrototypeOf(o2));
  return new a2(i, o2);
}
n(Sl, "wrapEvent");
function wl(i) {
  return W$1(i).immediateStopped;
}
n(wl, "isStopped");
function Rl(i, o2) {
  W$1(i).eventPhase = o2;
}
n(Rl, "setEventPhase");
function Tl(i, o2) {
  W$1(i).currentTarget = o2;
}
n(Tl, "setCurrentTarget");
function Ai(i, o2) {
  W$1(i).passiveListener = o2;
}
n(Ai, "setPassiveListener");
const Bi = /* @__PURE__ */ new WeakMap(), ki = 1, Wi = 2, wr = 3;
function Rr(i) {
  return i !== null && typeof i == "object";
}
n(Rr, "isObject");
function Bt(i) {
  const o2 = Bi.get(i);
  if (o2 == null) throw new TypeError("'this' is expected an EventTarget object, but got another value.");
  return o2;
}
n(Bt, "getListeners");
function Cl(i) {
  return { get() {
    let a2 = Bt(this).get(i);
    for (; a2 != null; ) {
      if (a2.listenerType === wr) return a2.listener;
      a2 = a2.next;
    }
    return null;
  }, set(o2) {
    typeof o2 != "function" && !Rr(o2) && (o2 = null);
    const a2 = Bt(this);
    let u = null, l2 = a2.get(i);
    for (; l2 != null; ) l2.listenerType === wr ? u !== null ? u.next = l2.next : l2.next !== null ? a2.set(i, l2.next) : a2.delete(i) : u = l2, l2 = l2.next;
    if (o2 !== null) {
      const p2 = { listener: o2, listenerType: wr, passive: false, once: false, next: null };
      u === null ? a2.set(i, p2) : u.next = p2;
    }
  }, configurable: true, enumerable: true };
}
n(Cl, "defineEventAttributeDescriptor");
function qi(i, o2) {
  Object.defineProperty(i, `on${o2}`, Cl(o2));
}
n(qi, "defineEventAttribute");
function Oi(i) {
  function o2() {
    Pe.call(this);
  }
  n(o2, "CustomEventTarget"), o2.prototype = Object.create(Pe.prototype, { constructor: { value: o2, configurable: true, writable: true } });
  for (let a2 = 0; a2 < i.length; ++a2) qi(o2.prototype, i[a2]);
  return o2;
}
n(Oi, "defineCustomEventTarget");
function Pe() {
  if (this instanceof Pe) {
    Bi.set(this, /* @__PURE__ */ new Map());
    return;
  }
  if (arguments.length === 1 && Array.isArray(arguments[0])) return Oi(arguments[0]);
  if (arguments.length > 0) {
    const i = new Array(arguments.length);
    for (let o2 = 0; o2 < arguments.length; ++o2) i[o2] = arguments[o2];
    return Oi(i);
  }
  throw new TypeError("Cannot call a class as a function");
}
n(Pe, "EventTarget"), Pe.prototype = { addEventListener(i, o2, a2) {
  if (o2 == null) return;
  if (typeof o2 != "function" && !Rr(o2)) throw new TypeError("'listener' should be a function or an object.");
  const u = Bt(this), l2 = Rr(a2), h2 = (l2 ? !!a2.capture : !!a2) ? ki : Wi, g2 = { listener: o2, listenerType: h2, passive: l2 && !!a2.passive, once: l2 && !!a2.once, next: null };
  let A2 = u.get(i);
  if (A2 === void 0) {
    u.set(i, g2);
    return;
  }
  let w = null;
  for (; A2 != null; ) {
    if (A2.listener === o2 && A2.listenerType === h2) return;
    w = A2, A2 = A2.next;
  }
  w.next = g2;
}, removeEventListener(i, o2, a2) {
  if (o2 == null) return;
  const u = Bt(this), p2 = (Rr(a2) ? !!a2.capture : !!a2) ? ki : Wi;
  let h2 = null, g2 = u.get(i);
  for (; g2 != null; ) {
    if (g2.listener === o2 && g2.listenerType === p2) {
      h2 !== null ? h2.next = g2.next : g2.next !== null ? u.set(i, g2.next) : u.delete(i);
      return;
    }
    h2 = g2, g2 = g2.next;
  }
}, dispatchEvent(i) {
  if (i == null || typeof i.type != "string") throw new TypeError('"event.type" should be a string.');
  const o2 = Bt(this), a2 = i.type;
  let u = o2.get(a2);
  if (u == null) return true;
  const l2 = Sl(this, i);
  let p2 = null;
  for (; u != null; ) {
    if (u.once ? p2 !== null ? p2.next = u.next : u.next !== null ? o2.set(a2, u.next) : o2.delete(a2) : p2 = u, Ai(l2, u.passive ? u.listener : null), typeof u.listener == "function") try {
      u.listener.call(this, l2);
    } catch (h2) {
      typeof console < "u" && typeof console.error == "function" && console.error(h2);
    }
    else u.listenerType !== wr && typeof u.listener.handleEvent == "function" && u.listener.handleEvent(l2);
    if (wl(l2)) break;
    u = u.next;
  }
  return Ai(l2, null), Rl(l2, 0), Tl(l2, null), !l2.defaultPrevented;
} }, Object.defineProperty(Pe.prototype, "constructor", { value: Pe, configurable: true, writable: true });
const Vn = class Vn2 extends Pe {
  constructor() {
    throw super(), new TypeError("AbortSignal cannot be constructed directly");
  }
  get aborted() {
    const o2 = Tr.get(this);
    if (typeof o2 != "boolean") throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
    return o2;
  }
};
n(Vn, "AbortSignal");
let pt = Vn;
qi(pt.prototype, "abort");
function Pl() {
  const i = Object.create(pt.prototype);
  return Pe.call(i), Tr.set(i, false), i;
}
n(Pl, "createAbortSignal");
function vl(i) {
  Tr.get(i) === false && (Tr.set(i, true), i.dispatchEvent({ type: "abort" }));
}
n(vl, "abortSignal");
const Tr = /* @__PURE__ */ new WeakMap();
Object.defineProperties(pt.prototype, { aborted: { enumerable: true } }), typeof Symbol == "function" && typeof Symbol.toStringTag == "symbol" && Object.defineProperty(pt.prototype, Symbol.toStringTag, { configurable: true, value: "AbortSignal" });
let Mn = (It = class {
  constructor() {
    zi.set(this, Pl());
  }
  get signal() {
    return Ii(this);
  }
  abort() {
    vl(Ii(this));
  }
}, n(It, "AbortController"), It);
const zi = /* @__PURE__ */ new WeakMap();
function Ii(i) {
  const o2 = zi.get(i);
  if (o2 == null) throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${i === null ? "null" : typeof i}`);
  return o2;
}
n(Ii, "getSignal"), Object.defineProperties(Mn.prototype, { signal: { enumerable: true }, abort: { enumerable: true } }), typeof Symbol == "function" && typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Mn.prototype, Symbol.toStringTag, { configurable: true, value: "AbortController" });
var El = Object.defineProperty, Al = n((i, o2) => El(i, "name", { value: o2, configurable: true }), "e");
const Fi = Ti;
ji();
function ji() {
  var _a2, _b2, _c;
  !((_b2 = (_a2 = globalThis.process) == null ? void 0 : _a2.versions) == null ? void 0 : _b2.node) && !((_c = globalThis.process) == null ? void 0 : _c.env.DISABLE_NODE_FETCH_NATIVE_WARN) && console.warn("[node-fetch-native] Node.js compatible build of `node-fetch-native` is being used in a non-Node.js environment. Please make sure you are using proper export conditions or report this issue to https://github.com/unjs/node-fetch-native. You can set `process.env.DISABLE_NODE_FETCH_NATIVE_WARN` to disable this warning.");
}
n(ji, "s"), Al(ji, "checkNodeEnvironment");
var a = Object.defineProperty;
var t = (e, r) => a(e, "name", { value: r, configurable: true });
var f = Object.defineProperty, g = t((e, r) => f(e, "name", { value: r, configurable: true }), "e");
const o = !!((_b = (_a = globalThis.process) == null ? void 0 : _a.env) == null ? void 0 : _b.FORCE_NODE_FETCH);
function l() {
  return !o && globalThis.fetch ? globalThis.fetch : Fi;
}
t(l, "p"), g(l, "_getFetch");
const s = l(), d = !o && globalThis.Headers || ye, A = !o && globalThis.AbortController || Mn;
const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.endsWith('"') && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function parseQuery(parametersString = "") {
  const object = {};
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s2 = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s2.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s2[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s2[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k2) => query[k2] !== void 0).map((k2) => encodeQueryItem(k2, query[k2])).filter(Boolean).join("&");
}
const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s2] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s2.length > 0 ? `?${s2.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s2] = path.split("?");
  return s0 + "/" + (s2.length > 0 ? `?${s2.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  const [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  const { pathname, search, hash: hash2 } = parsePath(
    path.replace(/\/(?=[A-Za-z]:)/, "")
  );
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash: hash2,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash2 = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash: hash2
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash2 = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash2;
}
class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if ((opts == null ? void 0 : opts.cause) && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  var _a2, _b2, _c, _d, _e;
  const errorMessage = ((_a2 = ctx.error) == null ? void 0 : _a2.message) || ((_b2 = ctx.error) == null ? void 0 : _b2.toString()) || "";
  const method = ((_c = ctx.request) == null ? void 0 : _c.method) || ((_d = ctx.options) == null ? void 0 : _d.method) || "GET";
  const url = ((_e = ctx.request) == null ? void 0 : _e.url) || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}
const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t2 = typeof value;
  if (t2 === "string" || t2 === "number" || t2 === "boolean" || t2 === null) {
    return true;
  }
  if (t2 !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function mergeFetchOptions(input, defaults2, Headers2 = globalThis.Headers) {
  const merged = {
    ...defaults2,
    ...input
  };
  if ((defaults2 == null ? void 0 : defaults2.params) && (input == null ? void 0 : input.params)) {
    merged.params = {
      ...defaults2 == null ? void 0 : defaults2.params,
      ...input == null ? void 0 : input.params
    };
  }
  if ((defaults2 == null ? void 0 : defaults2.query) && (input == null ? void 0 : input.query)) {
    merged.query = {
      ...defaults2 == null ? void 0 : defaults2.query,
      ...input == null ? void 0 : input.query
    };
  }
  if ((defaults2 == null ? void 0 : defaults2.headers) && (input == null ? void 0 : input.headers)) {
    merged.headers = new Headers2((defaults2 == null ? void 0 : defaults2.headers) || {});
    for (const [key, value] of new Headers2((input == null ? void 0 : input.headers) || {})) {
      merged.headers.set(key, value);
    }
  }
  return merged;
}
const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  //  Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch: fetch2 = globalThis.fetch,
    Headers: Headers2 = globalThis.Headers,
    AbortController: AbortController2 = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    var _a2;
    const context = {
      request: _request,
      options: mergeFetchOptions(_options, globalOptions.defaults, Headers2),
      response: void 0,
      error: void 0
    };
    context.options.method = (_a2 = context.options.method) == null ? void 0 : _a2.toUpperCase();
    if (context.options.onRequest) {
      await context.options.onRequest(context);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query || context.options.params) {
        context.request = withQuery(context.request, {
          ...context.options.params,
          ...context.options.query
        });
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers2(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController2();
      abortTimeout = setTimeout(
        () => controller.abort(),
        context.options.timeout
      );
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch2(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await context.options.onRequestError(context);
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = context.response.body && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await context.options.onResponse(context);
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await context.options.onResponseError(context);
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch2 = async function $fetch22(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch2.raw = $fetchRaw;
  $fetch2.native = (...args) => fetch2(...args);
  $fetch2.create = (defaultOptions = {}) => createFetch({
    ...globalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch2;
}
function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return s;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new vt.Agent(agentOptions);
  const httpsAgent = new Bs.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return s(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch$1 = globalThis.fetch || createNodeFetch();
const Headers = globalThis.Headers || d;
const AbortController$1 = globalThis.AbortController || A;
const ofetch = createFetch({ fetch: fetch$1, Headers, AbortController: AbortController$1 });
const $fetch$1 = ofetch;
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
const appPageTransition = { "name": "page", "mode": "out-in" };
const appLayoutTransition = false;
const appKeepalive = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "value": null, "errorValue": null, "deep": true };
const appId = "nuxt-app";
function getNuxtAppCtx(appName = appId) {
  return getContext(appName, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _name: appId,
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.12.1";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
      nuxtApp.ssrContext._payloadReducers = {};
      nuxtApp.payload.path = nuxtApp.ssrContext.url;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  var _a2, _b2, _c, _d;
  const resolvedPlugins = [];
  const unresolvedPlugins = [];
  const parallels = [];
  const errors = [];
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    var _a3;
    const unresolvedPluginsForThisPlugin = ((_a3 = plugin2.dependsOn) == null ? void 0 : _a3.filter((name) => plugins2.some((p2) => p2._name === name) && !resolvedPlugins.includes(name))) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.push(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      });
      if (plugin2.parallel) {
        parallels.push(promise.catch((e) => errors.push(e)));
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext) && ((_b2 = plugin2.env) == null ? void 0 : _b2.islands) === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext) && ((_d = plugin2.env) == null ? void 0 : _d.islands) === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (errors.length) {
    throw errors[0];
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._name);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(appName) {
  var _a2;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a2 = getCurrentInstance()) == null ? void 0 : _a2.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || getNuxtAppCtx(appName).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(appName) {
  const nuxtAppInstance = tryUseNuxtApp(appName);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a2;
  return (_a2 = useNuxtApp()) == null ? void 0 : _a2.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : withQuery(to.path || "/", to.query || {}) + (to.hash || "");
  const isExternal = (options == null ? void 0 : options.external) || hasProtocol(toPath, { acceptRelative: true });
  if (isExternal) {
    if (!(options == null ? void 0 : options.external)) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(/"/g, "%22");
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodeURI(location2) }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options == null ? void 0 : options.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value = error2.value || nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
function defineHeadPlugin$1(plugin2) {
  return plugin2;
}
function resolveTitleTemplate(template, title) {
  if (template == null)
    return title || null;
  if (typeof template === "function")
    return template(title);
  return template;
}
function unpackToArray(input, options) {
  const unpacked = [];
  const kFn = options.resolveKeyData || ((ctx) => ctx.key);
  const vFn = options.resolveValueData || ((ctx) => ctx.value);
  for (const [k2, v] of Object.entries(input)) {
    unpacked.push(...(Array.isArray(v) ? v : [v]).map((i) => {
      const ctx = { key: k2, value: i };
      const val = vFn(ctx);
      if (typeof val === "object")
        return unpackToArray(val, options);
      if (Array.isArray(val))
        return val;
      return {
        [typeof options.key === "function" ? options.key(ctx) : options.key]: kFn(ctx),
        [typeof options.value === "function" ? options.value(ctx) : options.value]: val
      };
    }).flat());
  }
  return unpacked;
}
function unpackToString(value, options) {
  return Object.entries(value).map(([key, value2]) => {
    if (typeof value2 === "object")
      value2 = unpackToString(value2, options);
    if (options.resolve) {
      const resolved = options.resolve({ key, value: value2 });
      if (typeof resolved !== "undefined")
        return resolved;
    }
    if (typeof value2 === "number")
      value2 = value2.toString();
    if (typeof value2 === "string" && options.wrapValue) {
      value2 = value2.replace(new RegExp(options.wrapValue, "g"), `\\${options.wrapValue}`);
      value2 = `${options.wrapValue}${value2}${options.wrapValue}`;
    }
    return `${key}${options.keyValueSeparator || ""}${value2}`;
  }).join(options.entrySeparator || "");
}
const p = (p2) => ({ keyValue: p2, metaKey: "property" });
const k = (p2) => ({ keyValue: p2 });
const MetaPackingSchema = {
  appleItunesApp: {
    unpack: {
      entrySeparator: ", ",
      resolve({ key, value }) {
        return `${fixKeyCase(key)}=${value}`;
      }
    }
  },
  articleExpirationTime: p("article:expiration_time"),
  articleModifiedTime: p("article:modified_time"),
  articlePublishedTime: p("article:published_time"),
  bookReleaseDate: p("book:release_date"),
  charset: {
    metaKey: "charset"
  },
  contentSecurityPolicy: {
    unpack: {
      entrySeparator: "; ",
      resolve({ key, value }) {
        return `${fixKeyCase(key)} ${value}`;
      }
    },
    metaKey: "http-equiv"
  },
  contentType: {
    metaKey: "http-equiv"
  },
  defaultStyle: {
    metaKey: "http-equiv"
  },
  fbAppId: p("fb:app_id"),
  msapplicationConfig: k("msapplication-Config"),
  msapplicationTileColor: k("msapplication-TileColor"),
  msapplicationTileImage: k("msapplication-TileImage"),
  ogAudioSecureUrl: p("og:audio:secure_url"),
  ogAudioUrl: p("og:audio"),
  ogImageSecureUrl: p("og:image:secure_url"),
  ogImageUrl: p("og:image"),
  ogSiteName: p("og:site_name"),
  ogVideoSecureUrl: p("og:video:secure_url"),
  ogVideoUrl: p("og:video"),
  profileFirstName: p("profile:first_name"),
  profileLastName: p("profile:last_name"),
  profileUsername: p("profile:username"),
  refresh: {
    metaKey: "http-equiv",
    unpack: {
      entrySeparator: ";",
      resolve({ key, value }) {
        if (key === "seconds")
          return `${value}`;
      }
    }
  },
  robots: {
    unpack: {
      entrySeparator: ", ",
      resolve({ key, value }) {
        if (typeof value === "boolean")
          return `${fixKeyCase(key)}`;
        else
          return `${fixKeyCase(key)}:${value}`;
      }
    }
  },
  xUaCompatible: {
    metaKey: "http-equiv"
  }
};
const openGraphNamespaces = [
  "og",
  "book",
  "article",
  "profile"
];
function resolveMetaKeyType(key) {
  var _a2;
  const fKey = fixKeyCase(key).split(":")[0];
  if (openGraphNamespaces.includes(fKey))
    return "property";
  return ((_a2 = MetaPackingSchema[key]) == null ? void 0 : _a2.metaKey) || "name";
}
function resolveMetaKeyValue(key) {
  var _a2;
  return ((_a2 = MetaPackingSchema[key]) == null ? void 0 : _a2.keyValue) || fixKeyCase(key);
}
function fixKeyCase(key) {
  const updated = key.replace(/([A-Z])/g, "-$1").toLowerCase();
  const fKey = updated.split("-")[0];
  if (openGraphNamespaces.includes(fKey) || fKey === "twitter")
    return key.replace(/([A-Z])/g, ":$1").toLowerCase();
  return updated;
}
function changeKeyCasingDeep(input) {
  if (Array.isArray(input)) {
    return input.map((entry2) => changeKeyCasingDeep(entry2));
  }
  if (typeof input !== "object" || Array.isArray(input))
    return input;
  const output = {};
  for (const [key, value] of Object.entries(input))
    output[fixKeyCase(key)] = changeKeyCasingDeep(value);
  return output;
}
function resolvePackedMetaObjectValue(value, key) {
  const definition = MetaPackingSchema[key];
  if (key === "refresh")
    return `${value.seconds};url=${value.url}`;
  return unpackToString(
    changeKeyCasingDeep(value),
    {
      keyValueSeparator: "=",
      entrySeparator: ", ",
      resolve({ value: value2, key: key2 }) {
        if (value2 === null)
          return "";
        if (typeof value2 === "boolean")
          return `${key2}`;
      },
      ...definition == null ? void 0 : definition.unpack
    }
  );
}
const ObjectArrayEntries = ["og:image", "og:video", "og:audio", "twitter:image"];
function sanitize(input) {
  const out = {};
  Object.entries(input).forEach(([k2, v]) => {
    if (String(v) !== "false" && k2)
      out[k2] = v;
  });
  return out;
}
function handleObjectEntry(key, v) {
  const value = sanitize(v);
  const fKey = fixKeyCase(key);
  const attr = resolveMetaKeyType(fKey);
  if (ObjectArrayEntries.includes(fKey)) {
    const input = {};
    Object.entries(value).forEach(([k2, v2]) => {
      input[`${key}${k2 === "url" ? "" : `${k2.charAt(0).toUpperCase()}${k2.slice(1)}`}`] = v2;
    });
    return unpackMeta(input).sort((a2, b) => {
      var _a2, _b2;
      return (((_a2 = a2[attr]) == null ? void 0 : _a2.length) || 0) - (((_b2 = b[attr]) == null ? void 0 : _b2.length) || 0);
    });
  }
  return [{ [attr]: fKey, ...value }];
}
function unpackMeta(input) {
  const extras = [];
  const primitives = {};
  Object.entries(input).forEach(([key, value]) => {
    if (!Array.isArray(value)) {
      if (typeof value === "object" && value) {
        if (ObjectArrayEntries.includes(fixKeyCase(key))) {
          extras.push(...handleObjectEntry(key, value));
          return;
        }
        primitives[key] = sanitize(value);
      } else {
        primitives[key] = value;
      }
      return;
    }
    value.forEach((v) => {
      extras.push(...typeof v === "string" ? unpackMeta({ [key]: v }) : handleObjectEntry(key, v));
    });
  });
  const meta = unpackToArray(primitives, {
    key({ key }) {
      return resolveMetaKeyType(key);
    },
    value({ key }) {
      return key === "charset" ? "charset" : "content";
    },
    resolveKeyData({ key }) {
      return resolveMetaKeyValue(key);
    },
    resolveValueData({ value, key }) {
      if (value === null)
        return "_null";
      if (typeof value === "object")
        return resolvePackedMetaObjectValue(value, key);
      return typeof value === "number" ? value.toString() : value;
    }
  });
  return [...extras, ...meta].map((m) => {
    if (m.content === "_null")
      m.content = null;
    return m;
  });
}
version.startsWith("3");
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root = resolveUnref(ref2);
  if (!ref2 || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r, lastKey));
  if (typeof root === "object") {
    return Object.fromEntries(
      Object.entries(root).map(([k2, v]) => {
        if (k2 === "titleTemplate" || k2.startsWith("on"))
          return [k2, unref(v)];
        return [k2, resolveUnrefHeadInput(v, k2)];
      })
    );
  }
  return root;
}
const headSymbol = "usehead";
const _global = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey$1 = "__unhead_injection_handler__";
function setHeadInjectionHandler(handler) {
  _global[globalKey$1] = handler;
}
function injectHead() {
  if (globalKey$1 in _global) {
    return _global[globalKey$1]();
  }
  const head = inject(headSymbol);
  if (!head && "production" !== "production")
    console.warn("Unhead is missing Vue context, falling back to shared context. This may have unexpected results.");
  return head || getActiveHead();
}
function useHead(input, options = {}) {
  const head = options.head || injectHead();
  if (head) {
    if (!head.ssr)
      return clientUseHead(head, input, options);
    return head.push(input, options);
  }
}
function clientUseHead(head, input, options = {}) {
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e) => {
    entry2.patch(e);
  });
  getCurrentInstance();
  return entry2;
}
function useSeoMeta(input, options) {
  const { title, titleTemplate, ...meta } = input;
  return useHead({
    title,
    titleTemplate,
    // @ts-expect-error runtime type
    _flatMeta: meta
  }, {
    ...options,
    transform(t2) {
      const meta2 = unpackMeta({ ...t2._flatMeta });
      delete t2._flatMeta;
      return {
        // @ts-expect-error runtime type
        ...t2,
        meta: meta2
      };
    }
  });
}
function useServerHead(input, options = {}) {
  const head = options.head || injectHead();
  delete options.head;
  if (head)
    return head.push(input, { ...options, mode: "server" });
}
[CapoPlugin({ track: true })];
const unhead_U5AvFftZjU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    setHeadInjectionHandler(
      // need a fresh instance of the nuxt app to avoid parallel requests interfering with each other
      () => useNuxtApp().vueApp._context.provides.usehead
    );
    nuxtApp.vueApp.use(head);
  }
});
function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als && currentInstance === void 0) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
_globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a2;
    return ((_a2 = route.params[r.slice(1)]) == null ? void 0 : _a2.toString()) || "";
  });
};
const generateRouteKey$1 = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a2;
    return ((_a2 = m.components) == null ? void 0 : _a2.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function isPlainObject$1(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}
function _defu$1(baseObject, defaults2, namespace = ".", merger) {
  if (!isPlainObject$1(defaults2)) {
    return _defu$1(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults2);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject$1(value) && isPlainObject$1(object[key])) {
      object[key] = _defu$1(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu$1(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p2, c) => _defu$1(p2, c, "", merger), {})
  );
}
const defu = createDefu$1();
const defuFn = createDefu$1((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});
async function getRouteRules(url) {
  {
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(url).reverse());
  }
}
const _routes = [
  {
    name: "blog",
    path: "/blog",
    component: () => import('./blog-AplAHwVQ.mjs').then((m) => m.default || m)
  },
  {
    name: "index",
    path: "/",
    component: () => import('./index-CLjFsa3T.mjs').then((m) => m.default || m)
  },
  {
    name: "now",
    path: "/now",
    component: () => import('./now-DPkrwT2w.mjs').then((m) => m.default || m)
  }
];
const _wrapIf = (component, props, slots) => {
  props = props === true ? {} : props;
  return { default: () => {
    var _a2;
    return props ? h(component, props, slots) : (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
  } };
};
function generateRouteKey(route) {
  const source = (route == null ? void 0 : route.meta.key) ?? route.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a2;
    return ((_a2 = route.params[r.slice(1)]) == null ? void 0 : _a2.toString()) || "";
  });
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index2) => {
      var _a2, _b2;
      return comp.components && comp.components.default === ((_b2 = (_a2 = from.matched[index2]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default);
    }
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    var _a2;
    const nuxtApp = useNuxtApp();
    const behavior = ((_a2 = useRouter().options) == null ? void 0 : _a2.scrollBehaviorType) ?? "auto";
    let position = savedPosition || void 0;
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (!position && from && to && routeAllowsScrollToTop !== false && isChangingPage(to, from)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
      }
      return false;
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await new Promise((resolve2) => setTimeout(resolve2, 0));
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return Number.parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a2;
  let __temp, __restore;
  if (!((_a2 = to.meta) == null ? void 0 : _a2.validate)) {
    return;
  }
  useNuxtApp();
  useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  {
    return result;
  }
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a2, _b2, _c, _d;
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    if (routerOptions.hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = ((_a2 = routerOptions.history) == null ? void 0 : _a2.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = ((_b2 = routerOptions.routes) == null ? void 0 : _b2.call(routerOptions, _routes)) ?? _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a3, _b3, _c2, _d2;
      if (((_b3 = (_a3 = to.matched[0]) == null ? void 0 : _a3.components) == null ? void 0 : _b3.default) === ((_d2 = (_c2 = from.matched[0]) == null ? void 0 : _c2.components) == null ? void 0 : _d2.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key]
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    if (!((_c = nuxtApp.ssrContext) == null ? void 0 : _c.islandContext)) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if ((failure == null ? void 0 : failure.type) === 4) {
          return;
        }
        if (to.matched.length === 0) {
          await nuxtApp.runWithContext(() => showError(createError$1({
            statusCode: 404,
            fatal: false,
            statusMessage: `Page not found: ${to.fullPath}`,
            data: {
              path: to.fullPath
            }
          })));
        } else if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if ((_d = nuxtApp.ssrContext) == null ? void 0 : _d.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      var _a3, _b3;
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a3 = nuxtApp.ssrContext) == null ? void 0 : _a3.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules(to.path));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b3 = namedMiddleware[entry2]) == null ? void 0 : _b3.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          const result = await nuxtApp.runWithContext(() => middleware(to, from));
          {
            if (result === false || result instanceof Error) {
              const error2 = result || createError$1({
                statusCode: 404,
                statusMessage: `Page Not Found: ${initialURL}`
              });
              await nuxtApp.runWithContext(() => showError(error2));
              return false;
            }
          }
          if (result === true) {
            continue;
          }
          if (result || result === false) {
            return result;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a2;
  return (_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.event;
}
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const _0_siteConfig_mHGp1pr5of = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-site-config:init",
  enforce: "pre",
  async setup(nuxtApp) {
    const state = useState("site-config");
    {
      const { context } = useRequestEvent();
      nuxtApp.hooks.hook("app:rendered", () => {
        state.value = context.siteConfig.get({
          debug: (/* @__PURE__ */ useRuntimeConfig())["nuxt-site-config"].debug,
          resolveRefs: true
        });
      });
    }
    let stack = {};
    return {
      provide: {
        nuxtSiteConfig: stack
      }
    };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = {
  NuxtError: (data) => isNuxtError(data) && data.toJSON(),
  EmptyShallowRef: (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  EmptyRef: (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ShallowRef: (data) => isRef(data) && isShallow(data) && data.value,
  ShallowReactive: (data) => isReactive(data) && isShallow(data) && toRaw(data),
  Ref: (data) => isRef(data) && data.value,
  Reactive: (data) => isReactive(data) && toRaw(data)
};
{
  reducers.Island = (data) => data && (data == null ? void 0 : data.__nuxt_island);
}
const revive_payload_server_TQclto8luf = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const reducer in reducers) {
      definePayloadReducer(reducer, reducers[reducer]);
    }
  }
});
const LazyIcon = defineAsyncComponent(() => Promise.resolve().then(function() {
  return index;
}).then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["Icon", LazyIcon]
];
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
const preference = "system";
const componentName = "ColorScheme";
const plugin_server_UjgSp5LyFq = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  var _a2;
  const colorMode = ((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext) ? ref({}) : useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
function klona(x) {
  if (typeof x !== "object") return x;
  var k2, tmp, str = Object.prototype.toString.call(x);
  if (str === "[object Object]") {
    if (x.constructor !== Object && typeof x.constructor === "function") {
      tmp = new x.constructor();
      for (k2 in x) {
        if (x.hasOwnProperty(k2) && tmp[k2] !== x[k2]) {
          tmp[k2] = klona(x[k2]);
        }
      }
    } else {
      tmp = {};
      for (k2 in x) {
        if (k2 === "__proto__") {
          Object.defineProperty(tmp, k2, {
            value: klona(x[k2]),
            configurable: true,
            enumerable: true,
            writable: true
          });
        } else {
          tmp[k2] = klona(x[k2]);
        }
      }
    }
    return tmp;
  }
  if (str === "[object Array]") {
    k2 = x.length;
    for (tmp = Array(k2); k2--; ) {
      tmp[k2] = klona(x[k2]);
    }
    return tmp;
  }
  if (str === "[object Set]") {
    tmp = /* @__PURE__ */ new Set();
    x.forEach(function(val) {
      tmp.add(klona(val));
    });
    return tmp;
  }
  if (str === "[object Map]") {
    tmp = /* @__PURE__ */ new Map();
    x.forEach(function(val, key) {
      tmp.set(klona(key), klona(val));
    });
    return tmp;
  }
  if (str === "[object Date]") {
    return /* @__PURE__ */ new Date(+x);
  }
  if (str === "[object RegExp]") {
    tmp = new RegExp(x.source, x.flags);
    tmp.lastIndex = x.lastIndex;
    return tmp;
  }
  if (str === "[object DataView]") {
    return new x.constructor(klona(x.buffer));
  }
  if (str === "[object ArrayBuffer]") {
    return x.slice(0);
  }
  if (str.slice(-6) === "Array]") {
    return new x.constructor(x);
  }
  return x;
}
const inlineConfig = {
  "nuxt": {},
  "icon": {
    "provider": "server",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "dashicons",
      "devicon",
      "devicon-plain",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fad",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "logos",
      "ls",
      "lucide",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "pixelarticons",
      "prime",
      "ps",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "si-glyph",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "streamline",
      "streamline-emojis",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ]
  }
};
const __appConfig = /* @__PURE__ */ defuFn(inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  if (!nuxtApp._appConfig) {
    nuxtApp._appConfig = klona(__appConfig);
  }
  return nuxtApp._appConfig;
}
const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const stringToIcon = (value, validate2, allowSimpleName, provider = "") => {
  const colonSeparated = value.split(":");
  if (value.slice(0, 1) === "@") {
    if (colonSeparated.length < 2 || colonSeparated.length > 3) {
      return null;
    }
    provider = colonSeparated.shift().slice(1);
  }
  if (colonSeparated.length > 3 || !colonSeparated.length) {
    return null;
  }
  if (colonSeparated.length > 1) {
    const name2 = colonSeparated.pop();
    const prefix = colonSeparated.pop();
    const result = {
      // Allow provider without '@': "provider:prefix:name"
      provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
      prefix,
      name: name2
    };
    return validate2 && !validateIconName(result) ? null : result;
  }
  const name = colonSeparated[0];
  const dashSeparated = name.split("-");
  if (dashSeparated.length > 1) {
    const result = {
      provider,
      prefix: dashSeparated.shift(),
      name: dashSeparated.join("-")
    };
    return validate2 && !validateIconName(result) ? null : result;
  }
  if (allowSimpleName && provider === "") {
    const result = {
      provider,
      prefix: "",
      name
    };
    return validate2 && !validateIconName(result, allowSimpleName) ? null : result;
  }
  return null;
};
const validateIconName = (icon, allowSimpleName) => {
  if (!icon) {
    return false;
  }
  return !!((icon.provider === "" || icon.provider.match(matchIconName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchIconName)) && icon.name.match(matchIconName));
};
const defaultIconDimensions$1 = Object.freeze(
  {
    left: 0,
    top: 0,
    width: 16,
    height: 16
  }
);
const defaultIconTransformations$1 = Object.freeze({
  rotate: 0,
  vFlip: false,
  hFlip: false
});
const defaultIconProps$1 = Object.freeze({
  ...defaultIconDimensions$1,
  ...defaultIconTransformations$1
});
const defaultExtendedIconProps = Object.freeze({
  ...defaultIconProps$1,
  body: "",
  hidden: false
});
function mergeIconTransformations(obj1, obj2) {
  const result = {};
  if (!obj1.hFlip !== !obj2.hFlip) {
    result.hFlip = true;
  }
  if (!obj1.vFlip !== !obj2.vFlip) {
    result.vFlip = true;
  }
  const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
  if (rotate) {
    result.rotate = rotate;
  }
  return result;
}
function mergeIconData(parent, child) {
  const result = mergeIconTransformations(parent, child);
  for (const key in defaultExtendedIconProps) {
    if (key in defaultIconTransformations$1) {
      if (key in parent && !(key in result)) {
        result[key] = defaultIconTransformations$1[key];
      }
    } else if (key in child) {
      result[key] = child[key];
    } else if (key in parent) {
      result[key] = parent[key];
    }
  }
  return result;
}
function getIconsTree(data, names) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  const resolved = /* @__PURE__ */ Object.create(null);
  function resolve(name) {
    if (icons[name]) {
      return resolved[name] = [];
    }
    if (!(name in resolved)) {
      resolved[name] = null;
      const parent = aliases[name] && aliases[name].parent;
      const value = parent && resolve(parent);
      if (value) {
        resolved[name] = [parent].concat(value);
      }
    }
    return resolved[name];
  }
  Object.keys(icons).concat(Object.keys(aliases)).forEach(resolve);
  return resolved;
}
function internalGetIconData(data, name, tree) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  let currentProps = {};
  function parse(name2) {
    currentProps = mergeIconData(
      icons[name2] || aliases[name2],
      currentProps
    );
  }
  parse(name);
  tree.forEach(parse);
  return mergeIconData(data, currentProps);
}
function parseIconSet(data, callback) {
  const names = [];
  if (typeof data !== "object" || typeof data.icons !== "object") {
    return names;
  }
  if (data.not_found instanceof Array) {
    data.not_found.forEach((name) => {
      callback(name, null);
      names.push(name);
    });
  }
  const tree = getIconsTree(data);
  for (const name in tree) {
    const item = tree[name];
    if (item) {
      callback(name, internalGetIconData(data, name, item));
      names.push(name);
    }
  }
  return names;
}
const optionalPropertyDefaults = {
  provider: "",
  aliases: {},
  not_found: {},
  ...defaultIconDimensions$1
};
function checkOptionalProps(item, defaults2) {
  for (const prop in defaults2) {
    if (prop in item && typeof item[prop] !== typeof defaults2[prop]) {
      return false;
    }
  }
  return true;
}
function quicklyValidateIconSet(obj) {
  if (typeof obj !== "object" || obj === null) {
    return null;
  }
  const data = obj;
  if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
    return null;
  }
  if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
    return null;
  }
  const icons = data.icons;
  for (const name in icons) {
    const icon = icons[name];
    if (!name.match(matchIconName) || typeof icon.body !== "string" || !checkOptionalProps(
      icon,
      defaultExtendedIconProps
    )) {
      return null;
    }
  }
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  for (const name in aliases) {
    const icon = aliases[name];
    const parent = icon.parent;
    if (!name.match(matchIconName) || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(
      icon,
      defaultExtendedIconProps
    )) {
      return null;
    }
  }
  return data;
}
const dataStorage = /* @__PURE__ */ Object.create(null);
function newStorage(provider, prefix) {
  return {
    provider,
    prefix,
    icons: /* @__PURE__ */ Object.create(null),
    missing: /* @__PURE__ */ new Set()
  };
}
function getStorage(provider, prefix) {
  const providerStorage = dataStorage[provider] || (dataStorage[provider] = /* @__PURE__ */ Object.create(null));
  return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
}
function addIconSet(storage2, data) {
  if (!quicklyValidateIconSet(data)) {
    return [];
  }
  return parseIconSet(data, (name, icon) => {
    if (icon) {
      storage2.icons[name] = icon;
    } else {
      storage2.missing.add(name);
    }
  });
}
let simpleNames = false;
function allowSimpleNames(allow) {
  if (typeof allow === "boolean") {
    simpleNames = allow;
  }
  return simpleNames;
}
function getIconData(name) {
  const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
  if (icon) {
    const storage2 = getStorage(icon.provider, icon.prefix);
    const iconName = icon.name;
    return storage2.icons[iconName] || (storage2.missing.has(iconName) ? null : void 0);
  }
}
function getIcon(name) {
  const result = getIconData(name);
  return result ? {
    ...defaultIconProps$1,
    ...result
  } : null;
}
const defaultIconSizeCustomisations = Object.freeze({
  width: null,
  height: null
});
const defaultIconCustomisations = Object.freeze({
  // Dimensions
  ...defaultIconSizeCustomisations,
  // Transformations
  ...defaultIconTransformations$1
});
const unitsSplit$1 = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest$1 = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize$1(size, ratio, precision) {
  if (ratio === 1) {
    return size;
  }
  precision = precision || 100;
  if (typeof size === "number") {
    return Math.ceil(size * ratio * precision) / precision;
  }
  if (typeof size !== "string") {
    return size;
  }
  const oldParts = size.split(unitsSplit$1);
  if (oldParts === null || !oldParts.length) {
    return size;
  }
  const newParts = [];
  let code = oldParts.shift();
  let isNumber = unitsTest$1.test(code);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code);
      if (isNaN(num)) {
        newParts.push(code);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code);
    }
    code = oldParts.shift();
    if (code === void 0) {
      return newParts.join("");
    }
    isNumber = !isNumber;
  }
}
function splitSVGDefs(content, tag = "defs") {
  let defs = "";
  const index2 = content.indexOf("<" + tag);
  while (index2 >= 0) {
    const start = content.indexOf(">", index2);
    const end = content.indexOf("</" + tag);
    if (start === -1 || end === -1) {
      break;
    }
    const endEnd = content.indexOf(">", end);
    if (endEnd === -1) {
      break;
    }
    defs += content.slice(start + 1, end).trim();
    content = content.slice(0, index2).trim() + content.slice(endEnd + 1);
  }
  return {
    defs,
    content
  };
}
function mergeDefsAndContent(defs, content) {
  return defs ? "<defs>" + defs + "</defs>" + content : content;
}
function wrapSVGContent(body, start, end) {
  const split = splitSVGDefs(body);
  return mergeDefsAndContent(split.defs, start + split.content + end);
}
const isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
function iconToSVG(icon, customisations) {
  const fullIcon = {
    ...defaultIconProps$1,
    ...icon
  };
  const fullCustomisations = {
    ...defaultIconCustomisations,
    ...customisations
  };
  const box = {
    left: fullIcon.left,
    top: fullIcon.top,
    width: fullIcon.width,
    height: fullIcon.height
  };
  let body = fullIcon.body;
  [fullIcon, fullCustomisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push(
          "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
        );
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push(
        "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
      );
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) {
      rotation -= Math.floor(rotation / 4) * 4;
    }
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift(
          "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
      case 2:
        transformations.unshift(
          "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
        );
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift(
          "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== box.top) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) {
      body = wrapSVGContent(
        body,
        '<g transform="' + transformations.join(" ") + '">',
        "</g>"
      );
    }
  });
  const customisationsWidth = fullCustomisations.width;
  const customisationsHeight = fullCustomisations.height;
  const boxWidth = box.width;
  const boxHeight = box.height;
  let width;
  let height;
  if (customisationsWidth === null) {
    height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    width = calculateSize$1(height, boxWidth / boxHeight);
  } else {
    width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
    height = customisationsHeight === null ? calculateSize$1(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
  }
  const attributes = {};
  const setAttr = (prop, value) => {
    if (!isUnsetKeyword(value)) {
      attributes[prop] = value.toString();
    }
  };
  setAttr("width", width);
  setAttr("height", height);
  const viewBox = [box.left, box.top, boxWidth, boxHeight];
  attributes.viewBox = viewBox.join(" ");
  return {
    attributes,
    viewBox,
    body
  };
}
const regex = /\sid="(\S+)"/g;
const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
let counter = 0;
function replaceIDs(body, prefix = randomPrefix) {
  const ids = [];
  let match;
  while (match = regex.exec(body)) {
    ids.push(match[1]);
  }
  if (!ids.length) {
    return body;
  }
  const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
  ids.forEach((id) => {
    const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
    const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(
      // Allowed characters before id: [#;"]
      // Allowed characters after id: [)"], .[a-z]
      new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"),
      "$1" + newID + suffix + "$3"
    );
  });
  body = body.replace(new RegExp(suffix, "g"), "");
  return body;
}
const storage = /* @__PURE__ */ Object.create(null);
function setAPIModule(provider, item) {
  storage[provider] = item;
}
function getAPIModule(provider) {
  return storage[provider] || storage[""];
}
function createAPIConfig(source) {
  let resources;
  if (typeof source.resources === "string") {
    resources = [source.resources];
  } else {
    resources = source.resources;
    if (!(resources instanceof Array) || !resources.length) {
      return null;
    }
  }
  const result = {
    // API hosts
    resources,
    // Root path
    path: source.path || "/",
    // URL length limit
    maxURL: source.maxURL || 500,
    // Timeout before next host is used.
    rotate: source.rotate || 750,
    // Timeout before failing query.
    timeout: source.timeout || 5e3,
    // Randomise default API end point.
    random: source.random === true,
    // Start index
    index: source.index || 0,
    // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
    dataAfterTimeout: source.dataAfterTimeout !== false
  };
  return result;
}
const configStorage = /* @__PURE__ */ Object.create(null);
const fallBackAPISources = [
  "https://api.simplesvg.com",
  "https://api.unisvg.com"
];
const fallBackAPI = [];
while (fallBackAPISources.length > 0) {
  if (fallBackAPISources.length === 1) {
    fallBackAPI.push(fallBackAPISources.shift());
  } else {
    if (Math.random() > 0.5) {
      fallBackAPI.push(fallBackAPISources.shift());
    } else {
      fallBackAPI.push(fallBackAPISources.pop());
    }
  }
}
configStorage[""] = createAPIConfig({
  resources: ["https://api.iconify.design"].concat(fallBackAPI)
});
function addAPIProvider(provider, customConfig) {
  const config = createAPIConfig(customConfig);
  if (config === null) {
    return false;
  }
  configStorage[provider] = config;
  return true;
}
function getAPIConfig(provider) {
  return configStorage[provider];
}
function listAPIProviders() {
  return Object.keys(configStorage);
}
const detectFetch = () => {
  let callback;
  try {
    callback = fetch;
    if (typeof callback === "function") {
      return callback;
    }
  } catch (err) {
  }
};
let fetchModule = detectFetch();
function setFetch(fetch2) {
  fetchModule = fetch2;
}
function getFetch() {
  return fetchModule;
}
function calculateMaxLength(provider, prefix) {
  const config = getAPIConfig(provider);
  if (!config) {
    return 0;
  }
  let result;
  if (!config.maxURL) {
    result = 0;
  } else {
    let maxHostLength = 0;
    config.resources.forEach((item) => {
      const host = item;
      maxHostLength = Math.max(maxHostLength, host.length);
    });
    const url = prefix + ".json?icons=";
    result = config.maxURL - maxHostLength - config.path.length - url.length;
  }
  return result;
}
function shouldAbort(status) {
  return status === 404;
}
const prepare = (provider, prefix, icons) => {
  const results = [];
  const maxLength = calculateMaxLength(provider, prefix);
  const type = "icons";
  let item = {
    type,
    provider,
    prefix,
    icons: []
  };
  let length = 0;
  icons.forEach((name, index2) => {
    length += name.length + 1;
    if (length >= maxLength && index2 > 0) {
      results.push(item);
      item = {
        type,
        provider,
        prefix,
        icons: []
      };
      length = name.length;
    }
    item.icons.push(name);
  });
  results.push(item);
  return results;
};
function getPath(provider) {
  if (typeof provider === "string") {
    const config = getAPIConfig(provider);
    if (config) {
      return config.path;
    }
  }
  return "/";
}
const send = (host, params, callback) => {
  if (!fetchModule) {
    callback("abort", 424);
    return;
  }
  let path = getPath(params.provider);
  switch (params.type) {
    case "icons": {
      const prefix = params.prefix;
      const icons = params.icons;
      const iconsList = icons.join(",");
      const urlParams = new URLSearchParams({
        icons: iconsList
      });
      path += prefix + ".json?" + urlParams.toString();
      break;
    }
    case "custom": {
      const uri = params.uri;
      path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
      break;
    }
    default:
      callback("abort", 400);
      return;
  }
  let defaultError = 503;
  fetchModule(host + path).then((response) => {
    const status = response.status;
    if (status !== 200) {
      setTimeout(() => {
        callback(shouldAbort(status) ? "abort" : "next", status);
      });
      return;
    }
    defaultError = 501;
    return response.json();
  }).then((data) => {
    if (typeof data !== "object" || data === null) {
      setTimeout(() => {
        if (data === 404) {
          callback("abort", data);
        } else {
          callback("next", defaultError);
        }
      });
      return;
    }
    setTimeout(() => {
      callback("success", data);
    });
  }).catch(() => {
    callback("next", defaultError);
  });
};
const fetchAPIModule = {
  prepare,
  send
};
function sortIcons(icons) {
  const result = {
    loaded: [],
    missing: [],
    pending: []
  };
  const storage2 = /* @__PURE__ */ Object.create(null);
  icons.sort((a2, b) => {
    if (a2.provider !== b.provider) {
      return a2.provider.localeCompare(b.provider);
    }
    if (a2.prefix !== b.prefix) {
      return a2.prefix.localeCompare(b.prefix);
    }
    return a2.name.localeCompare(b.name);
  });
  let lastIcon = {
    provider: "",
    prefix: "",
    name: ""
  };
  icons.forEach((icon) => {
    if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
      return;
    }
    lastIcon = icon;
    const provider = icon.provider;
    const prefix = icon.prefix;
    const name = icon.name;
    const providerStorage = storage2[provider] || (storage2[provider] = /* @__PURE__ */ Object.create(null));
    const localStorage = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider, prefix));
    let list;
    if (name in localStorage.icons) {
      list = result.loaded;
    } else if (prefix === "" || localStorage.missing.has(name)) {
      list = result.missing;
    } else {
      list = result.pending;
    }
    const item = {
      provider,
      prefix,
      name
    };
    list.push(item);
  });
  return result;
}
function removeCallback(storages, id) {
  storages.forEach((storage2) => {
    const items = storage2.loaderCallbacks;
    if (items) {
      storage2.loaderCallbacks = items.filter((row) => row.id !== id);
    }
  });
}
function updateCallbacks(storage2) {
  if (!storage2.pendingCallbacksFlag) {
    storage2.pendingCallbacksFlag = true;
    setTimeout(() => {
      storage2.pendingCallbacksFlag = false;
      const items = storage2.loaderCallbacks ? storage2.loaderCallbacks.slice(0) : [];
      if (!items.length) {
        return;
      }
      let hasPending = false;
      const provider = storage2.provider;
      const prefix = storage2.prefix;
      items.forEach((item) => {
        const icons = item.icons;
        const oldLength = icons.pending.length;
        icons.pending = icons.pending.filter((icon) => {
          if (icon.prefix !== prefix) {
            return true;
          }
          const name = icon.name;
          if (storage2.icons[name]) {
            icons.loaded.push({
              provider,
              prefix,
              name
            });
          } else if (storage2.missing.has(name)) {
            icons.missing.push({
              provider,
              prefix,
              name
            });
          } else {
            hasPending = true;
            return true;
          }
          return false;
        });
        if (icons.pending.length !== oldLength) {
          if (!hasPending) {
            removeCallback([storage2], item.id);
          }
          item.callback(
            icons.loaded.slice(0),
            icons.missing.slice(0),
            icons.pending.slice(0),
            item.abort
          );
        }
      });
    });
  }
}
let idCounter = 0;
function storeCallback(callback, icons, pendingSources) {
  const id = idCounter++;
  const abort = removeCallback.bind(null, pendingSources, id);
  if (!icons.pending.length) {
    return abort;
  }
  const item = {
    id,
    icons,
    callback,
    abort
  };
  pendingSources.forEach((storage2) => {
    (storage2.loaderCallbacks || (storage2.loaderCallbacks = [])).push(item);
  });
  return abort;
}
function listToIcons(list, validate2 = true, simpleNames2 = false) {
  const result = [];
  list.forEach((item) => {
    const icon = typeof item === "string" ? stringToIcon(item, validate2, simpleNames2) : item;
    if (icon) {
      result.push(icon);
    }
  });
  return result;
}
var defaultConfig = {
  resources: [],
  index: 0,
  timeout: 2e3,
  rotate: 750,
  random: false,
  dataAfterTimeout: false
};
function sendQuery(config, payload, query, done) {
  const resourcesCount = config.resources.length;
  const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
  let resources;
  if (config.random) {
    let list = config.resources.slice(0);
    resources = [];
    while (list.length > 1) {
      const nextIndex = Math.floor(Math.random() * list.length);
      resources.push(list[nextIndex]);
      list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
    }
    resources = resources.concat(list);
  } else {
    resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
  }
  const startTime = Date.now();
  let status = "pending";
  let queriesSent = 0;
  let lastError;
  let timer = null;
  let queue = [];
  let doneCallbacks = [];
  if (typeof done === "function") {
    doneCallbacks.push(done);
  }
  function resetTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function abort() {
    if (status === "pending") {
      status = "aborted";
    }
    resetTimer();
    queue.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue = [];
  }
  function subscribe(callback, overwrite) {
    if (overwrite) {
      doneCallbacks = [];
    }
    if (typeof callback === "function") {
      doneCallbacks.push(callback);
    }
  }
  function getQueryStatus() {
    return {
      startTime,
      payload,
      status,
      queriesSent,
      queriesPending: queue.length,
      subscribe,
      abort
    };
  }
  function failQuery() {
    status = "failed";
    doneCallbacks.forEach((callback) => {
      callback(void 0, lastError);
    });
  }
  function clearQueue() {
    queue.forEach((item) => {
      if (item.status === "pending") {
        item.status = "aborted";
      }
    });
    queue = [];
  }
  function moduleResponse(item, response, data) {
    const isError = response !== "success";
    queue = queue.filter((queued) => queued !== item);
    switch (status) {
      case "pending":
        break;
      case "failed":
        if (isError || !config.dataAfterTimeout) {
          return;
        }
        break;
      default:
        return;
    }
    if (response === "abort") {
      lastError = data;
      failQuery();
      return;
    }
    if (isError) {
      lastError = data;
      if (!queue.length) {
        if (!resources.length) {
          failQuery();
        } else {
          execNext();
        }
      }
      return;
    }
    resetTimer();
    clearQueue();
    if (!config.random) {
      const index2 = config.resources.indexOf(item.resource);
      if (index2 !== -1 && index2 !== config.index) {
        config.index = index2;
      }
    }
    status = "completed";
    doneCallbacks.forEach((callback) => {
      callback(data);
    });
  }
  function execNext() {
    if (status !== "pending") {
      return;
    }
    resetTimer();
    const resource = resources.shift();
    if (resource === void 0) {
      if (queue.length) {
        timer = setTimeout(() => {
          resetTimer();
          if (status === "pending") {
            clearQueue();
            failQuery();
          }
        }, config.timeout);
        return;
      }
      failQuery();
      return;
    }
    const item = {
      status: "pending",
      resource,
      callback: (status2, data) => {
        moduleResponse(item, status2, data);
      }
    };
    queue.push(item);
    queriesSent++;
    timer = setTimeout(execNext, config.rotate);
    query(resource, payload, item.callback);
  }
  setTimeout(execNext);
  return getQueryStatus;
}
function initRedundancy(cfg) {
  const config = {
    ...defaultConfig,
    ...cfg
  };
  let queries = [];
  function cleanup() {
    queries = queries.filter((item) => item().status === "pending");
  }
  function query(payload, queryCallback, doneCallback) {
    const query2 = sendQuery(
      config,
      payload,
      queryCallback,
      (data, error) => {
        cleanup();
        if (doneCallback) {
          doneCallback(data, error);
        }
      }
    );
    queries.push(query2);
    return query2;
  }
  function find(callback) {
    return queries.find((value) => {
      return callback(value);
    }) || null;
  }
  const instance = {
    query,
    find,
    setIndex: (index2) => {
      config.index = index2;
    },
    getIndex: () => config.index,
    cleanup
  };
  return instance;
}
function emptyCallback$1() {
}
const redundancyCache = /* @__PURE__ */ Object.create(null);
function getRedundancyCache(provider) {
  if (!redundancyCache[provider]) {
    const config = getAPIConfig(provider);
    if (!config) {
      return;
    }
    const redundancy = initRedundancy(config);
    const cachedReundancy = {
      config,
      redundancy
    };
    redundancyCache[provider] = cachedReundancy;
  }
  return redundancyCache[provider];
}
function sendAPIQuery(target, query, callback) {
  let redundancy;
  let send2;
  if (typeof target === "string") {
    const api = getAPIModule(target);
    if (!api) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    send2 = api.send;
    const cached = getRedundancyCache(target);
    if (cached) {
      redundancy = cached.redundancy;
    }
  } else {
    const config = createAPIConfig(target);
    if (config) {
      redundancy = initRedundancy(config);
      const moduleKey = target.resources ? target.resources[0] : "";
      const api = getAPIModule(moduleKey);
      if (api) {
        send2 = api.send;
      }
    }
  }
  if (!redundancy || !send2) {
    callback(void 0, 424);
    return emptyCallback$1;
  }
  return redundancy.query(query, send2, callback)().abort;
}
const browserCacheVersion = "iconify2";
const browserCachePrefix = "iconify";
const browserCacheCountKey = browserCachePrefix + "-count";
const browserCacheVersionKey = browserCachePrefix + "-version";
const browserStorageHour = 36e5;
const browserStorageCacheExpiration = 168;
const browserStorageLimit = 50;
function getStoredItem(func, key) {
  try {
    return func.getItem(key);
  } catch (err) {
  }
}
function setStoredItem(func, key, value) {
  try {
    func.setItem(key, value);
    return true;
  } catch (err) {
  }
}
function removeStoredItem(func, key) {
  try {
    func.removeItem(key);
  } catch (err) {
  }
}
function setBrowserStorageItemsCount(storage2, value) {
  return setStoredItem(storage2, browserCacheCountKey, value.toString());
}
function getBrowserStorageItemsCount(storage2) {
  return parseInt(getStoredItem(storage2, browserCacheCountKey)) || 0;
}
const browserStorageConfig = {
  local: true,
  session: true
};
const browserStorageEmptyItems = {
  local: /* @__PURE__ */ new Set(),
  session: /* @__PURE__ */ new Set()
};
let browserStorageStatus = false;
function setBrowserStorageStatus(status) {
  browserStorageStatus = status;
}
let _window = {};
function getBrowserStorage(key) {
  const attr = key + "Storage";
  try {
    if (_window && _window[attr] && typeof _window[attr].length === "number") {
      return _window[attr];
    }
  } catch (err) {
  }
  browserStorageConfig[key] = false;
}
function iterateBrowserStorage(key, callback) {
  const func = getBrowserStorage(key);
  if (!func) {
    return;
  }
  const version2 = getStoredItem(func, browserCacheVersionKey);
  if (version2 !== browserCacheVersion) {
    if (version2) {
      const total2 = getBrowserStorageItemsCount(func);
      for (let i = 0; i < total2; i++) {
        removeStoredItem(func, browserCachePrefix + i.toString());
      }
    }
    setStoredItem(func, browserCacheVersionKey, browserCacheVersion);
    setBrowserStorageItemsCount(func, 0);
    return;
  }
  const minTime = Math.floor(Date.now() / browserStorageHour) - browserStorageCacheExpiration;
  const parseItem = (index2) => {
    const name = browserCachePrefix + index2.toString();
    const item = getStoredItem(func, name);
    if (typeof item !== "string") {
      return;
    }
    try {
      const data = JSON.parse(item);
      if (typeof data === "object" && typeof data.cached === "number" && data.cached > minTime && typeof data.provider === "string" && typeof data.data === "object" && typeof data.data.prefix === "string" && // Valid item: run callback
      callback(data, index2)) {
        return true;
      }
    } catch (err) {
    }
    removeStoredItem(func, name);
  };
  let total = getBrowserStorageItemsCount(func);
  for (let i = total - 1; i >= 0; i--) {
    if (!parseItem(i)) {
      if (i === total - 1) {
        total--;
        setBrowserStorageItemsCount(func, total);
      } else {
        browserStorageEmptyItems[key].add(i);
      }
    }
  }
}
function initBrowserStorage() {
  if (browserStorageStatus) {
    return;
  }
  setBrowserStorageStatus(true);
  for (const key in browserStorageConfig) {
    iterateBrowserStorage(key, (item) => {
      const iconSet = item.data;
      const provider = item.provider;
      const prefix = iconSet.prefix;
      const storage2 = getStorage(
        provider,
        prefix
      );
      if (!addIconSet(storage2, iconSet).length) {
        return false;
      }
      const lastModified = iconSet.lastModified || -1;
      storage2.lastModifiedCached = storage2.lastModifiedCached ? Math.min(storage2.lastModifiedCached, lastModified) : lastModified;
      return true;
    });
  }
}
function updateLastModified(storage2, lastModified) {
  const lastValue = storage2.lastModifiedCached;
  if (
    // Matches or newer
    lastValue && lastValue >= lastModified
  ) {
    return lastValue === lastModified;
  }
  storage2.lastModifiedCached = lastModified;
  if (lastValue) {
    for (const key in browserStorageConfig) {
      iterateBrowserStorage(key, (item) => {
        const iconSet = item.data;
        return item.provider !== storage2.provider || iconSet.prefix !== storage2.prefix || iconSet.lastModified === lastModified;
      });
    }
  }
  return true;
}
function storeInBrowserStorage(storage2, data) {
  if (!browserStorageStatus) {
    initBrowserStorage();
  }
  function store(key) {
    let func;
    if (!browserStorageConfig[key] || !(func = getBrowserStorage(key))) {
      return;
    }
    const set = browserStorageEmptyItems[key];
    let index2;
    if (set.size) {
      set.delete(index2 = Array.from(set).shift());
    } else {
      index2 = getBrowserStorageItemsCount(func);
      if (index2 >= browserStorageLimit || !setBrowserStorageItemsCount(func, index2 + 1)) {
        return;
      }
    }
    const item = {
      cached: Math.floor(Date.now() / browserStorageHour),
      provider: storage2.provider,
      data
    };
    return setStoredItem(
      func,
      browserCachePrefix + index2.toString(),
      JSON.stringify(item)
    );
  }
  if (data.lastModified && !updateLastModified(storage2, data.lastModified)) {
    return;
  }
  if (!Object.keys(data.icons).length) {
    return;
  }
  if (data.not_found) {
    data = Object.assign({}, data);
    delete data.not_found;
  }
  if (!store("local")) {
    store("session");
  }
}
function emptyCallback() {
}
function loadedNewIcons(storage2) {
  if (!storage2.iconsLoaderFlag) {
    storage2.iconsLoaderFlag = true;
    setTimeout(() => {
      storage2.iconsLoaderFlag = false;
      updateCallbacks(storage2);
    });
  }
}
function loadNewIcons(storage2, icons) {
  if (!storage2.iconsToLoad) {
    storage2.iconsToLoad = icons;
  } else {
    storage2.iconsToLoad = storage2.iconsToLoad.concat(icons).sort();
  }
  if (!storage2.iconsQueueFlag) {
    storage2.iconsQueueFlag = true;
    setTimeout(() => {
      storage2.iconsQueueFlag = false;
      const { provider, prefix } = storage2;
      const icons2 = storage2.iconsToLoad;
      delete storage2.iconsToLoad;
      let api;
      if (!icons2 || !(api = getAPIModule(provider))) {
        return;
      }
      const params = api.prepare(provider, prefix, icons2);
      params.forEach((item) => {
        sendAPIQuery(provider, item, (data) => {
          if (typeof data !== "object") {
            item.icons.forEach((name) => {
              storage2.missing.add(name);
            });
          } else {
            try {
              const parsed = addIconSet(
                storage2,
                data
              );
              if (!parsed.length) {
                return;
              }
              const pending = storage2.pendingIcons;
              if (pending) {
                parsed.forEach((name) => {
                  pending.delete(name);
                });
              }
              storeInBrowserStorage(storage2, data);
            } catch (err) {
              console.error(err);
            }
          }
          loadedNewIcons(storage2);
        });
      });
    });
  }
}
const loadIcons = (icons, callback) => {
  const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
  const sortedIcons = sortIcons(cleanedIcons);
  if (!sortedIcons.pending.length) {
    let callCallback = true;
    if (callback) {
      setTimeout(() => {
        if (callCallback) {
          callback(
            sortedIcons.loaded,
            sortedIcons.missing,
            sortedIcons.pending,
            emptyCallback
          );
        }
      });
    }
    return () => {
      callCallback = false;
    };
  }
  const newIcons = /* @__PURE__ */ Object.create(null);
  const sources = [];
  let lastProvider, lastPrefix;
  sortedIcons.pending.forEach((icon) => {
    const { provider, prefix } = icon;
    if (prefix === lastPrefix && provider === lastProvider) {
      return;
    }
    lastProvider = provider;
    lastPrefix = prefix;
    sources.push(getStorage(provider, prefix));
    const providerNewIcons = newIcons[provider] || (newIcons[provider] = /* @__PURE__ */ Object.create(null));
    if (!providerNewIcons[prefix]) {
      providerNewIcons[prefix] = [];
    }
  });
  sortedIcons.pending.forEach((icon) => {
    const { provider, prefix, name } = icon;
    const storage2 = getStorage(provider, prefix);
    const pendingQueue = storage2.pendingIcons || (storage2.pendingIcons = /* @__PURE__ */ new Set());
    if (!pendingQueue.has(name)) {
      pendingQueue.add(name);
      newIcons[provider][prefix].push(name);
    }
  });
  sources.forEach((storage2) => {
    const { provider, prefix } = storage2;
    if (newIcons[provider][prefix].length) {
      loadNewIcons(storage2, newIcons[provider][prefix]);
    }
  });
  return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
};
function toggleBrowserCache(storage2, value) {
  switch (storage2) {
    case "local":
    case "session":
      browserStorageConfig[storage2] = value;
      break;
    case "all":
      for (const key in browserStorageConfig) {
        browserStorageConfig[key] = value;
      }
      break;
  }
}
function mergeCustomisations(defaults2, item) {
  const result = {
    ...defaults2
  };
  for (const key in item) {
    const value = item[key];
    const valueType = typeof value;
    if (key in defaultIconSizeCustomisations) {
      if (value === null || value && (valueType === "string" || valueType === "number")) {
        result[key] = value;
      }
    } else if (valueType === typeof result[key]) {
      result[key] = key === "rotate" ? value % 4 : value;
    }
  }
  return result;
}
const separator = /[\s,]+/;
function flipFromString(custom, flip) {
  flip.split(separator).forEach((str) => {
    const value = str.trim();
    switch (value) {
      case "horizontal":
        custom.hFlip = true;
        break;
      case "vertical":
        custom.vFlip = true;
        break;
    }
  });
}
function rotateFromString(value, defaultValue = 0) {
  const units = value.replace(/^-?[0-9.]*/, "");
  function cleanup(value2) {
    while (value2 < 0) {
      value2 += 4;
    }
    return value2 % 4;
  }
  if (units === "") {
    const num = parseInt(value);
    return isNaN(num) ? 0 : cleanup(num);
  } else if (units !== value) {
    let split = 0;
    switch (units) {
      case "%":
        split = 25;
        break;
      case "deg":
        split = 90;
    }
    if (split) {
      let num = parseFloat(value.slice(0, value.length - units.length));
      if (isNaN(num)) {
        return 0;
      }
      num = num / split;
      return num % 1 === 0 ? cleanup(num) : 0;
    }
  }
  return defaultValue;
}
function iconToHTML$1(body, attributes) {
  let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const attr in attributes) {
    renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
}
function encodeSVGforURL$1(svg) {
  return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
}
function svgToData$1(svg) {
  return "data:image/svg+xml," + encodeSVGforURL$1(svg);
}
function svgToURL$1(svg) {
  return 'url("' + svgToData$1(svg) + '")';
}
const defaultExtendedIconCustomisations = {
  ...defaultIconCustomisations,
  inline: false
};
const svgDefaults = {
  "xmlns": "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  "aria-hidden": true,
  "role": "img"
};
const commonProps = {
  display: "inline-block"
};
const monotoneProps = {
  backgroundColor: "currentColor"
};
const coloredProps = {
  backgroundColor: "transparent"
};
const propsToAdd = {
  Image: "var(--svg)",
  Repeat: "no-repeat",
  Size: "100% 100%"
};
const propsToAddTo = {
  webkitMask: monotoneProps,
  mask: monotoneProps,
  background: coloredProps
};
for (const prefix in propsToAddTo) {
  const list = propsToAddTo[prefix];
  for (const prop in propsToAdd) {
    list[prefix + prop] = propsToAdd[prop];
  }
}
const customisationAliases = {};
["horizontal", "vertical"].forEach((prefix) => {
  const attr = prefix.slice(0, 1) + "Flip";
  customisationAliases[prefix + "-flip"] = attr;
  customisationAliases[prefix.slice(0, 1) + "-flip"] = attr;
  customisationAliases[prefix + "Flip"] = attr;
});
function fixSize(value) {
  return value + (value.match(/^[-0-9.]+$/) ? "px" : "");
}
const render = (icon, props) => {
  const customisations = mergeCustomisations(defaultExtendedIconCustomisations, props);
  const componentProps = { ...svgDefaults };
  const mode = props.mode || "svg";
  const style = {};
  const propsStyle = props.style;
  const customStyle = typeof propsStyle === "object" && !(propsStyle instanceof Array) ? propsStyle : {};
  for (let key in props) {
    const value = props[key];
    if (value === void 0) {
      continue;
    }
    switch (key) {
      case "icon":
      case "style":
      case "onLoad":
      case "mode":
        break;
      case "inline":
      case "hFlip":
      case "vFlip":
        customisations[key] = value === true || value === "true" || value === 1;
        break;
      case "flip":
        if (typeof value === "string") {
          flipFromString(customisations, value);
        }
        break;
      case "color":
        style.color = value;
        break;
      case "rotate":
        if (typeof value === "string") {
          customisations[key] = rotateFromString(value);
        } else if (typeof value === "number") {
          customisations[key] = value;
        }
        break;
      case "ariaHidden":
      case "aria-hidden":
        if (value !== true && value !== "true") {
          delete componentProps["aria-hidden"];
        }
        break;
      default: {
        const alias = customisationAliases[key];
        if (alias) {
          if (value === true || value === "true" || value === 1) {
            customisations[alias] = true;
          }
        } else if (defaultExtendedIconCustomisations[key] === void 0) {
          componentProps[key] = value;
        }
      }
    }
  }
  const item = iconToSVG(icon, customisations);
  const renderAttribs = item.attributes;
  if (customisations.inline) {
    style.verticalAlign = "-0.125em";
  }
  if (mode === "svg") {
    componentProps.style = {
      ...style,
      ...customStyle
    };
    Object.assign(componentProps, renderAttribs);
    let localCounter = 0;
    let id = props.id;
    if (typeof id === "string") {
      id = id.replace(/-/g, "_");
    }
    componentProps["innerHTML"] = replaceIDs(item.body, id ? () => id + "ID" + localCounter++ : "iconifyVue");
    return h("svg", componentProps);
  }
  const { body, width, height } = icon;
  const useMask = mode === "mask" || (mode === "bg" ? false : body.indexOf("currentColor") !== -1);
  const html = iconToHTML$1(body, {
    ...renderAttribs,
    width: width + "",
    height: height + ""
  });
  componentProps.style = {
    ...style,
    "--svg": svgToURL$1(html),
    "width": fixSize(renderAttribs.width),
    "height": fixSize(renderAttribs.height),
    ...commonProps,
    ...useMask ? monotoneProps : coloredProps,
    ...customStyle
  };
  return h("span", componentProps);
};
function disableCache(storage2) {
  toggleBrowserCache(storage2, false);
}
allowSimpleNames(true);
setAPIModule("", fetchAPIModule);
const emptyIcon = {
  ...defaultIconProps$1,
  body: ""
};
const Icon = defineComponent({
  // Do not inherit other attributes: it is handled by render()
  inheritAttrs: false,
  // Set initial data
  data() {
    return {
      // Current icon name
      _name: "",
      // Loading
      _loadingIcon: null,
      // Mounted status
      iconMounted: false,
      // Callback counter to trigger re-render
      counter: 0
    };
  },
  mounted() {
    this.iconMounted = true;
  },
  unmounted() {
    this.abortLoading();
  },
  methods: {
    abortLoading() {
      if (this._loadingIcon) {
        this._loadingIcon.abort();
        this._loadingIcon = null;
      }
    },
    // Get data for icon to render or null
    getIcon(icon, onload) {
      if (typeof icon === "object" && icon !== null && typeof icon.body === "string") {
        this._name = "";
        this.abortLoading();
        return {
          data: icon
        };
      }
      let iconName;
      if (typeof icon !== "string" || (iconName = stringToIcon(icon, false, true)) === null) {
        this.abortLoading();
        return null;
      }
      const data = getIconData(iconName);
      if (!data) {
        if (!this._loadingIcon || this._loadingIcon.name !== icon) {
          this.abortLoading();
          this._name = "";
          if (data !== null) {
            this._loadingIcon = {
              name: icon,
              abort: loadIcons([iconName], () => {
                this.counter++;
              })
            };
          }
        }
        return null;
      }
      this.abortLoading();
      if (this._name !== icon) {
        this._name = icon;
        if (onload) {
          onload(icon);
        }
      }
      const classes = ["iconify"];
      if (iconName.prefix !== "") {
        classes.push("iconify--" + iconName.prefix);
      }
      if (iconName.provider !== "") {
        classes.push("iconify--" + iconName.provider);
      }
      return { data, classes };
    }
  },
  // Render icon
  render() {
    this.counter;
    const props = this.$attrs;
    const icon = this.iconMounted || props.ssr ? this.getIcon(props.icon, props.onLoad) : null;
    if (!icon) {
      return render(emptyIcon, props);
    }
    let newProps = props;
    if (icon.classes) {
      newProps = {
        ...props,
        class: (typeof props["class"] === "string" ? props["class"] + " " : "") + icon.classes.join(" ")
      };
    }
    return render({
      ...defaultIconProps$1,
      ...icon.data
    }, newProps);
  }
});
const _api = {
  getAPIConfig,
  setAPIModule,
  sendAPIQuery,
  setFetch,
  getFetch,
  listAPIProviders
};
const plugin_w7DVyfeAvj = /* @__PURE__ */ defineNuxtPlugin({
  name: "@nuxt/icon",
  setup() {
    var _a2, _b2;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const options = useAppConfig().icon;
    _api.setFetch($fetch.native);
    disableCache("all");
    const resources = [];
    if (options.provider === "server") {
      const baseURL2 = ((_b2 = (_a2 = config.app) == null ? void 0 : _a2.baseURL) == null ? void 0 : _b2.replace(/\/$/, "")) ?? "";
      resources.push(baseURL2 + "/api/_nuxt_icon");
      if (options.fallbackToApi) {
        resources.push(options.iconifyApiEndpoint);
      }
    } else {
      resources.push(options.iconifyApiEndpoint);
    }
    addAPIProvider("", { resources });
  }
});
function titleCase(s2) {
  return s2.replaceAll("-", " ").replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
}
const titles_nhjfi2YhEr = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-seo:fallback-titles",
  env: {
    islands: false
  },
  setup() {
    const route = useRoute();
    const title = computed(() => {
      var _a2, _b2;
      if (typeof ((_a2 = route.meta) == null ? void 0 : _a2.title) === "string")
        return (_b2 = route.meta) == null ? void 0 : _b2.title;
      const path = withoutTrailingSlash(route.path || "/");
      const lastSegment = path.split("/").pop();
      return lastSegment ? titleCase(lastSegment) : null;
    });
    const minimalPriority = {
      // give nuxt.config values higher priority
      tagPriority: 101
    };
    useHead({ title: () => title.value }, minimalPriority);
  }
});
function useNitroOrigin(e) {
  {
    e = e || useRequestEvent();
    return e.context.siteConfigNitroOrigin;
  }
}
function useSiteConfig(options) {
  let stack;
  stack = useRequestEvent().context.siteConfig.get(defu({ resolveRefs: true }, options));
  return stack || {};
}
function resolveSitePath(pathOrUrl, options) {
  let path = pathOrUrl;
  if (hasProtocol(pathOrUrl, { strict: false, acceptRelative: true })) {
    const parsed = parseURL(pathOrUrl);
    path = parsed.pathname;
  }
  const base = withLeadingSlash(options.base || "/");
  if (base !== "/" && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  const origin = options.absolute ? options.siteUrl : "";
  const baseWithOrigin = options.withBase ? withBase(base, origin || "/") : origin;
  const resolvedUrl = withBase(path, baseWithOrigin);
  return path === "/" && !options.withBase ? withTrailingSlash(resolvedUrl) : fixSlashes(options.trailingSlash, resolvedUrl);
}
function fixSlashes(trailingSlash, pathOrUrl) {
  const $url = parseURL(pathOrUrl);
  const isFileUrl = $url.pathname.includes(".");
  if (isFileUrl)
    return pathOrUrl;
  const fixedPath = trailingSlash ? withTrailingSlash($url.pathname) : withoutTrailingSlash($url.pathname);
  return `${$url.protocol ? `${$url.protocol}//` : ""}${$url.host || ""}${fixedPath}${$url.search || ""}${$url.hash || ""}`;
}
function createSitePathResolver(options = {}) {
  const siteConfig = useSiteConfig();
  const nitroOrigin = useNitroOrigin();
  const nuxtBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL || "/";
  return (path) => {
    return computed(() => resolveSitePath(unref(path), {
      absolute: unref(options.absolute),
      withBase: unref(options.withBase),
      siteUrl: unref(options.canonical) !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base: nuxtBase
    }));
  };
}
function withSiteUrl(path, options = {}) {
  const siteConfig = useSiteConfig();
  const nitroOrigin = useNitroOrigin();
  const base = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL || "/";
  return computed(() => {
    return resolveSitePath(unref(path), {
      absolute: true,
      siteUrl: unref(options.canonical) !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base,
      withBase: unref(options.withBase)
    });
  });
}
function applyDefaults() {
  const siteConfig = useSiteConfig();
  const route = useRoute();
  const resolveUrl = createSitePathResolver({ withBase: true, absolute: true });
  const canonicalUrl = computed(() => resolveUrl(route.path || "/").value || route.path);
  const minimalPriority = {
    // give nuxt.config values higher priority
    tagPriority: 101
  };
  useHead({
    link: [{ rel: "canonical", href: () => canonicalUrl.value }]
  });
  const locale = siteConfig.currentLocale || siteConfig.defaultLocale;
  if (locale) {
    useServerHead({
      htmlAttrs: { lang: locale }
    });
  }
  useHead({
    templateParams: { site: siteConfig, siteName: siteConfig.name || "" },
    titleTemplate: "%s %separator %siteName"
  }, minimalPriority);
  const seoMeta = {
    ogType: "website",
    ogUrl: () => canonicalUrl.value,
    ogLocale: locale,
    ogSiteName: siteConfig.name
  };
  if (siteConfig.description)
    seoMeta.description = siteConfig.description;
  if (siteConfig.twitter) {
    const id = siteConfig.twitter.startsWith("@") ? siteConfig.twitter : `@${siteConfig.twitter}`;
    seoMeta.twitterCreator = id;
    seoMeta.twitterSite = id;
  }
  useSeoMeta(seoMeta, minimalPriority);
}
const defaults_5dmr8LrVoI = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-seo:defaults",
  env: {
    islands: false
  },
  setup: applyDefaults
});
const siteConfig_oGyOQof5Or = /* @__PURE__ */ defineNuxtPlugin(() => {
  const head = injectHead();
  if (!head)
    return;
  const siteConfig = useSiteConfig();
  const input = {
    meta: [],
    templateParams: {
      site: siteConfig,
      // support legacy
      siteUrl: siteConfig.url,
      siteName: siteConfig.name
    }
  };
  if (siteConfig.separator)
    input.templateParams.separator = siteConfig.separator;
  if (siteConfig.titleSeparator)
    input.templateParams.titleSeparator = siteConfig.titleSeparator;
  if (siteConfig.description) {
    input.templateParams.siteDescription = siteConfig.description;
    input.meta.push(
      {
        name: "description",
        content: "%site.description"
      }
    );
  }
  head.push(input, { tagPriority: 150 });
});
// @__NO_SIDE_EFFECTS__
function InferSeoMetaPlugin(options = {}) {
  return defineHeadPlugin$1({
    hooks: {
      entries: {
        resolve({ entries }) {
          var _a2;
          let titleTemplate = null;
          for (const entry2 of entries) {
            const inputKey = entry2.resolvedInput ? "resolvedInput" : "input";
            const input = entry2[inputKey];
            if (typeof input.titleTemplate !== "undefined")
              titleTemplate = input.titleTemplate;
          }
          for (const entry2 of entries) {
            const inputKey = entry2.resolvedInput ? "resolvedInput" : "input";
            const input = entry2[inputKey];
            const resolvedMeta = input.meta || [];
            titleTemplate = resolveTitleTemplate(titleTemplate, input.title);
            const title = input.title;
            const description = (_a2 = resolvedMeta.find((meta) => meta.name === "description")) == null ? void 0 : _a2.content;
            const hasOgTitle = resolvedMeta.some((meta) => meta.property === "og:title");
            const hasOgImage = resolvedMeta.some((meta) => meta.property === "og:image");
            const hasTwitterCard = resolvedMeta.some((meta) => meta.name === "twitter:card");
            const hasOgDescription = resolvedMeta.some((meta) => meta.property === "og:description");
            entry2[inputKey].meta = input.meta || [];
            if (!hasOgTitle && (input.titleTemplate || input.title)) {
              let newOgTitle = (options == null ? void 0 : options.ogTitle) || titleTemplate || input.title;
              if (typeof newOgTitle === "function")
                newOgTitle = newOgTitle(title);
              if (newOgTitle) {
                entry2[inputKey].meta.push({
                  property: "og:title",
                  // have the og:title be removed if we don't have a title
                  content: String(newOgTitle)
                });
              }
            }
            if (description && !hasOgDescription) {
              let newOgDescription = (options == null ? void 0 : options.ogDescription) || description;
              if (typeof newOgDescription === "function")
                newOgDescription = newOgDescription(title);
              if (newOgDescription) {
                entry2[inputKey].meta.push({
                  property: "og:description",
                  content: String(newOgDescription)
                });
              }
            }
            if (hasOgImage && !hasTwitterCard) {
              entry2[inputKey].meta.push({
                name: "twitter:card",
                content: (options == null ? void 0 : options.twitterCard) || "summary_large_image"
              });
            }
          }
        }
      }
    }
  });
}
const inferSeoMetaPlugin_wAXpBSJ4Qi = /* @__PURE__ */ defineNuxtPlugin(() => {
  const head = injectHead();
  if (!head)
    return;
  head.use(/* @__PURE__ */ InferSeoMetaPlugin());
});
function defineSchemaOrgResolver(schema) {
  return schema;
}
function idReference(node) {
  return {
    "@id": typeof node !== "string" ? node["@id"] : node
  };
}
function resolvableDateToDate(val) {
  try {
    const date = val instanceof Date ? val : new Date(Date.parse(val));
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  } catch (e) {
  }
  return typeof val === "string" ? val : val.toString();
}
const IS_VALID_W3C_DATE = [
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
  /^\d{4}-[01]\d-[0-3]\d$/,
  /^\d{4}-[01]\d$/,
  /^\d{4}$/
];
function isValidW3CDate(d2) {
  return IS_VALID_W3C_DATE.some((r) => r.test(d2));
}
function resolvableDateToIso(val) {
  if (!val)
    return val;
  try {
    if (val instanceof Date)
      return val.toISOString();
    else if (isValidW3CDate(val))
      return val;
    else
      return new Date(Date.parse(val)).toISOString();
  } catch (e) {
  }
  return typeof val === "string" ? val : val.toString();
}
const IdentityId = "#identity";
function setIfEmpty(node, field, value) {
  if (!(node == null ? void 0 : node[field]) && value)
    node[field] = value;
}
function asArray(input) {
  return Array.isArray(input) ? input : [input];
}
function dedupeMerge(node, field, value) {
  const dedupeMerge2 = [];
  const input = asArray(node[field]);
  dedupeMerge2.push(...input);
  const data = new Set(dedupeMerge2);
  data.add(value);
  node[field] = [...data.values()].filter(Boolean);
}
function prefixId(url, id) {
  if (hasProtocol(id))
    return id;
  if (!id.startsWith("#"))
    id = `#${id}`;
  return withBase(id, url);
}
function trimLength(val, length) {
  if (!val)
    return val;
  if (val.length > length) {
    const trimmedString = val.substring(0, length);
    return trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
  }
  return val;
}
function resolveDefaultType(node, defaultType) {
  const val = node["@type"];
  if (val === defaultType)
    return;
  const types2 = /* @__PURE__ */ new Set([
    ...asArray(defaultType),
    ...asArray(val)
  ]);
  node["@type"] = types2.size === 1 ? val : [...types2.values()];
}
function resolveWithBase(base, urlOrPath) {
  if (!urlOrPath || hasProtocol(urlOrPath) || !urlOrPath.startsWith("/") && !urlOrPath.startsWith("#"))
    return urlOrPath;
  return withBase(urlOrPath, base);
}
function resolveAsGraphKey(key) {
  if (!key)
    return key;
  return key.substring(key.lastIndexOf("#"));
}
function stripEmptyProperties(obj) {
  Object.keys(obj).forEach((k2) => {
    if (obj[k2] && typeof obj[k2] === "object") {
      if (obj[k2].__v_isReadonly || obj[k2].__v_isRef)
        return;
      stripEmptyProperties(obj[k2]);
      return;
    }
    if (obj[k2] === "" || obj[k2] === null || typeof obj[k2] === "undefined")
      delete obj[k2];
  });
  return obj;
}
const quantitativeValueResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "number") {
      return {
        value: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "QuantitativeValue"
  }
});
const monetaryAmountResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "MonetaryAmount"
  },
  resolve(node, ctx) {
    if (typeof node.value !== "number")
      node.value = resolveRelation(node.value, ctx, quantitativeValueResolver);
    return node;
  }
});
const merchantReturnPolicyResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "MerchantReturnPolicy"
  },
  resolve(node, ctx) {
    if (node.returnPolicyCategory)
      node.returnPolicyCategory = withBase(node.returnPolicyCategory, "https://schema.org/");
    if (node.returnFees)
      node.returnFees = withBase(node.returnFees, "https://schema.org/");
    if (node.returnMethod)
      node.returnMethod = withBase(node.returnMethod, "https://schema.org/");
    node.returnShippingFeesAmount = resolveRelation(node.returnShippingFeesAmount, ctx, monetaryAmountResolver);
    return node;
  }
});
const definedRegionResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "DefinedRegion"
  }
});
const shippingDeliveryTimeResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "ShippingDeliveryTime"
  },
  resolve(node, ctx) {
    node.handlingTime = resolveRelation(node.handlingTime, ctx, quantitativeValueResolver);
    node.transitTime = resolveRelation(node.transitTime, ctx, quantitativeValueResolver);
    return node;
  }
});
const offerShippingDetailsResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "OfferShippingDetails"
  },
  resolve(node, ctx) {
    node.deliveryTime = resolveRelation(node.deliveryTime, ctx, shippingDeliveryTimeResolver);
    node.shippingDestination = resolveRelation(node.shippingDestination, ctx, definedRegionResolver);
    node.shippingRate = resolveRelation(node.shippingRate, ctx, monetaryAmountResolver);
    return node;
  }
});
const offerResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "number" || typeof node === "string") {
      return {
        price: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "Offer",
    "availability": "InStock"
  },
  resolve(node, ctx) {
    setIfEmpty(node, "priceCurrency", ctx.meta.currency);
    setIfEmpty(node, "priceValidUntil", new Date(Date.UTC((/* @__PURE__ */ new Date()).getFullYear() + 1, 12, -1, 0, 0, 0)));
    if (node.url)
      resolveWithBase(ctx.meta.host, node.url);
    if (node.availability)
      node.availability = withBase(node.availability, "https://schema.org/");
    if (node.itemCondition)
      node.itemCondition = withBase(node.itemCondition, "https://schema.org/");
    if (node.priceValidUntil)
      node.priceValidUntil = resolvableDateToIso(node.priceValidUntil);
    node.hasMerchantReturnPolicy = resolveRelation(node.hasMerchantReturnPolicy, ctx, merchantReturnPolicyResolver);
    node.shippingDetails = resolveRelation(node.shippingDetails, ctx, offerShippingDetailsResolver);
    return node;
  }
});
const aggregateOfferResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "AggregateOffer"
  },
  inheritMeta: [
    { meta: "currency", key: "priceCurrency" }
  ],
  resolve(node, ctx) {
    node.offers = resolveRelation(node.offers, ctx, offerResolver);
    if (node.offers)
      setIfEmpty(node, "offerCount", asArray(node.offers).length);
    return node;
  }
});
const aggregateRatingResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "AggregateRating"
  }
});
const searchActionResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint"
    },
    "query-input": {
      "@type": "PropertyValueSpecification",
      "valueRequired": true,
      "valueName": "search_term_string"
    }
  },
  resolve(node, ctx) {
    if (typeof node.target === "string") {
      node.target = {
        "@type": "EntryPoint",
        "urlTemplate": resolveWithBase(ctx.meta.host, node.target)
      };
    }
    return node;
  }
});
const PrimaryWebSiteId = "#website";
const webSiteResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "WebSite"
  },
  inheritMeta: [
    "inLanguage",
    { meta: "host", key: "url" }
  ],
  idPrefix: ["host", PrimaryWebSiteId],
  resolve(node, ctx) {
    node.potentialAction = resolveRelation(node.potentialAction, ctx, searchActionResolver, {
      array: true
    });
    node.publisher = resolveRelation(node.publisher, ctx);
    return node;
  },
  resolveRootNode(node, { find }) {
    if (resolveAsGraphKey(node["@id"]) === PrimaryWebSiteId) {
      const identity = find(IdentityId);
      if (identity)
        setIfEmpty(node, "publisher", idReference(identity));
      const webPage = find(PrimaryWebPageId);
      if (webPage)
        setIfEmpty(webPage, "isPartOf", idReference(node));
    }
    return node;
  }
});
const listItemResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "string") {
      node = {
        name: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "ListItem"
  },
  resolve(node, ctx) {
    if (typeof node.item === "string")
      node.item = resolveWithBase(ctx.meta.host, node.item);
    else if (typeof node.item === "object")
      node.item = resolveRelation(node.item, ctx);
    return node;
  }
});
const PrimaryBreadcrumbId = "#breadcrumb";
const breadcrumbResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "BreadcrumbList"
  },
  idPrefix: ["url", PrimaryBreadcrumbId],
  resolve(breadcrumb, ctx) {
    if (breadcrumb.itemListElement) {
      let index2 = 1;
      breadcrumb.itemListElement = resolveRelation(breadcrumb.itemListElement, ctx, listItemResolver, {
        array: true,
        afterResolve(node) {
          setIfEmpty(node, "position", index2++);
        }
      });
    }
    return breadcrumb;
  },
  resolveRootNode(node, { find }) {
    const webPage = find(PrimaryWebPageId);
    if (webPage)
      setIfEmpty(webPage, "breadcrumb", idReference(node));
  }
});
const imageResolver = defineSchemaOrgResolver({
  alias: "image",
  cast(input) {
    if (typeof input === "string") {
      input = {
        url: input
      };
    }
    return input;
  },
  defaults: {
    "@type": "ImageObject"
  },
  inheritMeta: [
    // @todo possibly only do if there's a caption
    "inLanguage"
  ],
  idPrefix: "host",
  resolve(image, { meta }) {
    image.url = resolveWithBase(meta.host, image.url);
    setIfEmpty(image, "contentUrl", image.url);
    if (image.height && !image.width)
      delete image.height;
    if (image.width && !image.height)
      delete image.width;
    return image;
  }
});
const addressResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "PostalAddress"
  }
});
const organizationResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Organization"
  },
  idPrefix: ["host", IdentityId],
  inheritMeta: [
    { meta: "host", key: "url" }
  ],
  resolve(node, ctx) {
    resolveDefaultType(node, "Organization");
    node.address = resolveRelation(node.address, ctx, addressResolver);
    return node;
  },
  resolveRootNode(node, ctx) {
    const isIdentity = resolveAsGraphKey(node["@id"]) === IdentityId;
    const webPage = ctx.find(PrimaryWebPageId);
    if (node.logo && isIdentity) {
      if (!ctx.find("#organization")) {
        const logoNode = resolveRelation(node.logo, ctx, imageResolver, {
          root: true,
          afterResolve(logo) {
            logo["@id"] = prefixId(ctx.meta.host, "#logo");
            setIfEmpty(logo, "caption", node.name);
          }
        });
        if (webPage && logoNode)
          setIfEmpty(webPage, "primaryImageOfPage", idReference(logoNode));
        ctx.nodes.push({
          // we want to make a simple node that has the essentials, this will allow parent nodes to inject
          // as well without inserting invalid data (i.e LocalBusiness operatingHours)
          "@type": "Organization",
          "name": node.name,
          "url": node.url,
          "sameAs": node.sameAs,
          // 'image': idReference(logoNode),
          "address": node.address,
          // needs to be a URL
          "logo": resolveRelation(node.logo, ctx, imageResolver, { root: false }).url,
          "_priority": -1,
          "@id": prefixId(ctx.meta.host, "#organization")
          // avoid the id so nothing can link to it
        });
      }
      delete node.logo;
    }
    if (isIdentity && webPage)
      setIfEmpty(webPage, "about", idReference(node));
    const webSite = ctx.find(PrimaryWebSiteId);
    if (webSite)
      setIfEmpty(webSite, "publisher", idReference(node));
  }
});
const personResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "string") {
      return {
        name: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "Person"
  },
  idPrefix: ["host", IdentityId],
  resolve(node, ctx) {
    if (node.url)
      node.url = resolveWithBase(ctx.meta.host, node.url);
    return node;
  },
  resolveRootNode(node, { find, meta }) {
    if (resolveAsGraphKey(node["@id"]) === IdentityId) {
      setIfEmpty(node, "url", meta.host);
      const webPage = find(PrimaryWebPageId);
      if (webPage)
        setIfEmpty(webPage, "about", idReference(node));
      const webSite = find(PrimaryWebSiteId);
      if (webSite)
        setIfEmpty(webSite, "publisher", idReference(node));
    }
    const article = find(PrimaryArticleId);
    if (article)
      setIfEmpty(article, "author", idReference(node));
  }
});
const readActionResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "ReadAction"
  },
  resolve(node, ctx) {
    if (!node.target.includes(ctx.meta.url))
      node.target.unshift(ctx.meta.url);
    return node;
  }
});
const PrimaryWebPageId = "#webpage";
const webPageResolver = defineSchemaOrgResolver({
  defaults({ meta }) {
    const endPath = withoutTrailingSlash(meta.url.substring(meta.url.lastIndexOf("/") + 1));
    let type = "WebPage";
    switch (endPath) {
      case "about":
      case "about-us":
        type = "AboutPage";
        break;
      case "search":
        type = "SearchResultsPage";
        break;
      case "checkout":
        type = "CheckoutPage";
        break;
      case "contact":
      case "get-in-touch":
      case "contact-us":
        type = "ContactPage";
        break;
      case "faq":
        type = "FAQPage";
        break;
    }
    const defaults2 = {
      "@type": type
    };
    return defaults2;
  },
  idPrefix: ["url", PrimaryWebPageId],
  inheritMeta: [
    { meta: "title", key: "name" },
    "description",
    "datePublished",
    "dateModified",
    "url"
  ],
  resolve(node, ctx) {
    node.dateModified = resolvableDateToIso(node.dateModified);
    node.datePublished = resolvableDateToIso(node.datePublished);
    resolveDefaultType(node, "WebPage");
    node.about = resolveRelation(node.about, ctx, organizationResolver);
    node.breadcrumb = resolveRelation(node.breadcrumb, ctx, breadcrumbResolver);
    node.author = resolveRelation(node.author, ctx, personResolver);
    node.primaryImageOfPage = resolveRelation(node.primaryImageOfPage, ctx, imageResolver);
    node.potentialAction = resolveRelation(node.potentialAction, ctx, readActionResolver);
    if (node["@type"] === "WebPage" && ctx.meta.url) {
      setIfEmpty(node, "potentialAction", [
        {
          "@type": "ReadAction",
          "target": [ctx.meta.url]
        }
      ]);
    }
    return node;
  },
  resolveRootNode(webPage, { find, meta }) {
    const identity = find(IdentityId);
    const webSite = find(PrimaryWebSiteId);
    const logo = find("#logo");
    if (identity && meta.url === meta.host)
      setIfEmpty(webPage, "about", idReference(identity));
    if (logo)
      setIfEmpty(webPage, "primaryImageOfPage", idReference(logo));
    if (webSite)
      setIfEmpty(webPage, "isPartOf", idReference(webSite));
    const breadcrumb = find(PrimaryBreadcrumbId);
    if (breadcrumb)
      setIfEmpty(webPage, "breadcrumb", idReference(breadcrumb));
    return webPage;
  }
});
const PrimaryArticleId = "#article";
const articleResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Article"
  },
  inheritMeta: [
    "inLanguage",
    "description",
    "image",
    "dateModified",
    "datePublished",
    { meta: "title", key: "headline" }
  ],
  idPrefix: ["url", PrimaryArticleId],
  resolve(node, ctx) {
    node.author = resolveRelation(node.author, ctx, personResolver, {
      root: true
    });
    node.publisher = resolveRelation(node.publisher, ctx);
    node.dateModified = resolvableDateToIso(node.dateModified);
    node.datePublished = resolvableDateToIso(node.datePublished);
    resolveDefaultType(node, "Article");
    node.headline = trimLength(node.headline, 110);
    return node;
  },
  resolveRootNode(node, { find, meta }) {
    var _a2;
    const webPage = find(PrimaryWebPageId);
    const identity = find(IdentityId);
    if (node.image && !node.thumbnailUrl) {
      const firstImage = asArray(node.image)[0];
      if (typeof firstImage === "string")
        setIfEmpty(node, "thumbnailUrl", resolveWithBase(meta.host, firstImage));
      else if (firstImage == null ? void 0 : firstImage["@id"])
        setIfEmpty(node, "thumbnailUrl", (_a2 = find(firstImage["@id"])) == null ? void 0 : _a2.url);
    }
    if (identity) {
      setIfEmpty(node, "publisher", idReference(identity));
      setIfEmpty(node, "author", idReference(identity));
    }
    if (webPage) {
      setIfEmpty(node, "isPartOf", idReference(webPage));
      setIfEmpty(node, "mainEntityOfPage", idReference(webPage));
      setIfEmpty(webPage, "potentialAction", [
        {
          "@type": "ReadAction",
          "target": [meta.url]
        }
      ]);
      setIfEmpty(webPage, "dateModified", node.dateModified);
      setIfEmpty(webPage, "datePublished", node.datePublished);
    }
    return node;
  }
});
const bookEditionResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Book"
  },
  inheritMeta: [
    "inLanguage"
  ],
  resolve(node, ctx) {
    if (node.bookFormat)
      node.bookFormat = withBase(node.bookFormat, "https://schema.org/");
    if (node.datePublished)
      node.datePublished = resolvableDateToDate(node.datePublished);
    node.author = resolveRelation(node.author, ctx);
    return node;
  },
  resolveRootNode(node, { find }) {
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(node, "provider", idReference(identity));
    return node;
  }
});
const PrimaryBookId = "#book";
const bookResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Book"
  },
  inheritMeta: [
    "description",
    "url",
    { meta: "title", key: "name" }
  ],
  idPrefix: ["url", PrimaryBookId],
  resolve(node, ctx) {
    node.workExample = resolveRelation(node.workExample, ctx, bookEditionResolver);
    node.author = resolveRelation(node.author, ctx);
    if (node.url)
      withBase(node.url, ctx.meta.host);
    return node;
  },
  resolveRootNode(node, { find }) {
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(node, "author", idReference(identity));
    return node;
  }
});
const commentResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Comment"
  },
  idPrefix: "url",
  resolve(node, ctx) {
    node.author = resolveRelation(node.author, ctx, personResolver, {
      root: true
    });
    return node;
  },
  resolveRootNode(node, { find }) {
    const article = find(PrimaryArticleId);
    if (article)
      setIfEmpty(node, "about", idReference(article));
  }
});
const courseResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Course"
  },
  resolve(node, ctx) {
    node.provider = resolveRelation(node.provider, ctx, organizationResolver, {
      root: true
    });
    return node;
  },
  resolveRootNode(node, { find }) {
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(node, "provider", idReference(identity));
    return node;
  }
});
const placeResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Place"
  },
  resolve(node, ctx) {
    if (typeof node.address !== "string")
      node.address = resolveRelation(node.address, ctx, addressResolver);
    return node;
  }
});
const virtualLocationResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "string") {
      return {
        url: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "VirtualLocation"
  }
});
const PrimaryEventId = "#event";
const eventResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Event"
  },
  inheritMeta: [
    "inLanguage",
    "description",
    "image",
    { meta: "title", key: "name" }
  ],
  idPrefix: ["url", PrimaryEventId],
  resolve(node, ctx) {
    var _a2;
    if (node.location) {
      const isVirtual = node.location === "string" || ((_a2 = node.location) == null ? void 0 : _a2.url) !== "undefined";
      node.location = resolveRelation(node.location, ctx, isVirtual ? virtualLocationResolver : placeResolver);
    }
    node.performer = resolveRelation(node.performer, ctx, personResolver, {
      root: true
    });
    node.organizer = resolveRelation(node.organizer, ctx, organizationResolver, {
      root: true
    });
    node.offers = resolveRelation(node.offers, ctx, offerResolver);
    if (node.eventAttendanceMode)
      node.eventAttendanceMode = withBase(node.eventAttendanceMode, "https://schema.org/");
    if (node.eventStatus)
      node.eventStatus = withBase(node.eventStatus, "https://schema.org/");
    const isOnline = node.eventStatus === "https://schema.org/EventMovedOnline";
    const dates = ["startDate", "previousStartDate", "endDate"];
    dates.forEach((date) => {
      if (!isOnline) {
        if (node[date] instanceof Date && node[date].getHours() === 0 && node[date].getMinutes() === 0)
          node[date] = resolvableDateToDate(node[date]);
      } else {
        node[date] = resolvableDateToIso(node[date]);
      }
    });
    setIfEmpty(node, "endDate", node.startDate);
    return node;
  },
  resolveRootNode(node, { find }) {
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(node, "organizer", idReference(identity));
  }
});
const ratingResolver = defineSchemaOrgResolver({
  cast(node) {
    if (node === "number") {
      return {
        ratingValue: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "Rating",
    "bestRating": 5,
    "worstRating": 1
  }
});
const openingHoursResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "OpeningHoursSpecification",
    "opens": "00:00",
    "closes": "23:59"
  }
});
const localBusinessResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": ["Organization", "LocalBusiness"]
  },
  inheritMeta: [
    { key: "url", meta: "host" },
    { key: "currenciesAccepted", meta: "currency" }
  ],
  idPrefix: ["host", IdentityId],
  resolve(node, ctx) {
    resolveDefaultType(node, ["Organization", "LocalBusiness"]);
    node.address = resolveRelation(node.address, ctx, addressResolver);
    node.openingHoursSpecification = resolveRelation(node.openingHoursSpecification, ctx, openingHoursResolver);
    node = resolveNode({ ...node }, ctx, organizationResolver);
    return node;
  },
  resolveRootNode(node, ctx) {
    organizationResolver.resolveRootNode(node, ctx);
    return node;
  }
});
const foodEstablishmentResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": ["Organization", "LocalBusiness", "FoodEstablishment"]
  },
  inheritMeta: [
    { key: "url", meta: "host" },
    { key: "currenciesAccepted", meta: "currency" }
  ],
  idPrefix: ["host", IdentityId],
  resolve(node, ctx) {
    resolveDefaultType(node, ["Organization", "LocalBusiness", "FoodEstablishment"]);
    node.starRating = resolveRelation(node.starRating, ctx, ratingResolver);
    node = resolveNode(node, ctx, localBusinessResolver);
    return node;
  },
  resolveRootNode(node, ctx) {
    localBusinessResolver.resolveRootNode(node, ctx);
    return node;
  }
});
const howToStepDirectionResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "string") {
      return {
        text: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "HowToDirection"
  }
});
const howToStepResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "string") {
      return {
        text: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "HowToStep"
  },
  resolve(step, ctx) {
    if (step.url)
      step.url = resolveWithBase(ctx.meta.url, step.url);
    if (step.image) {
      step.image = resolveRelation(step.image, ctx, imageResolver, {
        root: true
      });
    }
    if (step.itemListElement)
      step.itemListElement = resolveRelation(step.itemListElement, ctx, howToStepDirectionResolver);
    return step;
  }
});
const HowToId = "#howto";
const howToResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "HowTo"
  },
  inheritMeta: [
    "description",
    "image",
    "inLanguage",
    { meta: "title", key: "name" }
  ],
  idPrefix: ["url", HowToId],
  resolve(node, ctx) {
    node.step = resolveRelation(node.step, ctx, howToStepResolver);
    return node;
  },
  resolveRootNode(node, { find }) {
    const webPage = find(PrimaryWebPageId);
    if (webPage)
      setIfEmpty(node, "mainEntityOfPage", idReference(webPage));
  }
});
const itemListResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "ItemList"
  },
  resolve(node, ctx) {
    if (node.itemListElement) {
      let index2 = 1;
      node.itemListElement = resolveRelation(node.itemListElement, ctx, listItemResolver, {
        array: true,
        afterResolve(node2) {
          setIfEmpty(node2, "position", index2++);
        }
      });
    }
    return node;
  }
});
const jobPostingResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "JobPosting"
  },
  idPrefix: ["url", "#job-posting"],
  resolve(node, ctx) {
    node.datePosted = resolvableDateToIso(node.datePosted);
    node.hiringOrganization = resolveRelation(node.hiringOrganization, ctx, organizationResolver);
    node.jobLocation = resolveRelation(node.jobLocation, ctx, placeResolver);
    node.baseSalary = resolveRelation(node.baseSalary, ctx, monetaryAmountResolver);
    node.validThrough = resolvableDateToIso(node.validThrough);
    return node;
  },
  resolveRootNode(jobPosting, { find }) {
    const webPage = find(PrimaryWebPageId);
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(jobPosting, "hiringOrganization", idReference(identity));
    if (webPage)
      setIfEmpty(jobPosting, "mainEntityOfPage", idReference(webPage));
    return jobPosting;
  }
});
const reviewResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Review"
  },
  inheritMeta: [
    "inLanguage"
  ],
  resolve(review, ctx) {
    review.reviewRating = resolveRelation(review.reviewRating, ctx, ratingResolver);
    review.author = resolveRelation(review.author, ctx, personResolver);
    return review;
  }
});
const videoResolver = defineSchemaOrgResolver({
  cast(input) {
    if (typeof input === "string") {
      input = {
        url: input
      };
    }
    return input;
  },
  alias: "video",
  defaults: {
    "@type": "VideoObject"
  },
  inheritMeta: [
    { meta: "title", key: "name" },
    "description",
    "image",
    "inLanguage",
    { meta: "datePublished", key: "uploadDate" }
  ],
  idPrefix: "host",
  resolve(video, ctx) {
    if (video.uploadDate)
      video.uploadDate = resolvableDateToIso(video.uploadDate);
    video.url = resolveWithBase(ctx.meta.host, video.url);
    if (video.caption && !video.description)
      video.description = video.caption;
    if (!video.description)
      video.description = "No description";
    if (video.thumbnailUrl)
      video.thumbnailUrl = resolveRelation(video.thumbnailUrl, ctx, imageResolver);
    return video;
  },
  resolveRootNode(video, { find }) {
    var _a2;
    if (video.image && !video.thumbnailUrl) {
      const firstImage = asArray(video.image)[0];
      setIfEmpty(video, "thumbnailUrl", (_a2 = find(firstImage["@id"])) == null ? void 0 : _a2.url);
    }
  }
});
const movieResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Movie"
  },
  resolve(node, ctx) {
    node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver);
    node.review = resolveRelation(node.review, ctx, reviewResolver);
    node.director = resolveRelation(node.director, ctx, personResolver);
    node.actor = resolveRelation(node.actor, ctx, personResolver);
    node.trailer = resolveRelation(node.trailer, ctx, videoResolver);
    if (node.dateCreated)
      node.dateCreated = resolvableDateToDate(node.dateCreated);
    return node;
  }
});
const defaults = Object.freeze({
  ignoreUnknown: false,
  respectType: false,
  respectFunctionNames: false,
  respectFunctionProperties: false,
  unorderedObjects: true,
  unorderedArrays: false,
  unorderedSets: false,
  excludeKeys: void 0,
  excludeValues: void 0,
  replacer: void 0
});
function objectHash(object, options) {
  if (options) {
    options = { ...defaults, ...options };
  } else {
    options = defaults;
  }
  const hasher = createHasher(options);
  hasher.dispatch(object);
  return hasher.toString();
}
const defaultPrototypesKeys = Object.freeze([
  "prototype",
  "__proto__",
  "constructor"
]);
function createHasher(options) {
  let buff = "";
  let context = /* @__PURE__ */ new Map();
  const write = (str) => {
    buff += str;
  };
  return {
    toString() {
      return buff;
    },
    getContext() {
      return context;
    },
    dispatch(value) {
      if (options.replacer) {
        value = options.replacer(value);
      }
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    },
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      if (objectLength < 10) {
        objType = "unknown:[" + objString + "]";
      } else {
        objType = objString.slice(8, objectLength - 1);
      }
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = context.get(object)) === void 0) {
        context.set(object, context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        write("buffer:");
        return write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else if (!options.ignoreUnknown) {
          this.unkown(object, objType);
        }
      } else {
        let keys = Object.keys(object);
        if (options.unorderedObjects) {
          keys = keys.sort();
        }
        let extraKeys = [];
        if (options.respectType !== false && !isNativeFunction(object)) {
          extraKeys = defaultPrototypesKeys;
        }
        if (options.excludeKeys) {
          keys = keys.filter((key) => {
            return !options.excludeKeys(key);
          });
          extraKeys = extraKeys.filter((key) => {
            return !options.excludeKeys(key);
          });
        }
        write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          write(":");
          if (!options.excludeValues) {
            this.dispatch(object[key]);
          }
          write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    },
    array(arr, unordered) {
      unordered = unordered === void 0 ? options.unorderedArrays !== false : unordered;
      write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry2 of arr) {
          this.dispatch(entry2);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry2) => {
        const hasher = createHasher(options);
        hasher.dispatch(entry2);
        for (const [key, value] of hasher.getContext()) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    },
    date(date) {
      return write("date:" + date.toJSON());
    },
    symbol(sym) {
      return write("symbol:" + sym.toString());
    },
    unkown(value, type) {
      write(type);
      if (!value) {
        return;
      }
      write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          Array.from(value.entries()),
          true
          /* ordered */
        );
      }
    },
    error(err) {
      return write("error:" + err.toString());
    },
    boolean(bool) {
      return write("bool:" + bool);
    },
    string(string) {
      write("string:" + string.length + ":");
      write(string);
    },
    function(fn) {
      write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
      if (options.respectFunctionNames !== false) {
        this.dispatch("function-name:" + String(fn.name));
      }
      if (options.respectFunctionProperties) {
        this.object(fn);
      }
    },
    number(number) {
      return write("number:" + number);
    },
    xml(xml) {
      return write("xml:" + xml.toString());
    },
    null() {
      return write("Null");
    },
    undefined() {
      return write("Undefined");
    },
    regexp(regex2) {
      return write("regex:" + regex2.toString());
    },
    uint8array(arr) {
      write("uint8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint8clampedarray(arr) {
      write("uint8clampedarray:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int8array(arr) {
      write("int8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint16array(arr) {
      write("uint16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int16array(arr) {
      write("int16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint32array(arr) {
      write("uint32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int32array(arr) {
      write("int32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float32array(arr) {
      write("float32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float64array(arr) {
      write("float64array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    arraybuffer(arr) {
      write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    },
    url(url) {
      return write("url:" + url.toString());
    },
    map(map) {
      write("map:");
      const arr = [...map];
      return this.array(arr, options.unorderedSets !== false);
    },
    set(set) {
      write("set:");
      const arr = [...set];
      return this.array(arr, options.unorderedSets !== false);
    },
    file(file) {
      write("file:");
      return this.dispatch([file.name, file.size, file.type, file.lastModfied]);
    },
    blob() {
      if (options.ignoreUnknown) {
        return write("[blob]");
      }
      throw new Error(
        'Hashing Blob objects is currently not supported\nUse "options.replacer" or "options.ignoreUnknown"\n'
      );
    },
    domwindow() {
      return write("domwindow");
    },
    bigint(number) {
      return write("bigint:" + number.toString());
    },
    /* Node.js standard native objects */
    process() {
      return write("process");
    },
    timer() {
      return write("timer");
    },
    pipe() {
      return write("pipe");
    },
    tcp() {
      return write("tcp");
    },
    udp() {
      return write("udp");
    },
    tty() {
      return write("tty");
    },
    statwatcher() {
      return write("statwatcher");
    },
    securecontext() {
      return write("securecontext");
    },
    connection() {
      return write("connection");
    },
    zlib() {
      return write("zlib");
    },
    context() {
      return write("context");
    },
    nodescript() {
      return write("nodescript");
    },
    httpparser() {
      return write("httpparser");
    },
    dataview() {
      return write("dataview");
    },
    signal() {
      return write("signal");
    },
    fsevent() {
      return write("fsevent");
    },
    tlswrap() {
      return write("tlswrap");
    }
  };
}
const nativeFunc = "[native code] }";
const nativeFuncLength = nativeFunc.length;
function isNativeFunction(f2) {
  if (typeof f2 !== "function") {
    return false;
  }
  return Function.prototype.toString.call(f2).slice(-nativeFuncLength) === nativeFunc;
}
class WordArray {
  constructor(words, sigBytes) {
    words = this.words = words || [];
    this.sigBytes = sigBytes === void 0 ? words.length * 4 : sigBytes;
  }
  toString(encoder) {
    return (encoder || Hex).stringify(this);
  }
  concat(wordArray) {
    this.clamp();
    if (this.sigBytes % 4) {
      for (let i = 0; i < wordArray.sigBytes; i++) {
        const thatByte = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
        this.words[this.sigBytes + i >>> 2] |= thatByte << 24 - (this.sigBytes + i) % 4 * 8;
      }
    } else {
      for (let j = 0; j < wordArray.sigBytes; j += 4) {
        this.words[this.sigBytes + j >>> 2] = wordArray.words[j >>> 2];
      }
    }
    this.sigBytes += wordArray.sigBytes;
    return this;
  }
  clamp() {
    this.words[this.sigBytes >>> 2] &= 4294967295 << 32 - this.sigBytes % 4 * 8;
    this.words.length = Math.ceil(this.sigBytes / 4);
  }
  clone() {
    return new WordArray([...this.words]);
  }
}
const Hex = {
  stringify(wordArray) {
    const hexChars = [];
    for (let i = 0; i < wordArray.sigBytes; i++) {
      const bite = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
      hexChars.push((bite >>> 4).toString(16), (bite & 15).toString(16));
    }
    return hexChars.join("");
  }
};
const Base64 = {
  stringify(wordArray) {
    const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const base64Chars = [];
    for (let i = 0; i < wordArray.sigBytes; i += 3) {
      const byte1 = wordArray.words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
      const byte2 = wordArray.words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
      const byte3 = wordArray.words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
      const triplet = byte1 << 16 | byte2 << 8 | byte3;
      for (let j = 0; j < 4 && i * 8 + j * 6 < wordArray.sigBytes * 8; j++) {
        base64Chars.push(keyStr.charAt(triplet >>> 6 * (3 - j) & 63));
      }
    }
    return base64Chars.join("");
  }
};
const Latin1 = {
  parse(latin1Str) {
    const latin1StrLength = latin1Str.length;
    const words = [];
    for (let i = 0; i < latin1StrLength; i++) {
      words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
    }
    return new WordArray(words, latin1StrLength);
  }
};
const Utf8 = {
  parse(utf8Str) {
    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
  }
};
class BufferedBlockAlgorithm {
  constructor() {
    this._data = new WordArray();
    this._nDataBytes = 0;
    this._minBufferSize = 0;
    this.blockSize = 512 / 32;
  }
  reset() {
    this._data = new WordArray();
    this._nDataBytes = 0;
  }
  _append(data) {
    if (typeof data === "string") {
      data = Utf8.parse(data);
    }
    this._data.concat(data);
    this._nDataBytes += data.sigBytes;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _doProcessBlock(_dataWords, _offset) {
  }
  _process(doFlush) {
    let processedWords;
    let nBlocksReady = this._data.sigBytes / (this.blockSize * 4);
    if (doFlush) {
      nBlocksReady = Math.ceil(nBlocksReady);
    } else {
      nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
    }
    const nWordsReady = nBlocksReady * this.blockSize;
    const nBytesReady = Math.min(nWordsReady * 4, this._data.sigBytes);
    if (nWordsReady) {
      for (let offset = 0; offset < nWordsReady; offset += this.blockSize) {
        this._doProcessBlock(this._data.words, offset);
      }
      processedWords = this._data.words.splice(0, nWordsReady);
      this._data.sigBytes -= nBytesReady;
    }
    return new WordArray(processedWords, nBytesReady);
  }
}
class Hasher extends BufferedBlockAlgorithm {
  update(messageUpdate) {
    this._append(messageUpdate);
    this._process();
    return this;
  }
  finalize(messageUpdate) {
    if (messageUpdate) {
      this._append(messageUpdate);
    }
  }
}
const H = [
  1779033703,
  -1150833019,
  1013904242,
  -1521486534,
  1359893119,
  -1694144372,
  528734635,
  1541459225
];
const K = [
  1116352408,
  1899447441,
  -1245643825,
  -373957723,
  961987163,
  1508970993,
  -1841331548,
  -1424204075,
  -670586216,
  310598401,
  607225278,
  1426881987,
  1925078388,
  -2132889090,
  -1680079193,
  -1046744716,
  -459576895,
  -272742522,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  -1740746414,
  -1473132947,
  -1341970488,
  -1084653625,
  -958395405,
  -710438585,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  -2117940946,
  -1838011259,
  -1564481375,
  -1474664885,
  -1035236496,
  -949202525,
  -778901479,
  -694614492,
  -200395387,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  -2067236844,
  -1933114872,
  -1866530822,
  -1538233109,
  -1090935817,
  -965641998
];
const W = [];
class SHA256 extends Hasher {
  constructor() {
    super(...arguments);
    this._hash = new WordArray([...H]);
  }
  reset() {
    super.reset();
    this._hash = new WordArray([...H]);
  }
  _doProcessBlock(M, offset) {
    const H2 = this._hash.words;
    let a2 = H2[0];
    let b = H2[1];
    let c = H2[2];
    let d2 = H2[3];
    let e = H2[4];
    let f2 = H2[5];
    let g2 = H2[6];
    let h2 = H2[7];
    for (let i = 0; i < 64; i++) {
      if (i < 16) {
        W[i] = M[offset + i] | 0;
      } else {
        const gamma0x = W[i - 15];
        const gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
        const gamma1x = W[i - 2];
        const gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
        W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
      }
      const ch = e & f2 ^ ~e & g2;
      const maj = a2 & b ^ a2 & c ^ b & c;
      const sigma0 = (a2 << 30 | a2 >>> 2) ^ (a2 << 19 | a2 >>> 13) ^ (a2 << 10 | a2 >>> 22);
      const sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
      const t1 = h2 + sigma1 + ch + K[i] + W[i];
      const t2 = sigma0 + maj;
      h2 = g2;
      g2 = f2;
      f2 = e;
      e = d2 + t1 | 0;
      d2 = c;
      c = b;
      b = a2;
      a2 = t1 + t2 | 0;
    }
    H2[0] = H2[0] + a2 | 0;
    H2[1] = H2[1] + b | 0;
    H2[2] = H2[2] + c | 0;
    H2[3] = H2[3] + d2 | 0;
    H2[4] = H2[4] + e | 0;
    H2[5] = H2[5] + f2 | 0;
    H2[6] = H2[6] + g2 | 0;
    H2[7] = H2[7] + h2 | 0;
  }
  finalize(messageUpdate) {
    super.finalize(messageUpdate);
    const nBitsTotal = this._nDataBytes * 8;
    const nBitsLeft = this._data.sigBytes * 8;
    this._data.words[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
    this._data.words[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(
      nBitsTotal / 4294967296
    );
    this._data.words[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
    this._data.sigBytes = this._data.words.length * 4;
    this._process();
    return this._hash;
  }
}
function sha256base64(message) {
  return new SHA256().finalize(message).toString(Base64);
}
function hash(object, options = {}) {
  const hashed = typeof object === "string" ? object : objectHash(object, options);
  return sha256base64(hashed).slice(0, 10);
}
const ProductId = "#product";
const productResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Product"
  },
  inheritMeta: [
    "description",
    "image",
    { meta: "title", key: "name" }
  ],
  idPrefix: ["url", ProductId],
  resolve(node, ctx) {
    setIfEmpty(node, "sku", hash(node.name));
    node.aggregateOffer = resolveRelation(node.aggregateOffer, ctx, aggregateOfferResolver);
    node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver);
    node.offers = resolveRelation(node.offers, ctx, offerResolver);
    node.review = resolveRelation(node.review, ctx, reviewResolver);
    return node;
  },
  resolveRootNode(product, { find }) {
    const webPage = find(PrimaryWebPageId);
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(product, "brand", idReference(identity));
    if (webPage)
      setIfEmpty(product, "mainEntityOfPage", idReference(webPage));
    return product;
  }
});
const answerResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "string") {
      return {
        text: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "Answer"
  }
});
const questionResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Question"
  },
  inheritMeta: [
    "inLanguage"
  ],
  idPrefix: "url",
  resolve(question, ctx) {
    if (question.question) {
      question.name = question.question;
      delete question.question;
    }
    if (question.answer) {
      question.acceptedAnswer = question.answer;
      delete question.answer;
    }
    question.acceptedAnswer = resolveRelation(question.acceptedAnswer, ctx, answerResolver);
    return question;
  },
  resolveRootNode(question, { find }) {
    const webPage = find(PrimaryWebPageId);
    if (webPage && asArray(webPage["@type"]).includes("FAQPage"))
      dedupeMerge(webPage, "mainEntity", idReference(question));
  }
});
const RecipeId = "#recipe";
const recipeResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Recipe"
  },
  inheritMeta: [
    { meta: "title", key: "name" },
    "description",
    "image",
    "datePublished"
  ],
  idPrefix: ["url", RecipeId],
  resolve(node, ctx) {
    node.recipeInstructions = resolveRelation(node.recipeInstructions, ctx, howToStepResolver);
    return node;
  },
  resolveRootNode(node, { find }) {
    const article = find(PrimaryArticleId);
    const webPage = find(PrimaryWebPageId);
    if (article)
      setIfEmpty(node, "mainEntityOfPage", idReference(article));
    else if (webPage)
      setIfEmpty(node, "mainEntityOfPage", idReference(webPage));
    if (article == null ? void 0 : article.author)
      setIfEmpty(node, "author", article.author);
    return node;
  }
});
const softwareAppResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "SoftwareApplication"
  },
  resolve(node, ctx) {
    resolveDefaultType(node, "SoftwareApplication");
    node.offers = resolveRelation(node.offers, ctx, offerResolver);
    node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver);
    node.review = resolveRelation(node.review, ctx, reviewResolver);
    return node;
  }
});
function defineHeadPlugin(plugin2) {
  return plugin2;
}
function hashCode(s2) {
  let h2 = 9;
  for (let i = 0; i < s2.length; )
    h2 = Math.imul(h2 ^ s2.charCodeAt(i++), 9 ** 9);
  return ((h2 ^ h2 >>> 9) + 65536).toString(16).substring(1, 8).toLowerCase();
}
const sepSub = "%separator";
function processTemplateParams(s2, p2, sep) {
  if (typeof s2 !== "string" || !s2.includes("%"))
    return s2;
  function sub(token) {
    let val;
    if (["s", "pageTitle"].includes(token)) {
      val = p2.pageTitle;
    } else if (token.includes(".")) {
      val = token.split(".").reduce((acc, key) => acc ? acc[key] || void 0 : void 0, p2);
    } else {
      val = p2[token];
    }
    return typeof val !== "undefined" ? (val || "").replace(/"/g, '\\"') : false;
  }
  let decoded = s2;
  try {
    decoded = decodeURI(s2);
  } catch {
  }
  const tokens = (decoded.match(/%(\w+\.+\w+)|%(\w+)/g) || []).sort().reverse();
  tokens.forEach((token) => {
    const re = sub(token.slice(1));
    if (typeof re === "string") {
      s2 = s2.replace(new RegExp(`\\${token}(\\W|$)`, "g"), (_, args) => `${re}${args}`).trim();
    }
  });
  if (s2.includes(sepSub)) {
    if (s2.endsWith(sepSub))
      s2 = s2.slice(0, -sepSub.length).trim();
    if (s2.startsWith(sepSub))
      s2 = s2.slice(sepSub.length).trim();
    s2 = s2.replace(new RegExp(`\\${sepSub}\\s*\\${sepSub}`, "g"), sepSub);
    s2 = processTemplateParams(s2, { separator: sep }, sep);
  }
  return s2;
}
function loadResolver(resolver2) {
  switch (resolver2) {
    case "address":
      return addressResolver;
    case "aggregateOffer":
      return aggregateOfferResolver;
    case "aggregateRating":
      return aggregateRatingResolver;
    case "article":
      return articleResolver;
    case "breadcrumb":
      return breadcrumbResolver;
    case "comment":
      return commentResolver;
    case "event":
      return eventResolver;
    case "foodEstablishment":
      return foodEstablishmentResolver;
    case "virtualLocation":
      return virtualLocationResolver;
    case "place":
      return placeResolver;
    case "howTo":
      return howToResolver;
    case "howToStep":
      return howToStepResolver;
    case "image":
      return imageResolver;
    case "localBusiness":
      return localBusinessResolver;
    case "offer":
      return offerResolver;
    case "openingHours":
      return openingHoursResolver;
    case "organization":
      return organizationResolver;
    case "person":
      return personResolver;
    case "product":
      return productResolver;
    case "question":
      return questionResolver;
    case "recipe":
      return recipeResolver;
    case "review":
      return reviewResolver;
    case "video":
      return videoResolver;
    case "webPage":
      return webPageResolver;
    case "webSite":
      return webSiteResolver;
    case "book":
      return bookResolver;
    case "course":
      return courseResolver;
    case "itemList":
      return itemListResolver;
    case "jobPosting":
      return jobPostingResolver;
    case "listItem":
      return listItemResolver;
    case "movie":
      return movieResolver;
    case "searchAction":
      return searchActionResolver;
    case "readAction":
      return readActionResolver;
    case "softwareApp":
      return softwareAppResolver;
    case "bookEdition":
      return bookEditionResolver;
  }
  return null;
}
const resolver = {
  __proto__: null,
  loadResolver
};
function resolveMeta(meta) {
  if (!meta.host && meta.canonicalHost)
    meta.host = meta.canonicalHost;
  if (!meta.tagPosition && meta.position)
    meta.tagPosition = meta.position;
  if (!meta.currency && meta.defaultCurrency)
    meta.currency = meta.defaultCurrency;
  if (!meta.inLanguage && meta.defaultLanguage)
    meta.inLanguage = meta.defaultLanguage;
  if (!meta.path)
    meta.path = "/";
  if (!meta.host && false)
    meta.host = (void 0).location.host;
  if (!meta.url && meta.canonicalUrl)
    meta.url = meta.canonicalUrl;
  if (meta.path !== "/") {
    if (meta.trailingSlash && !hasTrailingSlash(meta.path))
      meta.path = withTrailingSlash(meta.path);
    else if (!meta.trailingSlash && hasTrailingSlash(meta.path))
      meta.path = withoutTrailingSlash(meta.path);
  }
  meta.url = joinURL(meta.host || "", meta.path);
  return {
    ...meta,
    host: meta.host,
    url: meta.url,
    currency: meta.currency,
    image: meta.image,
    inLanguage: meta.inLanguage,
    title: meta.title,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified
  };
}
function resolveNode(node, ctx, resolver2) {
  var _a2;
  if (resolver2 == null ? void 0 : resolver2.cast)
    node = resolver2.cast(node, ctx);
  if (resolver2 == null ? void 0 : resolver2.defaults) {
    let defaults2 = resolver2.defaults || {};
    if (typeof defaults2 === "function")
      defaults2 = defaults2(ctx);
    node = {
      ...defaults2,
      ...node
    };
  }
  (_a2 = resolver2.inheritMeta) == null ? void 0 : _a2.forEach((entry2) => {
    if (typeof entry2 === "string")
      setIfEmpty(node, entry2, ctx.meta[entry2]);
    else
      setIfEmpty(node, entry2.key, ctx.meta[entry2.meta]);
  });
  if (resolver2 == null ? void 0 : resolver2.resolve)
    node = resolver2.resolve(node, ctx);
  for (const k2 in node) {
    const v = node[k2];
    if (typeof v === "object" && (v == null ? void 0 : v._resolver))
      node[k2] = resolveRelation(v, ctx, v._resolver);
  }
  stripEmptyProperties(node);
  return node;
}
function resolveNodeId(node, ctx, resolver2, resolveAsRoot = false) {
  var _a2, _b2, _c;
  if (node["@id"] && node["@id"].startsWith("http"))
    return node;
  const prefix = (Array.isArray(resolver2.idPrefix) ? resolver2.idPrefix[0] : resolver2.idPrefix) || "url";
  const rootId = node["@id"] || (Array.isArray(resolver2.idPrefix) ? (_a2 = resolver2.idPrefix) == null ? void 0 : _a2[1] : void 0);
  if (!node["@id"] && resolveAsRoot && rootId) {
    node["@id"] = prefixId(ctx.meta[prefix], rootId);
    return node;
  }
  if ((_b2 = node["@id"]) == null ? void 0 : _b2.startsWith("#/schema/")) {
    node["@id"] = prefixId(ctx.meta[prefix], node["@id"]);
    return node;
  }
  let alias = resolver2 == null ? void 0 : resolver2.alias;
  if (!alias) {
    const type = ((_c = asArray(node["@type"])) == null ? void 0 : _c[0]) || "";
    alias = type.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  const hashNodeData = {};
  Object.entries(node).forEach(([key, val]) => {
    if (!key.startsWith("_"))
      hashNodeData[key] = val;
  });
  node["@id"] = prefixId(ctx.meta[prefix], `#/schema/${alias}/${node["@id"] || hashCode(JSON.stringify(hashNodeData))}`);
  return node;
}
function resolveRelation(input, ctx, fallbackResolver, options = {}) {
  if (!input)
    return input;
  const ids = asArray(input).map((a2) => {
    var _a2;
    const keys = Object.keys(a2).length;
    if (keys === 1 && a2["@id"] || keys === 2 && a2["@id"] && a2["@type"]) {
      return {
        // we drop @type
        "@id": ((_a2 = ctx.find(a2["@id"])) == null ? void 0 : _a2["@id"]) || a2["@id"]
      };
    }
    let resolver2 = fallbackResolver;
    if (a2._resolver) {
      resolver2 = a2._resolver;
      if (typeof resolver2 === "string")
        resolver2 = loadResolver(resolver2);
      delete a2._resolver;
    }
    if (!resolver2)
      return a2;
    let node = resolveNode(a2, ctx, resolver2);
    if (options.afterResolve)
      options.afterResolve(node);
    if (options.generateId || options.root)
      node = resolveNodeId(node, ctx, resolver2, false);
    if (options.root) {
      if (resolver2.resolveRootNode)
        resolver2.resolveRootNode(node, ctx);
      ctx.push(node);
      return idReference(node["@id"]);
    }
    return node;
  });
  if (!options.array && ids.length === 1)
    return ids[0];
  return ids;
}
function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}
function _defu(baseObject, defaults2, namespace = ".", merger) {
  if (!isPlainObject(defaults2)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults2);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p2, c) => _defu(p2, c, "", merger), {})
  );
}
function groupBy(array, predicate) {
  return array.reduce((acc, value, index2, array2) => {
    const key = predicate(value, index2, array2);
    if (!acc[key])
      acc[key] = [];
    acc[key].push(value);
    return acc;
  }, {});
}
function uniqueBy(array, predicate) {
  return Object.values(groupBy(array, predicate)).map((a2) => a2[a2.length - 1]);
}
const merge = createDefu((object, key, value) => {
  if (Array.isArray(object[key])) {
    object[key] = [.../* @__PURE__ */ new Set([...object[key], ...value])];
    if (key === "itemListElement") {
      object[key] = [...uniqueBy(object[key], (item) => item.position)];
    }
    return true;
  }
});
function dedupeNodes(nodes) {
  const dedupedNodes = {};
  for (const key of nodes.keys()) {
    const n2 = nodes[key];
    const nodeKey = resolveAsGraphKey(n2["@id"] || hash(n2));
    if (dedupedNodes[nodeKey])
      dedupedNodes[nodeKey] = merge(nodes[key], dedupedNodes[nodeKey]);
    else
      dedupedNodes[nodeKey] = nodes[key];
  }
  return Object.values(dedupedNodes);
}
function normaliseNodes(nodes) {
  const sortedNodeKeys = nodes.keys();
  const dedupedNodes = {};
  for (const key of sortedNodeKeys) {
    const n2 = nodes[key];
    const nodeKey = resolveAsGraphKey(n2["@id"] || hash(n2));
    const groupedKeys = groupBy(Object.keys(n2), (key2) => {
      const val = n2[key2];
      if (key2.startsWith("_"))
        return "ignored";
      if (Array.isArray(val) || typeof val === "object")
        return "relations";
      return "primitives";
    });
    const keys = [
      ...(groupedKeys.primitives || []).sort(),
      ...(groupedKeys.relations || []).sort()
    ];
    let newNode = {};
    for (const key2 of keys)
      newNode[key2] = n2[key2];
    if (dedupedNodes[nodeKey])
      newNode = merge(newNode, dedupedNodes[nodeKey]);
    dedupedNodes[nodeKey] = newNode;
  }
  return Object.values(dedupedNodes);
}
function createSchemaOrgGraph() {
  const ctx = {
    find(id) {
      const key = resolveAsGraphKey(id);
      return ctx.nodes.filter((n2) => !!n2["@id"]).find((n2) => resolveAsGraphKey(n2["@id"]) === key);
    },
    push(input) {
      asArray(input).forEach((node) => {
        const registeredNode = node;
        ctx.nodes.push(registeredNode);
      });
    },
    resolveGraph(meta) {
      ctx.meta = resolveMeta({ ...meta });
      ctx.nodes.forEach((node, key) => {
        const resolver2 = node._resolver;
        if (resolver2) {
          node = resolveNode(node, ctx, resolver2);
          node = resolveNodeId(node, ctx, resolver2, true);
        }
        ctx.nodes[key] = node;
      });
      ctx.nodes = dedupeNodes(ctx.nodes);
      ctx.nodes.forEach((node) => {
        var _a2;
        if (node.image && typeof node.image === "string") {
          node.image = resolveRelation(node.image, ctx, imageResolver, {
            root: true
          });
        }
        if ((_a2 = node._resolver) == null ? void 0 : _a2.resolveRootNode)
          node._resolver.resolveRootNode(node, ctx);
        delete node._resolver;
      });
      return normaliseNodes(ctx.nodes);
    },
    nodes: [],
    meta: {}
  };
  return ctx;
}
function SchemaOrgUnheadPlugin(config, meta, options) {
  config = resolveMeta({ ...config });
  let graph;
  let resolvedMeta = {};
  return defineHeadPlugin((head) => ({
    key: "schema-org",
    hooks: {
      "entries:resolve": function() {
        graph = createSchemaOrgGraph();
      },
      "tag:normalise": async function({ tag }) {
        if (tag.key === "schema-org-graph") {
          const { loadResolver: loadResolver2 } = await Promise.resolve().then(function() {
            return resolver;
          });
          const nodes = await tag.props.nodes;
          for (const node of Array.isArray(nodes) ? nodes : [nodes]) {
            const newNode = {
              ...node,
              _resolver: loadResolver2(await node._resolver)
            };
            graph.push(newNode);
          }
          tag.tagPosition = tag.tagPosition || config.tagPosition === "head" ? "head" : "bodyClose";
        }
        if (tag.tag === "htmlAttrs" && tag.props.lang) {
          resolvedMeta.inLanguage = tag.props.lang;
        } else if (tag.tag === "title") {
          resolvedMeta.title = tag.textContent;
        } else if (tag.tag === "meta" && tag.props.name === "description") {
          resolvedMeta.description = tag.props.content;
        } else if (tag.tag === "link" && tag.props.rel === "canonical") {
          resolvedMeta.url = tag.props.href;
          if (resolvedMeta.url && !resolvedMeta.host) {
            try {
              resolvedMeta.host = new URL(resolvedMeta.url).origin;
            } catch {
            }
          }
        } else if (tag.tag === "meta" && tag.props.property === "og:image") {
          resolvedMeta.image = tag.props.content;
        } else if (tag.tag === "templateParams" && tag.props.schemaOrg) {
          resolvedMeta = {
            ...resolvedMeta,
            // @ts-expect-error untyped
            ...tag.props.schemaOrg
          };
          delete tag.props.schemaOrg;
        }
      },
      "tags:resolve": async function(ctx) {
        for (const tag of ctx.tags) {
          if (tag.tag === "script" && tag.key === "schema-org-graph") {
            const minify = (options == null ? void 0 : options.minify) || "production" === "production";
            tag.innerHTML = JSON.stringify({
              "@context": "https://schema.org",
              "@graph": graph.resolveGraph({ ...await (meta == null ? void 0 : meta()) || {}, ...config, ...resolvedMeta })
            }, (_, value) => {
              if (typeof value !== "object")
                return processTemplateParams(value, head._templateParams, head._separator);
              return value;
            }, minify ? 0 : 2);
            delete tag.props.nodes;
            return;
          }
        }
      }
    }
  }));
}
function provideResolver(input, resolver2) {
  if (!input)
    input = {};
  input._resolver = resolver2;
  return input;
}
function defineOrganization(input) {
  return provideResolver(input, "organization");
}
function definePerson(input) {
  return provideResolver(input, "person");
}
function defineWebPage(input) {
  return provideResolver(input, "webPage");
}
function defineWebSite(input) {
  return provideResolver(input, "webSite");
}
function useSchemaOrg(input) {
  const _config = /* @__PURE__ */ useRuntimeConfig();
  const config = _config["nuxt-schema-org"] || _config.public["nuxt-schema-org"];
  const script = {
    type: "application/ld+json",
    key: "schema-org-graph",
    nodes: input,
    ...(config == null ? void 0 : config.scriptAttributes) || {}
  };
  {
    return useServerHead({
      script: [script]
    });
  }
}
const defaults_aYWR4zAmPY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-schema-org:defaults",
  setup() {
    const _config = /* @__PURE__ */ useRuntimeConfig();
    const runtimeConfig = _config["nuxt-schema-org"] || _config.public["nuxt-schema-org"];
    const siteConfig = useSiteConfig();
    if (!(siteConfig == null ? void 0 : siteConfig.name))
      return;
    useSchemaOrg([
      defineWebSite({
        name: (siteConfig == null ? void 0 : siteConfig.name) || "",
        inLanguage: (siteConfig == null ? void 0 : siteConfig.currentLocale) || "",
        description: (siteConfig == null ? void 0 : siteConfig.description) || ""
      }),
      defineWebPage()
    ]);
    if (runtimeConfig.identity || siteConfig.identity) {
      const identity = runtimeConfig.identity || siteConfig.identity;
      let identityPayload = {
        name: siteConfig.name,
        url: siteConfig.url
      };
      let identityType = "Organization";
      if (typeof identity !== "string") {
        identityPayload = defu(identity, identityPayload);
        identityType = identity.type;
        delete identityPayload.type;
      } else {
        identityType = identity;
      }
      if (siteConfig.twitter) {
        const id = siteConfig.twitter.startsWith("@") ? siteConfig.twitter.slice(1) : siteConfig.twitter;
        identityPayload.sameAs = [
          `https://twitter.com/${id}`
        ];
      }
      useSchemaOrg([
        identityType === "Person" ? definePerson(identityPayload) : defineOrganization(identityPayload)
      ]);
    }
  }
});
function isInternalRoute(path) {
  return path.startsWith("/_") || path.startsWith("@");
}
function filterIsOgImageOption(key) {
  const keys = [
    "url",
    "extension",
    "width",
    "height",
    "fonts",
    "alt",
    "props",
    "renderer",
    "html",
    "component",
    "renderer",
    "emojis",
    "_query",
    "satori",
    "resvg",
    "sharp",
    "screenshot",
    "cacheMaxAgeSeconds"
  ];
  return keys.includes(key);
}
function separateProps(options, ignoreKeys = []) {
  options = options || {};
  const _props = defu(options.props, Object.fromEntries(
    Object.entries({ ...options }).filter(([k2]) => !filterIsOgImageOption(k2) && !ignoreKeys.includes(k2))
  ));
  const props = {};
  Object.entries(_props).forEach(([key, val]) => {
    props[key.replace(/-([a-z])/g, (g2) => g2[1].toUpperCase())] = val;
  });
  return {
    ...Object.fromEntries(
      Object.entries({ ...options }).filter(([k2]) => filterIsOgImageOption(k2) || ignoreKeys.includes(k2))
    ),
    props
  };
}
function withoutQuery(path) {
  return path.split("?")[0];
}
function getExtension(path) {
  path = withoutQuery(path);
  const lastSegment = path.split("/").pop() || path;
  return lastSegment.split(".").pop() || lastSegment;
}
const og_image_canonical_urls_server_uBBMpDJVTb = /* @__PURE__ */ defineNuxtPlugin({
  setup(nuxtApp) {
    nuxtApp.hooks.hook("app:rendered", async (ctx) => {
      const { ssrContext } = ctx;
      const e = useRequestEvent();
      const path = parseURL(e.path).pathname;
      if (isInternalRoute(path))
        return;
      ssrContext == null ? void 0 : ssrContext.head.use({
        key: "nuxt-og-image:overrides-and-canonical-urls",
        hooks: {
          "tags:resolve": async (ctx2) => {
            const hasPrimaryPayload = ctx2.tags.some((tag) => tag.tag === "script" && tag.props.id === "nuxt-og-image-options");
            let overrides;
            for (const tag of ctx2.tags) {
              if (tag.tag === "script" && tag.props.id === "nuxt-og-image-overrides") {
                if (hasPrimaryPayload) {
                  overrides = separateProps(JSON.parse(tag.innerHTML || "{}"));
                  delete ctx2.tags[ctx2.tags.indexOf(tag)];
                } else {
                  tag.props.id = "nuxt-og-image-options";
                  tag.innerHTML = JSON.stringify(separateProps(JSON.parse(tag.innerHTML || "{}")));
                  tag._d = "script:id:nuxt-og-image-options";
                }
                break;
              }
            }
            ctx2.tags = ctx2.tags.filter(Boolean);
            for (const tag of ctx2.tags) {
              if (tag.tag === "meta" && (tag.props.property === "og:image" || ["twitter:image:src", "twitter:image"].includes(tag.props.name))) {
                if (!tag.props.content.startsWith("https")) {
                  await nuxtApp.runWithContext(() => {
                    tag.props.content = toValue(withSiteUrl(tag.props.content, {
                      withBase: true
                    }));
                  });
                }
              } else if (overrides && tag.tag === "script" && tag.props.id === "nuxt-og-image-options") {
                tag.innerHTML = JSON.stringify(defu(overrides, JSON.parse(tag.innerHTML)));
              }
            }
          }
        }
      });
    });
  }
});
function getOgImagePath(pagePath, _options) {
  const baseURL2 = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
  const options = defu(_options, useOgImageRuntimeConfig().defaults);
  return joinURL("/", baseURL2, "__og-image__/image", pagePath, `og.${options.extension}`);
}
function useOgImageRuntimeConfig() {
  return (/* @__PURE__ */ useRuntimeConfig())["nuxt-og-image"];
}
const componentNames = [{ "hash": "i0Vxmj8bqg", "pascalName": "BrandedLogo", "kebabName": "branded-logo", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }, { "hash": "tBHg51xiAt", "pascalName": "Frame", "kebabName": "frame", "category": "community", "credits": "@arashsheyda <https://github.com/arashsheyda>" }, { "hash": "EtP6PjHVxf", "pascalName": "Nuxt", "kebabName": "nuxt", "category": "community", "credits": "NuxtLabs <https://nuxtlabs.com/>" }, { "hash": "LZkuSUuPEa", "pascalName": "NuxtSeo", "kebabName": "nuxt-seo", "category": "community", "credits": "Nuxt SEO <https://nuxtseo.com/>" }, { "hash": "KfQI8hATPp", "pascalName": "Pergel", "kebabName": "pergel", "category": "community", "credits": "Pergel <https://nuxtlabs.com/>" }, { "hash": "YDrRRvPRVl", "pascalName": "SimpleBlog", "kebabName": "simple-blog", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }, { "hash": "wt558K6QyQ", "pascalName": "UnJs", "kebabName": "un-js", "category": "community", "credits": "UnJS <https://unjs.io/>" }, { "hash": "6RdQZcuwZZ", "pascalName": "Wave", "kebabName": "wave", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }, { "hash": "gaB1TrbtTl", "pascalName": "WithEmoji", "kebabName": "with-emoji", "category": "community", "credits": "Full Stack Heroes <https://fullstackheroes.com/>" }];
function createOgImageMeta(src, input, resolvedOptions, ssrContext) {
  const _input = separateProps(defu(input, ssrContext._ogImagePayload));
  let url = src || input.url || resolvedOptions.url;
  if (!url)
    return;
  if (input._query && Object.keys(input._query).length && url)
    url = withQuery(url, { _query: input._query });
  let urlExtension = getExtension(url) || resolvedOptions.extension;
  if (urlExtension === "jpg")
    urlExtension = "jpeg";
  const meta = [
    { property: "og:image", content: url },
    { property: "og:image:type", content: `image/${urlExtension}` },
    { name: "twitter:card", content: "summary_large_image" },
    // we don't need this but avoids issue when using useSeoMeta({ twitterImage })
    { name: "twitter:image", content: url },
    { name: "twitter:image:src", content: url }
  ];
  if (resolvedOptions.width) {
    meta.push({ property: "og:image:width", content: resolvedOptions.width });
    meta.push({ name: "twitter:image:width", content: resolvedOptions.width });
  }
  if (resolvedOptions.height) {
    meta.push({ property: "og:image:height", content: resolvedOptions.height });
    meta.push({ name: "twitter:image:height", content: resolvedOptions.height });
  }
  if (resolvedOptions.alt) {
    meta.push({ property: "og:image:alt", content: resolvedOptions.alt });
    meta.push({ name: "twitter:image:alt", content: resolvedOptions.alt });
  }
  ssrContext._ogImageInstances = ssrContext._ogImageInstances || [];
  const script = [];
  if (src) {
    script.push({
      id: "nuxt-og-image-options",
      type: "application/json",
      processTemplateParams: true,
      innerHTML: () => {
        if (!_input.props.title)
          _input.props.title = "%s";
        delete _input.url;
        return _input;
      },
      // we want this to be last in our head
      tagPosition: "bodyClose"
    });
  }
  const instance = useServerHead({
    script,
    meta
  }, {
    tagPriority: 35
  });
  ssrContext._ogImagePayload = _input;
  ssrContext._ogImageInstances.push(instance);
}
function normaliseOptions(_options) {
  const options = { ...unref(_options) };
  if (!options)
    return options;
  if (options.component && componentNames) {
    const originalName = options.component;
    for (const component of componentNames) {
      if (component.pascalName.endsWith(originalName) || component.kebabName.endsWith(originalName)) {
        options.component = component.pascalName;
        break;
      }
    }
  }
  return options;
}
const route_rule_og_image_server_9IFT9zRc5G = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook("app:rendered", async (ctx) => {
    var _a2, _b2, _c, _d, _e, _f;
    const { ssrContext } = ctx;
    const e = useRequestEvent();
    const path = parseURL(e.path).pathname;
    if (isInternalRoute(path))
      return;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (_b2 = (_a2 = ssrContext == null ? void 0 : ssrContext.runtimeConfig) == null ? void 0 : _a2.nitro) == null ? void 0 : _b2.routeRules })
    );
    let routeRules = defu({}, ..._routeRulesMatcher.matchAll(
      withoutBase(path.split("?")[0], (_c = ssrContext == null ? void 0 : ssrContext.runtimeConfig) == null ? void 0 : _c.app.baseURL)
    ).reverse()).ogImage;
    if (typeof routeRules === "undefined")
      return;
    const ogImageInstances = nuxtApp.ssrContext._ogImageInstances || [];
    if (routeRules === false) {
      ogImageInstances == null ? void 0 : ogImageInstances.forEach((e2) => {
        e2.dispose();
      });
      nuxtApp.ssrContext._ogImagePayload = void 0;
      nuxtApp.ssrContext._ogImageInstances = void 0;
      return;
    }
    routeRules = defu((_f = (_e = (_d = nuxtApp.ssrContext) == null ? void 0 : _d.event.context._nitro) == null ? void 0 : _e.routeRules) == null ? void 0 : _f.ogImage, routeRules);
    const { defaults: defaults2 } = useOgImageRuntimeConfig();
    const resolvedOptions = normaliseOptions(defu(routeRules, defaults2));
    const src = getOgImagePath(ssrContext.url, resolvedOptions);
    createOgImageMeta(src, routeRules, resolvedOptions, nuxtApp.ssrContext);
  });
});
const robot_meta_server_sGSyPLT16Y = /* @__PURE__ */ defineNuxtPlugin({
  setup() {
    const event = useRequestEvent();
    const ctx = event.context.robots;
    if (!ctx)
      return;
    useServerHead({
      meta: [
        {
          "name": "robots",
          "content": () => ctx.rule || "",
          "data-hint": void 0
        }
      ]
    });
  }
});
const _1_absoluteImageUrls_server_uDLpqRpnfs = /* @__PURE__ */ defineNuxtPlugin({
  enforce: "post",
  setup() {
    const head = injectHead();
    if (!head)
      return;
    const resolver2 = createSitePathResolver({
      withBase: true,
      absolute: true,
      canonical: true
    });
    head.use({
      hooks: {
        "tags:resolve": async ({ tags }) => {
          for (const tag of tags) {
            if (tag.tag !== "meta")
              continue;
            if (tag.props.property !== "og:image:url" && tag.props.property !== "og:image" && tag.props.name !== "twitter:image")
              continue;
            if (!tag.props.content || tag.props.content.startsWith("http") || tag.props.content.startsWith("//"))
              continue;
            tag.props.content = unref(resolver2(tag.props.content));
          }
        }
      }
    });
  }
});
const _0_routeRules_server_iSLG4lfij8 = /* @__PURE__ */ defineNuxtPlugin({
  enforce: "post",
  async setup() {
    const head = injectHead();
    if (!head)
      return;
    const event = useRequestEvent();
    if (event.context._nitro.routeRules.head)
      head.push(event.context._nitro.routeRules.head, { mode: "server" });
    if (event.context._nitro.routeRules.seoMeta) {
      const meta = unpackMeta({ ...event.context._nitro.routeRules.seoMeta });
      head.push({
        meta
      }, { mode: "server" });
    }
  }
});
const init_RfgMPjTY0q = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-schema-org:init",
  enforce: "post",
  setup(nuxtApp) {
    const head = injectHead();
    const _config = /* @__PURE__ */ useRuntimeConfig();
    const config = _config["nuxt-schema-org"] || _config.public["nuxt-schema-org"];
    const route = useRoute();
    const siteConfig = useSiteConfig();
    const schemaOrg = computed(() => {
      var _a2;
      return {
        ...((_a2 = route.meta) == null ? void 0 : _a2.schemaOrg) || {},
        ...siteConfig,
        url: joinURL(siteConfig.url, route.path),
        host: siteConfig.url,
        inLanguage: siteConfig.currentLocale || siteConfig.defaultLocale,
        path: route.path
      };
    });
    head.push({ templateParams: { schemaOrg } });
    head.use(
      SchemaOrgUnheadPlugin({}, async () => {
        const meta = {};
        await nuxtApp.hooks.callHook("schema-org:meta", meta);
        return meta;
      }, {
        minify: config.minify,
        trailingSlash: siteConfig.trailingSlash
      })
    );
  }
});
const plugins = [
  unhead_U5AvFftZjU,
  plugin,
  _0_siteConfig_mHGp1pr5of,
  revive_payload_server_TQclto8luf,
  components_plugin_KR1HBZs4kY,
  plugin_server_UjgSp5LyFq,
  plugin_w7DVyfeAvj,
  titles_nhjfi2YhEr,
  defaults_5dmr8LrVoI,
  siteConfig_oGyOQof5Or,
  inferSeoMetaPlugin_wAXpBSJ4Qi,
  defaults_aYWR4zAmPY,
  og_image_canonical_urls_server_uBBMpDJVTb,
  route_rule_og_image_server_9IFT9zRc5G,
  robot_meta_server_sGSyPLT16Y,
  _1_absoluteImageUrls_server_uDLpqRpnfs,
  _0_routeRules_server_iSLG4lfij8,
  init_RfgMPjTY0q
];
const layouts = {};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => h(LayoutComponent, props.layoutProps, context.slots);
  }
});
const __nuxt_component_0$3 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    },
    fallback: {
      type: [String, Object],
      default: null
    }
  },
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = ref();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    return () => {
      var _a2, _b2;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b2 = (_a2 = context.slots).default) == null ? void 0 : _b2.call(_a2);
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
const __nuxt_component_0$2 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots, attrs }) {
    const mounted = ref(false);
    provide(clientOnlySymbol, true);
    return (props) => {
      var _a2;
      if (mounted.value) {
        return (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$4 = {
  name: componentName,
  props: {
    placeholder: String,
    tag: {
      type: String,
      default: "span"
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ClientOnly = __nuxt_component_0$2;
  _push(ssrRenderComponent(_component_ClientOnly, mergeProps({
    placeholder: $props.placeholder,
    "placeholder-tag": $props.tag
  }, _attrs), {}, _parent));
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/.pnpm/@nuxtjs+color-mode@3.4.1_magicast@0.3.4_rollup@4.18.0/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$1]]);
const defaultIconDimensions = Object.freeze(
  {
    left: 0,
    top: 0,
    width: 16,
    height: 16
  }
);
const defaultIconTransformations = Object.freeze({
  rotate: 0,
  vFlip: false,
  hFlip: false
});
const defaultIconProps = Object.freeze({
  ...defaultIconDimensions,
  ...defaultIconTransformations
});
Object.freeze({
  ...defaultIconProps,
  body: "",
  hidden: false
});
function iconToHTML(body, attributes) {
  let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const attr in attributes) {
    renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
}
const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size, ratio, precision) {
  if (ratio === 1) {
    return size;
  }
  precision = precision || 100;
  const oldParts = size.split(unitsSplit);
  if (oldParts === null || !oldParts.length) {
    return size;
  }
  const newParts = [];
  let code = oldParts.shift();
  let isNumber = unitsTest.test(code);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code);
      if (isNaN(num)) {
        newParts.push(code);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code);
    }
    code = oldParts.shift();
    if (code === void 0) {
      return newParts.join("");
    }
    isNumber = !isNumber;
  }
}
function encodeSVGforURL(svg) {
  return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
}
function svgToData(svg) {
  return "data:image/svg+xml," + encodeSVGforURL(svg);
}
function svgToURL(svg) {
  return 'url("' + svgToData(svg) + '")';
}
function makeIconSquare(icon) {
  if (icon.width !== icon.height) {
    const max = Math.max(icon.width, icon.height);
    return {
      ...icon,
      width: max,
      height: max,
      left: icon.left - (max - icon.width) / 2,
      top: icon.top - (max - icon.height) / 2
    };
  }
  return icon;
}
function getCommonCSSRules(options) {
  const result = {
    display: "inline-block",
    width: "1em",
    height: "1em"
  };
  const varName = options.varName;
  if (options.pseudoSelector) {
    result["content"] = "''";
  }
  switch (options.mode) {
    case "background":
      if (varName) {
        result["background-image"] = "var(--" + varName + ")";
      }
      result["background-repeat"] = "no-repeat";
      result["background-size"] = "100% 100%";
      break;
    case "mask":
      result["background-color"] = "currentColor";
      if (varName) {
        result["mask-image"] = result["-webkit-mask-image"] = "var(--" + varName + ")";
      }
      result["mask-repeat"] = result["-webkit-mask-repeat"] = "no-repeat";
      result["mask-size"] = result["-webkit-mask-size"] = "100% 100%";
      break;
  }
  return result;
}
function generateItemCSSRules(icon, options) {
  const result = {};
  const varName = options.varName;
  if (icon.width !== icon.height) {
    if (options.forceSquare) {
      icon = makeIconSquare(icon);
    } else {
      result["width"] = calculateSize("1em", icon.width / icon.height);
    }
  }
  const svg = iconToHTML(
    icon.body.replace(/currentColor/g, options.color || "black"),
    {
      viewBox: `${icon.left} ${icon.top} ${icon.width} ${icon.height}`,
      width: icon.width.toString(),
      height: icon.height.toString()
    }
  );
  const url = svgToURL(svg);
  if (varName) {
    result["--" + varName] = url;
  } else {
    switch (options.mode) {
      case "background":
        result["background-image"] = url;
        break;
      case "mask":
        result["mask-image"] = result["-webkit-mask-image"] = url;
        break;
    }
  }
  return result;
}
const format = {
  selectorStart: {
    compressed: "{",
    compact: " {",
    expanded: " {"
  },
  selectorEnd: {
    compressed: "}",
    compact: "; }\n",
    expanded: ";\n}\n"
  },
  rule: {
    compressed: "{key}:",
    compact: " {key}: ",
    expanded: "\n  {key}: "
  }
};
function formatCSS(data, mode = "expanded") {
  const results = [];
  for (let i = 0; i < data.length; i++) {
    const { selector, rules } = data[i];
    const fullSelector = selector instanceof Array ? selector.join(mode === "compressed" ? "," : ", ") : selector;
    let entry2 = fullSelector + format.selectorStart[mode];
    let firstRule = true;
    for (const key in rules) {
      if (!firstRule) {
        entry2 += ";";
      }
      entry2 += format.rule[mode].replace("{key}", key) + rules[key];
      firstRule = false;
    }
    entry2 += format.selectorEnd[mode];
    results.push(entry2);
  }
  return results.join(mode === "compressed" ? "" : "\n");
}
function getIconCSS(icon, options = {}) {
  const body = options.customise ? options.customise(icon.body) : icon.body;
  const mode = options.mode || (options.color || !body.includes("currentColor") ? "background" : "mask");
  let varName = options.varName;
  if (varName === void 0 && mode === "mask") {
    varName = "svg";
  }
  const newOptions = {
    ...options,
    // Override mode and varName
    mode,
    varName
  };
  if (mode === "background") {
    delete newOptions.varName;
  }
  const rules = {
    ...options.rules,
    ...getCommonCSSRules(newOptions),
    ...generateItemCSSRules(
      {
        ...defaultIconProps,
        ...icon,
        body
      },
      newOptions
    )
  };
  const selector = options.iconSelector || ".icon";
  return formatCSS(
    [
      {
        selector,
        rules
      }
    ],
    newOptions.format
  );
}
async function loadIcon(name) {
  await new Promise((resolve) => loadIcons([name], () => resolve(true))).catch(() => null);
  return getIcon(name);
}
function useResolvedName(getName) {
  const options = useAppConfig().icon;
  const collections = (options.collections || []).sort((a2, b) => b.length - a2.length);
  return computed(() => {
    var _a2;
    const name = getName();
    const bare = name.startsWith(options.cssSelectorPrefix) ? name.slice(options.cssSelectorPrefix.length) : name;
    const resolved = ((_a2 = options.aliases) == null ? void 0 : _a2[bare]) || bare;
    if (!resolved.includes(":")) {
      const collection = collections.find((c) => resolved.startsWith(c + "-"));
      return collection ? collection + ":" + resolved.slice(collection.length + 1) : resolved;
    }
    return resolved;
  });
}
const SYMBOL_SERVER_CSS = "NUXT_ICONS_SERVER_CSS";
function escapeCssSelector(selector) {
  return selector.replace(/([^\w-])/g, "\\$1");
}
const NuxtIconCss = /* @__PURE__ */ defineComponent({
  name: "NuxtIconCss",
  props: {
    name: {
      type: String,
      required: true
    }
  },
  async setup(props) {
    var _a2;
    const nuxt = useNuxtApp();
    const options = useAppConfig().icon;
    const cssClass = computed(() => options.cssSelectorPrefix + props.name);
    const selector = computed(() => "." + escapeCssSelector(cssClass.value));
    function getCSS(icon, withLayer = true) {
      let iconSelector = selector.value;
      if (options.cssWherePseudo) {
        iconSelector = `:where(${iconSelector})`;
      }
      const css = getIconCSS(icon, {
        iconSelector,
        format: "compressed"
      });
      if (options.cssLayer && withLayer) {
        return `@layer ${options.cssLayer} { ${css} }`;
      }
      return css;
    }
    {
      const configs = (/* @__PURE__ */ useRuntimeConfig()).icon || {};
      if (!((_a2 = configs == null ? void 0 : configs.serverKnownCssClasses) == null ? void 0 : _a2.includes(cssClass.value))) {
        const icon = await loadIcon(props.name);
        if (icon) {
          let ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS];
          if (!ssrCSS) {
            ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS] = /* @__PURE__ */ new Map();
            nuxt.runWithContext(() => {
              useHead({
                style: [
                  () => {
                    const sep = "";
                    let css = Array.from(ssrCSS.values()).sort().join(sep);
                    if (options.cssLayer) {
                      css = `@layer ${options.cssLayer} {${sep}${css}${sep}}`;
                    }
                    return { innerHTML: css };
                  }
                ]
              }, {
                tagPriority: "low"
              });
            });
          }
          if (!ssrCSS.has(props.name)) {
            const css = getCSS(icon, false);
            ssrCSS.set(props.name, css);
          }
        }
      }
    }
    return () => h("span", { class: ["iconify", cssClass.value, options.class] });
  }
});
const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  var _b2;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, _handler, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  const handler = _handler ;
  const getDefault = () => asyncDataDefaults.value;
  const getDefaultCachedData = () => nuxtApp.isHydrating ? nuxtApp.payload.data[key] : nuxtApp.static.data[key];
  options.server = options.server ?? true;
  options.default = options.default ?? getDefault;
  options.getCachedData = options.getCachedData ?? getDefaultCachedData;
  options.lazy = options.lazy ?? false;
  options.immediate = options.immediate ?? true;
  options.deep = options.deep ?? asyncDataDefaults.deep;
  options.dedupe = options.dedupe ?? "cancel";
  const hasCachedData = () => options.getCachedData(key, nuxtApp) != null;
  if (!nuxtApp._asyncData[key] || !options.immediate) {
    (_b2 = nuxtApp.payload._errors)[key] ?? (_b2[key] = asyncDataDefaults.errorValue);
    const _ref = options.deep ? ref : shallowRef;
    nuxtApp._asyncData[key] = {
      data: _ref(options.getCachedData(key, nuxtApp) ?? options.default()),
      pending: ref(!hasCachedData()),
      error: toRef(nuxtApp.payload._errors, key),
      status: ref("idle"),
      _default: options.default
    };
  }
  const asyncData = { ...nuxtApp._asyncData[key] };
  delete asyncData._default;
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    if (nuxtApp._asyncDataPromises[key]) {
      if (isDefer(opts.dedupe ?? options.dedupe)) {
        return nuxtApp._asyncDataPromises[key];
      }
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    if ((opts._initial || nuxtApp.isHydrating && opts._initial !== false) && hasCachedData()) {
      return Promise.resolve(options.getCachedData(key, nuxtApp));
    }
    asyncData.pending.value = true;
    asyncData.status.value = "pending";
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler(nuxtApp));
        } catch (err) {
          reject(err);
        }
      }
    ).then(async (_result) => {
      if (promise.cancelled) {
        return nuxtApp._asyncDataPromises[key];
      }
      let result = _result;
      if (options.transform) {
        result = await options.transform(_result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      nuxtApp.payload.data[key] = result;
      asyncData.data.value = result;
      asyncData.error.value = asyncDataDefaults.errorValue;
      asyncData.status.value = "success";
    }).catch((error) => {
      if (promise.cancelled) {
        return nuxtApp._asyncDataPromises[key];
      }
      asyncData.error.value = createError(error);
      asyncData.data.value = unref(options.default());
      asyncData.status.value = "error";
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      delete nuxtApp._asyncDataPromises[key];
    });
    nuxtApp._asyncDataPromises[key] = promise;
    return nuxtApp._asyncDataPromises[key];
  };
  asyncData.clear = () => clearNuxtDataByKey(nuxtApp, key);
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = void 0;
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    nuxtApp._asyncData[key].pending.value = false;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    nuxtApp._asyncDataPromises[key].cancelled = true;
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
const NuxtIconSvg = /* @__PURE__ */ defineComponent({
  name: "NuxtIconSvg",
  props: {
    name: {
      type: String,
      required: true
    }
  },
  async setup(props, { slots }) {
    useNuxtApp();
    const options = useAppConfig().icon;
    const name = useResolvedName(() => props.name);
    const storeKey = "i-" + name.value;
    {
      useAsyncData(
        storeKey,
        () => loadIcon(name.value),
        { deep: false }
      );
    }
    return () => h(Icon, {
      icon: name.value,
      ssr: true,
      class: options.class
    }, slots);
  }
});
const __nuxt_component_0$1 = defineComponent({
  name: "NuxtIcon",
  props: {
    name: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: false,
      default: null
    },
    size: {
      type: [Number, String],
      required: false,
      default: null
    }
  },
  async setup(props, { slots }) {
    const nuxtApp = useNuxtApp();
    const options = useAppConfig().icon;
    const name = useResolvedName(() => props.name);
    const component = computed(
      () => {
        var _a2;
        return ((_a2 = nuxtApp.vueApp) == null ? void 0 : _a2.component(name.value)) || ((props.mode || options.mode) === "svg" ? NuxtIconSvg : NuxtIconCss);
      }
    );
    const style = computed(() => {
      const size = props.size || options.size;
      return size ? { fontSize: Number.isNaN(+size) ? size : size + "px" } : null;
    });
    return () => h(
      component.value,
      {
        ...options.attrs,
        name: name.value,
        class: options.class,
        style: style.value
      },
      slots
    );
  }
});
const index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: __nuxt_component_0$1
});
const removeUndefinedProps = (props) => {
  const filteredProps = /* @__PURE__ */ Object.create(null);
  for (const key in props) {
    const value = props[key];
    if (value !== void 0) {
      filteredProps[key] = value;
    }
  }
  return filteredProps;
};
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useHead(() => metaFactory({ ...removeUndefinedProps(props), ...ctx.attrs }, ctx));
  return () => {
    var _a2, _b2;
    return renderChild ? (_b2 = (_a2 = ctx.slots).default) == null ? void 0 : _b2.call(_a2) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: [String, Object, Array],
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
defineComponent({
  name: "NoScript",
  inheritAttrs: false,
  props: {
    ...globalProps,
    title: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a2;
    const noscript = { ...props };
    const slotVnodes = (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
    const textContent = slotVnodes ? slotVnodes.filter(({ children }) => children).map(({ children }) => children).join("") : "";
    if (textContent) {
      noscript.children = textContent;
    }
    return {
      noscript: [noscript]
    };
  })
});
defineComponent({
  name: "Link",
  inheritAttrs: false,
  props: {
    ...globalProps,
    as: String,
    crossorigin: String,
    disabled: Boolean,
    fetchpriority: String,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    /** @deprecated **/
    methods: String,
    /** @deprecated **/
    target: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
defineComponent({
  name: "Base",
  inheritAttrs: false,
  props: {
    ...globalProps,
    href: String,
    target: String
  },
  setup: setupForUseMeta((base) => ({
    base
  }))
});
defineComponent({
  name: "Title",
  inheritAttrs: false,
  setup: setupForUseMeta((_, { slots }) => {
    var _a2, _b2, _c;
    return {
      title: ((_c = (_b2 = (_a2 = slots.default) == null ? void 0 : _a2.call(slots)) == null ? void 0 : _b2[0]) == null ? void 0 : _c.children) || null
    };
  })
});
defineComponent({
  name: "Meta",
  inheritAttrs: false,
  props: {
    ...globalProps,
    charset: String,
    content: String,
    httpEquiv: String,
    name: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props) => {
    const meta = { ...props };
    if (meta.httpEquiv) {
      meta["http-equiv"] = meta.httpEquiv;
      delete meta.httpEquiv;
    }
    return {
      meta: [meta]
    };
  })
});
defineComponent({
  name: "Style",
  inheritAttrs: false,
  props: {
    ...globalProps,
    type: String,
    media: String,
    nonce: String,
    title: String,
    /** @deprecated **/
    scoped: {
      type: Boolean,
      default: void 0
    },
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a2, _b2, _c;
    const style = { ...props };
    const textContent = (_c = (_b2 = (_a2 = slots.default) == null ? void 0 : _a2.call(slots)) == null ? void 0 : _b2[0]) == null ? void 0 : _c.children;
    if (textContent) {
      style.children = textContent;
    }
    return {
      style: [style]
    };
  })
});
defineComponent({
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => () => {
    var _a2, _b2;
    return (_b2 = (_a2 = ctx.slots).default) == null ? void 0 : _b2.call(_a2);
  }
});
defineComponent({
  name: "Html",
  inheritAttrs: false,
  props: {
    ...globalProps,
    manifest: String,
    version: String,
    xmlns: String,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
const Body = defineComponent({
  name: "Body",
  inheritAttrs: false,
  props: {
    ...globalProps,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName2 = options.componentName || "NuxtLink";
  function resolveTrailingSlashBehavior(to, resolve) {
    if (!to || options.trailingSlash !== "append" && options.trailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, options.trailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, options.trailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const to = computed(() => {
      const path = props.to || props.href || "";
      return resolveTrailingSlashBehavior(path, router.resolve);
    });
    const isAbsoluteUrl = computed(() => typeof to.value === "string" && hasProtocol(to.value, { acceptRelative: true }));
    const href = computed(() => {
      var _a2;
      return typeof to.value === "object" ? ((_a2 = router.resolve(to.value)) == null ? void 0 : _a2.href) ?? null : to.value && !props.external && !isAbsoluteUrl.value ? resolveTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), router.resolve) : to.value;
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const link = useBuiltinLink == null ? void 0 : useBuiltinLink({
      ...props,
      to: to.value
    });
    const hasTarget = computed(() => props.target && props.target !== "_self");
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      if (hasTarget.value) {
        return true;
      }
      if (typeof to.value === "object") {
        return false;
      }
      return to.value === "" || isAbsoluteUrl.value;
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: (link == null ? void 0 : link.isActive) ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: (link == null ? void 0 : link.isExactActive) ?? computed(() => to.value === router.currentRoute.value.path),
      route: (link == null ? void 0 : link.route) ?? computed(() => router.resolve(to.value)),
      async navigate() {
        await navigateTo(href.value, { replace: props.replace, external: props.external });
      }
    };
  }
  return defineComponent({
    name: componentName2,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      const prefetched = ref(false);
      const el2 = void 0;
      const elRef = void 0;
      return () => {
        var _a2;
        if (!isExternal.value) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            if (prefetched.value) {
              routerLinkProps.class = props.prefetchedClass || options.prefetchedClass;
            }
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el2, href: href.value || null, rel, target }, (_a2 = slots.default) == null ? void 0 : _a2.call(slots));
      };
    }
  });
}
const __nuxt_component_0 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  const _component_Icon = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center space-x-2" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "hover:underline"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Home `);
      } else {
        return [
          createTextVNode(" Home ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_Icon, {
    size: "24",
    name: "material-symbols:chevron-right",
    class: "text-neutral-700 dark:text-neutral-300"
  }, null, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/now",
    class: "hover:underline"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Now `);
      } else {
        return [
          createTextVNode(" Now ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_Icon, {
    size: "24",
    name: "material-symbols:chevron-right",
    class: "text-neutral-700 dark:text-neutral-300"
  }, null, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/blog",
    class: "hover:underline"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Blog `);
      } else {
        return [
          createTextVNode(" Blog ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Navbar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender]]);
const RouteProvider = defineComponent({
  props: {
    vnode: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    },
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key]
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_5 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    const forkRoute = inject(PageRouteSymbol, null);
    let previousPageKey;
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    if (props.pageKey) {
      watch(() => props.pageKey, (next, prev) => {
        if (next !== prev) {
          nuxtApp.callHook("page:loading:start");
        }
      });
    }
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            done();
            return;
          }
          const key = generateRouteKey$1(routeProps, props.pageKey);
          if (!nuxtApp.isHydrating && !hasChildrenRoutes(forkRoute, routeProps.route, routeProps.Component) && previousPageKey === key) {
            nuxtApp.callHook("page:loading:end");
          }
          previousPageKey = key;
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          const keepaliveConfig = props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive;
          vnode = _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              keepaliveConfig,
              h(Suspense, {
                suspensible: true,
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).then(() => nuxtApp.callHook("page:loading:end")).finally(done));
                }
              }, {
                default: () => {
                  const providerVNode = h(RouteProvider, {
                    key: key || void 0,
                    vnode: slots.default ? h(Fragment, void 0, slots.default(routeProps)) : routeProps.Component,
                    route: routeProps.route,
                    renderKey: key || void 0,
                    trackRootNodes: hasTransition,
                    vnodeRef: pageRef
                  });
                  return providerVNode;
                }
              })
            )
          ).default();
          return vnode;
        }
      });
    };
  }
});
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: prop.onAfterLeave ? toArray(prop.onAfterLeave) : void 0
  }));
  return defu(..._props);
}
function hasChildrenRoutes(fork, newRoute, Component) {
  if (!fork) {
    return false;
  }
  const index2 = newRoute.matched.findIndex((m) => {
    var _a2;
    return ((_a2 = m.components) == null ? void 0 : _a2.default) === (Component == null ? void 0 : Component.type);
  });
  return index2 < newRoute.matched.length - 1;
}
const useColorMode = () => {
  return useState("color-mode").value;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const colorMode = useColorMode();
    function toggleColorMode() {
      if (colorMode.value === "light") {
        colorMode.value = "dark";
      } else {
        colorMode.value = "light";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$3;
      const _component_ColorScheme = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0$1;
      const _component_Body = Body;
      const _component_Navbar = __nuxt_component_4;
      const _component_NuxtPage = __nuxt_component_5;
      _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_ColorScheme, {
              placeholder: "...",
              tag: "span"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<button${_scopeId2}>`);
                  if (_ctx.$colorMode.value === "light") {
                    _push3(ssrRenderComponent(_component_Icon, {
                      size: "24",
                      class: "text-neutral-500",
                      name: "line-md:moon-alt-to-sunny-outline-loop-transition"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (_ctx.$colorMode.value === "dark") {
                    _push3(ssrRenderComponent(_component_Icon, {
                      size: "24",
                      class: "text-neutral-500",
                      name: "line-md:sunny-outline-to-moon-alt-loop-transition"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</button>`);
                  _push3(ssrRenderComponent(_component_Body, { class: "flex max-w-7xl flex-col bg-white px-2 py-8 sm:px-6 lg:px-8 dark:bg-neutral-950" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Navbar, null, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_NuxtPage, null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_Navbar),
                          createVNode(_component_NuxtPage)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("button", { onClick: toggleColorMode }, [
                      _ctx.$colorMode.value === "light" ? (openBlock(), createBlock(_component_Icon, {
                        key: 0,
                        size: "24",
                        class: "text-neutral-500",
                        name: "line-md:moon-alt-to-sunny-outline-loop-transition"
                      })) : createCommentVNode("", true),
                      _ctx.$colorMode.value === "dark" ? (openBlock(), createBlock(_component_Icon, {
                        key: 1,
                        size: "24",
                        class: "text-neutral-500",
                        name: "line-md:sunny-outline-to-moon-alt-loop-transition"
                      })) : createCommentVNode("", true)
                    ]),
                    createVNode(_component_Body, { class: "flex max-w-7xl flex-col bg-white px-2 py-8 sm:px-6 lg:px-8 dark:bg-neutral-950" }, {
                      default: withCtx(() => [
                        createVNode(_component_Navbar),
                        createVNode(_component_NuxtPage)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_ColorScheme, {
                placeholder: "...",
                tag: "span"
              }, {
                default: withCtx(() => [
                  createVNode("button", { onClick: toggleColorMode }, [
                    _ctx.$colorMode.value === "light" ? (openBlock(), createBlock(_component_Icon, {
                      key: 0,
                      size: "24",
                      class: "text-neutral-500",
                      name: "line-md:moon-alt-to-sunny-outline-loop-transition"
                    })) : createCommentVNode("", true),
                    _ctx.$colorMode.value === "dark" ? (openBlock(), createBlock(_component_Icon, {
                      key: 1,
                      size: "24",
                      class: "text-neutral-500",
                      name: "line-md:sunny-outline-to-moon-alt-loop-transition"
                    })) : createCommentVNode("", true)
                  ]),
                  createVNode(_component_Body, { class: "flex max-w-7xl flex-col bg-white px-2 py-8 sm:px-6 lg:px-8 dark:bg-neutral-950" }, {
                    default: withCtx(() => [
                      createVNode(_component_Navbar),
                      createVNode(_component_NuxtPage)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-_c9f0hSU.mjs').then((r) => r.default || r));
    const _Error = defineAsyncComponent(() => import('./error-500-B3lgF622.mjs').then((r) => r.default || r));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/.pnpm/nuxt@3.12.1_@opentelemetry+api@1.9.0_@parcel+watcher@2.4.1_@types+node@20.14.2_@unocss+reset@_nakabmucnptb4c6c2nrgv77bby/node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = defineAsyncComponent(() => import('./island-renderer-CQFbkAcB.mjs').then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p2 = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p2);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/.pnpm/nuxt@3.12.1_@opentelemetry+api@1.9.0_@parcel+watcher@2.4.1_@types+node@20.14.2_@unocss+reset@_nakabmucnptb4c6c2nrgv77bby/node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error = nuxt.payload.error || createError(error);
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { On as O, _export_sfc as _, __nuxt_component_0 as a, br as b, createError as c, __nuxt_component_0$1 as d, entry$1 as default, useOgImageRuntimeConfig as e, useSiteConfig as f, parseURL as p, useHead as u };
//# sourceMappingURL=server.mjs.map
