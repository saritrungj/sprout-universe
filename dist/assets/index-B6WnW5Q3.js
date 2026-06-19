(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const l of document.querySelectorAll('link[rel="modulepreload"]')) r(l);
  new MutationObserver((l) => {
    for (const o of l)
      if (o.type === "childList")
        for (const s of o.addedNodes)
          s.tagName === "LINK" && s.rel === "modulepreload" && r(s);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(l) {
    const o = {};
    return (
      l.integrity && (o.integrity = l.integrity),
      l.referrerPolicy && (o.referrerPolicy = l.referrerPolicy),
      l.crossOrigin === "use-credentials"
        ? (o.credentials = "include")
        : l.crossOrigin === "anonymous"
          ? (o.credentials = "omit")
          : (o.credentials = "same-origin"),
      o
    );
  }
  function r(l) {
    if (l.ep) return;
    l.ep = !0;
    const o = n(l);
    fetch(l.href, o);
  }
})();
var Da = { exports: {} },
  wl = {},
  Ma = { exports: {} },
  D = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var ar = Symbol.for("react.element"),
  fd = Symbol.for("react.portal"),
  pd = Symbol.for("react.fragment"),
  md = Symbol.for("react.strict_mode"),
  hd = Symbol.for("react.profiler"),
  gd = Symbol.for("react.provider"),
  yd = Symbol.for("react.context"),
  vd = Symbol.for("react.forward_ref"),
  xd = Symbol.for("react.suspense"),
  kd = Symbol.for("react.memo"),
  wd = Symbol.for("react.lazy"),
  pi = Symbol.iterator;
function Sd(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (pi && e[pi]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var Ra = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Ia = Object.assign,
  $a = {};
function wn(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = $a),
    (this.updater = n || Ra));
}
wn.prototype.isReactComponent = {};
wn.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
wn.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function Oa() {}
Oa.prototype = wn.prototype;
function fs(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = $a),
    (this.updater = n || Ra));
}
var ps = (fs.prototype = new Oa());
ps.constructor = fs;
Ia(ps, wn.prototype);
ps.isPureReactComponent = !0;
var mi = Array.isArray,
  Aa = Object.prototype.hasOwnProperty,
  ms = { current: null },
  Fa = { key: !0, ref: !0, __self: !0, __source: !0 };
function Ua(e, t, n) {
  var r,
    l = {},
    o = null,
    s = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (s = t.ref),
    t.key !== void 0 && (o = "" + t.key),
    t))
      Aa.call(t, r) && !Fa.hasOwnProperty(r) && (l[r] = t[r]);
  var i = arguments.length - 2;
  if (i === 1) l.children = n;
  else if (1 < i) {
    for (var a = Array(i), c = 0; c < i; c++) a[c] = arguments[c + 2];
    l.children = a;
  }
  if (e && e.defaultProps)
    for (r in ((i = e.defaultProps), i)) l[r] === void 0 && (l[r] = i[r]);
  return {
    $$typeof: ar,
    type: e,
    key: o,
    ref: s,
    props: l,
    _owner: ms.current,
  };
}
function Ed(e, t) {
  return {
    $$typeof: ar,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function hs(e) {
  return typeof e == "object" && e !== null && e.$$typeof === ar;
}
function Cd(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var hi = /\/+/g;
function bl(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? Cd("" + e.key)
    : t.toString(36);
}
function $r(e, t, n, r, l) {
  var o = typeof e;
  (o === "undefined" || o === "boolean") && (e = null);
  var s = !1;
  if (e === null) s = !0;
  else
    switch (o) {
      case "string":
      case "number":
        s = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case ar:
          case fd:
            s = !0;
        }
    }
  if (s)
    return (
      (s = e),
      (l = l(s)),
      (e = r === "" ? "." + bl(s, 0) : r),
      mi(l)
        ? ((n = ""),
          e != null && (n = e.replace(hi, "$&/") + "/"),
          $r(l, t, n, "", function (c) {
            return c;
          }))
        : l != null &&
          (hs(l) &&
            (l = Ed(
              l,
              n +
                (!l.key || (s && s.key === l.key)
                  ? ""
                  : ("" + l.key).replace(hi, "$&/") + "/") +
                e,
            )),
          t.push(l)),
      1
    );
  if (((s = 0), (r = r === "" ? "." : r + ":"), mi(e)))
    for (var i = 0; i < e.length; i++) {
      o = e[i];
      var a = r + bl(o, i);
      s += $r(o, t, n, a, l);
    }
  else if (((a = Sd(e)), typeof a == "function"))
    for (e = a.call(e), i = 0; !(o = e.next()).done; )
      ((o = o.value), (a = r + bl(o, i++)), (s += $r(o, t, n, a, l)));
  else if (o === "object")
    throw (
      (t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead.",
      )
    );
  return s;
}
function yr(e, t, n) {
  if (e == null) return e;
  var r = [],
    l = 0;
  return (
    $r(e, r, "", "", function (o) {
      return t.call(n, o, l++);
    }),
    r
  );
}
function Nd(e) {
  if (e._status === -1) {
    var t = e._result;
    ((t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = n));
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t)));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var de = { current: null },
  Or = { transition: null },
  jd = {
    ReactCurrentDispatcher: de,
    ReactCurrentBatchConfig: Or,
    ReactCurrentOwner: ms,
  };
function ba() {
  throw Error("act(...) is not supported in production builds of React.");
}
D.Children = {
  map: yr,
  forEach: function (e, t, n) {
    yr(
      e,
      function () {
        t.apply(this, arguments);
      },
      n,
    );
  },
  count: function (e) {
    var t = 0;
    return (
      yr(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      yr(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!hs(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
D.Component = wn;
D.Fragment = pd;
D.Profiler = hd;
D.PureComponent = fs;
D.StrictMode = md;
D.Suspense = xd;
D.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = jd;
D.act = ba;
D.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var r = Ia({}, e.props),
    l = e.key,
    o = e.ref,
    s = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((o = t.ref), (s = ms.current)),
      t.key !== void 0 && (l = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var i = e.type.defaultProps;
    for (a in t)
      Aa.call(t, a) &&
        !Fa.hasOwnProperty(a) &&
        (r[a] = t[a] === void 0 && i !== void 0 ? i[a] : t[a]);
  }
  var a = arguments.length - 2;
  if (a === 1) r.children = n;
  else if (1 < a) {
    i = Array(a);
    for (var c = 0; c < a; c++) i[c] = arguments[c + 2];
    r.children = i;
  }
  return { $$typeof: ar, type: e.type, key: l, ref: o, props: r, _owner: s };
};
D.createContext = function (e) {
  return (
    (e = {
      $$typeof: yd,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: gd, _context: e }),
    (e.Consumer = e)
  );
};
D.createElement = Ua;
D.createFactory = function (e) {
  var t = Ua.bind(null, e);
  return ((t.type = e), t);
};
D.createRef = function () {
  return { current: null };
};
D.forwardRef = function (e) {
  return { $$typeof: vd, render: e };
};
D.isValidElement = hs;
D.lazy = function (e) {
  return { $$typeof: wd, _payload: { _status: -1, _result: e }, _init: Nd };
};
D.memo = function (e, t) {
  return { $$typeof: kd, type: e, compare: t === void 0 ? null : t };
};
D.startTransition = function (e) {
  var t = Or.transition;
  Or.transition = {};
  try {
    e();
  } finally {
    Or.transition = t;
  }
};
D.unstable_act = ba;
D.useCallback = function (e, t) {
  return de.current.useCallback(e, t);
};
D.useContext = function (e) {
  return de.current.useContext(e);
};
D.useDebugValue = function () {};
D.useDeferredValue = function (e) {
  return de.current.useDeferredValue(e);
};
D.useEffect = function (e, t) {
  return de.current.useEffect(e, t);
};
D.useId = function () {
  return de.current.useId();
};
D.useImperativeHandle = function (e, t, n) {
  return de.current.useImperativeHandle(e, t, n);
};
D.useInsertionEffect = function (e, t) {
  return de.current.useInsertionEffect(e, t);
};
D.useLayoutEffect = function (e, t) {
  return de.current.useLayoutEffect(e, t);
};
D.useMemo = function (e, t) {
  return de.current.useMemo(e, t);
};
D.useReducer = function (e, t, n) {
  return de.current.useReducer(e, t, n);
};
D.useRef = function (e) {
  return de.current.useRef(e);
};
D.useState = function (e) {
  return de.current.useState(e);
};
D.useSyncExternalStore = function (e, t, n) {
  return de.current.useSyncExternalStore(e, t, n);
};
D.useTransition = function () {
  return de.current.useTransition();
};
D.version = "18.3.1";
Ma.exports = D;
var P = Ma.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Td = P,
  Pd = Symbol.for("react.element"),
  _d = Symbol.for("react.fragment"),
  Ld = Object.prototype.hasOwnProperty,
  zd = Td.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  Dd = { key: !0, ref: !0, __self: !0, __source: !0 };
function Va(e, t, n) {
  var r,
    l = {},
    o = null,
    s = null;
  (n !== void 0 && (o = "" + n),
    t.key !== void 0 && (o = "" + t.key),
    t.ref !== void 0 && (s = t.ref));
  for (r in t) Ld.call(t, r) && !Dd.hasOwnProperty(r) && (l[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) l[r] === void 0 && (l[r] = t[r]);
  return {
    $$typeof: Pd,
    type: e,
    key: o,
    ref: s,
    props: l,
    _owner: zd.current,
  };
}
wl.Fragment = _d;
wl.jsx = Va;
wl.jsxs = Va;
Da.exports = wl;
var u = Da.exports,
  Ha = { exports: {} },
  je = {},
  Ba = { exports: {} },
  Wa = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(N, _) {
    var z = N.length;
    N.push(_);
    e: for (; 0 < z; ) {
      var Q = (z - 1) >>> 1,
        Z = N[Q];
      if (0 < l(Z, _)) ((N[Q] = _), (N[z] = Z), (z = Q));
      else break e;
    }
  }
  function n(N) {
    return N.length === 0 ? null : N[0];
  }
  function r(N) {
    if (N.length === 0) return null;
    var _ = N[0],
      z = N.pop();
    if (z !== _) {
      N[0] = z;
      e: for (var Q = 0, Z = N.length, hr = Z >>> 1; Q < hr; ) {
        var Lt = 2 * (Q + 1) - 1,
          Ul = N[Lt],
          zt = Lt + 1,
          gr = N[zt];
        if (0 > l(Ul, z))
          zt < Z && 0 > l(gr, Ul)
            ? ((N[Q] = gr), (N[zt] = z), (Q = zt))
            : ((N[Q] = Ul), (N[Lt] = z), (Q = Lt));
        else if (zt < Z && 0 > l(gr, z)) ((N[Q] = gr), (N[zt] = z), (Q = zt));
        else break e;
      }
    }
    return _;
  }
  function l(N, _) {
    var z = N.sortIndex - _.sortIndex;
    return z !== 0 ? z : N.id - _.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var o = performance;
    e.unstable_now = function () {
      return o.now();
    };
  } else {
    var s = Date,
      i = s.now();
    e.unstable_now = function () {
      return s.now() - i;
    };
  }
  var a = [],
    c = [],
    m = 1,
    g = null,
    h = 3,
    w = !1,
    x = !1,
    S = !1,
    R = typeof setTimeout == "function" ? setTimeout : null,
    f = typeof clearTimeout == "function" ? clearTimeout : null,
    d = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function p(N) {
    for (var _ = n(c); _ !== null; ) {
      if (_.callback === null) r(c);
      else if (_.startTime <= N)
        (r(c), (_.sortIndex = _.expirationTime), t(a, _));
      else break;
      _ = n(c);
    }
  }
  function y(N) {
    if (((S = !1), p(N), !x))
      if (n(a) !== null) ((x = !0), pe(k));
      else {
        var _ = n(c);
        _ !== null && _t(y, _.startTime - N);
      }
  }
  function k(N, _) {
    ((x = !1), S && ((S = !1), f(T), (T = -1)), (w = !0));
    var z = h;
    try {
      for (
        p(_), g = n(a);
        g !== null && (!(g.expirationTime > _) || (N && !ae()));
      ) {
        var Q = g.callback;
        if (typeof Q == "function") {
          ((g.callback = null), (h = g.priorityLevel));
          var Z = Q(g.expirationTime <= _);
          ((_ = e.unstable_now()),
            typeof Z == "function" ? (g.callback = Z) : g === n(a) && r(a),
            p(_));
        } else r(a);
        g = n(a);
      }
      if (g !== null) var hr = !0;
      else {
        var Lt = n(c);
        (Lt !== null && _t(y, Lt.startTime - _), (hr = !1));
      }
      return hr;
    } finally {
      ((g = null), (h = z), (w = !1));
    }
  }
  var E = !1,
    C = null,
    T = -1,
    O = 5,
    L = -1;
  function ae() {
    return !(e.unstable_now() - L < O);
  }
  function Tt() {
    if (C !== null) {
      var N = e.unstable_now();
      L = N;
      var _ = !0;
      try {
        _ = C(!0, N);
      } finally {
        _ ? Pt() : ((E = !1), (C = null));
      }
    } else E = !1;
  }
  var Pt;
  if (typeof d == "function")
    Pt = function () {
      d(Tt);
    };
  else if (typeof MessageChannel < "u") {
    var M = new MessageChannel(),
      ke = M.port2;
    ((M.port1.onmessage = Tt),
      (Pt = function () {
        ke.postMessage(null);
      }));
  } else
    Pt = function () {
      R(Tt, 0);
    };
  function pe(N) {
    ((C = N), E || ((E = !0), Pt()));
  }
  function _t(N, _) {
    T = R(function () {
      N(e.unstable_now());
    }, _);
  }
  ((e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (N) {
      N.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      x || w || ((x = !0), pe(k));
    }),
    (e.unstable_forceFrameRate = function (N) {
      0 > N || 125 < N
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (O = 0 < N ? Math.floor(1e3 / N) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return h;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(a);
    }),
    (e.unstable_next = function (N) {
      switch (h) {
        case 1:
        case 2:
        case 3:
          var _ = 3;
          break;
        default:
          _ = h;
      }
      var z = h;
      h = _;
      try {
        return N();
      } finally {
        h = z;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (N, _) {
      switch (N) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          N = 3;
      }
      var z = h;
      h = N;
      try {
        return _();
      } finally {
        h = z;
      }
    }),
    (e.unstable_scheduleCallback = function (N, _, z) {
      var Q = e.unstable_now();
      switch (
        (typeof z == "object" && z !== null
          ? ((z = z.delay), (z = typeof z == "number" && 0 < z ? Q + z : Q))
          : (z = Q),
        N)
      ) {
        case 1:
          var Z = -1;
          break;
        case 2:
          Z = 250;
          break;
        case 5:
          Z = 1073741823;
          break;
        case 4:
          Z = 1e4;
          break;
        default:
          Z = 5e3;
      }
      return (
        (Z = z + Z),
        (N = {
          id: m++,
          callback: _,
          priorityLevel: N,
          startTime: z,
          expirationTime: Z,
          sortIndex: -1,
        }),
        z > Q
          ? ((N.sortIndex = z),
            t(c, N),
            n(a) === null &&
              N === n(c) &&
              (S ? (f(T), (T = -1)) : (S = !0), _t(y, z - Q)))
          : ((N.sortIndex = Z), t(a, N), x || w || ((x = !0), pe(k))),
        N
      );
    }),
    (e.unstable_shouldYield = ae),
    (e.unstable_wrapCallback = function (N) {
      var _ = h;
      return function () {
        var z = h;
        h = _;
        try {
          return N.apply(this, arguments);
        } finally {
          h = z;
        }
      };
    }));
})(Wa);
Ba.exports = Wa;
var Md = Ba.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Rd = P,
  Ne = Md;
function v(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var Qa = new Set(),
  Wn = {};
function Bt(e, t) {
  (mn(e, t), mn(e + "Capture", t));
}
function mn(e, t) {
  for (Wn[e] = t, e = 0; e < t.length; e++) Qa.add(t[e]);
}
var qe = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  yo = Object.prototype.hasOwnProperty,
  Id =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  gi = {},
  yi = {};
function $d(e) {
  return yo.call(yi, e)
    ? !0
    : yo.call(gi, e)
      ? !1
      : Id.test(e)
        ? (yi[e] = !0)
        : ((gi[e] = !0), !1);
}
function Od(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
          ? !n.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function Ad(e, t, n, r) {
  if (t === null || typeof t > "u" || Od(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function fe(e, t, n, r, l, o, s) {
  ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = l),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = o),
    (this.removeEmptyString = s));
}
var ne = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    ne[e] = new fe(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  ne[t] = new fe(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  ne[e] = new fe(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  ne[e] = new fe(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    ne[e] = new fe(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  ne[e] = new fe(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  ne[e] = new fe(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  ne[e] = new fe(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  ne[e] = new fe(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var gs = /[\-:]([a-z])/g;
function ys(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(gs, ys);
    ne[t] = new fe(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(gs, ys);
    ne[t] = new fe(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(gs, ys);
  ne[t] = new fe(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  ne[e] = new fe(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
ne.xlinkHref = new fe(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  ne[e] = new fe(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function vs(e, t, n, r) {
  var l = ne.hasOwnProperty(t) ? ne[t] : null;
  (l !== null
    ? l.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (Ad(t, n, l, r) && (n = null),
    r || l === null
      ? $d(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : l.mustUseProperty
        ? (e[l.propertyName] = n === null ? (l.type === 3 ? !1 : "") : n)
        : ((t = l.attributeName),
          (r = l.attributeNamespace),
          n === null
            ? e.removeAttribute(t)
            : ((l = l.type),
              (n = l === 3 || (l === 4 && n === !0) ? "" : "" + n),
              r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var lt = Rd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  vr = Symbol.for("react.element"),
  Gt = Symbol.for("react.portal"),
  Xt = Symbol.for("react.fragment"),
  xs = Symbol.for("react.strict_mode"),
  vo = Symbol.for("react.profiler"),
  Ka = Symbol.for("react.provider"),
  Ya = Symbol.for("react.context"),
  ks = Symbol.for("react.forward_ref"),
  xo = Symbol.for("react.suspense"),
  ko = Symbol.for("react.suspense_list"),
  ws = Symbol.for("react.memo"),
  it = Symbol.for("react.lazy"),
  Ga = Symbol.for("react.offscreen"),
  vi = Symbol.iterator;
function Cn(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (vi && e[vi]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var B = Object.assign,
  Vl;
function Dn(e) {
  if (Vl === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      Vl = (t && t[1]) || "";
    }
  return (
    `
` +
    Vl +
    e
  );
}
var Hl = !1;
function Bl(e, t) {
  if (!e || Hl) return "";
  Hl = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (c) {
          var r = c;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (c) {
          r = c;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (c) {
        r = c;
      }
      e();
    }
  } catch (c) {
    if (c && r && typeof c.stack == "string") {
      for (
        var l = c.stack.split(`
`),
          o = r.stack.split(`
`),
          s = l.length - 1,
          i = o.length - 1;
        1 <= s && 0 <= i && l[s] !== o[i];
      )
        i--;
      for (; 1 <= s && 0 <= i; s--, i--)
        if (l[s] !== o[i]) {
          if (s !== 1 || i !== 1)
            do
              if ((s--, i--, 0 > i || l[s] !== o[i])) {
                var a =
                  `
` + l[s].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    a.includes("<anonymous>") &&
                    (a = a.replace("<anonymous>", e.displayName)),
                  a
                );
              }
            while (1 <= s && 0 <= i);
          break;
        }
    }
  } finally {
    ((Hl = !1), (Error.prepareStackTrace = n));
  }
  return (e = e ? e.displayName || e.name : "") ? Dn(e) : "";
}
function Fd(e) {
  switch (e.tag) {
    case 5:
      return Dn(e.type);
    case 16:
      return Dn("Lazy");
    case 13:
      return Dn("Suspense");
    case 19:
      return Dn("SuspenseList");
    case 0:
    case 2:
    case 15:
      return ((e = Bl(e.type, !1)), e);
    case 11:
      return ((e = Bl(e.type.render, !1)), e);
    case 1:
      return ((e = Bl(e.type, !0)), e);
    default:
      return "";
  }
}
function wo(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Xt:
      return "Fragment";
    case Gt:
      return "Portal";
    case vo:
      return "Profiler";
    case xs:
      return "StrictMode";
    case xo:
      return "Suspense";
    case ko:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Ya:
        return (e.displayName || "Context") + ".Consumer";
      case Ka:
        return (e._context.displayName || "Context") + ".Provider";
      case ks:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case ws:
        return (
          (t = e.displayName || null),
          t !== null ? t : wo(e.type) || "Memo"
        );
      case it:
        ((t = e._payload), (e = e._init));
        try {
          return wo(e(t));
        } catch {}
    }
  return null;
}
function Ud(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return wo(t);
    case 8:
      return t === xs ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function St(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function Xa(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function bd(e) {
  var t = Xa(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var l = n.get,
      o = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return l.call(this);
        },
        set: function (s) {
          ((r = "" + s), o.call(this, s));
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (s) {
          r = "" + s;
        },
        stopTracking: function () {
          ((e._valueTracker = null), delete e[t]);
        },
      }
    );
  }
}
function xr(e) {
  e._valueTracker || (e._valueTracker = bd(e));
}
function Za(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = Xa(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function Yr(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function So(e, t) {
  var n = t.checked;
  return B({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function xi(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  ((n = St(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    }));
}
function Ja(e, t) {
  ((t = t.checked), t != null && vs(e, "checked", t, !1));
}
function Eo(e, t) {
  Ja(e, t);
  var n = St(t.value),
    r = t.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  (t.hasOwnProperty("value")
    ? Co(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && Co(e, t.type, St(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked));
}
function ki(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (
      !(
        (r !== "submit" && r !== "reset") ||
        (t.value !== void 0 && t.value !== null)
      )
    )
      return;
    ((t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t));
  }
  ((n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n));
}
function Co(e, t, n) {
  (t !== "number" || Yr(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var Mn = Array.isArray;
function an(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
    for (n = 0; n < e.length; n++)
      ((l = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== l && (e[n].selected = l),
        l && r && (e[n].defaultSelected = !0));
  } else {
    for (n = "" + St(n), t = null, l = 0; l < e.length; l++) {
      if (e[l].value === n) {
        ((e[l].selected = !0), r && (e[l].defaultSelected = !0));
        return;
      }
      t !== null || e[l].disabled || (t = e[l]);
    }
    t !== null && (t.selected = !0);
  }
}
function No(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(v(91));
  return B({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function wi(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(v(92));
      if (Mn(n)) {
        if (1 < n.length) throw Error(v(93));
        n = n[0];
      }
      t = n;
    }
    (t == null && (t = ""), (n = t));
  }
  e._wrapperState = { initialValue: St(n) };
}
function qa(e, t) {
  var n = St(t.value),
    r = St(t.defaultValue);
  (n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r));
}
function Si(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function eu(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function jo(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? eu(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var kr,
  tu = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, l) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, l);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        kr = kr || document.createElement("div"),
          kr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = kr.firstChild;
        e.firstChild;
      )
        e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
function Qn(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var $n = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  Vd = ["Webkit", "ms", "Moz", "O"];
Object.keys($n).forEach(function (e) {
  Vd.forEach(function (t) {
    ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), ($n[t] = $n[e]));
  });
});
function nu(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || ($n.hasOwnProperty(e) && $n[e])
      ? ("" + t).trim()
      : t + "px";
}
function ru(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        l = nu(n, t[n], r);
      (n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : (e[n] = l));
    }
}
var Hd = B(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
);
function To(e, t) {
  if (t) {
    if (Hd[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(v(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(v(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(v(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(v(62));
  }
}
function Po(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var _o = null;
function Ss(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var Lo = null,
  un = null,
  cn = null;
function Ei(e) {
  if ((e = dr(e))) {
    if (typeof Lo != "function") throw Error(v(280));
    var t = e.stateNode;
    t && ((t = jl(t)), Lo(e.stateNode, e.type, t));
  }
}
function lu(e) {
  un ? (cn ? cn.push(e) : (cn = [e])) : (un = e);
}
function ou() {
  if (un) {
    var e = un,
      t = cn;
    if (((cn = un = null), Ei(e), t)) for (e = 0; e < t.length; e++) Ei(t[e]);
  }
}
function su(e, t) {
  return e(t);
}
function iu() {}
var Wl = !1;
function au(e, t, n) {
  if (Wl) return e(t, n);
  Wl = !0;
  try {
    return su(e, t, n);
  } finally {
    ((Wl = !1), (un !== null || cn !== null) && (iu(), ou()));
  }
}
function Kn(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = jl(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      ((r = !r.disabled) ||
        ((e = e.type),
        (r = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !r));
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(v(231, t, typeof n));
  return n;
}
var zo = !1;
if (qe)
  try {
    var Nn = {};
    (Object.defineProperty(Nn, "passive", {
      get: function () {
        zo = !0;
      },
    }),
      window.addEventListener("test", Nn, Nn),
      window.removeEventListener("test", Nn, Nn));
  } catch {
    zo = !1;
  }
function Bd(e, t, n, r, l, o, s, i, a) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, c);
  } catch (m) {
    this.onError(m);
  }
}
var On = !1,
  Gr = null,
  Xr = !1,
  Do = null,
  Wd = {
    onError: function (e) {
      ((On = !0), (Gr = e));
    },
  };
function Qd(e, t, n, r, l, o, s, i, a) {
  ((On = !1), (Gr = null), Bd.apply(Wd, arguments));
}
function Kd(e, t, n, r, l, o, s, i, a) {
  if ((Qd.apply(this, arguments), On)) {
    if (On) {
      var c = Gr;
      ((On = !1), (Gr = null));
    } else throw Error(v(198));
    Xr || ((Xr = !0), (Do = c));
  }
}
function Wt(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function uu(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function Ci(e) {
  if (Wt(e) !== e) throw Error(v(188));
}
function Yd(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = Wt(e)), t === null)) throw Error(v(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var l = n.return;
    if (l === null) break;
    var o = l.alternate;
    if (o === null) {
      if (((r = l.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (l.child === o.child) {
      for (o = l.child; o; ) {
        if (o === n) return (Ci(l), e);
        if (o === r) return (Ci(l), t);
        o = o.sibling;
      }
      throw Error(v(188));
    }
    if (n.return !== r.return) ((n = l), (r = o));
    else {
      for (var s = !1, i = l.child; i; ) {
        if (i === n) {
          ((s = !0), (n = l), (r = o));
          break;
        }
        if (i === r) {
          ((s = !0), (r = l), (n = o));
          break;
        }
        i = i.sibling;
      }
      if (!s) {
        for (i = o.child; i; ) {
          if (i === n) {
            ((s = !0), (n = o), (r = l));
            break;
          }
          if (i === r) {
            ((s = !0), (r = o), (n = l));
            break;
          }
          i = i.sibling;
        }
        if (!s) throw Error(v(189));
      }
    }
    if (n.alternate !== r) throw Error(v(190));
  }
  if (n.tag !== 3) throw Error(v(188));
  return n.stateNode.current === n ? e : t;
}
function cu(e) {
  return ((e = Yd(e)), e !== null ? du(e) : null);
}
function du(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = du(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var fu = Ne.unstable_scheduleCallback,
  Ni = Ne.unstable_cancelCallback,
  Gd = Ne.unstable_shouldYield,
  Xd = Ne.unstable_requestPaint,
  K = Ne.unstable_now,
  Zd = Ne.unstable_getCurrentPriorityLevel,
  Es = Ne.unstable_ImmediatePriority,
  pu = Ne.unstable_UserBlockingPriority,
  Zr = Ne.unstable_NormalPriority,
  Jd = Ne.unstable_LowPriority,
  mu = Ne.unstable_IdlePriority,
  Sl = null,
  Qe = null;
function qd(e) {
  if (Qe && typeof Qe.onCommitFiberRoot == "function")
    try {
      Qe.onCommitFiberRoot(Sl, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var Fe = Math.clz32 ? Math.clz32 : nf,
  ef = Math.log,
  tf = Math.LN2;
function nf(e) {
  return ((e >>>= 0), e === 0 ? 32 : (31 - ((ef(e) / tf) | 0)) | 0);
}
var wr = 64,
  Sr = 4194304;
function Rn(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function Jr(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    l = e.suspendedLanes,
    o = e.pingedLanes,
    s = n & 268435455;
  if (s !== 0) {
    var i = s & ~l;
    i !== 0 ? (r = Rn(i)) : ((o &= s), o !== 0 && (r = Rn(o)));
  } else ((s = n & ~l), s !== 0 ? (r = Rn(s)) : o !== 0 && (r = Rn(o)));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & l) &&
    ((l = r & -r), (o = t & -t), l >= o || (l === 16 && (o & 4194240) !== 0))
  )
    return t;
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; )
      ((n = 31 - Fe(t)), (l = 1 << n), (r |= e[n]), (t &= ~l));
  return r;
}
function rf(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function lf(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      l = e.expirationTimes,
      o = e.pendingLanes;
    0 < o;
  ) {
    var s = 31 - Fe(o),
      i = 1 << s,
      a = l[s];
    (a === -1
      ? (!(i & n) || i & r) && (l[s] = rf(i, t))
      : a <= t && (e.expiredLanes |= i),
      (o &= ~i));
  }
}
function Mo(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function hu() {
  var e = wr;
  return ((wr <<= 1), !(wr & 4194240) && (wr = 64), e);
}
function Ql(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function ur(e, t, n) {
  ((e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - Fe(t)),
    (e[t] = n));
}
function of(e, t) {
  var n = e.pendingLanes & ~t;
  ((e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements));
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var l = 31 - Fe(n),
      o = 1 << l;
    ((t[l] = 0), (r[l] = -1), (e[l] = -1), (n &= ~o));
  }
}
function Cs(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n; ) {
    var r = 31 - Fe(n),
      l = 1 << r;
    ((l & t) | (e[r] & t) && (e[r] |= t), (n &= ~l));
  }
}
var $ = 0;
function gu(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1
  );
}
var yu,
  Ns,
  vu,
  xu,
  ku,
  Ro = !1,
  Er = [],
  pt = null,
  mt = null,
  ht = null,
  Yn = new Map(),
  Gn = new Map(),
  ut = [],
  sf =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function ji(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      pt = null;
      break;
    case "dragenter":
    case "dragleave":
      mt = null;
      break;
    case "mouseover":
    case "mouseout":
      ht = null;
      break;
    case "pointerover":
    case "pointerout":
      Yn.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Gn.delete(t.pointerId);
  }
}
function jn(e, t, n, r, l, o) {
  return e === null || e.nativeEvent !== o
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: o,
        targetContainers: [l],
      }),
      t !== null && ((t = dr(t)), t !== null && Ns(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      l !== null && t.indexOf(l) === -1 && t.push(l),
      e);
}
function af(e, t, n, r, l) {
  switch (t) {
    case "focusin":
      return ((pt = jn(pt, e, t, n, r, l)), !0);
    case "dragenter":
      return ((mt = jn(mt, e, t, n, r, l)), !0);
    case "mouseover":
      return ((ht = jn(ht, e, t, n, r, l)), !0);
    case "pointerover":
      var o = l.pointerId;
      return (Yn.set(o, jn(Yn.get(o) || null, e, t, n, r, l)), !0);
    case "gotpointercapture":
      return (
        (o = l.pointerId),
        Gn.set(o, jn(Gn.get(o) || null, e, t, n, r, l)),
        !0
      );
  }
  return !1;
}
function wu(e) {
  var t = Rt(e.target);
  if (t !== null) {
    var n = Wt(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = uu(n)), t !== null)) {
          ((e.blockedOn = t),
            ku(e.priority, function () {
              vu(n);
            }));
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Ar(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = Io(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      ((_o = r), n.target.dispatchEvent(r), (_o = null));
    } else return ((t = dr(n)), t !== null && Ns(t), (e.blockedOn = n), !1);
    t.shift();
  }
  return !0;
}
function Ti(e, t, n) {
  Ar(e) && n.delete(t);
}
function uf() {
  ((Ro = !1),
    pt !== null && Ar(pt) && (pt = null),
    mt !== null && Ar(mt) && (mt = null),
    ht !== null && Ar(ht) && (ht = null),
    Yn.forEach(Ti),
    Gn.forEach(Ti));
}
function Tn(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Ro ||
      ((Ro = !0),
      Ne.unstable_scheduleCallback(Ne.unstable_NormalPriority, uf)));
}
function Xn(e) {
  function t(l) {
    return Tn(l, e);
  }
  if (0 < Er.length) {
    Tn(Er[0], e);
    for (var n = 1; n < Er.length; n++) {
      var r = Er[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    pt !== null && Tn(pt, e),
      mt !== null && Tn(mt, e),
      ht !== null && Tn(ht, e),
      Yn.forEach(t),
      Gn.forEach(t),
      n = 0;
    n < ut.length;
    n++
  )
    ((r = ut[n]), r.blockedOn === e && (r.blockedOn = null));
  for (; 0 < ut.length && ((n = ut[0]), n.blockedOn === null); )
    (wu(n), n.blockedOn === null && ut.shift());
}
var dn = lt.ReactCurrentBatchConfig,
  qr = !0;
function cf(e, t, n, r) {
  var l = $,
    o = dn.transition;
  dn.transition = null;
  try {
    (($ = 1), js(e, t, n, r));
  } finally {
    (($ = l), (dn.transition = o));
  }
}
function df(e, t, n, r) {
  var l = $,
    o = dn.transition;
  dn.transition = null;
  try {
    (($ = 4), js(e, t, n, r));
  } finally {
    (($ = l), (dn.transition = o));
  }
}
function js(e, t, n, r) {
  if (qr) {
    var l = Io(e, t, n, r);
    if (l === null) (no(e, t, r, el, n), ji(e, r));
    else if (af(l, e, t, n, r)) r.stopPropagation();
    else if ((ji(e, r), t & 4 && -1 < sf.indexOf(e))) {
      for (; l !== null; ) {
        var o = dr(l);
        if (
          (o !== null && yu(o),
          (o = Io(e, t, n, r)),
          o === null && no(e, t, r, el, n),
          o === l)
        )
          break;
        l = o;
      }
      l !== null && r.stopPropagation();
    } else no(e, t, r, null, n);
  }
}
var el = null;
function Io(e, t, n, r) {
  if (((el = null), (e = Ss(r)), (e = Rt(e)), e !== null))
    if (((t = Wt(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = uu(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return ((el = e), null);
}
function Su(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (Zd()) {
        case Es:
          return 1;
        case pu:
          return 4;
        case Zr:
        case Jd:
          return 16;
        case mu:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var dt = null,
  Ts = null,
  Fr = null;
function Eu() {
  if (Fr) return Fr;
  var e,
    t = Ts,
    n = t.length,
    r,
    l = "value" in dt ? dt.value : dt.textContent,
    o = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++);
  var s = n - e;
  for (r = 1; r <= s && t[n - r] === l[o - r]; r++);
  return (Fr = l.slice(e, 1 < r ? 1 - r : void 0));
}
function Ur(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Cr() {
  return !0;
}
function Pi() {
  return !1;
}
function Te(e) {
  function t(n, r, l, o, s) {
    ((this._reactName = n),
      (this._targetInst = l),
      (this.type = r),
      (this.nativeEvent = o),
      (this.target = s),
      (this.currentTarget = null));
    for (var i in e)
      e.hasOwnProperty(i) && ((n = e[i]), (this[i] = n ? n(o) : o[i]));
    return (
      (this.isDefaultPrevented = (
        o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1
      )
        ? Cr
        : Pi),
      (this.isPropagationStopped = Pi),
      this
    );
  }
  return (
    B(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = Cr));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = Cr));
      },
      persist: function () {},
      isPersistent: Cr,
    }),
    t
  );
}
var Sn = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Ps = Te(Sn),
  cr = B({}, Sn, { view: 0, detail: 0 }),
  ff = Te(cr),
  Kl,
  Yl,
  Pn,
  El = B({}, cr, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: _s,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== Pn &&
            (Pn && e.type === "mousemove"
              ? ((Kl = e.screenX - Pn.screenX), (Yl = e.screenY - Pn.screenY))
              : (Yl = Kl = 0),
            (Pn = e)),
          Kl);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : Yl;
    },
  }),
  _i = Te(El),
  pf = B({}, El, { dataTransfer: 0 }),
  mf = Te(pf),
  hf = B({}, cr, { relatedTarget: 0 }),
  Gl = Te(hf),
  gf = B({}, Sn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  yf = Te(gf),
  vf = B({}, Sn, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  xf = Te(vf),
  kf = B({}, Sn, { data: 0 }),
  Li = Te(kf),
  wf = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  Sf = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  Ef = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function Cf(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Ef[e]) ? !!t[e] : !1;
}
function _s() {
  return Cf;
}
var Nf = B({}, cr, {
    key: function (e) {
      if (e.key) {
        var t = wf[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = Ur(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? Sf[e.keyCode] || "Unidentified"
          : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: _s,
    charCode: function (e) {
      return e.type === "keypress" ? Ur(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? Ur(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  jf = Te(Nf),
  Tf = B({}, El, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  zi = Te(Tf),
  Pf = B({}, cr, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: _s,
  }),
  _f = Te(Pf),
  Lf = B({}, Sn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  zf = Te(Lf),
  Df = B({}, El, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
          ? -e.wheelDeltaY
          : "wheelDelta" in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  Mf = Te(Df),
  Rf = [9, 13, 27, 32],
  Ls = qe && "CompositionEvent" in window,
  An = null;
qe && "documentMode" in document && (An = document.documentMode);
var If = qe && "TextEvent" in window && !An,
  Cu = qe && (!Ls || (An && 8 < An && 11 >= An)),
  Di = " ",
  Mi = !1;
function Nu(e, t) {
  switch (e) {
    case "keyup":
      return Rf.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function ju(e) {
  return ((e = e.detail), typeof e == "object" && "data" in e ? e.data : null);
}
var Zt = !1;
function $f(e, t) {
  switch (e) {
    case "compositionend":
      return ju(t);
    case "keypress":
      return t.which !== 32 ? null : ((Mi = !0), Di);
    case "textInput":
      return ((e = t.data), e === Di && Mi ? null : e);
    default:
      return null;
  }
}
function Of(e, t) {
  if (Zt)
    return e === "compositionend" || (!Ls && Nu(e, t))
      ? ((e = Eu()), (Fr = Ts = dt = null), (Zt = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return Cu && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var Af = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function Ri(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!Af[e.type] : t === "textarea";
}
function Tu(e, t, n, r) {
  (lu(r),
    (t = tl(t, "onChange")),
    0 < t.length &&
      ((n = new Ps("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t })));
}
var Fn = null,
  Zn = null;
function Ff(e) {
  Au(e, 0);
}
function Cl(e) {
  var t = en(e);
  if (Za(t)) return e;
}
function Uf(e, t) {
  if (e === "change") return t;
}
var Pu = !1;
if (qe) {
  var Xl;
  if (qe) {
    var Zl = "oninput" in document;
    if (!Zl) {
      var Ii = document.createElement("div");
      (Ii.setAttribute("oninput", "return;"),
        (Zl = typeof Ii.oninput == "function"));
    }
    Xl = Zl;
  } else Xl = !1;
  Pu = Xl && (!document.documentMode || 9 < document.documentMode);
}
function $i() {
  Fn && (Fn.detachEvent("onpropertychange", _u), (Zn = Fn = null));
}
function _u(e) {
  if (e.propertyName === "value" && Cl(Zn)) {
    var t = [];
    (Tu(t, Zn, e, Ss(e)), au(Ff, t));
  }
}
function bf(e, t, n) {
  e === "focusin"
    ? ($i(), (Fn = t), (Zn = n), Fn.attachEvent("onpropertychange", _u))
    : e === "focusout" && $i();
}
function Vf(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return Cl(Zn);
}
function Hf(e, t) {
  if (e === "click") return Cl(t);
}
function Bf(e, t) {
  if (e === "input" || e === "change") return Cl(t);
}
function Wf(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var be = typeof Object.is == "function" ? Object.is : Wf;
function Jn(e, t) {
  if (be(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var l = n[r];
    if (!yo.call(t, l) || !be(e[l], t[l])) return !1;
  }
  return !0;
}
function Oi(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Ai(e, t) {
  var n = Oi(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t))
        return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Oi(n);
  }
}
function Lu(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? Lu(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function zu() {
  for (var e = window, t = Yr(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = Yr(e.document);
  }
  return t;
}
function zs(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function Qf(e) {
  var t = zu(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    Lu(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && zs(n)) {
      if (
        ((t = r.start),
        (e = r.end),
        e === void 0 && (e = t),
        "selectionStart" in n)
      )
        ((n.selectionStart = t),
          (n.selectionEnd = Math.min(e, n.value.length)));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var l = n.textContent.length,
          o = Math.min(r.start, l);
        ((r = r.end === void 0 ? o : Math.min(r.end, l)),
          !e.extend && o > r && ((l = r), (r = o), (o = l)),
          (l = Ai(n, o)));
        var s = Ai(n, r);
        l &&
          s &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== l.node ||
            e.anchorOffset !== l.offset ||
            e.focusNode !== s.node ||
            e.focusOffset !== s.offset) &&
          ((t = t.createRange()),
          t.setStart(l.node, l.offset),
          e.removeAllRanges(),
          o > r
            ? (e.addRange(t), e.extend(s.node, s.offset))
            : (t.setEnd(s.node, s.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      ((e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top));
  }
}
var Kf = qe && "documentMode" in document && 11 >= document.documentMode,
  Jt = null,
  $o = null,
  Un = null,
  Oo = !1;
function Fi(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Oo ||
    Jt == null ||
    Jt !== Yr(r) ||
    ((r = Jt),
    "selectionStart" in r && zs(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (Un && Jn(Un, r)) ||
      ((Un = r),
      (r = tl($o, "onSelect")),
      0 < r.length &&
        ((t = new Ps("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = Jt))));
}
function Nr(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var qt = {
    animationend: Nr("Animation", "AnimationEnd"),
    animationiteration: Nr("Animation", "AnimationIteration"),
    animationstart: Nr("Animation", "AnimationStart"),
    transitionend: Nr("Transition", "TransitionEnd"),
  },
  Jl = {},
  Du = {};
qe &&
  ((Du = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete qt.animationend.animation,
    delete qt.animationiteration.animation,
    delete qt.animationstart.animation),
  "TransitionEvent" in window || delete qt.transitionend.transition);
function Nl(e) {
  if (Jl[e]) return Jl[e];
  if (!qt[e]) return e;
  var t = qt[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in Du) return (Jl[e] = t[n]);
  return e;
}
var Mu = Nl("animationend"),
  Ru = Nl("animationiteration"),
  Iu = Nl("animationstart"),
  $u = Nl("transitionend"),
  Ou = new Map(),
  Ui =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function Ct(e, t) {
  (Ou.set(e, t), Bt(t, [e]));
}
for (var ql = 0; ql < Ui.length; ql++) {
  var eo = Ui[ql],
    Yf = eo.toLowerCase(),
    Gf = eo[0].toUpperCase() + eo.slice(1);
  Ct(Yf, "on" + Gf);
}
Ct(Mu, "onAnimationEnd");
Ct(Ru, "onAnimationIteration");
Ct(Iu, "onAnimationStart");
Ct("dblclick", "onDoubleClick");
Ct("focusin", "onFocus");
Ct("focusout", "onBlur");
Ct($u, "onTransitionEnd");
mn("onMouseEnter", ["mouseout", "mouseover"]);
mn("onMouseLeave", ["mouseout", "mouseover"]);
mn("onPointerEnter", ["pointerout", "pointerover"]);
mn("onPointerLeave", ["pointerout", "pointerover"]);
Bt(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
Bt(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
Bt("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Bt(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
Bt(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
Bt(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var In =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  Xf = new Set("cancel close invalid load scroll toggle".split(" ").concat(In));
function bi(e, t, n) {
  var r = e.type || "unknown-event";
  ((e.currentTarget = n), Kd(r, t, void 0, e), (e.currentTarget = null));
}
function Au(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      l = r.event;
    r = r.listeners;
    e: {
      var o = void 0;
      if (t)
        for (var s = r.length - 1; 0 <= s; s--) {
          var i = r[s],
            a = i.instance,
            c = i.currentTarget;
          if (((i = i.listener), a !== o && l.isPropagationStopped())) break e;
          (bi(l, i, c), (o = a));
        }
      else
        for (s = 0; s < r.length; s++) {
          if (
            ((i = r[s]),
            (a = i.instance),
            (c = i.currentTarget),
            (i = i.listener),
            a !== o && l.isPropagationStopped())
          )
            break e;
          (bi(l, i, c), (o = a));
        }
    }
  }
  if (Xr) throw ((e = Do), (Xr = !1), (Do = null), e);
}
function F(e, t) {
  var n = t[Vo];
  n === void 0 && (n = t[Vo] = new Set());
  var r = e + "__bubble";
  n.has(r) || (Fu(t, e, 2, !1), n.add(r));
}
function to(e, t, n) {
  var r = 0;
  (t && (r |= 4), Fu(n, e, r, t));
}
var jr = "_reactListening" + Math.random().toString(36).slice(2);
function qn(e) {
  if (!e[jr]) {
    ((e[jr] = !0),
      Qa.forEach(function (n) {
        n !== "selectionchange" && (Xf.has(n) || to(n, !1, e), to(n, !0, e));
      }));
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[jr] || ((t[jr] = !0), to("selectionchange", !1, t));
  }
}
function Fu(e, t, n, r) {
  switch (Su(t)) {
    case 1:
      var l = cf;
      break;
    case 4:
      l = df;
      break;
    default:
      l = js;
  }
  ((n = l.bind(null, t, n, e)),
    (l = void 0),
    !zo ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (l = !0),
    r
      ? l !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: l })
        : e.addEventListener(t, n, !0)
      : l !== void 0
        ? e.addEventListener(t, n, { passive: l })
        : e.addEventListener(t, n, !1));
}
function no(e, t, n, r, l) {
  var o = r;
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var s = r.tag;
      if (s === 3 || s === 4) {
        var i = r.stateNode.containerInfo;
        if (i === l || (i.nodeType === 8 && i.parentNode === l)) break;
        if (s === 4)
          for (s = r.return; s !== null; ) {
            var a = s.tag;
            if (
              (a === 3 || a === 4) &&
              ((a = s.stateNode.containerInfo),
              a === l || (a.nodeType === 8 && a.parentNode === l))
            )
              return;
            s = s.return;
          }
        for (; i !== null; ) {
          if (((s = Rt(i)), s === null)) return;
          if (((a = s.tag), a === 5 || a === 6)) {
            r = o = s;
            continue e;
          }
          i = i.parentNode;
        }
      }
      r = r.return;
    }
  au(function () {
    var c = o,
      m = Ss(n),
      g = [];
    e: {
      var h = Ou.get(e);
      if (h !== void 0) {
        var w = Ps,
          x = e;
        switch (e) {
          case "keypress":
            if (Ur(n) === 0) break e;
          case "keydown":
          case "keyup":
            w = jf;
            break;
          case "focusin":
            ((x = "focus"), (w = Gl));
            break;
          case "focusout":
            ((x = "blur"), (w = Gl));
            break;
          case "beforeblur":
          case "afterblur":
            w = Gl;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            w = _i;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            w = mf;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            w = _f;
            break;
          case Mu:
          case Ru:
          case Iu:
            w = yf;
            break;
          case $u:
            w = zf;
            break;
          case "scroll":
            w = ff;
            break;
          case "wheel":
            w = Mf;
            break;
          case "copy":
          case "cut":
          case "paste":
            w = xf;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            w = zi;
        }
        var S = (t & 4) !== 0,
          R = !S && e === "scroll",
          f = S ? (h !== null ? h + "Capture" : null) : h;
        S = [];
        for (var d = c, p; d !== null; ) {
          p = d;
          var y = p.stateNode;
          if (
            (p.tag === 5 &&
              y !== null &&
              ((p = y),
              f !== null && ((y = Kn(d, f)), y != null && S.push(er(d, y, p)))),
            R)
          )
            break;
          d = d.return;
        }
        0 < S.length &&
          ((h = new w(h, x, null, n, m)), g.push({ event: h, listeners: S }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((h = e === "mouseover" || e === "pointerover"),
          (w = e === "mouseout" || e === "pointerout"),
          h &&
            n !== _o &&
            (x = n.relatedTarget || n.fromElement) &&
            (Rt(x) || x[et]))
        )
          break e;
        if (
          (w || h) &&
          ((h =
            m.window === m
              ? m
              : (h = m.ownerDocument)
                ? h.defaultView || h.parentWindow
                : window),
          w
            ? ((x = n.relatedTarget || n.toElement),
              (w = c),
              (x = x ? Rt(x) : null),
              x !== null &&
                ((R = Wt(x)), x !== R || (x.tag !== 5 && x.tag !== 6)) &&
                (x = null))
            : ((w = null), (x = c)),
          w !== x)
        ) {
          if (
            ((S = _i),
            (y = "onMouseLeave"),
            (f = "onMouseEnter"),
            (d = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((S = zi),
              (y = "onPointerLeave"),
              (f = "onPointerEnter"),
              (d = "pointer")),
            (R = w == null ? h : en(w)),
            (p = x == null ? h : en(x)),
            (h = new S(y, d + "leave", w, n, m)),
            (h.target = R),
            (h.relatedTarget = p),
            (y = null),
            Rt(m) === c &&
              ((S = new S(f, d + "enter", x, n, m)),
              (S.target = p),
              (S.relatedTarget = R),
              (y = S)),
            (R = y),
            w && x)
          )
            t: {
              for (S = w, f = x, d = 0, p = S; p; p = Qt(p)) d++;
              for (p = 0, y = f; y; y = Qt(y)) p++;
              for (; 0 < d - p; ) ((S = Qt(S)), d--);
              for (; 0 < p - d; ) ((f = Qt(f)), p--);
              for (; d--; ) {
                if (S === f || (f !== null && S === f.alternate)) break t;
                ((S = Qt(S)), (f = Qt(f)));
              }
              S = null;
            }
          else S = null;
          (w !== null && Vi(g, h, w, S, !1),
            x !== null && R !== null && Vi(g, R, x, S, !0));
        }
      }
      e: {
        if (
          ((h = c ? en(c) : window),
          (w = h.nodeName && h.nodeName.toLowerCase()),
          w === "select" || (w === "input" && h.type === "file"))
        )
          var k = Uf;
        else if (Ri(h))
          if (Pu) k = Bf;
          else {
            k = Vf;
            var E = bf;
          }
        else
          (w = h.nodeName) &&
            w.toLowerCase() === "input" &&
            (h.type === "checkbox" || h.type === "radio") &&
            (k = Hf);
        if (k && (k = k(e, c))) {
          Tu(g, k, n, m);
          break e;
        }
        (E && E(e, h, c),
          e === "focusout" &&
            (E = h._wrapperState) &&
            E.controlled &&
            h.type === "number" &&
            Co(h, "number", h.value));
      }
      switch (((E = c ? en(c) : window), e)) {
        case "focusin":
          (Ri(E) || E.contentEditable === "true") &&
            ((Jt = E), ($o = c), (Un = null));
          break;
        case "focusout":
          Un = $o = Jt = null;
          break;
        case "mousedown":
          Oo = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          ((Oo = !1), Fi(g, n, m));
          break;
        case "selectionchange":
          if (Kf) break;
        case "keydown":
        case "keyup":
          Fi(g, n, m);
      }
      var C;
      if (Ls)
        e: {
          switch (e) {
            case "compositionstart":
              var T = "onCompositionStart";
              break e;
            case "compositionend":
              T = "onCompositionEnd";
              break e;
            case "compositionupdate":
              T = "onCompositionUpdate";
              break e;
          }
          T = void 0;
        }
      else
        Zt
          ? Nu(e, n) && (T = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (T = "onCompositionStart");
      (T &&
        (Cu &&
          n.locale !== "ko" &&
          (Zt || T !== "onCompositionStart"
            ? T === "onCompositionEnd" && Zt && (C = Eu())
            : ((dt = m),
              (Ts = "value" in dt ? dt.value : dt.textContent),
              (Zt = !0))),
        (E = tl(c, T)),
        0 < E.length &&
          ((T = new Li(T, e, null, n, m)),
          g.push({ event: T, listeners: E }),
          C ? (T.data = C) : ((C = ju(n)), C !== null && (T.data = C)))),
        (C = If ? $f(e, n) : Of(e, n)) &&
          ((c = tl(c, "onBeforeInput")),
          0 < c.length &&
            ((m = new Li("onBeforeInput", "beforeinput", null, n, m)),
            g.push({ event: m, listeners: c }),
            (m.data = C))));
    }
    Au(g, t);
  });
}
function er(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function tl(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var l = e,
      o = l.stateNode;
    (l.tag === 5 &&
      o !== null &&
      ((l = o),
      (o = Kn(e, n)),
      o != null && r.unshift(er(e, o, l)),
      (o = Kn(e, t)),
      o != null && r.push(er(e, o, l))),
      (e = e.return));
  }
  return r;
}
function Qt(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Vi(e, t, n, r, l) {
  for (var o = t._reactName, s = []; n !== null && n !== r; ) {
    var i = n,
      a = i.alternate,
      c = i.stateNode;
    if (a !== null && a === r) break;
    (i.tag === 5 &&
      c !== null &&
      ((i = c),
      l
        ? ((a = Kn(n, o)), a != null && s.unshift(er(n, a, i)))
        : l || ((a = Kn(n, o)), a != null && s.push(er(n, a, i)))),
      (n = n.return));
  }
  s.length !== 0 && e.push({ event: t, listeners: s });
}
var Zf = /\r\n?/g,
  Jf = /\u0000|\uFFFD/g;
function Hi(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      Zf,
      `
`,
    )
    .replace(Jf, "");
}
function Tr(e, t, n) {
  if (((t = Hi(t)), Hi(e) !== t && n)) throw Error(v(425));
}
function nl() {}
var Ao = null,
  Fo = null;
function Uo(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var bo = typeof setTimeout == "function" ? setTimeout : void 0,
  qf = typeof clearTimeout == "function" ? clearTimeout : void 0,
  Bi = typeof Promise == "function" ? Promise : void 0,
  ep =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof Bi < "u"
        ? function (e) {
            return Bi.resolve(null).then(e).catch(tp);
          }
        : bo;
function tp(e) {
  setTimeout(function () {
    throw e;
  });
}
function ro(e, t) {
  var n = t,
    r = 0;
  do {
    var l = n.nextSibling;
    if ((e.removeChild(n), l && l.nodeType === 8))
      if (((n = l.data), n === "/$")) {
        if (r === 0) {
          (e.removeChild(l), Xn(t));
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = l;
  } while (n);
  Xn(t);
}
function gt(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function Wi(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var En = Math.random().toString(36).slice(2),
  We = "__reactFiber$" + En,
  tr = "__reactProps$" + En,
  et = "__reactContainer$" + En,
  Vo = "__reactEvents$" + En,
  np = "__reactListeners$" + En,
  rp = "__reactHandles$" + En;
function Rt(e) {
  var t = e[We];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if ((t = n[et] || n[We])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = Wi(e); e !== null; ) {
          if ((n = e[We])) return n;
          e = Wi(e);
        }
      return t;
    }
    ((e = n), (n = e.parentNode));
  }
  return null;
}
function dr(e) {
  return (
    (e = e[We] || e[et]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function en(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(v(33));
}
function jl(e) {
  return e[tr] || null;
}
var Ho = [],
  tn = -1;
function Nt(e) {
  return { current: e };
}
function U(e) {
  0 > tn || ((e.current = Ho[tn]), (Ho[tn] = null), tn--);
}
function A(e, t) {
  (tn++, (Ho[tn] = e.current), (e.current = t));
}
var Et = {},
  ie = Nt(Et),
  ge = Nt(!1),
  Ft = Et;
function hn(e, t) {
  var n = e.type.contextTypes;
  if (!n) return Et;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var l = {},
    o;
  for (o in n) l[o] = t[o];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = l)),
    l
  );
}
function ye(e) {
  return ((e = e.childContextTypes), e != null);
}
function rl() {
  (U(ge), U(ie));
}
function Qi(e, t, n) {
  if (ie.current !== Et) throw Error(v(168));
  (A(ie, t), A(ge, n));
}
function Uu(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in t)) throw Error(v(108, Ud(e) || "Unknown", l));
  return B({}, n, r);
}
function ll(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Et),
    (Ft = ie.current),
    A(ie, e),
    A(ge, ge.current),
    !0
  );
}
function Ki(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(v(169));
  (n
    ? ((e = Uu(e, t, Ft)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      U(ge),
      U(ie),
      A(ie, e))
    : U(ge),
    A(ge, n));
}
var Ge = null,
  Tl = !1,
  lo = !1;
function bu(e) {
  Ge === null ? (Ge = [e]) : Ge.push(e);
}
function lp(e) {
  ((Tl = !0), bu(e));
}
function jt() {
  if (!lo && Ge !== null) {
    lo = !0;
    var e = 0,
      t = $;
    try {
      var n = Ge;
      for ($ = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      ((Ge = null), (Tl = !1));
    } catch (l) {
      throw (Ge !== null && (Ge = Ge.slice(e + 1)), fu(Es, jt), l);
    } finally {
      (($ = t), (lo = !1));
    }
  }
  return null;
}
var nn = [],
  rn = 0,
  ol = null,
  sl = 0,
  _e = [],
  Le = 0,
  Ut = null,
  Xe = 1,
  Ze = "";
function Dt(e, t) {
  ((nn[rn++] = sl), (nn[rn++] = ol), (ol = e), (sl = t));
}
function Vu(e, t, n) {
  ((_e[Le++] = Xe), (_e[Le++] = Ze), (_e[Le++] = Ut), (Ut = e));
  var r = Xe;
  e = Ze;
  var l = 32 - Fe(r) - 1;
  ((r &= ~(1 << l)), (n += 1));
  var o = 32 - Fe(t) + l;
  if (30 < o) {
    var s = l - (l % 5);
    ((o = (r & ((1 << s) - 1)).toString(32)),
      (r >>= s),
      (l -= s),
      (Xe = (1 << (32 - Fe(t) + l)) | (n << l) | r),
      (Ze = o + e));
  } else ((Xe = (1 << o) | (n << l) | r), (Ze = e));
}
function Ds(e) {
  e.return !== null && (Dt(e, 1), Vu(e, 1, 0));
}
function Ms(e) {
  for (; e === ol; )
    ((ol = nn[--rn]), (nn[rn] = null), (sl = nn[--rn]), (nn[rn] = null));
  for (; e === Ut; )
    ((Ut = _e[--Le]),
      (_e[Le] = null),
      (Ze = _e[--Le]),
      (_e[Le] = null),
      (Xe = _e[--Le]),
      (_e[Le] = null));
}
var Ce = null,
  Ee = null,
  b = !1,
  Ae = null;
function Hu(e, t) {
  var n = ze(5, null, null, 0);
  ((n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
}
function Yi(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (Ce = e), (Ee = gt(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (Ce = e), (Ee = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = Ut !== null ? { id: Xe, overflow: Ze } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = ze(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (Ce = e),
            (Ee = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function Bo(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Wo(e) {
  if (b) {
    var t = Ee;
    if (t) {
      var n = t;
      if (!Yi(e, t)) {
        if (Bo(e)) throw Error(v(418));
        t = gt(n.nextSibling);
        var r = Ce;
        t && Yi(e, t)
          ? Hu(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (b = !1), (Ce = e));
      }
    } else {
      if (Bo(e)) throw Error(v(418));
      ((e.flags = (e.flags & -4097) | 2), (b = !1), (Ce = e));
    }
  }
}
function Gi(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
    e = e.return;
  Ce = e;
}
function Pr(e) {
  if (e !== Ce) return !1;
  if (!b) return (Gi(e), (b = !0), !1);
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !Uo(e.type, e.memoizedProps))),
    t && (t = Ee))
  ) {
    if (Bo(e)) throw (Bu(), Error(v(418)));
    for (; t; ) (Hu(e, t), (t = gt(t.nextSibling)));
  }
  if ((Gi(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(v(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Ee = gt(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      Ee = null;
    }
  } else Ee = Ce ? gt(e.stateNode.nextSibling) : null;
  return !0;
}
function Bu() {
  for (var e = Ee; e; ) e = gt(e.nextSibling);
}
function gn() {
  ((Ee = Ce = null), (b = !1));
}
function Rs(e) {
  Ae === null ? (Ae = [e]) : Ae.push(e);
}
var op = lt.ReactCurrentBatchConfig;
function _n(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(v(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(v(147, e));
      var l = r,
        o = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === o
        ? t.ref
        : ((t = function (s) {
            var i = l.refs;
            s === null ? delete i[o] : (i[o] = s);
          }),
          (t._stringRef = o),
          t);
    }
    if (typeof e != "string") throw Error(v(284));
    if (!n._owner) throw Error(v(290, e));
  }
  return e;
}
function _r(e, t) {
  throw (
    (e = Object.prototype.toString.call(t)),
    Error(
      v(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e,
      ),
    )
  );
}
function Xi(e) {
  var t = e._init;
  return t(e._payload);
}
function Wu(e) {
  function t(f, d) {
    if (e) {
      var p = f.deletions;
      p === null ? ((f.deletions = [d]), (f.flags |= 16)) : p.push(d);
    }
  }
  function n(f, d) {
    if (!e) return null;
    for (; d !== null; ) (t(f, d), (d = d.sibling));
    return null;
  }
  function r(f, d) {
    for (f = new Map(); d !== null; )
      (d.key !== null ? f.set(d.key, d) : f.set(d.index, d), (d = d.sibling));
    return f;
  }
  function l(f, d) {
    return ((f = kt(f, d)), (f.index = 0), (f.sibling = null), f);
  }
  function o(f, d, p) {
    return (
      (f.index = p),
      e
        ? ((p = f.alternate),
          p !== null
            ? ((p = p.index), p < d ? ((f.flags |= 2), d) : p)
            : ((f.flags |= 2), d))
        : ((f.flags |= 1048576), d)
    );
  }
  function s(f) {
    return (e && f.alternate === null && (f.flags |= 2), f);
  }
  function i(f, d, p, y) {
    return d === null || d.tag !== 6
      ? ((d = fo(p, f.mode, y)), (d.return = f), d)
      : ((d = l(d, p)), (d.return = f), d);
  }
  function a(f, d, p, y) {
    var k = p.type;
    return k === Xt
      ? m(f, d, p.props.children, y, p.key)
      : d !== null &&
          (d.elementType === k ||
            (typeof k == "object" &&
              k !== null &&
              k.$$typeof === it &&
              Xi(k) === d.type))
        ? ((y = l(d, p.props)), (y.ref = _n(f, d, p)), (y.return = f), y)
        : ((y = Kr(p.type, p.key, p.props, null, f.mode, y)),
          (y.ref = _n(f, d, p)),
          (y.return = f),
          y);
  }
  function c(f, d, p, y) {
    return d === null ||
      d.tag !== 4 ||
      d.stateNode.containerInfo !== p.containerInfo ||
      d.stateNode.implementation !== p.implementation
      ? ((d = po(p, f.mode, y)), (d.return = f), d)
      : ((d = l(d, p.children || [])), (d.return = f), d);
  }
  function m(f, d, p, y, k) {
    return d === null || d.tag !== 7
      ? ((d = At(p, f.mode, y, k)), (d.return = f), d)
      : ((d = l(d, p)), (d.return = f), d);
  }
  function g(f, d, p) {
    if ((typeof d == "string" && d !== "") || typeof d == "number")
      return ((d = fo("" + d, f.mode, p)), (d.return = f), d);
    if (typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case vr:
          return (
            (p = Kr(d.type, d.key, d.props, null, f.mode, p)),
            (p.ref = _n(f, null, d)),
            (p.return = f),
            p
          );
        case Gt:
          return ((d = po(d, f.mode, p)), (d.return = f), d);
        case it:
          var y = d._init;
          return g(f, y(d._payload), p);
      }
      if (Mn(d) || Cn(d))
        return ((d = At(d, f.mode, p, null)), (d.return = f), d);
      _r(f, d);
    }
    return null;
  }
  function h(f, d, p, y) {
    var k = d !== null ? d.key : null;
    if ((typeof p == "string" && p !== "") || typeof p == "number")
      return k !== null ? null : i(f, d, "" + p, y);
    if (typeof p == "object" && p !== null) {
      switch (p.$$typeof) {
        case vr:
          return p.key === k ? a(f, d, p, y) : null;
        case Gt:
          return p.key === k ? c(f, d, p, y) : null;
        case it:
          return ((k = p._init), h(f, d, k(p._payload), y));
      }
      if (Mn(p) || Cn(p)) return k !== null ? null : m(f, d, p, y, null);
      _r(f, p);
    }
    return null;
  }
  function w(f, d, p, y, k) {
    if ((typeof y == "string" && y !== "") || typeof y == "number")
      return ((f = f.get(p) || null), i(d, f, "" + y, k));
    if (typeof y == "object" && y !== null) {
      switch (y.$$typeof) {
        case vr:
          return (
            (f = f.get(y.key === null ? p : y.key) || null),
            a(d, f, y, k)
          );
        case Gt:
          return (
            (f = f.get(y.key === null ? p : y.key) || null),
            c(d, f, y, k)
          );
        case it:
          var E = y._init;
          return w(f, d, p, E(y._payload), k);
      }
      if (Mn(y) || Cn(y)) return ((f = f.get(p) || null), m(d, f, y, k, null));
      _r(d, y);
    }
    return null;
  }
  function x(f, d, p, y) {
    for (
      var k = null, E = null, C = d, T = (d = 0), O = null;
      C !== null && T < p.length;
      T++
    ) {
      C.index > T ? ((O = C), (C = null)) : (O = C.sibling);
      var L = h(f, C, p[T], y);
      if (L === null) {
        C === null && (C = O);
        break;
      }
      (e && C && L.alternate === null && t(f, C),
        (d = o(L, d, T)),
        E === null ? (k = L) : (E.sibling = L),
        (E = L),
        (C = O));
    }
    if (T === p.length) return (n(f, C), b && Dt(f, T), k);
    if (C === null) {
      for (; T < p.length; T++)
        ((C = g(f, p[T], y)),
          C !== null &&
            ((d = o(C, d, T)),
            E === null ? (k = C) : (E.sibling = C),
            (E = C)));
      return (b && Dt(f, T), k);
    }
    for (C = r(f, C); T < p.length; T++)
      ((O = w(C, f, T, p[T], y)),
        O !== null &&
          (e && O.alternate !== null && C.delete(O.key === null ? T : O.key),
          (d = o(O, d, T)),
          E === null ? (k = O) : (E.sibling = O),
          (E = O)));
    return (
      e &&
        C.forEach(function (ae) {
          return t(f, ae);
        }),
      b && Dt(f, T),
      k
    );
  }
  function S(f, d, p, y) {
    var k = Cn(p);
    if (typeof k != "function") throw Error(v(150));
    if (((p = k.call(p)), p == null)) throw Error(v(151));
    for (
      var E = (k = null), C = d, T = (d = 0), O = null, L = p.next();
      C !== null && !L.done;
      T++, L = p.next()
    ) {
      C.index > T ? ((O = C), (C = null)) : (O = C.sibling);
      var ae = h(f, C, L.value, y);
      if (ae === null) {
        C === null && (C = O);
        break;
      }
      (e && C && ae.alternate === null && t(f, C),
        (d = o(ae, d, T)),
        E === null ? (k = ae) : (E.sibling = ae),
        (E = ae),
        (C = O));
    }
    if (L.done) return (n(f, C), b && Dt(f, T), k);
    if (C === null) {
      for (; !L.done; T++, L = p.next())
        ((L = g(f, L.value, y)),
          L !== null &&
            ((d = o(L, d, T)),
            E === null ? (k = L) : (E.sibling = L),
            (E = L)));
      return (b && Dt(f, T), k);
    }
    for (C = r(f, C); !L.done; T++, L = p.next())
      ((L = w(C, f, T, L.value, y)),
        L !== null &&
          (e && L.alternate !== null && C.delete(L.key === null ? T : L.key),
          (d = o(L, d, T)),
          E === null ? (k = L) : (E.sibling = L),
          (E = L)));
    return (
      e &&
        C.forEach(function (Tt) {
          return t(f, Tt);
        }),
      b && Dt(f, T),
      k
    );
  }
  function R(f, d, p, y) {
    if (
      (typeof p == "object" &&
        p !== null &&
        p.type === Xt &&
        p.key === null &&
        (p = p.props.children),
      typeof p == "object" && p !== null)
    ) {
      switch (p.$$typeof) {
        case vr:
          e: {
            for (var k = p.key, E = d; E !== null; ) {
              if (E.key === k) {
                if (((k = p.type), k === Xt)) {
                  if (E.tag === 7) {
                    (n(f, E.sibling),
                      (d = l(E, p.props.children)),
                      (d.return = f),
                      (f = d));
                    break e;
                  }
                } else if (
                  E.elementType === k ||
                  (typeof k == "object" &&
                    k !== null &&
                    k.$$typeof === it &&
                    Xi(k) === E.type)
                ) {
                  (n(f, E.sibling),
                    (d = l(E, p.props)),
                    (d.ref = _n(f, E, p)),
                    (d.return = f),
                    (f = d));
                  break e;
                }
                n(f, E);
                break;
              } else t(f, E);
              E = E.sibling;
            }
            p.type === Xt
              ? ((d = At(p.props.children, f.mode, y, p.key)),
                (d.return = f),
                (f = d))
              : ((y = Kr(p.type, p.key, p.props, null, f.mode, y)),
                (y.ref = _n(f, d, p)),
                (y.return = f),
                (f = y));
          }
          return s(f);
        case Gt:
          e: {
            for (E = p.key; d !== null; ) {
              if (d.key === E)
                if (
                  d.tag === 4 &&
                  d.stateNode.containerInfo === p.containerInfo &&
                  d.stateNode.implementation === p.implementation
                ) {
                  (n(f, d.sibling),
                    (d = l(d, p.children || [])),
                    (d.return = f),
                    (f = d));
                  break e;
                } else {
                  n(f, d);
                  break;
                }
              else t(f, d);
              d = d.sibling;
            }
            ((d = po(p, f.mode, y)), (d.return = f), (f = d));
          }
          return s(f);
        case it:
          return ((E = p._init), R(f, d, E(p._payload), y));
      }
      if (Mn(p)) return x(f, d, p, y);
      if (Cn(p)) return S(f, d, p, y);
      _r(f, p);
    }
    return (typeof p == "string" && p !== "") || typeof p == "number"
      ? ((p = "" + p),
        d !== null && d.tag === 6
          ? (n(f, d.sibling), (d = l(d, p)), (d.return = f), (f = d))
          : (n(f, d), (d = fo(p, f.mode, y)), (d.return = f), (f = d)),
        s(f))
      : n(f, d);
  }
  return R;
}
var yn = Wu(!0),
  Qu = Wu(!1),
  il = Nt(null),
  al = null,
  ln = null,
  Is = null;
function $s() {
  Is = ln = al = null;
}
function Os(e) {
  var t = il.current;
  (U(il), (e._currentValue = t));
}
function Qo(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function fn(e, t) {
  ((al = e),
    (Is = ln = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && (he = !0), (e.firstContext = null)));
}
function Me(e) {
  var t = e._currentValue;
  if (Is !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), ln === null)) {
      if (al === null) throw Error(v(308));
      ((ln = e), (al.dependencies = { lanes: 0, firstContext: e }));
    } else ln = ln.next = e;
  return t;
}
var It = null;
function As(e) {
  It === null ? (It = [e]) : It.push(e);
}
function Ku(e, t, n, r) {
  var l = t.interleaved;
  return (
    l === null ? ((n.next = n), As(t)) : ((n.next = l.next), (l.next = n)),
    (t.interleaved = n),
    tt(e, r)
  );
}
function tt(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    ((e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return));
  return n.tag === 3 ? n.stateNode : null;
}
var at = !1;
function Fs(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function Yu(e, t) {
  ((e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      }));
}
function Je(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function yt(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), I & 2)) {
    var l = r.pending;
    return (
      l === null ? (t.next = t) : ((t.next = l.next), (l.next = t)),
      (r.pending = t),
      tt(e, n)
    );
  }
  return (
    (l = r.interleaved),
    l === null ? ((t.next = t), As(r)) : ((t.next = l.next), (l.next = t)),
    (r.interleaved = t),
    tt(e, n)
  );
}
function br(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Cs(e, n));
  }
}
function Zi(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var l = null,
      o = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var s = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        (o === null ? (l = o = s) : (o = o.next = s), (n = n.next));
      } while (n !== null);
      o === null ? (l = o = t) : (o = o.next = t);
    } else l = o = t;
    ((n = {
      baseState: r.baseState,
      firstBaseUpdate: l,
      lastBaseUpdate: o,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n));
    return;
  }
  ((e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t));
}
function ul(e, t, n, r) {
  var l = e.updateQueue;
  at = !1;
  var o = l.firstBaseUpdate,
    s = l.lastBaseUpdate,
    i = l.shared.pending;
  if (i !== null) {
    l.shared.pending = null;
    var a = i,
      c = a.next;
    ((a.next = null), s === null ? (o = c) : (s.next = c), (s = a));
    var m = e.alternate;
    m !== null &&
      ((m = m.updateQueue),
      (i = m.lastBaseUpdate),
      i !== s &&
        (i === null ? (m.firstBaseUpdate = c) : (i.next = c),
        (m.lastBaseUpdate = a)));
  }
  if (o !== null) {
    var g = l.baseState;
    ((s = 0), (m = c = a = null), (i = o));
    do {
      var h = i.lane,
        w = i.eventTime;
      if ((r & h) === h) {
        m !== null &&
          (m = m.next =
            {
              eventTime: w,
              lane: 0,
              tag: i.tag,
              payload: i.payload,
              callback: i.callback,
              next: null,
            });
        e: {
          var x = e,
            S = i;
          switch (((h = t), (w = n), S.tag)) {
            case 1:
              if (((x = S.payload), typeof x == "function")) {
                g = x.call(w, g, h);
                break e;
              }
              g = x;
              break e;
            case 3:
              x.flags = (x.flags & -65537) | 128;
            case 0:
              if (
                ((x = S.payload),
                (h = typeof x == "function" ? x.call(w, g, h) : x),
                h == null)
              )
                break e;
              g = B({}, g, h);
              break e;
            case 2:
              at = !0;
          }
        }
        i.callback !== null &&
          i.lane !== 0 &&
          ((e.flags |= 64),
          (h = l.effects),
          h === null ? (l.effects = [i]) : h.push(i));
      } else
        ((w = {
          eventTime: w,
          lane: h,
          tag: i.tag,
          payload: i.payload,
          callback: i.callback,
          next: null,
        }),
          m === null ? ((c = m = w), (a = g)) : (m = m.next = w),
          (s |= h));
      if (((i = i.next), i === null)) {
        if (((i = l.shared.pending), i === null)) break;
        ((h = i),
          (i = h.next),
          (h.next = null),
          (l.lastBaseUpdate = h),
          (l.shared.pending = null));
      }
    } while (!0);
    if (
      (m === null && (a = g),
      (l.baseState = a),
      (l.firstBaseUpdate = c),
      (l.lastBaseUpdate = m),
      (t = l.shared.interleaved),
      t !== null)
    ) {
      l = t;
      do ((s |= l.lane), (l = l.next));
      while (l !== t);
    } else o === null && (l.shared.lanes = 0);
    ((Vt |= s), (e.lanes = s), (e.memoizedState = g));
  }
}
function Ji(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        l = r.callback;
      if (l !== null) {
        if (((r.callback = null), (r = n), typeof l != "function"))
          throw Error(v(191, l));
        l.call(r);
      }
    }
}
var fr = {},
  Ke = Nt(fr),
  nr = Nt(fr),
  rr = Nt(fr);
function $t(e) {
  if (e === fr) throw Error(v(174));
  return e;
}
function Us(e, t) {
  switch ((A(rr, t), A(nr, e), A(Ke, fr), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : jo(null, "");
      break;
    default:
      ((e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = jo(t, e)));
  }
  (U(Ke), A(Ke, t));
}
function vn() {
  (U(Ke), U(nr), U(rr));
}
function Gu(e) {
  $t(rr.current);
  var t = $t(Ke.current),
    n = jo(t, e.type);
  t !== n && (A(nr, e), A(Ke, n));
}
function bs(e) {
  nr.current === e && (U(Ke), U(nr));
}
var V = Nt(0);
function cl(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      ((t.child.return = t), (t = t.child));
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    ((t.sibling.return = t.return), (t = t.sibling));
  }
  return null;
}
var oo = [];
function Vs() {
  for (var e = 0; e < oo.length; e++)
    oo[e]._workInProgressVersionPrimary = null;
  oo.length = 0;
}
var Vr = lt.ReactCurrentDispatcher,
  so = lt.ReactCurrentBatchConfig,
  bt = 0,
  H = null,
  G = null,
  J = null,
  dl = !1,
  bn = !1,
  lr = 0,
  sp = 0;
function le() {
  throw Error(v(321));
}
function Hs(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!be(e[n], t[n])) return !1;
  return !0;
}
function Bs(e, t, n, r, l, o) {
  if (
    ((bt = o),
    (H = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (Vr.current = e === null || e.memoizedState === null ? cp : dp),
    (e = n(r, l)),
    bn)
  ) {
    o = 0;
    do {
      if (((bn = !1), (lr = 0), 25 <= o)) throw Error(v(301));
      ((o += 1),
        (J = G = null),
        (t.updateQueue = null),
        (Vr.current = fp),
        (e = n(r, l)));
    } while (bn);
  }
  if (
    ((Vr.current = fl),
    (t = G !== null && G.next !== null),
    (bt = 0),
    (J = G = H = null),
    (dl = !1),
    t)
  )
    throw Error(v(300));
  return e;
}
function Ws() {
  var e = lr !== 0;
  return ((lr = 0), e);
}
function Be() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return (J === null ? (H.memoizedState = J = e) : (J = J.next = e), J);
}
function Re() {
  if (G === null) {
    var e = H.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = G.next;
  var t = J === null ? H.memoizedState : J.next;
  if (t !== null) ((J = t), (G = e));
  else {
    if (e === null) throw Error(v(310));
    ((G = e),
      (e = {
        memoizedState: G.memoizedState,
        baseState: G.baseState,
        baseQueue: G.baseQueue,
        queue: G.queue,
        next: null,
      }),
      J === null ? (H.memoizedState = J = e) : (J = J.next = e));
  }
  return J;
}
function or(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function io(e) {
  var t = Re(),
    n = t.queue;
  if (n === null) throw Error(v(311));
  n.lastRenderedReducer = e;
  var r = G,
    l = r.baseQueue,
    o = n.pending;
  if (o !== null) {
    if (l !== null) {
      var s = l.next;
      ((l.next = o.next), (o.next = s));
    }
    ((r.baseQueue = l = o), (n.pending = null));
  }
  if (l !== null) {
    ((o = l.next), (r = r.baseState));
    var i = (s = null),
      a = null,
      c = o;
    do {
      var m = c.lane;
      if ((bt & m) === m)
        (a !== null &&
          (a = a.next =
            {
              lane: 0,
              action: c.action,
              hasEagerState: c.hasEagerState,
              eagerState: c.eagerState,
              next: null,
            }),
          (r = c.hasEagerState ? c.eagerState : e(r, c.action)));
      else {
        var g = {
          lane: m,
          action: c.action,
          hasEagerState: c.hasEagerState,
          eagerState: c.eagerState,
          next: null,
        };
        (a === null ? ((i = a = g), (s = r)) : (a = a.next = g),
          (H.lanes |= m),
          (Vt |= m));
      }
      c = c.next;
    } while (c !== null && c !== o);
    (a === null ? (s = r) : (a.next = i),
      be(r, t.memoizedState) || (he = !0),
      (t.memoizedState = r),
      (t.baseState = s),
      (t.baseQueue = a),
      (n.lastRenderedState = r));
  }
  if (((e = n.interleaved), e !== null)) {
    l = e;
    do ((o = l.lane), (H.lanes |= o), (Vt |= o), (l = l.next));
    while (l !== e);
  } else l === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function ao(e) {
  var t = Re(),
    n = t.queue;
  if (n === null) throw Error(v(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    l = n.pending,
    o = t.memoizedState;
  if (l !== null) {
    n.pending = null;
    var s = (l = l.next);
    do ((o = e(o, s.action)), (s = s.next));
    while (s !== l);
    (be(o, t.memoizedState) || (he = !0),
      (t.memoizedState = o),
      t.baseQueue === null && (t.baseState = o),
      (n.lastRenderedState = o));
  }
  return [o, r];
}
function Xu() {}
function Zu(e, t) {
  var n = H,
    r = Re(),
    l = t(),
    o = !be(r.memoizedState, l);
  if (
    (o && ((r.memoizedState = l), (he = !0)),
    (r = r.queue),
    Qs(ec.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || o || (J !== null && J.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      sr(9, qu.bind(null, n, r, l, t), void 0, null),
      q === null)
    )
      throw Error(v(349));
    bt & 30 || Ju(n, t, l);
  }
  return l;
}
function Ju(e, t, n) {
  ((e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = H.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (H.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
}
function qu(e, t, n, r) {
  ((t.value = n), (t.getSnapshot = r), tc(t) && nc(e));
}
function ec(e, t, n) {
  return n(function () {
    tc(t) && nc(e);
  });
}
function tc(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !be(e, n);
  } catch {
    return !0;
  }
}
function nc(e) {
  var t = tt(e, 1);
  t !== null && Ue(t, e, 1, -1);
}
function qi(e) {
  var t = Be();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: or,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = up.bind(null, H, e)),
    [t.memoizedState, e]
  );
}
function sr(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = H.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (H.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function rc() {
  return Re().memoizedState;
}
function Hr(e, t, n, r) {
  var l = Be();
  ((H.flags |= e),
    (l.memoizedState = sr(1 | t, n, void 0, r === void 0 ? null : r)));
}
function Pl(e, t, n, r) {
  var l = Re();
  r = r === void 0 ? null : r;
  var o = void 0;
  if (G !== null) {
    var s = G.memoizedState;
    if (((o = s.destroy), r !== null && Hs(r, s.deps))) {
      l.memoizedState = sr(t, n, o, r);
      return;
    }
  }
  ((H.flags |= e), (l.memoizedState = sr(1 | t, n, o, r)));
}
function ea(e, t) {
  return Hr(8390656, 8, e, t);
}
function Qs(e, t) {
  return Pl(2048, 8, e, t);
}
function lc(e, t) {
  return Pl(4, 2, e, t);
}
function oc(e, t) {
  return Pl(4, 4, e, t);
}
function sc(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function ic(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null),
    Pl(4, 4, sc.bind(null, t, e), n)
  );
}
function Ks() {}
function ac(e, t) {
  var n = Re();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Hs(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function uc(e, t) {
  var n = Re();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && Hs(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function cc(e, t, n) {
  return bt & 21
    ? (be(n, t) || ((n = hu()), (H.lanes |= n), (Vt |= n), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), (he = !0)), (e.memoizedState = n));
}
function ip(e, t) {
  var n = $;
  (($ = n !== 0 && 4 > n ? n : 4), e(!0));
  var r = so.transition;
  so.transition = {};
  try {
    (e(!1), t());
  } finally {
    (($ = n), (so.transition = r));
  }
}
function dc() {
  return Re().memoizedState;
}
function ap(e, t, n) {
  var r = xt(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    fc(e))
  )
    pc(t, n);
  else if (((n = Ku(e, t, n, r)), n !== null)) {
    var l = ce();
    (Ue(n, e, r, l), mc(n, t, r));
  }
}
function up(e, t, n) {
  var r = xt(e),
    l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (fc(e)) pc(t, l);
  else {
    var o = e.alternate;
    if (
      e.lanes === 0 &&
      (o === null || o.lanes === 0) &&
      ((o = t.lastRenderedReducer), o !== null)
    )
      try {
        var s = t.lastRenderedState,
          i = o(s, n);
        if (((l.hasEagerState = !0), (l.eagerState = i), be(i, s))) {
          var a = t.interleaved;
          (a === null
            ? ((l.next = l), As(t))
            : ((l.next = a.next), (a.next = l)),
            (t.interleaved = l));
          return;
        }
      } catch {
      } finally {
      }
    ((n = Ku(e, t, l, r)),
      n !== null && ((l = ce()), Ue(n, e, r, l), mc(n, t, r)));
  }
}
function fc(e) {
  var t = e.alternate;
  return e === H || (t !== null && t === H);
}
function pc(e, t) {
  bn = dl = !0;
  var n = e.pending;
  (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t));
}
function mc(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Cs(e, n));
  }
}
var fl = {
    readContext: Me,
    useCallback: le,
    useContext: le,
    useEffect: le,
    useImperativeHandle: le,
    useInsertionEffect: le,
    useLayoutEffect: le,
    useMemo: le,
    useReducer: le,
    useRef: le,
    useState: le,
    useDebugValue: le,
    useDeferredValue: le,
    useTransition: le,
    useMutableSource: le,
    useSyncExternalStore: le,
    useId: le,
    unstable_isNewReconciler: !1,
  },
  cp = {
    readContext: Me,
    useCallback: function (e, t) {
      return ((Be().memoizedState = [e, t === void 0 ? null : t]), e);
    },
    useContext: Me,
    useEffect: ea,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        Hr(4194308, 4, sc.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return Hr(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return Hr(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = Be();
      return (
        (t = t === void 0 ? null : t),
        (e = e()),
        (n.memoizedState = [e, t]),
        e
      );
    },
    useReducer: function (e, t, n) {
      var r = Be();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = ap.bind(null, H, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = Be();
      return ((e = { current: e }), (t.memoizedState = e));
    },
    useState: qi,
    useDebugValue: Ks,
    useDeferredValue: function (e) {
      return (Be().memoizedState = e);
    },
    useTransition: function () {
      var e = qi(!1),
        t = e[0];
      return ((e = ip.bind(null, e[1])), (Be().memoizedState = e), [t, e]);
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = H,
        l = Be();
      if (b) {
        if (n === void 0) throw Error(v(407));
        n = n();
      } else {
        if (((n = t()), q === null)) throw Error(v(349));
        bt & 30 || Ju(r, t, n);
      }
      l.memoizedState = n;
      var o = { value: n, getSnapshot: t };
      return (
        (l.queue = o),
        ea(ec.bind(null, r, o, e), [e]),
        (r.flags |= 2048),
        sr(9, qu.bind(null, r, o, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = Be(),
        t = q.identifierPrefix;
      if (b) {
        var n = Ze,
          r = Xe;
        ((n = (r & ~(1 << (32 - Fe(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = lr++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":"));
      } else ((n = sp++), (t = ":" + t + "r" + n.toString(32) + ":"));
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  dp = {
    readContext: Me,
    useCallback: ac,
    useContext: Me,
    useEffect: Qs,
    useImperativeHandle: ic,
    useInsertionEffect: lc,
    useLayoutEffect: oc,
    useMemo: uc,
    useReducer: io,
    useRef: rc,
    useState: function () {
      return io(or);
    },
    useDebugValue: Ks,
    useDeferredValue: function (e) {
      var t = Re();
      return cc(t, G.memoizedState, e);
    },
    useTransition: function () {
      var e = io(or)[0],
        t = Re().memoizedState;
      return [e, t];
    },
    useMutableSource: Xu,
    useSyncExternalStore: Zu,
    useId: dc,
    unstable_isNewReconciler: !1,
  },
  fp = {
    readContext: Me,
    useCallback: ac,
    useContext: Me,
    useEffect: Qs,
    useImperativeHandle: ic,
    useInsertionEffect: lc,
    useLayoutEffect: oc,
    useMemo: uc,
    useReducer: ao,
    useRef: rc,
    useState: function () {
      return ao(or);
    },
    useDebugValue: Ks,
    useDeferredValue: function (e) {
      var t = Re();
      return G === null ? (t.memoizedState = e) : cc(t, G.memoizedState, e);
    },
    useTransition: function () {
      var e = ao(or)[0],
        t = Re().memoizedState;
      return [e, t];
    },
    useMutableSource: Xu,
    useSyncExternalStore: Zu,
    useId: dc,
    unstable_isNewReconciler: !1,
  };
function $e(e, t) {
  if (e && e.defaultProps) {
    ((t = B({}, t)), (e = e.defaultProps));
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function Ko(e, t, n, r) {
  ((t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : B({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n));
}
var _l = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Wt(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = ce(),
      l = xt(e),
      o = Je(r, l);
    ((o.payload = t),
      n != null && (o.callback = n),
      (t = yt(e, o, l)),
      t !== null && (Ue(t, e, l, r), br(t, e, l)));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = ce(),
      l = xt(e),
      o = Je(r, l);
    ((o.tag = 1),
      (o.payload = t),
      n != null && (o.callback = n),
      (t = yt(e, o, l)),
      t !== null && (Ue(t, e, l, r), br(t, e, l)));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = ce(),
      r = xt(e),
      l = Je(n, r);
    ((l.tag = 2),
      t != null && (l.callback = t),
      (t = yt(e, l, r)),
      t !== null && (Ue(t, e, r, n), br(t, e, r)));
  },
};
function ta(e, t, n, r, l, o, s) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, o, s)
      : t.prototype && t.prototype.isPureReactComponent
        ? !Jn(n, r) || !Jn(l, o)
        : !0
  );
}
function hc(e, t, n) {
  var r = !1,
    l = Et,
    o = t.contextType;
  return (
    typeof o == "object" && o !== null
      ? (o = Me(o))
      : ((l = ye(t) ? Ft : ie.current),
        (r = t.contextTypes),
        (o = (r = r != null) ? hn(e, l) : Et)),
    (t = new t(n, o)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = _l),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = l),
      (e.__reactInternalMemoizedMaskedChildContext = o)),
    t
  );
}
function na(e, t, n, r) {
  ((e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && _l.enqueueReplaceState(t, t.state, null));
}
function Yo(e, t, n, r) {
  var l = e.stateNode;
  ((l.props = n), (l.state = e.memoizedState), (l.refs = {}), Fs(e));
  var o = t.contextType;
  (typeof o == "object" && o !== null
    ? (l.context = Me(o))
    : ((o = ye(t) ? Ft : ie.current), (l.context = hn(e, o))),
    (l.state = e.memoizedState),
    (o = t.getDerivedStateFromProps),
    typeof o == "function" && (Ko(e, t, o, n), (l.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof l.getSnapshotBeforeUpdate == "function" ||
      (typeof l.UNSAFE_componentWillMount != "function" &&
        typeof l.componentWillMount != "function") ||
      ((t = l.state),
      typeof l.componentWillMount == "function" && l.componentWillMount(),
      typeof l.UNSAFE_componentWillMount == "function" &&
        l.UNSAFE_componentWillMount(),
      t !== l.state && _l.enqueueReplaceState(l, l.state, null),
      ul(e, n, l, r),
      (l.state = e.memoizedState)),
    typeof l.componentDidMount == "function" && (e.flags |= 4194308));
}
function xn(e, t) {
  try {
    var n = "",
      r = t;
    do ((n += Fd(r)), (r = r.return));
    while (r);
    var l = n;
  } catch (o) {
    l =
      `
Error generating stack: ` +
      o.message +
      `
` +
      o.stack;
  }
  return { value: e, source: t, stack: l, digest: null };
}
function uo(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function Go(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var pp = typeof WeakMap == "function" ? WeakMap : Map;
function gc(e, t, n) {
  ((n = Je(-1, n)), (n.tag = 3), (n.payload = { element: null }));
  var r = t.value;
  return (
    (n.callback = function () {
      (ml || ((ml = !0), (os = r)), Go(e, t));
    }),
    n
  );
}
function yc(e, t, n) {
  ((n = Je(-1, n)), (n.tag = 3));
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var l = t.value;
    ((n.payload = function () {
      return r(l);
    }),
      (n.callback = function () {
        Go(e, t);
      }));
  }
  var o = e.stateNode;
  return (
    o !== null &&
      typeof o.componentDidCatch == "function" &&
      (n.callback = function () {
        (Go(e, t),
          typeof r != "function" &&
            (vt === null ? (vt = new Set([this])) : vt.add(this)));
        var s = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: s !== null ? s : "",
        });
      }),
    n
  );
}
function ra(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new pp();
    var l = new Set();
    r.set(t, l);
  } else ((l = r.get(t)), l === void 0 && ((l = new Set()), r.set(t, l)));
  l.has(n) || (l.add(n), (e = Tp.bind(null, e, t, n)), t.then(e, e));
}
function la(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function oa(e, t, n, r, l) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = l), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = Je(-1, 1)), (t.tag = 2), yt(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var mp = lt.ReactCurrentOwner,
  he = !1;
function ue(e, t, n, r) {
  t.child = e === null ? Qu(t, null, n, r) : yn(t, e.child, n, r);
}
function sa(e, t, n, r, l) {
  n = n.render;
  var o = t.ref;
  return (
    fn(t, l),
    (r = Bs(e, t, n, r, o, l)),
    (n = Ws()),
    e !== null && !he
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~l),
        nt(e, t, l))
      : (b && n && Ds(t), (t.flags |= 1), ue(e, t, r, l), t.child)
  );
}
function ia(e, t, n, r, l) {
  if (e === null) {
    var o = n.type;
    return typeof o == "function" &&
      !ti(o) &&
      o.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = o), vc(e, t, o, r, l))
      : ((e = Kr(n.type, null, r, t, t.mode, l)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((o = e.child), !(e.lanes & l))) {
    var s = o.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : Jn), n(s, r) && e.ref === t.ref)
    )
      return nt(e, t, l);
  }
  return (
    (t.flags |= 1),
    (e = kt(o, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function vc(e, t, n, r, l) {
  if (e !== null) {
    var o = e.memoizedProps;
    if (Jn(o, r) && e.ref === t.ref)
      if (((he = !1), (t.pendingProps = r = o), (e.lanes & l) !== 0))
        e.flags & 131072 && (he = !0);
      else return ((t.lanes = e.lanes), nt(e, t, l));
  }
  return Xo(e, t, n, r, l);
}
function xc(e, t, n) {
  var r = t.pendingProps,
    l = r.children,
    o = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if (!(t.mode & 1))
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        A(sn, Se),
        (Se |= n));
    else {
      if (!(n & 1073741824))
        return (
          (e = o !== null ? o.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          A(sn, Se),
          (Se |= e),
          null
        );
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = o !== null ? o.baseLanes : n),
        A(sn, Se),
        (Se |= r));
    }
  else
    (o !== null ? ((r = o.baseLanes | n), (t.memoizedState = null)) : (r = n),
      A(sn, Se),
      (Se |= r));
  return (ue(e, t, l, n), t.child);
}
function kc(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function Xo(e, t, n, r, l) {
  var o = ye(n) ? Ft : ie.current;
  return (
    (o = hn(t, o)),
    fn(t, l),
    (n = Bs(e, t, n, r, o, l)),
    (r = Ws()),
    e !== null && !he
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~l),
        nt(e, t, l))
      : (b && r && Ds(t), (t.flags |= 1), ue(e, t, n, l), t.child)
  );
}
function aa(e, t, n, r, l) {
  if (ye(n)) {
    var o = !0;
    ll(t);
  } else o = !1;
  if ((fn(t, l), t.stateNode === null))
    (Br(e, t), hc(t, n, r), Yo(t, n, r, l), (r = !0));
  else if (e === null) {
    var s = t.stateNode,
      i = t.memoizedProps;
    s.props = i;
    var a = s.context,
      c = n.contextType;
    typeof c == "object" && c !== null
      ? (c = Me(c))
      : ((c = ye(n) ? Ft : ie.current), (c = hn(t, c)));
    var m = n.getDerivedStateFromProps,
      g =
        typeof m == "function" ||
        typeof s.getSnapshotBeforeUpdate == "function";
    (g ||
      (typeof s.UNSAFE_componentWillReceiveProps != "function" &&
        typeof s.componentWillReceiveProps != "function") ||
      ((i !== r || a !== c) && na(t, s, r, c)),
      (at = !1));
    var h = t.memoizedState;
    ((s.state = h),
      ul(t, r, s, l),
      (a = t.memoizedState),
      i !== r || h !== a || ge.current || at
        ? (typeof m == "function" && (Ko(t, n, m, r), (a = t.memoizedState)),
          (i = at || ta(t, n, i, r, h, a, c))
            ? (g ||
                (typeof s.UNSAFE_componentWillMount != "function" &&
                  typeof s.componentWillMount != "function") ||
                (typeof s.componentWillMount == "function" &&
                  s.componentWillMount(),
                typeof s.UNSAFE_componentWillMount == "function" &&
                  s.UNSAFE_componentWillMount()),
              typeof s.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof s.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = a)),
          (s.props = r),
          (s.state = a),
          (s.context = c),
          (r = i))
        : (typeof s.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1)));
  } else {
    ((s = t.stateNode),
      Yu(e, t),
      (i = t.memoizedProps),
      (c = t.type === t.elementType ? i : $e(t.type, i)),
      (s.props = c),
      (g = t.pendingProps),
      (h = s.context),
      (a = n.contextType),
      typeof a == "object" && a !== null
        ? (a = Me(a))
        : ((a = ye(n) ? Ft : ie.current), (a = hn(t, a))));
    var w = n.getDerivedStateFromProps;
    ((m =
      typeof w == "function" ||
      typeof s.getSnapshotBeforeUpdate == "function") ||
      (typeof s.UNSAFE_componentWillReceiveProps != "function" &&
        typeof s.componentWillReceiveProps != "function") ||
      ((i !== g || h !== a) && na(t, s, r, a)),
      (at = !1),
      (h = t.memoizedState),
      (s.state = h),
      ul(t, r, s, l));
    var x = t.memoizedState;
    i !== g || h !== x || ge.current || at
      ? (typeof w == "function" && (Ko(t, n, w, r), (x = t.memoizedState)),
        (c = at || ta(t, n, c, r, h, x, a) || !1)
          ? (m ||
              (typeof s.UNSAFE_componentWillUpdate != "function" &&
                typeof s.componentWillUpdate != "function") ||
              (typeof s.componentWillUpdate == "function" &&
                s.componentWillUpdate(r, x, a),
              typeof s.UNSAFE_componentWillUpdate == "function" &&
                s.UNSAFE_componentWillUpdate(r, x, a)),
            typeof s.componentDidUpdate == "function" && (t.flags |= 4),
            typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof s.componentDidUpdate != "function" ||
              (i === e.memoizedProps && h === e.memoizedState) ||
              (t.flags |= 4),
            typeof s.getSnapshotBeforeUpdate != "function" ||
              (i === e.memoizedProps && h === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = x)),
        (s.props = r),
        (s.state = x),
        (s.context = a),
        (r = c))
      : (typeof s.componentDidUpdate != "function" ||
          (i === e.memoizedProps && h === e.memoizedState) ||
          (t.flags |= 4),
        typeof s.getSnapshotBeforeUpdate != "function" ||
          (i === e.memoizedProps && h === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return Zo(e, t, n, r, o, l);
}
function Zo(e, t, n, r, l, o) {
  kc(e, t);
  var s = (t.flags & 128) !== 0;
  if (!r && !s) return (l && Ki(t, n, !1), nt(e, t, o));
  ((r = t.stateNode), (mp.current = t));
  var i =
    s && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && s
      ? ((t.child = yn(t, e.child, null, o)), (t.child = yn(t, null, i, o)))
      : ue(e, t, i, o),
    (t.memoizedState = r.state),
    l && Ki(t, n, !0),
    t.child
  );
}
function wc(e) {
  var t = e.stateNode;
  (t.pendingContext
    ? Qi(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && Qi(e, t.context, !1),
    Us(e, t.containerInfo));
}
function ua(e, t, n, r, l) {
  return (gn(), Rs(l), (t.flags |= 256), ue(e, t, n, r), t.child);
}
var Jo = { dehydrated: null, treeContext: null, retryLane: 0 };
function qo(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function Sc(e, t, n) {
  var r = t.pendingProps,
    l = V.current,
    o = !1,
    s = (t.flags & 128) !== 0,
    i;
  if (
    ((i = s) ||
      (i = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0),
    i
      ? ((o = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (l |= 1),
    A(V, l & 1),
    e === null)
  )
    return (
      Wo(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1
            ? e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((s = r.children),
          (e = r.fallback),
          o
            ? ((r = t.mode),
              (o = t.child),
              (s = { mode: "hidden", children: s }),
              !(r & 1) && o !== null
                ? ((o.childLanes = 0), (o.pendingProps = s))
                : (o = Dl(s, r, 0, null)),
              (e = At(e, r, n, null)),
              (o.return = t),
              (e.return = t),
              (o.sibling = e),
              (t.child = o),
              (t.child.memoizedState = qo(n)),
              (t.memoizedState = Jo),
              e)
            : Ys(t, s))
    );
  if (((l = e.memoizedState), l !== null && ((i = l.dehydrated), i !== null)))
    return hp(e, t, s, r, i, l, n);
  if (o) {
    ((o = r.fallback), (s = t.mode), (l = e.child), (i = l.sibling));
    var a = { mode: "hidden", children: r.children };
    return (
      !(s & 1) && t.child !== l
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = a),
          (t.deletions = null))
        : ((r = kt(l, a)), (r.subtreeFlags = l.subtreeFlags & 14680064)),
      i !== null ? (o = kt(i, o)) : ((o = At(o, s, n, null)), (o.flags |= 2)),
      (o.return = t),
      (r.return = t),
      (r.sibling = o),
      (t.child = r),
      (r = o),
      (o = t.child),
      (s = e.child.memoizedState),
      (s =
        s === null
          ? qo(n)
          : {
              baseLanes: s.baseLanes | n,
              cachePool: null,
              transitions: s.transitions,
            }),
      (o.memoizedState = s),
      (o.childLanes = e.childLanes & ~n),
      (t.memoizedState = Jo),
      r
    );
  }
  return (
    (o = e.child),
    (e = o.sibling),
    (r = kt(o, { mode: "visible", children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function Ys(e, t) {
  return (
    (t = Dl({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function Lr(e, t, n, r) {
  return (
    r !== null && Rs(r),
    yn(t, e.child, null, n),
    (e = Ys(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function hp(e, t, n, r, l, o, s) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = uo(Error(v(422)))), Lr(e, t, s, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((o = r.fallback),
          (l = t.mode),
          (r = Dl({ mode: "visible", children: r.children }, l, 0, null)),
          (o = At(o, l, s, null)),
          (o.flags |= 2),
          (r.return = t),
          (o.return = t),
          (r.sibling = o),
          (t.child = r),
          t.mode & 1 && yn(t, e.child, null, s),
          (t.child.memoizedState = qo(s)),
          (t.memoizedState = Jo),
          o);
  if (!(t.mode & 1)) return Lr(e, t, s, null);
  if (l.data === "$!") {
    if (((r = l.nextSibling && l.nextSibling.dataset), r)) var i = r.dgst;
    return (
      (r = i),
      (o = Error(v(419))),
      (r = uo(o, r, void 0)),
      Lr(e, t, s, r)
    );
  }
  if (((i = (s & e.childLanes) !== 0), he || i)) {
    if (((r = q), r !== null)) {
      switch (s & -s) {
        case 4:
          l = 2;
          break;
        case 16:
          l = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          l = 32;
          break;
        case 536870912:
          l = 268435456;
          break;
        default:
          l = 0;
      }
      ((l = l & (r.suspendedLanes | s) ? 0 : l),
        l !== 0 &&
          l !== o.retryLane &&
          ((o.retryLane = l), tt(e, l), Ue(r, e, l, -1)));
    }
    return (ei(), (r = uo(Error(v(421)))), Lr(e, t, s, r));
  }
  return l.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = Pp.bind(null, e)),
      (l._reactRetry = t),
      null)
    : ((e = o.treeContext),
      (Ee = gt(l.nextSibling)),
      (Ce = t),
      (b = !0),
      (Ae = null),
      e !== null &&
        ((_e[Le++] = Xe),
        (_e[Le++] = Ze),
        (_e[Le++] = Ut),
        (Xe = e.id),
        (Ze = e.overflow),
        (Ut = t)),
      (t = Ys(t, r.children)),
      (t.flags |= 4096),
      t);
}
function ca(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  (r !== null && (r.lanes |= t), Qo(e.return, t, n));
}
function co(e, t, n, r, l) {
  var o = e.memoizedState;
  o === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: l,
      })
    : ((o.isBackwards = t),
      (o.rendering = null),
      (o.renderingStartTime = 0),
      (o.last = r),
      (o.tail = n),
      (o.tailMode = l));
}
function Ec(e, t, n) {
  var r = t.pendingProps,
    l = r.revealOrder,
    o = r.tail;
  if ((ue(e, t, r.children, n), (r = V.current), r & 2))
    ((r = (r & 1) | 2), (t.flags |= 128));
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && ca(e, n, t);
        else if (e.tag === 19) ca(e, n, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    r &= 1;
  }
  if ((A(V, r), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; )
          ((e = n.alternate),
            e !== null && cl(e) === null && (l = n),
            (n = n.sibling));
        ((n = l),
          n === null
            ? ((l = t.child), (t.child = null))
            : ((l = n.sibling), (n.sibling = null)),
          co(t, !1, l, n, o));
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (((e = l.alternate), e !== null && cl(e) === null)) {
            t.child = l;
            break;
          }
          ((e = l.sibling), (l.sibling = n), (n = l), (l = e));
        }
        co(t, !0, n, null, o);
        break;
      case "together":
        co(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function Br(e, t) {
  !(t.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function nt(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    (Vt |= t.lanes),
    !(n & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(v(153));
  if (t.child !== null) {
    for (
      e = t.child, n = kt(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;
    )
      ((e = e.sibling),
        (n = n.sibling = kt(e, e.pendingProps)),
        (n.return = t));
    n.sibling = null;
  }
  return t.child;
}
function gp(e, t, n) {
  switch (t.tag) {
    case 3:
      (wc(t), gn());
      break;
    case 5:
      Gu(t);
      break;
    case 1:
      ye(t.type) && ll(t);
      break;
    case 4:
      Us(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        l = t.memoizedProps.value;
      (A(il, r._currentValue), (r._currentValue = l));
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (A(V, V.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
            ? Sc(e, t, n)
            : (A(V, V.current & 1),
              (e = nt(e, t, n)),
              e !== null ? e.sibling : null);
      A(V, V.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return Ec(e, t, n);
        t.flags |= 128;
      }
      if (
        ((l = t.memoizedState),
        l !== null &&
          ((l.rendering = null), (l.tail = null), (l.lastEffect = null)),
        A(V, V.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return ((t.lanes = 0), xc(e, t, n));
  }
  return nt(e, t, n);
}
var Cc, es, Nc, jc;
Cc = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      ((n.child.return = n), (n = n.child));
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    ((n.sibling.return = n.return), (n = n.sibling));
  }
};
es = function () {};
Nc = function (e, t, n, r) {
  var l = e.memoizedProps;
  if (l !== r) {
    ((e = t.stateNode), $t(Ke.current));
    var o = null;
    switch (n) {
      case "input":
        ((l = So(e, l)), (r = So(e, r)), (o = []));
        break;
      case "select":
        ((l = B({}, l, { value: void 0 })),
          (r = B({}, r, { value: void 0 })),
          (o = []));
        break;
      case "textarea":
        ((l = No(e, l)), (r = No(e, r)), (o = []));
        break;
      default:
        typeof l.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = nl);
    }
    To(n, r);
    var s;
    n = null;
    for (c in l)
      if (!r.hasOwnProperty(c) && l.hasOwnProperty(c) && l[c] != null)
        if (c === "style") {
          var i = l[c];
          for (s in i) i.hasOwnProperty(s) && (n || (n = {}), (n[s] = ""));
        } else
          c !== "dangerouslySetInnerHTML" &&
            c !== "children" &&
            c !== "suppressContentEditableWarning" &&
            c !== "suppressHydrationWarning" &&
            c !== "autoFocus" &&
            (Wn.hasOwnProperty(c)
              ? o || (o = [])
              : (o = o || []).push(c, null));
    for (c in r) {
      var a = r[c];
      if (
        ((i = l != null ? l[c] : void 0),
        r.hasOwnProperty(c) && a !== i && (a != null || i != null))
      )
        if (c === "style")
          if (i) {
            for (s in i)
              !i.hasOwnProperty(s) ||
                (a && a.hasOwnProperty(s)) ||
                (n || (n = {}), (n[s] = ""));
            for (s in a)
              a.hasOwnProperty(s) &&
                i[s] !== a[s] &&
                (n || (n = {}), (n[s] = a[s]));
          } else (n || (o || (o = []), o.push(c, n)), (n = a));
        else
          c === "dangerouslySetInnerHTML"
            ? ((a = a ? a.__html : void 0),
              (i = i ? i.__html : void 0),
              a != null && i !== a && (o = o || []).push(c, a))
            : c === "children"
              ? (typeof a != "string" && typeof a != "number") ||
                (o = o || []).push(c, "" + a)
              : c !== "suppressContentEditableWarning" &&
                c !== "suppressHydrationWarning" &&
                (Wn.hasOwnProperty(c)
                  ? (a != null && c === "onScroll" && F("scroll", e),
                    o || i === a || (o = []))
                  : (o = o || []).push(c, a));
    }
    n && (o = o || []).push("style", n);
    var c = o;
    (t.updateQueue = c) && (t.flags |= 4);
  }
};
jc = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function Ln(e, t) {
  if (!b)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; )
          (t.alternate !== null && (n = t), (t = t.sibling));
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; )
          (n.alternate !== null && (r = n), (n = n.sibling));
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function oe(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var l = e.child; l !== null; )
      ((n |= l.lanes | l.childLanes),
        (r |= l.subtreeFlags & 14680064),
        (r |= l.flags & 14680064),
        (l.return = e),
        (l = l.sibling));
  else
    for (l = e.child; l !== null; )
      ((n |= l.lanes | l.childLanes),
        (r |= l.subtreeFlags),
        (r |= l.flags),
        (l.return = e),
        (l = l.sibling));
  return ((e.subtreeFlags |= r), (e.childLanes = n), t);
}
function yp(e, t, n) {
  var r = t.pendingProps;
  switch ((Ms(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return (oe(t), null);
    case 1:
      return (ye(t.type) && rl(), oe(t), null);
    case 3:
      return (
        (r = t.stateNode),
        vn(),
        U(ge),
        U(ie),
        Vs(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (Pr(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), Ae !== null && (as(Ae), (Ae = null)))),
        es(e, t),
        oe(t),
        null
      );
    case 5:
      bs(t);
      var l = $t(rr.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        (Nc(e, t, n, r, l),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(v(166));
          return (oe(t), null);
        }
        if (((e = $t(Ke.current)), Pr(t))) {
          ((r = t.stateNode), (n = t.type));
          var o = t.memoizedProps;
          switch (((r[We] = t), (r[tr] = o), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              (F("cancel", r), F("close", r));
              break;
            case "iframe":
            case "object":
            case "embed":
              F("load", r);
              break;
            case "video":
            case "audio":
              for (l = 0; l < In.length; l++) F(In[l], r);
              break;
            case "source":
              F("error", r);
              break;
            case "img":
            case "image":
            case "link":
              (F("error", r), F("load", r));
              break;
            case "details":
              F("toggle", r);
              break;
            case "input":
              (xi(r, o), F("invalid", r));
              break;
            case "select":
              ((r._wrapperState = { wasMultiple: !!o.multiple }),
                F("invalid", r));
              break;
            case "textarea":
              (wi(r, o), F("invalid", r));
          }
          (To(n, o), (l = null));
          for (var s in o)
            if (o.hasOwnProperty(s)) {
              var i = o[s];
              s === "children"
                ? typeof i == "string"
                  ? r.textContent !== i &&
                    (o.suppressHydrationWarning !== !0 &&
                      Tr(r.textContent, i, e),
                    (l = ["children", i]))
                  : typeof i == "number" &&
                    r.textContent !== "" + i &&
                    (o.suppressHydrationWarning !== !0 &&
                      Tr(r.textContent, i, e),
                    (l = ["children", "" + i]))
                : Wn.hasOwnProperty(s) &&
                  i != null &&
                  s === "onScroll" &&
                  F("scroll", r);
            }
          switch (n) {
            case "input":
              (xr(r), ki(r, o, !0));
              break;
            case "textarea":
              (xr(r), Si(r));
              break;
            case "select":
            case "option":
              break;
            default:
              typeof o.onClick == "function" && (r.onclick = nl);
          }
          ((r = l), (t.updateQueue = r), r !== null && (t.flags |= 4));
        } else {
          ((s = l.nodeType === 9 ? l : l.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = eu(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = s.createElement("div")),
                  (e.innerHTML = "<script><\/script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                  ? (e = s.createElement(n, { is: r.is }))
                  : ((e = s.createElement(n)),
                    n === "select" &&
                      ((s = e),
                      r.multiple
                        ? (s.multiple = !0)
                        : r.size && (s.size = r.size)))
              : (e = s.createElementNS(e, n)),
            (e[We] = t),
            (e[tr] = r),
            Cc(e, t, !1, !1),
            (t.stateNode = e));
          e: {
            switch (((s = Po(n, r)), n)) {
              case "dialog":
                (F("cancel", e), F("close", e), (l = r));
                break;
              case "iframe":
              case "object":
              case "embed":
                (F("load", e), (l = r));
                break;
              case "video":
              case "audio":
                for (l = 0; l < In.length; l++) F(In[l], e);
                l = r;
                break;
              case "source":
                (F("error", e), (l = r));
                break;
              case "img":
              case "image":
              case "link":
                (F("error", e), F("load", e), (l = r));
                break;
              case "details":
                (F("toggle", e), (l = r));
                break;
              case "input":
                (xi(e, r), (l = So(e, r)), F("invalid", e));
                break;
              case "option":
                l = r;
                break;
              case "select":
                ((e._wrapperState = { wasMultiple: !!r.multiple }),
                  (l = B({}, r, { value: void 0 })),
                  F("invalid", e));
                break;
              case "textarea":
                (wi(e, r), (l = No(e, r)), F("invalid", e));
                break;
              default:
                l = r;
            }
            (To(n, l), (i = l));
            for (o in i)
              if (i.hasOwnProperty(o)) {
                var a = i[o];
                o === "style"
                  ? ru(e, a)
                  : o === "dangerouslySetInnerHTML"
                    ? ((a = a ? a.__html : void 0), a != null && tu(e, a))
                    : o === "children"
                      ? typeof a == "string"
                        ? (n !== "textarea" || a !== "") && Qn(e, a)
                        : typeof a == "number" && Qn(e, "" + a)
                      : o !== "suppressContentEditableWarning" &&
                        o !== "suppressHydrationWarning" &&
                        o !== "autoFocus" &&
                        (Wn.hasOwnProperty(o)
                          ? a != null && o === "onScroll" && F("scroll", e)
                          : a != null && vs(e, o, a, s));
              }
            switch (n) {
              case "input":
                (xr(e), ki(e, r, !1));
                break;
              case "textarea":
                (xr(e), Si(e));
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + St(r.value));
                break;
              case "select":
                ((e.multiple = !!r.multiple),
                  (o = r.value),
                  o != null
                    ? an(e, !!r.multiple, o, !1)
                    : r.defaultValue != null &&
                      an(e, !!r.multiple, r.defaultValue, !0));
                break;
              default:
                typeof l.onClick == "function" && (e.onclick = nl);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return (oe(t), null);
    case 6:
      if (e && t.stateNode != null) jc(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(v(166));
        if (((n = $t(rr.current)), $t(Ke.current), Pr(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[We] = t),
            (o = r.nodeValue !== n) && ((e = Ce), e !== null))
          )
            switch (e.tag) {
              case 3:
                Tr(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Tr(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          o && (t.flags |= 4);
        } else
          ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[We] = t),
            (t.stateNode = r));
      }
      return (oe(t), null);
    case 13:
      if (
        (U(V),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (b && Ee !== null && t.mode & 1 && !(t.flags & 128))
          (Bu(), gn(), (t.flags |= 98560), (o = !1));
        else if (((o = Pr(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!o) throw Error(v(318));
            if (
              ((o = t.memoizedState),
              (o = o !== null ? o.dehydrated : null),
              !o)
            )
              throw Error(v(317));
            o[We] = t;
          } else
            (gn(),
              !(t.flags & 128) && (t.memoizedState = null),
              (t.flags |= 4));
          (oe(t), (o = !1));
        } else (Ae !== null && (as(Ae), (Ae = null)), (o = !0));
        if (!o) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 &&
              (e === null || V.current & 1 ? X === 0 && (X = 3) : ei())),
          t.updateQueue !== null && (t.flags |= 4),
          oe(t),
          null);
    case 4:
      return (
        vn(),
        es(e, t),
        e === null && qn(t.stateNode.containerInfo),
        oe(t),
        null
      );
    case 10:
      return (Os(t.type._context), oe(t), null);
    case 17:
      return (ye(t.type) && rl(), oe(t), null);
    case 19:
      if ((U(V), (o = t.memoizedState), o === null)) return (oe(t), null);
      if (((r = (t.flags & 128) !== 0), (s = o.rendering), s === null))
        if (r) Ln(o, !1);
        else {
          if (X !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((s = cl(e)), s !== null)) {
                for (
                  t.flags |= 128,
                    Ln(o, !1),
                    r = s.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;
                )
                  ((o = n),
                    (e = r),
                    (o.flags &= 14680066),
                    (s = o.alternate),
                    s === null
                      ? ((o.childLanes = 0),
                        (o.lanes = e),
                        (o.child = null),
                        (o.subtreeFlags = 0),
                        (o.memoizedProps = null),
                        (o.memoizedState = null),
                        (o.updateQueue = null),
                        (o.dependencies = null),
                        (o.stateNode = null))
                      : ((o.childLanes = s.childLanes),
                        (o.lanes = s.lanes),
                        (o.child = s.child),
                        (o.subtreeFlags = 0),
                        (o.deletions = null),
                        (o.memoizedProps = s.memoizedProps),
                        (o.memoizedState = s.memoizedState),
                        (o.updateQueue = s.updateQueue),
                        (o.type = s.type),
                        (e = s.dependencies),
                        (o.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling));
                return (A(V, (V.current & 1) | 2), t.child);
              }
              e = e.sibling;
            }
          o.tail !== null &&
            K() > kn &&
            ((t.flags |= 128), (r = !0), Ln(o, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = cl(s)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              Ln(o, !0),
              o.tail === null && o.tailMode === "hidden" && !s.alternate && !b)
            )
              return (oe(t), null);
          } else
            2 * K() - o.renderingStartTime > kn &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), Ln(o, !1), (t.lanes = 4194304));
        o.isBackwards
          ? ((s.sibling = t.child), (t.child = s))
          : ((n = o.last),
            n !== null ? (n.sibling = s) : (t.child = s),
            (o.last = s));
      }
      return o.tail !== null
        ? ((t = o.tail),
          (o.rendering = t),
          (o.tail = t.sibling),
          (o.renderingStartTime = K()),
          (t.sibling = null),
          (n = V.current),
          A(V, r ? (n & 1) | 2 : n & 1),
          t)
        : (oe(t), null);
    case 22:
    case 23:
      return (
        qs(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? Se & 1073741824 && (oe(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : oe(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(v(156, t.tag));
}
function vp(e, t) {
  switch ((Ms(t), t.tag)) {
    case 1:
      return (
        ye(t.type) && rl(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        vn(),
        U(ge),
        U(ie),
        Vs(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return (bs(t), null);
    case 13:
      if ((U(V), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
        if (t.alternate === null) throw Error(v(340));
        gn();
      }
      return (
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return (U(V), null);
    case 4:
      return (vn(), null);
    case 10:
      return (Os(t.type._context), null);
    case 22:
    case 23:
      return (qs(), null);
    case 24:
      return null;
    default:
      return null;
  }
}
var zr = !1,
  se = !1,
  xp = typeof WeakSet == "function" ? WeakSet : Set,
  j = null;
function on(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        W(e, t, r);
      }
    else n.current = null;
}
function ts(e, t, n) {
  try {
    n();
  } catch (r) {
    W(e, t, r);
  }
}
var da = !1;
function kp(e, t) {
  if (((Ao = qr), (e = zu()), zs(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var l = r.anchorOffset,
            o = r.focusNode;
          r = r.focusOffset;
          try {
            (n.nodeType, o.nodeType);
          } catch {
            n = null;
            break e;
          }
          var s = 0,
            i = -1,
            a = -1,
            c = 0,
            m = 0,
            g = e,
            h = null;
          t: for (;;) {
            for (
              var w;
              g !== n || (l !== 0 && g.nodeType !== 3) || (i = s + l),
                g !== o || (r !== 0 && g.nodeType !== 3) || (a = s + r),
                g.nodeType === 3 && (s += g.nodeValue.length),
                (w = g.firstChild) !== null;
            )
              ((h = g), (g = w));
            for (;;) {
              if (g === e) break t;
              if (
                (h === n && ++c === l && (i = s),
                h === o && ++m === r && (a = s),
                (w = g.nextSibling) !== null)
              )
                break;
              ((g = h), (h = g.parentNode));
            }
            g = w;
          }
          n = i === -1 || a === -1 ? null : { start: i, end: a };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (Fo = { focusedElem: e, selectionRange: n }, qr = !1, j = t; j !== null; )
    if (((t = j), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      ((e.return = t), (j = e));
    else
      for (; j !== null; ) {
        t = j;
        try {
          var x = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (x !== null) {
                  var S = x.memoizedProps,
                    R = x.memoizedState,
                    f = t.stateNode,
                    d = f.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? S : $e(t.type, S),
                      R,
                    );
                  f.__reactInternalSnapshotBeforeUpdate = d;
                }
                break;
              case 3:
                var p = t.stateNode.containerInfo;
                p.nodeType === 1
                  ? (p.textContent = "")
                  : p.nodeType === 9 &&
                    p.documentElement &&
                    p.removeChild(p.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(v(163));
            }
        } catch (y) {
          W(t, t.return, y);
        }
        if (((e = t.sibling), e !== null)) {
          ((e.return = t.return), (j = e));
          break;
        }
        j = t.return;
      }
  return ((x = da), (da = !1), x);
}
function Vn(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var l = (r = r.next);
    do {
      if ((l.tag & e) === e) {
        var o = l.destroy;
        ((l.destroy = void 0), o !== void 0 && ts(t, n, o));
      }
      l = l.next;
    } while (l !== r);
  }
}
function Ll(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function ns(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function Tc(e) {
  var t = e.alternate;
  (t !== null && ((e.alternate = null), Tc(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[We], delete t[tr], delete t[Vo], delete t[np], delete t[rp])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null));
}
function Pc(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function fa(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || Pc(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      ((e.child.return = e), (e = e.child));
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function rs(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = nl)));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (rs(e, t, n), e = e.sibling; e !== null; )
      (rs(e, t, n), (e = e.sibling));
}
function ls(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (ls(e, t, n), e = e.sibling; e !== null; )
      (ls(e, t, n), (e = e.sibling));
}
var ee = null,
  Oe = !1;
function st(e, t, n) {
  for (n = n.child; n !== null; ) (_c(e, t, n), (n = n.sibling));
}
function _c(e, t, n) {
  if (Qe && typeof Qe.onCommitFiberUnmount == "function")
    try {
      Qe.onCommitFiberUnmount(Sl, n);
    } catch {}
  switch (n.tag) {
    case 5:
      se || on(n, t);
    case 6:
      var r = ee,
        l = Oe;
      ((ee = null),
        st(e, t, n),
        (ee = r),
        (Oe = l),
        ee !== null &&
          (Oe
            ? ((e = ee),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : ee.removeChild(n.stateNode)));
      break;
    case 18:
      ee !== null &&
        (Oe
          ? ((e = ee),
            (n = n.stateNode),
            e.nodeType === 8
              ? ro(e.parentNode, n)
              : e.nodeType === 1 && ro(e, n),
            Xn(e))
          : ro(ee, n.stateNode));
      break;
    case 4:
      ((r = ee),
        (l = Oe),
        (ee = n.stateNode.containerInfo),
        (Oe = !0),
        st(e, t, n),
        (ee = r),
        (Oe = l));
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !se &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        l = r = r.next;
        do {
          var o = l,
            s = o.destroy;
          ((o = o.tag),
            s !== void 0 && (o & 2 || o & 4) && ts(n, t, s),
            (l = l.next));
        } while (l !== r);
      }
      st(e, t, n);
      break;
    case 1:
      if (
        !se &&
        (on(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          ((r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount());
        } catch (i) {
          W(n, t, i);
        }
      st(e, t, n);
      break;
    case 21:
      st(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((se = (r = se) || n.memoizedState !== null), st(e, t, n), (se = r))
        : st(e, t, n);
      break;
    default:
      st(e, t, n);
  }
}
function pa(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    (n === null && (n = e.stateNode = new xp()),
      t.forEach(function (r) {
        var l = _p.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      }));
  }
}
function Ie(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var o = e,
          s = t,
          i = s;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case 5:
              ((ee = i.stateNode), (Oe = !1));
              break e;
            case 3:
              ((ee = i.stateNode.containerInfo), (Oe = !0));
              break e;
            case 4:
              ((ee = i.stateNode.containerInfo), (Oe = !0));
              break e;
          }
          i = i.return;
        }
        if (ee === null) throw Error(v(160));
        (_c(o, s, l), (ee = null), (Oe = !1));
        var a = l.alternate;
        (a !== null && (a.return = null), (l.return = null));
      } catch (c) {
        W(l, t, c);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null; ) (Lc(t, e), (t = t.sibling));
}
function Lc(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((Ie(t, e), He(e), r & 4)) {
        try {
          (Vn(3, e, e.return), Ll(3, e));
        } catch (S) {
          W(e, e.return, S);
        }
        try {
          Vn(5, e, e.return);
        } catch (S) {
          W(e, e.return, S);
        }
      }
      break;
    case 1:
      (Ie(t, e), He(e), r & 512 && n !== null && on(n, n.return));
      break;
    case 5:
      if (
        (Ie(t, e),
        He(e),
        r & 512 && n !== null && on(n, n.return),
        e.flags & 32)
      ) {
        var l = e.stateNode;
        try {
          Qn(l, "");
        } catch (S) {
          W(e, e.return, S);
        }
      }
      if (r & 4 && ((l = e.stateNode), l != null)) {
        var o = e.memoizedProps,
          s = n !== null ? n.memoizedProps : o,
          i = e.type,
          a = e.updateQueue;
        if (((e.updateQueue = null), a !== null))
          try {
            (i === "input" && o.type === "radio" && o.name != null && Ja(l, o),
              Po(i, s));
            var c = Po(i, o);
            for (s = 0; s < a.length; s += 2) {
              var m = a[s],
                g = a[s + 1];
              m === "style"
                ? ru(l, g)
                : m === "dangerouslySetInnerHTML"
                  ? tu(l, g)
                  : m === "children"
                    ? Qn(l, g)
                    : vs(l, m, g, c);
            }
            switch (i) {
              case "input":
                Eo(l, o);
                break;
              case "textarea":
                qa(l, o);
                break;
              case "select":
                var h = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var w = o.value;
                w != null
                  ? an(l, !!o.multiple, w, !1)
                  : h !== !!o.multiple &&
                    (o.defaultValue != null
                      ? an(l, !!o.multiple, o.defaultValue, !0)
                      : an(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[tr] = o;
          } catch (S) {
            W(e, e.return, S);
          }
      }
      break;
    case 6:
      if ((Ie(t, e), He(e), r & 4)) {
        if (e.stateNode === null) throw Error(v(162));
        ((l = e.stateNode), (o = e.memoizedProps));
        try {
          l.nodeValue = o;
        } catch (S) {
          W(e, e.return, S);
        }
      }
      break;
    case 3:
      if (
        (Ie(t, e), He(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          Xn(t.containerInfo);
        } catch (S) {
          W(e, e.return, S);
        }
      break;
    case 4:
      (Ie(t, e), He(e));
      break;
    case 13:
      (Ie(t, e),
        He(e),
        (l = e.child),
        l.flags & 8192 &&
          ((o = l.memoizedState !== null),
          (l.stateNode.isHidden = o),
          !o ||
            (l.alternate !== null && l.alternate.memoizedState !== null) ||
            (Zs = K())),
        r & 4 && pa(e));
      break;
    case 22:
      if (
        ((m = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((se = (c = se) || m), Ie(t, e), (se = c)) : Ie(t, e),
        He(e),
        r & 8192)
      ) {
        if (
          ((c = e.memoizedState !== null),
          (e.stateNode.isHidden = c) && !m && e.mode & 1)
        )
          for (j = e, m = e.child; m !== null; ) {
            for (g = j = m; j !== null; ) {
              switch (((h = j), (w = h.child), h.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Vn(4, h, h.return);
                  break;
                case 1:
                  on(h, h.return);
                  var x = h.stateNode;
                  if (typeof x.componentWillUnmount == "function") {
                    ((r = h), (n = h.return));
                    try {
                      ((t = r),
                        (x.props = t.memoizedProps),
                        (x.state = t.memoizedState),
                        x.componentWillUnmount());
                    } catch (S) {
                      W(r, n, S);
                    }
                  }
                  break;
                case 5:
                  on(h, h.return);
                  break;
                case 22:
                  if (h.memoizedState !== null) {
                    ha(g);
                    continue;
                  }
              }
              w !== null ? ((w.return = h), (j = w)) : ha(g);
            }
            m = m.sibling;
          }
        e: for (m = null, g = e; ; ) {
          if (g.tag === 5) {
            if (m === null) {
              m = g;
              try {
                ((l = g.stateNode),
                  c
                    ? ((o = l.style),
                      typeof o.setProperty == "function"
                        ? o.setProperty("display", "none", "important")
                        : (o.display = "none"))
                    : ((i = g.stateNode),
                      (a = g.memoizedProps.style),
                      (s =
                        a != null && a.hasOwnProperty("display")
                          ? a.display
                          : null),
                      (i.style.display = nu("display", s))));
              } catch (S) {
                W(e, e.return, S);
              }
            }
          } else if (g.tag === 6) {
            if (m === null)
              try {
                g.stateNode.nodeValue = c ? "" : g.memoizedProps;
              } catch (S) {
                W(e, e.return, S);
              }
          } else if (
            ((g.tag !== 22 && g.tag !== 23) ||
              g.memoizedState === null ||
              g === e) &&
            g.child !== null
          ) {
            ((g.child.return = g), (g = g.child));
            continue;
          }
          if (g === e) break e;
          for (; g.sibling === null; ) {
            if (g.return === null || g.return === e) break e;
            (m === g && (m = null), (g = g.return));
          }
          (m === g && (m = null),
            (g.sibling.return = g.return),
            (g = g.sibling));
        }
      }
      break;
    case 19:
      (Ie(t, e), He(e), r & 4 && pa(e));
      break;
    case 21:
      break;
    default:
      (Ie(t, e), He(e));
  }
}
function He(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (Pc(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(v(160));
      }
      switch (r.tag) {
        case 5:
          var l = r.stateNode;
          r.flags & 32 && (Qn(l, ""), (r.flags &= -33));
          var o = fa(e);
          ls(e, o, l);
          break;
        case 3:
        case 4:
          var s = r.stateNode.containerInfo,
            i = fa(e);
          rs(e, i, s);
          break;
        default:
          throw Error(v(161));
      }
    } catch (a) {
      W(e, e.return, a);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function wp(e, t, n) {
  ((j = e), zc(e));
}
function zc(e, t, n) {
  for (var r = (e.mode & 1) !== 0; j !== null; ) {
    var l = j,
      o = l.child;
    if (l.tag === 22 && r) {
      var s = l.memoizedState !== null || zr;
      if (!s) {
        var i = l.alternate,
          a = (i !== null && i.memoizedState !== null) || se;
        i = zr;
        var c = se;
        if (((zr = s), (se = a) && !c))
          for (j = l; j !== null; )
            ((s = j),
              (a = s.child),
              s.tag === 22 && s.memoizedState !== null
                ? ga(l)
                : a !== null
                  ? ((a.return = s), (j = a))
                  : ga(l));
        for (; o !== null; ) ((j = o), zc(o), (o = o.sibling));
        ((j = l), (zr = i), (se = c));
      }
      ma(e);
    } else
      l.subtreeFlags & 8772 && o !== null ? ((o.return = l), (j = o)) : ma(e);
  }
}
function ma(e) {
  for (; j !== null; ) {
    var t = j;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              se || Ll(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !se)
                if (n === null) r.componentDidMount();
                else {
                  var l =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : $e(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    l,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var o = t.updateQueue;
              o !== null && Ji(t, o, r);
              break;
            case 3:
              var s = t.updateQueue;
              if (s !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                Ji(t, s, n);
              }
              break;
            case 5:
              var i = t.stateNode;
              if (n === null && t.flags & 4) {
                n = i;
                var a = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    a.autoFocus && n.focus();
                    break;
                  case "img":
                    a.src && (n.src = a.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var c = t.alternate;
                if (c !== null) {
                  var m = c.memoizedState;
                  if (m !== null) {
                    var g = m.dehydrated;
                    g !== null && Xn(g);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(v(163));
          }
        se || (t.flags & 512 && ns(t));
      } catch (h) {
        W(t, t.return, h);
      }
    }
    if (t === e) {
      j = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      ((n.return = t.return), (j = n));
      break;
    }
    j = t.return;
  }
}
function ha(e) {
  for (; j !== null; ) {
    var t = j;
    if (t === e) {
      j = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      ((n.return = t.return), (j = n));
      break;
    }
    j = t.return;
  }
}
function ga(e) {
  for (; j !== null; ) {
    var t = j;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Ll(4, t);
          } catch (a) {
            W(t, n, a);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var l = t.return;
            try {
              r.componentDidMount();
            } catch (a) {
              W(t, l, a);
            }
          }
          var o = t.return;
          try {
            ns(t);
          } catch (a) {
            W(t, o, a);
          }
          break;
        case 5:
          var s = t.return;
          try {
            ns(t);
          } catch (a) {
            W(t, s, a);
          }
      }
    } catch (a) {
      W(t, t.return, a);
    }
    if (t === e) {
      j = null;
      break;
    }
    var i = t.sibling;
    if (i !== null) {
      ((i.return = t.return), (j = i));
      break;
    }
    j = t.return;
  }
}
var Sp = Math.ceil,
  pl = lt.ReactCurrentDispatcher,
  Gs = lt.ReactCurrentOwner,
  De = lt.ReactCurrentBatchConfig,
  I = 0,
  q = null,
  Y = null,
  te = 0,
  Se = 0,
  sn = Nt(0),
  X = 0,
  ir = null,
  Vt = 0,
  zl = 0,
  Xs = 0,
  Hn = null,
  me = null,
  Zs = 0,
  kn = 1 / 0,
  Ye = null,
  ml = !1,
  os = null,
  vt = null,
  Dr = !1,
  ft = null,
  hl = 0,
  Bn = 0,
  ss = null,
  Wr = -1,
  Qr = 0;
function ce() {
  return I & 6 ? K() : Wr !== -1 ? Wr : (Wr = K());
}
function xt(e) {
  return e.mode & 1
    ? I & 2 && te !== 0
      ? te & -te
      : op.transition !== null
        ? (Qr === 0 && (Qr = hu()), Qr)
        : ((e = $),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : Su(e.type))),
          e)
    : 1;
}
function Ue(e, t, n, r) {
  if (50 < Bn) throw ((Bn = 0), (ss = null), Error(v(185)));
  (ur(e, n, r),
    (!(I & 2) || e !== q) &&
      (e === q && (!(I & 2) && (zl |= n), X === 4 && ct(e, te)),
      ve(e, r),
      n === 1 && I === 0 && !(t.mode & 1) && ((kn = K() + 500), Tl && jt())));
}
function ve(e, t) {
  var n = e.callbackNode;
  lf(e, t);
  var r = Jr(e, e === q ? te : 0);
  if (r === 0)
    (n !== null && Ni(n), (e.callbackNode = null), (e.callbackPriority = 0));
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && Ni(n), t === 1))
      (e.tag === 0 ? lp(ya.bind(null, e)) : bu(ya.bind(null, e)),
        ep(function () {
          !(I & 6) && jt();
        }),
        (n = null));
    else {
      switch (gu(r)) {
        case 1:
          n = Es;
          break;
        case 4:
          n = pu;
          break;
        case 16:
          n = Zr;
          break;
        case 536870912:
          n = mu;
          break;
        default:
          n = Zr;
      }
      n = Fc(n, Dc.bind(null, e));
    }
    ((e.callbackPriority = t), (e.callbackNode = n));
  }
}
function Dc(e, t) {
  if (((Wr = -1), (Qr = 0), I & 6)) throw Error(v(327));
  var n = e.callbackNode;
  if (pn() && e.callbackNode !== n) return null;
  var r = Jr(e, e === q ? te : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = gl(e, r);
  else {
    t = r;
    var l = I;
    I |= 2;
    var o = Rc();
    (q !== e || te !== t) && ((Ye = null), (kn = K() + 500), Ot(e, t));
    do
      try {
        Np();
        break;
      } catch (i) {
        Mc(e, i);
      }
    while (!0);
    ($s(),
      (pl.current = o),
      (I = l),
      Y !== null ? (t = 0) : ((q = null), (te = 0), (t = X)));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((l = Mo(e)), l !== 0 && ((r = l), (t = is(e, l)))), t === 1)
    )
      throw ((n = ir), Ot(e, 0), ct(e, r), ve(e, K()), n);
    if (t === 6) ct(e, r);
    else {
      if (
        ((l = e.current.alternate),
        !(r & 30) &&
          !Ep(l) &&
          ((t = gl(e, r)),
          t === 2 && ((o = Mo(e)), o !== 0 && ((r = o), (t = is(e, o)))),
          t === 1))
      )
        throw ((n = ir), Ot(e, 0), ct(e, r), ve(e, K()), n);
      switch (((e.finishedWork = l), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(v(345));
        case 2:
          Mt(e, me, Ye);
          break;
        case 3:
          if (
            (ct(e, r), (r & 130023424) === r && ((t = Zs + 500 - K()), 10 < t))
          ) {
            if (Jr(e, 0) !== 0) break;
            if (((l = e.suspendedLanes), (l & r) !== r)) {
              (ce(), (e.pingedLanes |= e.suspendedLanes & l));
              break;
            }
            e.timeoutHandle = bo(Mt.bind(null, e, me, Ye), t);
            break;
          }
          Mt(e, me, Ye);
          break;
        case 4:
          if ((ct(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, l = -1; 0 < r; ) {
            var s = 31 - Fe(r);
            ((o = 1 << s), (s = t[s]), s > l && (l = s), (r &= ~o));
          }
          if (
            ((r = l),
            (r = K() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                  ? 480
                  : 1080 > r
                    ? 1080
                    : 1920 > r
                      ? 1920
                      : 3e3 > r
                        ? 3e3
                        : 4320 > r
                          ? 4320
                          : 1960 * Sp(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = bo(Mt.bind(null, e, me, Ye), r);
            break;
          }
          Mt(e, me, Ye);
          break;
        case 5:
          Mt(e, me, Ye);
          break;
        default:
          throw Error(v(329));
      }
    }
  }
  return (ve(e, K()), e.callbackNode === n ? Dc.bind(null, e) : null);
}
function is(e, t) {
  var n = Hn;
  return (
    e.current.memoizedState.isDehydrated && (Ot(e, t).flags |= 256),
    (e = gl(e, t)),
    e !== 2 && ((t = me), (me = n), t !== null && as(t)),
    e
  );
}
function as(e) {
  me === null ? (me = e) : me.push.apply(me, e);
}
function Ep(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var l = n[r],
            o = l.getSnapshot;
          l = l.value;
          try {
            if (!be(o(), l)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
      ((n.return = t), (t = n));
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
  }
  return !0;
}
function ct(e, t) {
  for (
    t &= ~Xs,
      t &= ~zl,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;
  ) {
    var n = 31 - Fe(t),
      r = 1 << n;
    ((e[n] = -1), (t &= ~r));
  }
}
function ya(e) {
  if (I & 6) throw Error(v(327));
  pn();
  var t = Jr(e, 0);
  if (!(t & 1)) return (ve(e, K()), null);
  var n = gl(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Mo(e);
    r !== 0 && ((t = r), (n = is(e, r)));
  }
  if (n === 1) throw ((n = ir), Ot(e, 0), ct(e, t), ve(e, K()), n);
  if (n === 6) throw Error(v(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    Mt(e, me, Ye),
    ve(e, K()),
    null
  );
}
function Js(e, t) {
  var n = I;
  I |= 1;
  try {
    return e(t);
  } finally {
    ((I = n), I === 0 && ((kn = K() + 500), Tl && jt()));
  }
}
function Ht(e) {
  ft !== null && ft.tag === 0 && !(I & 6) && pn();
  var t = I;
  I |= 1;
  var n = De.transition,
    r = $;
  try {
    if (((De.transition = null), ($ = 1), e)) return e();
  } finally {
    (($ = r), (De.transition = n), (I = t), !(I & 6) && jt());
  }
}
function qs() {
  ((Se = sn.current), U(sn));
}
function Ot(e, t) {
  ((e.finishedWork = null), (e.finishedLanes = 0));
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), qf(n)), Y !== null))
    for (n = Y.return; n !== null; ) {
      var r = n;
      switch ((Ms(r), r.tag)) {
        case 1:
          ((r = r.type.childContextTypes), r != null && rl());
          break;
        case 3:
          (vn(), U(ge), U(ie), Vs());
          break;
        case 5:
          bs(r);
          break;
        case 4:
          vn();
          break;
        case 13:
          U(V);
          break;
        case 19:
          U(V);
          break;
        case 10:
          Os(r.type._context);
          break;
        case 22:
        case 23:
          qs();
      }
      n = n.return;
    }
  if (
    ((q = e),
    (Y = e = kt(e.current, null)),
    (te = Se = t),
    (X = 0),
    (ir = null),
    (Xs = zl = Vt = 0),
    (me = Hn = null),
    It !== null)
  ) {
    for (t = 0; t < It.length; t++)
      if (((n = It[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var l = r.next,
          o = n.pending;
        if (o !== null) {
          var s = o.next;
          ((o.next = l), (r.next = s));
        }
        n.pending = r;
      }
    It = null;
  }
  return e;
}
function Mc(e, t) {
  do {
    var n = Y;
    try {
      if (($s(), (Vr.current = fl), dl)) {
        for (var r = H.memoizedState; r !== null; ) {
          var l = r.queue;
          (l !== null && (l.pending = null), (r = r.next));
        }
        dl = !1;
      }
      if (
        ((bt = 0),
        (J = G = H = null),
        (bn = !1),
        (lr = 0),
        (Gs.current = null),
        n === null || n.return === null)
      ) {
        ((X = 1), (ir = t), (Y = null));
        break;
      }
      e: {
        var o = e,
          s = n.return,
          i = n,
          a = t;
        if (
          ((t = te),
          (i.flags |= 32768),
          a !== null && typeof a == "object" && typeof a.then == "function")
        ) {
          var c = a,
            m = i,
            g = m.tag;
          if (!(m.mode & 1) && (g === 0 || g === 11 || g === 15)) {
            var h = m.alternate;
            h
              ? ((m.updateQueue = h.updateQueue),
                (m.memoizedState = h.memoizedState),
                (m.lanes = h.lanes))
              : ((m.updateQueue = null), (m.memoizedState = null));
          }
          var w = la(s);
          if (w !== null) {
            ((w.flags &= -257),
              oa(w, s, i, o, t),
              w.mode & 1 && ra(o, c, t),
              (t = w),
              (a = c));
            var x = t.updateQueue;
            if (x === null) {
              var S = new Set();
              (S.add(a), (t.updateQueue = S));
            } else x.add(a);
            break e;
          } else {
            if (!(t & 1)) {
              (ra(o, c, t), ei());
              break e;
            }
            a = Error(v(426));
          }
        } else if (b && i.mode & 1) {
          var R = la(s);
          if (R !== null) {
            (!(R.flags & 65536) && (R.flags |= 256),
              oa(R, s, i, o, t),
              Rs(xn(a, i)));
            break e;
          }
        }
        ((o = a = xn(a, i)),
          X !== 4 && (X = 2),
          Hn === null ? (Hn = [o]) : Hn.push(o),
          (o = s));
        do {
          switch (o.tag) {
            case 3:
              ((o.flags |= 65536), (t &= -t), (o.lanes |= t));
              var f = gc(o, a, t);
              Zi(o, f);
              break e;
            case 1:
              i = a;
              var d = o.type,
                p = o.stateNode;
              if (
                !(o.flags & 128) &&
                (typeof d.getDerivedStateFromError == "function" ||
                  (p !== null &&
                    typeof p.componentDidCatch == "function" &&
                    (vt === null || !vt.has(p))))
              ) {
                ((o.flags |= 65536), (t &= -t), (o.lanes |= t));
                var y = yc(o, i, t);
                Zi(o, y);
                break e;
              }
          }
          o = o.return;
        } while (o !== null);
      }
      $c(n);
    } catch (k) {
      ((t = k), Y === n && n !== null && (Y = n = n.return));
      continue;
    }
    break;
  } while (!0);
}
function Rc() {
  var e = pl.current;
  return ((pl.current = fl), e === null ? fl : e);
}
function ei() {
  ((X === 0 || X === 3 || X === 2) && (X = 4),
    q === null || (!(Vt & 268435455) && !(zl & 268435455)) || ct(q, te));
}
function gl(e, t) {
  var n = I;
  I |= 2;
  var r = Rc();
  (q !== e || te !== t) && ((Ye = null), Ot(e, t));
  do
    try {
      Cp();
      break;
    } catch (l) {
      Mc(e, l);
    }
  while (!0);
  if (($s(), (I = n), (pl.current = r), Y !== null)) throw Error(v(261));
  return ((q = null), (te = 0), X);
}
function Cp() {
  for (; Y !== null; ) Ic(Y);
}
function Np() {
  for (; Y !== null && !Gd(); ) Ic(Y);
}
function Ic(e) {
  var t = Ac(e.alternate, e, Se);
  ((e.memoizedProps = e.pendingProps),
    t === null ? $c(e) : (Y = t),
    (Gs.current = null));
}
function $c(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = vp(n, t)), n !== null)) {
        ((n.flags &= 32767), (Y = n));
        return;
      }
      if (e !== null)
        ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
      else {
        ((X = 6), (Y = null));
        return;
      }
    } else if (((n = yp(n, t, Se)), n !== null)) {
      Y = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      Y = t;
      return;
    }
    Y = t = e;
  } while (t !== null);
  X === 0 && (X = 5);
}
function Mt(e, t, n) {
  var r = $,
    l = De.transition;
  try {
    ((De.transition = null), ($ = 1), jp(e, t, n, r));
  } finally {
    ((De.transition = l), ($ = r));
  }
  return null;
}
function jp(e, t, n, r) {
  do pn();
  while (ft !== null);
  if (I & 6) throw Error(v(327));
  n = e.finishedWork;
  var l = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(v(177));
  ((e.callbackNode = null), (e.callbackPriority = 0));
  var o = n.lanes | n.childLanes;
  if (
    (of(e, o),
    e === q && ((Y = q = null), (te = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      Dr ||
      ((Dr = !0),
      Fc(Zr, function () {
        return (pn(), null);
      })),
    (o = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || o)
  ) {
    ((o = De.transition), (De.transition = null));
    var s = $;
    $ = 1;
    var i = I;
    ((I |= 4),
      (Gs.current = null),
      kp(e, n),
      Lc(n, e),
      Qf(Fo),
      (qr = !!Ao),
      (Fo = Ao = null),
      (e.current = n),
      wp(n),
      Xd(),
      (I = i),
      ($ = s),
      (De.transition = o));
  } else e.current = n;
  if (
    (Dr && ((Dr = !1), (ft = e), (hl = l)),
    (o = e.pendingLanes),
    o === 0 && (vt = null),
    qd(n.stateNode),
    ve(e, K()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      ((l = t[n]), r(l.value, { componentStack: l.stack, digest: l.digest }));
  if (ml) throw ((ml = !1), (e = os), (os = null), e);
  return (
    hl & 1 && e.tag !== 0 && pn(),
    (o = e.pendingLanes),
    o & 1 ? (e === ss ? Bn++ : ((Bn = 0), (ss = e))) : (Bn = 0),
    jt(),
    null
  );
}
function pn() {
  if (ft !== null) {
    var e = gu(hl),
      t = De.transition,
      n = $;
    try {
      if (((De.transition = null), ($ = 16 > e ? 16 : e), ft === null))
        var r = !1;
      else {
        if (((e = ft), (ft = null), (hl = 0), I & 6)) throw Error(v(331));
        var l = I;
        for (I |= 4, j = e.current; j !== null; ) {
          var o = j,
            s = o.child;
          if (j.flags & 16) {
            var i = o.deletions;
            if (i !== null) {
              for (var a = 0; a < i.length; a++) {
                var c = i[a];
                for (j = c; j !== null; ) {
                  var m = j;
                  switch (m.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Vn(8, m, o);
                  }
                  var g = m.child;
                  if (g !== null) ((g.return = m), (j = g));
                  else
                    for (; j !== null; ) {
                      m = j;
                      var h = m.sibling,
                        w = m.return;
                      if ((Tc(m), m === c)) {
                        j = null;
                        break;
                      }
                      if (h !== null) {
                        ((h.return = w), (j = h));
                        break;
                      }
                      j = w;
                    }
                }
              }
              var x = o.alternate;
              if (x !== null) {
                var S = x.child;
                if (S !== null) {
                  x.child = null;
                  do {
                    var R = S.sibling;
                    ((S.sibling = null), (S = R));
                  } while (S !== null);
                }
              }
              j = o;
            }
          }
          if (o.subtreeFlags & 2064 && s !== null) ((s.return = o), (j = s));
          else
            e: for (; j !== null; ) {
              if (((o = j), o.flags & 2048))
                switch (o.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Vn(9, o, o.return);
                }
              var f = o.sibling;
              if (f !== null) {
                ((f.return = o.return), (j = f));
                break e;
              }
              j = o.return;
            }
        }
        var d = e.current;
        for (j = d; j !== null; ) {
          s = j;
          var p = s.child;
          if (s.subtreeFlags & 2064 && p !== null) ((p.return = s), (j = p));
          else
            e: for (s = d; j !== null; ) {
              if (((i = j), i.flags & 2048))
                try {
                  switch (i.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Ll(9, i);
                  }
                } catch (k) {
                  W(i, i.return, k);
                }
              if (i === s) {
                j = null;
                break e;
              }
              var y = i.sibling;
              if (y !== null) {
                ((y.return = i.return), (j = y));
                break e;
              }
              j = i.return;
            }
        }
        if (
          ((I = l), jt(), Qe && typeof Qe.onPostCommitFiberRoot == "function")
        )
          try {
            Qe.onPostCommitFiberRoot(Sl, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      (($ = n), (De.transition = t));
    }
  }
  return !1;
}
function va(e, t, n) {
  ((t = xn(n, t)),
    (t = gc(e, t, 1)),
    (e = yt(e, t, 1)),
    (t = ce()),
    e !== null && (ur(e, 1, t), ve(e, t)));
}
function W(e, t, n) {
  if (e.tag === 3) va(e, e, n);
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        va(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (vt === null || !vt.has(r)))
        ) {
          ((e = xn(n, e)),
            (e = yc(t, e, 1)),
            (t = yt(t, e, 1)),
            (e = ce()),
            t !== null && (ur(t, 1, e), ve(t, e)));
          break;
        }
      }
      t = t.return;
    }
}
function Tp(e, t, n) {
  var r = e.pingCache;
  (r !== null && r.delete(t),
    (t = ce()),
    (e.pingedLanes |= e.suspendedLanes & n),
    q === e &&
      (te & n) === n &&
      (X === 4 || (X === 3 && (te & 130023424) === te && 500 > K() - Zs)
        ? Ot(e, 0)
        : (Xs |= n)),
    ve(e, t));
}
function Oc(e, t) {
  t === 0 &&
    (e.mode & 1
      ? ((t = Sr), (Sr <<= 1), !(Sr & 130023424) && (Sr = 4194304))
      : (t = 1));
  var n = ce();
  ((e = tt(e, t)), e !== null && (ur(e, t, n), ve(e, n)));
}
function Pp(e) {
  var t = e.memoizedState,
    n = 0;
  (t !== null && (n = t.retryLane), Oc(e, n));
}
function _p(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        l = e.memoizedState;
      l !== null && (n = l.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(v(314));
  }
  (r !== null && r.delete(t), Oc(e, n));
}
var Ac;
Ac = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || ge.current) he = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return ((he = !1), gp(e, t, n));
      he = !!(e.flags & 131072);
    }
  else ((he = !1), b && t.flags & 1048576 && Vu(t, sl, t.index));
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      (Br(e, t), (e = t.pendingProps));
      var l = hn(t, ie.current);
      (fn(t, n), (l = Bs(null, t, r, e, l, n)));
      var o = Ws();
      return (
        (t.flags |= 1),
        typeof l == "object" &&
        l !== null &&
        typeof l.render == "function" &&
        l.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            ye(r) ? ((o = !0), ll(t)) : (o = !1),
            (t.memoizedState =
              l.state !== null && l.state !== void 0 ? l.state : null),
            Fs(t),
            (l.updater = _l),
            (t.stateNode = l),
            (l._reactInternals = t),
            Yo(t, r, e, n),
            (t = Zo(null, t, r, !0, o, n)))
          : ((t.tag = 0), b && o && Ds(t), ue(null, t, l, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (Br(e, t),
          (e = t.pendingProps),
          (l = r._init),
          (r = l(r._payload)),
          (t.type = r),
          (l = t.tag = zp(r)),
          (e = $e(r, e)),
          l)
        ) {
          case 0:
            t = Xo(null, t, r, e, n);
            break e;
          case 1:
            t = aa(null, t, r, e, n);
            break e;
          case 11:
            t = sa(null, t, r, e, n);
            break e;
          case 14:
            t = ia(null, t, r, $e(r.type, e), n);
            break e;
        }
        throw Error(v(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : $e(r, l)),
        Xo(e, t, r, l, n)
      );
    case 1:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : $e(r, l)),
        aa(e, t, r, l, n)
      );
    case 3:
      e: {
        if ((wc(t), e === null)) throw Error(v(387));
        ((r = t.pendingProps),
          (o = t.memoizedState),
          (l = o.element),
          Yu(e, t),
          ul(t, r, null, n));
        var s = t.memoizedState;
        if (((r = s.element), o.isDehydrated))
          if (
            ((o = {
              element: r,
              isDehydrated: !1,
              cache: s.cache,
              pendingSuspenseBoundaries: s.pendingSuspenseBoundaries,
              transitions: s.transitions,
            }),
            (t.updateQueue.baseState = o),
            (t.memoizedState = o),
            t.flags & 256)
          ) {
            ((l = xn(Error(v(423)), t)), (t = ua(e, t, r, n, l)));
            break e;
          } else if (r !== l) {
            ((l = xn(Error(v(424)), t)), (t = ua(e, t, r, n, l)));
            break e;
          } else
            for (
              Ee = gt(t.stateNode.containerInfo.firstChild),
                Ce = t,
                b = !0,
                Ae = null,
                n = Qu(t, null, r, n),
                t.child = n;
              n;
            )
              ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
        else {
          if ((gn(), r === l)) {
            t = nt(e, t, n);
            break e;
          }
          ue(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        Gu(t),
        e === null && Wo(t),
        (r = t.type),
        (l = t.pendingProps),
        (o = e !== null ? e.memoizedProps : null),
        (s = l.children),
        Uo(r, l) ? (s = null) : o !== null && Uo(r, o) && (t.flags |= 32),
        kc(e, t),
        ue(e, t, s, n),
        t.child
      );
    case 6:
      return (e === null && Wo(t), null);
    case 13:
      return Sc(e, t, n);
    case 4:
      return (
        Us(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = yn(t, null, r, n)) : ue(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : $e(r, l)),
        sa(e, t, r, l, n)
      );
    case 7:
      return (ue(e, t, t.pendingProps, n), t.child);
    case 8:
      return (ue(e, t, t.pendingProps.children, n), t.child);
    case 12:
      return (ue(e, t, t.pendingProps.children, n), t.child);
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (l = t.pendingProps),
          (o = t.memoizedProps),
          (s = l.value),
          A(il, r._currentValue),
          (r._currentValue = s),
          o !== null)
        )
          if (be(o.value, s)) {
            if (o.children === l.children && !ge.current) {
              t = nt(e, t, n);
              break e;
            }
          } else
            for (o = t.child, o !== null && (o.return = t); o !== null; ) {
              var i = o.dependencies;
              if (i !== null) {
                s = o.child;
                for (var a = i.firstContext; a !== null; ) {
                  if (a.context === r) {
                    if (o.tag === 1) {
                      ((a = Je(-1, n & -n)), (a.tag = 2));
                      var c = o.updateQueue;
                      if (c !== null) {
                        c = c.shared;
                        var m = c.pending;
                        (m === null
                          ? (a.next = a)
                          : ((a.next = m.next), (m.next = a)),
                          (c.pending = a));
                      }
                    }
                    ((o.lanes |= n),
                      (a = o.alternate),
                      a !== null && (a.lanes |= n),
                      Qo(o.return, n, t),
                      (i.lanes |= n));
                    break;
                  }
                  a = a.next;
                }
              } else if (o.tag === 10) s = o.type === t.type ? null : o.child;
              else if (o.tag === 18) {
                if (((s = o.return), s === null)) throw Error(v(341));
                ((s.lanes |= n),
                  (i = s.alternate),
                  i !== null && (i.lanes |= n),
                  Qo(s, n, t),
                  (s = o.sibling));
              } else s = o.child;
              if (s !== null) s.return = o;
              else
                for (s = o; s !== null; ) {
                  if (s === t) {
                    s = null;
                    break;
                  }
                  if (((o = s.sibling), o !== null)) {
                    ((o.return = s.return), (s = o));
                    break;
                  }
                  s = s.return;
                }
              o = s;
            }
        (ue(e, t, l.children, n), (t = t.child));
      }
      return t;
    case 9:
      return (
        (l = t.type),
        (r = t.pendingProps.children),
        fn(t, n),
        (l = Me(l)),
        (r = r(l)),
        (t.flags |= 1),
        ue(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (l = $e(r, t.pendingProps)),
        (l = $e(r.type, l)),
        ia(e, t, r, l, n)
      );
    case 15:
      return vc(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (l = t.pendingProps),
        (l = t.elementType === r ? l : $e(r, l)),
        Br(e, t),
        (t.tag = 1),
        ye(r) ? ((e = !0), ll(t)) : (e = !1),
        fn(t, n),
        hc(t, r, l),
        Yo(t, r, l, n),
        Zo(null, t, r, !0, e, n)
      );
    case 19:
      return Ec(e, t, n);
    case 22:
      return xc(e, t, n);
  }
  throw Error(v(156, t.tag));
};
function Fc(e, t) {
  return fu(e, t);
}
function Lp(e, t, n, r) {
  ((this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null));
}
function ze(e, t, n, r) {
  return new Lp(e, t, n, r);
}
function ti(e) {
  return ((e = e.prototype), !(!e || !e.isReactComponent));
}
function zp(e) {
  if (typeof e == "function") return ti(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === ks)) return 11;
    if (e === ws) return 14;
  }
  return 2;
}
function kt(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = ze(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function Kr(e, t, n, r, l, o) {
  var s = 2;
  if (((r = e), typeof e == "function")) ti(e) && (s = 1);
  else if (typeof e == "string") s = 5;
  else
    e: switch (e) {
      case Xt:
        return At(n.children, l, o, t);
      case xs:
        ((s = 8), (l |= 8));
        break;
      case vo:
        return (
          (e = ze(12, n, t, l | 2)),
          (e.elementType = vo),
          (e.lanes = o),
          e
        );
      case xo:
        return ((e = ze(13, n, t, l)), (e.elementType = xo), (e.lanes = o), e);
      case ko:
        return ((e = ze(19, n, t, l)), (e.elementType = ko), (e.lanes = o), e);
      case Ga:
        return Dl(n, l, o, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case Ka:
              s = 10;
              break e;
            case Ya:
              s = 9;
              break e;
            case ks:
              s = 11;
              break e;
            case ws:
              s = 14;
              break e;
            case it:
              ((s = 16), (r = null));
              break e;
          }
        throw Error(v(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = ze(s, n, t, l)),
    (t.elementType = e),
    (t.type = r),
    (t.lanes = o),
    t
  );
}
function At(e, t, n, r) {
  return ((e = ze(7, e, r, t)), (e.lanes = n), e);
}
function Dl(e, t, n, r) {
  return (
    (e = ze(22, e, r, t)),
    (e.elementType = Ga),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function fo(e, t, n) {
  return ((e = ze(6, e, null, t)), (e.lanes = n), e);
}
function po(e, t, n) {
  return (
    (t = ze(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function Dp(e, t, n, r, l) {
  ((this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = Ql(0)),
    (this.expirationTimes = Ql(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = Ql(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = l),
    (this.mutableSourceEagerHydrationData = null));
}
function ni(e, t, n, r, l, o, s, i, a) {
  return (
    (e = new Dp(e, t, n, i, a)),
    t === 1 ? ((t = 1), o === !0 && (t |= 8)) : (t = 0),
    (o = ze(3, null, null, t)),
    (e.current = o),
    (o.stateNode = e),
    (o.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    Fs(o),
    e
  );
}
function Mp(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: Gt,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function Uc(e) {
  if (!e) return Et;
  e = e._reactInternals;
  e: {
    if (Wt(e) !== e || e.tag !== 1) throw Error(v(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (ye(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(v(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (ye(n)) return Uu(e, n, t);
  }
  return t;
}
function bc(e, t, n, r, l, o, s, i, a) {
  return (
    (e = ni(n, r, !0, e, l, o, s, i, a)),
    (e.context = Uc(null)),
    (n = e.current),
    (r = ce()),
    (l = xt(n)),
    (o = Je(r, l)),
    (o.callback = t ?? null),
    yt(n, o, l),
    (e.current.lanes = l),
    ur(e, l, r),
    ve(e, r),
    e
  );
}
function Ml(e, t, n, r) {
  var l = t.current,
    o = ce(),
    s = xt(l);
  return (
    (n = Uc(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = Je(o, s)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = yt(l, t, s)),
    e !== null && (Ue(e, l, s, o), br(e, l, s)),
    s
  );
}
function yl(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function xa(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function ri(e, t) {
  (xa(e, t), (e = e.alternate) && xa(e, t));
}
function Rp() {
  return null;
}
var Vc =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function li(e) {
  this._internalRoot = e;
}
Rl.prototype.render = li.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(v(409));
  Ml(e, t, null, null);
};
Rl.prototype.unmount = li.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    (Ht(function () {
      Ml(null, e, null, null);
    }),
      (t[et] = null));
  }
};
function Rl(e) {
  this._internalRoot = e;
}
Rl.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = xu();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < ut.length && t !== 0 && t < ut[n].priority; n++);
    (ut.splice(n, 0, e), n === 0 && wu(e));
  }
};
function oi(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function Il(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function ka() {}
function Ip(e, t, n, r, l) {
  if (l) {
    if (typeof r == "function") {
      var o = r;
      r = function () {
        var c = yl(s);
        o.call(c);
      };
    }
    var s = bc(t, r, e, 0, null, !1, !1, "", ka);
    return (
      (e._reactRootContainer = s),
      (e[et] = s.current),
      qn(e.nodeType === 8 ? e.parentNode : e),
      Ht(),
      s
    );
  }
  for (; (l = e.lastChild); ) e.removeChild(l);
  if (typeof r == "function") {
    var i = r;
    r = function () {
      var c = yl(a);
      i.call(c);
    };
  }
  var a = ni(e, 0, !1, null, null, !1, !1, "", ka);
  return (
    (e._reactRootContainer = a),
    (e[et] = a.current),
    qn(e.nodeType === 8 ? e.parentNode : e),
    Ht(function () {
      Ml(t, a, n, r);
    }),
    a
  );
}
function $l(e, t, n, r, l) {
  var o = n._reactRootContainer;
  if (o) {
    var s = o;
    if (typeof l == "function") {
      var i = l;
      l = function () {
        var a = yl(s);
        i.call(a);
      };
    }
    Ml(t, s, e, l);
  } else s = Ip(n, t, e, l, r);
  return yl(s);
}
yu = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Rn(t.pendingLanes);
        n !== 0 &&
          (Cs(t, n | 1), ve(t, K()), !(I & 6) && ((kn = K() + 500), jt()));
      }
      break;
    case 13:
      (Ht(function () {
        var r = tt(e, 1);
        if (r !== null) {
          var l = ce();
          Ue(r, e, 1, l);
        }
      }),
        ri(e, 1));
  }
};
Ns = function (e) {
  if (e.tag === 13) {
    var t = tt(e, 134217728);
    if (t !== null) {
      var n = ce();
      Ue(t, e, 134217728, n);
    }
    ri(e, 134217728);
  }
};
vu = function (e) {
  if (e.tag === 13) {
    var t = xt(e),
      n = tt(e, t);
    if (n !== null) {
      var r = ce();
      Ue(n, e, t, r);
    }
    ri(e, t);
  }
};
xu = function () {
  return $;
};
ku = function (e, t) {
  var n = $;
  try {
    return (($ = e), t());
  } finally {
    $ = n;
  }
};
Lo = function (e, t, n) {
  switch (t) {
    case "input":
      if ((Eo(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var l = jl(r);
            if (!l) throw Error(v(90));
            (Za(r), Eo(r, l));
          }
        }
      }
      break;
    case "textarea":
      qa(e, n);
      break;
    case "select":
      ((t = n.value), t != null && an(e, !!n.multiple, t, !1));
  }
};
su = Js;
iu = Ht;
var $p = { usingClientEntryPoint: !1, Events: [dr, en, jl, lu, ou, Js] },
  zn = {
    findFiberByHostInstance: Rt,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  Op = {
    bundleType: zn.bundleType,
    version: zn.version,
    rendererPackageName: zn.rendererPackageName,
    rendererConfig: zn.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: lt.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return ((e = cu(e)), e === null ? null : e.stateNode);
    },
    findFiberByHostInstance: zn.findFiberByHostInstance || Rp,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var Mr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!Mr.isDisabled && Mr.supportsFiber)
    try {
      ((Sl = Mr.inject(Op)), (Qe = Mr));
    } catch {}
}
je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = $p;
je.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!oi(t)) throw Error(v(200));
  return Mp(e, t, null, n);
};
je.createRoot = function (e, t) {
  if (!oi(e)) throw Error(v(299));
  var n = !1,
    r = "",
    l = Vc;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (l = t.onRecoverableError)),
    (t = ni(e, 1, !1, null, null, n, !1, r, l)),
    (e[et] = t.current),
    qn(e.nodeType === 8 ? e.parentNode : e),
    new li(t)
  );
};
je.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(v(188))
      : ((e = Object.keys(e).join(",")), Error(v(268, e)));
  return ((e = cu(t)), (e = e === null ? null : e.stateNode), e);
};
je.flushSync = function (e) {
  return Ht(e);
};
je.hydrate = function (e, t, n) {
  if (!Il(t)) throw Error(v(200));
  return $l(null, e, t, !0, n);
};
je.hydrateRoot = function (e, t, n) {
  if (!oi(e)) throw Error(v(405));
  var r = (n != null && n.hydratedSources) || null,
    l = !1,
    o = "",
    s = Vc;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (l = !0),
      n.identifierPrefix !== void 0 && (o = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (s = n.onRecoverableError)),
    (t = bc(t, null, e, 1, n ?? null, l, !1, o, s)),
    (e[et] = t.current),
    qn(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      ((n = r[e]),
        (l = n._getVersion),
        (l = l(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, l])
          : t.mutableSourceEagerHydrationData.push(n, l));
  return new Rl(t);
};
je.render = function (e, t, n) {
  if (!Il(t)) throw Error(v(200));
  return $l(null, e, t, !1, n);
};
je.unmountComponentAtNode = function (e) {
  if (!Il(e)) throw Error(v(40));
  return e._reactRootContainer
    ? (Ht(function () {
        $l(null, null, e, !1, function () {
          ((e._reactRootContainer = null), (e[et] = null));
        });
      }),
      !0)
    : !1;
};
je.unstable_batchedUpdates = Js;
je.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Il(n)) throw Error(v(200));
  if (e == null || e._reactInternals === void 0) throw Error(v(38));
  return $l(e, t, n, !1, r);
};
je.version = "18.3.1-next-f1338f8080-20240426";
function Hc() {
  if (
    !(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
    )
  )
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Hc);
    } catch (e) {
      console.error(e);
    }
}
(Hc(), (Ha.exports = je));
var Ap = Ha.exports,
  Bc,
  wa = Ap;
((Bc = wa.createRoot), wa.hydrateRoot);
const Rr = {
  tasks: {},
  months: {},
  days: {},
  settings: { theme: "light", language: "en" },
};
function pr(e, t) {
  return e.months[t] ?? { month: t, mainTaskIds: [] };
}
function ot(e, t) {
  return e.days[t] ?? { date: t, done: {}, addonTaskIds: [] };
}
function mr(e, t) {
  const n = t.slice(0, 7),
    r = pr(e, n),
    l = ot(e, t);
  return [...new Set([...r.mainTaskIds, ...l.addonTaskIds])];
}
function Fp() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
function si(e, t) {
  const n = Fp(),
    r = { id: n, title: t.trim(), createdAt: new Date().toISOString() };
  return [{ ...e, tasks: { ...e.tasks, [n]: r } }, n];
}
function Up(e, t, n) {
  const r = pr(e, t);
  return r.mainTaskIds.includes(n)
    ? e
    : {
        ...e,
        months: {
          ...e.months,
          [t]: { ...r, mainTaskIds: [...r.mainTaskIds, n] },
        },
      };
}
function bp(e, t, n) {
  const r = pr(e, t);
  return {
    ...e,
    months: {
      ...e.months,
      [t]: { ...r, mainTaskIds: r.mainTaskIds.filter((l) => l !== n) },
    },
  };
}
function Wc(e, t, n) {
  const r = ot(e, t);
  return r.addonTaskIds.includes(n)
    ? e
    : {
        ...e,
        days: {
          ...e.days,
          [t]: { ...r, addonTaskIds: [...r.addonTaskIds, n] },
        },
      };
}
function Vp(e, t, n) {
  const r = ot(e, t),
    l = { ...r.done };
  return (
    delete l[n],
    {
      ...e,
      days: {
        ...e.days,
        [t]: {
          ...r,
          addonTaskIds: r.addonTaskIds.filter((o) => o !== n),
          done: l,
        },
      },
    }
  );
}
function Qc(e, t, n, r) {
  const l = ot(e, t);
  return {
    ...e,
    days: { ...e.days, [t]: { ...l, done: { ...l.done, [n]: r } } },
  };
}
function Hp(e, t) {
  return { ...e, settings: { ...e.settings, theme: t } };
}
function Bp(e, t) {
  return { ...e, settings: { ...e.settings, language: t } };
}
const Kc = "sprout-planner:v1";
function Wp() {
  try {
    const e = localStorage.getItem(Kc);
    if (!e) return Rr;
    const t = JSON.parse(e);
    return { ...Rr, ...t, settings: { ...Rr.settings, ...(t.settings ?? {}) } };
  } catch {
    return Rr;
  }
}
function Qp(e) {
  localStorage.setItem(Kc, JSON.stringify(e));
}
function Kp() {
  const [e, t] = P.useState(Wp);
  return (
    P.useEffect(() => {
      Qp(e);
    }, [e]),
    P.useEffect(() => {
      const n = document.documentElement;
      e.settings.theme === "dark"
        ? n.classList.add("dark")
        : n.classList.remove("dark");
    }, [e.settings.theme]),
    P.useEffect(() => {
      document.documentElement.lang = e.settings.language;
    }, [e.settings.language]),
    [e, t]
  );
}
const mo = [
  { code: "en", label: "English" },
  { code: "th", label: "ไทย" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
];
function Yp(e) {
  switch (e) {
    case "th":
      return "th-TH-u-ca-gregory";
    case "zh-CN":
      return "zh-CN";
    case "zh-TW":
      return "zh-TW";
    default:
      return "en-US";
  }
}
const Yc = {
    "nav.today": "Today",
    "nav.calendar": "Calendar",
    "nav.dashboard": "Dashboard",
    "today.title": "Today",
    "today.empty": "No tasks yet. Plant your first task below!",
    "today.addPlaceholder": "Add a task for today…",
    "today.newTaskAria": "New task for today",
    "today.showRecurring": "Manage monthly recurring tasks",
    "today.hideRecurring": "Hide monthly recurring tasks",
    "today.progressAria": "{pct}% of today complete",
    "today.thisWeek": "This week",
    "today.count": "{done} of {total} done",
    "today.monthInline": "{pct}% this month",
    "today.streakStart": "No streak yet",
    "today.momentum.empty": "Plant a task to start growing.",
    "today.momentum.start": "Fresh day. Check off your first task.",
    "today.momentum.going": "Good momentum, keep going.",
    "today.momentum.almost": "Just one more to finish the day.",
    "today.momentum.complete": "All done. Your sprout grew today.",
    "today.removeAria": 'Remove "{title}" from today',
    "today.stage.empty": "Plant a task to start growing",
    "today.stage.start": "Let's grow, check off your first task",
    "today.stage.progress": "Making progress, keep going",
    "today.stage.growing": "Growing nicely, you're over halfway",
    "today.stage.almost": "Almost there, finish strong",
    "today.stage.done": "All done. Your sprout grew today!",
    "today.scrollTasks": "View tasks",
    "install.cta": "Install app",
    "install.iosTitle": "Add Sprout to your Home Screen",
    "install.iosStep1": "Tap the Share button in Safari",
    "install.iosStep2": 'Choose "Add to Home Screen"',
    "install.iosStep3": 'Tap "Add" to finish',
    "install.dismiss": "Got it",
    "task.mark": 'Mark "{title}" as done',
    "task.unmark": 'Unmark "{title}" as done',
    "task.addAria": "Add task",
    "taskmgr.title": "Monthly recurring tasks",
    "taskmgr.empty": "No recurring tasks this month.",
    "taskmgr.placeholder": "New recurring task…",
    "taskmgr.newAria": "New recurring task",
    "taskmgr.addAria": "Add recurring task",
    "taskmgr.removeAria": 'Remove "{title}"',
    "day.planning": "Planning ahead",
    "day.past": "Past day",
    "day.today": "Today",
    "day.empty": "No tasks for this day.",
    "day.addPlaceholder": "Add a task for this day…",
    "day.newTaskAria": "New task for this day",
    "status.done": "Done",
    "status.inProgress": "In progress",
    "status.missed": "Missed",
    "common.close": "Close",
    "cal.prev": "Previous month",
    "cal.next": "Next month",
    "cal.complete": "Complete",
    "cal.missed": "Missed",
    "cal.inProgress": "In progress",
    "dash.growth": "Your growth",
    "dash.export": "Export {ratio}",
    "dash.completion": "Completion",
    "dash.greenDays": "Green days",
    "dash.tasksDone": "Tasks done",
    "dash.bestStreak": "Best streak",
    "dash.thisMonth": "this month",
    "dash.ofTracked": "of {n} tracked",
    "dash.allTime": "all time",
    "dash.activity": "Activity",
    "dash.less": "Less",
    "dash.more": "More",
    "dash.complete": "{green}/{total} complete",
    "headline.streak": "{n}-day streak",
    "headline.best": "Best streak: {n} days",
    "headline.start": "Just getting started",
    "headline.month": "{pct}% of {month} so far",
    "streak.current": "Current streak",
    "streak.day": "day",
    "streak.days": "days",
    "streak.best": "Best",
    "streak.milestone": "{n}-day milestone. Keep growing.",
    "streak.chain": "Finish today to keep your {n}-day chain alive.",
    "streak.toNext": "{n} to {m}",
    "theme.toLight": "Switch to light mode",
    "theme.toDark": "Switch to dark mode",
    "lang.label": "Language",
    "splash.loading": "Loading Sprout",
    "unit.dayShort": "d",
    "common.sep": ". ",
    "common.end": ".",
  },
  Gp = {
    "nav.today": "วันนี้",
    "nav.calendar": "ปฏิทิน",
    "nav.dashboard": "แดชบอร์ด",
    "today.title": "วันนี้",
    "today.empty": "ยังไม่มีงาน เริ่มปลูกงานแรกของคุณด้านล่าง!",
    "today.addPlaceholder": "เพิ่มงานสำหรับวันนี้…",
    "today.newTaskAria": "งานใหม่สำหรับวันนี้",
    "today.showRecurring": "จัดการงานประจำเดือน",
    "today.hideRecurring": "ซ่อนงานประจำเดือน",
    "today.progressAria": "เสร็จ {pct}% ของวันนี้",
    "today.thisWeek": "สัปดาห์นี้",
    "today.count": "เสร็จ {done} จาก {total}",
    "today.monthInline": "{pct}% เดือนนี้",
    "today.streakStart": "ยังไม่มีสถิติต่อเนื่อง",
    "today.momentum.empty": "ปลูกงานแรกเพื่อเริ่มเติบโต",
    "today.momentum.start": "วันใหม่ เริ่มจากงานแรกของคุณ",
    "today.momentum.going": "กำลังไปได้สวย ทำต่อไป",
    "today.momentum.almost": "อีกแค่งานเดียวก็เสร็จวันนี้",
    "today.momentum.complete": "เสร็จหมดแล้ว ต้นกล้าของคุณโตขึ้นวันนี้",
    "today.removeAria": 'ลบ "{title}" ออกจากวันนี้',
    "today.stage.empty": "ปลูกงานแรกเพื่อเริ่มเติบโต",
    "today.stage.start": "มาเริ่มกันเลย ทำงานแรกให้เสร็จ",
    "today.stage.progress": "กำลังคืบหน้า ทำต่อไป",
    "today.stage.growing": "เติบโตได้สวย ผ่านครึ่งทางแล้ว",
    "today.stage.almost": "ใกล้แล้ว ไปให้สุด",
    "today.stage.done": "เสร็จหมดแล้ว ต้นกล้าของคุณโตขึ้นวันนี้!",
    "today.scrollTasks": "ดูงาน",
    "install.cta": "ติดตั้งแอป",
    "install.iosTitle": "เพิ่ม Sprout ไปยังหน้าจอโฮม",
    "install.iosStep1": "แตะปุ่มแชร์ใน Safari",
    "install.iosStep2": 'เลือก "เพิ่มไปยังหน้าจอโฮม"',
    "install.iosStep3": 'แตะ "เพิ่ม" เพื่อเสร็จสิ้น',
    "install.dismiss": "เข้าใจแล้ว",
    "task.mark": 'ทำเครื่องหมายว่า "{title}" เสร็จแล้ว',
    "task.unmark": 'ยกเลิกเครื่องหมาย "{title}"',
    "task.addAria": "เพิ่มงาน",
    "taskmgr.title": "งานประจำที่ทำซ้ำทุกเดือน",
    "taskmgr.empty": "ไม่มีงานประจำในเดือนนี้",
    "taskmgr.placeholder": "งานประจำใหม่…",
    "taskmgr.newAria": "งานประจำใหม่",
    "taskmgr.addAria": "เพิ่มงานประจำ",
    "taskmgr.removeAria": 'ลบ "{title}"',
    "day.planning": "วางแผนล่วงหน้า",
    "day.past": "วันที่ผ่านมา",
    "day.today": "วันนี้",
    "day.empty": "ไม่มีงานสำหรับวันนี้",
    "day.addPlaceholder": "เพิ่มงานสำหรับวันนี้…",
    "day.newTaskAria": "งานใหม่สำหรับวันนี้",
    "status.done": "เสร็จแล้ว",
    "status.inProgress": "กำลังทำ",
    "status.missed": "พลาด",
    "common.close": "ปิด",
    "cal.prev": "เดือนก่อนหน้า",
    "cal.next": "เดือนถัดไป",
    "cal.complete": "สำเร็จ",
    "cal.missed": "พลาด",
    "cal.inProgress": "กำลังทำ",
    "dash.growth": "การเติบโตของคุณ",
    "dash.export": "ส่งออก {ratio}",
    "dash.completion": "ความสำเร็จ",
    "dash.greenDays": "วันสีเขียว",
    "dash.tasksDone": "งานที่ทำเสร็จ",
    "dash.bestStreak": "สถิติสูงสุด",
    "dash.thisMonth": "เดือนนี้",
    "dash.ofTracked": "จาก {n} วันที่บันทึก",
    "dash.allTime": "ตลอดกาล",
    "dash.activity": "กิจกรรม",
    "dash.less": "น้อย",
    "dash.more": "มาก",
    "dash.complete": "สำเร็จ {green}/{total}",
    "headline.streak": "ทำต่อเนื่อง {n} วัน",
    "headline.best": "สถิติสูงสุด: {n} วัน",
    "headline.start": "เพิ่งเริ่มต้น",
    "headline.month": "{pct}% ของ{month}แล้ว",
    "streak.current": "ทำต่อเนื่อง",
    "streak.day": "วัน",
    "streak.days": "วัน",
    "streak.best": "สูงสุด",
    "streak.milestone": "ครบ {n} วัน! เติบโตต่อไป",
    "streak.chain": "ทำวันนี้ให้เสร็จเพื่อรักษาสถิติ {n} วันของคุณ",
    "streak.toNext": "อีก {n} ถึง {m}",
    "theme.toLight": "สลับเป็นโหมดสว่าง",
    "theme.toDark": "สลับเป็นโหมดมืด",
    "lang.label": "ภาษา",
    "splash.loading": "กำลังโหลด Sprout",
    "unit.dayShort": "วัน",
    "common.sep": " ",
    "common.end": "",
  },
  Xp = {
    "nav.today": "今天",
    "nav.calendar": "日历",
    "nav.dashboard": "仪表盘",
    "today.title": "今天",
    "today.empty": "还没有任务。在下面种下你的第一个任务吧！",
    "today.addPlaceholder": "添加今天的任务…",
    "today.newTaskAria": "今天的新任务",
    "today.showRecurring": "管理每月重复任务",
    "today.hideRecurring": "隐藏每月重复任务",
    "today.progressAria": "今天完成 {pct}%",
    "today.thisWeek": "本周",
    "today.count": "完成 {done} / {total}",
    "today.monthInline": "本月 {pct}%",
    "today.streakStart": "还没有连续记录",
    "today.momentum.empty": "种下一个任务开始成长吧。",
    "today.momentum.start": "新的一天，完成第一个任务。",
    "today.momentum.going": "势头不错，继续加油。",
    "today.momentum.almost": "还差一个就完成今天了。",
    "today.momentum.complete": "全部完成，今天你的幼苗成长了。",
    "today.removeAria": "从今天移除“{title}”",
    "today.stage.empty": "种下一个任务开始成长吧",
    "today.stage.start": "开始吧，完成你的第一个任务",
    "today.stage.progress": "正在进步，继续加油",
    "today.stage.growing": "成长得不错，已经过半啦",
    "today.stage.almost": "就快完成了，坚持住",
    "today.stage.done": "全部完成，今天你的幼苗成长了！",
    "today.scrollTasks": "查看任务",
    "install.cta": "安装应用",
    "install.iosTitle": "将 Sprout 添加到主屏幕",
    "install.iosStep1": "点按 Safari 中的分享按钮",
    "install.iosStep2": "选择“添加到主屏幕”",
    "install.iosStep3": "点按“添加”完成",
    "install.dismiss": "知道了",
    "task.mark": "将“{title}”标记为完成",
    "task.unmark": "取消标记“{title}”",
    "task.addAria": "添加任务",
    "taskmgr.title": "每月重复任务",
    "taskmgr.empty": "本月没有重复任务。",
    "taskmgr.placeholder": "新的重复任务…",
    "taskmgr.newAria": "新的重复任务",
    "taskmgr.addAria": "添加重复任务",
    "taskmgr.removeAria": "删除“{title}”",
    "day.planning": "提前规划",
    "day.past": "过去的一天",
    "day.today": "今天",
    "day.empty": "这一天没有任务。",
    "day.addPlaceholder": "添加这一天的任务…",
    "day.newTaskAria": "这一天的新任务",
    "status.done": "完成",
    "status.inProgress": "进行中",
    "status.missed": "错过",
    "common.close": "关闭",
    "cal.prev": "上个月",
    "cal.next": "下个月",
    "cal.complete": "完成",
    "cal.missed": "错过",
    "cal.inProgress": "进行中",
    "dash.growth": "你的成长",
    "dash.export": "导出 {ratio}",
    "dash.completion": "完成率",
    "dash.greenDays": "绿色天数",
    "dash.tasksDone": "已完成任务",
    "dash.bestStreak": "最佳连续",
    "dash.thisMonth": "本月",
    "dash.ofTracked": "共 {n} 天记录",
    "dash.allTime": "历史",
    "dash.activity": "活动",
    "dash.less": "少",
    "dash.more": "多",
    "dash.complete": "完成 {green}/{total}",
    "headline.streak": "连续 {n} 天",
    "headline.best": "最佳连续：{n} 天",
    "headline.start": "刚刚开始",
    "headline.month": "{month}已完成 {pct}%",
    "streak.current": "当前连续",
    "streak.day": "天",
    "streak.days": "天",
    "streak.best": "最佳",
    "streak.milestone": "达成 {n} 天里程碑！继续成长。",
    "streak.chain": "完成今天以保持你的 {n} 天连续记录。",
    "streak.toNext": "还差 {n} 到 {m}",
    "theme.toLight": "切换到浅色模式",
    "theme.toDark": "切换到深色模式",
    "lang.label": "语言",
    "splash.loading": "正在加载 Sprout",
    "unit.dayShort": "天",
    "common.sep": "，",
    "common.end": "。",
  },
  Zp = {
    "nav.today": "今天",
    "nav.calendar": "日曆",
    "nav.dashboard": "儀表板",
    "today.title": "今天",
    "today.empty": "還沒有任務。在下面種下你的第一個任務吧！",
    "today.addPlaceholder": "新增今天的任務…",
    "today.newTaskAria": "今天的新任務",
    "today.showRecurring": "管理每月重複任務",
    "today.hideRecurring": "隱藏每月重複任務",
    "today.progressAria": "今天完成 {pct}%",
    "today.thisWeek": "本週",
    "today.count": "完成 {done} / {total}",
    "today.monthInline": "本月 {pct}%",
    "today.streakStart": "還沒有連續紀錄",
    "today.momentum.empty": "種下一個任務開始成長吧。",
    "today.momentum.start": "新的一天，完成第一個任務。",
    "today.momentum.going": "勢頭不錯，繼續加油。",
    "today.momentum.almost": "還差一個就完成今天了。",
    "today.momentum.complete": "全部完成，今天你的幼苗成長了。",
    "today.removeAria": "從今天移除「{title}」",
    "today.stage.empty": "種下一個任務開始成長吧",
    "today.stage.start": "開始吧，完成你的第一個任務",
    "today.stage.progress": "正在進步，繼續加油",
    "today.stage.growing": "成長得不錯，已經過半啦",
    "today.stage.almost": "就快完成了，堅持住",
    "today.stage.done": "全部完成，今天你的幼苗成長了！",
    "today.scrollTasks": "查看任務",
    "install.cta": "安裝應用程式",
    "install.iosTitle": "將 Sprout 加入主畫面",
    "install.iosStep1": "點按 Safari 中的分享按鈕",
    "install.iosStep2": "選擇「加入主畫面」",
    "install.iosStep3": "點按「加入」完成",
    "install.dismiss": "知道了",
    "task.mark": "將「{title}」標記為完成",
    "task.unmark": "取消標記「{title}」",
    "task.addAria": "新增任務",
    "taskmgr.title": "每月重複任務",
    "taskmgr.empty": "本月沒有重複任務。",
    "taskmgr.placeholder": "新的重複任務…",
    "taskmgr.newAria": "新的重複任務",
    "taskmgr.addAria": "新增重複任務",
    "taskmgr.removeAria": "刪除「{title}」",
    "day.planning": "提前規劃",
    "day.past": "過去的一天",
    "day.today": "今天",
    "day.empty": "這一天沒有任務。",
    "day.addPlaceholder": "新增這一天的任務…",
    "day.newTaskAria": "這一天的新任務",
    "status.done": "完成",
    "status.inProgress": "進行中",
    "status.missed": "錯過",
    "common.close": "關閉",
    "cal.prev": "上個月",
    "cal.next": "下個月",
    "cal.complete": "完成",
    "cal.missed": "錯過",
    "cal.inProgress": "進行中",
    "dash.growth": "你的成長",
    "dash.export": "匯出 {ratio}",
    "dash.completion": "完成率",
    "dash.greenDays": "綠色天數",
    "dash.tasksDone": "已完成任務",
    "dash.bestStreak": "最佳連續",
    "dash.thisMonth": "本月",
    "dash.ofTracked": "共 {n} 天記錄",
    "dash.allTime": "歷史",
    "dash.activity": "活動",
    "dash.less": "少",
    "dash.more": "多",
    "dash.complete": "完成 {green}/{total}",
    "headline.streak": "連續 {n} 天",
    "headline.best": "最佳連續：{n} 天",
    "headline.start": "剛剛開始",
    "headline.month": "{month}已完成 {pct}%",
    "streak.current": "目前連續",
    "streak.day": "天",
    "streak.days": "天",
    "streak.best": "最佳",
    "streak.milestone": "達成 {n} 天里程碑！繼續成長。",
    "streak.chain": "完成今天以保持你的 {n} 天連續紀錄。",
    "streak.toNext": "還差 {n} 到 {m}",
    "theme.toLight": "切換至淺色模式",
    "theme.toDark": "切換至深色模式",
    "lang.label": "語言",
    "splash.loading": "正在載入 Sprout",
    "unit.dayShort": "天",
    "common.sep": "，",
    "common.end": "。",
  },
  Jp = { en: Yc, th: Gp, "zh-CN": Xp, "zh-TW": Zp };
function qp(e, t) {
  return t
    ? e.replace(/\{(\w+)\}/g, (n, r) => (r in t ? String(t[r]) : `{${r}}`))
    : e;
}
function Gc(e) {
  const t = Jp[e];
  return (n, r) => {
    const l = t[n] ?? Yc[n] ?? n;
    return qp(l, r);
  };
}
const Xc = P.createContext({ lang: "en", locale: "en-US", t: Gc("en") });
function em({ lang: e, children: t }) {
  const n = P.useMemo(() => ({ lang: e, locale: Yp(e), t: Gc(e) }), [e]);
  return u.jsx(Xc.Provider, { value: n, children: t });
}
function Pe() {
  return P.useContext(Xc);
}
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const tm = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  Zc = (...e) => e.filter((t, n, r) => !!t && r.indexOf(t) === n).join(" ");
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var nm = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const rm = P.forwardRef(
  (
    {
      color: e = "currentColor",
      size: t = 24,
      strokeWidth: n = 2,
      absoluteStrokeWidth: r,
      className: l = "",
      children: o,
      iconNode: s,
      ...i
    },
    a,
  ) =>
    P.createElement(
      "svg",
      {
        ref: a,
        ...nm,
        width: t,
        height: t,
        stroke: e,
        strokeWidth: r ? (Number(n) * 24) / Number(t) : n,
        className: Zc("lucide", l),
        ...i,
      },
      [
        ...s.map(([c, m]) => P.createElement(c, m)),
        ...(Array.isArray(o) ? o : [o]),
      ],
    ),
);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const re = (e, t) => {
  const n = P.forwardRef(({ className: r, ...l }, o) =>
    P.createElement(rm, {
      ref: o,
      iconNode: t,
      className: Zc(`lucide-${tm(e)}`, r),
      ...l,
    }),
  );
  return ((n.displayName = `${e}`), n);
};
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const lm = re("CalendarDays", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  [
    "rect",
    { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" },
  ],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Jc = re("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Sa = re("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const om = re("ChevronLeft", [
  ["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const sm = re("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const us = re("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const im = re("Flame", [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49",
    },
  ],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const am = re("Languages", [
  ["path", { d: "m5 8 6 6", key: "1wu5hv" }],
  ["path", { d: "m4 14 6-6 2-3", key: "1k1g8d" }],
  ["path", { d: "M2 5h12", key: "or177f" }],
  ["path", { d: "M7 2h1", key: "1t2jsx" }],
  ["path", { d: "m22 22-5-10-5 10", key: "don7ne" }],
  ["path", { d: "M14 18h6", key: "1m8k6r" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const um = re("LayoutDashboard", [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  [
    "rect",
    { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" },
  ],
  [
    "rect",
    { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" },
  ],
  [
    "rect",
    { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" },
  ],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const cm = re("ListChecks", [
  ["path", { d: "m3 17 2 2 4-4", key: "1jhpwq" }],
  ["path", { d: "m3 7 2 2 4-4", key: "1obspn" }],
  ["path", { d: "M13 6h8", key: "15sg57" }],
  ["path", { d: "M13 12h8", key: "h98zly" }],
  ["path", { d: "M13 18h8", key: "oe0vm4" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const dm = re("Moon", [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ol = re("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const fm = re("Repeat2", [
  ["path", { d: "m2 9 3-3 3 3", key: "1ltn5i" }],
  ["path", { d: "M13 18H7a2 2 0 0 1-2-2V6", key: "1r6tfw" }],
  ["path", { d: "m22 15-3 3-3-3", key: "4rnwn2" }],
  ["path", { d: "M11 6h6a2 2 0 0 1 2 2v10", key: "2f72bc" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const pm = re("Share", [
  ["path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", key: "1b2hhj" }],
  ["polyline", { points: "16 6 12 2 8 6", key: "m901s6" }],
  ["line", { x1: "12", x2: "12", y1: "2", y2: "15", key: "1p0rca" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const mm = re("Sun", [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const hm = re("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }],
]);
/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ii = re("X", [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ]),
  gm = [
    { id: "today", labelKey: "nav.today", Icon: cm },
    { id: "calendar", labelKey: "nav.calendar", Icon: lm },
    { id: "dashboard", labelKey: "nav.dashboard", Icon: um },
  ];
function ym({ active: e, onChange: t }) {
  const { t: n } = Pe();
  return u.jsx("nav", {
    className: "mx-auto w-full max-w-2xl px-4 pb-3",
    "aria-label": "Main navigation",
    children: u.jsx("div", {
      className:
        "grid grid-cols-3 gap-1 rounded-2xl border border-sprout-100 bg-surface-muted p-1 shadow-sm dark:border-sprout-900 dark:bg-surface-dark-muted",
      role: "tablist",
      children: gm.map(({ id: r, labelKey: l, Icon: o }) => {
        const s = e === r;
        return u.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            onClick: () => t(r),
            "aria-selected": s,
            "aria-current": s ? "page" : void 0,
            className: `min-h-[52px] rounded-xl px-2 py-2 text-xs font-semibold transition-all
                flex flex-col items-center justify-center gap-1
                ${s ? "bg-surface text-sprout-700 shadow-[0_8px_20px_rgba(22,101,52,0.12)] ring-1 ring-sprout-100 dark:bg-surface-dark dark:text-sprout-300 dark:ring-sprout-900" : "text-ink-muted hover:bg-surface hover:text-sprout-700 dark:text-surface-muted dark:hover:bg-surface-dark dark:hover:text-sprout-300"}`,
            children: [
              u.jsx(o, {
                size: 19,
                strokeWidth: s ? 2.4 : 2,
                "aria-hidden": "true",
              }),
              u.jsx("span", { className: "leading-none", children: n(l) }),
            ],
          },
          r,
        );
      }),
    }),
  });
}
function Ve() {
  return new Date().toISOString().slice(0, 10);
}
function Ea(e, t = "en-US") {
  const [n, r] = e.split("-");
  return new Date(Number(n), Number(r) - 1, 1).toLocaleDateString(t, {
    month: "long",
    year: "numeric",
  });
}
function cs(e, t = "en-US") {
  const [n, r, l] = e.split("-").map(Number);
  return new Date(n, r - 1, l).toLocaleDateString(t, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
function Al(e = "en-US", t = "short") {
  return Array.from({ length: 7 }, (n, r) =>
    new Date(2023, 0, 1 + r).toLocaleDateString(e, { weekday: t }),
  );
}
function ai(e) {
  const [t, n] = e.split("-").map(Number),
    r = new Date(t, n - 1, 1).getDay(),
    l = new Date(t, n, 0).getDate(),
    o = [];
  for (let i = 0; i < r; i++) o.push(null);
  for (let i = 1; i <= l; i++) o.push(`${e}-${String(i).padStart(2, "0")}`);
  for (; o.length % 7 !== 0; ) o.push(null);
  const s = [];
  for (let i = 0; i < o.length; i += 7) s.push(o.slice(i, i + 7));
  return s;
}
function vm(e) {
  const [t, n] = e.split("-").map(Number),
    r = new Date(t, n - 2, 1);
  return `${r.getFullYear()}-${String(r.getMonth() + 1).padStart(2, "0")}`;
}
function xm(e) {
  const [t, n] = e.split("-").map(Number),
    r = new Date(t, n, 1);
  return `${r.getFullYear()}-${String(r.getMonth() + 1).padStart(2, "0")}`;
}
function km(e = 26) {
  const t = new Date(),
    n = [],
    r = new Date(t);
  r.setDate(r.getDate() - t.getDay() - (e - 1) * 7);
  for (let l = 0; l < e * 7; l++) {
    const o = new Date(r);
    (o.setDate(r.getDate() + l), n.push(o.toISOString().slice(0, 10)));
  }
  return n;
}
function ui() {
  return Ve().slice(0, 7);
}
const qc = {
  complete: {
    bg: "bg-sprout-500",
    bgLight: "bg-sprout-50 dark:bg-sprout-950",
    border: "border-sprout-200 dark:border-sprout-800",
    ring: "ring-2 ring-sprout-300 dark:ring-sprout-600",
    text: "text-white",
    badge: "bg-sprout-500 text-white",
    stamp: "bg-sprout-500 text-white shadow-sm",
  },
  "in-progress": {
    bg: "bg-amber-300 dark:bg-amber-700",
    bgLight: "bg-amber-50 dark:bg-amber-950",
    border: "border-amber-200 dark:border-amber-800",
    ring: "ring-2 ring-amber-300",
    text: "text-amber-900 dark:text-amber-100",
    badge: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200",
    stamp: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  },
  missed: {
    bg: "bg-red-300 dark:bg-red-800",
    bgLight: "bg-red-50 dark:bg-red-950",
    border: "border-red-200 dark:border-red-800",
    ring: "ring-2 ring-red-300",
    text: "text-red-700 dark:text-red-300",
    badge: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
    stamp: "bg-red-100 dark:bg-red-950 text-red-500 dark:text-red-400",
  },
  neutral: {
    bg: "bg-gray-200 dark:bg-gray-700",
    bgLight: "bg-transparent",
    border: "border-gray-100 dark:border-gray-800",
    ring: "",
    text: "text-ink-muted dark:text-surface-muted",
    badge: "bg-gray-100 dark:bg-gray-800 text-ink-muted",
    stamp: "",
  },
};
function rt(e, t) {
  const n = Ve(),
    r = mr(e, t);
  if (r.length === 0 || t > n) return "neutral";
  const l = ot(e, t);
  return r.every((s) => l.done[s])
    ? "complete"
    : t === n
      ? "in-progress"
      : "missed";
}
function wm(e, t) {
  const n = mr(e, t);
  if (n.length === 0) return 0;
  const r = ot(e, t);
  return n.filter((o) => r.done[o]).length / n.length;
}
function ed(e) {
  const t = Ve();
  let n = 0,
    r = 0,
    l = 0,
    o = new Date(t);
  for (;;) {
    const m = o.toISOString().slice(0, 10),
      g = rt(e, m);
    if (g === "complete") (l++, l > r && (r = l));
    else if (g === "in-progress" && m === t) {
      o.setDate(o.getDate() - 1);
      continue;
    } else break;
    o.setDate(o.getDate() - 1);
  }
  n = l;
  const s = Object.keys(e.days).sort();
  let i = 0,
    a = 0,
    c = "";
  for (const m of s)
    if (rt(e, m) === "complete") {
      if (c) {
        const h = new Date(c);
        (new Date(m).getTime() - h.getTime()) / 864e5 === 1 ? a++ : (a = 1);
      } else a = 1;
      (a > i && (i = a), (c = m));
    } else ((c = ""), (a = 0));
  return ((r = Math.max(n, i)), { current: n, best: r });
}
function ci(e, t) {
  const n = Ve(),
    l = ai(t)
      .flat()
      .filter((a) => a !== null && a <= n);
  let o = 0,
    s = 0,
    i = 0;
  for (const a of l) {
    const c = mr(e, a);
    if (c.length === 0) continue;
    i++;
    const m = ot(e, a),
      g = c.filter((h) => m.done[h]).length;
    ((s += g), c.every((h) => m.done[h]) && o++);
  }
  return {
    completionPct: i === 0 ? 0 : Math.round((o / i) * 100),
    greenDays: o,
    totalDays: i,
    tasksCompleted: s,
  };
}
function Sm(e, t = 26) {
  return km(t).map((n) => ({ date: n, ratio: wm(e, n), status: rt(e, n) }));
}
function vl(e, t = 800) {
  const [n, r] = P.useState(e),
    l = P.useRef(e),
    o = P.useRef();
  return (
    P.useEffect(() => {
      const s = l.current,
        i = e - s;
      if (i === 0) return;
      const a = performance.now(),
        c = (m) => {
          const g = Math.min((m - a) / t, 1),
            h = 1 - Math.pow(1 - g, 4);
          (r(Math.round(s + i * h)),
            g < 1 ? (o.current = requestAnimationFrame(c)) : (l.current = e));
        };
      return (
        (o.current = requestAnimationFrame(c)),
        () => {
          (o.current && cancelAnimationFrame(o.current), (l.current = e));
        }
      );
    }, [e, t]),
    n
  );
}
function Em({ state: e, setState: t }) {
  const { t: n } = Pe(),
    r = ui(),
    l = pr(e, r),
    [o, s] = P.useState("");
  function i(c) {
    if ((c.preventDefault(), !o.trim())) return;
    const [m, g] = si(e, o.trim());
    (t(Up(m, r, g)), s(""));
  }
  function a(c) {
    t(bp(e, r, c));
  }
  return u.jsxs("div", {
    className:
      "bg-surface dark:bg-surface-dark-muted rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-3",
    children: [
      u.jsx("h3", {
        className: "text-sm font-semibold text-ink dark:text-surface",
        children: n("taskmgr.title"),
      }),
      l.mainTaskIds.length === 0 &&
        u.jsx("p", {
          className: "text-xs text-ink-subtle dark:text-surface-muted",
          children: n("taskmgr.empty"),
        }),
      l.mainTaskIds.map((c) => {
        const m = e.tasks[c];
        return m
          ? u.jsxs(
              "div",
              {
                className: "flex items-center gap-2",
                children: [
                  u.jsx("span", {
                    className: "flex-1 text-sm text-ink dark:text-surface",
                    children: m.title,
                  }),
                  u.jsx("button", {
                    onClick: () => a(c),
                    "aria-label": n("taskmgr.removeAria", { title: m.title }),
                    className:
                      "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-ink-subtle hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-all",
                    children: u.jsx(hm, { size: 15, "aria-hidden": "true" }),
                  }),
                ],
              },
              c,
            )
          : null;
      }),
      u.jsxs("form", {
        onSubmit: i,
        className: "flex gap-2 pt-1",
        children: [
          u.jsx("input", {
            value: o,
            onChange: (c) => s(c.target.value),
            placeholder: n("taskmgr.placeholder"),
            "aria-label": n("taskmgr.newAria"),
            className:
              "flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-muted dark:bg-surface-dark text-sm text-ink dark:text-surface placeholder-ink-subtle dark:placeholder-surface-muted focus:border-sprout-400 transition-colors",
          }),
          u.jsx("button", {
            type: "submit",
            "aria-label": n("taskmgr.addAria"),
            className:
              "min-w-[44px] min-h-[44px] px-3 py-2 bg-sprout-600 hover:bg-sprout-700 text-white rounded-xl text-sm transition-colors",
            children: u.jsx(Ol, { size: 16, "aria-hidden": "true" }),
          }),
        ],
      }),
    ],
  });
}
const Ca = ["🌱", "🍃", "🌿", "✨"];
function Cm({ burstKey: e }) {
  const [t, n] = P.useState(!1),
    r = P.useMemo(
      () =>
        Array.from({ length: 28 }, (l, o) => {
          const s = (Math.PI * 2 * o) / 28 + Math.random() * 0.4,
            i = 120 + Math.random() * 160;
          return {
            id: o,
            x: Math.cos(s) * i,
            y: Math.sin(s) * i - 40,
            rot: (Math.random() - 0.5) * 540,
            delay: Math.random() * 0.08,
            emoji: Ca[o % Ca.length],
            size: 14 + Math.random() * 18,
          };
        }),
      [e],
    );
  return (
    P.useEffect(() => {
      if (e === 0) return;
      n(!0);
      const l = setTimeout(() => n(!1), 1400);
      return () => clearTimeout(l);
    }, [e]),
    t
      ? u.jsxs("div", {
          className:
            "fixed inset-0 z-[90] flex items-center justify-center pointer-events-none",
          "aria-hidden": "true",
          children: [
            r.map((l) =>
              u.jsx(
                "span",
                {
                  className: "absolute",
                  style: {
                    fontSize: `${l.size}px`,
                    "--tx": `${l.x}px`,
                    "--ty": `${l.y}px`,
                    "--rot": `${l.rot}deg`,
                    animation: `seed-burst 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${l.delay}s forwards`,
                  },
                  children: l.emoji,
                },
                `${e}-${l.id}`,
              ),
            ),
            u.jsx("style", {
              children: `
        @keyframes seed-burst {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.4) rotate(0deg); }
          15%  { opacity: 1; }
          70%  { opacity: 1; }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot));
          }
        }
      `,
            }),
          ],
        })
      : null
  );
}
function Nm() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === !0
  );
}
function jm() {
  const e = window.navigator.userAgent;
  return /iphone|ipad|ipod/i.test(e) && !/crios|fxios/i.test(e);
}
function Tm() {
  return (
    window.matchMedia("(max-width: 1024px)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}
function Pm() {
  const [e, t] = P.useState(null),
    [n, r] = P.useState(Nm);
  P.useEffect(() => {
    const a = (m) => {
        (m.preventDefault(), t(m));
      },
      c = () => {
        (r(!0), t(null));
      };
    return (
      window.addEventListener("beforeinstallprompt", a),
      window.addEventListener("appinstalled", c),
      () => {
        (window.removeEventListener("beforeinstallprompt", a),
          window.removeEventListener("appinstalled", c));
      }
    );
  }, []);
  const l = jm(),
    o = e !== null,
    s = !n && Tm() && (o || l);
  async function i() {
    if (!e) return !1;
    await e.prompt();
    const { outcome: a } = await e.userChoice;
    return (a === "accepted" && t(null), a === "accepted");
  }
  return { canShow: s, canPrompt: o, isIOS: l, promptInstall: i };
}
function _m() {
  const { t: e } = Pe(),
    { canShow: t, canPrompt: n, isIOS: r, promptInstall: l } = Pm(),
    [o, s] = P.useState(!1);
  if (!t) return null;
  function i() {
    n ? l() : r && s(!0);
  }
  return u.jsxs(u.Fragment, {
    children: [
      u.jsxs("button", {
        onClick: i,
        className:
          "inline-flex min-h-[44px] items-center gap-2 rounded-full bg-sprout-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sprout-600/25 hover:bg-sprout-700",
        children: [
          u.jsx(us, { size: 16, "aria-hidden": "true" }),
          e("install.cta"),
        ],
      }),
      o &&
        u.jsx("div", {
          className:
            "fixed inset-0 z-[95] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center",
          onClick: () => s(!1),
          role: "dialog",
          "aria-modal": "true",
          "aria-label": e("install.iosTitle"),
          children: u.jsxs("div", {
            className:
              "w-full max-w-sm rounded-3xl bg-surface p-6 shadow-2xl dark:bg-surface-dark-muted",
            onClick: (a) => a.stopPropagation(),
            children: [
              u.jsxs("div", {
                className: "mb-4 flex items-start justify-between gap-3",
                children: [
                  u.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      u.jsx("img", {
                        src: "/sprout-logo.png",
                        alt: "",
                        "aria-hidden": "true",
                        className: "h-11 w-11 object-contain",
                      }),
                      u.jsx("h2", {
                        className:
                          "text-base font-bold text-ink dark:text-surface",
                        children: e("install.iosTitle"),
                      }),
                    ],
                  }),
                  u.jsx("button", {
                    onClick: () => s(!1),
                    "aria-label": e("common.close"),
                    className:
                      "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-ink-subtle hover:text-ink dark:hover:text-surface",
                    children: u.jsx(ii, { size: 18, "aria-hidden": "true" }),
                  }),
                ],
              }),
              u.jsxs("ol", {
                className:
                  "flex flex-col gap-3 text-sm text-ink-muted dark:text-surface-muted",
                children: [
                  u.jsx(ho, {
                    n: 1,
                    icon: u.jsx(pm, { size: 16, "aria-hidden": "true" }),
                    children: e("install.iosStep1"),
                  }),
                  u.jsx(ho, {
                    n: 2,
                    icon: u.jsx(Ol, { size: 16, "aria-hidden": "true" }),
                    children: e("install.iosStep2"),
                  }),
                  u.jsx(ho, { n: 3, children: e("install.iosStep3") }),
                ],
              }),
              u.jsx("button", {
                onClick: () => s(!1),
                className:
                  "mt-5 w-full rounded-2xl bg-sprout-600 py-3 text-sm font-semibold text-white hover:bg-sprout-700",
                children: e("install.dismiss"),
              }),
            ],
          }),
        }),
    ],
  });
}
function ho({ n: e, icon: t, children: n }) {
  return u.jsxs("li", {
    className: "flex items-center gap-3",
    children: [
      u.jsx("span", {
        className:
          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-sprout-100 text-xs font-bold text-sprout-700 dark:bg-sprout-950 dark:text-sprout-300",
        children: e,
      }),
      u.jsxs("span", {
        className: "flex items-center gap-1.5",
        children: [
          n,
          t &&
            u.jsx("span", {
              className: "text-sprout-600 dark:text-sprout-400",
              children: t,
            }),
        ],
      }),
    ],
  });
}
function Lm() {
  const [e, t, n] = Ve().split("-").map(Number),
    r = (l) => String(l).padStart(2, "0");
  return Array.from({ length: 7 }, (l, o) => {
    const s = new Date(e, t - 1, n - (6 - o));
    return `${s.getFullYear()}-${r(s.getMonth() + 1)}-${r(s.getDate())}`;
  });
}
const zm = {
  complete: "bg-sprout-500 text-white",
  "in-progress":
    "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  missed: "bg-red-50 dark:bg-red-950 text-red-500 dark:text-red-400",
  neutral:
    "bg-surface-muted dark:bg-surface-dark-muted text-ink-subtle dark:text-surface-muted",
};
function Dm(e, t) {
  return t === 0
    ? { src: "/sprout-empty.png", key: "today.stage.empty" }
    : e >= 100
      ? { src: "/sprout-success.png", key: "today.stage.done" }
      : e >= 75
        ? { src: "/sprout-success.png", key: "today.stage.almost" }
        : e >= 50
          ? { src: "/sprout-empty.png", key: "today.stage.growing" }
          : e >= 25
            ? { src: "/sprout-progress.png", key: "today.stage.progress" }
            : { src: "/sprout-fail.png", key: "today.stage.start" };
}
function Mm({ state: e, setState: t }) {
  const { t: n, locale: r } = Pe(),
    l = Ve(),
    o = l.slice(0, 7),
    s = mr(e, l),
    i = ot(e, l),
    a = rt(e, l),
    c = new Set(pr(e, o).mainTaskIds),
    [m, g] = P.useState(""),
    [h, w] = P.useState(!1),
    [x, S] = P.useState(0),
    R = s.filter((M) => i.done[M]).length,
    f = s.length,
    d = f === 0 ? 0 : Math.round((R / f) * 100),
    p = vl(d, 700),
    y = ed(e),
    k = ci(e, o),
    E = Al(r, "narrow"),
    C = Lm(),
    T = Dm(d, f),
    O = P.useRef(a === "complete");
  P.useEffect(() => {
    (a === "complete" && !O.current && S((M) => M + 1),
      (O.current = a === "complete"));
  }, [a]);
  function L(M) {
    t(Qc(e, l, M, !i.done[M]));
  }
  function ae(M) {
    t(Vp(e, l, M));
  }
  function Tt(M) {
    if ((M.preventDefault(), !m.trim())) return;
    const [ke, pe] = si(e, m.trim());
    (t(Wc(ke, l, pe)), g(""));
  }
  function Pt() {
    var M;
    (M = document.getElementById("today-tasks")) == null ||
      M.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return u.jsxs("div", {
    className: "w-full",
    children: [
      u.jsx(Cm, { burstKey: x }),
      u.jsxs("section", {
        className:
          "relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 py-12",
        children: [
          u.jsx("div", {
            "aria-hidden": "true",
            className:
              "pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-sprout-50 to-surface dark:from-sprout-950/60 dark:to-surface-dark",
          }),
          u.jsx("div", {
            "aria-hidden": "true",
            className:
              "pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full origin-bottom bg-gradient-to-t from-sprout-300/45 via-sprout-200/20 to-transparent transition-transform duration-700 ease-out dark:from-sprout-700/40 dark:via-sprout-800/15",
            style: {
              transform: `scaleY(${Math.max(d, f === 0 ? 4 : 6) / 100})`,
            },
          }),
          u.jsx("p", {
            className:
              "mb-2 text-sm font-medium text-ink-subtle dark:text-surface-muted",
            children: cs(l, r),
          }),
          u.jsxs("div", {
            className: "relative flex items-center justify-center",
            children: [
              u.jsx("div", {
                "aria-hidden": "true",
                className:
                  "absolute h-40 w-40 rounded-full bg-sprout-300/30 blur-3xl dark:bg-sprout-600/25 sm:h-56 sm:w-56",
              }),
              u.jsx(
                "img",
                {
                  src: T.src,
                  alt: "",
                  "aria-hidden": "true",
                  className:
                    "relative w-40 object-contain drop-shadow-[0_18px_30px_rgba(22,101,52,0.18)] animate-bloom sm:w-52 lg:w-60",
                  style: {
                    animation: "streak-float 4.6s ease-in-out infinite",
                  },
                },
                T.src,
              ),
            ],
          }),
          u.jsxs("div", {
            className: "mt-4 flex flex-col items-center",
            role: "progressbar",
            "aria-valuenow": d,
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-label": n("today.progressAria", { pct: d }),
            children: [
              u.jsxs("div", {
                className:
                  "font-sans text-7xl font-bold leading-none tracking-tight text-ink dark:text-surface tabular-nums sm:text-8xl",
                children: [
                  p,
                  u.jsx("span", {
                    className:
                      "text-3xl align-top text-sprout-600 dark:text-sprout-400 sm:text-4xl",
                    children: "%",
                  }),
                ],
              }),
              f > 0 &&
                u.jsx("p", {
                  className:
                    "mt-2 text-sm font-medium text-ink-muted dark:text-surface-muted tabular-nums",
                  children: n("today.count", { done: R, total: f }),
                }),
            ],
          }),
          u.jsx("p", {
            className:
              "mt-3 max-w-xs text-center text-lg font-semibold text-ink dark:text-surface sm:text-xl",
            children: n(T.key),
          }),
          u.jsxs("div", {
            className:
              "mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm",
            children: [
              u.jsxs("span", {
                className:
                  "inline-flex items-center gap-1.5 font-semibold text-ink dark:text-surface",
                children: [
                  u.jsx(im, {
                    size: 16,
                    "aria-hidden": "true",
                    className:
                      y.current > 0
                        ? "text-orange-500 dark:text-orange-400"
                        : "text-ink-subtle dark:text-surface-muted",
                  }),
                  y.current > 0
                    ? n("headline.streak", { n: y.current })
                    : n("today.streakStart"),
                ],
              }),
              k.totalDays > 0 &&
                u.jsx("span", {
                  className:
                    "text-ink-muted dark:text-surface-muted tabular-nums",
                  children: n("today.monthInline", { pct: k.completionPct }),
                }),
            ],
          }),
          u.jsxs("div", {
            className: "mt-8 flex flex-col items-center gap-5",
            children: [
              u.jsx(_m, {}),
              u.jsxs("button", {
                onClick: Pt,
                className:
                  "flex flex-col items-center gap-1 text-xs font-medium uppercase tracking-wide text-ink-subtle hover:text-sprout-700 dark:text-surface-muted dark:hover:text-sprout-300",
                children: [
                  n("today.scrollTasks"),
                  u.jsx(Sa, {
                    size: 20,
                    "aria-hidden": "true",
                    className: "animate-bounce",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      u.jsxs("section", {
        id: "today-tasks",
        className:
          "mx-auto flex w-full max-w-xl flex-col gap-6 scroll-mt-28 px-4 py-10",
        children: [
          u.jsxs("div", {
            children: [
              u.jsx("h2", {
                className:
                  "mb-2 text-xs font-medium uppercase tracking-wide text-ink-subtle dark:text-surface-muted",
                children: n("today.thisWeek"),
              }),
              u.jsx("div", {
                className: "grid grid-cols-7 gap-1.5",
                children: C.map((M) => {
                  const ke = rt(e, M),
                    pe = M === l,
                    _t = parseInt(M.slice(8), 10),
                    N = E[new Date(M + "T00:00:00").getDay()];
                  return u.jsxs(
                    "div",
                    {
                      className: "flex flex-col items-center gap-1",
                      children: [
                        u.jsx("span", {
                          className:
                            "text-[10px] text-ink-subtle dark:text-surface-muted",
                          "aria-hidden": "true",
                          children: N,
                        }),
                        u.jsx("div", {
                          "aria-label": `${cs(M, r)} — ${n(ke === "complete" ? "status.done" : ke === "in-progress" ? "status.inProgress" : ke === "missed" ? "status.missed" : "day.empty")}`,
                          className: `flex aspect-square w-full items-center justify-center rounded-lg text-[11px] font-semibold tabular-nums transition-colors ${zm[ke]} ${pe ? "ring-2 ring-sprout-400 ring-offset-1 ring-offset-surface dark:ring-sprout-500 dark:ring-offset-surface-dark" : ""}`,
                          children: _t,
                        }),
                      ],
                    },
                    M,
                  );
                }),
              }),
            ],
          }),
          s.length === 0
            ? u.jsxs("div", {
                className:
                  "rounded-2xl border border-dashed border-sprout-200 py-10 text-center text-ink-subtle dark:border-sprout-900 dark:text-surface-muted",
                children: [
                  u.jsx("img", {
                    src: "/sprout-empty.png",
                    alt: "",
                    "aria-hidden": "true",
                    className: "mx-auto mb-3 h-20 w-20 object-contain",
                  }),
                  u.jsx("p", {
                    className: "text-sm",
                    children: n("today.empty"),
                  }),
                ],
              })
            : u.jsx("ul", {
                className: "flex flex-col gap-2",
                children: s.map((M) => {
                  const ke = e.tasks[M];
                  if (!ke) return null;
                  const pe = !!i.done[M],
                    _t = !c.has(M);
                  return u.jsxs(
                    "li",
                    {
                      className: "flex items-stretch gap-2",
                      children: [
                        u.jsxs("button", {
                          onClick: () => L(M),
                          "aria-pressed": pe,
                          "aria-label": n(pe ? "task.unmark" : "task.mark", {
                            title: ke.title,
                          }),
                          className: `flex flex-1 items-center gap-3 rounded-2xl border p-4 text-left transition-all
                      ${pe ? "border-sprout-200 bg-sprout-50 dark:border-sprout-800 dark:bg-sprout-950" : "border-gray-100 bg-surface hover:border-sprout-300 dark:border-gray-800 dark:bg-surface-dark-muted"}`,
                          children: [
                            u.jsx("span", {
                              className: `flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all
                        ${pe ? "border-sprout-500 bg-sprout-500" : "border-gray-300 dark:border-gray-600"}`,
                              "aria-hidden": "true",
                              children:
                                pe &&
                                u.jsx(Jc, {
                                  size: 14,
                                  className: "text-white animate-bloom",
                                }),
                            }),
                            u.jsx("span", {
                              className: `text-sm font-medium ${pe ? "text-ink-subtle line-through dark:text-surface-muted" : "text-ink dark:text-surface"}`,
                              children: ke.title,
                            }),
                          ],
                        }),
                        _t &&
                          u.jsx("button", {
                            onClick: () => ae(M),
                            "aria-label": n("today.removeAria", {
                              title: ke.title,
                            }),
                            className:
                              "flex min-h-[44px] w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-surface text-ink-subtle hover:border-red-300 hover:text-red-500 dark:border-gray-800 dark:bg-surface-dark-muted dark:text-surface-muted dark:hover:text-red-400",
                            children: u.jsx(ii, {
                              size: 16,
                              "aria-hidden": "true",
                            }),
                          }),
                      ],
                    },
                    M,
                  );
                }),
              }),
          u.jsxs("form", {
            onSubmit: Tt,
            className: "flex gap-2",
            children: [
              u.jsx("input", {
                value: m,
                onChange: (M) => g(M.target.value),
                placeholder: n("today.addPlaceholder"),
                "aria-label": n("today.newTaskAria"),
                className:
                  "flex-1 rounded-2xl border border-gray-200 bg-surface px-4 py-3 text-sm text-ink placeholder-ink-subtle transition-colors focus:border-sprout-400 dark:border-gray-700 dark:bg-surface-dark-muted dark:text-surface dark:placeholder-surface-muted",
              }),
              u.jsx("button", {
                type: "submit",
                "aria-label": n("task.addAria"),
                className:
                  "min-h-[44px] min-w-[44px] rounded-2xl bg-sprout-600 px-4 py-3 text-white transition-colors hover:bg-sprout-700",
                children: u.jsx(Ol, { size: 18, "aria-hidden": "true" }),
              }),
            ],
          }),
          u.jsxs("button", {
            onClick: () => w((M) => !M),
            "aria-expanded": h,
            "aria-controls": "monthly-recurring-tasks",
            className: `inline-flex min-h-[44px] items-center justify-center gap-2 self-center rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-all
            ${h ? "border-sprout-300 bg-sprout-50 text-sprout-700 dark:border-sprout-800 dark:bg-sprout-950 dark:text-sprout-300" : "border-sprout-100 bg-surface-muted text-sprout-700 hover:border-sprout-300 hover:bg-sprout-50 dark:border-sprout-900 dark:bg-surface-dark-muted dark:text-sprout-300 dark:hover:bg-sprout-950"}`,
            children: [
              u.jsx(fm, { size: 16, "aria-hidden": "true" }),
              u.jsx("span", {
                children: n(h ? "today.hideRecurring" : "today.showRecurring"),
              }),
              u.jsx(Sa, {
                size: 16,
                "aria-hidden": "true",
                className: `transition-transform duration-300 ease-in-out ${h ? "rotate-180" : ""}`,
              }),
            ],
          }),
          h &&
            u.jsx("div", {
              id: "monthly-recurring-tasks",
              className: "view-enter",
              children: u.jsx(Em, { state: e, setState: t }),
            }),
        ],
      }),
    ],
  });
}
function Rm({ date: e, state: t, setState: n, onClose: r }) {
  const { t: l, locale: o } = Pe(),
    s = mr(t, e),
    i = ot(t, e),
    a = rt(t, e),
    c = Ve(),
    m = e > c,
    [g, h] = P.useState(""),
    w = P.useRef(null),
    x = P.useRef(null),
    S = `day-editor-title-${e}`;
  (P.useEffect(() => {
    var E;
    const k = document.activeElement;
    return (
      (E = x.current) == null || E.focus(),
      () => {
        k == null || k.focus();
      }
    );
  }, []),
    P.useEffect(() => {
      function k(E) {
        if (E.key === "Escape") {
          r();
          return;
        }
        if (E.key !== "Tab") return;
        const C = w.current;
        if (!C) return;
        const T = Array.from(
          C.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])'),
        ).filter((ae) => !ae.hasAttribute("disabled"));
        if (T.length === 0) return;
        const O = T[0],
          L = T[T.length - 1];
        E.shiftKey
          ? document.activeElement === O && (E.preventDefault(), L.focus())
          : document.activeElement === L && (E.preventDefault(), O.focus());
      }
      return (
        document.addEventListener("keydown", k),
        () => document.removeEventListener("keydown", k)
      );
    }, [r]));
  function R(k) {
    n(Qc(t, e, k, !i.done[k]));
  }
  function f(k) {
    if ((k.preventDefault(), !g.trim())) return;
    const [E, C] = si(t, g.trim());
    (n(Wc(E, e, C)), h(""));
  }
  const d = qc[a],
    p =
      a === "complete"
        ? "/sprout-success.png"
        : a === "missed"
          ? "/sprout-fail.png"
          : a === "in-progress"
            ? "/sprout-progress.png"
            : m
              ? "/sprout-neutral.png"
              : "/sprout-empty.png",
    y =
      a === "complete"
        ? l("status.done")
        : a === "in-progress"
          ? l("status.inProgress")
          : a === "missed"
            ? l("status.missed")
            : "";
  return u.jsx("div", {
    className:
      "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm",
    onClick: r,
    "aria-hidden": "true",
    children: u.jsxs("div", {
      ref: w,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": S,
      className:
        "w-full max-w-md bg-surface dark:bg-surface-dark-muted rounded-3xl shadow-2xl p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto",
      onClick: (k) => k.stopPropagation(),
      "aria-hidden": "false",
      children: [
        u.jsxs("div", {
          className: "flex items-center justify-between gap-3",
          children: [
            u.jsxs("div", {
              className: "flex items-center gap-3 min-w-0",
              children: [
                u.jsx("img", {
                  src: p,
                  alt: "",
                  "aria-hidden": "true",
                  className: "h-12 w-12 flex-shrink-0 object-contain",
                }),
                u.jsxs("div", {
                  className: "min-w-0",
                  children: [
                    u.jsx("p", {
                      className:
                        "text-xs text-ink-subtle dark:text-surface-muted uppercase tracking-wide",
                      children: m
                        ? l("day.planning")
                        : e < c
                          ? l("day.past")
                          : l("day.today"),
                    }),
                    u.jsx("h2", {
                      id: S,
                      className:
                        "text-lg font-bold font-sans text-ink dark:text-surface",
                      children: cs(e, o),
                    }),
                  ],
                }),
              ],
            }),
            u.jsxs("div", {
              className: "flex items-center gap-2",
              children: [
                y &&
                  u.jsx("div", {
                    className: `px-3 py-1 rounded-full text-xs font-semibold ${d.badge}`,
                    children: y,
                  }),
                u.jsx("button", {
                  ref: x,
                  onClick: r,
                  "aria-label": l("common.close"),
                  className:
                    "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-ink-subtle hover:text-ink dark:hover:text-surface transition-colors",
                  children: u.jsx(ii, { size: 18, "aria-hidden": "true" }),
                }),
              ],
            }),
          ],
        }),
        u.jsxs("div", {
          className: "flex flex-col gap-2",
          children: [
            s.length === 0 &&
              u.jsx("p", {
                className:
                  "text-sm text-ink-subtle dark:text-surface-muted py-4 text-center",
                children: l("day.empty"),
              }),
            s.map((k) => {
              const E = t.tasks[k];
              if (!E) return null;
              const C = !!i.done[k];
              return u.jsxs(
                "button",
                {
                  onClick: () => R(k),
                  "aria-pressed": C,
                  "aria-label": l(C ? "task.unmark" : "task.mark", {
                    title: E.title,
                  }),
                  className: `flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                  ${C ? "bg-sprout-50 dark:bg-sprout-950 border-sprout-200 dark:border-sprout-800" : "bg-surface dark:bg-surface-dark border-gray-100 dark:border-gray-700 hover:border-sprout-200"}`,
                  children: [
                    u.jsx("div", {
                      className: `w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${C ? "bg-sprout-500 border-sprout-500" : "border-gray-300 dark:border-gray-600"}`,
                      "aria-hidden": "true",
                      children:
                        C && u.jsx(Jc, { size: 12, className: "text-white" }),
                    }),
                    u.jsx("span", {
                      className: `text-sm ${C ? "line-through text-ink-subtle dark:text-surface-muted" : "text-ink dark:text-surface"}`,
                      children: E.title,
                    }),
                  ],
                },
                k,
              );
            }),
          ],
        }),
        u.jsxs("form", {
          onSubmit: f,
          className: "flex gap-2",
          children: [
            u.jsx("input", {
              value: g,
              onChange: (k) => h(k.target.value),
              placeholder: l("day.addPlaceholder"),
              "aria-label": l("day.newTaskAria"),
              className:
                "flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-muted dark:bg-surface-dark text-sm text-ink dark:text-surface placeholder-ink-subtle dark:placeholder-surface-muted focus:border-sprout-400 transition-colors",
            }),
            u.jsx("button", {
              type: "submit",
              "aria-label": l("task.addAria"),
              className:
                "min-w-[44px] min-h-[44px] px-3 py-2 bg-sprout-600 hover:bg-sprout-700 text-white rounded-xl transition-colors",
              children: u.jsx(Ol, { size: 16, "aria-hidden": "true" }),
            }),
          ],
        }),
      ],
    }),
  });
}
function Im({ status: e, date: t, today: n }) {
  const r = t === n,
    l =
      "w-full aspect-square rounded-xl flex items-center justify-center text-xs font-semibold transition-all",
    o = qc[e],
    s =
      r && e === "neutral" ? "ring-2 ring-sprout-300 dark:ring-sprout-600" : "";
  return e === "complete"
    ? u.jsx("div", {
        className: `${l} ${o.stamp} ${r ? "ring-2 ring-sprout-300" : ""}`,
        "aria-hidden": "true",
        children: "✓",
      })
    : e === "missed"
      ? u.jsx("div", {
          className: `${l} ${o.stamp} ${r ? "ring-2 ring-red-300" : ""}`,
          "aria-hidden": "true",
          children: "✕",
        })
      : e === "in-progress"
        ? u.jsx("div", {
            className: `${l} ${o.stamp} ring-2 ring-amber-300`,
            "aria-hidden": "true",
            children: "…",
          })
        : u.jsx("div", { className: `${l} ${s}`, "aria-hidden": "true" });
}
function $m({ state: e, setState: t }) {
  const { t: n, locale: r } = Pe(),
    [l, o] = P.useState(ui()),
    [s, i] = P.useState(null),
    a = Ve(),
    c = ai(l),
    m = Al(r, "short"),
    g = {
      complete: n("cal.complete"),
      missed: n("cal.missed"),
      "in-progress": n("cal.inProgress"),
      neutral: "",
    };
  return u.jsxs("div", {
    className: "flex flex-col gap-4 p-4 max-w-xl mx-auto w-full",
    children: [
      u.jsxs("div", {
        className: "flex items-center justify-between",
        children: [
          u.jsx("button", {
            onClick: () => o(vm(l)),
            "aria-label": n("cal.prev"),
            className:
              "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-sprout-50 dark:hover:bg-sprout-950 text-ink-muted dark:text-surface-muted transition-colors",
            children: u.jsx(om, { size: 20, "aria-hidden": "true" }),
          }),
          u.jsx("h2", {
            className: "text-lg font-bold font-sans text-ink dark:text-surface",
            children: Ea(l, r),
          }),
          u.jsx("button", {
            onClick: () => o(xm(l)),
            "aria-label": n("cal.next"),
            className:
              "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-sprout-50 dark:hover:bg-sprout-950 text-ink-muted dark:text-surface-muted transition-colors",
            children: u.jsx(sm, { size: 20, "aria-hidden": "true" }),
          }),
        ],
      }),
      u.jsx("div", {
        className: "grid grid-cols-7 gap-1",
        "aria-hidden": "true",
        children: m.map((h, w) =>
          u.jsx(
            "div",
            {
              className:
                "text-center text-xs text-ink-subtle dark:text-surface-muted font-medium py-1",
              children: h,
            },
            w,
          ),
        ),
      }),
      u.jsx("div", {
        className: "flex flex-col gap-1",
        role: "grid",
        "aria-label": Ea(l, r),
        children: c.map((h, w) =>
          u.jsx(
            "div",
            {
              className: "grid grid-cols-7 gap-1",
              role: "row",
              children: h.map((x, S) => {
                if (!x)
                  return u.jsx(
                    "div",
                    { role: "gridcell", "aria-hidden": "true" },
                    S,
                  );
                const R = rt(e, x),
                  f = parseInt(x.slice(8)),
                  d = g[R] ? `, ${g[R]}` : "";
                return u.jsx(
                  "div",
                  {
                    role: "gridcell",
                    children: u.jsxs("button", {
                      onClick: () => i(x),
                      "aria-label": `${x === a ? n("day.today") + ", " : ""}${x}${d}`,
                      className:
                        "w-full flex flex-col items-center gap-1 p-1 rounded-xl hover:bg-sprout-50 dark:hover:bg-sprout-950 transition-colors",
                      children: [
                        u.jsx("span", {
                          className: `text-xs font-medium ${x === a ? "text-sprout-600 dark:text-sprout-400 font-bold" : "text-ink-muted dark:text-surface-muted"}`,
                          "aria-hidden": "true",
                          children: f,
                        }),
                        u.jsx(Im, { status: R, date: x, today: a }),
                      ],
                    }),
                  },
                  x,
                );
              }),
            },
            w,
          ),
        ),
      }),
      u.jsxs("div", {
        className:
          "flex items-center gap-4 justify-center pt-2 text-xs text-ink-subtle dark:text-surface-muted",
        "aria-hidden": "true",
        children: [
          u.jsxs("span", {
            className: "flex items-center gap-1",
            children: [
              u.jsx("span", {
                className: "w-3 h-3 rounded bg-sprout-500 inline-block",
              }),
              " ",
              n("cal.complete"),
            ],
          }),
          u.jsxs("span", {
            className: "flex items-center gap-1",
            children: [
              u.jsx("span", {
                className:
                  "w-3 h-3 rounded bg-red-100 dark:bg-red-950 inline-block",
              }),
              " ",
              n("cal.missed"),
            ],
          }),
          u.jsxs("span", {
            className: "flex items-center gap-1",
            children: [
              u.jsx("span", {
                className:
                  "w-3 h-3 rounded bg-amber-100 dark:bg-amber-950 inline-block",
              }),
              " ",
              n("cal.inProgress"),
            ],
          }),
        ],
      }),
      s &&
        u.jsx(Rm, { date: s, state: e, setState: t, onClose: () => i(null) }),
    ],
  });
}
function Om(e, t) {
  if (e.match(/^[a-z]+:\/\//i)) return e;
  if (e.match(/^\/\//)) return window.location.protocol + e;
  if (e.match(/^[a-z]+:/i)) return e;
  const n = document.implementation.createHTMLDocument(),
    r = n.createElement("base"),
    l = n.createElement("a");
  return (
    n.head.appendChild(r),
    n.body.appendChild(l),
    t && (r.href = t),
    (l.href = e),
    l.href
  );
}
const Am = (() => {
  let e = 0;
  const t = () =>
    `0000${((Math.random() * 36 ** 4) << 0).toString(36)}`.slice(-4);
  return () => ((e += 1), `u${t()}${e}`);
})();
function wt(e) {
  const t = [];
  for (let n = 0, r = e.length; n < r; n++) t.push(e[n]);
  return t;
}
let Kt = null;
function td(e = {}) {
  return (
    Kt ||
    (e.includeStyleProperties
      ? ((Kt = e.includeStyleProperties), Kt)
      : ((Kt = wt(window.getComputedStyle(document.documentElement))), Kt))
  );
}
function xl(e, t) {
  const r = (e.ownerDocument.defaultView || window)
    .getComputedStyle(e)
    .getPropertyValue(t);
  return r ? parseFloat(r.replace("px", "")) : 0;
}
function Fm(e) {
  const t = xl(e, "border-left-width"),
    n = xl(e, "border-right-width");
  return e.clientWidth + t + n;
}
function Um(e) {
  const t = xl(e, "border-top-width"),
    n = xl(e, "border-bottom-width");
  return e.clientHeight + t + n;
}
function nd(e, t = {}) {
  const n = t.width || Fm(e),
    r = t.height || Um(e);
  return { width: n, height: r };
}
function bm() {
  let e, t;
  try {
    t = process;
  } catch {}
  const n = t && t.env ? t.env.devicePixelRatio : null;
  return (
    n && ((e = parseInt(n, 10)), Number.isNaN(e) && (e = 1)),
    e || window.devicePixelRatio || 1
  );
}
const we = 16384;
function Vm(e) {
  (e.width > we || e.height > we) &&
    (e.width > we && e.height > we
      ? e.width > e.height
        ? ((e.height *= we / e.width), (e.width = we))
        : ((e.width *= we / e.height), (e.height = we))
      : e.width > we
        ? ((e.height *= we / e.width), (e.width = we))
        : ((e.width *= we / e.height), (e.height = we)));
}
function kl(e) {
  return new Promise((t, n) => {
    const r = new Image();
    ((r.onload = () => {
      r.decode().then(() => {
        requestAnimationFrame(() => t(r));
      });
    }),
      (r.onerror = n),
      (r.crossOrigin = "anonymous"),
      (r.decoding = "async"),
      (r.src = e));
  });
}
async function Hm(e) {
  return Promise.resolve()
    .then(() => new XMLSerializer().serializeToString(e))
    .then(encodeURIComponent)
    .then((t) => `data:image/svg+xml;charset=utf-8,${t}`);
}
async function Bm(e, t, n) {
  const r = "http://www.w3.org/2000/svg",
    l = document.createElementNS(r, "svg"),
    o = document.createElementNS(r, "foreignObject");
  return (
    l.setAttribute("width", `${t}`),
    l.setAttribute("height", `${n}`),
    l.setAttribute("viewBox", `0 0 ${t} ${n}`),
    o.setAttribute("width", "100%"),
    o.setAttribute("height", "100%"),
    o.setAttribute("x", "0"),
    o.setAttribute("y", "0"),
    o.setAttribute("externalResourcesRequired", "true"),
    l.appendChild(o),
    o.appendChild(e),
    Hm(l)
  );
}
const xe = (e, t) => {
  if (e instanceof t) return !0;
  const n = Object.getPrototypeOf(e);
  return n === null ? !1 : n.constructor.name === t.name || xe(n, t);
};
function Wm(e) {
  const t = e.getPropertyValue("content");
  return `${e.cssText} content: '${t.replace(/'|"/g, "")}';`;
}
function Qm(e, t) {
  return td(t)
    .map((n) => {
      const r = e.getPropertyValue(n),
        l = e.getPropertyPriority(n);
      return `${n}: ${r}${l ? " !important" : ""};`;
    })
    .join(" ");
}
function Km(e, t, n, r) {
  const l = `.${e}:${t}`,
    o = n.cssText ? Wm(n) : Qm(n, r);
  return document.createTextNode(`${l}{${o}}`);
}
function Na(e, t, n, r) {
  const l = window.getComputedStyle(e, n),
    o = l.getPropertyValue("content");
  if (o === "" || o === "none") return;
  const s = Am();
  try {
    t.className = `${t.className} ${s}`;
  } catch {
    return;
  }
  const i = document.createElement("style");
  (i.appendChild(Km(s, n, l, r)), t.appendChild(i));
}
function Ym(e, t, n) {
  (Na(e, t, ":before", n), Na(e, t, ":after", n));
}
const ja = "application/font-woff",
  Ta = "image/jpeg",
  Gm = {
    woff: ja,
    woff2: ja,
    ttf: "application/font-truetype",
    eot: "application/vnd.ms-fontobject",
    png: "image/png",
    jpg: Ta,
    jpeg: Ta,
    gif: "image/gif",
    tiff: "image/tiff",
    svg: "image/svg+xml",
    webp: "image/webp",
  };
function Xm(e) {
  const t = /\.([^./]*?)$/g.exec(e);
  return t ? t[1] : "";
}
function di(e) {
  const t = Xm(e).toLowerCase();
  return Gm[t] || "";
}
function Zm(e) {
  return e.split(/,/)[1];
}
function ds(e) {
  return e.search(/^(data:)/) !== -1;
}
function Jm(e, t) {
  return `data:${t};base64,${e}`;
}
async function rd(e, t, n) {
  const r = await fetch(e, t);
  if (r.status === 404) throw new Error(`Resource "${r.url}" not found`);
  const l = await r.blob();
  return new Promise((o, s) => {
    const i = new FileReader();
    ((i.onerror = s),
      (i.onloadend = () => {
        try {
          o(n({ res: r, result: i.result }));
        } catch (a) {
          s(a);
        }
      }),
      i.readAsDataURL(l));
  });
}
const go = {};
function qm(e, t, n) {
  let r = e.replace(/\?.*/, "");
  return (
    n && (r = e),
    /ttf|otf|eot|woff2?/i.test(r) && (r = r.replace(/.*\//, "")),
    t ? `[${t}]${r}` : r
  );
}
async function fi(e, t, n) {
  const r = qm(e, t, n.includeQueryParams);
  if (go[r] != null) return go[r];
  n.cacheBust && (e += (/\?/.test(e) ? "&" : "?") + new Date().getTime());
  let l;
  try {
    const o = await rd(
      e,
      n.fetchRequestInit,
      ({ res: s, result: i }) => (
        t || (t = s.headers.get("Content-Type") || ""),
        Zm(i)
      ),
    );
    l = Jm(o, t);
  } catch (o) {
    l = n.imagePlaceholder || "";
    let s = `Failed to fetch resource: ${e}`;
    (o && (s = typeof o == "string" ? o : o.message), s && console.warn(s));
  }
  return ((go[r] = l), l);
}
async function eh(e) {
  const t = e.toDataURL();
  return t === "data:," ? e.cloneNode(!1) : kl(t);
}
async function th(e, t) {
  if (e.currentSrc) {
    const o = document.createElement("canvas"),
      s = o.getContext("2d");
    ((o.width = e.clientWidth),
      (o.height = e.clientHeight),
      s == null || s.drawImage(e, 0, 0, o.width, o.height));
    const i = o.toDataURL();
    return kl(i);
  }
  const n = e.poster,
    r = di(n),
    l = await fi(n, r, t);
  return kl(l);
}
async function nh(e, t) {
  var n;
  try {
    if (
      !(
        (n = e == null ? void 0 : e.contentDocument) === null || n === void 0
      ) &&
      n.body
    )
      return await Fl(e.contentDocument.body, t, !0);
  } catch {}
  return e.cloneNode(!1);
}
async function rh(e, t) {
  return xe(e, HTMLCanvasElement)
    ? eh(e)
    : xe(e, HTMLVideoElement)
      ? th(e, t)
      : xe(e, HTMLIFrameElement)
        ? nh(e, t)
        : e.cloneNode(ld(e));
}
const lh = (e) => e.tagName != null && e.tagName.toUpperCase() === "SLOT",
  ld = (e) => e.tagName != null && e.tagName.toUpperCase() === "SVG";
async function oh(e, t, n) {
  var r, l;
  if (ld(t)) return t;
  let o = [];
  return (
    lh(e) && e.assignedNodes
      ? (o = wt(e.assignedNodes()))
      : xe(e, HTMLIFrameElement) &&
          !((r = e.contentDocument) === null || r === void 0) &&
          r.body
        ? (o = wt(e.contentDocument.body.childNodes))
        : (o = wt(
            ((l = e.shadowRoot) !== null && l !== void 0 ? l : e).childNodes,
          )),
    o.length === 0 ||
      xe(e, HTMLVideoElement) ||
      (await o.reduce(
        (s, i) =>
          s
            .then(() => Fl(i, n))
            .then((a) => {
              a && t.appendChild(a);
            }),
        Promise.resolve(),
      )),
    t
  );
}
function sh(e, t, n) {
  const r = t.style;
  if (!r) return;
  const l = window.getComputedStyle(e);
  l.cssText
    ? ((r.cssText = l.cssText), (r.transformOrigin = l.transformOrigin))
    : td(n).forEach((o) => {
        let s = l.getPropertyValue(o);
        (o === "font-size" &&
          s.endsWith("px") &&
          (s = `${Math.floor(parseFloat(s.substring(0, s.length - 2))) - 0.1}px`),
          xe(e, HTMLIFrameElement) &&
            o === "display" &&
            s === "inline" &&
            (s = "block"),
          o === "d" &&
            t.getAttribute("d") &&
            (s = `path(${t.getAttribute("d")})`),
          r.setProperty(o, s, l.getPropertyPriority(o)));
      });
}
function ih(e, t) {
  (xe(e, HTMLTextAreaElement) && (t.innerHTML = e.value),
    xe(e, HTMLInputElement) && t.setAttribute("value", e.value));
}
function ah(e, t) {
  if (xe(e, HTMLSelectElement)) {
    const n = t,
      r = Array.from(n.children).find(
        (l) => e.value === l.getAttribute("value"),
      );
    r && r.setAttribute("selected", "");
  }
}
function uh(e, t, n) {
  return (xe(t, Element) && (sh(e, t, n), Ym(e, t, n), ih(e, t), ah(e, t)), t);
}
async function ch(e, t) {
  const n = e.querySelectorAll ? e.querySelectorAll("use") : [];
  if (n.length === 0) return e;
  const r = {};
  for (let o = 0; o < n.length; o++) {
    const i = n[o].getAttribute("xlink:href");
    if (i) {
      const a = e.querySelector(i),
        c = document.querySelector(i);
      !a && c && !r[i] && (r[i] = await Fl(c, t, !0));
    }
  }
  const l = Object.values(r);
  if (l.length) {
    const o = "http://www.w3.org/1999/xhtml",
      s = document.createElementNS(o, "svg");
    (s.setAttribute("xmlns", o),
      (s.style.position = "absolute"),
      (s.style.width = "0"),
      (s.style.height = "0"),
      (s.style.overflow = "hidden"),
      (s.style.display = "none"));
    const i = document.createElementNS(o, "defs");
    s.appendChild(i);
    for (let a = 0; a < l.length; a++) i.appendChild(l[a]);
    e.appendChild(s);
  }
  return e;
}
async function Fl(e, t, n) {
  return !n && t.filter && !t.filter(e)
    ? null
    : Promise.resolve(e)
        .then((r) => rh(r, t))
        .then((r) => oh(e, r, t))
        .then((r) => uh(e, r, t))
        .then((r) => ch(r, t));
}
const od = /url\((['"]?)([^'"]+?)\1\)/g,
  dh = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,
  fh = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function ph(e) {
  const t = e.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${t})(['"]?\\))`, "g");
}
function mh(e) {
  const t = [];
  return (e.replace(od, (n, r, l) => (t.push(l), n)), t.filter((n) => !ds(n)));
}
async function hh(e, t, n, r, l) {
  try {
    const o = n ? Om(t, n) : t,
      s = di(t);
    let i;
    return (l || (i = await fi(o, s, r)), e.replace(ph(t), `$1${i}$3`));
  } catch {}
  return e;
}
function gh(e, { preferredFontFormat: t }) {
  return t
    ? e.replace(fh, (n) => {
        for (;;) {
          const [r, , l] = dh.exec(n) || [];
          if (!l) return "";
          if (l === t) return `src: ${r};`;
        }
      })
    : e;
}
function sd(e) {
  return e.search(od) !== -1;
}
async function id(e, t, n) {
  if (!sd(e)) return e;
  const r = gh(e, n);
  return mh(r).reduce(
    (o, s) => o.then((i) => hh(i, s, t, n)),
    Promise.resolve(r),
  );
}
async function Yt(e, t, n) {
  var r;
  const l =
    (r = t.style) === null || r === void 0 ? void 0 : r.getPropertyValue(e);
  if (l) {
    const o = await id(l, null, n);
    return (t.style.setProperty(e, o, t.style.getPropertyPriority(e)), !0);
  }
  return !1;
}
async function yh(e, t) {
  ((await Yt("background", e, t)) || (await Yt("background-image", e, t)),
    (await Yt("mask", e, t)) ||
      (await Yt("-webkit-mask", e, t)) ||
      (await Yt("mask-image", e, t)) ||
      (await Yt("-webkit-mask-image", e, t)));
}
async function vh(e, t) {
  const n = xe(e, HTMLImageElement);
  if (!(n && !ds(e.src)) && !(xe(e, SVGImageElement) && !ds(e.href.baseVal)))
    return;
  const r = n ? e.src : e.href.baseVal,
    l = await fi(r, di(r), t);
  await new Promise((o, s) => {
    ((e.onload = o),
      (e.onerror = t.onImageErrorHandler
        ? (...a) => {
            try {
              o(t.onImageErrorHandler(...a));
            } catch (c) {
              s(c);
            }
          }
        : s));
    const i = e;
    (i.decode && (i.decode = o),
      i.loading === "lazy" && (i.loading = "eager"),
      n ? ((e.srcset = ""), (e.src = l)) : (e.href.baseVal = l));
  });
}
async function xh(e, t) {
  const r = wt(e.childNodes).map((l) => ad(l, t));
  await Promise.all(r).then(() => e);
}
async function ad(e, t) {
  xe(e, Element) && (await yh(e, t), await vh(e, t), await xh(e, t));
}
function kh(e, t) {
  const { style: n } = e;
  (t.backgroundColor && (n.backgroundColor = t.backgroundColor),
    t.width && (n.width = `${t.width}px`),
    t.height && (n.height = `${t.height}px`));
  const r = t.style;
  return (
    r != null &&
      Object.keys(r).forEach((l) => {
        n[l] = r[l];
      }),
    e
  );
}
const Pa = {};
async function _a(e) {
  let t = Pa[e];
  if (t != null) return t;
  const r = await (await fetch(e)).text();
  return ((t = { url: e, cssText: r }), (Pa[e] = t), t);
}
async function La(e, t) {
  let n = e.cssText;
  const r = /url\(["']?([^"')]+)["']?\)/g,
    o = (n.match(/url\([^)]+\)/g) || []).map(async (s) => {
      let i = s.replace(r, "$1");
      return (
        i.startsWith("https://") || (i = new URL(i, e.url).href),
        rd(
          i,
          t.fetchRequestInit,
          ({ result: a }) => ((n = n.replace(s, `url(${a})`)), [s, a]),
        )
      );
    });
  return Promise.all(o).then(() => n);
}
function za(e) {
  if (e == null) return [];
  const t = [],
    n = /(\/\*[\s\S]*?\*\/)/gi;
  let r = e.replace(n, "");
  const l = new RegExp(
    "((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})",
    "gi",
  );
  for (;;) {
    const a = l.exec(r);
    if (a === null) break;
    t.push(a[0]);
  }
  r = r.replace(l, "");
  const o = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,
    s =
      "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",
    i = new RegExp(s, "gi");
  for (;;) {
    let a = o.exec(r);
    if (a === null) {
      if (((a = i.exec(r)), a === null)) break;
      o.lastIndex = i.lastIndex;
    } else i.lastIndex = o.lastIndex;
    t.push(a[0]);
  }
  return t;
}
async function wh(e, t) {
  const n = [],
    r = [];
  return (
    e.forEach((l) => {
      if ("cssRules" in l)
        try {
          wt(l.cssRules || []).forEach((o, s) => {
            if (o.type === CSSRule.IMPORT_RULE) {
              let i = s + 1;
              const a = o.href,
                c = _a(a)
                  .then((m) => La(m, t))
                  .then((m) =>
                    za(m).forEach((g) => {
                      try {
                        l.insertRule(
                          g,
                          g.startsWith("@import")
                            ? (i += 1)
                            : l.cssRules.length,
                        );
                      } catch (h) {
                        console.error("Error inserting rule from remote css", {
                          rule: g,
                          error: h,
                        });
                      }
                    }),
                  )
                  .catch((m) => {
                    console.error("Error loading remote css", m.toString());
                  });
              r.push(c);
            }
          });
        } catch (o) {
          const s = e.find((i) => i.href == null) || document.styleSheets[0];
          (l.href != null &&
            r.push(
              _a(l.href)
                .then((i) => La(i, t))
                .then((i) =>
                  za(i).forEach((a) => {
                    s.insertRule(a, s.cssRules.length);
                  }),
                )
                .catch((i) => {
                  console.error("Error loading remote stylesheet", i);
                }),
            ),
            console.error("Error inlining remote css file", o));
        }
    }),
    Promise.all(r).then(
      () => (
        e.forEach((l) => {
          if ("cssRules" in l)
            try {
              wt(l.cssRules || []).forEach((o) => {
                n.push(o);
              });
            } catch (o) {
              console.error(`Error while reading CSS rules from ${l.href}`, o);
            }
        }),
        n
      ),
    )
  );
}
function Sh(e) {
  return e
    .filter((t) => t.type === CSSRule.FONT_FACE_RULE)
    .filter((t) => sd(t.style.getPropertyValue("src")));
}
async function Eh(e, t) {
  if (e.ownerDocument == null)
    throw new Error("Provided element is not within a Document");
  const n = wt(e.ownerDocument.styleSheets),
    r = await wh(n, t);
  return Sh(r);
}
function ud(e) {
  return e.trim().replace(/["']/g, "");
}
function Ch(e) {
  const t = new Set();
  function n(r) {
    ((r.style.fontFamily || getComputedStyle(r).fontFamily)
      .split(",")
      .forEach((o) => {
        t.add(ud(o));
      }),
      Array.from(r.children).forEach((o) => {
        o instanceof HTMLElement && n(o);
      }));
  }
  return (n(e), t);
}
async function Nh(e, t) {
  const n = await Eh(e, t),
    r = Ch(e);
  return (
    await Promise.all(
      n
        .filter((o) => r.has(ud(o.style.fontFamily)))
        .map((o) => {
          const s = o.parentStyleSheet ? o.parentStyleSheet.href : null;
          return id(o.cssText, s, t);
        }),
    )
  ).join(`
`);
}
async function jh(e, t) {
  const n =
    t.fontEmbedCSS != null
      ? t.fontEmbedCSS
      : t.skipFonts
        ? null
        : await Nh(e, t);
  if (n) {
    const r = document.createElement("style"),
      l = document.createTextNode(n);
    (r.appendChild(l),
      e.firstChild ? e.insertBefore(r, e.firstChild) : e.appendChild(r));
  }
}
async function Th(e, t = {}) {
  const { width: n, height: r } = nd(e, t),
    l = await Fl(e, t, !0);
  return (await jh(l, t), await ad(l, t), kh(l, t), await Bm(l, n, r));
}
async function Ph(e, t = {}) {
  const { width: n, height: r } = nd(e, t),
    l = await Th(e, t),
    o = await kl(l),
    s = document.createElement("canvas"),
    i = s.getContext("2d"),
    a = t.pixelRatio || bm(),
    c = t.canvasWidth || n,
    m = t.canvasHeight || r;
  return (
    (s.width = c * a),
    (s.height = m * a),
    t.skipAutoScale || Vm(s),
    (s.style.width = `${c}`),
    (s.style.height = `${m}`),
    t.backgroundColor &&
      ((i.fillStyle = t.backgroundColor), i.fillRect(0, 0, s.width, s.height)),
    i.drawImage(o, 0, 0, s.width, s.height),
    s
  );
}
async function _h(e, t = {}) {
  return (await Ph(e, t)).toDataURL();
}
const Lh = { "9:16": { w: 1080, h: 1920 }, "16:9": { w: 1920, h: 1080 } };
async function zh(e, t) {
  const { w: n, h: r } = Lh[t],
    o =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-body")
        .trim() || "Roboto, ui-sans-serif, system-ui, sans-serif",
    s = document.documentElement.lang || "en-US",
    i = document.createElement("div");
  i.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: ${n}px;
    height: ${r}px;
    background: #f0fdf4;
    overflow: hidden;
    font-family: ${o};
    padding: 60px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 24px;
  `;
  const a = document.createElement("div");
  ((a.style.cssText =
    "display:flex;align-items:center;gap:12px;margin-bottom:8px;"),
    (a.innerHTML = `
    <img src="/sprout-logo.png" alt="" style="width:${t === "9:16" ? 64 : 56}px;height:${t === "9:16" ? 64 : 56}px;object-fit:contain;" />
    <div>
      <div style="font-size:${t === "9:16" ? 40 : 32}px;font-weight:700;color:#15803d;">Sprout Planner</div>
      <div style="font-size:${t === "9:16" ? 24 : 20}px;color:#4b5563;">${new Date().toLocaleDateString(s, { month: "long", year: "numeric" })}</div>
    </div>
  `),
    i.appendChild(a));
  const c = e.cloneNode(!0);
  ((c.style.cssText = `
    flex: 1;
    overflow: hidden;
    transform-origin: top left;
    border-radius: 24px;
    background: white;
    font-family: ${o};
    padding: 40px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  `),
    c.querySelectorAll("[data-export-hide]").forEach((g) => g.remove()),
    i.appendChild(c));
  const m = document.createElement("div");
  ((m.style.cssText =
    "font-size:20px;color:#6b7280;text-align:center;padding-top:8px;"),
    (m.textContent = `sprout-planner · ${new Date().toISOString().slice(0, 10)}`),
    i.appendChild(m),
    document.body.appendChild(i));
  try {
    const g = await _h(i, {
        width: n,
        height: r,
        pixelRatio: 1,
        cacheBust: !0,
      }),
      h = document.createElement("a");
    ((h.href = g),
      (h.download = `sprout-dashboard-${new Date().toISOString().slice(0, 10)}-${t.replace(":", "x")}.png`),
      h.click());
  } finally {
    document.body.removeChild(i);
  }
}
function Dh(e) {
  const t = Ve();
  return e.date > t || e.status === "neutral"
    ? "bg-gray-100 dark:bg-gray-800"
    : e.status === "missed"
      ? "bg-red-200 dark:bg-red-900"
      : e.ratio === 0
        ? "bg-gray-100 dark:bg-gray-800"
        : e.ratio < 0.34
          ? "bg-sprout-200 dark:bg-sprout-900"
          : e.ratio < 0.67
            ? "bg-sprout-400 dark:bg-sprout-700"
            : e.ratio < 1
              ? "bg-sprout-500 dark:bg-sprout-600"
              : "bg-sprout-600 dark:bg-sprout-500";
}
function Mh({ cells: e }) {
  const { t, locale: n } = Pe(),
    r = Al(n, "narrow"),
    l = [];
  for (let s = 0; s < e.length; s += 7) l.push(e.slice(s, s + 7));
  const o = [];
  return (
    l.forEach((s, i) => {
      const a = s.find((c) => c.date.slice(8) === "01");
      a &&
        o.push({
          col: i,
          label: new Date(a.date + "T00:00:00").toLocaleDateString(n, {
            month: "short",
          }),
        });
    }),
    u.jsxs("div", {
      className:
        "bg-surface dark:bg-surface-dark-muted rounded-2xl p-4 border border-sprout-100 dark:border-sprout-950",
      "aria-label": t("dash.activity"),
      children: [
        u.jsx("h3", {
          className:
            "text-xs text-ink-subtle dark:text-surface-muted uppercase tracking-wide font-medium mb-3",
          children: t("dash.activity"),
        }),
        u.jsxs("div", {
          className: "relative",
          style: { paddingLeft: "28px" },
          children: [
            u.jsx("div", {
              className:
                "flex gap-[3px] mb-1 text-xs text-ink-subtle dark:text-surface-muted",
              style: { height: "14px" },
              "aria-hidden": "true",
              children: l.map((s, i) => {
                const a = o.find((c) => c.col === i);
                return u.jsx(
                  "div",
                  {
                    style: { width: "12px", flexShrink: 0 },
                    children:
                      a &&
                      u.jsx("span", {
                        className: "text-[10px]",
                        children: a.label,
                      }),
                  },
                  i,
                );
              }),
            }),
            u.jsxs("div", {
              className: "flex gap-1",
              "aria-hidden": "true",
              children: [
                u.jsx("div", {
                  className:
                    "flex flex-col gap-[3px] mr-1 text-[9px] text-ink-subtle dark:text-surface-muted",
                  style: { width: "20px" },
                  children: ["", r[1], "", r[3], "", r[5], ""].map((s, i) =>
                    u.jsx(
                      "div",
                      {
                        style: { height: "12px", lineHeight: "12px" },
                        children: s,
                      },
                      i,
                    ),
                  ),
                }),
                u.jsx("div", {
                  className: "flex gap-[3px]",
                  children: l.map((s, i) =>
                    u.jsx(
                      "div",
                      {
                        className: "flex flex-col gap-[3px]",
                        children: s.map((a, c) =>
                          u.jsx(
                            "div",
                            {
                              title: `${a.date}: ${Math.round(a.ratio * 100)}%`,
                              className: `w-3 h-3 rounded-[2px] ${Dh(a)} transition-colors`,
                            },
                            c,
                          ),
                        ),
                      },
                      i,
                    ),
                  ),
                }),
              ],
            }),
          ],
        }),
        u.jsxs("div", {
          className:
            "flex items-center gap-1 mt-3 justify-end text-[10px] text-ink-subtle dark:text-surface-muted",
          "aria-hidden": "true",
          children: [
            u.jsx("span", { children: t("dash.less") }),
            [
              "bg-gray-100 dark:bg-gray-800",
              "bg-sprout-200 dark:bg-sprout-900",
              "bg-sprout-400 dark:bg-sprout-700",
              "bg-sprout-600 dark:bg-sprout-500",
            ].map((s, i) =>
              u.jsx("div", { className: `w-3 h-3 rounded-[2px] ${s}` }, i),
            ),
            u.jsx("span", { children: t("dash.more") }),
          ],
        }),
      ],
    })
  );
}
const cd = [7, 30, 100, 365];
function Rh(e) {
  return cd.find((t) => t > e) ?? null;
}
function Ih(e) {
  return cd.includes(e) ? e : null;
}
function $h({ streak: e, todayPending: t }) {
  const { t: n } = Pe(),
    r = vl(e.current),
    l = vl(e.best),
    o = Math.min(e.current / 30, 1),
    s = Ih(e.current),
    i = Rh(e.current);
  return u.jsxs("div", {
    className:
      "motion-card bg-surface dark:bg-surface-dark-muted rounded-2xl p-4 border border-sprout-100 dark:border-sprout-950 flex flex-col gap-3",
    style: { "--streak-glow": o },
    children: [
      u.jsxs("div", {
        className: "flex items-center gap-4",
        children: [
          u.jsx("div", {
            className: `streak-mascot w-20 h-20 flex-shrink-0 rounded-2xl flex items-center justify-center ${e.current > 0 ? "" : "opacity-45 grayscale"}`,
            children: u.jsx("img", {
              src: "/sprout-streak.png",
              alt: "",
              "aria-hidden": "true",
              className: "w-full h-full object-contain",
            }),
          }),
          u.jsxs("div", {
            className: "flex-1",
            children: [
              u.jsx("p", {
                className:
                  "text-xs text-ink-subtle dark:text-surface-muted uppercase tracking-wide font-medium",
                children: n("streak.current"),
              }),
              u.jsxs("p", {
                className:
                  "text-3xl font-bold font-sans text-ink dark:text-surface tabular-nums",
                children: [
                  r,
                  " ",
                  u.jsx("span", {
                    className:
                      "text-sm font-normal font-sans text-ink-subtle dark:text-surface-muted",
                    children: n(e.current === 1 ? "streak.day" : "streak.days"),
                  }),
                ],
              }),
            ],
          }),
          u.jsxs("div", {
            className: "text-right",
            children: [
              u.jsx("p", {
                className:
                  "text-xs text-ink-subtle dark:text-surface-muted uppercase tracking-wide font-medium",
                children: n("streak.best"),
              }),
              u.jsxs("p", {
                className:
                  "text-lg font-bold text-sprout-600 dark:text-sprout-400 tabular-nums",
                children: [l, n("unit.dayShort")],
              }),
            ],
          }),
        ],
      }),
      s &&
        u.jsxs("div", {
          className:
            "rounded-xl bg-sprout-50 dark:bg-sprout-950 px-3 py-2 text-sm text-sprout-700 dark:text-sprout-300 font-medium animate-bloom",
          children: [
            u.jsx("span", { "aria-hidden": "true", children: "🎉" }),
            " ",
            n("streak.milestone", { n: s }),
          ],
        }),
      !s &&
        t &&
        e.current > 0 &&
        u.jsx("div", {
          className:
            "rounded-xl bg-amber-50 dark:bg-amber-950 px-3 py-2 text-sm text-amber-800 dark:text-amber-200 font-medium",
          children: n("streak.chain", { n: e.current }),
        }),
      !s &&
        i &&
        e.current > 0 &&
        u.jsxs("div", {
          className:
            "flex items-center gap-2 text-xs text-ink-subtle dark:text-surface-muted",
          children: [
            u.jsx("div", {
              className:
                "flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden",
              children: u.jsx("div", {
                className:
                  "h-full rounded-full bg-sprout-500 transition-all duration-700",
                style: { width: `${(e.current / i) * 100}%` },
              }),
            }),
            u.jsx("span", {
              className: "tabular-nums",
              children: n("streak.toNext", { n: i - e.current, m: i }),
            }),
          ],
        }),
    ],
  });
}
function Oh({ state: e }) {
  const { t, locale: n } = Pe(),
    r = P.useRef(null),
    l = ui(),
    o = ed(e),
    s = ci(e, l),
    i = Sm(e, 26),
    a = rt(e, Ve()),
    c = a === "in-progress" || a === "neutral";
  async function m(x) {
    r.current && (await zh(r.current, x));
  }
  const g =
      o.current > 0
        ? t("headline.streak", { n: o.current })
        : o.best > 0
          ? t("headline.best", { n: o.best })
          : t("headline.start"),
    h =
      s.totalDays > 0
        ? t("headline.month", { pct: s.completionPct, month: dd(l, n) })
        : null,
    w = [g, h].filter(Boolean).join(t("common.sep")) + t("common.end");
  return u.jsxs("div", {
    className: "flex flex-col gap-4 p-4 max-w-xl mx-auto w-full",
    children: [
      u.jsxs("div", {
        className: "flex gap-2 justify-end",
        "data-export-hide": !0,
        children: [
          u.jsxs("button", {
            onClick: () => m("9:16"),
            className:
              "flex items-center gap-2 px-3 py-2 bg-sprout-600 hover:bg-sprout-700 text-white text-xs rounded-xl transition-colors font-medium",
            children: [
              u.jsx(us, { size: 14, "aria-hidden": "true" }),
              " ",
              t("dash.export", { ratio: "9:16" }),
            ],
          }),
          u.jsxs("button", {
            onClick: () => m("16:9"),
            className:
              "flex items-center gap-2 px-3 py-2 bg-sprout-600 hover:bg-sprout-700 text-white text-xs rounded-xl transition-colors font-medium",
            children: [
              u.jsx(us, { size: 14, "aria-hidden": "true" }),
              " ",
              t("dash.export", { ratio: "16:9" }),
            ],
          }),
        ],
      }),
      u.jsxs("div", {
        ref: r,
        className: "flex flex-col gap-5",
        children: [
          u.jsxs("div", {
            className: "px-1",
            children: [
              u.jsx("p", {
                className:
                  "text-xs text-ink-subtle dark:text-surface-muted uppercase tracking-wide font-medium mb-1",
                children: t("dash.growth"),
              }),
              u.jsx("p", {
                className:
                  "text-2xl font-bold font-sans text-ink dark:text-surface leading-snug",
                children: w,
              }),
            ],
          }),
          u.jsx($h, { streak: o, todayPending: c }),
          u.jsx(Mh, { cells: i }),
          u.jsxs("div", {
            className:
              "grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 px-1 border-t border-sprout-100 dark:border-sprout-950 pt-4",
            children: [
              u.jsx(Ir, {
                label: t("dash.completion"),
                value: s.completionPct,
                suffix: "%",
                sub: t("dash.thisMonth"),
              }),
              u.jsx(Ir, {
                label: t("dash.greenDays"),
                value: s.greenDays,
                sub: t("dash.ofTracked", { n: s.totalDays }),
                accent: "text-sprout-600 dark:text-sprout-400",
              }),
              u.jsx(Ir, {
                label: t("dash.tasksDone"),
                value: s.tasksCompleted,
                sub: t("dash.thisMonth"),
                accent: "text-blue-500 dark:text-blue-400",
              }),
              u.jsx(Ir, {
                label: t("dash.bestStreak"),
                value: o.best,
                suffix: t("unit.dayShort"),
                sub: t("dash.allTime"),
                accent: "text-orange-500 dark:text-orange-400",
              }),
            ],
          }),
          u.jsx(Ah, { state: e, month: l }),
        ],
      }),
    ],
  });
}
function Ir({
  label: e,
  value: t,
  suffix: n = "",
  sub: r,
  accent: l = "text-ink dark:text-surface",
}) {
  const o = vl(t, 900);
  return u.jsxs("div", {
    className: "flex flex-col gap-0.5",
    children: [
      u.jsx("span", {
        className:
          "text-[10px] text-ink-subtle dark:text-surface-muted uppercase tracking-wide font-medium",
        children: e,
      }),
      u.jsxs("span", {
        className: `text-2xl font-bold tabular-nums ${l}`,
        children: [o, n],
      }),
      r &&
        u.jsx("span", {
          className: "text-xs text-ink-subtle dark:text-surface-muted",
          children: r,
        }),
    ],
  });
}
function Ah({ state: e, month: t }) {
  const { t: n, locale: r } = Pe(),
    l = Ve(),
    o = ai(t),
    s = ci(e, t),
    i = Al(r, "narrow");
  return u.jsxs("div", {
    className:
      "bg-surface dark:bg-surface-dark-muted rounded-2xl p-4 border border-sprout-100 dark:border-sprout-950",
    children: [
      u.jsxs("div", {
        className: "flex items-center justify-between mb-3",
        children: [
          u.jsx("h3", {
            className:
              "text-xs text-ink-subtle dark:text-surface-muted uppercase tracking-wide font-medium",
            children: dd(t, r),
          }),
          u.jsx("span", {
            className: "text-xs text-ink-muted dark:text-surface-muted",
            children: n("dash.complete", {
              green: s.greenDays,
              total: s.totalDays,
            }),
          }),
        ],
      }),
      u.jsxs("div", {
        className: "grid grid-cols-7 gap-1",
        children: [
          i.map((a, c) =>
            u.jsx(
              "div",
              {
                className:
                  "text-center text-[10px] text-ink-subtle dark:text-surface-muted pb-1",
                "aria-hidden": "true",
                children: a,
              },
              c,
            ),
          ),
          o.flat().map((a, c) => {
            if (!a) return u.jsx("div", {}, c);
            const m = rt(e, a),
              g = parseInt(a.slice(8)),
              h = a === l;
            return u.jsx(
              "div",
              {
                "aria-label": a,
                className: `aspect-square rounded flex items-center justify-center text-[10px] font-medium transition-colors
                ${m === "complete" ? "bg-sprout-500 text-white" : m === "missed" ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400" : m === "in-progress" ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400" : h ? "bg-sprout-50 dark:bg-sprout-950 text-sprout-600 font-bold" : "text-ink-subtle dark:text-surface-muted"}`,
                children: g,
              },
              c,
            );
          }),
        ],
      }),
    ],
  });
}
function dd(e, t = "en-US") {
  return new Date(e + "-01T00:00:00").toLocaleDateString(t, {
    month: "long",
    year: "numeric",
  });
}
function Fh({ theme: e, onToggle: t }) {
  const { t: n } = Pe();
  return u.jsx("button", {
    onClick: t,
    "aria-label": n(e === "dark" ? "theme.toLight" : "theme.toDark"),
    className:
      "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-sprout-700 dark:text-sprout-300 hover:bg-sprout-100 dark:hover:bg-sprout-900 transition-colors",
    children:
      e === "dark"
        ? u.jsx(mm, { size: 20, "aria-hidden": "true" })
        : u.jsx(dm, { size: 20, "aria-hidden": "true" }),
  });
}
function Uh({ value: e, onChange: t }) {
  const { t: n } = Pe(),
    r = mo.find((l) => l.code === e) ?? mo[0];
  return u.jsxs("div", {
    className: "relative flex items-center",
    children: [
      u.jsx(am, {
        size: 16,
        "aria-hidden": "true",
        className:
          "pointer-events-none absolute left-2.5 text-sprout-700 dark:text-sprout-300",
      }),
      u.jsx("select", {
        value: e,
        onChange: (l) => t(l.target.value),
        "aria-label": n("lang.label"),
        title: r.label,
        className:
          "appearance-none cursor-pointer rounded-xl bg-surface-muted dark:bg-surface-dark-muted text-sm font-medium text-ink dark:text-surface pl-8 pr-7 py-2 min-h-[44px] hover:bg-sprout-100 dark:hover:bg-sprout-950 transition-colors",
        children: mo.map((l) =>
          u.jsx("option", { value: l.code, children: l.label }, l.code),
        ),
      }),
      u.jsx("svg", {
        className:
          "pointer-events-none absolute right-2.5 text-ink-subtle dark:text-surface-muted",
        width: "12",
        height: "12",
        viewBox: "0 0 12 12",
        fill: "none",
        "aria-hidden": "true",
        children: u.jsx("path", {
          d: "M3 4.5L6 7.5L9 4.5",
          stroke: "currentColor",
          strokeWidth: "1.5",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
      }),
    ],
  });
}
function bh({ onDone: e, minDuration: t = 1900 }) {
  const { t: n } = Pe(),
    [r, l] = P.useState(!1);
  return (
    P.useEffect(() => {
      const o = setTimeout(() => l(!0), t),
        s = setTimeout(e, t + 600);
      return () => {
        (clearTimeout(o), clearTimeout(s));
      };
    }, [t, e]),
    u.jsxs("div", {
      className: `fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface dark:bg-surface-dark transition-opacity duration-500 ${r ? "opacity-0" : "opacity-100"}`,
      role: "status",
      "aria-label": n("splash.loading"),
      children: [
        u.jsx("div", {
          className: "w-48 h-48",
          children: u.jsx("img", {
            src: "/sprout-neutral.png",
            alt: "Sprout",
            className:
              "w-full h-full object-contain drop-shadow-[0_18px_32px_rgba(14,116,144,0.22)]",
            style: {
              opacity: 0,
              transformOrigin: "50% 85%",
              animation:
                "mascot-pop 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards, mascot-float 3.6s ease-in-out 1.1s infinite",
            },
          }),
        }),
        u.jsx("p", {
          className:
            "mt-2 text-xl font-bold font-sans text-sprout-700 dark:text-sprout-400 tracking-tight",
          style: {
            opacity: 0,
            animation: "splash-fade-up 0.6s ease-out 0.9s forwards",
          },
          children: "Sprout",
        }),
        u.jsx("style", {
          children: `
        @keyframes mascot-pop {
          from { opacity: 0; transform: translateY(18px) scale(0.86); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes mascot-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes splash-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `,
        }),
      ],
    })
  );
}
function Vh() {
  const [e, t] = Kp(),
    [n, r] = P.useState("today"),
    [l, o] = P.useState(!0);
  function s() {
    t(Hp(e, e.settings.theme === "dark" ? "light" : "dark"));
  }
  function i(a) {
    t(Bp(e, a));
  }
  return u.jsxs(em, {
    lang: e.settings.language,
    children: [
      l && u.jsx(bh, { onDone: () => o(!1) }),
      u.jsxs("div", {
        className:
          "flex min-h-dvh w-full flex-col bg-surface dark:bg-surface-dark",
        children: [
          u.jsxs("div", {
            className:
              "sticky top-0 z-40 border-b border-sprout-100/70 bg-surface/85 backdrop-blur-md dark:border-sprout-900/70 dark:bg-surface-dark/85",
            children: [
              u.jsxs("header", {
                className:
                  "mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3",
                children: [
                  u.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      u.jsx("img", {
                        src: "/sprout-logo.png",
                        alt: "",
                        "aria-hidden": "true",
                        className: "h-9 w-9 object-contain",
                      }),
                      u.jsx("span", {
                        className:
                          "font-sans text-lg font-bold text-sprout-700 dark:text-sprout-400",
                        children: "Sprout",
                      }),
                    ],
                  }),
                  u.jsxs("div", {
                    className: "flex items-center gap-1",
                    children: [
                      u.jsx(Uh, { value: e.settings.language, onChange: i }),
                      u.jsx(Fh, { theme: e.settings.theme, onToggle: s }),
                    ],
                  }),
                ],
              }),
              u.jsx(ym, { active: n, onChange: r }),
            ],
          }),
          u.jsx("main", {
            className: "flex-1",
            children: u.jsxs(
              "div",
              {
                className: "view-enter",
                children: [
                  n === "today" && u.jsx(Mm, { state: e, setState: t }),
                  n === "calendar" && u.jsx($m, { state: e, setState: t }),
                  n === "dashboard" && u.jsx(Oh, { state: e }),
                ],
              },
              n,
            ),
          }),
        ],
      }),
    ],
  });
}
Bc(document.getElementById("root")).render(
  u.jsx(P.StrictMode, { children: u.jsx(Vh, {}) }),
);
"serviceWorker" in navigator &&
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
