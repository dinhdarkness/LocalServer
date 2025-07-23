System.register([], function(_export, _context) { return { execute: function () {
System.register("chunks:///_virtual/big.mjs_cjs=&original=.js", ['./big.js', './cjs-loader.mjs'], function (exports, module) {
  var __cjsMetaURL, loader;

  return {
    setters: [function (module) {
      __cjsMetaURL = module.__cjsMetaURL;
      var _setter = {};
      _setter.__cjsMetaURL = module.__cjsMetaURL;
      _setter.default = module.default;
      exports(_setter);
    }, function (module) {
      loader = module.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './big.js'~
      if (!__cjsMetaURL) {
        loader.throwInvalidWrapper('./big.js', module.meta.url);
      }

      loader.require(__cjsMetaURL);
    }
  };
});

System.register("chunks:///_virtual/Big.mjs_cjs=&original=2.js", ['./Big2.js', './cjs-loader.mjs'], function (exports, module) {
  var __cjsMetaURL, loader;

  return {
    setters: [function (module) {
      __cjsMetaURL = module.__cjsMetaURL;
      var _setter = {};
      _setter.__cjsMetaURL = module.__cjsMetaURL;
      _setter.default = module.default;
      exports(_setter);
    }, function (module) {
      loader = module.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './Big.js'~
      if (!__cjsMetaURL) {
        loader.throwInvalidWrapper('./Big.js', module.meta.url);
      }

      loader.require(__cjsMetaURL);
    }
  };
});

System.register("chunks:///_virtual/Big.mjs_cjs=&original=3.js", ['./Big3.js', './cjs-loader.mjs'], function (exports, module) {
  var __cjsMetaURL, loader;

  return {
    setters: [function (module) {
      __cjsMetaURL = module.__cjsMetaURL;
      exports('__cjsMetaURL', module.__cjsMetaURL);
    }, function (module) {
      loader = module.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './Big.js'~
      if (!__cjsMetaURL) {
        loader.throwInvalidWrapper('./Big.js', module.meta.url);
      }

      loader.require(__cjsMetaURL);
    }
  };
});

System.register("chunks:///_virtual/Big2.js", ['./cjs-loader.mjs'], function (exports, module) {
  var loader;
  return {
    setters: [function (module) {
      loader = module.default;
    }],
    execute: function () {
      exports('default', void 0);

      let _cjsExports;

      const __cjsMetaURL = exports('__cjsMetaURL', module.meta.url);

      loader.define(__cjsMetaURL, function (exports$1, require, module, __filename, __dirname) {
        (function (GLOBAL) {
          var Big,
              DP = 20,
              RM = 1,
              MAX_DP = 1E6,
              MAX_POWER = 1E6,
              NE = -7,
              PE = 21,
              STRICT = false,
              NAME = '[big.js] ',
              INVALID = NAME + 'Invalid ',
              INVALID_DP = INVALID + 'decimal places',
              INVALID_RM = INVALID + 'rounding mode',
              DIV_BY_ZERO = NAME + 'Division by zero',
              P = {},
              UNDEFINED = void 0,
              NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;

          function _Big_() {
            function Big(n) {
              var x = this;
              if (!(x instanceof Big)) return n === UNDEFINED ? _Big_() : new Big(n);

              if (n instanceof Big) {
                x.s = n.s;
                x.e = n.e;
                x.c = n.c.slice();
              } else {
                if (typeof n !== 'string') {
                  if (Big.strict === true && typeof n !== 'bigint') {
                    throw TypeError(INVALID + 'value');
                  }

                  n = n === 0 && 1 / n < 0 ? '-0' : String(n);
                }

                parse(x, n);
              }

              x.constructor = Big;
            }

            Big.prototype = P;
            Big.DP = DP;
            Big.RM = RM;
            Big.NE = NE;
            Big.PE = PE;
            Big.strict = STRICT;
            Big.roundDown = 0;
            Big.roundHalfUp = 1;
            Big.roundHalfEven = 2;
            Big.roundUp = 3;
            return Big;
          }

          function parse(x, n) {
            var e, i, nl;

            if (!NUMERIC.test(n)) {
              throw Error(INVALID + 'number');
            }

            x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;
            if ((e = n.indexOf('.')) > -1) n = n.replace('.', '');

            if ((i = n.search(/e/i)) > 0) {
              if (e < 0) e = i;
              e += +n.slice(i + 1);
              n = n.substring(0, i);
            } else if (e < 0) {
              e = n.length;
            }

            nl = n.length;

            for (i = 0; i < nl && n.charAt(i) == '0';) ++i;

            if (i == nl) {
              x.c = [x.e = 0];
            } else {
              for (; nl > 0 && n.charAt(--nl) == '0';);

              x.e = e - i - 1;
              x.c = [];

              for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
            }

            return x;
          }

          function round(x, sd, rm, more) {
            var xc = x.c;
            if (rm === UNDEFINED) rm = x.constructor.RM;

            if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
              throw Error(INVALID_RM);
            }

            if (sd < 1) {
              more = rm === 3 && (more || !!xc[0]) || sd === 0 && (rm === 1 && xc[0] >= 5 || rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED)));
              xc.length = 1;

              if (more) {
                x.e = x.e - sd + 1;
                xc[0] = 1;
              } else {
                xc[0] = x.e = 0;
              }
            } else if (sd < xc.length) {
              more = rm === 1 && xc[sd] >= 5 || rm === 2 && (xc[sd] > 5 || xc[sd] === 5 && (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) || rm === 3 && (more || !!xc[0]);
              xc.length = sd;

              if (more) {
                for (; ++xc[--sd] > 9;) {
                  xc[sd] = 0;

                  if (sd === 0) {
                    ++x.e;
                    xc.unshift(1);
                    break;
                  }
                }
              }

              for (sd = xc.length; !xc[--sd];) xc.pop();
            }

            return x;
          }

          function stringify(x, doExponential, isNonzero) {
            var e = x.e,
                s = x.c.join(''),
                n = s.length;

            if (doExponential) {
              s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;
            } else if (e < 0) {
              for (; ++e;) s = '0' + s;

              s = '0.' + s;
            } else if (e > 0) {
              if (++e > n) {
                for (e -= n; e--;) s += '0';
              } else if (e < n) {
                s = s.slice(0, e) + '.' + s.slice(e);
              }
            } else if (n > 1) {
              s = s.charAt(0) + '.' + s.slice(1);
            }

            return x.s < 0 && isNonzero ? '-' + s : s;
          }

          P.abs = function () {
            var x = new this.constructor(this);
            x.s = 1;
            return x;
          };

          P.cmp = function (y) {
            var isneg,
                x = this,
                xc = x.c,
                yc = (y = new x.constructor(y)).c,
                i = x.s,
                j = y.s,
                k = x.e,
                l = y.e;
            if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;
            if (i != j) return i;
            isneg = i < 0;
            if (k != l) return k > l ^ isneg ? 1 : -1;
            j = (k = xc.length) < (l = yc.length) ? k : l;

            for (i = -1; ++i < j;) {
              if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
            }

            return k == l ? 0 : k > l ^ isneg ? 1 : -1;
          };

          P.div = function (y) {
            var x = this,
                Big = x.constructor,
                a = x.c,
                b = (y = new Big(y)).c,
                k = x.s == y.s ? 1 : -1,
                dp = Big.DP;

            if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
              throw Error(INVALID_DP);
            }

            if (!b[0]) {
              throw Error(DIV_BY_ZERO);
            }

            if (!a[0]) {
              y.s = k;
              y.c = [y.e = 0];
              return y;
            }

            var bl,
                bt,
                n,
                cmp,
                ri,
                bz = b.slice(),
                ai = bl = b.length,
                al = a.length,
                r = a.slice(0, bl),
                rl = r.length,
                q = y,
                qc = q.c = [],
                qi = 0,
                p = dp + (q.e = x.e - y.e) + 1;
            q.s = k;
            k = p < 0 ? 0 : p;
            bz.unshift(0);

            for (; rl++ < bl;) r.push(0);

            do {
              for (n = 0; n < 10; n++) {
                if (bl != (rl = r.length)) {
                  cmp = bl > rl ? 1 : -1;
                } else {
                  for (ri = -1, cmp = 0; ++ri < bl;) {
                    if (b[ri] != r[ri]) {
                      cmp = b[ri] > r[ri] ? 1 : -1;
                      break;
                    }
                  }
                }

                if (cmp < 0) {
                  for (bt = rl == bl ? b : bz; rl;) {
                    if (r[--rl] < bt[rl]) {
                      ri = rl;

                      for (; ri && !r[--ri];) r[ri] = 9;

                      --r[ri];
                      r[rl] += 10;
                    }

                    r[rl] -= bt[rl];
                  }

                  for (; !r[0];) r.shift();
                } else {
                  break;
                }
              }

              qc[qi++] = cmp ? n : ++n;
              if (r[0] && cmp) r[rl] = a[ai] || 0;else r = [a[ai]];
            } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

            if (!qc[0] && qi != 1) {
              qc.shift();
              q.e--;
              p--;
            }

            if (qi > p) round(q, p, Big.RM, r[0] !== UNDEFINED);
            return q;
          };

          P.eq = function (y) {
            return this.cmp(y) === 0;
          };

          P.gt = function (y) {
            return this.cmp(y) > 0;
          };

          P.gte = function (y) {
            return this.cmp(y) > -1;
          };

          P.lt = function (y) {
            return this.cmp(y) < 0;
          };

          P.lte = function (y) {
            return this.cmp(y) < 1;
          };

          P.minus = P.sub = function (y) {
            var i,
                j,
                t,
                xlty,
                x = this,
                Big = x.constructor,
                a = x.s,
                b = (y = new Big(y)).s;

            if (a != b) {
              y.s = -b;
              return x.plus(y);
            }

            var xc = x.c.slice(),
                xe = x.e,
                yc = y.c,
                ye = y.e;

            if (!xc[0] || !yc[0]) {
              if (yc[0]) {
                y.s = -b;
              } else if (xc[0]) {
                y = new Big(x);
              } else {
                y.s = 1;
              }

              return y;
            }

            if (a = xe - ye) {
              if (xlty = a < 0) {
                a = -a;
                t = xc;
              } else {
                ye = xe;
                t = yc;
              }

              t.reverse();

              for (b = a; b--;) t.push(0);

              t.reverse();
            } else {
              j = ((xlty = xc.length < yc.length) ? xc : yc).length;

              for (a = b = 0; b < j; b++) {
                if (xc[b] != yc[b]) {
                  xlty = xc[b] < yc[b];
                  break;
                }
              }
            }

            if (xlty) {
              t = xc;
              xc = yc;
              yc = t;
              y.s = -y.s;
            }

            if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

            for (b = i; j > a;) {
              if (xc[--j] < yc[j]) {
                for (i = j; i && !xc[--i];) xc[i] = 9;

                --xc[i];
                xc[j] += 10;
              }

              xc[j] -= yc[j];
            }

            for (; xc[--b] === 0;) xc.pop();

            for (; xc[0] === 0;) {
              xc.shift();
              --ye;
            }

            if (!xc[0]) {
              y.s = 1;
              xc = [ye = 0];
            }

            y.c = xc;
            y.e = ye;
            return y;
          };

          P.mod = function (y) {
            var ygtx,
                x = this,
                Big = x.constructor,
                a = x.s,
                b = (y = new Big(y)).s;

            if (!y.c[0]) {
              throw Error(DIV_BY_ZERO);
            }

            x.s = y.s = 1;
            ygtx = y.cmp(x) == 1;
            x.s = a;
            y.s = b;
            if (ygtx) return new Big(x);
            a = Big.DP;
            b = Big.RM;
            Big.DP = Big.RM = 0;
            x = x.div(y);
            Big.DP = a;
            Big.RM = b;
            return this.minus(x.times(y));
          };

          P.neg = function () {
            var x = new this.constructor(this);
            x.s = -x.s;
            return x;
          };

          P.plus = P.add = function (y) {
            var e,
                k,
                t,
                x = this,
                Big = x.constructor;
            y = new Big(y);

            if (x.s != y.s) {
              y.s = -y.s;
              return x.minus(y);
            }

            var xe = x.e,
                xc = x.c,
                ye = y.e,
                yc = y.c;

            if (!xc[0] || !yc[0]) {
              if (!yc[0]) {
                if (xc[0]) {
                  y = new Big(x);
                } else {
                  y.s = x.s;
                }
              }

              return y;
            }

            xc = xc.slice();

            if (e = xe - ye) {
              if (e > 0) {
                ye = xe;
                t = yc;
              } else {
                e = -e;
                t = xc;
              }

              t.reverse();

              for (; e--;) t.push(0);

              t.reverse();
            }

            if (xc.length - yc.length < 0) {
              t = yc;
              yc = xc;
              xc = t;
            }

            e = yc.length;

            for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;

            if (k) {
              xc.unshift(k);
              ++ye;
            }

            for (e = xc.length; xc[--e] === 0;) xc.pop();

            y.c = xc;
            y.e = ye;
            return y;
          };

          P.pow = function (n) {
            var x = this,
                one = new x.constructor('1'),
                y = one,
                isneg = n < 0;

            if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
              throw Error(INVALID + 'exponent');
            }

            if (isneg) n = -n;

            for (;;) {
              if (n & 1) y = y.times(x);
              n >>= 1;
              if (!n) break;
              x = x.times(x);
            }

            return isneg ? one.div(y) : y;
          };

          P.prec = function (sd, rm) {
            if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
              throw Error(INVALID + 'precision');
            }

            return round(new this.constructor(this), sd, rm);
          };

          P.round = function (dp, rm) {
            if (dp === UNDEFINED) dp = 0;else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
              throw Error(INVALID_DP);
            }
            return round(new this.constructor(this), dp + this.e + 1, rm);
          };

          P.sqrt = function () {
            var r,
                c,
                t,
                x = this,
                Big = x.constructor,
                s = x.s,
                e = x.e,
                half = new Big('0.5');
            if (!x.c[0]) return new Big(x);

            if (s < 0) {
              throw Error(NAME + 'No square root');
            }

            s = Math.sqrt(x + '');

            if (s === 0 || s === 1 / 0) {
              c = x.c.join('');
              if (!(c.length + e & 1)) c += '0';
              s = Math.sqrt(c);
              e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
              r = new Big((s == 1 / 0 ? '5e' : (s = s.toExponential()).slice(0, s.indexOf('e') + 1)) + e);
            } else {
              r = new Big(s + '');
            }

            e = r.e + (Big.DP += 4);

            do {
              t = r;
              r = half.times(t.plus(x.div(t)));
            } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));

            return round(r, (Big.DP -= 4) + r.e + 1, Big.RM);
          };

          P.times = P.mul = function (y) {
            var c,
                x = this,
                Big = x.constructor,
                xc = x.c,
                yc = (y = new Big(y)).c,
                a = xc.length,
                b = yc.length,
                i = x.e,
                j = y.e;
            y.s = x.s == y.s ? 1 : -1;

            if (!xc[0] || !yc[0]) {
              y.c = [y.e = 0];
              return y;
            }

            y.e = i + j;

            if (a < b) {
              c = xc;
              xc = yc;
              yc = c;
              j = a;
              a = b;
              b = j;
            }

            for (c = new Array(j = a + b); j--;) c[j] = 0;

            for (i = b; i--;) {
              b = 0;

              for (j = a + i; j > i;) {
                b = c[j] + yc[i] * xc[j - i - 1] + b;
                c[j--] = b % 10;
                b = b / 10 | 0;
              }

              c[j] = b;
            }

            if (b) ++y.e;else c.shift();

            for (i = c.length; !c[--i];) c.pop();

            y.c = c;
            return y;
          };

          P.toExponential = function (dp, rm) {
            var x = this,
                n = x.c[0];

            if (dp !== UNDEFINED) {
              if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
                throw Error(INVALID_DP);
              }

              x = round(new x.constructor(x), ++dp, rm);

              for (; x.c.length < dp;) x.c.push(0);
            }

            return stringify(x, true, !!n);
          };

          P.toFixed = function (dp, rm) {
            var x = this,
                n = x.c[0];

            if (dp !== UNDEFINED) {
              if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
                throw Error(INVALID_DP);
              }

              x = round(new x.constructor(x), dp + x.e + 1, rm);

              for (dp = dp + x.e + 1; x.c.length < dp;) x.c.push(0);
            }

            return stringify(x, false, !!n);
          };

          P.toJSON = P.toString = function () {
            var x = this,
                Big = x.constructor;
            return stringify(x, x.e <= Big.NE || x.e >= Big.PE, !!x.c[0]);
          };

          P.toNumber = function () {
            var n = Number(stringify(this, true, true));

            if (this.constructor.strict === true && !this.eq(n.toString())) {
              throw Error(NAME + 'Imprecise conversion');
            }

            return n;
          };

          P.toPrecision = function (sd, rm) {
            var x = this,
                Big = x.constructor,
                n = x.c[0];

            if (sd !== UNDEFINED) {
              if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
                throw Error(INVALID + 'precision');
              }

              x = round(new Big(x), sd, rm);

              for (; x.c.length < sd;) x.c.push(0);
            }

            return stringify(x, sd <= x.e || x.e <= Big.NE || x.e >= Big.PE, !!n);
          };

          P.valueOf = function () {
            var x = this,
                Big = x.constructor;

            if (Big.strict === true) {
              throw Error(NAME + 'valueOf disallowed');
            }

            return stringify(x, x.e <= Big.NE || x.e >= Big.PE, true);
          };

          Big = _Big_();
          Big['default'] = Big.Big = Big;

          if (typeof define === 'function' && define.amd) {
            define(function () {
              return Big;
            });
          } else if (typeof module !== 'undefined' && module.exports) {
            module.exports = Big;
          } else {
            GLOBAL.Big = Big;
          }
        })(this); // #endregion ORIGINAL CODE


        _cjsExports = exports('default', module.exports);
      }, {});
    }
  };
});

System.register("chunks:///_virtual/Big3.js", ['./cjs-loader.mjs'], function (exports, module) {
  var loader;
  return {
    setters: [function (module) {
      loader = module.default;
    }],
    execute: function () {
      const __cjsMetaURL = exports('__cjsMetaURL', module.meta.url);

      loader.define(__cjsMetaURL, function (exports, require, module, __filename, __dirname) {
        (function (GLOBAL) {
          var Big,
              DP = 20,
              RM = 1,
              MAX_DP = 1E6,
              MAX_POWER = 1E6,
              NE = -7,
              PE = 21,
              STRICT = false,
              NAME = '[big.js] ',
              INVALID = NAME + 'Invalid ',
              INVALID_DP = INVALID + 'decimal places',
              INVALID_RM = INVALID + 'rounding mode',
              DIV_BY_ZERO = NAME + 'Division by zero',
              P = {},
              UNDEFINED = void 0,
              NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;

          function _Big_() {
            function Big(n) {
              var x = this;
              if (!(x instanceof Big)) return n === UNDEFINED ? _Big_() : new Big(n);

              if (n instanceof Big) {
                x.s = n.s;
                x.e = n.e;
                x.c = n.c.slice();
              } else {
                if (typeof n !== 'string') {
                  if (Big.strict === true && typeof n !== 'bigint') {
                    throw TypeError(INVALID + 'value');
                  }

                  n = n === 0 && 1 / n < 0 ? '-0' : String(n);
                }

                parse(x, n);
              }

              x.constructor = Big;
            }

            Big.prototype = P;
            Big.DP = DP;
            Big.RM = RM;
            Big.NE = NE;
            Big.PE = PE;
            Big.strict = STRICT;
            Big.roundDown = 0;
            Big.roundHalfUp = 1;
            Big.roundHalfEven = 2;
            Big.roundUp = 3;
            return Big;
          }

          function parse(x, n) {
            var e, i, nl;

            if (!NUMERIC.test(n)) {
              throw Error(INVALID + 'number');
            }

            x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;
            if ((e = n.indexOf('.')) > -1) n = n.replace('.', '');

            if ((i = n.search(/e/i)) > 0) {
              if (e < 0) e = i;
              e += +n.slice(i + 1);
              n = n.substring(0, i);
            } else if (e < 0) {
              e = n.length;
            }

            nl = n.length;

            for (i = 0; i < nl && n.charAt(i) == '0';) ++i;

            if (i == nl) {
              x.c = [x.e = 0];
            } else {
              for (; nl > 0 && n.charAt(--nl) == '0';);

              x.e = e - i - 1;
              x.c = [];

              for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
            }

            return x;
          }

          function round(x, sd, rm, more) {
            var xc = x.c;
            if (rm === UNDEFINED) rm = x.constructor.RM;

            if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
              throw Error(INVALID_RM);
            }

            if (sd < 1) {
              more = rm === 3 && (more || !!xc[0]) || sd === 0 && (rm === 1 && xc[0] >= 5 || rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED)));
              xc.length = 1;

              if (more) {
                x.e = x.e - sd + 1;
                xc[0] = 1;
              } else {
                xc[0] = x.e = 0;
              }
            } else if (sd < xc.length) {
              more = rm === 1 && xc[sd] >= 5 || rm === 2 && (xc[sd] > 5 || xc[sd] === 5 && (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) || rm === 3 && (more || !!xc[0]);
              xc.length = sd;

              if (more) {
                for (; ++xc[--sd] > 9;) {
                  xc[sd] = 0;

                  if (sd === 0) {
                    ++x.e;
                    xc.unshift(1);
                    break;
                  }
                }
              }

              for (sd = xc.length; !xc[--sd];) xc.pop();
            }

            return x;
          }

          function stringify(x, doExponential, isNonzero) {
            var e = x.e,
                s = x.c.join(''),
                n = s.length;

            if (doExponential) {
              s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;
            } else if (e < 0) {
              for (; ++e;) s = '0' + s;

              s = '0.' + s;
            } else if (e > 0) {
              if (++e > n) {
                for (e -= n; e--;) s += '0';
              } else if (e < n) {
                s = s.slice(0, e) + '.' + s.slice(e);
              }
            } else if (n > 1) {
              s = s.charAt(0) + '.' + s.slice(1);
            }

            return x.s < 0 && isNonzero ? '-' + s : s;
          }

          P.abs = function () {
            var x = new this.constructor(this);
            x.s = 1;
            return x;
          };

          P.cmp = function (y) {
            var isneg,
                x = this,
                xc = x.c,
                yc = (y = new x.constructor(y)).c,
                i = x.s,
                j = y.s,
                k = x.e,
                l = y.e;
            if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;
            if (i != j) return i;
            isneg = i < 0;
            if (k != l) return k > l ^ isneg ? 1 : -1;
            j = (k = xc.length) < (l = yc.length) ? k : l;

            for (i = -1; ++i < j;) {
              if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
            }

            return k == l ? 0 : k > l ^ isneg ? 1 : -1;
          };

          P.div = function (y) {
            var x = this,
                Big = x.constructor,
                a = x.c,
                b = (y = new Big(y)).c,
                k = x.s == y.s ? 1 : -1,
                dp = Big.DP;

            if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
              throw Error(INVALID_DP);
            }

            if (!b[0]) {
              throw Error(DIV_BY_ZERO);
            }

            if (!a[0]) {
              y.s = k;
              y.c = [y.e = 0];
              return y;
            }

            var bl,
                bt,
                n,
                cmp,
                ri,
                bz = b.slice(),
                ai = bl = b.length,
                al = a.length,
                r = a.slice(0, bl),
                rl = r.length,
                q = y,
                qc = q.c = [],
                qi = 0,
                p = dp + (q.e = x.e - y.e) + 1;
            q.s = k;
            k = p < 0 ? 0 : p;
            bz.unshift(0);

            for (; rl++ < bl;) r.push(0);

            do {
              for (n = 0; n < 10; n++) {
                if (bl != (rl = r.length)) {
                  cmp = bl > rl ? 1 : -1;
                } else {
                  for (ri = -1, cmp = 0; ++ri < bl;) {
                    if (b[ri] != r[ri]) {
                      cmp = b[ri] > r[ri] ? 1 : -1;
                      break;
                    }
                  }
                }

                if (cmp < 0) {
                  for (bt = rl == bl ? b : bz; rl;) {
                    if (r[--rl] < bt[rl]) {
                      ri = rl;

                      for (; ri && !r[--ri];) r[ri] = 9;

                      --r[ri];
                      r[rl] += 10;
                    }

                    r[rl] -= bt[rl];
                  }

                  for (; !r[0];) r.shift();
                } else {
                  break;
                }
              }

              qc[qi++] = cmp ? n : ++n;
              if (r[0] && cmp) r[rl] = a[ai] || 0;else r = [a[ai]];
            } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

            if (!qc[0] && qi != 1) {
              qc.shift();
              q.e--;
              p--;
            }

            if (qi > p) round(q, p, Big.RM, r[0] !== UNDEFINED);
            return q;
          };

          P.eq = function (y) {
            return this.cmp(y) === 0;
          };

          P.gt = function (y) {
            return this.cmp(y) > 0;
          };

          P.gte = function (y) {
            return this.cmp(y) > -1;
          };

          P.lt = function (y) {
            return this.cmp(y) < 0;
          };

          P.lte = function (y) {
            return this.cmp(y) < 1;
          };

          P.minus = P.sub = function (y) {
            var i,
                j,
                t,
                xlty,
                x = this,
                Big = x.constructor,
                a = x.s,
                b = (y = new Big(y)).s;

            if (a != b) {
              y.s = -b;
              return x.plus(y);
            }

            var xc = x.c.slice(),
                xe = x.e,
                yc = y.c,
                ye = y.e;

            if (!xc[0] || !yc[0]) {
              if (yc[0]) {
                y.s = -b;
              } else if (xc[0]) {
                y = new Big(x);
              } else {
                y.s = 1;
              }

              return y;
            }

            if (a = xe - ye) {
              if (xlty = a < 0) {
                a = -a;
                t = xc;
              } else {
                ye = xe;
                t = yc;
              }

              t.reverse();

              for (b = a; b--;) t.push(0);

              t.reverse();
            } else {
              j = ((xlty = xc.length < yc.length) ? xc : yc).length;

              for (a = b = 0; b < j; b++) {
                if (xc[b] != yc[b]) {
                  xlty = xc[b] < yc[b];
                  break;
                }
              }
            }

            if (xlty) {
              t = xc;
              xc = yc;
              yc = t;
              y.s = -y.s;
            }

            if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

            for (b = i; j > a;) {
              if (xc[--j] < yc[j]) {
                for (i = j; i && !xc[--i];) xc[i] = 9;

                --xc[i];
                xc[j] += 10;
              }

              xc[j] -= yc[j];
            }

            for (; xc[--b] === 0;) xc.pop();

            for (; xc[0] === 0;) {
              xc.shift();
              --ye;
            }

            if (!xc[0]) {
              y.s = 1;
              xc = [ye = 0];
            }

            y.c = xc;
            y.e = ye;
            return y;
          };

          P.mod = function (y) {
            var ygtx,
                x = this,
                Big = x.constructor,
                a = x.s,
                b = (y = new Big(y)).s;

            if (!y.c[0]) {
              throw Error(DIV_BY_ZERO);
            }

            x.s = y.s = 1;
            ygtx = y.cmp(x) == 1;
            x.s = a;
            y.s = b;
            if (ygtx) return new Big(x);
            a = Big.DP;
            b = Big.RM;
            Big.DP = Big.RM = 0;
            x = x.div(y);
            Big.DP = a;
            Big.RM = b;
            return this.minus(x.times(y));
          };

          P.neg = function () {
            var x = new this.constructor(this);
            x.s = -x.s;
            return x;
          };

          P.plus = P.add = function (y) {
            var e,
                k,
                t,
                x = this,
                Big = x.constructor;
            y = new Big(y);

            if (x.s != y.s) {
              y.s = -y.s;
              return x.minus(y);
            }

            var xe = x.e,
                xc = x.c,
                ye = y.e,
                yc = y.c;

            if (!xc[0] || !yc[0]) {
              if (!yc[0]) {
                if (xc[0]) {
                  y = new Big(x);
                } else {
                  y.s = x.s;
                }
              }

              return y;
            }

            xc = xc.slice();

            if (e = xe - ye) {
              if (e > 0) {
                ye = xe;
                t = yc;
              } else {
                e = -e;
                t = xc;
              }

              t.reverse();

              for (; e--;) t.push(0);

              t.reverse();
            }

            if (xc.length - yc.length < 0) {
              t = yc;
              yc = xc;
              xc = t;
            }

            e = yc.length;

            for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;

            if (k) {
              xc.unshift(k);
              ++ye;
            }

            for (e = xc.length; xc[--e] === 0;) xc.pop();

            y.c = xc;
            y.e = ye;
            return y;
          };

          P.pow = function (n) {
            var x = this,
                one = new x.constructor('1'),
                y = one,
                isneg = n < 0;

            if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
              throw Error(INVALID + 'exponent');
            }

            if (isneg) n = -n;

            for (;;) {
              if (n & 1) y = y.times(x);
              n >>= 1;
              if (!n) break;
              x = x.times(x);
            }

            return isneg ? one.div(y) : y;
          };

          P.prec = function (sd, rm) {
            if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
              throw Error(INVALID + 'precision');
            }

            return round(new this.constructor(this), sd, rm);
          };

          P.round = function (dp, rm) {
            if (dp === UNDEFINED) dp = 0;else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
              throw Error(INVALID_DP);
            }
            return round(new this.constructor(this), dp + this.e + 1, rm);
          };

          P.sqrt = function () {
            var r,
                c,
                t,
                x = this,
                Big = x.constructor,
                s = x.s,
                e = x.e,
                half = new Big('0.5');
            if (!x.c[0]) return new Big(x);

            if (s < 0) {
              throw Error(NAME + 'No square root');
            }

            s = Math.sqrt(x + '');

            if (s === 0 || s === 1 / 0) {
              c = x.c.join('');
              if (!(c.length + e & 1)) c += '0';
              s = Math.sqrt(c);
              e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
              r = new Big((s == 1 / 0 ? '5e' : (s = s.toExponential()).slice(0, s.indexOf('e') + 1)) + e);
            } else {
              r = new Big(s + '');
            }

            e = r.e + (Big.DP += 4);

            do {
              t = r;
              r = half.times(t.plus(x.div(t)));
            } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));

            return round(r, (Big.DP -= 4) + r.e + 1, Big.RM);
          };

          P.times = P.mul = function (y) {
            var c,
                x = this,
                Big = x.constructor,
                xc = x.c,
                yc = (y = new Big(y)).c,
                a = xc.length,
                b = yc.length,
                i = x.e,
                j = y.e;
            y.s = x.s == y.s ? 1 : -1;

            if (!xc[0] || !yc[0]) {
              y.c = [y.e = 0];
              return y;
            }

            y.e = i + j;

            if (a < b) {
              c = xc;
              xc = yc;
              yc = c;
              j = a;
              a = b;
              b = j;
            }

            for (c = new Array(j = a + b); j--;) c[j] = 0;

            for (i = b; i--;) {
              b = 0;

              for (j = a + i; j > i;) {
                b = c[j] + yc[i] * xc[j - i - 1] + b;
                c[j--] = b % 10;
                b = b / 10 | 0;
              }

              c[j] = b;
            }

            if (b) ++y.e;else c.shift();

            for (i = c.length; !c[--i];) c.pop();

            y.c = c;
            return y;
          };

          P.toExponential = function (dp, rm) {
            var x = this,
                n = x.c[0];

            if (dp !== UNDEFINED) {
              if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
                throw Error(INVALID_DP);
              }

              x = round(new x.constructor(x), ++dp, rm);

              for (; x.c.length < dp;) x.c.push(0);
            }

            return stringify(x, true, !!n);
          };

          P.toFixed = function (dp, rm) {
            var x = this,
                n = x.c[0];

            if (dp !== UNDEFINED) {
              if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
                throw Error(INVALID_DP);
              }

              x = round(new x.constructor(x), dp + x.e + 1, rm);

              for (dp = dp + x.e + 1; x.c.length < dp;) x.c.push(0);
            }

            return stringify(x, false, !!n);
          };

          P.toJSON = P.toString = function () {
            var x = this,
                Big = x.constructor;
            return stringify(x, x.e <= Big.NE || x.e >= Big.PE, !!x.c[0]);
          };

          P.toNumber = function () {
            var n = Number(stringify(this, true, true));

            if (this.constructor.strict === true && !this.eq(n.toString())) {
              throw Error(NAME + 'Imprecise conversion');
            }

            return n;
          };

          P.toPrecision = function (sd, rm) {
            var x = this,
                Big = x.constructor,
                n = x.c[0];

            if (sd !== UNDEFINED) {
              if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
                throw Error(INVALID + 'precision');
              }

              x = round(new Big(x), sd, rm);

              for (; x.c.length < sd;) x.c.push(0);
            }

            return stringify(x, sd <= x.e || x.e <= Big.NE || x.e >= Big.PE, !!n);
          };

          P.valueOf = function () {
            var x = this,
                Big = x.constructor;

            if (Big.strict === true) {
              throw Error(NAME + 'valueOf disallowed');
            }

            return stringify(x, x.e <= Big.NE || x.e >= Big.PE, true);
          };

          Big = _Big_();
          Big['default'] = Big.Big = Big;

          if (typeof define === 'function' && define.amd) {
            define(function () {
              return Big;
            });
          } else if (typeof module !== 'undefined' && module.exports) {
            module.exports = Big;
          } else {
            GLOBAL.Big = Big;
          }
        })(this); // #endregion ORIGINAL CODE


        module.exports;
      }, {});
    }
  };
});

System.register("chunks:///_virtual/cjs-loader.mjs", [], function (exports) {
  return {
    execute: function () {
      class CjsLoader {
        constructor() {
          this._registry = {};
          this._moduleCache = {};
        }
        /**
         * Defines a CommonJS module.
         * @param id Module ID.
         * @param factory The factory.
         * @param resolveMap An object or a function returning object which records the module specifier resolve result.
         * The later is called as "deferred resolve map" and would be invocated right before CommonJS code execution.
         */


        define(id, factory, resolveMap) {
          this._registry[id] = {
            factory,
            resolveMap
          };
        }
        /**
         * Requires a CommonJS module.
         * @param id Module ID.
         * @returns The module's `module.exports`.
         */


        require(id) {
          return this._require(id);
        }

        throwInvalidWrapper(requestTarget, from) {
          throw new Error(`Module '${requestTarget}' imported from '${from}' is expected be an ESM-wrapped CommonJS module but it doesn't.`);
        }

        _require(id, parent) {
          const cachedModule = this._moduleCache[id];

          if (cachedModule) {
            return cachedModule.exports;
          }

          const module = {
            id,
            exports: {}
          };
          this._moduleCache[id] = module;

          this._tryModuleLoad(module, id);

          return module.exports;
        }

        _resolve(specifier, parent) {
          return this._resolveFromInfos(specifier, parent) || this._throwUnresolved(specifier, parent);
        }

        _resolveFromInfos(specifier, parent) {
          var _cjsInfos$parent;

          if (specifier in cjsInfos) {
            return specifier;
          }

          if (!parent) {
            return;
          }

          return ((_cjsInfos$parent = cjsInfos[parent]) == null ? void 0 : _cjsInfos$parent.resolveCache[specifier]) ?? undefined;
        }

        _tryModuleLoad(module, id) {
          let threw = true;

          try {
            this._load(module, id);

            threw = false;
          } finally {
            if (threw) {
              delete this._moduleCache[id];
            }
          }
        }

        _load(module, id) {
          const {
            factory,
            resolveMap
          } = this._loadWrapper(id);

          const vendorRequire = this._createRequire(module);

          const require = resolveMap ? this._createRequireWithResolveMap(typeof resolveMap === 'function' ? resolveMap() : resolveMap, vendorRequire) : vendorRequire;

          factory(module.exports, require, module);
        }

        _loadWrapper(id) {
          if (id in this._registry) {
            return this._registry[id];
          } else {
            return this._loadHostProvidedModules(id);
          }
        }

        _loadHostProvidedModules(id) {
          return {
            factory: (_exports, _require, module) => {
              if (typeof require === 'undefined') {
                throw new Error(`Current environment does not provide a require() for requiring '${id}'.`);
              }

              try {
                module.exports = require(id);
              } catch (err) {
                throw new Error(`Exception thrown when calling host defined require('${id}').`, {
                  cause: err
                });
              }
            }
          };
        }

        _createRequire(module) {
          return specifier => this._require(specifier, module);
        }

        _createRequireWithResolveMap(requireMap, originalRequire) {
          return specifier => {
            const resolved = requireMap[specifier];

            if (resolved) {
              return originalRequire(resolved);
            } else {
              throw new Error('Unresolved specifier ' + specifier);
            }
          };
        }

        _throwUnresolved(specifier, parentUrl) {
          throw new Error(`Unable to resolve ${specifier} from ${parent}.`);
        }

      }

      var loader = exports('default', new CjsLoader());
    }
  };
});

System.register("chunks:///_virtual/env", [], function (exports) {
  return {
    execute: function () {
      const DEBUG = exports('DEBUG', true);
    }
  };
});

System.register("chunks:///_virtual/events.js", ['./cjs-loader.mjs'], function (exports, module) {
  var loader;
  return {
    setters: [function (module) {
      loader = module.default;
    }],
    execute: function () {
      exports('default', void 0);

      let _cjsExports;

      const __cjsMetaURL = exports('__cjsMetaURL', module.meta.url);

      loader.define(__cjsMetaURL, function (exports$1, require, module, __filename, __dirname) {
        var R = typeof Reflect === 'object' ? Reflect : null;
        var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
          return Function.prototype.apply.call(target, receiver, args);
        };
        var ReflectOwnKeys;

        if (R && typeof R.ownKeys === 'function') {
          ReflectOwnKeys = R.ownKeys;
        } else if (Object.getOwnPropertySymbols) {
          ReflectOwnKeys = function ReflectOwnKeys(target) {
            return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
          };
        } else {
          ReflectOwnKeys = function ReflectOwnKeys(target) {
            return Object.getOwnPropertyNames(target);
          };
        }

        function ProcessEmitWarning(warning) {
          if (console && console.warn) console.warn(warning);
        }

        var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
          return value !== value;
        };

        function EventEmitter() {
          EventEmitter.init.call(this);
        }

        if ("object" == typeof exports$1 && "undefined" != typeof module) {
          module.exports = EventEmitter;
          module.exports.once = once;
        } else if ("function" == typeof define && define.amd) define([], EventEmitter);else {
          var r;
          r = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, r.EventEmitter = EventEmitter;
        } // Backwards-compat with node 0.10.x


        EventEmitter.EventEmitter = EventEmitter;
        EventEmitter.prototype._events = undefined;
        EventEmitter.prototype._eventsCount = 0;
        EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
        // added to it. This is a useful default which helps finding memory leaks.

        var defaultMaxListeners = 10;

        function checkListener(listener) {
          if (typeof listener !== 'function') {
            throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
          }
        }

        Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
          enumerable: true,
          get: function () {
            return defaultMaxListeners;
          },
          set: function (arg) {
            if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
              throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
            }

            defaultMaxListeners = arg;
          }
        });

        EventEmitter.init = function () {
          if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
            this._events = Object.create(null);
            this._eventsCount = 0;
          }

          this._maxListeners = this._maxListeners || undefined;
        }; // Obviously not all Emitters should be limited to 10. This function allows
        // that to be increased. Set to zero for unlimited.


        EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
          if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
            throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
          }

          this._maxListeners = n;
          return this;
        };

        function _getMaxListeners(that) {
          if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
          return that._maxListeners;
        }

        EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
          return _getMaxListeners(this);
        };

        EventEmitter.prototype.emit = function emit(type) {
          var args = [];

          for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

          var doError = type === 'error';
          var events = this._events;
          if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

          if (doError) {
            var er;
            if (args.length > 0) er = args[0];

            if (er instanceof Error) {
              // Note: The comments on the `throw` lines are intentional, they show
              // up in Node's output if this results in an unhandled exception.
              throw er; // Unhandled 'error' event
            } // At least give some kind of context to the user


            var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
            err.context = er;
            throw err; // Unhandled 'error' event
          }

          var handler = events[type];
          if (handler === undefined) return false;

          if (typeof handler === 'function') {
            ReflectApply(handler, this, args);
          } else {
            var len = handler.length;
            var listeners = arrayClone(handler, len);

            for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
          }

          return true;
        };

        function _addListener(target, type, listener, prepend) {
          var m;
          var events;
          var existing;
          checkListener(listener);
          events = target._events;

          if (events === undefined) {
            events = target._events = Object.create(null);
            target._eventsCount = 0;
          } else {
            // To avoid recursion in the case that type === "newListener"! Before
            // adding it to the listeners, first emit "newListener".
            if (events.newListener !== undefined) {
              target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
              // this._events to be assigned to a new object

              events = target._events;
            }

            existing = events[type];
          }

          if (existing === undefined) {
            // Optimize the case of one listener. Don't need the extra array object.
            existing = events[type] = listener;
            ++target._eventsCount;
          } else {
            if (typeof existing === 'function') {
              // Adding the second element, need to change to array.
              existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
            } else if (prepend) {
              existing.unshift(listener);
            } else {
              existing.push(listener);
            } // Check for listener leak


            m = _getMaxListeners(target);

            if (m > 0 && existing.length > m && !existing.warned) {
              existing.warned = true; // No error code for this since it is a Warning
              // eslint-disable-next-line no-restricted-syntax

              var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
              w.name = 'MaxListenersExceededWarning';
              w.emitter = target;
              w.type = type;
              w.count = existing.length;
              ProcessEmitWarning(w);
            }
          }

          return target;
        }

        EventEmitter.prototype.addListener = function addListener(type, listener) {
          return _addListener(this, type, listener, false);
        };

        EventEmitter.prototype.on = EventEmitter.prototype.addListener;

        EventEmitter.prototype.prependListener = function prependListener(type, listener) {
          return _addListener(this, type, listener, true);
        };

        function onceWrapper() {
          if (!this.fired) {
            this.target.removeListener(this.type, this.wrapFn);
            this.fired = true;
            if (arguments.length === 0) return this.listener.call(this.target);
            return this.listener.apply(this.target, arguments);
          }
        }

        function _onceWrap(target, type, listener) {
          var state = {
            fired: false,
            wrapFn: undefined,
            target: target,
            type: type,
            listener: listener
          };
          var wrapped = onceWrapper.bind(state);
          wrapped.listener = listener;
          state.wrapFn = wrapped;
          return wrapped;
        }

        EventEmitter.prototype.once = function once(type, listener) {
          checkListener(listener);
          this.on(type, _onceWrap(this, type, listener));
          return this;
        };

        EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
          checkListener(listener);
          this.prependListener(type, _onceWrap(this, type, listener));
          return this;
        }; // Emits a 'removeListener' event if and only if the listener was removed.


        EventEmitter.prototype.removeListener = function removeListener(type, listener) {
          var list, events, position, i, originalListener;
          checkListener(listener);
          events = this._events;
          if (events === undefined) return this;
          list = events[type];
          if (list === undefined) return this;

          if (list === listener || list.listener === listener) {
            if (--this._eventsCount === 0) this._events = Object.create(null);else {
              delete events[type];
              if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
            }
          } else if (typeof list !== 'function') {
            position = -1;

            for (i = list.length - 1; i >= 0; i--) {
              if (list[i] === listener || list[i].listener === listener) {
                originalListener = list[i].listener;
                position = i;
                break;
              }
            }

            if (position < 0) return this;
            if (position === 0) list.shift();else {
              spliceOne(list, position);
            }
            if (list.length === 1) events[type] = list[0];
            if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
          }

          return this;
        };

        EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

        EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
          var listeners, events, i;
          events = this._events;
          if (events === undefined) return this; // not listening for removeListener, no need to emit

          if (events.removeListener === undefined) {
            if (arguments.length === 0) {
              this._events = Object.create(null);
              this._eventsCount = 0;
            } else if (events[type] !== undefined) {
              if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
            }

            return this;
          } // emit removeListener for all listeners on all events


          if (arguments.length === 0) {
            var keys = Object.keys(events);
            var key;

            for (i = 0; i < keys.length; ++i) {
              key = keys[i];
              if (key === 'removeListener') continue;
              this.removeAllListeners(key);
            }

            this.removeAllListeners('removeListener');
            this._events = Object.create(null);
            this._eventsCount = 0;
            return this;
          }

          listeners = events[type];

          if (typeof listeners === 'function') {
            this.removeListener(type, listeners);
          } else if (listeners !== undefined) {
            // LIFO order
            for (i = listeners.length - 1; i >= 0; i--) {
              this.removeListener(type, listeners[i]);
            }
          }

          return this;
        };

        function _listeners(target, type, unwrap) {
          var events = target._events;
          if (events === undefined) return [];
          var evlistener = events[type];
          if (evlistener === undefined) return [];
          if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
          return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
        }

        EventEmitter.prototype.listeners = function listeners(type) {
          return _listeners(this, type, true);
        };

        EventEmitter.prototype.rawListeners = function rawListeners(type) {
          return _listeners(this, type, false);
        };

        EventEmitter.listenerCount = function (emitter, type) {
          if (typeof emitter.listenerCount === 'function') {
            return emitter.listenerCount(type);
          } else {
            return listenerCount.call(emitter, type);
          }
        };

        EventEmitter.prototype.listenerCount = listenerCount;

        function listenerCount(type) {
          var events = this._events;

          if (events !== undefined) {
            var evlistener = events[type];

            if (typeof evlistener === 'function') {
              return 1;
            } else if (evlistener !== undefined) {
              return evlistener.length;
            }
          }

          return 0;
        }

        EventEmitter.prototype.eventNames = function eventNames() {
          return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
        };

        function arrayClone(arr, n) {
          var copy = new Array(n);

          for (var i = 0; i < n; ++i) copy[i] = arr[i];

          return copy;
        }

        function spliceOne(list, index) {
          for (; index + 1 < list.length; index++) list[index] = list[index + 1];

          list.pop();
        }

        function unwrapListeners(arr) {
          var ret = new Array(arr.length);

          for (var i = 0; i < ret.length; ++i) {
            ret[i] = arr[i].listener || arr[i];
          }

          return ret;
        }

        function once(emitter, name) {
          return new Promise(function (resolve, reject) {
            function eventListener() {
              if (errorListener !== undefined) {
                emitter.removeListener('error', errorListener);
              }

              resolve([].slice.call(arguments));
            }

            var errorListener; // Adding an error listener is not optional because
            // if an error is thrown on an event emitter we cannot
            // guarantee that the actual event we are waiting will
            // be fired. The result could be a silent way to create
            // memory or file descriptor leaks, which is something
            // we should avoid.

            if (name !== 'error') {
              errorListener = function errorListener(err) {
                emitter.removeListener(name, eventListener);
                reject(err);
              };

              emitter.once('error', errorListener);
            }

            emitter.once(name, eventListener);
          });
        } // #endregion ORIGINAL CODE


        _cjsExports = exports('default', module.exports);
        module.exports.once;
      }, {});
    }
  };
});

System.register("chunks:///_virtual/events.mjs_cjs=&original=.js", ['./events.js', './cjs-loader.mjs'], function (exports, module) {
  var __cjsMetaURL, loader;

  return {
    setters: [function (module) {
      __cjsMetaURL = module.__cjsMetaURL;
      var _setter = {};
      _setter.__cjsMetaURL = module.__cjsMetaURL;
      _setter.default = module.default;
      exports(_setter);
    }, function (module) {
      loader = module.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './events.js'~
      if (!__cjsMetaURL) {
        loader.throwInvalidWrapper('./events.js', module.meta.url);
      }

      loader.require(__cjsMetaURL);
    }
  };
});

System.register("chunks:///_virtual/game-network.mjs_cjs=&original=.js", ['./game-network.js', './cjs-loader.mjs'], function (exports, module) {
  var __cjsMetaURL, loader;

  return {
    setters: [function (module) {
      __cjsMetaURL = module.__cjsMetaURL;
      var _setter = {};
      _setter.__cjsMetaURL = module.__cjsMetaURL;
      _setter.default = module.default;
      exports(_setter);
    }, function (module) {
      loader = module.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './game-network.js'~
      if (!__cjsMetaURL) {
        loader.throwInvalidWrapper('./game-network.js', module.meta.url);
      }

      loader.require(__cjsMetaURL);
    }
  };
});

System.register("chunks:///_virtual/gfModuleBig.mjs_cjs=&original=.js", ['./gfModuleBig.js', './cjs-loader.mjs'], function (exports, module) {
  var __cjsMetaURL, loader;

  return {
    setters: [function (module) {
      __cjsMetaURL = module.__cjsMetaURL;
      var _setter = {};
      _setter.__cjsMetaURL = module.__cjsMetaURL;
      _setter.default = module.default;
      exports(_setter);
    }, function (module) {
      loader = module.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './gfModuleBig.js'~
      if (!__cjsMetaURL) {
        loader.throwInvalidWrapper('./gfModuleBig.js', module.meta.url);
      }

      loader.require(__cjsMetaURL);
    }
  };
});

System.register("chunks:///_virtual/IndexedDB.mjs_cjs=&original=.js", ['./IndexedDB.js', './cjs-loader.mjs'], function (exports, module) {
  var __cjsMetaURL, loader;

  return {
    setters: [function (module) {
      __cjsMetaURL = module.__cjsMetaURL;
      var _setter = {};
      _setter.__cjsMetaURL = module.__cjsMetaURL;
      _setter.default = module.default;
      exports(_setter);
    }, function (module) {
      loader = module.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './IndexedDB.js'~
      if (!__cjsMetaURL) {
        loader.throwInvalidWrapper('./IndexedDB.js', module.meta.url);
      }

      loader.require(__cjsMetaURL);
    }
  };
});

System.register("chunks:///_virtual/rollupPluginModLoBabelHelpers.js", [], function (exports) {
  return {
    execute: function () {
      exports({
        applyDecoratedDescriptor: _applyDecoratedDescriptor,
        initializerDefineProperty: _initializerDefineProperty
      });

      function _initializerDefineProperty(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
          enumerable: descriptor.enumerable,
          configurable: descriptor.configurable,
          writable: descriptor.writable,
          value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
      }

      function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object.keys(descriptor).forEach(function (key) {
          desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
          desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
          return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
          desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
          desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
          Object.defineProperty(target, property, desc);
          desc = null;
        }

        return desc;
      }
    }
  };
});

System.register("chunks:///_virtual/state-machine-history.min.mjs_cjs=&original=.js", ['./state-machine-history.min.js', './cjs-loader.mjs'], function (exports, module) {
  var __cjsMetaURL, loader;

  return {
    setters: [function (module) {
      __cjsMetaURL = module.__cjsMetaURL;
      var _setter = {};
      _setter.__cjsMetaURL = module.__cjsMetaURL;
      _setter.default = module.default;
      exports(_setter);
    }, function (module) {
      loader = module.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './state-machine-history.min.js'~
      if (!__cjsMetaURL) {
        loader.throwInvalidWrapper('./state-machine-history.min.js', module.meta.url);
      }

      loader.require(__cjsMetaURL);
    }
  };
});

System.register("chunks:///_virtual/state-machine.min.mjs_cjs=&original=.js", ['./state-machine.min.js', './cjs-loader.mjs'], function (exports, module) {
  var __cjsMetaURL, loader;

  return {
    setters: [function (module) {
      __cjsMetaURL = module.__cjsMetaURL;
      var _setter = {};
      _setter.__cjsMetaURL = module.__cjsMetaURL;
      _setter.default = module.default;
      exports(_setter);
    }, function (module) {
      loader = module.default;
    }],
    execute: function () {
      // I am the facade module who provides access to the CommonJS module './state-machine.min.js'~
      if (!__cjsMetaURL) {
        loader.throwInvalidWrapper('./state-machine.min.js', module.meta.url);
      }

      loader.require(__cjsMetaURL);
    }
  };
});

System.register("chunks:///_virtual/utils2.ts", ['./Big.mjs_cjs=&original=3.js', 'cc'], function (exports) {
  return {
    setters: [null, null],
    execute: function () {
      exports('getRandomInt', getRandomInt);

      function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    }
  };
});

} }; });
//# sourceMappingURL=bundle.js.map