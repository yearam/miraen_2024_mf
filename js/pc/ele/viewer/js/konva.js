! function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = t || self).Konva = e()
}(this, (function () {
    "use strict";
    /*
     * Konva JavaScript Framework v7.2.0
     * http://konvajs.org/
     * Licensed under the MIT
     * Date: Mon Nov 23 2020
     *
     * Original work Copyright (C) 2011 - 2013 by Eric Rowell (KineticJS)
     * Modified work Copyright (C) 2014 - present by Anton Lavrenov (Konva)
     *
     * @license
     */
    var t = Math.PI / 180;
    var e = function (t) {
        var e = t.indexOf("msie ");
        if (e > 0) return parseInt(t.substring(e + 5, t.indexOf(".", e)), 10);
        if (t.indexOf("trident/") > 0) {
            var i = t.indexOf("rv:");
            return parseInt(t.substring(i + 3, t.indexOf(".", i)), 10)
        }
        var n = t.indexOf("edge/");
        return n > 0 && parseInt(t.substring(n + 5, t.indexOf(".", n)), 10)
    },
        i = function (t) {
            var i = t.toLowerCase(),
                n = /(chrome)[ /]([\w.]+)/.exec(i) || /(webkit)[ /]([\w.]+)/.exec(i) || /(opera)(?:.*version|)[ /]([\w.]+)/.exec(i) || /(msie) ([\w.]+)/.exec(i) || i.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(i) || [],
                r = !!t.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i),
                o = !!t.match(/IEMobile/i);
            return {
                browser: n[1] || "",
                version: n[2] || "0",
                isIE: e(i),
                mobile: r,
                ieMobile: o
            }
        },
        n = "undefined" != typeof global ? global : "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope ? self : {},
        r = {
            _global: n,
            version: "7.2.0",
            isBrowser: "undefined" != typeof window && ("[object Window]" === {}.toString.call(window) || "[object global]" === {}.toString.call(window)),
            isUnminified: /param/.test(function (t) { }.toString()),
            dblClickWindow: 400,
            getAngle: function (e) {
                return r.angleDeg ? e * t : e
            },
            enableTrace: !1,
            _pointerEventsEnabled: !1,
            hitOnDragEnabled: !1,
            captureTouchEventsEnabled: !1,
            listenClickTap: !1,
            inDblClickWindow: !1,
            pixelRatio: void 0,
            dragDistance: 3,
            angleDeg: !0,
            showWarnings: !0,
            dragButtons: [0, 1],
            isDragging: function () {
                return r.DD.isDragging
            },
            isDragReady: function () {
                return !!r.DD.node
            },
            UA: i(n.navigator && n.navigator.userAgent || ""),
            document: n.document,
            _injectGlobal: function (t) {
                n.Konva = t
            },
            _parseUA: i
        },
        o = {},
        a = function (t) {
            o[t.prototype.getClassName()] = t, r[t.prototype.getClassName()] = t
        },
        s = function () {
            function t() { }
            return t.toCollection = function (e) {
                var i, n = new t,
                    r = e.length;
                for (i = 0; i < r; i++) n.push(e[i]);
                return n
            }, t._mapMethod = function (e) {
                t.prototype[e] = function () {
                    var t, i = this.length,
                        n = [].slice.call(arguments);
                    for (t = 0; t < i; t++) this[t][e].apply(this[t], n);
                    return this
                }
            }, t.mapMethods = function (e) {
                var i = e.prototype;
                for (var n in i) t._mapMethod(n)
            }, t
        }();
    s.prototype = [], s.prototype.each = function (t) {
        for (var e = 0; e < this.length; e++) t(this[e], e)
    }, s.prototype.toArray = function () {
        var t, e = [],
            i = this.length;
        for (t = 0; t < i; t++) e.push(this[t]);
        return e
    };
    var h = function () {
        function t(t) {
            void 0 === t && (t = [1, 0, 0, 1, 0, 0]), this.dirty = !1, this.m = t && t.slice() || [1, 0, 0, 1, 0, 0]
        }
        return t.prototype.reset = function () {
            this.m[0] = 1, this.m[1] = 0, this.m[2] = 0, this.m[3] = 1, this.m[4] = 0, this.m[5] = 0
        }, t.prototype.copy = function () {
            return new t(this.m)
        }, t.prototype.copyInto = function (t) {
            t.m[0] = this.m[0], t.m[1] = this.m[1], t.m[2] = this.m[2], t.m[3] = this.m[3], t.m[4] = this.m[4], t.m[5] = this.m[5]
        }, t.prototype.point = function (t) {
            var e = this.m;
            return {
                x: e[0] * t.x + e[2] * t.y + e[4],
                y: e[1] * t.x + e[3] * t.y + e[5]
            }
        }, t.prototype.translate = function (t, e) {
            return this.m[4] += this.m[0] * t + this.m[2] * e, this.m[5] += this.m[1] * t + this.m[3] * e, this
        }, t.prototype.scale = function (t, e) {
            return this.m[0] *= t, this.m[1] *= t, this.m[2] *= e, this.m[3] *= e, this
        }, t.prototype.rotate = function (t) {
            var e = Math.cos(t),
                i = Math.sin(t),
                n = this.m[0] * e + this.m[2] * i,
                r = this.m[1] * e + this.m[3] * i,
                o = this.m[0] * -i + this.m[2] * e,
                a = this.m[1] * -i + this.m[3] * e;
            return this.m[0] = n, this.m[1] = r, this.m[2] = o, this.m[3] = a, this
        }, t.prototype.getTranslation = function () {
            return {
                x: this.m[4],
                y: this.m[5]
            }
        }, t.prototype.skew = function (t, e) {
            var i = this.m[0] + this.m[2] * e,
                n = this.m[1] + this.m[3] * e,
                r = this.m[2] + this.m[0] * t,
                o = this.m[3] + this.m[1] * t;
            return this.m[0] = i, this.m[1] = n, this.m[2] = r, this.m[3] = o, this
        }, t.prototype.multiply = function (t) {
            var e = this.m[0] * t.m[0] + this.m[2] * t.m[1],
                i = this.m[1] * t.m[0] + this.m[3] * t.m[1],
                n = this.m[0] * t.m[2] + this.m[2] * t.m[3],
                r = this.m[1] * t.m[2] + this.m[3] * t.m[3],
                o = this.m[0] * t.m[4] + this.m[2] * t.m[5] + this.m[4],
                a = this.m[1] * t.m[4] + this.m[3] * t.m[5] + this.m[5];
            return this.m[0] = e, this.m[1] = i, this.m[2] = n, this.m[3] = r, this.m[4] = o, this.m[5] = a, this
        }, t.prototype.invert = function () {
            var t = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]),
                e = this.m[3] * t,
                i = -this.m[1] * t,
                n = -this.m[2] * t,
                r = this.m[0] * t,
                o = t * (this.m[2] * this.m[5] - this.m[3] * this.m[4]),
                a = t * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
            return this.m[0] = e, this.m[1] = i, this.m[2] = n, this.m[3] = r, this.m[4] = o, this.m[5] = a, this
        }, t.prototype.getMatrix = function () {
            return this.m
        }, t.prototype.setAbsolutePosition = function (t, e) {
            var i = this.m[0],
                n = this.m[1],
                r = this.m[2],
                o = this.m[3],
                a = this.m[4],
                s = (i * (e - this.m[5]) - n * (t - a)) / (i * o - n * r),
                h = (t - a - r * s) / i;
            return this.translate(h, s)
        }, t.prototype.decompose = function () {
            var t = this.m[0],
                e = this.m[1],
                i = this.m[2],
                n = this.m[3],
                r = t * n - e * i,
                o = {
                    x: this.m[4],
                    y: this.m[5],
                    rotation: 0,
                    scaleX: 0,
                    scaleY: 0,
                    skewX: 0,
                    skewY: 0
                };
            if (0 != t || 0 != e) {
                var a = Math.sqrt(t * t + e * e);
                o.rotation = e > 0 ? Math.acos(t / a) : -Math.acos(t / a), o.scaleX = a, o.scaleY = r / a, o.skewX = (t * i + e * n) / r, o.skewY = 0
            } else if (0 != i || 0 != n) {
                var s = Math.sqrt(i * i + n * n);
                o.rotation = Math.PI / 2 - (n > 0 ? Math.acos(-i / s) : -Math.acos(i / s)), o.scaleX = r / s, o.scaleY = s, o.skewX = 0, o.skewY = (t * i + e * n) / r
            }
            return o.rotation = f._getRotation(o.rotation), o
        }, t
    }(),
        l = Math.PI / 180,
        c = 180 / Math.PI,
        d = {
            aliceblue: [240, 248, 255],
            antiquewhite: [250, 235, 215],
            aqua: [0, 255, 255],
            aquamarine: [127, 255, 212],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            bisque: [255, 228, 196],
            black: [0, 0, 0],
            blanchedalmond: [255, 235, 205],
            blue: [0, 0, 255],
            blueviolet: [138, 43, 226],
            brown: [165, 42, 42],
            burlywood: [222, 184, 135],
            cadetblue: [95, 158, 160],
            chartreuse: [127, 255, 0],
            chocolate: [210, 105, 30],
            coral: [255, 127, 80],
            cornflowerblue: [100, 149, 237],
            cornsilk: [255, 248, 220],
            crimson: [220, 20, 60],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgoldenrod: [184, 132, 11],
            darkgray: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkgrey: [169, 169, 169],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkseagreen: [143, 188, 143],
            darkslateblue: [72, 61, 139],
            darkslategray: [47, 79, 79],
            darkslategrey: [47, 79, 79],
            darkturquoise: [0, 206, 209],
            darkviolet: [148, 0, 211],
            deeppink: [255, 20, 147],
            deepskyblue: [0, 191, 255],
            dimgray: [105, 105, 105],
            dimgrey: [105, 105, 105],
            dodgerblue: [30, 144, 255],
            firebrick: [178, 34, 34],
            floralwhite: [255, 255, 240],
            forestgreen: [34, 139, 34],
            fuchsia: [255, 0, 255],
            gainsboro: [220, 220, 220],
            ghostwhite: [248, 248, 255],
            gold: [255, 215, 0],
            goldenrod: [218, 165, 32],
            gray: [128, 128, 128],
            green: [0, 128, 0],
            greenyellow: [173, 255, 47],
            grey: [128, 128, 128],
            honeydew: [240, 255, 240],
            hotpink: [255, 105, 180],
            indianred: [205, 92, 92],
            indigo: [75, 0, 130],
            ivory: [255, 255, 240],
            khaki: [240, 230, 140],
            lavender: [230, 230, 250],
            lavenderblush: [255, 240, 245],
            lawngreen: [124, 252, 0],
            lemonchiffon: [255, 250, 205],
            lightblue: [173, 216, 230],
            lightcoral: [240, 128, 128],
            lightcyan: [224, 255, 255],
            lightgoldenrodyellow: [250, 250, 210],
            lightgray: [211, 211, 211],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255, 182, 193],
            lightsalmon: [255, 160, 122],
            lightseagreen: [32, 178, 170],
            lightskyblue: [135, 206, 250],
            lightslategray: [119, 136, 153],
            lightslategrey: [119, 136, 153],
            lightsteelblue: [176, 196, 222],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            limegreen: [50, 205, 50],
            linen: [250, 240, 230],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            mediumaquamarine: [102, 205, 170],
            mediumblue: [0, 0, 205],
            mediumorchid: [186, 85, 211],
            mediumpurple: [147, 112, 219],
            mediumseagreen: [60, 179, 113],
            mediumslateblue: [123, 104, 238],
            mediumspringgreen: [0, 250, 154],
            mediumturquoise: [72, 209, 204],
            mediumvioletred: [199, 21, 133],
            midnightblue: [25, 25, 112],
            mintcream: [245, 255, 250],
            mistyrose: [255, 228, 225],
            moccasin: [255, 228, 181],
            navajowhite: [255, 222, 173],
            navy: [0, 0, 128],
            oldlace: [253, 245, 230],
            olive: [128, 128, 0],
            olivedrab: [107, 142, 35],
            orange: [255, 165, 0],
            orangered: [255, 69, 0],
            orchid: [218, 112, 214],
            palegoldenrod: [238, 232, 170],
            palegreen: [152, 251, 152],
            paleturquoise: [175, 238, 238],
            palevioletred: [219, 112, 147],
            papayawhip: [255, 239, 213],
            peachpuff: [255, 218, 185],
            peru: [205, 133, 63],
            pink: [255, 192, 203],
            plum: [221, 160, 203],
            powderblue: [176, 224, 230],
            purple: [128, 0, 128],
            rebeccapurple: [102, 51, 153],
            red: [255, 0, 0],
            rosybrown: [188, 143, 143],
            royalblue: [65, 105, 225],
            saddlebrown: [139, 69, 19],
            salmon: [250, 128, 114],
            sandybrown: [244, 164, 96],
            seagreen: [46, 139, 87],
            seashell: [255, 245, 238],
            sienna: [160, 82, 45],
            silver: [192, 192, 192],
            skyblue: [135, 206, 235],
            slateblue: [106, 90, 205],
            slategray: [119, 128, 144],
            slategrey: [119, 128, 144],
            snow: [255, 255, 250],
            springgreen: [0, 255, 127],
            steelblue: [70, 130, 180],
            tan: [210, 180, 140],
            teal: [0, 128, 128],
            thistle: [216, 191, 216],
            transparent: [255, 255, 255, 0],
            tomato: [255, 99, 71],
            turquoise: [64, 224, 208],
            violet: [238, 130, 238],
            wheat: [245, 222, 179],
            white: [255, 255, 255],
            whitesmoke: [245, 245, 245],
            yellow: [255, 255, 0],
            yellowgreen: [154, 205, 5]
        },
        u = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/,
        p = [],
        f = {
            _isElement: function (t) {
                return !(!t || 1 != t.nodeType)
            },
            _isFunction: function (t) {
                return !!(t && t.constructor && t.call && t.apply)
            },
            _isPlainObject: function (t) {
                return !!t && t.constructor === Object
            },
            _isArray: function (t) {
                return "[object Array]" === Object.prototype.toString.call(t)
            },
            _isNumber: function (t) {
                return "[object Number]" === Object.prototype.toString.call(t) && !isNaN(t) && isFinite(t)
            },
            _isString: function (t) {
                return "[object String]" === Object.prototype.toString.call(t)
            },
            _isBoolean: function (t) {
                return "[object Boolean]" === Object.prototype.toString.call(t)
            },
            isObject: function (t) {
                return t instanceof Object
            },
            isValidSelector: function (t) {
                if ("string" != typeof t) return !1;
                var e = t[0];
                return "#" === e || "." === e || e === e.toUpperCase()
            },
            _sign: function (t) {
                return 0 === t ? 0 : t > 0 ? 1 : -1
            },
            requestAnimFrame: function (t) {
                p.push(t), 1 === p.length && requestAnimationFrame((function () {
                    var t = p;
                    p = [], t.forEach((function (t) {
                        t()
                    }))
                }))
            },
            createCanvasElement: function () {
                var t = document.createElement("canvas");
                try {
                    t.style = t.style || {}
                } catch (t) { }
                return t
            },
            createImageElement: function () {
                return document.createElement("img")
            },
            _isInDocument: function (t) {
                for (; t = t.parentNode;)
                    if (t == document) return !0;
                return !1
            },
            _simplifyArray: function (t) {
                var e, i, n = [],
                    r = t.length,
                    o = f;
                for (e = 0; e < r; e++) i = t[e], o._isNumber(i) ? i = Math.round(1e3 * i) / 1e3 : o._isString(i) || (i = i.toString()), n.push(i);
                return n
            },
            _urlToImage: function (t, e) {
                var i = new n.Image;
                i.onload = function () {
                    e(i)
                }, i.src = t
            },
            _rgbToHex: function (t, e, i) {
                return ((1 << 24) + (t << 16) + (e << 8) + i).toString(16).slice(1)
            },
            _hexToRgb: function (t) {
                t = t.replace("#", "");
                var e = parseInt(t, 16);
                return {
                    r: e >> 16 & 255,
                    g: e >> 8 & 255,
                    b: 255 & e
                }
            },
            getRandomColor: function () {
                for (var t = (16777215 * Math.random() << 0).toString(16); t.length < 6;) t = "0" + t;
                return "#" + t
            },
            get: function (t, e) {
                return void 0 === t ? e : t
            },
            getRGB: function (t) {
                var e;
                return t in d ? {
                    r: (e = d[t])[0],
                    g: e[1],
                    b: e[2]
                } : "#" === t[0] ? this._hexToRgb(t.substring(1)) : "rgb(" === t.substr(0, 4) ? (e = u.exec(t.replace(/ /g, "")), {
                    r: parseInt(e[1], 10),
                    g: parseInt(e[2], 10),
                    b: parseInt(e[3], 10)
                }) : {
                    r: 0,
                    g: 0,
                    b: 0
                }
            },
            colorToRGBA: function (t) {
                return t = t || "black", f._namedColorToRBA(t) || f._hex3ColorToRGBA(t) || f._hex6ColorToRGBA(t) || f._rgbColorToRGBA(t) || f._rgbaColorToRGBA(t) || f._hslColorToRGBA(t)
            },
            _namedColorToRBA: function (t) {
                var e = d[t.toLowerCase()];
                return e ? {
                    r: e[0],
                    g: e[1],
                    b: e[2],
                    a: 1
                } : null
            },
            _rgbColorToRGBA: function (t) {
                if (0 === t.indexOf("rgb(")) {
                    var e = (t = t.match(/rgb\(([^)]+)\)/)[1]).split(/ *, */).map(Number);
                    return {
                        r: e[0],
                        g: e[1],
                        b: e[2],
                        a: 1
                    }
                }
            },
            _rgbaColorToRGBA: function (t) {
                if (0 === t.indexOf("rgba(")) {
                    var e = (t = t.match(/rgba\(([^)]+)\)/)[1]).split(/ *, */).map(Number);
                    return {
                        r: e[0],
                        g: e[1],
                        b: e[2],
                        a: e[3]
                    }
                }
            },
            _hex6ColorToRGBA: function (t) {
                if ("#" === t[0] && 7 === t.length) return {
                    r: parseInt(t.slice(1, 3), 16),
                    g: parseInt(t.slice(3, 5), 16),
                    b: parseInt(t.slice(5, 7), 16),
                    a: 1
                }
            },
            _hex3ColorToRGBA: function (t) {
                if ("#" === t[0] && 4 === t.length) return {
                    r: parseInt(t[1] + t[1], 16),
                    g: parseInt(t[2] + t[2], 16),
                    b: parseInt(t[3] + t[3], 16),
                    a: 1
                }
            },
            _hslColorToRGBA: function (t) {
                if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(t)) {
                    var e = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(t),
                        i = (e[0], e.slice(1)),
                        n = Number(i[0]) / 360,
                        r = Number(i[1]) / 100,
                        o = Number(i[2]) / 100,
                        a = void 0,
                        s = void 0,
                        h = void 0;
                    if (0 === r) return h = 255 * o, {
                        r: Math.round(h),
                        g: Math.round(h),
                        b: Math.round(h),
                        a: 1
                    };
                    for (var l = 2 * o - (a = o < .5 ? o * (1 + r) : o + r - o * r), c = [0, 0, 0], d = 0; d < 3; d++)(s = n + 1 / 3 * -(d - 1)) < 0 && s++, s > 1 && s--, h = 6 * s < 1 ? l + 6 * (a - l) * s : 2 * s < 1 ? a : 3 * s < 2 ? l + (a - l) * (2 / 3 - s) * 6 : l, c[d] = 255 * h;
                    return {
                        r: Math.round(c[0]),
                        g: Math.round(c[1]),
                        b: Math.round(c[2]),
                        a: 1
                    }
                }
            },
            haveIntersection: function (t, e) {
                return !(e.x > t.x + t.width || e.x + e.width < t.x || e.y > t.y + t.height || e.y + e.height < t.y)
            },
            cloneObject: function (t) {
                var e = {};
                for (var i in t) this._isPlainObject(t[i]) ? e[i] = this.cloneObject(t[i]) : this._isArray(t[i]) ? e[i] = this.cloneArray(t[i]) : e[i] = t[i];
                return e
            },
            cloneArray: function (t) {
                return t.slice(0)
            },
            _degToRad: function (t) {
                return t * l
            },
            _radToDeg: function (t) {
                return t * c
            },
            _getRotation: function (t) {
                return r.angleDeg ? f._radToDeg(t) : t
            },
            _capitalize: function (t) {
                return t.charAt(0).toUpperCase() + t.slice(1)
            },
            throw: function (t) {
                throw new Error("Konva error: " + t)
            },
            error: function (t) {
                console.error("Konva error: " + t)
            },
            warn: function (t) {
                r.showWarnings && console.warn("Konva warning: " + t)
            },
            extend: function (t, e) {
                function i() {
                    this.constructor = t
                }
                i.prototype = e.prototype;
                var n = t.prototype;
                for (var r in t.prototype = new i, n) n.hasOwnProperty(r) && (t.prototype[r] = n[r]);
                t.__super__ = e.prototype, t.super = e
            },
            _getControlPoints: function (t, e, i, n, r, o, a) {
                var s = Math.sqrt(Math.pow(i - t, 2) + Math.pow(n - e, 2)),
                    h = Math.sqrt(Math.pow(r - i, 2) + Math.pow(o - n, 2)),
                    l = a * s / (s + h),
                    c = a * h / (s + h);
                return [i - l * (r - t), n - l * (o - e), i + c * (r - t), n + c * (o - e)]
            },
            _expandPoints: function (t, e) {
                var i, n, r = t.length,
                    o = [];
                for (i = 2; i < r - 2; i += 2) n = f._getControlPoints(t[i - 2], t[i - 1], t[i], t[i + 1], t[i + 2], t[i + 3], e), o.push(n[0]), o.push(n[1]), o.push(t[i]), o.push(t[i + 1]), o.push(n[2]), o.push(n[3]);
                return o
            },
            each: function (t, e) {
                for (var i in t) e(i, t[i])
            },
            _inRange: function (t, e, i) {
                return e <= t && t < i
            },
            _getProjectionToSegment: function (t, e, i, n, r, o) {
                var a, s, h, l = (t - i) * (t - i) + (e - n) * (e - n);
                if (0 == l) a = t, s = e, h = (r - i) * (r - i) + (o - n) * (o - n);
                else {
                    var c = ((r - t) * (i - t) + (o - e) * (n - e)) / l;
                    c < 0 ? (a = t, s = e, h = (t - r) * (t - r) + (e - o) * (e - o)) : c > 1 ? (a = i, s = n, h = (i - r) * (i - r) + (n - o) * (n - o)) : h = ((a = t + c * (i - t)) - r) * (a - r) + ((s = e + c * (n - e)) - o) * (s - o)
                }
                return [a, s, h]
            },
            _getProjectionToLine: function (t, e, i) {
                var n = f.cloneObject(t),
                    r = Number.MAX_VALUE;
                return e.forEach((function (o, a) {
                    if (i || a !== e.length - 1) {
                        var s = e[(a + 1) % e.length],
                            h = f._getProjectionToSegment(o.x, o.y, s.x, s.y, t.x, t.y),
                            l = h[0],
                            c = h[1],
                            d = h[2];
                        d < r && (n.x = l, n.y = c, r = d)
                    }
                })), n
            },
            _prepareArrayForTween: function (t, e, i) {
                var n, r = [],
                    o = [];
                if (t.length > e.length) {
                    var a = e;
                    e = t, t = a
                }
                for (n = 0; n < t.length; n += 2) r.push({
                    x: t[n],
                    y: t[n + 1]
                });
                for (n = 0; n < e.length; n += 2) o.push({
                    x: e[n],
                    y: e[n + 1]
                });
                var s = [];
                return o.forEach((function (t) {
                    var e = f._getProjectionToLine(t, r, i);
                    s.push(e.x), s.push(e.y)
                })), s
            },
            _prepareToStringify: function (t) {
                var e;
                for (var i in t.visitedByCircularReferenceRemoval = !0, t)
                    if (t.hasOwnProperty(i) && t[i] && "object" == typeof t[i])
                        if (e = Object.getOwnPropertyDescriptor(t, i), t[i].visitedByCircularReferenceRemoval || f._isElement(t[i])) {
                            if (!e.configurable) return null;
                            delete t[i]
                        } else if (null === f._prepareToStringify(t[i])) {
                            if (!e.configurable) return null;
                            delete t[i]
                        }
                return delete t.visitedByCircularReferenceRemoval, t
            },
            _assign: function (t, e) {
                for (var i in e) t[i] = e[i];
                return t
            },
            _getFirstPointerId: function (t) {
                return t.touches ? t.changedTouches[0].identifier : 999
            }
        };

    function g(t) {
        return f._isString(t) ? '"' + t + '"' : "[object Number]" === Object.prototype.toString.call(t) || f._isBoolean(t) ? t : Object.prototype.toString.call(t)
    }

    function v(t) {
        return t > 255 ? 255 : t < 0 ? 0 : Math.round(t)
    }

    function y() {
        if (r.isUnminified) return function (t, e) {
            return f._isNumber(t) || f.warn(g(t) + ' is a not valid value for "' + e + '" attribute. The value should be a number.'), t
        }
    }

    function m(t) {
        if (r.isUnminified) return function (e, i) {
            var n = f._isNumber(e),
                r = f._isArray(e) && e.length == t;
            return n || r || f.warn(g(e) + ' is a not valid value for "' + i + '" attribute. The value should be a number or Array<number>(' + t + ")"), e
        }
    }

    function _() {
        if (r.isUnminified) return function (t, e) {
            return f._isNumber(t) || "auto" === t || f.warn(g(t) + ' is a not valid value for "' + e + '" attribute. The value should be a number or "auto".'), t
        }
    }

    function b() {
        if (r.isUnminified) return function (t, e) {
            return f._isString(t) || f.warn(g(t) + ' is a not valid value for "' + e + '" attribute. The value should be a string.'), t
        }
    }

    function x() {
        if (r.isUnminified) return function (t, e) {
            var i = f._isString(t),
                n = "[object CanvasGradient]" === Object.prototype.toString.call(t);
            return i || n || f.warn(g(t) + ' is a not valid value for "' + e + '" attribute. The value should be a string or a native gradient.'), t
        }
    }

    function S() {
        if (r.isUnminified) return function (t, e) {
            return !0 === t || !1 === t || f.warn(g(t) + ' is a not valid value for "' + e + '" attribute. The value should be a boolean.'), t
        }
    }
    var w = {
        addGetterSetter: function (t, e, i, n, r) {
            w.addGetter(t, e, i), w.addSetter(t, e, n, r), w.addOverloadedGetterSetter(t, e)
        },
        addGetter: function (t, e, i) {
            var n = "get" + f._capitalize(e);
            t.prototype[n] = t.prototype[n] || function () {
                var t = this.attrs[e];
                return void 0 === t ? i : t
            }
        },
        addSetter: function (t, e, i, n) {
            var r = "set" + f._capitalize(e);
            t.prototype[r] || w.overWriteSetter(t, e, i, n)
        },
        overWriteSetter: function (t, e, i, n) {
            var r = "set" + f._capitalize(e);
            t.prototype[r] = function (t) {
                return i && null != t && (t = i.call(this, t, e)), this._setAttr(e, t), n && n.call(this), this
            }
        },
        addComponentsGetterSetter: function (t, e, i, n, o) {
            var a, s, h = i.length,
                l = f._capitalize,
                c = "get" + l(e),
                d = "set" + l(e);
            t.prototype[c] = function () {
                var t = {};
                for (a = 0; a < h; a++) t[s = i[a]] = this.getAttr(e + l(s));
                return t
            };
            var u = function (t) {
                if (r.isUnminified) return function (e, i) {
                    return f.isObject(e) || f.warn(g(e) + ' is a not valid value for "' + i + '" attribute. The value should be an object with properties ' + t), e
                }
            }(i);
            t.prototype[d] = function (t) {
                var i, r = this.attrs[e];
                for (i in n && (t = n.call(this, t)), u && u.call(this, t, e), t) t.hasOwnProperty(i) && this._setAttr(e + l(i), t[i]);
                return this._fireChangeEvent(e, r, t), o && o.call(this), this
            }, w.addOverloadedGetterSetter(t, e)
        },
        addOverloadedGetterSetter: function (t, e) {
            var i = f._capitalize(e),
                n = "set" + i,
                r = "get" + i;
            t.prototype[e] = function () {
                return arguments.length ? (this[n](arguments[0]), this) : this[r]()
            }
        },
        addDeprecatedGetterSetter: function (t, e, i, n) {
            f.error("Adding deprecated " + e);
            var r = "get" + f._capitalize(e),
                o = e + " property is deprecated and will be removed soon. Look at Konva change log for more information.";
            t.prototype[r] = function () {
                f.error(o);
                var t = this.attrs[e];
                return void 0 === t ? i : t
            }, w.addSetter(t, e, n, (function () {
                f.error(o)
            })), w.addOverloadedGetterSetter(t, e)
        },
        backCompat: function (t, e) {
            f.each(e, (function (e, i) {
                var n = t.prototype[i],
                    r = "get" + f._capitalize(e),
                    o = "set" + f._capitalize(e);

                function a() {
                    n.apply(this, arguments), f.error('"' + e + '" method is deprecated and will be removed soon. Use ""' + i + '" instead.')
                }
                t.prototype[e] = a, t.prototype[r] = a, t.prototype[o] = a
            }))
        },
        afterSetFilter: function () {
            this._filterUpToDate = !1
        }
    },
        C = function (t, e) {
            return (C = Object.setPrototypeOf || {
                __proto__: []
            }
                instanceof Array && function (t, e) {
                    t.__proto__ = e
                } || function (t, e) {
                    for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i])
                })(t, e)
        };

    function P(t, e) {
        function i() {
            this.constructor = t
        }
        C(t, e), t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i)
    }
    var k = function () {
        return (k = Object.assign || function (t) {
            for (var e, i = 1, n = arguments.length; i < n; i++)
                for (var r in e = arguments[i]) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t
        }).apply(this, arguments)
    };
    var T = ["arc", "arcTo", "beginPath", "bezierCurveTo", "clearRect", "clip", "closePath", "createLinearGradient", "createPattern", "createRadialGradient", "drawImage", "ellipse", "fill", "fillText", "getImageData", "createImageData", "lineTo", "moveTo", "putImageData", "quadraticCurveTo", "rect", "restore", "rotate", "save", "scale", "setLineDash", "setTransform", "stroke", "strokeText", "transform", "translate"],
        A = function () {
            function t(t) {
                this.canvas = t, this._context = t._canvas.getContext("2d"), r.enableTrace && (this.traceArr = [], this._enableTrace())
            }
            return t.prototype.fillShape = function (t) {
                t.fillEnabled() && this._fill(t)
            }, t.prototype._fill = function (t) { }, t.prototype.strokeShape = function (t) {
                t.hasStroke() && this._stroke(t)
            }, t.prototype._stroke = function (t) { }, t.prototype.fillStrokeShape = function (t) {
                t.attrs.fillAfterStrokeEnabled ? (this.strokeShape(t), this.fillShape(t)) : (this.fillShape(t), this.strokeShape(t))
            }, t.prototype.getTrace = function (t) {
                var e, i, n, r, o = this.traceArr,
                    a = o.length,
                    s = "";
                for (e = 0; e < a; e++)(n = (i = o[e]).method) ? (r = i.args, s += n, t ? s += "()" : f._isArray(r[0]) ? s += "([" + r.join(",") + "])" : s += "(" + r.join(",") + ")") : (s += i.property, t || (s += "=" + i.val)), s += ";";
                return s
            }, t.prototype.clearTrace = function () {
                this.traceArr = []
            }, t.prototype._trace = function (t) {
                var e = this.traceArr;
                e.push(t), e.length >= 100 && e.shift()
            }, t.prototype.reset = function () {
                var t = this.getCanvas().getPixelRatio();
                this.setTransform(1 * t, 0, 0, 1 * t, 0, 0)
            }, t.prototype.getCanvas = function () {
                return this.canvas
            }, t.prototype.clear = function (t) {
                var e = this.getCanvas();
                t ? this.clearRect(t.x || 0, t.y || 0, t.width || 0, t.height || 0) : this.clearRect(0, 0, e.getWidth() / e.pixelRatio, e.getHeight() / e.pixelRatio)
            }, t.prototype._applyLineCap = function (t) {
                var e = t.getLineCap();
                e && this.setAttr("lineCap", e)
            }, t.prototype._applyOpacity = function (t) {
                var e = t.getAbsoluteOpacity();
                1 !== e && this.setAttr("globalAlpha", e)
            }, t.prototype._applyLineJoin = function (t) {
                var e = t.attrs.lineJoin;
                e && this.setAttr("lineJoin", e)
            }, t.prototype.setAttr = function (t, e) {
                this._context[t] = e
            }, t.prototype.arc = function (t, e, i, n, r, o) {
                this._context.arc(t, e, i, n, r, o)
            }, t.prototype.arcTo = function (t, e, i, n, r) {
                this._context.arcTo(t, e, i, n, r)
            }, t.prototype.beginPath = function () {
                this._context.beginPath()
            }, t.prototype.bezierCurveTo = function (t, e, i, n, r, o) {
                this._context.bezierCurveTo(t, e, i, n, r, o)
            }, t.prototype.clearRect = function (t, e, i, n) {
                this._context.clearRect(t, e, i, n)
            }, t.prototype.clip = function () {
                this._context.clip()
            }, t.prototype.closePath = function () {
                this._context.closePath()
            }, t.prototype.createImageData = function (t, e) {
                var i = arguments;
                return 2 === i.length ? this._context.createImageData(t, e) : 1 === i.length ? this._context.createImageData(t) : void 0
            }, t.prototype.createLinearGradient = function (t, e, i, n) {
                return this._context.createLinearGradient(t, e, i, n)
            }, t.prototype.createPattern = function (t, e) {
                return this._context.createPattern(t, e)
            }, t.prototype.createRadialGradient = function (t, e, i, n, r, o) {
                return this._context.createRadialGradient(t, e, i, n, r, o)
            }, t.prototype.drawImage = function (t, e, i, n, r, o, a, s, h) {
                var l = arguments,
                    c = this._context;
                3 === l.length ? c.drawImage(t, e, i) : 5 === l.length ? c.drawImage(t, e, i, n, r) : 9 === l.length && c.drawImage(t, e, i, n, r, o, a, s, h)
            }, t.prototype.ellipse = function (t, e, i, n, r, o, a, s) {
                this._context.ellipse(t, e, i, n, r, o, a, s)
            }, t.prototype.isPointInPath = function (t, e) {
                return this._context.isPointInPath(t, e)
            }, t.prototype.fill = function () {
                this._context.fill()
            }, t.prototype.fillRect = function (t, e, i, n) {
                this._context.fillRect(t, e, i, n)
            }, t.prototype.strokeRect = function (t, e, i, n) {
                this._context.strokeRect(t, e, i, n)
            }, t.prototype.fillText = function (t, e, i) {
                this._context.fillText(t, e, i)
            }, t.prototype.measureText = function (t) {
                return this._context.measureText(t)
            }, t.prototype.getImageData = function (t, e, i, n) {
                return this._context.getImageData(t, e, i, n)
            }, t.prototype.lineTo = function (t, e) {
                this._context.lineTo(t, e)
            }, t.prototype.moveTo = function (t, e) {
                this._context.moveTo(t, e)
            }, t.prototype.rect = function (t, e, i, n) {
                this._context.rect(t, e, i, n)
            }, t.prototype.putImageData = function (t, e, i) {
                this._context.putImageData(t, e, i)
            }, t.prototype.quadraticCurveTo = function (t, e, i, n) {
                this._context.quadraticCurveTo(t, e, i, n)
            }, t.prototype.restore = function () {
                this._context.restore()
            }, t.prototype.rotate = function (t) {
                this._context.rotate(t)
            }, t.prototype.save = function () {
                this._context.save()
            }, t.prototype.scale = function (t, e) {
                this._context.scale(t, e)
            }, t.prototype.setLineDash = function (t) {
                this._context.setLineDash ? this._context.setLineDash(t) : "mozDash" in this._context ? this._context.mozDash = t : "webkitLineDash" in this._context && (this._context.webkitLineDash = t)
            }, t.prototype.getLineDash = function () {
                return this._context.getLineDash()
            }, t.prototype.setTransform = function (t, e, i, n, r, o) {
                this._context.setTransform(t, e, i, n, r, o)
            }, t.prototype.stroke = function () {
                this._context.stroke()
            }, t.prototype.strokeText = function (t, e, i, n) {
                this._context.strokeText(t, e, i, n)
            }, t.prototype.transform = function (t, e, i, n, r, o) {
                this._context.transform(t, e, i, n, r, o)
            }, t.prototype.translate = function (t, e) {
                this._context.translate(t, e)
            }, t.prototype._enableTrace = function () {
                var t, e, i = this,
                    n = T.length,
                    r = f._simplifyArray,
                    o = this.setAttr,
                    a = function (t) {
                        var n, o = i[t];
                        i[t] = function () {
                            return e = r(Array.prototype.slice.call(arguments, 0)), n = o.apply(i, arguments), i._trace({
                                method: t,
                                args: e
                            }), n
                        }
                    };
                for (t = 0; t < n; t++) a(T[t]);
                i.setAttr = function () {
                    o.apply(i, arguments);
                    var t = arguments[0],
                        e = arguments[1];
                    "shadowOffsetX" !== t && "shadowOffsetY" !== t && "shadowBlur" !== t || (e /= this.canvas.getPixelRatio()), i._trace({
                        property: t,
                        val: e
                    })
                }
            }, t.prototype._applyGlobalCompositeOperation = function (t) {
                var e = t.getGlobalCompositeOperation();
                "source-over" !== e && this.setAttr("globalCompositeOperation", e)
            }, t
        }();
    ["fillStyle", "strokeStyle", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "lineCap", "lineDashOffset", "lineJoin", "lineWidth", "miterLimit", "font", "textAlign", "textBaseline", "globalAlpha", "globalCompositeOperation", "imageSmoothingEnabled"].forEach((function (t) {
        Object.defineProperty(A.prototype, t, {
            get: function () {
                return this._context[t]
            },
            set: function (e) {
                this._context[t] = e
            }
        })
    }));
    var M, G = function (t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        return P(e, t), e.prototype._fillColor = function (t) {
            var e = t.fill();
            this.setAttr("fillStyle", e), t._fillFunc(this)
        }, e.prototype._fillPattern = function (t) {
            var e = t.getFillPatternX(),
                i = t.getFillPatternY(),
                n = r.getAngle(t.getFillPatternRotation()),
                o = t.getFillPatternOffsetX(),
                a = t.getFillPatternOffsetY();
            t.getFillPatternScaleX(), t.getFillPatternScaleY();
            (e || i) && this.translate(e || 0, i || 0), n && this.rotate(n), (o || a) && this.translate(-1 * o, -1 * a), this.setAttr("fillStyle", t._getFillPattern()), t._fillFunc(this)
        }, e.prototype._fillLinearGradient = function (t) {
            var e = t._getLinearGradient();
            e && (this.setAttr("fillStyle", e), t._fillFunc(this))
        }, e.prototype._fillRadialGradient = function (t) {
            var e = t._getRadialGradient();
            e && (this.setAttr("fillStyle", e), t._fillFunc(this))
        }, e.prototype._fill = function (t) {
            var e = t.fill(),
                i = t.getFillPriority();
            if (e && "color" === i) this._fillColor(t);
            else {
                var n = t.getFillPatternImage();
                if (n && "pattern" === i) this._fillPattern(t);
                else {
                    var r = t.getFillLinearGradientColorStops();
                    if (r && "linear-gradient" === i) this._fillLinearGradient(t);
                    else {
                        var o = t.getFillRadialGradientColorStops();
                        o && "radial-gradient" === i ? this._fillRadialGradient(t) : e ? this._fillColor(t) : n ? this._fillPattern(t) : r ? this._fillLinearGradient(t) : o && this._fillRadialGradient(t)
                    }
                }
            }
        }, e.prototype._strokeLinearGradient = function (t) {
            var e = t.getStrokeLinearGradientStartPoint(),
                i = t.getStrokeLinearGradientEndPoint(),
                n = t.getStrokeLinearGradientColorStops(),
                r = this.createLinearGradient(e.x, e.y, i.x, i.y);
            if (n) {
                for (var o = 0; o < n.length; o += 2) r.addColorStop(n[o], n[o + 1]);
                this.setAttr("strokeStyle", r)
            }
        }, e.prototype._stroke = function (t) {
            var e = t.dash(),
                i = t.getStrokeScaleEnabled();
            if (t.hasStroke()) {
                if (!i) {
                    this.save();
                    var n = this.getCanvas().getPixelRatio();
                    this.setTransform(n, 0, 0, n, 0, 0)
                }
                this._applyLineCap(t), e && t.dashEnabled() && (this.setLineDash(e), this.setAttr("lineDashOffset", t.dashOffset())), this.setAttr("lineWidth", t.strokeWidth()), t.getShadowForStrokeEnabled() || this.setAttr("shadowColor", "rgba(0,0,0,0)"), t.getStrokeLinearGradientColorStops() ? this._strokeLinearGradient(t) : this.setAttr("strokeStyle", t.stroke()), t._strokeFunc(this), i || this.restore()
            }
        }, e.prototype._applyShadow = function (t) {
            var e = f,
                i = e.get(t.getShadowRGBA(), "black"),
                n = e.get(t.getShadowBlur(), 5),
                r = e.get(t.getShadowOffset(), {
                    x: 0,
                    y: 0
                }),
                o = t.getAbsoluteScale(),
                a = this.canvas.getPixelRatio(),
                s = o.x * a,
                h = o.y * a;
            this.setAttr("shadowColor", i), this.setAttr("shadowBlur", n * Math.min(Math.abs(s), Math.abs(h))), this.setAttr("shadowOffsetX", r.x * s), this.setAttr("shadowOffsetY", r.y * h)
        }, e
    }(A),
        R = function (t) {
            function e() {
                return null !== t && t.apply(this, arguments) || this
            }
            return P(e, t), e.prototype._fill = function (t) {
                this.save(), this.setAttr("fillStyle", t.colorKey), t._fillFuncHit(this), this.restore()
            }, e.prototype.strokeShape = function (t) {
                t.hasHitStroke() && this._stroke(t)
            }, e.prototype._stroke = function (t) {
                if (t.hasHitStroke()) {
                    var e = t.getStrokeScaleEnabled();
                    if (!e) {
                        this.save();
                        var i = this.getCanvas().getPixelRatio();
                        this.setTransform(i, 0, 0, i, 0, 0)
                    }
                    this._applyLineCap(t);
                    var n = t.hitStrokeWidth(),
                        r = "auto" === n ? t.strokeWidth() : n;
                    this.setAttr("lineWidth", r), this.setAttr("strokeStyle", t.colorKey), t._strokeFuncHit(this), e || this.restore()
                }
            }, e
        }(A);
    var L = function () {
        function t(t) {
            this.pixelRatio = 1, this.width = 0, this.height = 0, this.isCache = !1;
            var e = (t || {}).pixelRatio || r.pixelRatio || function () {
                if (M) return M;
                var t = f.createCanvasElement().getContext("2d");
                return M = (r._global.devicePixelRatio || 1) / (t.webkitBackingStorePixelRatio || t.mozBackingStorePixelRatio || t.msBackingStorePixelRatio || t.oBackingStorePixelRatio || t.backingStorePixelRatio || 1)
            }();
            this.pixelRatio = e, this._canvas = f.createCanvasElement(), this._canvas.style.padding = "0", this._canvas.style.margin = "0", this._canvas.style.border = "0", this._canvas.style.background = "transparent", this._canvas.style.position = "absolute", this._canvas.style.top = "0", this._canvas.style.left = "0"
        }
        return t.prototype.getContext = function () {
            return this.context
        }, t.prototype.getPixelRatio = function () {
            return this.pixelRatio
        }, t.prototype.setPixelRatio = function (t) {
            var e = this.pixelRatio;
            this.pixelRatio = t, this.setSize(this.getWidth() / e, this.getHeight() / e)
        }, t.prototype.setWidth = function (t) {
            this.width = this._canvas.width = t * this.pixelRatio, this._canvas.style.width = t + "px";
            var e = this.pixelRatio;
            this.getContext()._context.scale(e, e)
        }, t.prototype.setHeight = function (t) {
            this.height = this._canvas.height = t * this.pixelRatio, this._canvas.style.height = t + "px";
            var e = this.pixelRatio;
            this.getContext()._context.scale(e, e)
        }, t.prototype.getWidth = function () {
            return this.width
        }, t.prototype.getHeight = function () {
            return this.height
        }, t.prototype.setSize = function (t, e) {
            this.setWidth(t || 0), this.setHeight(e || 0)
        }, t.prototype.toDataURL = function (t, e) {
            try {
                return this._canvas.toDataURL(t, e)
            } catch (t) {
                try {
                    return this._canvas.toDataURL()
                } catch (t) {
                    return f.error("Unable to get data URL. " + t.message + " For more info read https://konvajs.org/docs/posts/Tainted_Canvas.html."), ""
                }
            }
        }, t
    }();
    w.addGetterSetter(L, "pixelRatio", void 0, y());
    var E = function (t) {
        function e(e) {
            void 0 === e && (e = {
                width: 0,
                height: 0
            });
            var i = t.call(this, e) || this;
            return i.context = new G(i), i.setSize(e.width, e.height), i
        }
        return P(e, t), e
    }(L),
        O = function (t) {
            function e(e) {
                void 0 === e && (e = {
                    width: 0,
                    height: 0
                });
                var i = t.call(this, e) || this;
                return i.hitCanvas = !0, i.context = new R(i), i.setSize(e.width, e.height), i
            }
            return P(e, t), e
        }(L),
        D = {
            get isDragging() {
                var t = !1;
                return D._dragElements.forEach((function (e) {
                    "dragging" === e.dragStatus && (t = !0)
                })), t
            },
            justDragged: !1,
            get node() {
                var t;
                return D._dragElements.forEach((function (e) {
                    t = e.node
                })), t
            },
            _dragElements: new Map,
            _drag: function (t) {
                var e = [];
                D._dragElements.forEach((function (i, n) {
                    var r = i.node,
                        o = r.getStage();
                    o.setPointersPositions(t), void 0 === i.pointerId && (i.pointerId = f._getFirstPointerId(t));
                    var a = o._changedPointerPositions.find((function (t) {
                        return t.id === i.pointerId
                    }));
                    if (a) {
                        if ("dragging" !== i.dragStatus) {
                            var s = r.dragDistance();
                            if (Math.max(Math.abs(a.x - i.startPointerPos.x), Math.abs(a.y - i.startPointerPos.y)) < s) return;
                            if (r.startDrag({
                                evt: t
                            }), !r.isDragging()) return
                        }
                        r._setDragPosition(t, i), e.push(r)
                    }
                })), e.forEach((function (e) {
                    e.fire("dragmove", {
                        type: "dragmove",
                        target: e,
                        evt: t
                    }, !0)
                }))
            },
            _endDragBefore: function (t) {
                D._dragElements.forEach((function (e, i) {
                    var n = e.node.getStage();
                    if (t && n.setPointersPositions(t), n._changedPointerPositions.find((function (t) {
                        return t.id === e.pointerId
                    }))) {
                        "dragging" !== e.dragStatus && "stopped" !== e.dragStatus || (D.justDragged = !0, r.listenClickTap = !1, e.dragStatus = "stopped");
                        var o = e.node.getLayer() || e.node instanceof r.Stage && e.node;
                        o && o.batchDraw()
                    }
                }))
            },
            _endDragAfter: function (t) {
                D._dragElements.forEach((function (e, i) {
                    "stopped" === e.dragStatus && e.node.fire("dragend", {
                        type: "dragend",
                        target: e.node,
                        evt: t
                    }, !0), "dragging" !== e.dragStatus && D._dragElements.delete(i)
                }))
            }
        };
    r.isBrowser && (window.addEventListener("mouseup", D._endDragBefore, !0), window.addEventListener("touchend", D._endDragBefore, !0), window.addEventListener("mousemove", D._drag), window.addEventListener("touchmove", D._drag), window.addEventListener("mouseup", D._endDragAfter, !1), window.addEventListener("touchend", D._endDragAfter, !1));
    var I = {},
        F = {},
        B = function (t, e) {
            t && I[t] === e && delete I[t]
        },
        N = function (t, e) {
            e && (F[e] || (F[e] = []), F[e].push(t))
        },
        z = function (t, e) {
            if (t) {
                var i = F[t];
                if (i) {
                    for (var n = 0; n < i.length; n++) {
                        i[n]._id === e && i.splice(n, 1)
                    }
                    0 === i.length && delete F[t]
                }
            }
        },
        W = ["xChange.konva", "yChange.konva", "scaleXChange.konva", "scaleYChange.konva", "skewXChange.konva", "skewYChange.konva", "rotationChange.konva", "offsetXChange.konva", "offsetYChange.konva", "transformsEnabledChange.konva"].join(" "),
        H = new s,
        Y = 1,
        X = function () {
            function t(t) {
                this._id = Y++, this.eventListeners = {}, this.attrs = {}, this.index = 0, this._allEventListeners = null, this.parent = null, this._cache = new Map, this._attachedDepsListeners = new Map, this._lastPos = null, this._batchingTransformChange = !1, this._needClearTransformCache = !1, this._filterUpToDate = !1, this._isUnderCache = !1, this.children = H, this._dragEventId = null, this._shouldFireChangeEvents = !1, this.setAttrs(t), this._shouldFireChangeEvents = !0
            }
            return t.prototype.hasChildren = function () {
                return !1
            }, t.prototype.getChildren = function () {
                return H
            }, t.prototype._clearCache = function (t) {
                "transform" !== t && "absoluteTransform" !== t || !this._cache.get(t) ? t ? this._cache.delete(t) : this._cache.clear() : this._cache.get(t).dirty = !0
            }, t.prototype._getCache = function (t, e) {
                var i = this._cache.get(t);
                return (void 0 === i || ("transform" === t || "absoluteTransform" === t) && !0 === i.dirty) && (i = e.call(this), this._cache.set(t, i)), i
            }, t.prototype._calculate = function (t, e, i) {
                var n = this;
                if (!this._attachedDepsListeners.get(t)) {
                    var r = e.map((function (t) {
                        return t + "Change.konva"
                    })).join(" ");
                    this.on(r, (function () {
                        n._clearCache(t)
                    })), this._attachedDepsListeners.set(t, !0)
                }
                return this._getCache(t, i)
            }, t.prototype._getCanvasCache = function () {
                return this._cache.get("canvas")
            }, t.prototype._clearSelfAndDescendantCache = function (t, e) {
                this._clearCache(t), e && "absoluteTransform" === t && this.fire("_clearTransformCache"), this.isCached() || this.children && this.children.each((function (e) {
                    e._clearSelfAndDescendantCache(t, !0)
                }))
            }, t.prototype.clearCache = function () {
                return this._cache.delete("canvas"), this._clearSelfAndDescendantCache(), this
            }, t.prototype.cache = function (t) {
                var e = t || {},
                    i = {};
                void 0 !== e.x && void 0 !== e.y && void 0 !== e.width && void 0 !== e.height || (i = this.getClientRect({
                    skipTransform: !0,
                    relativeTo: this.getParent()
                }));
                var n = Math.ceil(e.width || i.width),
                    r = Math.ceil(e.height || i.height),
                    o = e.pixelRatio,
                    a = void 0 === e.x ? i.x : e.x,
                    s = void 0 === e.y ? i.y : e.y,
                    h = e.offset || 0,
                    l = e.drawBorder || !1;
                if (n && r) {
                    a -= h, s -= h;
                    var c = new E({
                        pixelRatio: o,
                        width: n += 2 * h,
                        height: r += 2 * h
                    }),
                        d = new E({
                            pixelRatio: o,
                            width: 0,
                            height: 0
                        }),
                        u = new O({
                            pixelRatio: 1,
                            width: n,
                            height: r
                        }),
                        p = c.getContext(),
                        g = u.getContext();
                    return u.isCache = !0, c.isCache = !0, this._cache.delete("canvas"), this._filterUpToDate = !1, !1 === e.imageSmoothingEnabled && (c.getContext()._context.imageSmoothingEnabled = !1, d.getContext()._context.imageSmoothingEnabled = !1), p.save(), g.save(), p.translate(-a, -s), g.translate(-a, -s), this._isUnderCache = !0, this._clearSelfAndDescendantCache("absoluteOpacity"), this._clearSelfAndDescendantCache("absoluteScale"), this.drawScene(c, this), this.drawHit(u, this), this._isUnderCache = !1, p.restore(), g.restore(), l && (p.save(), p.beginPath(), p.rect(0, 0, n, r), p.closePath(), p.setAttr("strokeStyle", "red"), p.setAttr("lineWidth", 5), p.stroke(), p.restore()), this._cache.set("canvas", {
                        scene: c,
                        filter: d,
                        hit: u,
                        x: a,
                        y: s
                    }), this
                }
                f.error("Can not cache the node. Width or height of the node equals 0. Caching is skipped.")
            }, t.prototype.isCached = function () {
                return this._cache.has("canvas")
            }, t.prototype.getClientRect = function (t) {
                throw new Error('abstract "getClientRect" method call')
            }, t.prototype._transformedRect = function (t, e) {
                var i, n, r, o, a = [{
                    x: t.x,
                    y: t.y
                }, {
                    x: t.x + t.width,
                    y: t.y
                }, {
                    x: t.x + t.width,
                    y: t.y + t.height
                }, {
                    x: t.x,
                    y: t.y + t.height
                }],
                    s = this.getAbsoluteTransform(e);
                return a.forEach((function (t) {
                    var e = s.point(t);
                    void 0 === i && (i = r = e.x, n = o = e.y), i = Math.min(i, e.x), n = Math.min(n, e.y), r = Math.max(r, e.x), o = Math.max(o, e.y)
                })), {
                    x: i,
                    y: n,
                    width: r - i,
                    height: o - n
                }
            }, t.prototype._drawCachedSceneCanvas = function (t) {
                t.save(), t._applyOpacity(this), t._applyGlobalCompositeOperation(this);
                var e = this._getCanvasCache();
                t.translate(e.x, e.y);
                var i = this._getCachedSceneCanvas(),
                    n = i.pixelRatio;
                t.drawImage(i._canvas, 0, 0, i.width / n, i.height / n), t.restore()
            }, t.prototype._drawCachedHitCanvas = function (t) {
                var e = this._getCanvasCache(),
                    i = e.hit;
                t.save(), t.translate(e.x, e.y), t.drawImage(i._canvas, 0, 0), t.restore()
            }, t.prototype._getCachedSceneCanvas = function () {
                var t, e, i, n, r = this.filters(),
                    o = this._getCanvasCache(),
                    a = o.scene,
                    s = o.filter,
                    h = s.getContext();
                if (r) {
                    if (!this._filterUpToDate) {
                        var l = a.pixelRatio;
                        s.setSize(a.width / a.pixelRatio, a.height / a.pixelRatio);
                        try {
                            for (t = r.length, h.clear(), h.drawImage(a._canvas, 0, 0, a.getWidth() / l, a.getHeight() / l), e = h.getImageData(0, 0, s.getWidth(), s.getHeight()), i = 0; i < t; i++) "function" == typeof (n = r[i]) ? (n.call(this, e), h.putImageData(e, 0, 0)) : f.error("Filter should be type of function, but got " + typeof n + " instead. Please check correct filters")
                        } catch (t) {
                            f.error("Unable to apply filter. " + t.message + " This post my help you https://konvajs.org/docs/posts/Tainted_Canvas.html.")
                        }
                        this._filterUpToDate = !0
                    }
                    return s
                }
                return a
            }, t.prototype.on = function (t, e) {
                if (this._cache && this._cache.delete("allEventListeners"), 3 === arguments.length) return this._delegate.apply(this, arguments);
                var i, n, r, o, a = t.split(" "),
                    s = a.length;
                for (i = 0; i < s; i++) r = (n = a[i].split("."))[0], o = n[1] || "", this.eventListeners[r] || (this.eventListeners[r] = []), this.eventListeners[r].push({
                    name: o,
                    handler: e
                });
                return this
            }, t.prototype.off = function (t, e) {
                var i, n, r, o, a, s = (t || "").split(" "),
                    h = s.length;
                if (this._cache && this._cache.delete("allEventListeners"), !t)
                    for (n in this.eventListeners) this._off(n);
                for (i = 0; i < h; i++)
                    if (o = (r = s[i].split("."))[0], a = r[1], o) this.eventListeners[o] && this._off(o, a, e);
                    else
                        for (n in this.eventListeners) this._off(n, a, e);
                return this
            }, t.prototype.dispatchEvent = function (t) {
                var e = {
                    target: this,
                    type: t.type,
                    evt: t
                };
                return this.fire(t.type, e), this
            }, t.prototype.addEventListener = function (t, e) {
                return this.on(t, (function (t) {
                    e.call(this, t.evt)
                })), this
            }, t.prototype.removeEventListener = function (t) {
                return this.off(t), this
            }, t.prototype._delegate = function (t, e, i) {
                var n = this;
                this.on(t, (function (t) {
                    for (var r = t.target.findAncestors(e, !0, n), o = 0; o < r.length; o++)(t = f.cloneObject(t)).currentTarget = r[o], i.call(r[o], t)
                }))
            }, t.prototype.remove = function () {
                return this.isDragging() && this.stopDrag(), D._dragElements.delete(this._id), this._remove(), this
            }, t.prototype._clearCaches = function () {
                this._clearSelfAndDescendantCache("absoluteTransform"), this._clearSelfAndDescendantCache("absoluteOpacity"), this._clearSelfAndDescendantCache("absoluteScale"), this._clearSelfAndDescendantCache("stage"), this._clearSelfAndDescendantCache("visible"), this._clearSelfAndDescendantCache("listening")
            }, t.prototype._remove = function () {
                this._clearCaches();
                var t = this.getParent();
                t && t.children && (t.children.splice(this.index, 1), t._setChildrenIndices(), this.parent = null)
            }, t.prototype.destroy = function () {
                B(this.id(), this);
                for (var t = (this.name() || "").split(/\s/g), e = 0; e < t.length; e++) {
                    var i = t[e];
                    z(i, this._id)
                }
                return this.remove(), this
            }, t.prototype.getAttr = function (t) {
                var e = "get" + f._capitalize(t);
                return f._isFunction(this[e]) ? this[e]() : this.attrs[t]
            }, t.prototype.getAncestors = function () {
                for (var t = this.getParent(), e = new s; t;) e.push(t), t = t.getParent();
                return e
            }, t.prototype.getAttrs = function () {
                return this.attrs || {}
            }, t.prototype.setAttrs = function (t) {
                var e = this;
                return this._batchTransformChanges((function () {
                    var i, n;
                    if (!t) return e;
                    for (i in t) "children" !== i && (n = "set" + f._capitalize(i), f._isFunction(e[n]) ? e[n](t[i]) : e._setAttr(i, t[i]))
                })), this
            }, t.prototype.isListening = function () {
                return this._getCache("listening", this._isListening)
            }, t.prototype._isListening = function (t) {
                if (!this.listening()) return !1;
                var e = this.getParent();
                return !e || e === t || this === t || e._isListening(t)
            }, t.prototype.isVisible = function () {
                return this._getCache("visible", this._isVisible)
            }, t.prototype._isVisible = function (t) {
                if (!this.visible()) return !1;
                var e = this.getParent();
                return !e || e === t || this === t || e._isVisible(t)
            }, t.prototype.shouldDrawHit = function (t) {
                if (t) return this._isVisible(t) && this._isListening(t);
                var e = this.getLayer(),
                    i = !1;
                D._dragElements.forEach((function (t) {
                    "dragging" === t.dragStatus && ("Stage" === t.node.nodeType || t.node.getLayer() === e) && (i = !0)
                }));
                var n = !r.hitOnDragEnabled && i;
                return this.isListening() && this.isVisible() && !n
            }, t.prototype.show = function () {
                return this.visible(!0), this
            }, t.prototype.hide = function () {
                return this.visible(!1), this
            }, t.prototype.getZIndex = function () {
                return this.index || 0
            }, t.prototype.getAbsoluteZIndex = function () {
                var t, e, i, n, r = this.getDepth(),
                    o = this,
                    a = 0;
                return "Stage" !== o.nodeType && function s(h) {
                    for (t = [], e = h.length, i = 0; i < e; i++) n = h[i], a++, "Shape" !== n.nodeType && (t = t.concat(n.getChildren().toArray())), n._id === o._id && (i = e);
                    t.length > 0 && t[0].getDepth() <= r && s(t)
                }(o.getStage().getChildren()), a
            }, t.prototype.getDepth = function () {
                for (var t = 0, e = this.parent; e;) t++, e = e.parent;
                return t
            }, t.prototype._batchTransformChanges = function (t) {
                this._batchingTransformChange = !0, t(), this._batchingTransformChange = !1, this._needClearTransformCache && (this._clearCache("transform"), this._clearSelfAndDescendantCache("absoluteTransform", !0)), this._needClearTransformCache = !1
            }, t.prototype.setPosition = function (t) {
                var e = this;
                return this._batchTransformChanges((function () {
                    e.x(t.x), e.y(t.y)
                })), this
            }, t.prototype.getPosition = function () {
                return {
                    x: this.x(),
                    y: this.y()
                }
            }, t.prototype.getAbsolutePosition = function (t) {
                for (var e = !1, i = this.parent; i;) {
                    if (i.isCached()) {
                        e = !0;
                        break
                    }
                    i = i.parent
                }
                e && !t && (t = !0);
                var n = this.getAbsoluteTransform(t).getMatrix(),
                    r = new h,
                    o = this.offset();
                return r.m = n.slice(), r.translate(o.x, o.y), r.getTranslation()
            }, t.prototype.setAbsolutePosition = function (t) {
                var e = this._clearTransform();
                this.attrs.x = e.x, this.attrs.y = e.y, delete e.x, delete e.y, this._clearCache("transform");
                var i = this._getAbsoluteTransform().copy();
                return i.invert(), i.translate(t.x, t.y), t = {
                    x: this.attrs.x + i.getTranslation().x,
                    y: this.attrs.y + i.getTranslation().y
                }, this._setTransform(e), this.setPosition({
                    x: t.x,
                    y: t.y
                }), this._clearCache("transform"), this._clearSelfAndDescendantCache("absoluteTransform"), this
            }, t.prototype._setTransform = function (t) {
                var e;
                for (e in t) this.attrs[e] = t[e]
            }, t.prototype._clearTransform = function () {
                var t = {
                    x: this.x(),
                    y: this.y(),
                    rotation: this.rotation(),
                    scaleX: this.scaleX(),
                    scaleY: this.scaleY(),
                    offsetX: this.offsetX(),
                    offsetY: this.offsetY(),
                    skewX: this.skewX(),
                    skewY: this.skewY()
                };
                return this.attrs.x = 0, this.attrs.y = 0, this.attrs.rotation = 0, this.attrs.scaleX = 1, this.attrs.scaleY = 1, this.attrs.offsetX = 0, this.attrs.offsetY = 0, this.attrs.skewX = 0, this.attrs.skewY = 0, t
            }, t.prototype.move = function (t) {
                var e = t.x,
                    i = t.y,
                    n = this.x(),
                    r = this.y();
                return void 0 !== e && (n += e), void 0 !== i && (r += i), this.setPosition({
                    x: n,
                    y: r
                }), this
            }, t.prototype._eachAncestorReverse = function (t, e) {
                var i, n, r = [],
                    o = this.getParent();
                if (!e || e._id !== this._id) {
                    for (r.unshift(this); o && (!e || o._id !== e._id);) r.unshift(o), o = o.parent;
                    for (i = r.length, n = 0; n < i; n++) t(r[n])
                }
            }, t.prototype.rotate = function (t) {
                return this.rotation(this.rotation() + t), this
            }, t.prototype.moveToTop = function () {
                if (!this.parent) return f.warn("Node has no parent. moveToTop function is ignored."), !1;
                var t = this.index;
                return this.parent.children.splice(t, 1), this.parent.children.push(this), this.parent._setChildrenIndices(), !0
            }, t.prototype.moveUp = function () {
                if (!this.parent) return f.warn("Node has no parent. moveUp function is ignored."), !1;
                var t = this.index;
                return t < this.parent.getChildren().length - 1 && (this.parent.children.splice(t, 1), this.parent.children.splice(t + 1, 0, this), this.parent._setChildrenIndices(), !0)
            }, t.prototype.moveDown = function () {
                if (!this.parent) return f.warn("Node has no parent. moveDown function is ignored."), !1;
                var t = this.index;
                return t > 0 && (this.parent.children.splice(t, 1), this.parent.children.splice(t - 1, 0, this), this.parent._setChildrenIndices(), !0)
            }, t.prototype.moveToBottom = function () {
                if (!this.parent) return f.warn("Node has no parent. moveToBottom function is ignored."), !1;
                var t = this.index;
                return t > 0 && (this.parent.children.splice(t, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices(), !0)
            }, t.prototype.setZIndex = function (t) {
                if (!this.parent) return f.warn("Node has no parent. zIndex parameter is ignored."), this;
                (t < 0 || t >= this.parent.children.length) && f.warn("Unexpected value " + t + " for zIndex property. zIndex is just index of a node in children of its parent. Expected value is from 0 to " + (this.parent.children.length - 1) + ".");
                var e = this.index;
                return this.parent.children.splice(e, 1), this.parent.children.splice(t, 0, this), this.parent._setChildrenIndices(), this
            }, t.prototype.getAbsoluteOpacity = function () {
                return this._getCache("absoluteOpacity", this._getAbsoluteOpacity)
            }, t.prototype._getAbsoluteOpacity = function () {
                var t = this.opacity(),
                    e = this.getParent();
                return e && !e._isUnderCache && (t *= e.getAbsoluteOpacity()), t
            }, t.prototype.moveTo = function (t) {
                return this.getParent() !== t && (this._remove(), t.add(this)), this
            }, t.prototype.toObject = function () {
                var t, e, i, n, r = {},
                    o = this.getAttrs();
                for (t in r.attrs = {}, o) e = o[t], f.isObject(e) && !f._isPlainObject(e) && !f._isArray(e) || (i = "function" == typeof this[t] && this[t], delete o[t], n = i ? i.call(this) : null, o[t] = e, n !== e && (r.attrs[t] = e));
                return r.className = this.getClassName(), f._prepareToStringify(r)
            }, t.prototype.toJSON = function () {
                return JSON.stringify(this.toObject())
            }, t.prototype.getParent = function () {
                return this.parent
            }, t.prototype.findAncestors = function (t, e, i) {
                var n = [];
                e && this._isMatch(t) && n.push(this);
                for (var r = this.parent; r;) {
                    if (r === i) return n;
                    r._isMatch(t) && n.push(r), r = r.parent
                }
                return n
            }, t.prototype.isAncestorOf = function (t) {
                return !1
            }, t.prototype.findAncestor = function (t, e, i) {
                return this.findAncestors(t, e, i)[0]
            }, t.prototype._isMatch = function (t) {
                if (!t) return !1;
                if ("function" == typeof t) return t(this);
                var e, i, n = t.replace(/ /g, "").split(","),
                    r = n.length;
                for (e = 0; e < r; e++)
                    if (i = n[e], f.isValidSelector(i) || (f.warn('Selector "' + i + '" is invalid. Allowed selectors examples are "#foo", ".bar" or "Group".'), f.warn('If you have a custom shape with such className, please change it to start with upper letter like "Triangle".'), f.warn("Konva is awesome, right?")), "#" === i.charAt(0)) {
                        if (this.id() === i.slice(1)) return !0
                    } else if ("." === i.charAt(0)) {
                        if (this.hasName(i.slice(1))) return !0
                    } else if (this.className === i || this.nodeType === i) return !0;
                return !1
            }, t.prototype.getLayer = function () {
                var t = this.getParent();
                return t ? t.getLayer() : null
            }, t.prototype.getStage = function () {
                return this._getCache("stage", this._getStage)
            }, t.prototype._getStage = function () {
                var t = this.getParent();
                return t ? t.getStage() : void 0
            }, t.prototype.fire = function (t, e, i) {
                return void 0 === e && (e = {}), e.target = e.target || this, i ? this._fireAndBubble(t, e) : this._fire(t, e), this
            }, t.prototype.getAbsoluteTransform = function (t) {
                return t ? this._getAbsoluteTransform(t) : this._getCache("absoluteTransform", this._getAbsoluteTransform)
            }, t.prototype._getAbsoluteTransform = function (t) {
                var e;
                if (t) return e = new h, this._eachAncestorReverse((function (t) {
                    var i = t.transformsEnabled();
                    "all" === i ? e.multiply(t.getTransform()) : "position" === i && e.translate(t.x() - t.offsetX(), t.y() - t.offsetY())
                }), t), e;
                e = this._cache.get("absoluteTransform") || new h, this.parent ? this.parent.getAbsoluteTransform().copyInto(e) : e.reset();
                var i = this.transformsEnabled();
                if ("all" === i) e.multiply(this.getTransform());
                else if ("position" === i) {
                    var n = this.attrs.x || 0,
                        r = this.attrs.y || 0,
                        o = this.attrs.offsetX || 0,
                        a = this.attrs.offsetY || 0;
                    e.translate(n - o, r - a)
                }
                return e.dirty = !1, e
            }, t.prototype.getAbsoluteScale = function (t) {
                for (var e = this; e;) e._isUnderCache && (t = e), e = e.getParent();
                var i = this.getAbsoluteTransform(t).decompose();
                return {
                    x: i.scaleX,
                    y: i.scaleY
                }
            }, t.prototype.getAbsoluteRotation = function () {
                return this.getAbsoluteTransform().decompose().rotation
            }, t.prototype.getTransform = function () {
                return this._getCache("transform", this._getTransform)
            }, t.prototype._getTransform = function () {
                var t, e, i = this._cache.get("transform") || new h;
                i.reset();
                var n = this.x(),
                    o = this.y(),
                    a = r.getAngle(this.rotation()),
                    s = null !== (t = this.attrs.scaleX) && void 0 !== t ? t : 1,
                    l = null !== (e = this.attrs.scaleY) && void 0 !== e ? e : 1,
                    c = this.attrs.skewX || 0,
                    d = this.attrs.skewY || 0,
                    u = this.attrs.offsetX || 0,
                    p = this.attrs.offsetY || 0;
                return 0 === n && 0 === o || i.translate(n, o), 0 !== a && i.rotate(a), 0 === c && 0 === d || i.skew(c, d), 1 === s && 1 === l || i.scale(s, l), 0 === u && 0 === p || i.translate(-1 * u, -1 * p), i.dirty = !1, i
            }, t.prototype.clone = function (t) {
                var e, i, n, r, o, a = f.cloneObject(this.attrs);
                for (e in t) a[e] = t[e];
                var s = new this.constructor(a);
                for (e in this.eventListeners)
                    for (n = (i = this.eventListeners[e]).length, r = 0; r < n; r++)(o = i[r]).name.indexOf("konva") < 0 && (s.eventListeners[e] || (s.eventListeners[e] = []), s.eventListeners[e].push(o));
                return s
            }, t.prototype._toKonvaCanvas = function (t) {
                t = t || {};
                var e = this.getClientRect(),
                    i = this.getStage(),
                    n = void 0 !== t.x ? t.x : e.x,
                    r = void 0 !== t.y ? t.y : e.y,
                    o = t.pixelRatio || 1,
                    a = new E({
                        width: t.width || e.width || (i ? i.width() : 0),
                        height: t.height || e.height || (i ? i.height() : 0),
                        pixelRatio: o
                    }),
                    s = a.getContext();
                return s.save(), (n || r) && s.translate(-1 * n, -1 * r), this.drawScene(a), s.restore(), a
            }, t.prototype.toCanvas = function (t) {
                return this._toKonvaCanvas(t)._canvas
            }, t.prototype.toDataURL = function (t) {
                var e = (t = t || {}).mimeType || null,
                    i = t.quality || null,
                    n = this._toKonvaCanvas(t).toDataURL(e, i);
                return t.callback && t.callback(n), n
            }, t.prototype.toImage = function (t) {
                if (!t || !t.callback) throw "callback required for toImage method config argument";
                var e = t.callback;
                delete t.callback, f._urlToImage(this.toDataURL(t), (function (t) {
                    e(t)
                }))
            }, t.prototype.setSize = function (t) {
                return this.width(t.width), this.height(t.height), this
            }, t.prototype.getSize = function () {
                return {
                    width: this.width(),
                    height: this.height()
                }
            }, t.prototype.getClassName = function () {
                return this.className || this.nodeType
            }, t.prototype.getType = function () {
                return this.nodeType
            }, t.prototype.getDragDistance = function () {
                return void 0 !== this.attrs.dragDistance ? this.attrs.dragDistance : this.parent ? this.parent.getDragDistance() : r.dragDistance
            }, t.prototype._off = function (t, e, i) {
                var n, r, o, a = this.eventListeners[t];
                for (n = 0; n < a.length; n++)
                    if (r = a[n].name, o = a[n].handler, !("konva" === r && "konva" !== e || e && r !== e || i && i !== o)) {
                        if (a.splice(n, 1), 0 === a.length) {
                            delete this.eventListeners[t];
                            break
                        }
                        n--
                    }
            }, t.prototype._fireChangeEvent = function (t, e, i) {
                this._fire(t + "Change", {
                    oldVal: e,
                    newVal: i
                })
            }, t.prototype.setId = function (t) {
                var e = this.id();
                return B(e, this),
                    function (t, e) {
                        e && (I[e] = t)
                    }(this, t), this._setAttr("id", t), this
            }, t.prototype.setName = function (t) {
                var e, i, n = (this.name() || "").split(/\s/g),
                    r = (t || "").split(/\s/g);
                for (i = 0; i < n.length; i++) e = n[i], -1 === r.indexOf(e) && e && z(e, this._id);
                for (i = 0; i < r.length; i++) e = r[i], -1 === n.indexOf(e) && e && N(this, e);
                return this._setAttr("name", t), this
            }, t.prototype.addName = function (t) {
                if (!this.hasName(t)) {
                    var e = this.name(),
                        i = e ? e + " " + t : t;
                    this.setName(i)
                }
                return this
            }, t.prototype.hasName = function (t) {
                if (!t) return !1;
                var e = this.name();
                return !!e && -1 !== (e || "").split(/\s/g).indexOf(t)
            }, t.prototype.removeName = function (t) {
                var e = (this.name() || "").split(/\s/g),
                    i = e.indexOf(t);
                return -1 !== i && (e.splice(i, 1), this.setName(e.join(" "))), this
            }, t.prototype.setAttr = function (t, e) {
                var i = this["set" + f._capitalize(t)];
                return f._isFunction(i) ? i.call(this, e) : this._setAttr(t, e), this
            }, t.prototype._setAttr = function (t, e, i) {
                var n = this.attrs[t];
                (n !== e || f.isObject(e)) && (null == e ? delete this.attrs[t] : this.attrs[t] = e, this._shouldFireChangeEvents && this._fireChangeEvent(t, n, e))
            }, t.prototype._setComponentAttr = function (t, e, i) {
                var n;
                void 0 !== i && ((n = this.attrs[t]) || (this.attrs[t] = this.getAttr(t)), this.attrs[t][e] = i, this._fireChangeEvent(t, n, i))
            }, t.prototype._fireAndBubble = function (t, e, i) {
                if (e && "Shape" === this.nodeType && (e.target = this), !(("mouseenter" === t || "mouseleave" === t) && (i && (this === i || this.isAncestorOf && this.isAncestorOf(i)) || "Stage" === this.nodeType && !i))) {
                    this._fire(t, e);
                    var n = ("mouseenter" === t || "mouseleave" === t) && i && i.isAncestorOf && i.isAncestorOf(this) && !i.isAncestorOf(this.parent);
                    (e && !e.cancelBubble || !e) && this.parent && this.parent.isListening() && !n && (i && i.parent ? this._fireAndBubble.call(this.parent, t, e, i) : this._fireAndBubble.call(this.parent, t, e))
                }
            }, t.prototype._getProtoListeners = function (t) {
                var e = this._cache.get("allEventListeners");
                if (!e) {
                    e = {};
                    for (var i = Object.getPrototypeOf(this); i;)
                        if (i.eventListeners) {
                            for (var n in i.eventListeners) {
                                var r = i.eventListeners[n],
                                    o = e[n] || [];
                                e[n] = r.concat(o)
                            }
                            i = Object.getPrototypeOf(i)
                        } else i = Object.getPrototypeOf(i);
                    this._cache.set("allEventListeners", e)
                }
                return e[t]
            }, t.prototype._fire = function (t, e) {
                (e = e || {}).currentTarget = this, e.type = t;
                var i = this._getProtoListeners(t);
                if (i)
                    for (var n = 0; n < i.length; n++) i[n].handler.call(this, e);
                var r = this.eventListeners[t];
                if (r)
                    for (n = 0; n < r.length; n++) r[n].handler.call(this, e)
            }, t.prototype.draw = function () {
                return this.drawScene(), this.drawHit(), this
            }, t.prototype._createDragElement = function (t) {
                var e = t ? t.pointerId : void 0,
                    i = this.getStage(),
                    n = this.getAbsolutePosition(),
                    r = i._getPointerById(e) || i._changedPointerPositions[0] || n;
                D._dragElements.set(this._id, {
                    node: this,
                    startPointerPos: r,
                    offset: {
                        x: r.x - n.x,
                        y: r.y - n.y
                    },
                    dragStatus: "ready",
                    pointerId: e
                })
            }, t.prototype.startDrag = function (t, e) {
                void 0 === e && (e = !0), D._dragElements.has(this._id) || this._createDragElement(t), D._dragElements.get(this._id).dragStatus = "dragging", this.fire("dragstart", {
                    type: "dragstart",
                    target: this,
                    evt: t && t.evt
                }, e)
            }, t.prototype._setDragPosition = function (t, e) {
                var i = this.getStage()._getPointerById(e.pointerId);
                if (i) {
                    var n = {
                        x: i.x - e.offset.x,
                        y: i.y - e.offset.y
                    },
                        r = this.dragBoundFunc();
                    if (void 0 !== r) {
                        var o = r.call(this, n, t);
                        o ? n = o : f.warn("dragBoundFunc did not return any value. That is unexpected behavior. You must return new absolute position from dragBoundFunc.")
                    }
                    this._lastPos && this._lastPos.x === n.x && this._lastPos.y === n.y || (this.setAbsolutePosition(n), this.getLayer() ? this.getLayer().batchDraw() : this.getStage() && this.getStage().batchDraw()), this._lastPos = n
                }
            }, t.prototype.stopDrag = function (t) {
                var e = D._dragElements.get(this._id);
                e && (e.dragStatus = "stopped"), D._endDragBefore(t), D._endDragAfter(t)
            }, t.prototype.setDraggable = function (t) {
                this._setAttr("draggable", t), this._dragChange()
            }, t.prototype.isDragging = function () {
                var t = D._dragElements.get(this._id);
                return !!t && "dragging" === t.dragStatus
            }, t.prototype._listenDrag = function () {
                this._dragCleanup(), this.on("mousedown.konva touchstart.konva", (function (t) {
                    var e = this;
                    if ((!(void 0 !== t.evt.button) || r.dragButtons.indexOf(t.evt.button) >= 0) && !this.isDragging()) {
                        var i = !1;
                        D._dragElements.forEach((function (t) {
                            e.isAncestorOf(t.node) && (i = !0)
                        })), i || this._createDragElement(t)
                    }
                }))
            }, t.prototype._dragChange = function () {
                if (this.attrs.draggable) this._listenDrag();
                else {
                    if (this._dragCleanup(), !this.getStage()) return;
                    var t = D._dragElements.get(this._id),
                        e = t && "dragging" === t.dragStatus,
                        i = t && "ready" === t.dragStatus;
                    e ? this.stopDrag() : i && D._dragElements.delete(this._id)
                }
            }, t.prototype._dragCleanup = function () {
                this.off("mousedown.konva"), this.off("touchstart.konva")
            }, t.create = function (t, e) {
                return f._isString(t) && (t = JSON.parse(t)), this._createNode(t, e)
            }, t._createNode = function (e, i) {
                var n, r, a, s = t.prototype.getClassName.call(e),
                    h = e.children;
                if (i && (e.attrs.container = i), o[s] || (f.warn('Can not find a node with class name "' + s + '". Fallback to "Shape".'), s = "Shape"), n = new (0, o[s])(e.attrs), h)
                    for (r = h.length, a = 0; a < r; a++) n.add(t._createNode(h[a]));
                return n
            }, t
        }();
    X.prototype.nodeType = "Node", X.prototype._attrsAffectingSize = [], X.prototype.eventListeners = {}, X.prototype.on.call(X.prototype, W, (function () {
        this._batchingTransformChange ? this._needClearTransformCache = !0 : (this._clearCache("transform"), this._clearSelfAndDescendantCache("absoluteTransform"))
    })), X.prototype.on.call(X.prototype, "visibleChange.konva", (function () {
        this._clearSelfAndDescendantCache("visible")
    })), X.prototype.on.call(X.prototype, "listeningChange.konva", (function () {
        this._clearSelfAndDescendantCache("listening")
    })), X.prototype.on.call(X.prototype, "opacityChange.konva", (function () {
        this._clearSelfAndDescendantCache("absoluteOpacity")
    }));
    var j = w.addGetterSetter;
    j(X, "zIndex"), j(X, "absolutePosition"), j(X, "position"), j(X, "x", 0, y()), j(X, "y", 0, y()), j(X, "globalCompositeOperation", "source-over", b()), j(X, "opacity", 1, y()), j(X, "name", "", b()), j(X, "id", "", b()), j(X, "rotation", 0, y()), w.addComponentsGetterSetter(X, "scale", ["x", "y"]), j(X, "scaleX", 1, y()), j(X, "scaleY", 1, y()), w.addComponentsGetterSetter(X, "skew", ["x", "y"]), j(X, "skewX", 0, y()), j(X, "skewY", 0, y()), w.addComponentsGetterSetter(X, "offset", ["x", "y"]), j(X, "offsetX", 0, y()), j(X, "offsetY", 0, y()), j(X, "dragDistance", null, y()), j(X, "width", 0, y()), j(X, "height", 0, y()), j(X, "listening", !0, S()), j(X, "preventDefault", !0, S()), j(X, "filters", null, (function (t) {
        return this._filterUpToDate = !1, t
    })), j(X, "visible", !0, S()), j(X, "transformsEnabled", "all", b()), j(X, "size"), j(X, "dragBoundFunc"), j(X, "draggable", !1, S()), w.backCompat(X, {
        rotateDeg: "rotate",
        setRotationDeg: "setRotation",
        getRotationDeg: "getRotation"
    }), s.mapMethods(X);
    var U = function (t) {
        function e() {
            var e = null !== t && t.apply(this, arguments) || this;
            return e.children = new s, e
        }
        return P(e, t), e.prototype.getChildren = function (t) {
            if (!t) return this.children;
            var e = new s;
            return this.children.each((function (i) {
                t(i) && e.push(i)
            })), e
        }, e.prototype.hasChildren = function () {
            return this.getChildren().length > 0
        }, e.prototype.removeChildren = function () {
            for (var t, e = 0; e < this.children.length; e++)(t = this.children[e]).parent = null, t.index = 0, t.remove();
            return this.children = new s, this
        }, e.prototype.destroyChildren = function () {
            for (var t, e = 0; e < this.children.length; e++)(t = this.children[e]).parent = null, t.index = 0, t.destroy();
            return this.children = new s, this
        }, e.prototype.add = function () {
            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i++) this.add(arguments[i]);
                return this
            }
            var n = t[0];
            if (n.getParent()) return n.moveTo(this), this;
            var r = this.children;
            return this._validateAdd(n), n._clearCaches(), n.index = r.length, n.parent = this, r.push(n), this._fire("add", {
                child: n
            }), this
        }, e.prototype.destroy = function () {
            return this.hasChildren() && this.destroyChildren(), t.prototype.destroy.call(this), this
        }, e.prototype.find = function (t) {
            return this._generalFind(t, !1)
        }, e.prototype.get = function (t) {
            return f.warn("collection.get() method is deprecated. Please use collection.find() instead."), this.find(t)
        }, e.prototype.findOne = function (t) {
            var e = this._generalFind(t, !0);
            return e.length > 0 ? e[0] : void 0
        }, e.prototype._generalFind = function (t, e) {
            var i = [];
            return this._descendants((function (n) {
                var r = n._isMatch(t);
                return r && i.push(n), !(!r || !e)
            })), s.toCollection(i)
        }, e.prototype._descendants = function (t) {
            for (var e = 0; e < this.children.length; e++) {
                var i = this.children[e];
                if (t(i)) return !0;
                if (i.hasChildren() && i._descendants(t)) return !0
            }
            return !1
        }, e.prototype.toObject = function () {
            var t = X.prototype.toObject.call(this);
            t.children = [];
            for (var e = this.getChildren(), i = e.length, n = 0; n < i; n++) {
                var r = e[n];
                t.children.push(r.toObject())
            }
            return t
        }, e.prototype.isAncestorOf = function (t) {
            for (var e = t.getParent(); e;) {
                if (e._id === this._id) return !0;
                e = e.getParent()
            }
            return !1
        }, e.prototype.clone = function (t) {
            var e = X.prototype.clone.call(this, t);
            return this.getChildren().each((function (t) {
                e.add(t.clone())
            })), e
        }, e.prototype.getAllIntersections = function (t) {
            var e = [];
            return this.find("Shape").each((function (i) {
                i.isVisible() && i.intersects(t) && e.push(i)
            })), e
        }, e.prototype._setChildrenIndices = function () {
            this.children.each((function (t, e) {
                t.index = e
            }))
        }, e.prototype.drawScene = function (t, e) {
            var i = this.getLayer(),
                n = t || i && i.getCanvas(),
                r = n && n.getContext(),
                o = this._getCanvasCache(),
                a = o && o.scene,
                s = n && n.isCache;
            if (!this.isVisible() && !s) return this;
            if (a) {
                r.save();
                var h = this.getAbsoluteTransform(e).getMatrix();
                r.transform(h[0], h[1], h[2], h[3], h[4], h[5]), this._drawCachedSceneCanvas(r), r.restore()
            } else this._drawChildren("drawScene", n, e);
            return this
        }, e.prototype.drawHit = function (t, e) {
            if (!this.shouldDrawHit(e)) return this;
            var i = this.getLayer(),
                n = t || i && i.hitCanvas,
                r = n && n.getContext(),
                o = this._getCanvasCache();
            if (o && o.hit) {
                r.save();
                var a = this.getAbsoluteTransform(e).getMatrix();
                r.transform(a[0], a[1], a[2], a[3], a[4], a[5]), this._drawCachedHitCanvas(r), r.restore()
            } else this._drawChildren("drawHit", n, e);
            return this
        }, e.prototype._drawChildren = function (t, e, i) {
            var n = e && e.getContext(),
                r = this.clipWidth(),
                o = this.clipHeight(),
                a = this.clipFunc(),
                s = r && o || a,
                h = i === this;
            if (s) {
                n.save();
                var l = this.getAbsoluteTransform(i),
                    c = l.getMatrix();
                if (n.transform(c[0], c[1], c[2], c[3], c[4], c[5]), n.beginPath(), a) a.call(this, n, this);
                else {
                    var d = this.clipX(),
                        u = this.clipY();
                    n.rect(d, u, r, o)
                }
                n.clip(), c = l.copy().invert().getMatrix(), n.transform(c[0], c[1], c[2], c[3], c[4], c[5])
            }
            var p = !h && "source-over" !== this.globalCompositeOperation() && "drawScene" === t;
            p && (n.save(), n._applyGlobalCompositeOperation(this)), this.children.each((function (n) {
                n[t](e, i)
            })), p && n.restore(), s && n.restore()
        }, e.prototype.getClientRect = function (t) {
            var e, i, n, r, o = (t = t || {}).skipTransform,
                a = t.relativeTo,
                s = {
                    x: 1 / 0,
                    y: 1 / 0,
                    width: 0,
                    height: 0
                },
                h = this;
            this.children.each((function (o) {
                if (o.visible()) {
                    var a = o.getClientRect({
                        relativeTo: h,
                        skipShadow: t.skipShadow,
                        skipStroke: t.skipStroke
                    });
                    0 === a.width && 0 === a.height || (void 0 === e ? (e = a.x, i = a.y, n = a.x + a.width, r = a.y + a.height) : (e = Math.min(e, a.x), i = Math.min(i, a.y), n = Math.max(n, a.x + a.width), r = Math.max(r, a.y + a.height)))
                }
            }));
            for (var l = this.find("Shape"), c = !1, d = 0; d < l.length; d++) {
                if (l[d]._isVisible(this)) {
                    c = !0;
                    break
                }
            }
            return s = c && void 0 !== e ? {
                x: e,
                y: i,
                width: n - e,
                height: r - i
            } : {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }, o ? s : this._transformedRect(s, a)
        }, e
    }(X);
    w.addComponentsGetterSetter(U, "clip", ["x", "y", "width", "height"]), w.addGetterSetter(U, "clipX", void 0, y()), w.addGetterSetter(U, "clipY", void 0, y()), w.addGetterSetter(U, "clipWidth", void 0, y()), w.addGetterSetter(U, "clipHeight", void 0, y()), w.addGetterSetter(U, "clipFunc"), s.mapMethods(U);
    var q = new Map,
        K = void 0 !== r._global.PointerEvent;

    function V(t) {
        return q.get(t)
    }

    function Q(t) {
        return {
            evt: t,
            pointerId: t.pointerId
        }
    }

    function J(t, e) {
        return q.get(t) === e
    }

    function Z(t, e) {
        $(t), e.getStage() && (q.set(t, e), K && e._fire("gotpointercapture", Q(new PointerEvent("gotpointercapture"))))
    }

    function $(t, e) {
        var i = q.get(t);
        if (i) {
            var n = i.getStage();
            n && n.content, q.delete(t), K && i._fire("lostpointercapture", Q(new PointerEvent("lostpointercapture")))
        }
    }
    var tt = ["mouseenter", "mousedown", "mousemove", "mouseup", "mouseout", "touchstart", "touchmove", "touchend", "mouseover", "wheel", "contextmenu", "pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"],
        et = tt.length;

    function it(t, e) {
        t.content.addEventListener(e, (function (i) {
            t["_" + e](i)
        }), !1)
    }
    var nt = [];

    function rt(t) {
        return void 0 === t && (t = {}), (t.clipFunc || t.clipWidth || t.clipHeight) && f.warn("Stage does not support clipping. Please use clip for Layers or Groups."), t
    }
    var ot = function (t) {
        function e(e) {
            var i = t.call(this, rt(e)) || this;
            return i._pointerPositions = [], i._changedPointerPositions = [], i._buildDOM(), i._bindContentEvents(), nt.push(i), i.on("widthChange.konva heightChange.konva", i._resizeDOM), i.on("visibleChange.konva", i._checkVisibility), i.on("clipWidthChange.konva clipHeightChange.konva clipFuncChange.konva", (function () {
                rt(i.attrs)
            })), i._checkVisibility(), i
        }
        return P(e, t), e.prototype._validateAdd = function (t) {
            var e = "Layer" === t.getType(),
                i = "FastLayer" === t.getType();
            e || i || f.throw("You may only add layers to the stage.")
        }, e.prototype._checkVisibility = function () {
            if (this.content) {
                var t = this.visible() ? "" : "none";
                this.content.style.display = t
            }
        }, e.prototype.setContainer = function (t) {
            if ("string" == typeof t) {
                if ("." === t.charAt(0)) {
                    var e = t.slice(1);
                    t = document.getElementsByClassName(e)[0]
                } else {
                    var i;
                    i = "#" !== t.charAt(0) ? t : t.slice(1), t = document.getElementById(i)
                }
                if (!t) throw "Can not find container in document with id " + i
            }
            return this._setAttr("container", t), this.content && (this.content.parentElement && this.content.parentElement.removeChild(this.content), t.appendChild(this.content)), this
        }, e.prototype.shouldDrawHit = function () {
            return !0
        }, e.prototype.clear = function () {
            var t, e = this.children,
                i = e.length;
            for (t = 0; t < i; t++) e[t].clear();
            return this
        }, e.prototype.clone = function (t) {
            return t || (t = {}), t.container = document.createElement("div"), U.prototype.clone.call(this, t)
        }, e.prototype.destroy = function () {
            t.prototype.destroy.call(this);
            var e = this.content;
            e && f._isInDocument(e) && this.container().removeChild(e);
            var i = nt.indexOf(this);
            return i > -1 && nt.splice(i, 1), this
        }, e.prototype.getPointerPosition = function () {
            var t = this._pointerPositions[0] || this._changedPointerPositions[0];
            return t ? {
                x: t.x,
                y: t.y
            } : (f.warn("Pointer position is missing and not registered by the stage. Looks like it is outside of the stage container. You can set it manually from event: stage.setPointersPositions(event);"), null)
        }, e.prototype._getPointerById = function (t) {
            return this._pointerPositions.find((function (e) {
                return e.id === t
            }))
        }, e.prototype.getPointersPositions = function () {
            return this._pointerPositions
        }, e.prototype.getStage = function () {
            return this
        }, e.prototype.getContent = function () {
            return this.content
        }, e.prototype._toKonvaCanvas = function (t) {
            (t = t || {}).x = t.x || 0, t.y = t.y || 0, t.width = t.width || this.width(), t.height = t.height || this.height();
            var e = new E({
                width: t.width,
                height: t.height,
                pixelRatio: t.pixelRatio || 1
            }),
                i = e.getContext()._context,
                n = this.children;
            return (t.x || t.y) && i.translate(-1 * t.x, -1 * t.y), n.each((function (e) {
                if (e.isVisible()) {
                    var n = e._toKonvaCanvas(t);
                    i.drawImage(n._canvas, t.x, t.y, n.getWidth() / n.getPixelRatio(), n.getHeight() / n.getPixelRatio())
                }
            })), e
        }, e.prototype.getIntersection = function (t, e) {
            if (!t) return null;
            var i, n, r = this.children;
            for (i = r.length - 1; i >= 0; i--)
                if (n = r[i].getIntersection(t, e)) return n;
            return null
        }, e.prototype._resizeDOM = function () {
            var t = this.width(),
                e = this.height();
            this.content && (this.content.style.width = t + "px", this.content.style.height = e + "px"), this.bufferCanvas.setSize(t, e), this.bufferHitCanvas.setSize(t, e), this.children.each((function (i) {
                i.setSize({
                    width: t,
                    height: e
                }), i.draw()
            }))
        }, e.prototype.add = function (e) {
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i++) this.add(arguments[i]);
                return this
            }
            t.prototype.add.call(this, e);
            var n = this.children.length;
            return n > 5 && f.warn("The stage has " + n + " layers. Recommended maximum number of layers is 3-5. Adding more layers into the stage may drop the performance. Rethink your tree structure, you can use Konva.Group."), e.setSize({
                width: this.width(),
                height: this.height()
            }), e.draw(), r.isBrowser && this.content.appendChild(e.canvas._canvas), this
        }, e.prototype.getParent = function () {
            return null
        }, e.prototype.getLayer = function () {
            return null
        }, e.prototype.hasPointerCapture = function (t) {
            return J(t, this)
        }, e.prototype.setPointerCapture = function (t) {
            Z(t, this)
        }, e.prototype.releaseCapture = function (t) {
            $(t)
        }, e.prototype.getLayers = function () {
            return this.getChildren()
        }, e.prototype._bindContentEvents = function () {
            if (r.isBrowser)
                for (var t = 0; t < et; t++) it(this, tt[t])
        }, e.prototype._mouseenter = function (t) {
            this.setPointersPositions(t), this._fire("mouseenter", {
                evt: t,
                target: this,
                currentTarget: this
            })
        }, e.prototype._mouseover = function (t) {
            this.setPointersPositions(t), this._fire("contentMouseover", {
                evt: t
            }), this._fire("mouseover", {
                evt: t,
                target: this,
                currentTarget: this
            })
        }, e.prototype._mouseout = function (t) {
            var e;
            this.setPointersPositions(t);
            var i = (null === (e = this.targetShape) || void 0 === e ? void 0 : e.getStage()) ? this.targetShape : null,
                n = !D.isDragging || r.hitOnDragEnabled;
            i && n ? (i._fireAndBubble("mouseout", {
                evt: t
            }), i._fireAndBubble("mouseleave", {
                evt: t
            }), this._fire("mouseleave", {
                evt: t,
                target: this,
                currentTarget: this
            }), this.targetShape = null) : n && (this._fire("mouseleave", {
                evt: t,
                target: this,
                currentTarget: this
            }), this._fire("mouseout", {
                evt: t,
                target: this,
                currentTarget: this
            })), this.pointerPos = void 0, this._pointerPositions = [], this._fire("contentMouseout", {
                evt: t
            })
        }, e.prototype._mousemove = function (t) {
            var e;
            if (r.UA.ieMobile) return this._touchmove(t);
            this.setPointersPositions(t);
            var i, n = f._getFirstPointerId(t),
                o = (null === (e = this.targetShape) || void 0 === e ? void 0 : e.getStage()) ? this.targetShape : null,
                a = !D.isDragging || r.hitOnDragEnabled;
            if (a) {
                if ((i = this.getIntersection(this.getPointerPosition())) && i.isListening()) a && o !== i ? (o && (o._fireAndBubble("mouseout", {
                    evt: t,
                    pointerId: n
                }, i), o._fireAndBubble("mouseleave", {
                    evt: t,
                    pointerId: n
                }, i)), i._fireAndBubble("mouseover", {
                    evt: t,
                    pointerId: n
                }, o), i._fireAndBubble("mouseenter", {
                    evt: t,
                    pointerId: n
                }, o), i._fireAndBubble("mousemove", {
                    evt: t,
                    pointerId: n
                }), this.targetShape = i) : i._fireAndBubble("mousemove", {
                    evt: t,
                    pointerId: n
                });
                else o && a && (o._fireAndBubble("mouseout", {
                    evt: t,
                    pointerId: n
                }), o._fireAndBubble("mouseleave", {
                    evt: t,
                    pointerId: n
                }), this._fire("mouseover", {
                    evt: t,
                    target: this,
                    currentTarget: this,
                    pointerId: n
                }), this.targetShape = null), this._fire("mousemove", {
                    evt: t,
                    target: this,
                    currentTarget: this,
                    pointerId: n
                });
                this._fire("contentMousemove", {
                    evt: t
                })
            }
            t.cancelable && t.preventDefault()
        }, e.prototype._mousedown = function (t) {
            if (r.UA.ieMobile) return this._touchstart(t);
            this.setPointersPositions(t);
            var e = f._getFirstPointerId(t),
                i = this.getIntersection(this.getPointerPosition());
            D.justDragged = !1, r.listenClickTap = !0, i && i.isListening() ? (this.clickStartShape = i, i._fireAndBubble("mousedown", {
                evt: t,
                pointerId: e
            })) : this._fire("mousedown", {
                evt: t,
                target: this,
                currentTarget: this,
                pointerId: e
            }), this._fire("contentMousedown", {
                evt: t
            })
        }, e.prototype._mouseup = function (t) {
            if (r.UA.ieMobile) return this._touchend(t);
            this.setPointersPositions(t);
            var e = f._getFirstPointerId(t),
                i = this.getIntersection(this.getPointerPosition()),
                n = this.clickStartShape,
                o = this.clickEndShape,
                a = !1;
            r.inDblClickWindow ? (a = !0, clearTimeout(this.dblTimeout)) : D.justDragged || (r.inDblClickWindow = !0, clearTimeout(this.dblTimeout)), this.dblTimeout = setTimeout((function () {
                r.inDblClickWindow = !1
            }), r.dblClickWindow), i && i.isListening() ? (this.clickEndShape = i, i._fireAndBubble("mouseup", {
                evt: t,
                pointerId: e
            }), r.listenClickTap && n && n._id === i._id && (i._fireAndBubble("click", {
                evt: t,
                pointerId: e
            }), a && o && o === i && i._fireAndBubble("dblclick", {
                evt: t,
                pointerId: e
            }))) : (this.clickEndShape = null, this._fire("mouseup", {
                evt: t,
                target: this,
                currentTarget: this,
                pointerId: e
            }), r.listenClickTap && this._fire("click", {
                evt: t,
                target: this,
                currentTarget: this,
                pointerId: e
            }), a && this._fire("dblclick", {
                evt: t,
                target: this,
                currentTarget: this,
                pointerId: e
            })), this._fire("contentMouseup", {
                evt: t
            }), r.listenClickTap && (this._fire("contentClick", {
                evt: t
            }), a && this._fire("contentDblclick", {
                evt: t
            })), r.listenClickTap = !1, t.cancelable && t.preventDefault()
        }, e.prototype._contextmenu = function (t) {
            this.setPointersPositions(t);
            var e = this.getIntersection(this.getPointerPosition());
            e && e.isListening() ? e._fireAndBubble("contextmenu", {
                evt: t
            }) : this._fire("contextmenu", {
                evt: t,
                target: this,
                currentTarget: this
            }), this._fire("contentContextmenu", {
                evt: t
            })
        }, e.prototype._touchstart = function (t) {
            var e = this;
            this.setPointersPositions(t);
            var i = !1;
            this._changedPointerPositions.forEach((function (n) {
                var o = e.getIntersection(n);
                r.listenClickTap = !0, D.justDragged = !1, o && o.isListening() && (r.captureTouchEventsEnabled && o.setPointerCapture(n.id), e.tapStartShape = o, o._fireAndBubble("touchstart", {
                    evt: t,
                    pointerId: n.id
                }, e), i = !0, o.isListening() && o.preventDefault() && t.cancelable && t.preventDefault())
            })), i || this._fire("touchstart", {
                evt: t,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id
            }), this._fire("contentTouchstart", {
                evt: t
            })
        }, e.prototype._touchmove = function (t) {
            var e = this;
            if (this.setPointersPositions(t), !D.isDragging || r.hitOnDragEnabled) {
                var i = !1,
                    n = {};
                this._changedPointerPositions.forEach((function (r) {
                    var o = V(r.id) || e.getIntersection(r);
                    o && o.isListening() && (n[o._id] || (n[o._id] = !0, o._fireAndBubble("touchmove", {
                        evt: t,
                        pointerId: r.id
                    }), i = !0, o.isListening() && o.preventDefault() && t.cancelable && t.preventDefault()))
                })), i || this._fire("touchmove", {
                    evt: t,
                    target: this,
                    currentTarget: this,
                    pointerId: this._changedPointerPositions[0].id
                }), this._fire("contentTouchmove", {
                    evt: t
                })
            }
            D.isDragging && D.node.preventDefault() && t.cancelable && t.preventDefault()
        }, e.prototype._touchend = function (t) {
            var e = this;
            this.setPointersPositions(t);
            var i = this.tapEndShape,
                n = !1;
            r.inDblClickWindow ? (n = !0, clearTimeout(this.dblTimeout)) : D.justDragged || (r.inDblClickWindow = !0, clearTimeout(this.dblTimeout)), this.dblTimeout = setTimeout((function () {
                r.inDblClickWindow = !1
            }), r.dblClickWindow);
            var o = !1,
                a = {},
                s = !1,
                h = !1;
            this._changedPointerPositions.forEach((function (l) {
                var c = V(l.id) || e.getIntersection(l);
                c && c.releaseCapture(l.id), c && c.isListening() && (a[c._id] || (a[c._id] = !0, e.tapEndShape = c, c._fireAndBubble("touchend", {
                    evt: t,
                    pointerId: l.id
                }), o = !0, r.listenClickTap && c === e.tapStartShape && (s = !0, c._fireAndBubble("tap", {
                    evt: t,
                    pointerId: l.id
                }), n && i && i === c && (h = !0, c._fireAndBubble("dbltap", {
                    evt: t,
                    pointerId: l.id
                }))), c.isListening() && c.preventDefault() && t.cancelable && t.preventDefault()))
            })), o || this._fire("touchend", {
                evt: t,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id
            }), r.listenClickTap && !s && (this.tapEndShape = null, this._fire("tap", {
                evt: t,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id
            })), n && !h && this._fire("dbltap", {
                evt: t,
                target: this,
                currentTarget: this,
                pointerId: this._changedPointerPositions[0].id
            }), this._fire("contentTouchend", {
                evt: t
            }), r.listenClickTap && (this._fire("contentTap", {
                evt: t
            }), n && this._fire("contentDbltap", {
                evt: t
            })), this.preventDefault() && t.cancelable && t.preventDefault(), r.listenClickTap = !1
        }, e.prototype._wheel = function (t) {
            this.setPointersPositions(t);
            var e = this.getIntersection(this.getPointerPosition());
            e && e.isListening() ? e._fireAndBubble("wheel", {
                evt: t
            }) : this._fire("wheel", {
                evt: t,
                target: this,
                currentTarget: this
            }), this._fire("contentWheel", {
                evt: t
            })
        }, e.prototype._pointerdown = function (t) {
            if (r._pointerEventsEnabled) {
                this.setPointersPositions(t);
                var e = V(t.pointerId) || this.getIntersection(this.getPointerPosition());
                e && e._fireAndBubble("pointerdown", Q(t))
            }
        }, e.prototype._pointermove = function (t) {
            if (r._pointerEventsEnabled) {
                this.setPointersPositions(t);
                var e = V(t.pointerId) || this.getIntersection(this.getPointerPosition());
                e && e._fireAndBubble("pointermove", Q(t))
            }
        }, e.prototype._pointerup = function (t) {
            if (r._pointerEventsEnabled) {
                this.setPointersPositions(t);
                var e = V(t.pointerId) || this.getIntersection(this.getPointerPosition());
                e && e._fireAndBubble("pointerup", Q(t)), $(t.pointerId)
            }
        }, e.prototype._pointercancel = function (t) {
            if (r._pointerEventsEnabled) {
                this.setPointersPositions(t);
                var e = V(t.pointerId) || this.getIntersection(this.getPointerPosition());
                e && e._fireAndBubble("pointerup", Q(t)), $(t.pointerId)
            }
        }, e.prototype._lostpointercapture = function (t) {
            $(t.pointerId)
        }, e.prototype.setPointersPositions = function (t) {
            var e = this,
                i = this._getContentPosition(),
                n = null,
                r = null;
            void 0 !== (t = t || window.event).touches ? (this._pointerPositions = [], this._changedPointerPositions = [], s.prototype.each.call(t.touches, (function (t) {
                e._pointerPositions.push({
                    id: t.identifier,
                    x: (t.clientX - i.left) / i.scaleX,
                    y: (t.clientY - i.top) / i.scaleY
                })
            })), s.prototype.each.call(t.changedTouches || t.touches, (function (t) {
                e._changedPointerPositions.push({
                    id: t.identifier,
                    x: (t.clientX - i.left) / i.scaleX,
                    y: (t.clientY - i.top) / i.scaleY
                })
            }))) : (n = (t.clientX - i.left) / i.scaleX, r = (t.clientY - i.top) / i.scaleY, this.pointerPos = {
                x: n,
                y: r
            }, this._pointerPositions = [{
                x: n,
                y: r,
                id: f._getFirstPointerId(t)
            }], this._changedPointerPositions = [{
                x: n,
                y: r,
                id: f._getFirstPointerId(t)
            }])
        }, e.prototype._setPointerPosition = function (t) {
            f.warn('Method _setPointerPosition is deprecated. Use "stage.setPointersPositions(event)" instead.'), this.setPointersPositions(t)
        }, e.prototype._getContentPosition = function () {
            if (!this.content || !this.content.getBoundingClientRect) return {
                top: 0,
                left: 0,
                scaleX: 1,
                scaleY: 1
            };
            var t = this.content.getBoundingClientRect();
            return {
                top: t.top,
                left: t.left,
                scaleX: t.width / this.content.clientWidth || 1,
                scaleY: t.height / this.content.clientHeight || 1
            }
        }, e.prototype._buildDOM = function () {
            if (this.bufferCanvas = new E({
                width: this.width(),
                height: this.height()
            }), this.bufferHitCanvas = new O({
                pixelRatio: 1,
                width: this.width(),
                height: this.height()
            }), r.isBrowser) {
                var t = this.container();
                if (!t) throw "Stage has no container. A container is required.";
                t.innerHTML = "", this.content = document.createElement("div"), this.content.style.position = "relative", this.content.style.userSelect = "none", this.content.className = "konvajs-content", this.content.setAttribute("role", "presentation"), t.appendChild(this.content), this._resizeDOM()
            }
        }, e.prototype.cache = function () {
            return f.warn("Cache function is not allowed for stage. You may use cache only for layers, groups and shapes."), this
        }, e.prototype.clearCache = function () {
            return this
        }, e.prototype.batchDraw = function () {
            return this.children.each((function (t) {
                t.batchDraw()
            })), this
        }, e
    }(U);
    ot.prototype.nodeType = "Stage", a(ot), w.addGetterSetter(ot, "container");
    var at;

    function st() {
        return at || (at = f.createCanvasElement().getContext("2d"))
    }
    var ht = {};
    var lt = function (t) {
        function e(e) {
            for (var i, n = t.call(this, e) || this; !(i = f.getRandomColor()) || i in ht;);
            return n.colorKey = i, ht[i] = n, n
        }
        return P(e, t), e.prototype.getContext = function () {
            return this.getLayer().getContext()
        }, e.prototype.getCanvas = function () {
            return this.getLayer().getCanvas()
        }, e.prototype.getSceneFunc = function () {
            return this.attrs.sceneFunc || this._sceneFunc
        }, e.prototype.getHitFunc = function () {
            return this.attrs.hitFunc || this._hitFunc
        }, e.prototype.hasShadow = function () {
            return this._getCache("hasShadow", this._hasShadow)
        }, e.prototype._hasShadow = function () {
            return this.shadowEnabled() && 0 !== this.shadowOpacity() && !!(this.shadowColor() || this.shadowBlur() || this.shadowOffsetX() || this.shadowOffsetY())
        }, e.prototype._getFillPattern = function () {
            return this._getCache("patternImage", this.__getFillPattern)
        }, e.prototype.__getFillPattern = function () {
            if (this.fillPatternImage()) {
                var t = st().createPattern(this.fillPatternImage(), this.fillPatternRepeat() || "repeat");
                return t && t.setTransform && t.setTransform({
                    a: this.fillPatternScaleX(),
                    b: 0,
                    c: 0,
                    d: this.fillPatternScaleY(),
                    e: 0,
                    f: 0
                }), t
            }
        }, e.prototype._getLinearGradient = function () {
            return this._getCache("linearGradient", this.__getLinearGradient)
        }, e.prototype.__getLinearGradient = function () {
            var t = this.fillLinearGradientColorStops();
            if (t) {
                for (var e = st(), i = this.fillLinearGradientStartPoint(), n = this.fillLinearGradientEndPoint(), r = e.createLinearGradient(i.x, i.y, n.x, n.y), o = 0; o < t.length; o += 2) r.addColorStop(t[o], t[o + 1]);
                return r
            }
        }, e.prototype._getRadialGradient = function () {
            return this._getCache("radialGradient", this.__getRadialGradient)
        }, e.prototype.__getRadialGradient = function () {
            var t = this.fillRadialGradientColorStops();
            if (t) {
                for (var e = st(), i = this.fillRadialGradientStartPoint(), n = this.fillRadialGradientEndPoint(), r = e.createRadialGradient(i.x, i.y, this.fillRadialGradientStartRadius(), n.x, n.y, this.fillRadialGradientEndRadius()), o = 0; o < t.length; o += 2) r.addColorStop(t[o], t[o + 1]);
                return r
            }
        }, e.prototype.getShadowRGBA = function () {
            return this._getCache("shadowRGBA", this._getShadowRGBA)
        }, e.prototype._getShadowRGBA = function () {
            if (this.hasShadow()) {
                var t = f.colorToRGBA(this.shadowColor());
                return "rgba(" + t.r + "," + t.g + "," + t.b + "," + t.a * (this.shadowOpacity() || 1) + ")"
            }
        }, e.prototype.hasFill = function () {
            var t = this;
            return this._calculate("hasFill", ["fillEnabled", "fill", "fillPatternImage", "fillLinearGradientColorStops", "fillRadialGradientColorStops"], (function () {
                return t.fillEnabled() && !!(t.fill() || t.fillPatternImage() || t.fillLinearGradientColorStops() || t.fillRadialGradientColorStops())
            }))
        }, e.prototype.hasStroke = function () {
            var t = this;
            return this._calculate("hasStroke", ["strokeEnabled", "strokeWidth", "stroke", "strokeLinearGradientColorStops"], (function () {
                return t.strokeEnabled() && t.strokeWidth() && !(!t.stroke() && !t.strokeLinearGradientColorStops())
            }))
        }, e.prototype.hasHitStroke = function () {
            var t = this.hitStrokeWidth();
            return "auto" === t ? this.hasStroke() : this.strokeEnabled() && !!t
        }, e.prototype.intersects = function (t) {
            var e = this.getStage().bufferHitCanvas;
            return e.getContext().clear(), this.drawHit(e), e.context.getImageData(Math.round(t.x), Math.round(t.y), 1, 1).data[3] > 0
        }, e.prototype.destroy = function () {
            return X.prototype.destroy.call(this), delete ht[this.colorKey], delete this.colorKey, this
        }, e.prototype._useBufferCanvas = function (t) {
            var e;
            if (!this.getStage()) return !1;
            if (!(null === (e = this.attrs.perfectDrawEnabled) || void 0 === e || e)) return !1;
            var i = t || this.hasFill(),
                n = this.hasStroke(),
                r = 1 !== this.getAbsoluteOpacity();
            if (i && n && r) return !0;
            var o = this.hasShadow(),
                a = this.shadowForStrokeEnabled();
            return !!(i && n && o && a)
        }, e.prototype.setStrokeHitEnabled = function (t) {
            f.warn("strokeHitEnabled property is deprecated. Please use hitStrokeWidth instead."), t ? this.hitStrokeWidth("auto") : this.hitStrokeWidth(0)
        }, e.prototype.getStrokeHitEnabled = function () {
            return 0 !== this.hitStrokeWidth()
        }, e.prototype.getSelfRect = function () {
            var t = this.size();
            return {
                x: this._centroid ? -t.width / 2 : 0,
                y: this._centroid ? -t.height / 2 : 0,
                width: t.width,
                height: t.height
            }
        }, e.prototype.getClientRect = function (t) {
            void 0 === t && (t = {});
            var e = t.skipTransform,
                i = t.relativeTo,
                n = this.getSelfRect(),
                r = !t.skipStroke && this.hasStroke() && this.strokeWidth() || 0,
                o = n.width + r,
                a = n.height + r,
                s = !t.skipShadow && this.hasShadow(),
                h = s ? this.shadowOffsetX() : 0,
                l = s ? this.shadowOffsetY() : 0,
                c = o + Math.abs(h),
                d = a + Math.abs(l),
                u = s && this.shadowBlur() || 0,
                p = c + 2 * u,
                f = d + 2 * u,
                g = 0;
            Math.round(r / 2) !== r / 2 && (g = 1);
            var v = {
                width: p + g,
                height: f + g,
                x: -Math.round(r / 2 + u) + Math.min(h, 0) + n.x,
                y: -Math.round(r / 2 + u) + Math.min(l, 0) + n.y
            };
            return e ? v : this._transformedRect(v, i)
        }, e.prototype.drawScene = function (t, e) {
            var i, n, r = this.getLayer(),
                o = t || r.getCanvas(),
                a = o.getContext(),
                s = this._getCanvasCache(),
                h = this.getSceneFunc(),
                l = this.hasShadow(),
                c = o.isCache,
                d = o.isCache,
                u = e === this;
            if (!this.isVisible() && !c) return this;
            if (s) {
                a.save();
                var p = this.getAbsoluteTransform(e).getMatrix();
                return a.transform(p[0], p[1], p[2], p[3], p[4], p[5]), this._drawCachedSceneCanvas(a), a.restore(), this
            }
            if (!h) return this;
            if (a.save(), this._useBufferCanvas() && !d) {
                (n = (i = this.getStage().bufferCanvas).getContext()).clear(), n.save(), n._applyLineJoin(this);
                var f = this.getAbsoluteTransform(e).getMatrix();
                n.transform(f[0], f[1], f[2], f[3], f[4], f[5]), h.call(this, n, this), n.restore();
                var g = i.pixelRatio;
                l && a._applyShadow(this), a._applyOpacity(this), a._applyGlobalCompositeOperation(this), a.drawImage(i._canvas, 0, 0, i.width / g, i.height / g)
            } else {
                if (a._applyLineJoin(this), !u) {
                    f = this.getAbsoluteTransform(e).getMatrix();
                    a.transform(f[0], f[1], f[2], f[3], f[4], f[5]), a._applyOpacity(this), a._applyGlobalCompositeOperation(this)
                }
                l && a._applyShadow(this), h.call(this, a, this)
            }
            return a.restore(), this
        }, e.prototype.drawHit = function (t, e) {
            if (!this.shouldDrawHit(e)) return this;
            var i = this.getLayer(),
                n = t || i.hitCanvas,
                r = n && n.getContext(),
                o = this.hitFunc() || this.sceneFunc(),
                a = this._getCanvasCache(),
                s = a && a.hit;
            if (this.colorKey || (console.log(this), f.warn("Looks like your canvas has a destroyed shape in it. Do not reuse shape after you destroyed it. See the shape in logs above. If you want to reuse shape you should call remove() instead of destroy()")), s) {
                r.save();
                var h = this.getAbsoluteTransform(e).getMatrix();
                return r.transform(h[0], h[1], h[2], h[3], h[4], h[5]), this._drawCachedHitCanvas(r), r.restore(), this
            }
            if (!o) return this;
            if (r.save(), r._applyLineJoin(this), !(this === e)) {
                var l = this.getAbsoluteTransform(e).getMatrix();
                r.transform(l[0], l[1], l[2], l[3], l[4], l[5])
            }
            return o.call(this, r, this), r.restore(), this
        }, e.prototype.drawHitFromCache = function (t) {
            void 0 === t && (t = 0);
            var e, i, n, r, o, a = this._getCanvasCache(),
                s = this._getCachedSceneCanvas(),
                h = a.hit,
                l = h.getContext(),
                c = h.getWidth(),
                d = h.getHeight();
            l.clear(), l.drawImage(s._canvas, 0, 0, c, d);
            try {
                for (n = (i = (e = l.getImageData(0, 0, c, d)).data).length, r = f._hexToRgb(this.colorKey), o = 0; o < n; o += 4) i[o + 3] > t ? (i[o] = r.r, i[o + 1] = r.g, i[o + 2] = r.b, i[o + 3] = 255) : i[o + 3] = 0;
                l.putImageData(e, 0, 0)
            } catch (t) {
                f.error("Unable to draw hit graph from cached scene canvas. " + t.message)
            }
            return this
        }, e.prototype.hasPointerCapture = function (t) {
            return J(t, this)
        }, e.prototype.setPointerCapture = function (t) {
            Z(t, this)
        }, e.prototype.releaseCapture = function (t) {
            $(t)
        }, e
    }(X);
    lt.prototype._fillFunc = function (t) {
        t.fill()
    }, lt.prototype._strokeFunc = function (t) {
        t.stroke()
    }, lt.prototype._fillFuncHit = function (t) {
        t.fill()
    }, lt.prototype._strokeFuncHit = function (t) {
        t.stroke()
    }, lt.prototype._centroid = !1, lt.prototype.nodeType = "Shape", a(lt), lt.prototype.eventListeners = {}, lt.prototype.on.call(lt.prototype, "shadowColorChange.konva shadowBlurChange.konva shadowOffsetChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", (function () {
        this._clearCache("hasShadow")
    })), lt.prototype.on.call(lt.prototype, "shadowColorChange.konva shadowOpacityChange.konva shadowEnabledChange.konva", (function () {
        this._clearCache("shadowRGBA")
    })), lt.prototype.on.call(lt.prototype, "fillPriorityChange.konva fillPatternImageChange.konva fillPatternRepeatChange.konva fillPatternScaleXChange.konva fillPatternScaleYChange.konva", (function () {
        this._clearCache("patternImage")
    })), lt.prototype.on.call(lt.prototype, "fillPriorityChange.konva fillLinearGradientColorStopsChange.konva fillLinearGradientStartPointXChange.konva fillLinearGradientStartPointYChange.konva fillLinearGradientEndPointXChange.konva fillLinearGradientEndPointYChange.konva", (function () {
        this._clearCache("linearGradient")
    })), lt.prototype.on.call(lt.prototype, "fillPriorityChange.konva fillRadialGradientColorStopsChange.konva fillRadialGradientStartPointXChange.konva fillRadialGradientStartPointYChange.konva fillRadialGradientEndPointXChange.konva fillRadialGradientEndPointYChange.konva fillRadialGradientStartRadiusChange.konva fillRadialGradientEndRadiusChange.konva", (function () {
        this._clearCache("radialGradient")
    })), w.addGetterSetter(lt, "stroke", void 0, x()), w.addGetterSetter(lt, "strokeWidth", 2, y()), w.addGetterSetter(lt, "fillAfterStrokeEnabled", !1), w.addGetterSetter(lt, "hitStrokeWidth", "auto", _()), w.addGetterSetter(lt, "strokeHitEnabled", !0, S()), w.addGetterSetter(lt, "perfectDrawEnabled", !0, S()), w.addGetterSetter(lt, "shadowForStrokeEnabled", !0, S()), w.addGetterSetter(lt, "lineJoin"), w.addGetterSetter(lt, "lineCap"), w.addGetterSetter(lt, "sceneFunc"), w.addGetterSetter(lt, "hitFunc"), w.addGetterSetter(lt, "dash"), w.addGetterSetter(lt, "dashOffset", 0, y()), w.addGetterSetter(lt, "shadowColor", void 0, b()), w.addGetterSetter(lt, "shadowBlur", 0, y()), w.addGetterSetter(lt, "shadowOpacity", 1, y()), w.addComponentsGetterSetter(lt, "shadowOffset", ["x", "y"]), w.addGetterSetter(lt, "shadowOffsetX", 0, y()), w.addGetterSetter(lt, "shadowOffsetY", 0, y()), w.addGetterSetter(lt, "fillPatternImage"), w.addGetterSetter(lt, "fill", void 0, x()), w.addGetterSetter(lt, "fillPatternX", 0, y()), w.addGetterSetter(lt, "fillPatternY", 0, y()), w.addGetterSetter(lt, "fillLinearGradientColorStops"), w.addGetterSetter(lt, "strokeLinearGradientColorStops"), w.addGetterSetter(lt, "fillRadialGradientStartRadius", 0), w.addGetterSetter(lt, "fillRadialGradientEndRadius", 0), w.addGetterSetter(lt, "fillRadialGradientColorStops"), w.addGetterSetter(lt, "fillPatternRepeat", "repeat"), w.addGetterSetter(lt, "fillEnabled", !0), w.addGetterSetter(lt, "strokeEnabled", !0), w.addGetterSetter(lt, "shadowEnabled", !0), w.addGetterSetter(lt, "dashEnabled", !0), w.addGetterSetter(lt, "strokeScaleEnabled", !0), w.addGetterSetter(lt, "fillPriority", "color"), w.addComponentsGetterSetter(lt, "fillPatternOffset", ["x", "y"]), w.addGetterSetter(lt, "fillPatternOffsetX", 0, y()), w.addGetterSetter(lt, "fillPatternOffsetY", 0, y()), w.addComponentsGetterSetter(lt, "fillPatternScale", ["x", "y"]), w.addGetterSetter(lt, "fillPatternScaleX", 1, y()), w.addGetterSetter(lt, "fillPatternScaleY", 1, y()), w.addComponentsGetterSetter(lt, "fillLinearGradientStartPoint", ["x", "y"]), w.addComponentsGetterSetter(lt, "strokeLinearGradientStartPoint", ["x", "y"]), w.addGetterSetter(lt, "fillLinearGradientStartPointX", 0), w.addGetterSetter(lt, "strokeLinearGradientStartPointX", 0), w.addGetterSetter(lt, "fillLinearGradientStartPointY", 0), w.addGetterSetter(lt, "strokeLinearGradientStartPointY", 0), w.addComponentsGetterSetter(lt, "fillLinearGradientEndPoint", ["x", "y"]), w.addComponentsGetterSetter(lt, "strokeLinearGradientEndPoint", ["x", "y"]), w.addGetterSetter(lt, "fillLinearGradientEndPointX", 0), w.addGetterSetter(lt, "strokeLinearGradientEndPointX", 0), w.addGetterSetter(lt, "fillLinearGradientEndPointY", 0), w.addGetterSetter(lt, "strokeLinearGradientEndPointY", 0), w.addComponentsGetterSetter(lt, "fillRadialGradientStartPoint", ["x", "y"]), w.addGetterSetter(lt, "fillRadialGradientStartPointX", 0), w.addGetterSetter(lt, "fillRadialGradientStartPointY", 0), w.addComponentsGetterSetter(lt, "fillRadialGradientEndPoint", ["x", "y"]), w.addGetterSetter(lt, "fillRadialGradientEndPointX", 0), w.addGetterSetter(lt, "fillRadialGradientEndPointY", 0), w.addGetterSetter(lt, "fillPatternRotation", 0), w.backCompat(lt, {
        dashArray: "dash",
        getDashArray: "getDash",
        setDashArray: "getDash",
        drawFunc: "sceneFunc",
        getDrawFunc: "getSceneFunc",
        setDrawFunc: "setSceneFunc",
        drawHitFunc: "hitFunc",
        getDrawHitFunc: "getHitFunc",
        setDrawHitFunc: "setHitFunc"
    }), s.mapMethods(lt);
    var ct = [{
        x: 0,
        y: 0
    }, {
        x: -1,
        y: -1
    }, {
        x: 1,
        y: -1
    }, {
        x: 1,
        y: 1
    }, {
        x: -1,
        y: 1
    }],
        dt = ct.length,
        ut = function (t) {
            function e(e) {
                var i = t.call(this, e) || this;
                return i.canvas = new E, i.hitCanvas = new O({
                    pixelRatio: 1
                }), i._waitingForDraw = !1, i.on("visibleChange.konva", i._checkVisibility), i._checkVisibility(), i.on("imageSmoothingEnabledChange.konva", i._setSmoothEnabled), i._setSmoothEnabled(), i
            }
            return P(e, t), e.prototype.createPNGStream = function () {
                return this.canvas._canvas.createPNGStream()
            }, e.prototype.getCanvas = function () {
                return this.canvas
            }, e.prototype.getHitCanvas = function () {
                return this.hitCanvas
            }, e.prototype.getContext = function () {
                return this.getCanvas().getContext()
            }, e.prototype.clear = function (t) {
                return this.getContext().clear(t), this.getHitCanvas().getContext().clear(t), this
            }, e.prototype.setZIndex = function (e) {
                t.prototype.setZIndex.call(this, e);
                var i = this.getStage();
                return i && (i.content.removeChild(this.getCanvas()._canvas), e < i.children.length - 1 ? i.content.insertBefore(this.getCanvas()._canvas, i.children[e + 1].getCanvas()._canvas) : i.content.appendChild(this.getCanvas()._canvas)), this
            }, e.prototype.moveToTop = function () {
                X.prototype.moveToTop.call(this);
                var t = this.getStage();
                return t && (t.content.removeChild(this.getCanvas()._canvas), t.content.appendChild(this.getCanvas()._canvas)), !0
            }, e.prototype.moveUp = function () {
                if (!X.prototype.moveUp.call(this)) return !1;
                var t = this.getStage();
                return !!t && (t.content.removeChild(this.getCanvas()._canvas), this.index < t.children.length - 1 ? t.content.insertBefore(this.getCanvas()._canvas, t.children[this.index + 1].getCanvas()._canvas) : t.content.appendChild(this.getCanvas()._canvas), !0)
            }, e.prototype.moveDown = function () {
                if (X.prototype.moveDown.call(this)) {
                    var t = this.getStage();
                    if (t) {
                        var e = t.children;
                        t.content.removeChild(this.getCanvas()._canvas), t.content.insertBefore(this.getCanvas()._canvas, e[this.index + 1].getCanvas()._canvas)
                    }
                    return !0
                }
                return !1
            }, e.prototype.moveToBottom = function () {
                if (X.prototype.moveToBottom.call(this)) {
                    var t = this.getStage();
                    if (t) {
                        var e = t.children;
                        t.content.removeChild(this.getCanvas()._canvas), t.content.insertBefore(this.getCanvas()._canvas, e[1].getCanvas()._canvas)
                    }
                    return !0
                }
                return !1
            }, e.prototype.getLayer = function () {
                return this
            }, e.prototype.remove = function () {
                var t = this.getCanvas()._canvas;
                return X.prototype.remove.call(this), t && t.parentNode && f._isInDocument(t) && t.parentNode.removeChild(t), this
            }, e.prototype.getStage = function () {
                return this.parent
            }, e.prototype.setSize = function (t) {
                var e = t.width,
                    i = t.height;
                return this.canvas.setSize(e, i), this.hitCanvas.setSize(e, i), this._setSmoothEnabled(), this
            }, e.prototype._validateAdd = function (t) {
                var e = t.getType();
                "Group" !== e && "Shape" !== e && f.throw("You may only add groups and shapes to a layer.")
            }, e.prototype._toKonvaCanvas = function (t) {
                return (t = t || {}).width = t.width || this.getWidth(), t.height = t.height || this.getHeight(), t.x = void 0 !== t.x ? t.x : this.x(), t.y = void 0 !== t.y ? t.y : this.y(), X.prototype._toKonvaCanvas.call(this, t)
            }, e.prototype._checkVisibility = function () {
                var t = this.visible();
                this.canvas._canvas.style.display = t ? "block" : "none"
            }, e.prototype._setSmoothEnabled = function () {
                this.getContext()._context.imageSmoothingEnabled = this.imageSmoothingEnabled()
            }, e.prototype.getWidth = function () {
                if (this.parent) return this.parent.width()
            }, e.prototype.setWidth = function () {
                f.warn('Can not change width of layer. Use "stage.width(value)" function instead.')
            }, e.prototype.getHeight = function () {
                if (this.parent) return this.parent.height()
            }, e.prototype.setHeight = function () {
                f.warn('Can not change height of layer. Use "stage.height(value)" function instead.')
            }, e.prototype.batchDraw = function () {
                var t = this;
                return this._waitingForDraw || (this._waitingForDraw = !0, f.requestAnimFrame((function () {
                    t.draw(), t._waitingForDraw = !1
                }))), this
            }, e.prototype.getIntersection = function (t, e) {
                if (!this.isListening() || !this.isVisible()) return null;
                for (var i = 1, n = !1; ;) {
                    for (var r = 0; r < dt; r++) {
                        var o = ct[r],
                            a = this._getIntersection({
                                x: t.x + o.x * i,
                                y: t.y + o.y * i
                            }),
                            s = a.shape;
                        if (s && e) return s.findAncestor(e, !0);
                        if (s) return s;
                        if (n = !!a.antialiased, !a.antialiased) break
                    }
                    if (!n) return null;
                    i += 1
                }
            }, e.prototype._getIntersection = function (t) {
                var e = this.hitCanvas.pixelRatio,
                    i = this.hitCanvas.context.getImageData(Math.round(t.x * e), Math.round(t.y * e), 1, 1).data,
                    n = i[3];
                if (255 === n) {
                    var r = f._rgbToHex(i[0], i[1], i[2]),
                        o = ht["#" + r];
                    return o ? {
                        shape: o
                    } : {
                        antialiased: !0
                    }
                }
                return n > 0 ? {
                    antialiased: !0
                } : {}
            }, e.prototype.drawScene = function (t, e) {
                var i = this.getLayer(),
                    n = t || i && i.getCanvas();
                return this._fire("beforeDraw", {
                    node: this
                }), this.clearBeforeDraw() && n.getContext().clear(), U.prototype.drawScene.call(this, n, e), this._fire("draw", {
                    node: this
                }), this
            }, e.prototype.drawHit = function (t, e) {
                var i = this.getLayer(),
                    n = t || i && i.hitCanvas;
                return i && i.clearBeforeDraw() && i.getHitCanvas().getContext().clear(), U.prototype.drawHit.call(this, n, e), this
            }, e.prototype.enableHitGraph = function () {
                return this.hitGraphEnabled(!0), this
            }, e.prototype.disableHitGraph = function () {
                return this.hitGraphEnabled(!1), this
            }, e.prototype.setHitGraphEnabled = function (t) {
                f.warn("hitGraphEnabled method is deprecated. Please use layer.listening() instead."), this.listening(t)
            }, e.prototype.getHitGraphEnabled = function (t) {
                return f.warn("hitGraphEnabled method is deprecated. Please use layer.listening() instead."), this.listening()
            }, e.prototype.toggleHitCanvas = function () {
                if (this.parent) {
                    var t = this.parent;
                    !!this.hitCanvas._canvas.parentNode ? t.content.removeChild(this.hitCanvas._canvas) : t.content.appendChild(this.hitCanvas._canvas)
                }
            }, e
        }(U);
    ut.prototype.nodeType = "Layer", a(ut), w.addGetterSetter(ut, "imageSmoothingEnabled", !0), w.addGetterSetter(ut, "clearBeforeDraw", !0), w.addGetterSetter(ut, "hitGraphEnabled", !0, S()), s.mapMethods(ut);
    var pt = function (t) {
        function e(e) {
            var i = t.call(this, e) || this;
            return i.listening(!1), f.warn('Konva.Fast layer is deprecated. Please use "new Konva.Layer({ listening: false })" instead.'), i
        }
        return P(e, t), e
    }(ut);
    pt.prototype.nodeType = "FastLayer", a(pt), s.mapMethods(pt);
    var ft = function (t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        return P(e, t), e.prototype._validateAdd = function (t) {
            var e = t.getType();
            "Group" !== e && "Shape" !== e && f.throw("You may only add groups and shapes to groups.")
        }, e
    }(U);
    ft.prototype.nodeType = "Group", a(ft), s.mapMethods(ft);
    var gt = n.performance && n.performance.now ? function () {
        return n.performance.now()
    } : function () {
        return (new Date).getTime()
    },
        vt = function () {
            function t(e, i) {
                this.id = t.animIdCounter++, this.frame = {
                    time: 0,
                    timeDiff: 0,
                    lastTime: gt(),
                    frameRate: 0
                }, this.func = e, this.setLayers(i)
            }
            return t.prototype.setLayers = function (t) {
                var e = [];
                return e = t ? t.length > 0 ? t : [t] : [], this.layers = e, this
            }, t.prototype.getLayers = function () {
                return this.layers
            }, t.prototype.addLayer = function (t) {
                var e, i = this.layers,
                    n = i.length;
                for (e = 0; e < n; e++)
                    if (i[e]._id === t._id) return !1;
                return this.layers.push(t), !0
            }, t.prototype.isRunning = function () {
                var e, i = t.animations,
                    n = i.length;
                for (e = 0; e < n; e++)
                    if (i[e].id === this.id) return !0;
                return !1
            }, t.prototype.start = function () {
                return this.stop(), this.frame.timeDiff = 0, this.frame.lastTime = gt(), t._addAnimation(this), this
            }, t.prototype.stop = function () {
                return t._removeAnimation(this), this
            }, t.prototype._updateFrameObject = function (t) {
                this.frame.timeDiff = t - this.frame.lastTime, this.frame.lastTime = t, this.frame.time += this.frame.timeDiff, this.frame.frameRate = 1e3 / this.frame.timeDiff
            }, t._addAnimation = function (t) {
                this.animations.push(t), this._handleAnimation()
            }, t._removeAnimation = function (t) {
                var e, i = t.id,
                    n = this.animations,
                    r = n.length;
                for (e = 0; e < r; e++)
                    if (n[e].id === i) {
                        this.animations.splice(e, 1);
                        break
                    }
            }, t._runFrames = function () {
                var t, e, i, n, r, o, a, s, h = {},
                    l = this.animations;
                for (n = 0; n < l.length; n++)
                    if (e = (t = l[n]).layers, i = t.func, t._updateFrameObject(gt()), o = e.length, !i || !1 !== i.call(t, t.frame))
                        for (r = 0; r < o; r++) void 0 !== (a = e[r])._id && (h[a._id] = a);
                for (s in h) h.hasOwnProperty(s) && h[s].draw()
            }, t._animationLoop = function () {
                var e = t;
                e.animations.length ? (e._runFrames(), requestAnimationFrame(e._animationLoop)) : e.animRunning = !1
            }, t._handleAnimation = function () {
                this.animRunning || (this.animRunning = !0, requestAnimationFrame(this._animationLoop))
            }, t.animations = [], t.animIdCounter = 0, t.animRunning = !1, t
        }(),
        yt = {
            node: 1,
            duration: 1,
            easing: 1,
            onFinish: 1,
            yoyo: 1
        },
        mt = 0,
        _t = ["fill", "stroke", "shadowColor"],
        bt = function () {
            function t(t, e, i, n, r, o, a) {
                this.prop = t, this.propFunc = e, this.begin = n, this._pos = n, this.duration = o, this._change = 0, this.prevPos = 0, this.yoyo = a, this._time = 0, this._position = 0, this._startTime = 0, this._finish = 0, this.func = i, this._change = r - this.begin, this.pause()
            }
            return t.prototype.fire = function (t) {
                var e = this[t];
                e && e()
            }, t.prototype.setTime = function (t) {
                t > this.duration ? this.yoyo ? (this._time = this.duration, this.reverse()) : this.finish() : t < 0 ? this.yoyo ? (this._time = 0, this.play()) : this.reset() : (this._time = t, this.update())
            }, t.prototype.getTime = function () {
                return this._time
            }, t.prototype.setPosition = function (t) {
                this.prevPos = this._pos, this.propFunc(t), this._pos = t
            }, t.prototype.getPosition = function (t) {
                return void 0 === t && (t = this._time), this.func(t, this.begin, this._change, this.duration)
            }, t.prototype.play = function () {
                this.state = 2, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onPlay")
            }, t.prototype.reverse = function () {
                this.state = 3, this._time = this.duration - this._time, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onReverse")
            }, t.prototype.seek = function (t) {
                this.pause(), this._time = t, this.update(), this.fire("onSeek")
            }, t.prototype.reset = function () {
                this.pause(), this._time = 0, this.update(), this.fire("onReset")
            }, t.prototype.finish = function () {
                this.pause(), this._time = this.duration, this.update(), this.fire("onFinish")
            }, t.prototype.update = function () {
                this.setPosition(this.getPosition(this._time)), this.fire("onUpdate")
            }, t.prototype.onEnterFrame = function () {
                var t = this.getTimer() - this._startTime;
                2 === this.state ? this.setTime(t) : 3 === this.state && this.setTime(this.duration - t)
            }, t.prototype.pause = function () {
                this.state = 1, this.fire("onPause")
            }, t.prototype.getTimer = function () {
                return (new Date).getTime()
            }, t
        }(),
        xt = function () {
            function t(e) {
                var i, n, o = this,
                    a = e.node,
                    s = a._id,
                    h = e.easing || St.Linear,
                    l = !!e.yoyo;
                i = void 0 === e.duration ? .3 : 0 === e.duration ? .001 : e.duration, this.node = a, this._id = mt++;
                var c = a.getLayer() || (a instanceof r.Stage ? a.getLayers() : null);
                for (n in c || f.error("Tween constructor have `node` that is not in a layer. Please add node into layer first."), this.anim = new vt((function () {
                    o.tween.onEnterFrame()
                }), c), this.tween = new bt(n, (function (t) {
                    o._tweenFunc(t)
                }), h, 0, 1, 1e3 * i, l), this._addListeners(), t.attrs[s] || (t.attrs[s] = {}), t.attrs[s][this._id] || (t.attrs[s][this._id] = {}), t.tweens[s] || (t.tweens[s] = {}), e) void 0 === yt[n] && this._addAttr(n, e[n]);
                this.reset(), this.onFinish = e.onFinish, this.onReset = e.onReset, this.onUpdate = e.onUpdate
            }
            return t.prototype._addAttr = function (e, i) {
                var n, r, o, a, s, h, l, c, d = this.node,
                    u = d._id;
                if ((o = t.tweens[u][e]) && delete t.attrs[u][o][e], n = d.getAttr(e), f._isArray(i))
                    if (r = [], s = Math.max(i.length, n.length), "points" === e && i.length !== n.length && (i.length > n.length ? (l = n, n = f._prepareArrayForTween(n, i, d.closed())) : (h = i, i = f._prepareArrayForTween(i, n, d.closed()))), 0 === e.indexOf("fill"))
                        for (a = 0; a < s; a++)
                            if (a % 2 == 0) r.push(i[a] - n[a]);
                            else {
                                var p = f.colorToRGBA(n[a]);
                                c = f.colorToRGBA(i[a]), n[a] = p, r.push({
                                    r: c.r - p.r,
                                    g: c.g - p.g,
                                    b: c.b - p.b,
                                    a: c.a - p.a
                                })
                            }
                    else
                        for (a = 0; a < s; a++) r.push(i[a] - n[a]);
                else -1 !== _t.indexOf(e) ? (n = f.colorToRGBA(n), r = {
                    r: (c = f.colorToRGBA(i)).r - n.r,
                    g: c.g - n.g,
                    b: c.b - n.b,
                    a: c.a - n.a
                }) : r = i - n;
                t.attrs[u][this._id][e] = {
                    start: n,
                    diff: r,
                    end: i,
                    trueEnd: h,
                    trueStart: l
                }, t.tweens[u][e] = this._id
            }, t.prototype._tweenFunc = function (e) {
                var i, n, r, o, a, s, h, l, c = this.node,
                    d = t.attrs[c._id][this._id];
                for (i in d) {
                    if (r = (n = d[i]).start, o = n.diff, l = n.end, f._isArray(r))
                        if (a = [], h = Math.max(r.length, l.length), 0 === i.indexOf("fill"))
                            for (s = 0; s < h; s++) s % 2 == 0 ? a.push((r[s] || 0) + o[s] * e) : a.push("rgba(" + Math.round(r[s].r + o[s].r * e) + "," + Math.round(r[s].g + o[s].g * e) + "," + Math.round(r[s].b + o[s].b * e) + "," + (r[s].a + o[s].a * e) + ")");
                        else
                            for (s = 0; s < h; s++) a.push((r[s] || 0) + o[s] * e);
                    else a = -1 !== _t.indexOf(i) ? "rgba(" + Math.round(r.r + o.r * e) + "," + Math.round(r.g + o.g * e) + "," + Math.round(r.b + o.b * e) + "," + (r.a + o.a * e) + ")" : r + o * e;
                    c.setAttr(i, a)
                }
            }, t.prototype._addListeners = function () {
                var e = this;
                this.tween.onPlay = function () {
                    e.anim.start()
                }, this.tween.onReverse = function () {
                    e.anim.start()
                }, this.tween.onPause = function () {
                    e.anim.stop()
                }, this.tween.onFinish = function () {
                    var i = e.node,
                        n = t.attrs[i._id][e._id];
                    n.points && n.points.trueEnd && i.setAttr("points", n.points.trueEnd), e.onFinish && e.onFinish.call(e)
                }, this.tween.onReset = function () {
                    var i = e.node,
                        n = t.attrs[i._id][e._id];
                    n.points && n.points.trueStart && i.points(n.points.trueStart), e.onReset && e.onReset()
                }, this.tween.onUpdate = function () {
                    e.onUpdate && e.onUpdate.call(e)
                }
            }, t.prototype.play = function () {
                return this.tween.play(), this
            }, t.prototype.reverse = function () {
                return this.tween.reverse(), this
            }, t.prototype.reset = function () {
                return this.tween.reset(), this
            }, t.prototype.seek = function (t) {
                return this.tween.seek(1e3 * t), this
            }, t.prototype.pause = function () {
                return this.tween.pause(), this
            }, t.prototype.finish = function () {
                return this.tween.finish(), this
            }, t.prototype.destroy = function () {
                var e, i = this.node._id,
                    n = this._id,
                    r = t.tweens[i];
                for (e in this.pause(), r) delete t.tweens[i][e];
                delete t.attrs[i][n]
            }, t.attrs = {}, t.tweens = {}, t
        }();
    X.prototype.to = function (t) {
        var e = t.onFinish;
        t.node = this, t.onFinish = function () {
            this.destroy(), e && e()
        }, new xt(t).play()
    };
    var St = {
        BackEaseIn: function (t, e, i, n) {
            var r = 1.70158;
            return i * (t /= n) * t * ((r + 1) * t - r) + e
        },
        BackEaseOut: function (t, e, i, n) {
            var r = 1.70158;
            return i * ((t = t / n - 1) * t * ((r + 1) * t + r) + 1) + e
        },
        BackEaseInOut: function (t, e, i, n) {
            var r = 1.70158;
            return (t /= n / 2) < 1 ? i / 2 * (t * t * ((1 + (r *= 1.525)) * t - r)) + e : i / 2 * ((t -= 2) * t * ((1 + (r *= 1.525)) * t + r) + 2) + e
        },
        ElasticEaseIn: function (t, e, i, n, r, o) {
            var a = 0;
            return 0 === t ? e : 1 == (t /= n) ? e + i : (o || (o = .3 * n), !r || r < Math.abs(i) ? (r = i, a = o / 4) : a = o / (2 * Math.PI) * Math.asin(i / r), -r * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * n - a) * (2 * Math.PI) / o) + e)
        },
        ElasticEaseOut: function (t, e, i, n, r, o) {
            var a = 0;
            return 0 === t ? e : 1 == (t /= n) ? e + i : (o || (o = .3 * n), !r || r < Math.abs(i) ? (r = i, a = o / 4) : a = o / (2 * Math.PI) * Math.asin(i / r), r * Math.pow(2, -10 * t) * Math.sin((t * n - a) * (2 * Math.PI) / o) + i + e)
        },
        ElasticEaseInOut: function (t, e, i, n, r, o) {
            var a = 0;
            return 0 === t ? e : 2 == (t /= n / 2) ? e + i : (o || (o = n * (.3 * 1.5)), !r || r < Math.abs(i) ? (r = i, a = o / 4) : a = o / (2 * Math.PI) * Math.asin(i / r), t < 1 ? r * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * n - a) * (2 * Math.PI) / o) * -.5 + e : r * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * n - a) * (2 * Math.PI) / o) * .5 + i + e)
        },
        BounceEaseOut: function (t, e, i, n) {
            return (t /= n) < 1 / 2.75 ? i * (7.5625 * t * t) + e : t < 2 / 2.75 ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e : t < 2.5 / 2.75 ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e : i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e
        },
        BounceEaseIn: function (t, e, i, n) {
            return i - St.BounceEaseOut(n - t, 0, i, n) + e
        },
        BounceEaseInOut: function (t, e, i, n) {
            return t < n / 2 ? .5 * St.BounceEaseIn(2 * t, 0, i, n) + e : .5 * St.BounceEaseOut(2 * t - n, 0, i, n) + .5 * i + e
        },
        EaseIn: function (t, e, i, n) {
            return i * (t /= n) * t + e
        },
        EaseOut: function (t, e, i, n) {
            return -i * (t /= n) * (t - 2) + e
        },
        EaseInOut: function (t, e, i, n) {
            return (t /= n / 2) < 1 ? i / 2 * t * t + e : -i / 2 * (--t * (t - 2) - 1) + e
        },
        StrongEaseIn: function (t, e, i, n) {
            return i * (t /= n) * t * t * t * t + e
        },
        StrongEaseOut: function (t, e, i, n) {
            return i * ((t = t / n - 1) * t * t * t * t + 1) + e
        },
        StrongEaseInOut: function (t, e, i, n) {
            return (t /= n / 2) < 1 ? i / 2 * t * t * t * t * t + e : i / 2 * ((t -= 2) * t * t * t * t + 2) + e
        },
        Linear: function (t, e, i, n) {
            return i * t / n + e
        }
    },
        wt = f._assign(r, {
            Collection: s,
            Util: f,
            Transform: h,
            Node: X,
            ids: I,
            names: F,
            Container: U,
            Stage: ot,
            stages: nt,
            Layer: ut,
            FastLayer: pt,
            Group: ft,
            DD: D,
            Shape: lt,
            shapes: ht,
            Animation: vt,
            Tween: xt,
            Easings: St,
            Context: A,
            Canvas: L
        }),
        Ct = function (t) {
            function e() {
                return null !== t && t.apply(this, arguments) || this
            }
            return P(e, t), e.prototype._sceneFunc = function (t) {
                var e = r.getAngle(this.angle()),
                    i = this.clockwise();
                t.beginPath(), t.arc(0, 0, this.outerRadius(), 0, e, i), t.arc(0, 0, this.innerRadius(), e, 0, !i), t.closePath(), t.fillStrokeShape(this)
            }, e.prototype.getWidth = function () {
                return 2 * this.outerRadius()
            }, e.prototype.getHeight = function () {
                return 2 * this.outerRadius()
            }, e.prototype.setWidth = function (t) {
                this.outerRadius(t / 2)
            }, e.prototype.setHeight = function (t) {
                this.outerRadius(t / 2)
            }, e
        }(lt);
    Ct.prototype._centroid = !0, Ct.prototype.className = "Arc", Ct.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"], a(Ct), w.addGetterSetter(Ct, "innerRadius", 0, y()), w.addGetterSetter(Ct, "outerRadius", 0, y()), w.addGetterSetter(Ct, "angle", 0, y()), w.addGetterSetter(Ct, "clockwise", !1, S()), s.mapMethods(Ct);
    var Pt = function (t) {
        function e(e) {
            var i = t.call(this, e) || this;
            return i.on("pointsChange.konva tensionChange.konva closedChange.konva bezierChange.konva", (function () {
                this._clearCache("tensionPoints")
            })), i
        }
        return P(e, t), e.prototype._sceneFunc = function (t) {
            var e, i, n, r = this.points(),
                o = r.length,
                a = this.tension(),
                s = this.closed(),
                h = this.bezier();
            if (o) {
                if (t.beginPath(), t.moveTo(r[0], r[1]), 0 !== a && o > 4) {
                    for (i = (e = this.getTensionPoints()).length, n = s ? 0 : 4, s || t.quadraticCurveTo(e[0], e[1], e[2], e[3]); n < i - 2;) t.bezierCurveTo(e[n++], e[n++], e[n++], e[n++], e[n++], e[n++]);
                    s || t.quadraticCurveTo(e[i - 2], e[i - 1], r[o - 2], r[o - 1])
                } else if (h)
                    for (n = 2; n < o;) t.bezierCurveTo(r[n++], r[n++], r[n++], r[n++], r[n++], r[n++]);
                else
                    for (n = 2; n < o; n += 2) t.lineTo(r[n], r[n + 1]);
                s ? (t.closePath(), t.fillStrokeShape(this)) : t.strokeShape(this)
            }
        }, e.prototype.getTensionPoints = function () {
            return this._getCache("tensionPoints", this._getTensionPoints)
        }, e.prototype._getTensionPoints = function () {
            return this.closed() ? this._getTensionPointsClosed() : f._expandPoints(this.points(), this.tension())
        }, e.prototype._getTensionPointsClosed = function () {
            var t = this.points(),
                e = t.length,
                i = this.tension(),
                n = f._getControlPoints(t[e - 2], t[e - 1], t[0], t[1], t[2], t[3], i),
                r = f._getControlPoints(t[e - 4], t[e - 3], t[e - 2], t[e - 1], t[0], t[1], i),
                o = f._expandPoints(t, i);
            return [n[2], n[3]].concat(o).concat([r[0], r[1], t[e - 2], t[e - 1], r[2], r[3], n[0], n[1], t[0], t[1]])
        }, e.prototype.getWidth = function () {
            return this.getSelfRect().width
        }, e.prototype.getHeight = function () {
            return this.getSelfRect().height
        }, e.prototype.getSelfRect = function () {
            var t = this.points();
            if (t.length < 4) return {
                x: t[0] || 0,
                y: t[1] || 0,
                width: 0,
                height: 0
            };
            for (var e, i, n = (t = 0 !== this.tension() ? function () {
                for (var t = 0, e = 0, i = arguments.length; e < i; e++) t += arguments[e].length;
                var n = Array(t),
                    r = 0;
                for (e = 0; e < i; e++)
                    for (var o = arguments[e], a = 0, s = o.length; a < s; a++, r++) n[r] = o[a];
                return n
            }([t[0], t[1]], this._getTensionPoints(), [t[t.length - 2], t[t.length - 1]]) : this.points())[0], r = t[0], o = t[1], a = t[1], s = 0; s < t.length / 2; s++) e = t[2 * s], i = t[2 * s + 1], n = Math.min(n, e), r = Math.max(r, e), o = Math.min(o, i), a = Math.max(a, i);
            return {
                x: n,
                y: o,
                width: r - n,
                height: a - o
            }
        }, e
    }(lt);
    Pt.prototype.className = "Line", Pt.prototype._attrsAffectingSize = ["points", "bezier", "tension"], a(Pt), w.addGetterSetter(Pt, "closed", !1), w.addGetterSetter(Pt, "bezier", !1), w.addGetterSetter(Pt, "tension", 0, y()), w.addGetterSetter(Pt, "points", [], function () {
        if (r.isUnminified) return function (t, e) {
            return f._isArray(t) ? t.forEach((function (t) {
                f._isNumber(t) || f.warn('"' + e + '" attribute has non numeric element ' + t + ". Make sure that all elements are numbers.")
            })) : f.warn(g(t) + ' is a not valid value for "' + e + '" attribute. The value should be a array of numbers.'), t
        }
    }()), s.mapMethods(Pt);
    var kt = function (t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        return P(e, t), e.prototype._sceneFunc = function (e) {
            t.prototype._sceneFunc.call(this, e);
            var i = 2 * Math.PI,
                n = this.points(),
                r = n,
                o = 0 !== this.tension() && n.length > 4;
            o && (r = this.getTensionPoints());
            var a, s, h = n.length;
            o ? (a = n[h - 2] - (r[r.length - 2] + r[r.length - 4]) / 2, s = n[h - 1] - (r[r.length - 1] + r[r.length - 3]) / 2) : (a = n[h - 2] - n[h - 4], s = n[h - 1] - n[h - 3]);
            var l = (Math.atan2(s, a) + i) % i,
                c = this.pointerLength(),
                d = this.pointerWidth();
            e.save(), e.beginPath(), e.translate(n[h - 2], n[h - 1]), e.rotate(l), e.moveTo(0, 0), e.lineTo(-c, d / 2), e.lineTo(-c, -d / 2), e.closePath(), e.restore(), this.pointerAtBeginning() && (e.save(), e.translate(n[0], n[1]), o ? (a = (r[0] + r[2]) / 2 - n[0], s = (r[1] + r[3]) / 2 - n[1]) : (a = n[2] - n[0], s = n[3] - n[1]), e.rotate((Math.atan2(-s, -a) + i) % i), e.moveTo(0, 0), e.lineTo(-c, d / 2), e.lineTo(-c, -d / 2), e.closePath(), e.restore());
            var u = this.dashEnabled();
            u && (this.attrs.dashEnabled = !1, e.setLineDash([])), e.fillStrokeShape(this), u && (this.attrs.dashEnabled = !0)
        }, e.prototype.getSelfRect = function () {
            var e = t.prototype.getSelfRect.call(this),
                i = this.pointerWidth() / 2;
            return {
                x: e.x - i,
                y: e.y - i,
                width: e.width + 2 * i,
                height: e.height + 2 * i
            }
        }, e
    }(Pt);
    kt.prototype.className = "Arrow", a(kt), w.addGetterSetter(kt, "pointerLength", 10, y()), w.addGetterSetter(kt, "pointerWidth", 10, y()), w.addGetterSetter(kt, "pointerAtBeginning", !1), s.mapMethods(kt);
    var Tt = function (t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        return P(e, t), e.prototype._sceneFunc = function (t) {
            t.beginPath(), t.arc(0, 0, this.attrs.radius || 0, 0, 2 * Math.PI, !1), t.closePath(), t.fillStrokeShape(this)
        }, e.prototype.getWidth = function () {
            return 2 * this.radius()
        }, e.prototype.getHeight = function () {
            return 2 * this.radius()
        }, e.prototype.setWidth = function (t) {
            this.radius() !== t / 2 && this.radius(t / 2)
        }, e.prototype.setHeight = function (t) {
            this.radius() !== t / 2 && this.radius(t / 2)
        }, e
    }(lt);
    Tt.prototype._centroid = !0, Tt.prototype.className = "Circle", Tt.prototype._attrsAffectingSize = ["radius"], a(Tt), w.addGetterSetter(Tt, "radius", 0, y()), s.mapMethods(Tt);
    var At = function (t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        return P(e, t), e.prototype._sceneFunc = function (t) {
            var e = this.radiusX(),
                i = this.radiusY();
            t.beginPath(), t.save(), e !== i && t.scale(1, i / e), t.arc(0, 0, e, 0, 2 * Math.PI, !1), t.restore(), t.closePath(), t.fillStrokeShape(this)
        }, e.prototype.getWidth = function () {
            return 2 * this.radiusX()
        }, e.prototype.getHeight = function () {
            return 2 * this.radiusY()
        }, e.prototype.setWidth = function (t) {
            this.radiusX(t / 2)
        }, e.prototype.setHeight = function (t) {
            this.radiusY(t / 2)
        }, e
    }(lt);
    At.prototype.className = "Ellipse", At.prototype._centroid = !0, At.prototype._attrsAffectingSize = ["radiusX", "radiusY"], a(At), w.addComponentsGetterSetter(At, "radius", ["x", "y"]), w.addGetterSetter(At, "radiusX", 0, y()), w.addGetterSetter(At, "radiusY", 0, y()), s.mapMethods(At);
    var Mt = function (t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        return P(e, t), e.prototype._useBufferCanvas = function () {
            return t.prototype._useBufferCanvas.call(this, !0)
        }, e.prototype._sceneFunc = function (t) {
            var e, i = this.getWidth(),
                n = this.getHeight(),
                r = this.attrs.image;
            if (r) {
                var o = this.attrs.cropWidth,
                    a = this.attrs.cropHeight;
                e = o && a ? [r, this.cropX(), this.cropY(), o, a, 0, 0, i, n] : [r, 0, 0, i, n]
            } (this.hasFill() || this.hasStroke()) && (t.beginPath(), t.rect(0, 0, i, n), t.closePath(), t.fillStrokeShape(this)), r && t.drawImage.apply(t, e)
        }, e.prototype._hitFunc = function (t) {
            var e = this.width(),
                i = this.height();
            t.beginPath(), t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this)
        }, e.prototype.getWidth = function () {
            var t, e;
            return null !== (t = this.attrs.width) && void 0 !== t ? t : (null === (e = this.image()) || void 0 === e ? void 0 : e.width) || 0
        }, e.prototype.getHeight = function () {
            var t, e;
            return null !== (t = this.attrs.height) && void 0 !== t ? t : (null === (e = this.image()) || void 0 === e ? void 0 : e.height) || 0
        }, e.fromURL = function (t, i) {
            var n = f.createImageElement();
            n.onload = function () {
                var t = new e({
                    image: n
                });
                i(t)
            }, n.crossOrigin = "Anonymous", n.src = t
        }, e
    }(lt);
    Mt.prototype.className = "Image", a(Mt), w.addGetterSetter(Mt, "image"), w.addComponentsGetterSetter(Mt, "crop", ["x", "y", "width", "height"]), w.addGetterSetter(Mt, "cropX", 0, y()), w.addGetterSetter(Mt, "cropY", 0, y()), w.addGetterSetter(Mt, "cropWidth", 0, y()), w.addGetterSetter(Mt, "cropHeight", 0, y()), s.mapMethods(Mt);
    var Gt = ["fontFamily", "fontSize", "fontStyle", "padding", "lineHeight", "text", "width"],
        Rt = Gt.length,
        Lt = function (t) {
            function e(e) {
                var i = t.call(this, e) || this;
                return i.on("add.konva", (function (t) {
                    this._addListeners(t.child), this._sync()
                })), i
            }
            return P(e, t), e.prototype.getText = function () {
                return this.find("Text")[0]
            }, e.prototype.getTag = function () {
                return this.find("Tag")[0]
            }, e.prototype._addListeners = function (t) {
                var e, i = this,
                    n = function () {
                        i._sync()
                    };
                for (e = 0; e < Rt; e++) t.on(Gt[e] + "Change.konva", n)
            }, e.prototype.getWidth = function () {
                return this.getText().width()
            }, e.prototype.getHeight = function () {
                return this.getText().height()
            }, e.prototype._sync = function () {
                var t, e, i, n, r, o, a, s = this.getText(),
                    h = this.getTag();
                if (s && h) {
                    switch (t = s.width(), e = s.height(), i = h.pointerDirection(), n = h.pointerWidth(), a = h.pointerHeight(), r = 0, o = 0, i) {
                        case "up":
                            r = t / 2, o = -1 * a;
                            break;
                        case "right":
                            r = t + n, o = e / 2;
                            break;
                        case "down":
                            r = t / 2, o = e + a;
                            break;
                        case "left":
                            r = -1 * n, o = e / 2
                    }
                    h.setAttrs({
                        x: -1 * r,
                        y: -1 * o,
                        width: t,
                        height: e
                    }), s.setAttrs({
                        x: -1 * r,
                        y: -1 * o
                    })
                }
            }, e
        }(ft);
    Lt.prototype.className = "Label", a(Lt), s.mapMethods(Lt);
    var Et = function (t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        return P(e, t), e.prototype._sceneFunc = function (t) {
            var e = this.width(),
                i = this.height(),
                n = this.pointerDirection(),
                r = this.pointerWidth(),
                o = this.pointerHeight(),
                a = this.cornerRadius(),
                s = 0,
                h = 0,
                l = 0,
                c = 0;
            "number" == typeof a ? s = h = l = c = Math.min(a, e / 2, i / 2) : (s = Math.min(a[0] || 0, e / 2, i / 2), h = Math.min(a[1] || 0, e / 2, i / 2), c = Math.min(a[2] || 0, e / 2, i / 2), l = Math.min(a[3] || 0, e / 2, i / 2)), t.beginPath(), t.moveTo(s, 0), "up" === n && (t.lineTo((e - r) / 2, 0), t.lineTo(e / 2, -1 * o), t.lineTo((e + r) / 2, 0)), t.lineTo(e - h, 0), t.arc(e - h, h, h, 3 * Math.PI / 2, 0, !1), "right" === n && (t.lineTo(e, (i - o) / 2), t.lineTo(e + r, i / 2), t.lineTo(e, (i + o) / 2)), t.lineTo(e, i - c), t.arc(e - c, i - c, c, 0, Math.PI / 2, !1), "down" === n && (t.lineTo((e + r) / 2, i), t.lineTo(e / 2, i + o), t.lineTo((e - r) / 2, i)), t.lineTo(l, i), t.arc(l, i - l, l, Math.PI / 2, Math.PI, !1), "left" === n && (t.lineTo(0, (i + o) / 2), t.lineTo(-1 * r, i / 2), t.lineTo(0, (i - o) / 2)), t.lineTo(0, s), t.arc(s, s, s, Math.PI, 3 * Math.PI / 2, !1), t.closePath(), t.fillStrokeShape(this)
        }, e.prototype.getSelfRect = function () {
            var t = 0,
                e = 0,
                i = this.pointerWidth(),
                n = this.pointerHeight(),
                r = this.pointerDirection(),
                o = this.width(),
                a = this.height();
            return "up" === r ? (e -= n, a += n) : "down" === r ? a += n : "left" === r ? (t -= 1.5 * i, o += i) : "right" === r && (o += 1.5 * i), {
                x: t,
                y: e,
                width: o,
                height: a
            }
        }, e
    }(lt);
    Et.prototype.className = "Tag", a(Et), w.addGetterSetter(Et, "pointerDirection", "none"), w.addGetterSetter(Et, "pointerWidth", 0, y()), w.addGetterSetter(Et, "pointerHeight", 0, y()), w.addGetterSetter(Et, "cornerRadius", 0, m(4)), s.mapMethods(Et);
    var Ot = function (t) {
        function e(i) {
            var n = t.call(this, i) || this;
            n.dataArray = [], n.pathLength = 0, n.dataArray = e.parsePathData(n.data()), n.pathLength = 0;
            for (var r = 0; r < n.dataArray.length; ++r) n.pathLength += n.dataArray[r].pathLength;
            return n.on("dataChange.konva", (function () {
                this.dataArray = e.parsePathData(this.data()), this.pathLength = 0;
                for (var t = 0; t < this.dataArray.length; ++t) this.pathLength += this.dataArray[t].pathLength
            })), n
        }
        return P(e, t), e.prototype._sceneFunc = function (t) {
            var e = this.dataArray;
            t.beginPath();
            for (var i = !1, n = 0; n < e.length; n++) {
                var r = e[n].command,
                    o = e[n].points;
                switch (r) {
                    case "L":
                        t.lineTo(o[0], o[1]);
                        break;
                    case "M":
                        t.moveTo(o[0], o[1]);
                        break;
                    case "C":
                        t.bezierCurveTo(o[0], o[1], o[2], o[3], o[4], o[5]);
                        break;
                    case "Q":
                        t.quadraticCurveTo(o[0], o[1], o[2], o[3]);
                        break;
                    case "A":
                        var a = o[0],
                            s = o[1],
                            h = o[2],
                            l = o[3],
                            c = o[4],
                            d = o[5],
                            u = o[6],
                            p = o[7],
                            f = h > l ? h : l,
                            g = h > l ? 1 : h / l,
                            v = h > l ? l / h : 1;
                        t.translate(a, s), t.rotate(u), t.scale(g, v), t.arc(0, 0, f, c, c + d, 1 - p), t.scale(1 / g, 1 / v), t.rotate(-u), t.translate(-a, -s);
                        break;
                    case "z":
                        i = !0, t.closePath()
                }
            }
            i || this.hasFill() ? t.fillStrokeShape(this) : t.strokeShape(this)
        }, e.prototype.getSelfRect = function () {
            var t = [];
            this.dataArray.forEach((function (i) {
                if ("A" === i.command) {
                    var n = i.points[4],
                        r = i.points[5],
                        o = i.points[4] + r,
                        a = Math.PI / 180;
                    if (Math.abs(n - o) < a && (a = Math.abs(n - o)), r < 0)
                        for (var s = n - a; s > o; s -= a) {
                            var h = e.getPointOnEllipticalArc(i.points[0], i.points[1], i.points[2], i.points[3], s, 0);
                            t.push(h.x, h.y)
                        } else
                        for (s = n + a; s < o; s += a) {
                            h = e.getPointOnEllipticalArc(i.points[0], i.points[1], i.points[2], i.points[3], s, 0);
                            t.push(h.x, h.y)
                        }
                } else if ("C" === i.command)
                    for (s = 0; s <= 1; s += .01) {
                        h = e.getPointOnCubicBezier(s, i.start.x, i.start.y, i.points[0], i.points[1], i.points[2], i.points[3], i.points[4], i.points[5]);
                        t.push(h.x, h.y)
                    } else t = t.concat(i.points)
            }));
            for (var i, n, r = t[0], o = t[0], a = t[1], s = t[1], h = 0; h < t.length / 2; h++) i = t[2 * h], n = t[2 * h + 1], isNaN(i) || (r = Math.min(r, i), o = Math.max(o, i)), isNaN(n) || (a = Math.min(a, n), s = Math.max(s, n));
            return {
                x: Math.round(r),
                y: Math.round(a),
                width: Math.round(o - r),
                height: Math.round(s - a)
            }
        }, e.prototype.getLength = function () {
            return this.pathLength
        }, e.prototype.getPointAtLength = function (t) {
            var i, n = 0,
                r = this.dataArray.length;
            if (!r) return null;
            for (; n < r && t > this.dataArray[n].pathLength;) t -= this.dataArray[n].pathLength, ++n;
            if (n === r) return {
                x: (i = this.dataArray[n - 1].points.slice(-2))[0],
                y: i[1]
            };
            if (t < .01) return {
                x: (i = this.dataArray[n].points.slice(0, 2))[0],
                y: i[1]
            };
            var o = this.dataArray[n],
                a = o.points;
            switch (o.command) {
                case "L":
                    return e.getPointOnLine(t, o.start.x, o.start.y, a[0], a[1]);
                case "C":
                    return e.getPointOnCubicBezier(t / o.pathLength, o.start.x, o.start.y, a[0], a[1], a[2], a[3], a[4], a[5]);
                case "Q":
                    return e.getPointOnQuadraticBezier(t / o.pathLength, o.start.x, o.start.y, a[0], a[1], a[2], a[3]);
                case "A":
                    var s = a[0],
                        h = a[1],
                        l = a[2],
                        c = a[3],
                        d = a[4],
                        u = a[5],
                        p = a[6];
                    return d += u * t / o.pathLength, e.getPointOnEllipticalArc(s, h, l, c, d, p)
            }
            return null
        }, e.getLineLength = function (t, e, i, n) {
            return Math.sqrt((i - t) * (i - t) + (n - e) * (n - e))
        }, e.getPointOnLine = function (t, e, i, n, r, o, a) {
            void 0 === o && (o = e), void 0 === a && (a = i);
            var s = (r - i) / (n - e + 1e-8),
                h = Math.sqrt(t * t / (1 + s * s));
            n < e && (h *= -1);
            var l, c = s * h;
            if (n === e) l = {
                x: o,
                y: a + c
            };
            else if ((a - i) / (o - e + 1e-8) === s) l = {
                x: o + h,
                y: a + c
            };
            else {
                var d, u, p = this.getLineLength(e, i, n, r),
                    f = (o - e) * (n - e) + (a - i) * (r - i);
                d = e + (f /= p * p) * (n - e), u = i + f * (r - i);
                var g = this.getLineLength(o, a, d, u),
                    v = Math.sqrt(t * t - g * g);
                h = Math.sqrt(v * v / (1 + s * s)), n < e && (h *= -1), l = {
                    x: d + h,
                    y: u + (c = s * h)
                }
            }
            return l
        }, e.getPointOnCubicBezier = function (t, e, i, n, r, o, a, s, h) {
            function l(t) {
                return t * t * t
            }

            function c(t) {
                return 3 * t * t * (1 - t)
            }

            function d(t) {
                return 3 * t * (1 - t) * (1 - t)
            }

            function u(t) {
                return (1 - t) * (1 - t) * (1 - t)
            }
            return {
                x: s * l(t) + o * c(t) + n * d(t) + e * u(t),
                y: h * l(t) + a * c(t) + r * d(t) + i * u(t)
            }
        }, e.getPointOnQuadraticBezier = function (t, e, i, n, r, o, a) {
            function s(t) {
                return t * t
            }

            function h(t) {
                return 2 * t * (1 - t)
            }

            function l(t) {
                return (1 - t) * (1 - t)
            }
            return {
                x: o * s(t) + n * h(t) + e * l(t),
                y: a * s(t) + r * h(t) + i * l(t)
            }
        }, e.getPointOnEllipticalArc = function (t, e, i, n, r, o) {
            var a = Math.cos(o),
                s = Math.sin(o),
                h = i * Math.cos(r),
                l = n * Math.sin(r);
            return {
                x: t + (h * a - l * s),
                y: e + (h * s + l * a)
            }
        }, e.parsePathData = function (t) {
            if (!t) return [];
            var e = t,
                i = ["m", "M", "l", "L", "v", "V", "h", "H", "z", "Z", "c", "C", "q", "Q", "t", "T", "s", "S", "a", "A"];
            e = e.replace(new RegExp(" ", "g"), ",");
            for (var n = 0; n < i.length; n++) e = e.replace(new RegExp(i[n], "g"), "|" + i[n]);
            var r, o = e.split("|"),
                a = [],
                s = [],
                h = 0,
                l = 0,
                c = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi;
            for (n = 1; n < o.length; n++) {
                var d = o[n],
                    u = d.charAt(0);
                for (d = d.slice(1), s.length = 0; r = c.exec(d);) s.push(r[0]);
                for (var p = [], f = 0, g = s.length; f < g; f++) {
                    var v = parseFloat(s[f]);
                    isNaN(v) ? p.push(0) : p.push(v)
                }
                for (; p.length > 0 && !isNaN(p[0]);) {
                    var y, m, _, b, x, S, w, C, P, k, T = null,
                        A = [],
                        M = h,
                        G = l;
                    switch (u) {
                        case "l":
                            h += p.shift(), l += p.shift(), T = "L", A.push(h, l);
                            break;
                        case "L":
                            h = p.shift(), l = p.shift(), A.push(h, l);
                            break;
                        case "m":
                            var R = p.shift(),
                                L = p.shift();
                            if (h += R, l += L, T = "M", a.length > 2 && "z" === a[a.length - 1].command)
                                for (var E = a.length - 2; E >= 0; E--)
                                    if ("M" === a[E].command) {
                                        h = a[E].points[0] + R, l = a[E].points[1] + L;
                                        break
                                    } A.push(h, l), u = "l";
                            break;
                        case "M":
                            h = p.shift(), l = p.shift(), T = "M", A.push(h, l), u = "L";
                            break;
                        case "h":
                            h += p.shift(), T = "L", A.push(h, l);
                            break;
                        case "H":
                            h = p.shift(), T = "L", A.push(h, l);
                            break;
                        case "v":
                            l += p.shift(), T = "L", A.push(h, l);
                            break;
                        case "V":
                            l = p.shift(), T = "L", A.push(h, l);
                            break;
                        case "C":
                            A.push(p.shift(), p.shift(), p.shift(), p.shift()), h = p.shift(), l = p.shift(), A.push(h, l);
                            break;
                        case "c":
                            A.push(h + p.shift(), l + p.shift(), h + p.shift(), l + p.shift()), h += p.shift(), l += p.shift(), T = "C", A.push(h, l);
                            break;
                        case "S":
                            m = h, _ = l, "C" === (y = a[a.length - 1]).command && (m = h + (h - y.points[2]), _ = l + (l - y.points[3])), A.push(m, _, p.shift(), p.shift()), h = p.shift(), l = p.shift(), T = "C", A.push(h, l);
                            break;
                        case "s":
                            m = h, _ = l, "C" === (y = a[a.length - 1]).command && (m = h + (h - y.points[2]), _ = l + (l - y.points[3])), A.push(m, _, h + p.shift(), l + p.shift()), h += p.shift(), l += p.shift(), T = "C", A.push(h, l);
                            break;
                        case "Q":
                            A.push(p.shift(), p.shift()), h = p.shift(), l = p.shift(), A.push(h, l);
                            break;
                        case "q":
                            A.push(h + p.shift(), l + p.shift()), h += p.shift(), l += p.shift(), T = "Q", A.push(h, l);
                            break;
                        case "T":
                            m = h, _ = l, "Q" === (y = a[a.length - 1]).command && (m = h + (h - y.points[0]), _ = l + (l - y.points[1])), h = p.shift(), l = p.shift(), T = "Q", A.push(m, _, h, l);
                            break;
                        case "t":
                            m = h, _ = l, "Q" === (y = a[a.length - 1]).command && (m = h + (h - y.points[0]), _ = l + (l - y.points[1])), h += p.shift(), l += p.shift(), T = "Q", A.push(m, _, h, l);
                            break;
                        case "A":
                            b = p.shift(), x = p.shift(), S = p.shift(), w = p.shift(), C = p.shift(), P = h, k = l, h = p.shift(), l = p.shift(), T = "A", A = this.convertEndpointToCenterParameterization(P, k, h, l, w, C, b, x, S);
                            break;
                        case "a":
                            b = p.shift(), x = p.shift(), S = p.shift(), w = p.shift(), C = p.shift(), P = h, k = l, h += p.shift(), l += p.shift(), T = "A", A = this.convertEndpointToCenterParameterization(P, k, h, l, w, C, b, x, S)
                    }
                    a.push({
                        command: T || u,
                        points: A,
                        start: {
                            x: M,
                            y: G
                        },
                        pathLength: this.calcLength(M, G, T || u, A)
                    })
                }
                "z" !== u && "Z" !== u || a.push({
                    command: "z",
                    points: [],
                    start: void 0,
                    pathLength: 0
                })
            }
            return a
        }, e.calcLength = function (t, i, n, r) {
            var o, a, s, h, l = e;
            switch (n) {
                case "L":
                    return l.getLineLength(t, i, r[0], r[1]);
                case "C":
                    for (o = 0, a = l.getPointOnCubicBezier(0, t, i, r[0], r[1], r[2], r[3], r[4], r[5]), h = .01; h <= 1; h += .01) s = l.getPointOnCubicBezier(h, t, i, r[0], r[1], r[2], r[3], r[4], r[5]), o += l.getLineLength(a.x, a.y, s.x, s.y), a = s;
                    return o;
                case "Q":
                    for (o = 0, a = l.getPointOnQuadraticBezier(0, t, i, r[0], r[1], r[2], r[3]), h = .01; h <= 1; h += .01) s = l.getPointOnQuadraticBezier(h, t, i, r[0], r[1], r[2], r[3]), o += l.getLineLength(a.x, a.y, s.x, s.y), a = s;
                    return o;
                case "A":
                    o = 0;
                    var c = r[4],
                        d = r[5],
                        u = r[4] + d,
                        p = Math.PI / 180;
                    if (Math.abs(c - u) < p && (p = Math.abs(c - u)), a = l.getPointOnEllipticalArc(r[0], r[1], r[2], r[3], c, 0), d < 0)
                        for (h = c - p; h > u; h -= p) s = l.getPointOnEllipticalArc(r[0], r[1], r[2], r[3], h, 0), o += l.getLineLength(a.x, a.y, s.x, s.y), a = s;
                    else
                        for (h = c + p; h < u; h += p) s = l.getPointOnEllipticalArc(r[0], r[1], r[2], r[3], h, 0), o += l.getLineLength(a.x, a.y, s.x, s.y), a = s;
                    return s = l.getPointOnEllipticalArc(r[0], r[1], r[2], r[3], u, 0), o += l.getLineLength(a.x, a.y, s.x, s.y)
            }
            return 0
        }, e.convertEndpointToCenterParameterization = function (t, e, i, n, r, o, a, s, h) {
            var l = h * (Math.PI / 180),
                c = Math.cos(l) * (t - i) / 2 + Math.sin(l) * (e - n) / 2,
                d = -1 * Math.sin(l) * (t - i) / 2 + Math.cos(l) * (e - n) / 2,
                u = c * c / (a * a) + d * d / (s * s);
            u > 1 && (a *= Math.sqrt(u), s *= Math.sqrt(u));
            var p = Math.sqrt((a * a * (s * s) - a * a * (d * d) - s * s * (c * c)) / (a * a * (d * d) + s * s * (c * c)));
            r === o && (p *= -1), isNaN(p) && (p = 0);
            var f = p * a * d / s,
                g = p * -s * c / a,
                v = (t + i) / 2 + Math.cos(l) * f - Math.sin(l) * g,
                y = (e + n) / 2 + Math.sin(l) * f + Math.cos(l) * g,
                m = function (t) {
                    return Math.sqrt(t[0] * t[0] + t[1] * t[1])
                },
                _ = function (t, e) {
                    return (t[0] * e[0] + t[1] * e[1]) / (m(t) * m(e))
                },
                b = function (t, e) {
                    return (t[0] * e[1] < t[1] * e[0] ? -1 : 1) * Math.acos(_(t, e))
                },
                x = b([1, 0], [(c - f) / a, (d - g) / s]),
                S = [(c - f) / a, (d - g) / s],
                w = [(-1 * c - f) / a, (-1 * d - g) / s],
                C = b(S, w);
            return _(S, w) <= -1 && (C = Math.PI), _(S, w) >= 1 && (C = 0), 0 === o && C > 0 && (C -= 2 * Math.PI), 1 === o && C < 0 && (C += 2 * Math.PI), [v, y, a, s, x, C, l, o]
        }, e
    }(lt);
    Ot.prototype.className = "Path", Ot.prototype._attrsAffectingSize = ["data"], a(Ot), w.addGetterSetter(Ot, "data"), s.mapMethods(Ot);
    var Dt = function (t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        return P(e, t), e.prototype._sceneFunc = function (t) {
            var e = this.cornerRadius(),
                i = this.width(),
                n = this.height();
            if (t.beginPath(), e) {
                var r = 0,
                    o = 0,
                    a = 0,
                    s = 0;
                "number" == typeof e ? r = o = a = s = Math.min(e, i / 2, n / 2) : (r = Math.min(e[0] || 0, i / 2, n / 2), o = Math.min(e[1] || 0, i / 2, n / 2), s = Math.min(e[2] || 0, i / 2, n / 2), a = Math.min(e[3] || 0, i / 2, n / 2)), t.moveTo(r, 0), t.lineTo(i - o, 0), t.arc(i - o, o, o, 3 * Math.PI / 2, 0, !1), t.lineTo(i, n - s), t.arc(i - s, n - s, s, 0, Math.PI / 2, !1), t.lineTo(a, n), t.arc(a, n - a, a, Math.PI / 2, Math.PI, !1), t.lineTo(0, r), t.arc(r, r, r, Math.PI, 3 * Math.PI / 2, !1)
            } else t.rect(0, 0, i, n);
            t.closePath(), t.fillStrokeShape(this)
        }, e
    }(lt);
    Dt.prototype.className = "Rect", a(Dt), w.addGetterSetter(Dt, "cornerRadius", 0, m(4)), s.mapMethods(Dt);
    var It = function (t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        return P(e, t), e.prototype._sceneFunc = function (t) {
            var e = this._getPoints();
            t.beginPath(), t.moveTo(e[0].x, e[0].y);
            for (var i = 1; i < e.length; i++) t.lineTo(e[i].x, e[i].y);
            t.closePath(), t.fillStrokeShape(this)
        }, e.prototype._getPoints = function () {
            for (var t = this.attrs.sides, e = this.attrs.radius || 0, i = [], n = 0; n < t; n++) i.push({
                x: e * Math.sin(2 * n * Math.PI / t),
                y: -1 * e * Math.cos(2 * n * Math.PI / t)
            });
            return i
        }, e.prototype.getSelfRect = function () {
            var t = this._getPoints(),
                e = t[0].x,
                i = t[0].y,
                n = t[0].x,
                r = t[0].y;
            return t.forEach((function (t) {
                e = Math.min(e, t.x), i = Math.max(i, t.x), n = Math.min(n, t.y), r = Math.max(r, t.y)
            })), {
                x: e,
                y: n,
                width: i - e,
                height: r - n
            }
        }, e.prototype.getWidth = function () {
            return 2 * this.radius()
        }, e.prototype.getHeight = function () {
            return 2 * this.radius()
        }, e.prototype.setWidth = function (t) {
            this.radius(t / 2)
        }, e.prototype.setHeight = function (t) {
            this.radius(t / 2)
        }, e
    }(lt);
    It.prototype.className = "RegularPolygon", It.prototype._centroid = !0, It.prototype._attrsAffectingSize = ["radius"], a(It), w.addGetterSetter(It, "radius", 0, y()), w.addGetterSetter(It, "sides", 0, y()), s.mapMethods(It);
    var Ft = 2 * Math.PI,
        Bt = function (t) {
            function e() {
                return null !== t && t.apply(this, arguments) || this
            }
            return P(e, t), e.prototype._sceneFunc = function (t) {
                t.beginPath(), t.arc(0, 0, this.innerRadius(), 0, Ft, !1), t.moveTo(this.outerRadius(), 0), t.arc(0, 0, this.outerRadius(), Ft, 0, !0), t.closePath(), t.fillStrokeShape(this)
            }, e.prototype.getWidth = function () {
                return 2 * this.outerRadius()
            }, e.prototype.getHeight = function () {
                return 2 * this.outerRadius()
            }, e.prototype.setWidth = function (t) {
                this.outerRadius(t / 2)
            }, e.prototype.setHeight = function (t) {
                this.outerRadius(t / 2)
            }, e
        }(lt);
    Bt.prototype.className = "Ring", Bt.prototype._centroid = !0, Bt.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"], a(Bt), w.addGetterSetter(Bt, "innerRadius", 0, y()), w.addGetterSetter(Bt, "outerRadius", 0, y()), s.mapMethods(Bt);
    var Nt = function (t) {
        function e(e) {
            var i = t.call(this, e) || this;
            return i._updated = !0, i.anim = new vt((function () {
                var t = i._updated;
                return i._updated = !1, t
            })), i.on("animationChange.konva", (function () {
                this.frameIndex(0)
            })), i.on("frameIndexChange.konva", (function () {
                this._updated = !0
            })), i.on("frameRateChange.konva", (function () {
                this.anim.isRunning() && (clearInterval(this.interval), this._setInterval())
            })), i
        }
        return P(e, t), e.prototype._sceneFunc = function (t) {
            var e = this.animation(),
                i = this.frameIndex(),
                n = 4 * i,
                r = this.animations()[e],
                o = this.frameOffsets(),
                a = r[n + 0],
                s = r[n + 1],
                h = r[n + 2],
                l = r[n + 3],
                c = this.image();
            if ((this.hasFill() || this.hasStroke()) && (t.beginPath(), t.rect(0, 0, h, l), t.closePath(), t.fillStrokeShape(this)), c)
                if (o) {
                    var d = o[e],
                        u = 2 * i;
                    t.drawImage(c, a, s, h, l, d[u + 0], d[u + 1], h, l)
                } else t.drawImage(c, a, s, h, l, 0, 0, h, l)
        }, e.prototype._hitFunc = function (t) {
            var e = this.animation(),
                i = this.frameIndex(),
                n = 4 * i,
                r = this.animations()[e],
                o = this.frameOffsets(),
                a = r[n + 2],
                s = r[n + 3];
            if (t.beginPath(), o) {
                var h = o[e],
                    l = 2 * i;
                t.rect(h[l + 0], h[l + 1], a, s)
            } else t.rect(0, 0, a, s);
            t.closePath(), t.fillShape(this)
        }, e.prototype._useBufferCanvas = function () {
            return t.prototype._useBufferCanvas.call(this, !0)
        }, e.prototype._setInterval = function () {
            var t = this;
            this.interval = setInterval((function () {
                t._updateIndex()
            }), 1e3 / this.frameRate())
        }, e.prototype.start = function () {
            if (!this.isRunning()) {
                var t = this.getLayer();
                this.anim.setLayers(t), this._setInterval(), this.anim.start()
            }
        }, e.prototype.stop = function () {
            this.anim.stop(), clearInterval(this.interval)
        }, e.prototype.isRunning = function () {
            return this.anim.isRunning()
        }, e.prototype._updateIndex = function () {
            var t = this.frameIndex(),
                e = this.animation();
            t < this.animations()[e].length / 4 - 1 ? this.frameIndex(t + 1) : this.frameIndex(0)
        }, e
    }(lt);
    Nt.prototype.className = "Sprite", a(Nt), w.addGetterSetter(Nt, "animation"), w.addGetterSetter(Nt, "animations"), w.addGetterSetter(Nt, "frameOffsets"), w.addGetterSetter(Nt, "image"), w.addGetterSetter(Nt, "frameIndex", 0, y()), w.addGetterSetter(Nt, "frameRate", 17, y()), w.backCompat(Nt, {
        index: "frameIndex",
        getIndex: "getFrameIndex",
        setIndex: "setFrameIndex"
    }), s.mapMethods(Nt);
    var zt = function (t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        return P(e, t), e.prototype._sceneFunc = function (t) {
            var e = this.innerRadius(),
                i = this.outerRadius(),
                n = this.numPoints();
            t.beginPath(), t.moveTo(0, 0 - i);
            for (var r = 1; r < 2 * n; r++) {
                var o = r % 2 == 0 ? i : e,
                    a = o * Math.sin(r * Math.PI / n),
                    s = -1 * o * Math.cos(r * Math.PI / n);
                t.lineTo(a, s)
            }
            t.closePath(), t.fillStrokeShape(this)
        }, e.prototype.getWidth = function () {
            return 2 * this.outerRadius()
        }, e.prototype.getHeight = function () {
            return 2 * this.outerRadius()
        }, e.prototype.setWidth = function (t) {
            this.outerRadius(t / 2)
        }, e.prototype.setHeight = function (t) {
            this.outerRadius(t / 2)
        }, e
    }(lt);

    function Wt(t) {
        return Array.from(t)
    }
    zt.prototype.className = "Star", zt.prototype._centroid = !0, zt.prototype._attrsAffectingSize = ["innerRadius", "outerRadius"], a(zt), w.addGetterSetter(zt, "numPoints", 5, y()), w.addGetterSetter(zt, "innerRadius", 0, y()), w.addGetterSetter(zt, "outerRadius", 0, y()), s.mapMethods(zt);
    var Ht, Yt = ["fontFamily", "fontSize", "fontStyle", "fontVariant", "padding", "align", "verticalAlign", "lineHeight", "text", "width", "height", "wrap", "ellipsis", "letterSpacing"],
        Xt = Yt.length;

    function jt() {
        return Ht || (Ht = f.createCanvasElement().getContext("2d"))
    }
    var Ut = function (t) {
        function e(e) {
            var i = t.call(this, function (t) {
                return (t = t || {}).fillLinearGradientColorStops || t.fillRadialGradientColorStops || t.fillPatternImage || (t.fill = t.fill || "black"), t
            }(e)) || this;
            i._partialTextX = 0, i._partialTextY = 0;
            for (var n = 0; n < Xt; n++) i.on(Yt[n] + "Change.konva", i._setTextData);
            return i._setTextData(), i
        }
        return P(e, t), e.prototype._sceneFunc = function (t) {
            var e = this.textArr,
                i = e.length;
            if (this.text()) {
                var n, r = this.padding(),
                    o = this.fontSize(),
                    a = this.lineHeight() * o,
                    s = this.verticalAlign(),
                    h = 0,
                    l = this.align(),
                    c = this.getWidth(),
                    d = this.letterSpacing(),
                    u = this.fill(),
                    p = this.textDecoration(),
                    f = -1 !== p.indexOf("underline"),
                    g = -1 !== p.indexOf("line-through"),
                    v = 0,
                    y = (v = a / 2, 0),
                    m = 0;
                for (t.setAttr("font", this._getContextFont()), t.setAttr("textBaseline", "middle"), t.setAttr("textAlign", "left"), "middle" === s ? h = (this.getHeight() - i * a - 2 * r) / 2 : "bottom" === s && (h = this.getHeight() - i * a - 2 * r), t.translate(r, h + r), n = 0; n < i; n++) {
                    y = 0, m = 0;
                    var _, b, x, S = e[n],
                        w = S.text,
                        C = S.width,
                        P = n !== i - 1;
                    if (t.save(), "right" === l ? y += c - C - 2 * r : "center" === l && (y += (c - C - 2 * r) / 2), f && (t.save(), t.beginPath(), t.moveTo(y, v + m + Math.round(o / 2)), b = 0 === (_ = w.split(" ").length - 1), x = "justify" === l && P && !b ? c - 2 * r : C, t.lineTo(y + Math.round(x), v + m + Math.round(o / 2)), t.lineWidth = o / 15, t.strokeStyle = u, t.stroke(), t.restore()), g && (t.save(), t.beginPath(), t.moveTo(y, v + m), b = 0 === (_ = w.split(" ").length - 1), x = "justify" === l && P && !b ? c - 2 * r : C, t.lineTo(y + Math.round(x), v + m), t.lineWidth = o / 15, t.strokeStyle = u, t.stroke(), t.restore()), 0 !== d || "justify" === l) {
                        _ = w.split(" ").length - 1;
                        for (var k = Wt(w), T = 0; T < k.length; T++) {
                            var A = k[T];
                            " " === A && n !== i - 1 && "justify" === l && (y += (c - 2 * r - C) / _), this._partialTextX = y, this._partialTextY = v + m, this._partialText = A, t.fillStrokeShape(this), y += this.measureSize(A).width + d
                        }
                    } else this._partialTextX = y, this._partialTextY = v + m, this._partialText = w, t.fillStrokeShape(this);
                    t.restore(), i > 1 && (v += a)
                }
            }
        }, e.prototype._hitFunc = function (t) {
            var e = this.getWidth(),
                i = this.getHeight();
            t.beginPath(), t.rect(0, 0, e, i), t.closePath(), t.fillStrokeShape(this)
        }, e.prototype.setText = function (t) {
            var e = f._isString(t) ? t : null == t ? "" : t + "";
            return this._setAttr("text", e), this
        }, e.prototype.getWidth = function () {
            return "auto" === this.attrs.width || void 0 === this.attrs.width ? this.getTextWidth() + 2 * this.padding() : this.attrs.width
        }, e.prototype.getHeight = function () {
            return "auto" === this.attrs.height || void 0 === this.attrs.height ? this.fontSize() * this.textArr.length * this.lineHeight() + 2 * this.padding() : this.attrs.height
        }, e.prototype.getTextWidth = function () {
            return this.textWidth
        }, e.prototype.getTextHeight = function () {
            return f.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight
        }, e.prototype.measureSize = function (t) {
            var e, i = jt(),
                n = this.fontSize();
            return i.save(), i.font = this._getContextFont(), e = i.measureText(t), i.restore(), {
                width: e.width,
                height: n
            }
        }, e.prototype._getContextFont = function () {
            return r.UA.isIE ? this.fontStyle() + " " + this.fontSize() + "px " + this.fontFamily() : this.fontStyle() + " " + this.fontVariant() + " " + this.fontSize() + "px " + this.fontFamily().split(",").map((function (t) {
                var e = (t = t.trim()).indexOf(" ") >= 0,
                    i = t.indexOf('"') >= 0 || t.indexOf("'") >= 0;
                return e && !i && (t = '"' + t + '"'), t
            })).join(", ")
        }, e.prototype._addTextLine = function (t) {
            "justify" === this.align() && (t = t.trim());
            var e = this._getTextWidth(t);
            return this.textArr.push({
                text: t,
                width: e
            })
        }, e.prototype._getTextWidth = function (t) {
            var e = this.letterSpacing(),
                i = t.length;
            return jt().measureText(t).width + (i ? e * (i - 1) : 0)
        }, e.prototype._setTextData = function () {
            var t = this.text().split("\n"),
                e = +this.fontSize(),
                i = 0,
                n = this.lineHeight() * e,
                r = this.attrs.width,
                o = this.attrs.height,
                a = "auto" !== r && void 0 !== r,
                s = "auto" !== o && void 0 !== o,
                h = this.padding(),
                l = r - 2 * h,
                c = o - 2 * h,
                d = 0,
                u = this.wrap(),
                p = "none" !== u,
                f = "char" !== u && p,
                g = this.ellipsis();
            this.textArr = [], jt().font = this._getContextFont();
            for (var v = g ? this._getTextWidth("…") : 0, y = 0, m = t.length; y < m; ++y) {
                var _ = t[y],
                    b = this._getTextWidth(_);
                if (a && b > l)
                    for (; _.length > 0;) {
                        for (var x = 0, S = _.length, w = "", C = 0; x < S;) {
                            var P = x + S >>> 1,
                                k = _.slice(0, P + 1),
                                T = this._getTextWidth(k) + v;
                            T <= l ? (x = P + 1, w = k + (g ? "…" : ""), C = T) : S = P
                        }
                        if (!w) break;
                        if (f) {
                            var A, M = _[w.length];
                            (A = (" " === M || "-" === M) && C <= l ? w.length : Math.max(w.lastIndexOf(" "), w.lastIndexOf("-")) + 1) > 0 && (x = A, w = w.slice(0, x), C = this._getTextWidth(w))
                        }
                        if (w = w.trimRight(), this._addTextLine(w), i = Math.max(i, C), d += n, !p || s && d + n > c) {
                            var G = this.textArr[this.textArr.length - 1];
                            if (G)
                                if (g) this._getTextWidth(G.text + "…") < l || (G.text = G.text.slice(0, G.text.length - 3)), this.textArr.splice(this.textArr.length - 1, 1), this._addTextLine(G.text + "…");
                            break
                        }
                        if ((_ = (_ = _.slice(x)).trimLeft()).length > 0 && (b = this._getTextWidth(_)) <= l) {
                            this._addTextLine(_), d += n, i = Math.max(i, b);
                            break
                        }
                    } else this._addTextLine(_), d += n, i = Math.max(i, b);
                if (s && d + n > c) break
            }
            this.textHeight = e, this.textWidth = i
        }, e.prototype.getStrokeScaleEnabled = function () {
            return !0
        }, e
    }(lt);
    Ut.prototype._fillFunc = function (t) {
        t.fillText(this._partialText, this._partialTextX, this._partialTextY)
    }, Ut.prototype._strokeFunc = function (t) {
        t.strokeText(this._partialText, this._partialTextX, this._partialTextY)
    }, Ut.prototype.className = "Text", Ut.prototype._attrsAffectingSize = ["text", "fontSize", "padding", "wrap", "lineHeight"], a(Ut), w.overWriteSetter(Ut, "width", _()), w.overWriteSetter(Ut, "height", _()), w.addGetterSetter(Ut, "fontFamily", "Arial"), w.addGetterSetter(Ut, "fontSize", 12, y()), w.addGetterSetter(Ut, "fontStyle", "normal"), w.addGetterSetter(Ut, "fontVariant", "normal"), w.addGetterSetter(Ut, "padding", 0, y()), w.addGetterSetter(Ut, "align", "left"), w.addGetterSetter(Ut, "verticalAlign", "top"), w.addGetterSetter(Ut, "lineHeight", 1, y()), w.addGetterSetter(Ut, "wrap", "word"), w.addGetterSetter(Ut, "ellipsis", !1, S()), w.addGetterSetter(Ut, "letterSpacing", 0, y()), w.addGetterSetter(Ut, "text", "", b()), w.addGetterSetter(Ut, "textDecoration", ""), s.mapMethods(Ut);

    function qt(t) {
        t.fillText(this.partialText, 0, 0)
    }

    function Kt(t) {
        t.strokeText(this.partialText, 0, 0)
    }
    var Vt = function (t) {
        function e(e) {
            var i = t.call(this, e) || this;
            return i.dummyCanvas = f.createCanvasElement(), i.dataArray = [], i.dataArray = Ot.parsePathData(i.attrs.data), i.on("dataChange.konva", (function () {
                this.dataArray = Ot.parsePathData(this.attrs.data), this._setTextData()
            })), i.on("textChange.konva alignChange.konva letterSpacingChange.konva kerningFuncChange.konva", i._setTextData), e && e.getKerning && (f.warn('getKerning TextPath API is deprecated. Please use "kerningFunc" instead.'), i.kerningFunc(e.getKerning)), i._setTextData(), i
        }
        return P(e, t), e.prototype._sceneFunc = function (t) {
            t.setAttr("font", this._getContextFont()), t.setAttr("textBaseline", this.textBaseline()), t.setAttr("textAlign", "left"), t.save();
            var e = this.textDecoration(),
                i = this.fill(),
                n = this.fontSize(),
                r = this.glyphInfo;
            "underline" === e && t.beginPath();
            for (var o = 0; o < r.length; o++) {
                t.save();
                var a = r[o].p0;
                t.translate(a.x, a.y), t.rotate(r[o].rotation), this.partialText = r[o].text, t.fillStrokeShape(this), "underline" === e && (0 === o && t.moveTo(0, n / 2 + 1), t.lineTo(n, n / 2 + 1)), t.restore()
            }
            "underline" === e && (t.strokeStyle = i, t.lineWidth = n / 20, t.stroke()), t.restore()
        }, e.prototype._hitFunc = function (t) {
            t.beginPath();
            var e = this.glyphInfo;
            if (e.length >= 1) {
                var i = e[0].p0;
                t.moveTo(i.x, i.y)
            }
            for (var n = 0; n < e.length; n++) {
                var r = e[n].p1;
                t.lineTo(r.x, r.y)
            }
            t.setAttr("lineWidth", this.fontSize()), t.setAttr("strokeStyle", this.colorKey), t.stroke()
        }, e.prototype.getTextWidth = function () {
            return this.textWidth
        }, e.prototype.getTextHeight = function () {
            return f.warn("text.getTextHeight() method is deprecated. Use text.height() - for full height and text.fontSize() - for one line height."), this.textHeight
        }, e.prototype.setText = function (t) {
            return Ut.prototype.setText.call(this, t)
        }, e.prototype._getContextFont = function () {
            return Ut.prototype._getContextFont.call(this)
        }, e.prototype._getTextSize = function (t) {
            var e = this.dummyCanvas.getContext("2d");
            e.save(), e.font = this._getContextFont();
            var i = e.measureText(t);
            return e.restore(), {
                width: i.width,
                height: parseInt(this.attrs.fontSize, 10)
            }
        }, e.prototype._setTextData = function () {
            var t = this,
                e = this._getTextSize(this.attrs.text),
                i = this.letterSpacing(),
                n = this.align(),
                r = this.kerningFunc();
            this.textWidth = e.width, this.textHeight = e.height;
            var o = Math.max(this.textWidth + ((this.attrs.text || "").length - 1) * i, 0);
            this.glyphInfo = [];
            for (var a = 0, s = 0; s < t.dataArray.length; s++) t.dataArray[s].pathLength > 0 && (a += t.dataArray[s].pathLength);
            var h = 0;
            "center" === n && (h = Math.max(0, a / 2 - o / 2)), "right" === n && (h = Math.max(0, a - o));
            for (var l, c, d, u = Wt(this.text()), p = this.text().split(" ").length - 1, f = -1, g = 0, v = function () {
                g = 0;
                for (var e = t.dataArray, i = f + 1; i < e.length; i++) {
                    if (e[i].pathLength > 0) return f = i, e[i];
                    "M" === e[i].command && (l = {
                        x: e[i].points[0],
                        y: e[i].points[1]
                    })
                }
                return {}
            }, y = function (e) {
                var r = t._getTextSize(e).width + i;
                " " === e && "justify" === n && (r += (a - o) / p);
                var s = 0,
                    h = 0;
                for (c = void 0; Math.abs(r - s) / r > .01 && h < 20;) {
                    h++;
                    for (var u = s; void 0 === d;)(d = v()) && u + d.pathLength < r && (u += d.pathLength, d = void 0);
                    if (d === {} || void 0 === l) return;
                    var f = !1;
                    switch (d.command) {
                        case "L":
                            Ot.getLineLength(l.x, l.y, d.points[0], d.points[1]) > r ? c = Ot.getPointOnLine(r, l.x, l.y, d.points[0], d.points[1], l.x, l.y) : d = void 0;
                            break;
                        case "A":
                            var y = d.points[4],
                                m = d.points[5],
                                _ = d.points[4] + m;
                            0 === g ? g = y + 1e-8 : r > s ? g += Math.PI / 180 * m / Math.abs(m) : g -= Math.PI / 360 * m / Math.abs(m), (m < 0 && g < _ || m >= 0 && g > _) && (g = _, f = !0), c = Ot.getPointOnEllipticalArc(d.points[0], d.points[1], d.points[2], d.points[3], g, d.points[6]);
                            break;
                        case "C":
                            0 === g ? g = r > d.pathLength ? 1e-8 : r / d.pathLength : r > s ? g += (r - s) / d.pathLength / 2 : g = Math.max(g - (s - r) / d.pathLength / 2, 0), g > 1 && (g = 1, f = !0), c = Ot.getPointOnCubicBezier(g, d.start.x, d.start.y, d.points[0], d.points[1], d.points[2], d.points[3], d.points[4], d.points[5]);
                            break;
                        case "Q":
                            0 === g ? g = r / d.pathLength : r > s ? g += (r - s) / d.pathLength : g -= (s - r) / d.pathLength, g > 1 && (g = 1, f = !0), c = Ot.getPointOnQuadraticBezier(g, d.start.x, d.start.y, d.points[0], d.points[1], d.points[2], d.points[3])
                    }
                    void 0 !== c && (s = Ot.getLineLength(l.x, l.y, c.x, c.y)), f && (f = !1, d = void 0)
                }
            }, m = h / (t._getTextSize("C").width + i) - 1, _ = 0; _ < m && (y("C"), void 0 !== l && void 0 !== c); _++) l = c;
            for (var b = 0; b < u.length && (y(u[b]), void 0 !== l && void 0 !== c); b++) {
                var x = Ot.getLineLength(l.x, l.y, c.x, c.y),
                    S = 0;
                if (r) try {
                    S = r(u[b - 1], u[b]) * this.fontSize()
                } catch (t) {
                    S = 0
                }
                l.x += S, c.x += S, this.textWidth += S;
                var w = Ot.getPointOnLine(S + x / 2, l.x, l.y, c.x, c.y),
                    C = Math.atan2(c.y - l.y, c.x - l.x);
                this.glyphInfo.push({
                    transposeX: w.x,
                    transposeY: w.y,
                    text: u[b],
                    rotation: C,
                    p0: l,
                    p1: c
                }), l = c
            }
        }, e.prototype.getSelfRect = function () {
            if (!this.glyphInfo.length) return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            var t = [];
            this.glyphInfo.forEach((function (e) {
                t.push(e.p0.x), t.push(e.p0.y), t.push(e.p1.x), t.push(e.p1.y)
            }));
            for (var e, i, n = t[0] || 0, r = t[0] || 0, o = t[1] || 0, a = t[1] || 0, s = 0; s < t.length / 2; s++) e = t[2 * s], i = t[2 * s + 1], n = Math.min(n, e), r = Math.max(r, e), o = Math.min(o, i), a = Math.max(a, i);
            var h = this.fontSize();
            return {
                x: n - h / 2,
                y: o - h / 2,
                width: r - n + h,
                height: a - o + h
            }
        }, e
    }(lt);
    Vt.prototype._fillFunc = qt, Vt.prototype._strokeFunc = Kt, Vt.prototype._fillFuncHit = qt, Vt.prototype._strokeFuncHit = Kt, Vt.prototype.className = "TextPath", Vt.prototype._attrsAffectingSize = ["text", "fontSize", "data"], a(Vt), w.addGetterSetter(Vt, "data"), w.addGetterSetter(Vt, "fontFamily", "Arial"), w.addGetterSetter(Vt, "fontSize", 12, y()), w.addGetterSetter(Vt, "fontStyle", "normal"), w.addGetterSetter(Vt, "align", "left"), w.addGetterSetter(Vt, "letterSpacing", 0, y()), w.addGetterSetter(Vt, "textBaseline", "middle"), w.addGetterSetter(Vt, "fontVariant", "normal"), w.addGetterSetter(Vt, "text", ""), w.addGetterSetter(Vt, "textDecoration", null), w.addGetterSetter(Vt, "kerningFunc", null), s.mapMethods(Vt);
    var Qt = ["resizeEnabledChange", "rotateAnchorOffsetChange", "rotateEnabledChange", "enabledAnchorsChange", "anchorSizeChange", "borderEnabledChange", "borderStrokeChange", "borderStrokeWidthChange", "borderDashChange", "anchorStrokeChange", "anchorStrokeWidthChange", "anchorFillChange", "anchorCornerRadiusChange", "ignoreStrokeChange"].map((function (t) {
        return t + ".tr-konva"
    })).join(" "),
        Jt = ["widthChange", "heightChange", "scaleXChange", "scaleYChange", "skewXChange", "skewYChange", "rotationChange", "offsetXChange", "offsetYChange", "transformsEnabledChange", "strokeWidthChange"].map((function (t) {
            return t + ".tr-konva"
        })).join(" "),
        Zt = {
            "top-left": -45,
            "top-center": 0,
            "top-right": 45,
            "middle-right": -90,
            "middle-left": 90,
            "bottom-left": -135,
            "bottom-center": 180,
            "bottom-right": 135
        },
        $t = "ontouchstart" in r._global;
    var te = ["top-left", "top-center", "top-right", "middle-right", "middle-left", "bottom-left", "bottom-center", "bottom-right"];

    function ee(t, e, i) {
        var n = i.x + (t.x - i.x) * Math.cos(e) - (t.y - i.y) * Math.sin(e),
            r = i.y + (t.x - i.x) * Math.sin(e) + (t.y - i.y) * Math.cos(e);
        return k(k({}, t), {
            rotation: t.rotation + e,
            x: n,
            y: r
        })
    }

    // TEST
    // function ie(t, e) {
    //     return ee(t, e, function (t) {
    //         return {
    //             x: t.x + t.width / 2 * Math.cos(t.rotation) + t.height * Math.sin(-t.rotation),
    //             y: t.y + t.height * Math.cos(t.rotation) + t.width / 2 * Math.sin(t.rotation)
    //         }
    //     }(t))
    // }

    function ie(t, e) {
        return ee(t, e, function (t) {
            return {
                x: t.x + t.width / 2 * Math.cos(t.rotation) + t.height / 2 * Math.sin(-t.rotation),
                y: t.y + t.height / 2 * Math.cos(t.rotation) + t.width / 2 * Math.sin(t.rotation)
            }
        }(t))
    }


    var ne = function (t) {
        function e(e) {
            var i = t.call(this, e) || this;
            return i._transforming = !1, i._createElements(), i._handleMouseMove = i._handleMouseMove.bind(i), i._handleMouseUp = i._handleMouseUp.bind(i), i.update = i.update.bind(i), i.on(Qt, i.update), i.getNode() && i.update(), i
        }
        return P(e, t), e.prototype.attachTo = function (t) {
            return this.setNode(t), this
        }, e.prototype.setNode = function (t) {
            return f.warn("tr.setNode(shape), tr.node(shape) and tr.attachTo(shape) methods are deprecated. Please use tr.nodes(nodesArray) instead."), this.setNodes([t])
        }, e.prototype.getNode = function () {
            return this._nodes && this._nodes[0]
        }, e.prototype.setNodes = function (t) {
            var e = this;
            return void 0 === t && (t = []), this._nodes && this._nodes.length && this.detach(), this._nodes = t, 1 === t.length ? this.rotation(t[0].rotation()) : this.rotation(0), this._nodes.forEach((function (t) {
                var i = t._attrsAffectingSize.map((function (t) {
                    return t + "Change.tr-konva"
                })).join(" "),
                    n = function () {
                        1 === e.nodes().length && e.rotation(e.nodes()[0].rotation()), e._resetTransformCache(), e._transforming || e.isDragging() || e.update()
                    };
                t.on(i, n), t.on(Jt, n), t.on("_clearTransformCache.tr-konva", n), t.on("xChange.tr-konva yChange.tr-konva", n), e._proxyDrag(t)
            })), this._resetTransformCache(), !!this.findOne(".top-left") && this.update(), this
        }, e.prototype._proxyDrag = function (t) {
            var e, i = this;
            t.on("dragstart.tr-konva", (function (n) {
                e = t.getAbsolutePosition(), i.isDragging() || t === i.findOne(".back") || i.startDrag(n, !1)
            })), t.on("dragmove.tr-konva", (function (n) {
                if (e) {
                    var r = t.getAbsolutePosition(),
                        o = r.x - e.x,
                        a = r.y - e.y;
                    i.nodes().forEach((function (e) {
                        if (e !== t && !e.isDragging()) {
                            var i = e.getAbsolutePosition();
                            e.setAbsolutePosition({
                                x: i.x + o,
                                y: i.y + a
                            }), e.startDrag(n)
                        }
                    })), e = null
                }
            }))
        }, e.prototype.getNodes = function () {
            return this._nodes || []
        }, e.prototype.getActiveAnchor = function () {
            return this._movingAnchorName
        }, e.prototype.detach = function () {
            this._nodes && this._nodes.forEach((function (t) {
                t.off(".tr-konva")
            })), this._nodes = [], this._resetTransformCache()
        }, e.prototype._resetTransformCache = function () {
            this._clearCache("nodesRect"), this._clearCache("transform"), this._clearSelfAndDescendantCache("absoluteTransform")
        }, e.prototype._getNodeRect = function () {
            return this._getCache("nodesRect", this.__getNodeRect)
        }, e.prototype.__getNodeShape = function (t, e, i) {
            void 0 === e && (e = this.rotation());
            var n = t.getClientRect({
                skipTransform: !0,
                skipShadow: !0,
                skipStroke: this.ignoreStroke()
            }),
                o = t.getAbsoluteScale(i),
                a = t.getAbsolutePosition(i),
                s = n.x * o.x - t.offsetX() * o.x,
                h = n.y * o.y - t.offsetY() * o.y,
                l = (r.getAngle(t.getAbsoluteRotation()) + 2 * Math.PI) % (2 * Math.PI);
            return ee({
                x: a.x + s * Math.cos(l) + h * Math.sin(-l),
                y: a.y + h * Math.cos(l) + s * Math.sin(l),
                width: n.width * o.x,
                height: n.height * o.y,
                rotation: l
            }, -r.getAngle(e), {
                x: 0,
                y: 0
            })
        }, e.prototype.__getNodeRect = function () {
            var t = this;
            if (!this.getNode()) return {
                x: -1e8,
                y: -1e8,
                width: 0,
                height: 0,
                rotation: 0
            };
            var e = [];
            this.nodes().map((function (i) {
                var n = i.getClientRect({
                    skipTransform: !0,
                    skipShadow: !0,
                    skipStroke: t.ignoreStroke()
                }),
                    r = [{
                        x: n.x,
                        y: n.y
                    }, {
                        x: n.x + n.width,
                        y: n.y
                    }, {
                        x: n.x + n.width,
                        y: n.y + n.height
                    }, {
                        x: n.x,
                        y: n.y + n.height
                    }],
                    o = i.getAbsoluteTransform();
                r.forEach((function (t) {
                    var i = o.point(t);
                    e.push(i)
                }))
            }));
            var i, n, o, a, s = new h;
            s.rotate(-r.getAngle(this.rotation())), e.forEach((function (t) {
                var e = s.point(t);
                void 0 === i && (i = o = e.x, n = a = e.y), i = Math.min(i, e.x), n = Math.min(n, e.y), o = Math.max(o, e.x), a = Math.max(a, e.y)
            })), s.invert();
            var l = s.point({
                x: i,
                y: n
            });
            return {
                x: l.x,
                y: l.y,
                width: o - i,
                height: a - n,
                rotation: r.getAngle(this.rotation())
            }
        }, e.prototype.getX = function () {
            return this._getNodeRect().x
        }, e.prototype.getY = function () {
            return this._getNodeRect().y
        }, e.prototype.getWidth = function () {
            return this._getNodeRect().width
        }, e.prototype.getHeight = function () {
            return this._getNodeRect().height
        }, e.prototype._createElements = function () {
            this._createBack(), te.forEach(function (t) {
                this._createAnchor(t)
            }.bind(this)), this._createAnchor("rotater")
        }, e.prototype._createAnchor = function (t) {
            var e = this,
                i = new Dt({
                    stroke: "rgb(0, 161, 255)",
                    fill: "white",
                    strokeWidth: 1,
                    name: t + " _anchor",
                    dragDistance: 0,
                    draggable: !0,
                    hitStrokeWidth: $t ? 10 : "auto"
                }),
                n = this;
            i.on("mousedown touchstart", (function (t) {
                n._handleMouseDown(t)
            })), i.on("dragstart", (function (t) {
                i.stopDrag(), t.cancelBubble = !0
            })), i.on("dragend", (function (t) {
                t.cancelBubble = !0
            })), i.on("mouseenter", (function () {
                var n = r.getAngle(e.rotation()),
                    o = function (t, e) {
                        if ("rotater" === t) return "pointer";
                        e += f._degToRad(Zt[t] || 0);
                        var i = (f._radToDeg(e) % 360 + 360) % 360;
                        return f._inRange(i, 337.5, 360) || f._inRange(i, 0, 22.5) ? "pointer" : f._inRange(i, 22.5, 67.5) ? "nesw-resize" : f._inRange(i, 67.5, 112.5) ? "pointer" : f._inRange(i, 112.5, 157.5) ? "pointer" : f._inRange(i, 157.5, 202.5) ? "pointer" : f._inRange(i, 202.5, 247.5) ? "pointer" : f._inRange(i, 247.5, 292.5) ? "pointer" : f._inRange(i, 292.5, 337.5) ? "pointer" : (f.error("Transformer has unknown angle for cursor detection: " + i), "pointer")
                    }(t, n);
                i.getStage().content.style.cursor = o, e._cursorChange = !0
            })), i.on("mouseout", (function () {
                i.getStage().content.style.cursor = "", e._cursorChange = !1
            })), this.add(i)
        }, e.prototype._createBack = function () {
            var t = this,
                e = new lt({
                    name: "back",
                    width: 0,
                    height: 0,
                    draggable: !0,
                    sceneFunc: function (t) {
                        var e = this.getParent(),
                            i = e.padding();
                        t.beginPath(), t.rect(-i, -i, this.width() + 2 * i, this.height() + 2 * i), t.moveTo(this.width() / 2, -i), e.rotateEnabled() && t.lineTo(this.width() / 2, -e.rotateAnchorOffset() * f._sign(this.height()) - i), t.fillStrokeShape(this)
                    },
                    hitFunc: function (e, i) {
                        if (t.shouldOverdrawWholeArea()) {
                            var n = t.padding();
                            e.beginPath(), e.rect(-n, -n, i.width() + 2 * n, i.height() + 2 * n), e.fillStrokeShape(i)
                        }
                    }
                });
            this.add(e), this._proxyDrag(e), e.on("dragstart", (function (t) {
                t.cancelBubble = !0
            })), e.on("dragmove", (function (t) {
                t.cancelBubble = !0
            })), e.on("dragend", (function (t) {
                t.cancelBubble = !0
            }))
        }, e.prototype._handleMouseDown = function (t) {
            this._movingAnchorName = t.target.name().split(" ")[0];
            var e = this._getNodeRect(),
                i = e.width,
                n = e.height,
                r = Math.sqrt(Math.pow(i, 2) + Math.pow(n, 2));
            this.sin = Math.abs(n / r), this.cos = Math.abs(i / r);
            window.addEventListener("mousemove", this._handleMouseMove), window.addEventListener("touchmove", this._handleMouseMove), window.addEventListener("mouseup", this._handleMouseUp, !0), window.addEventListener("touchend", this._handleMouseUp, !0);
            this._transforming = !0;

            var anchorNode = this.findOne("." + this._movingAnchorName);
            var anchorNodeOldAbsolutePosition = anchorNode.getAbsolutePosition();
            anchorNode.setAttr('OldAbsolutePosition', anchorNodeOldAbsolutePosition);

            var o = t.target.getAbsolutePosition(),
                a = t.target.getStage().getPointerPosition();
            this._anchorDragOffset = {
                x: a.x - o.x,
                y: a.y - o.y
            }, this._fire("transformstart", {
                evt: t,
                target: this.getNode()
            }), this.getNode()._fire("transformstart", {
                evt: t,
                target: this.getNode()
            })
        }, e.prototype._handleMouseMove = function (t) {
            var x, y, newHypotenuse, anchorNode = this.findOne("." + this._movingAnchorName),
                stage = anchorNode.getStage();
            stage.setPointersPositions(t);
            var s = stage.getPointerPosition(),
                h = {
                    x: s.x - this._anchorDragOffset.x,
                    y: s.y - this._anchorDragOffset.y
                },
                l = anchorNode.getAbsolutePosition();
            anchorNode.setAbsolutePosition(h);
            var c = anchorNode.getAbsolutePosition();
            if (l.x !== c.x || l.y !== c.y)
                if ("rotater" !== this._movingAnchorName) {
                    var d = this.keepRatio() || t.shiftKey,
                        u = this.centeredScaling() || t.altKey;
                    if ("top-left" === this._movingAnchorName) {
                        if (d) {
                            var p = u ? {
                                x: this.width() / 2,
                                y: this.height() / 2
                            } : {
                                x: this.findOne(".bottom-right").x(),
                                y: this.findOne(".bottom-right").y()
                            };
                            newHypotenuse = Math.sqrt(Math.pow(p.x - anchorNode.x(), 2) + Math.pow(p.y - anchorNode.y(), 2));
                            var f = this.findOne(".top-left").x() > p.x ? -1 : 1,
                                g = this.findOne(".top-left").y() > p.y ? -1 : 1;
                            x = newHypotenuse * this.cos * f, y = newHypotenuse * this.sin * g, this.findOne(".top-left").x(p.x - x), this.findOne(".top-left").y(p.y - y)
                        }
                    } else if ("top-center" === this._movingAnchorName) this.findOne(".top-left").y(anchorNode.y());
                    else if ("top-right" === this._movingAnchorName) {
                        if (d) {
                            p = u ? {
                                x: this.width() / 2,
                                y: this.height() / 2
                            } : {
                                x: this.findOne(".bottom-left").x(),
                                y: this.findOne(".bottom-left").y()
                            };
                            newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - p.x, 2) + Math.pow(p.y - anchorNode.y(), 2));
                            f = this.findOne(".top-right").x() < p.x ? -1 : 1, g = this.findOne(".top-right").y() > p.y ? -1 : 1;
                            x = newHypotenuse * this.cos * f, y = newHypotenuse * this.sin * g, this.findOne(".top-right").x(p.x + x), this.findOne(".top-right").y(p.y - y)
                        }
                        var v = anchorNode.position();
                        this.findOne(".top-left").y(v.y), this.findOne(".bottom-right").x(v.x)
                    } else if ("middle-left" === this._movingAnchorName) this.findOne(".top-left").x(anchorNode.x());
                    else if ("middle-right" === this._movingAnchorName) this.findOne(".bottom-right").x(anchorNode.x());
                    else if ("bottom-left" === this._movingAnchorName) {
                        if (d) {
                            p = u ? {
                                x: this.width() / 2,
                                y: this.height() / 2
                            } : {
                                x: this.findOne(".top-right").x(),
                                y: this.findOne(".top-right").y()
                            };
                            newHypotenuse = Math.sqrt(Math.pow(p.x - anchorNode.x(), 2) + Math.pow(anchorNode.y() - p.y, 2));
                            f = p.x < anchorNode.x() ? -1 : 1, g = anchorNode.y() < p.y ? -1 : 1;
                            x = newHypotenuse * this.cos * f, y = newHypotenuse * this.sin * g, anchorNode.x(p.x - x), anchorNode.y(p.y + y)
                        }
                        v = anchorNode.position(), this.findOne(".top-left").x(v.x), this.findOne(".bottom-right").y(v.y)
                    } else if ("bottom-center" === this._movingAnchorName) this.findOne(".bottom-right").y(anchorNode.y());
                    else if ("bottom-right" === this._movingAnchorName) {
                        if (d) {
                            p = u ? {
                                x: this.width() / 2,
                                y: this.height() / 2
                            } : {
                                x: this.findOne(".top-left").x(),
                                y: this.findOne(".top-left").y()
                            };
                            newHypotenuse = Math.sqrt(Math.pow(anchorNode.x() - p.x, 2) + Math.pow(anchorNode.y() - p.y, 2));
                            f = this.findOne(".bottom-right").x() < p.x ? -1 : 1, g = this.findOne(".bottom-right").y() < p.y ? -1 : 1;
                            x = newHypotenuse * this.cos * f, y = newHypotenuse * this.sin * g, this.findOne(".bottom-right").x(p.x + x), this.findOne(".bottom-right").y(p.y + y)
                        }
                    } else console.error(new Error("Wrong position argument of selection resizer: " + this._movingAnchorName));
                    if (u = this.centeredScaling() || t.altKey) {
                        var y = this.findOne(".top-left"),
                            m = this.findOne(".bottom-right"),
                            _ = y.x(),
                            b = y.y(),
                            x = this.getWidth() - m.x(),
                            S = this.getHeight() - m.y();
                        m.move({
                            x: -_,
                            y: -b
                        }), y.move({
                            x: x,
                            y: S
                        })
                    }
                    var w = this.findOne(".top-left").getAbsolutePosition();
                    x = w.x, y = w.y;
                    var C = this.findOne(".bottom-right").x() - this.findOne(".top-left").x(),
                        P = this.findOne(".bottom-right").y() - this.findOne(".top-left").y();
                    this._fitNodesInto({
                        x: x,
                        y: y,
                        width: C,
                        height: P,
                        rotation: r.getAngle(this.rotation())
                    }, t)
                } else {
                    var anchorNodeOldAbsolutePosition = anchorNode.getAttr('OldAbsolutePosition');
                    // console.debug('old', anchorNodeOldAbsolutePosition.x, anchorNodeOldAbsolutePosition.y);
                    // console.debug('new', c.x, c.y);
                    var moving_tol = 5;
                    var x_delta = Math.abs(anchorNodeOldAbsolutePosition.x - c.x);
                    var y_delta = Math.abs(anchorNodeOldAbsolutePosition.y - c.y);
                    if (x_delta < moving_tol && y_delta < moving_tol) {
                        // return;
                    }

                    var attrs = this._getNodeRect();
                    console.debug('attrs', attrs);
                    var offsetY = anchorNode.getAttr('offsetY');
                    console.debug(c.y, anchorNode.y());

                    x = anchorNode.x() - attrs.width / 2;
                    // y = -anchorNode.y() + attrs.height / 2;
                    y = -anchorNode.y() - attrs.height;

                    // TEST
                    console.debug("Math.atan2(-y, x)", Math.atan2(-y, x));
                    var delta = (Math.atan2(-y, x) + Math.PI / 2);

                    // var T = Math.atan2(-i, e) + Math.PI / 2;


                    attrs.height < 0 && (delta -= Math.PI);
                    var oldRotation = r.getAngle(this.rotation());
                    var newRotation = oldRotation + delta;
                    console.debug(oldRotation, newRotation);

                    // M = r.getAngle(this.rotationSnapTolerance());
                    M = r.getAngle(1);
                    G = ie(attrs, function (t, e, i) {
                        for (var n = e, o = 0; o < t.length; o++) {
                            var a = r.getAngle(t[o]),
                                s = Math.abs(a - e) % (2 * Math.PI);
                            Math.min(s, 2 * Math.PI - s) < i && (n = a)
                        }
                        return n
                    }(this.rotationSnaps(), newRotation, M) - attrs.rotation);
                    this._fitNodesInto(G, t)

                    anchorNode.setAttr('OldAbsolutePosition', c);
                }
        }, e.prototype._handleMouseUp = function (t) {
            this._removeEvents(t)
        }, e.prototype.getAbsoluteTransform = function () {
            return this.getTransform()
        }, e.prototype._removeEvents = function (t) {
            if (this._transforming) {
                this._transforming = !1, window.removeEventListener("mousemove", this._handleMouseMove), window.removeEventListener("touchmove", this._handleMouseMove), window.removeEventListener("mouseup", this._handleMouseUp, !0), window.removeEventListener("touchend", this._handleMouseUp, !0);
                var e = this.getNode();
                this._fire("transformend", {
                    evt: t,
                    target: e
                }), e && e.fire("transformend", {
                    evt: t,
                    target: e
                }), this._movingAnchorName = null
            }
        }, e.prototype._fitNodesInto = function (t, e) {
            var i = this,
                n = this._getNodeRect();
            if (f._inRange(t.width, 2 * -this.padding() - 1, 1)) this.update();
            else if (f._inRange(t.height, 2 * -this.padding() - 1, 1)) this.update();
            else {
                var o = new h;
                if (o.rotate(r.getAngle(this.rotation())), this._movingAnchorName && t.width < 0 && this._movingAnchorName.indexOf("left") >= 0) {
                    var a = o.point({
                        x: 2 * -this.padding(),
                        y: 0
                    });
                    t.x += a.x, t.y += a.y, t.width += 2 * this.padding(), this._movingAnchorName = this._movingAnchorName.replace("left", "right"), this._anchorDragOffset.x -= a.x, this._anchorDragOffset.y -= a.y
                } else if (this._movingAnchorName && t.width < 0 && this._movingAnchorName.indexOf("right") >= 0) {
                    a = o.point({
                        x: 2 * this.padding(),
                        y: 0
                    });
                    this._movingAnchorName = this._movingAnchorName.replace("right", "left"), this._anchorDragOffset.x -= a.x, this._anchorDragOffset.y -= a.y, t.width += 2 * this.padding()
                }
                if (this._movingAnchorName && t.height < 0 && this._movingAnchorName.indexOf("top") >= 0) {
                    a = o.point({
                        x: 0,
                        y: 2 * -this.padding()
                    });
                    t.x += a.x, t.y += a.y, this._movingAnchorName = this._movingAnchorName.replace("top", "bottom"), this._anchorDragOffset.x -= a.x, this._anchorDragOffset.y -= a.y, t.height += 2 * this.padding()
                } else if (this._movingAnchorName && t.height < 0 && this._movingAnchorName.indexOf("bottom") >= 0) {
                    a = o.point({
                        x: 0,
                        y: 2 * this.padding()
                    });
                    this._movingAnchorName = this._movingAnchorName.replace("bottom", "top"), this._anchorDragOffset.x -= a.x, this._anchorDragOffset.y -= a.y, t.height += 2 * this.padding()
                }
                if (this.boundBoxFunc()) {
                    var s = this.boundBoxFunc()(n, t);
                    s ? t = s : f.warn("boundBoxFunc returned falsy. You should return new bound rect from it!")
                }
                var l = new h;
                l.translate(n.x, n.y), l.rotate(n.rotation), l.scale(n.width / 1e7, n.height / 1e7);
                var c = new h;
                c.translate(t.x, t.y), c.rotate(t.rotation), c.scale(t.width / 1e7, t.height / 1e7);
                var d = c.multiply(l.invert());
                this._nodes.forEach((function (t) {
                    var n, r = t.getParent().getAbsoluteTransform(),
                        o = t.getTransform().copy();
                    o.translate(t.offsetX(), t.offsetY());
                    var a = new h;
                    a.multiply(r.copy().invert()).multiply(d).multiply(r).multiply(o);
                    var s = a.decompose();
                    t.setAttrs(s), i._fire("transform", {
                        evt: e,
                        target: t
                    }), t._fire("transform", {
                        evt: e,
                        target: t
                    }), null === (n = t.getLayer()) || void 0 === n || n.batchDraw()
                })), this.rotation(f._getRotation(t.rotation)), this._resetTransformCache(), this.update(), this.getLayer().batchDraw()
            }
        }, e.prototype.forceUpdate = function () {
            this._resetTransformCache(), this.update()
        }, e.prototype._batchChangeChild = function (t, e) {
            this.findOne(t).setAttrs(e)
        }, e.prototype.update = function () {
            var t, e = this,
                i = this._getNodeRect();
            this.rotation(f._getRotation(i.rotation));
            var n = i.width,
                r = i.height,
                o = this.enabledAnchors(),
                a = this.resizeEnabled(),
                s = this.padding(),
                h = this.anchorSize();
            this.find("._anchor").each((function (t) {
                t.setAttrs({
                    width: h,
                    height: h,
                    offsetX: h / 2,
                    offsetY: h / 2,
                    stroke: e.anchorStroke(),
                    strokeWidth: e.anchorStrokeWidth(),
                    fill: e.anchorFill(),
                    cornerRadius: e.anchorCornerRadius()
                })
            })), this._batchChangeChild(".top-left", {
                x: 0,
                y: 0,
                offsetX: h / 2 + s,
                offsetY: h / 2 + s,
                visible: a && o.indexOf("top-left") >= 0
            }), this._batchChangeChild(".top-center", {
                x: n / 2,
                y: 0,
                offsetY: h / 2 + s,
                visible: a && o.indexOf("top-center") >= 0
            }), this._batchChangeChild(".top-right", {
                x: n,
                y: 0,
                offsetX: h / 2 - s,
                offsetY: h / 2 + s,
                visible: a && o.indexOf("top-right") >= 0
            }), this._batchChangeChild(".middle-left", {
                x: 0,
                y: r / 2,
                offsetX: h / 2 + s,
                visible: a && o.indexOf("middle-left") >= 0
            }), this._batchChangeChild(".middle-right", {
                x: n,
                y: r / 2,
                offsetX: h / 2 - s,
                visible: a && o.indexOf("middle-right") >= 0
            }), this._batchChangeChild(".bottom-left", {
                x: 0,
                y: r,
                offsetX: h / 2 + s,
                offsetY: h / 2 - s,
                visible: a && o.indexOf("bottom-left") >= 0
            }), this._batchChangeChild(".bottom-center", {
                x: n / 2,
                y: r,
                offsetY: h / 2 - s,
                visible: a && o.indexOf("bottom-center") >= 0
            }), this._batchChangeChild(".bottom-right", {
                x: n,
                y: r,
                offsetX: h / 2 - s,
                offsetY: h / 2 - s,
                visible: a && o.indexOf("bottom-right") >= 0
            }), this._batchChangeChild(".rotater", {
                x: n / 2,
                y: -this.rotateAnchorOffset() * f._sign(r) - s,
                visible: this.rotateEnabled()
            }), this._batchChangeChild(".back", {
                width: n,
                height: r,
                visible: this.borderEnabled(),
                stroke: this.borderStroke(),
                strokeWidth: this.borderStrokeWidth(),
                dash: this.borderDash(),
                x: 0,
                y: 0
            }), null === (t = this.getLayer()) || void 0 === t || t.batchDraw()
        }, e.prototype.isTransforming = function () {
            return this._transforming
        }, e.prototype.stopTransform = function () {
            if (this._transforming) {
                this._removeEvents();
                var t = this.findOne("." + this._movingAnchorName);
                t && t.stopDrag()
            }
        }, e.prototype.destroy = function () {
            return this.getStage() && this._cursorChange && (this.getStage().content.style.cursor = ""), ft.prototype.destroy.call(this), this.detach(), this._removeEvents(), this
        }, e.prototype.toObject = function () {
            return X.prototype.toObject.call(this)
        }, e
    }(ft);
    ne.prototype.className = "Transformer", a(ne), w.addGetterSetter(ne, "enabledAnchors", te, (function (t) {
        return t instanceof Array || f.warn("enabledAnchors value should be an array"), t instanceof Array && t.forEach((function (t) {
            -1 === te.indexOf(t) && f.warn("Unknown anchor name: " + t + ". Available names are: " + te.join(", "))
        })), t || []
    })), w.addGetterSetter(ne, "resizeEnabled", !0), w.addGetterSetter(ne, "anchorSize", 10, y()), w.addGetterSetter(ne, "rotateEnabled", !0), w.addGetterSetter(ne, "rotationSnaps", []), w.addGetterSetter(ne, "rotateAnchorOffset", 50, y()), w.addGetterSetter(ne, "rotationSnapTolerance", 5, y()), w.addGetterSetter(ne, "borderEnabled", !0), w.addGetterSetter(ne, "anchorStroke", "rgb(0, 161, 255)"), w.addGetterSetter(ne, "anchorStrokeWidth", 1, y()), w.addGetterSetter(ne, "anchorFill", "white"), w.addGetterSetter(ne, "anchorCornerRadius", 0, y()), w.addGetterSetter(ne, "borderStroke", "rgb(0, 161, 255)"), w.addGetterSetter(ne, "borderStrokeWidth", 1, y()), w.addGetterSetter(ne, "borderDash"), w.addGetterSetter(ne, "keepRatio", !0), w.addGetterSetter(ne, "centeredScaling", !1), w.addGetterSetter(ne, "ignoreStroke", !1), w.addGetterSetter(ne, "padding", 0, y()), w.addGetterSetter(ne, "node"), w.addGetterSetter(ne, "nodes"), w.addGetterSetter(ne, "boundBoxFunc"), w.addGetterSetter(ne, "shouldOverdrawWholeArea", !1), w.backCompat(ne, {
        lineEnabled: "borderEnabled",
        rotateHandlerOffset: "rotateAnchorOffset",
        enabledHandlers: "enabledAnchors"
    }), s.mapMethods(ne);
    var re = function (t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        return P(e, t), e.prototype._sceneFunc = function (t) {
            t.beginPath(), t.arc(0, 0, this.radius(), 0, r.getAngle(this.angle()), this.clockwise()), t.lineTo(0, 0), t.closePath(), t.fillStrokeShape(this)
        }, e.prototype.getWidth = function () {
            return 2 * this.radius()
        }, e.prototype.getHeight = function () {
            return 2 * this.radius()
        }, e.prototype.setWidth = function (t) {
            this.radius(t / 2)
        }, e.prototype.setHeight = function (t) {
            this.radius(t / 2)
        }, e
    }(lt);

    function oe() {
        this.r = 0, this.g = 0, this.b = 0, this.a = 0, this.next = null
    }
    re.prototype.className = "Wedge", re.prototype._centroid = !0, re.prototype._attrsAffectingSize = ["radius"], a(re), w.addGetterSetter(re, "radius", 0, y()), w.addGetterSetter(re, "angle", 0, y()), w.addGetterSetter(re, "clockwise", !1), w.backCompat(re, {
        angleDeg: "angle",
        getAngleDeg: "getAngle",
        setAngleDeg: "setAngle"
    }), s.mapMethods(re);
    var ae = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259],
        se = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
    w.addGetterSetter(X, "blurRadius", 0, y(), w.afterSetFilter);
    w.addGetterSetter(X, "brightness", 0, y(), w.afterSetFilter);
    w.addGetterSetter(X, "contrast", 0, y(), w.afterSetFilter);

    function he(t, e, i, n, r) {
        var o = i - e,
            a = r - n;
        return 0 === o ? n + a / 2 : 0 === a ? n : a * ((t - e) / o) + n
    }
    w.addGetterSetter(X, "embossStrength", .5, y(), w.afterSetFilter), w.addGetterSetter(X, "embossWhiteLevel", .5, y(), w.afterSetFilter), w.addGetterSetter(X, "embossDirection", "top-left", null, w.afterSetFilter), w.addGetterSetter(X, "embossBlend", !1, null, w.afterSetFilter);
    w.addGetterSetter(X, "enhance", 0, y(), w.afterSetFilter);
    w.addGetterSetter(X, "hue", 0, y(), w.afterSetFilter), w.addGetterSetter(X, "saturation", 0, y(), w.afterSetFilter), w.addGetterSetter(X, "luminance", 0, y(), w.afterSetFilter);
    w.addGetterSetter(X, "hue", 0, y(), w.afterSetFilter), w.addGetterSetter(X, "saturation", 0, y(), w.afterSetFilter), w.addGetterSetter(X, "value", 0, y(), w.afterSetFilter);

    function le(t, e, i) {
        var n = 4 * (i * t.width + e),
            r = [];
        return r.push(t.data[n++], t.data[n++], t.data[n++], t.data[n++]), r
    }

    function ce(t, e) {
        return Math.sqrt(Math.pow(t[0] - e[0], 2) + Math.pow(t[1] - e[1], 2) + Math.pow(t[2] - e[2], 2))
    }
    w.addGetterSetter(X, "kaleidoscopePower", 2, y(), w.afterSetFilter), w.addGetterSetter(X, "kaleidoscopeAngle", 0, y(), w.afterSetFilter);
    w.addGetterSetter(X, "threshold", 0, y(), w.afterSetFilter);
    w.addGetterSetter(X, "noise", .2, y(), w.afterSetFilter);
    w.addGetterSetter(X, "pixelSize", 8, y(), w.afterSetFilter);
    w.addGetterSetter(X, "levels", .5, y(), w.afterSetFilter);
    w.addGetterSetter(X, "red", 0, (function (t) {
        return this._filterUpToDate = !1, t > 255 ? 255 : t < 0 ? 0 : Math.round(t)
    })), w.addGetterSetter(X, "green", 0, (function (t) {
        return this._filterUpToDate = !1, t > 255 ? 255 : t < 0 ? 0 : Math.round(t)
    })), w.addGetterSetter(X, "blue", 0, v, w.afterSetFilter);
    w.addGetterSetter(X, "red", 0, (function (t) {
        return this._filterUpToDate = !1, t > 255 ? 255 : t < 0 ? 0 : Math.round(t)
    })), w.addGetterSetter(X, "green", 0, (function (t) {
        return this._filterUpToDate = !1, t > 255 ? 255 : t < 0 ? 0 : Math.round(t)
    })), w.addGetterSetter(X, "blue", 0, v, w.afterSetFilter), w.addGetterSetter(X, "alpha", 1, (function (t) {
        return this._filterUpToDate = !1, t > 1 ? 1 : t < 0 ? 0 : t
    }));
    return w.addGetterSetter(X, "threshold", .5, y(), w.afterSetFilter), wt.Util._assign(wt, {
        Arc: Ct,
        Arrow: kt,
        Circle: Tt,
        Ellipse: At,
        Image: Mt,
        Label: Lt,
        Tag: Et,
        Line: Pt,
        Path: Ot,
        Rect: Dt,
        RegularPolygon: It,
        Ring: Bt,
        Sprite: Nt,
        Star: zt,
        Text: Ut,
        TextPath: Vt,
        Transformer: ne,
        Wedge: re,
        Filters: {
            Blur: function (t) {
                var e = Math.round(this.blurRadius());
                e > 0 && function (t, e) {
                    var i, n, r, o, a, s, h, l, c, d, u, p, f, g, v, y, m, _, b, x, S, w, C, P, k = t.data,
                        T = t.width,
                        A = t.height,
                        M = e + e + 1,
                        G = T - 1,
                        R = A - 1,
                        L = e + 1,
                        E = L * (L + 1) / 2,
                        O = new oe,
                        D = null,
                        I = O,
                        F = null,
                        B = null,
                        N = ae[e],
                        z = se[e];
                    for (r = 1; r < M; r++) I = I.next = new oe, r === L && (D = I);
                    for (I.next = O, h = s = 0, n = 0; n < A; n++) {
                        for (y = m = _ = b = l = c = d = u = 0, p = L * (x = k[s]), f = L * (S = k[s + 1]), g = L * (w = k[s + 2]), v = L * (C = k[s + 3]), l += E * x, c += E * S, d += E * w, u += E * C, I = O, r = 0; r < L; r++) I.r = x, I.g = S, I.b = w, I.a = C, I = I.next;
                        for (r = 1; r < L; r++) o = s + ((G < r ? G : r) << 2), l += (I.r = x = k[o]) * (P = L - r), c += (I.g = S = k[o + 1]) * P, d += (I.b = w = k[o + 2]) * P, u += (I.a = C = k[o + 3]) * P, y += x, m += S, _ += w, b += C, I = I.next;
                        for (F = O, B = D, i = 0; i < T; i++) k[s + 3] = C = u * N >> z, 0 !== C ? (C = 255 / C, k[s] = (l * N >> z) * C, k[s + 1] = (c * N >> z) * C, k[s + 2] = (d * N >> z) * C) : k[s] = k[s + 1] = k[s + 2] = 0, l -= p, c -= f, d -= g, u -= v, p -= F.r, f -= F.g, g -= F.b, v -= F.a, o = h + ((o = i + e + 1) < G ? o : G) << 2, l += y += F.r = k[o], c += m += F.g = k[o + 1], d += _ += F.b = k[o + 2], u += b += F.a = k[o + 3], F = F.next, p += x = B.r, f += S = B.g, g += w = B.b, v += C = B.a, y -= x, m -= S, _ -= w, b -= C, B = B.next, s += 4;
                        h += T
                    }
                    for (i = 0; i < T; i++) {
                        for (m = _ = b = y = c = d = u = l = 0, p = L * (x = k[s = i << 2]), f = L * (S = k[s + 1]), g = L * (w = k[s + 2]), v = L * (C = k[s + 3]), l += E * x, c += E * S, d += E * w, u += E * C, I = O, r = 0; r < L; r++) I.r = x, I.g = S, I.b = w, I.a = C, I = I.next;
                        for (a = T, r = 1; r <= e; r++) s = a + i << 2, l += (I.r = x = k[s]) * (P = L - r), c += (I.g = S = k[s + 1]) * P, d += (I.b = w = k[s + 2]) * P, u += (I.a = C = k[s + 3]) * P, y += x, m += S, _ += w, b += C, I = I.next, r < R && (a += T);
                        for (s = i, F = O, B = D, n = 0; n < A; n++) k[(o = s << 2) + 3] = C = u * N >> z, C > 0 ? (C = 255 / C, k[o] = (l * N >> z) * C, k[o + 1] = (c * N >> z) * C, k[o + 2] = (d * N >> z) * C) : k[o] = k[o + 1] = k[o + 2] = 0, l -= p, c -= f, d -= g, u -= v, p -= F.r, f -= F.g, g -= F.b, v -= F.a, o = i + ((o = n + L) < R ? o : R) * T << 2, l += y += F.r = k[o], c += m += F.g = k[o + 1], d += _ += F.b = k[o + 2], u += b += F.a = k[o + 3], F = F.next, p += x = B.r, f += S = B.g, g += w = B.b, v += C = B.a, y -= x, m -= S, _ -= w, b -= C, B = B.next, s += T
                    }
                }(t, e)
            },
            Brighten: function (t) {
                var e, i = 255 * this.brightness(),
                    n = t.data,
                    r = n.length;
                for (e = 0; e < r; e += 4) n[e] += i, n[e + 1] += i, n[e + 2] += i
            },
            Contrast: function (t) {
                var e, i = Math.pow((this.contrast() + 100) / 100, 2),
                    n = t.data,
                    r = n.length,
                    o = 150,
                    a = 150,
                    s = 150;
                for (e = 0; e < r; e += 4) o = n[e], a = n[e + 1], s = n[e + 2], o /= 255, o -= .5, o *= i, o += .5, a /= 255, a -= .5, a *= i, a += .5, s /= 255, s -= .5, s *= i, s += .5, o = (o *= 255) < 0 ? 0 : o > 255 ? 255 : o, a = (a *= 255) < 0 ? 0 : a > 255 ? 255 : a, s = (s *= 255) < 0 ? 0 : s > 255 ? 255 : s, n[e] = o, n[e + 1] = a, n[e + 2] = s
            },
            Emboss: function (t) {
                var e = 10 * this.embossStrength(),
                    i = 255 * this.embossWhiteLevel(),
                    n = this.embossDirection(),
                    r = this.embossBlend(),
                    o = 0,
                    a = 0,
                    s = t.data,
                    h = t.width,
                    l = t.height,
                    c = 4 * h,
                    d = l;
                switch (n) {
                    case "top-left":
                        o = -1, a = -1;
                        break;
                    case "top":
                        o = -1, a = 0;
                        break;
                    case "top-right":
                        o = -1, a = 1;
                        break;
                    case "right":
                        o = 0, a = 1;
                        break;
                    case "bottom-right":
                        o = 1, a = 1;
                        break;
                    case "bottom":
                        o = 1, a = 0;
                        break;
                    case "bottom-left":
                        o = 1, a = -1;
                        break;
                    case "left":
                        o = 0, a = -1;
                        break;
                    default:
                        f.error("Unknown emboss direction: " + n)
                }
                do {
                    var u = (d - 1) * c,
                        p = o;
                    d + p < 1 && (p = 0), d + p > l && (p = 0);
                    var g = (d - 1 + p) * h * 4,
                        v = h;
                    do {
                        var y = u + 4 * (v - 1),
                            m = a;
                        v + m < 1 && (m = 0), v + m > h && (m = 0);
                        var _ = g + 4 * (v - 1 + m),
                            b = s[y] - s[_],
                            x = s[y + 1] - s[_ + 1],
                            S = s[y + 2] - s[_ + 2],
                            w = b,
                            C = w > 0 ? w : -w;
                        if ((x > 0 ? x : -x) > C && (w = x), (S > 0 ? S : -S) > C && (w = S), w *= e, r) {
                            var P = s[y] + w,
                                k = s[y + 1] + w,
                                T = s[y + 2] + w;
                            s[y] = P > 255 ? 255 : P < 0 ? 0 : P, s[y + 1] = k > 255 ? 255 : k < 0 ? 0 : k, s[y + 2] = T > 255 ? 255 : T < 0 ? 0 : T
                        } else {
                            var A = i - w;
                            A < 0 ? A = 0 : A > 255 && (A = 255), s[y] = s[y + 1] = s[y + 2] = A
                        }
                    } while (--v)
                } while (--d)
            },
            Enhance: function (t) {
                var e, i, n, r, o = t.data,
                    a = o.length,
                    s = o[0],
                    h = s,
                    l = o[1],
                    c = l,
                    d = o[2],
                    u = d,
                    p = this.enhance();
                if (0 !== p) {
                    for (r = 0; r < a; r += 4)(e = o[r + 0]) < s ? s = e : e > h && (h = e), (i = o[r + 1]) < l ? l = i : i > c && (c = i), (n = o[r + 2]) < d ? d = n : n > u && (u = n);
                    var f, g, v, y, m, _, b, x, S;
                    for (h === s && (h = 255, s = 0), c === l && (c = 255, l = 0), u === d && (u = 255, d = 0), p > 0 ? (g = h + p * (255 - h), v = s - p * (s - 0), m = c + p * (255 - c), _ = l - p * (l - 0), x = u + p * (255 - u), S = d - p * (d - 0)) : (g = h + p * (h - (f = .5 * (h + s))), v = s + p * (s - f), m = c + p * (c - (y = .5 * (c + l))), _ = l + p * (l - y), x = u + p * (u - (b = .5 * (u + d))), S = d + p * (d - b)), r = 0; r < a; r += 4) o[r + 0] = he(o[r + 0], s, h, v, g), o[r + 1] = he(o[r + 1], l, c, _, m), o[r + 2] = he(o[r + 2], d, u, S, x)
                }
            },
            Grayscale: function (t) {
                var e, i, n = t.data,
                    r = n.length;
                for (e = 0; e < r; e += 4) i = .34 * n[e] + .5 * n[e + 1] + .16 * n[e + 2], n[e] = i, n[e + 1] = i, n[e + 2] = i
            },
            HSL: function (t) {
                var e, i, n, r, o, a = t.data,
                    s = a.length,
                    h = Math.pow(2, this.saturation()),
                    l = Math.abs(this.hue() + 360) % 360,
                    c = 127 * this.luminance(),
                    d = 1 * h * Math.cos(l * Math.PI / 180),
                    u = 1 * h * Math.sin(l * Math.PI / 180),
                    p = .299 + .701 * d + .167 * u,
                    f = .587 - .587 * d + .33 * u,
                    g = .114 - .114 * d - .497 * u,
                    v = .299 - .299 * d - .328 * u,
                    y = .587 + .413 * d + .035 * u,
                    m = .114 - .114 * d + .293 * u,
                    _ = .299 - .3 * d + 1.25 * u,
                    b = .587 - .586 * d - 1.05 * u,
                    x = .114 + .886 * d - .2 * u;
                for (e = 0; e < s; e += 4) i = a[e + 0], n = a[e + 1], r = a[e + 2], o = a[e + 3], a[e + 0] = p * i + f * n + g * r + c, a[e + 1] = v * i + y * n + m * r + c, a[e + 2] = _ * i + b * n + x * r + c, a[e + 3] = o
            },
            HSV: function (t) {
                var e, i, n, r, o, a = t.data,
                    s = a.length,
                    h = Math.pow(2, this.value()),
                    l = Math.pow(2, this.saturation()),
                    c = Math.abs(this.hue() + 360) % 360,
                    d = h * l * Math.cos(c * Math.PI / 180),
                    u = h * l * Math.sin(c * Math.PI / 180),
                    p = .299 * h + .701 * d + .167 * u,
                    f = .587 * h - .587 * d + .33 * u,
                    g = .114 * h - .114 * d - .497 * u,
                    v = .299 * h - .299 * d - .328 * u,
                    y = .587 * h + .413 * d + .035 * u,
                    m = .114 * h - .114 * d + .293 * u,
                    _ = .299 * h - .3 * d + 1.25 * u,
                    b = .587 * h - .586 * d - 1.05 * u,
                    x = .114 * h + .886 * d - .2 * u;
                for (e = 0; e < s; e += 4) i = a[e + 0], n = a[e + 1], r = a[e + 2], o = a[e + 3], a[e + 0] = p * i + f * n + g * r, a[e + 1] = v * i + y * n + m * r, a[e + 2] = _ * i + b * n + x * r, a[e + 3] = o
            },
            Invert: function (t) {
                var e, i = t.data,
                    n = i.length;
                for (e = 0; e < n; e += 4) i[e] = 255 - i[e], i[e + 1] = 255 - i[e + 1], i[e + 2] = 255 - i[e + 2]
            },
            Kaleidoscope: function (t) {
                var e, i, n, r, o, a, s, h, l, c = t.width,
                    d = t.height,
                    u = Math.round(this.kaleidoscopePower()),
                    p = Math.round(this.kaleidoscopeAngle()),
                    g = Math.floor(c * (p % 360) / 360);
                if (!(u < 1)) {
                    var v = f.createCanvasElement();
                    v.width = c, v.height = d;
                    var y = v.getContext("2d").getImageData(0, 0, c, d);
                    ! function (t, e, i) {
                        var n, r, o, a, s = t.data,
                            h = e.data,
                            l = t.width,
                            c = t.height,
                            d = i.polarCenterX || l / 2,
                            u = i.polarCenterY || c / 2,
                            p = 0,
                            f = 0,
                            g = 0,
                            v = 0,
                            y = Math.sqrt(d * d + u * u);
                        r = l - d, o = c - u, y = (a = Math.sqrt(r * r + o * o)) > y ? a : y;
                        var m, _, b, x, S = c,
                            w = l,
                            C = 360 / w * Math.PI / 180;
                        for (_ = 0; _ < w; _ += 1)
                            for (b = Math.sin(_ * C), x = Math.cos(_ * C), m = 0; m < S; m += 1) r = Math.floor(d + y * m / S * x), p = s[(n = 4 * ((o = Math.floor(u + y * m / S * b)) * l + r)) + 0], f = s[n + 1], g = s[n + 2], v = s[n + 3], h[(n = 4 * (_ + m * l)) + 0] = p, h[n + 1] = f, h[n + 2] = g, h[n + 3] = v
                    }(t, y, {
                        polarCenterX: c / 2,
                        polarCenterY: d / 2
                    });
                    for (var m = c / Math.pow(2, u); m <= 8;) m *= 2, u -= 1;
                    var _ = m = Math.ceil(m),
                        b = 0,
                        x = _,
                        S = 1;
                    for (g + m > c && (b = _, x = 0, S = -1), i = 0; i < d; i += 1)
                        for (e = b; e !== x; e += S) h = 4 * (c * i + Math.round(e + g) % c), r = y.data[h + 0], o = y.data[h + 1], a = y.data[h + 2], s = y.data[h + 3], l = 4 * (c * i + e), y.data[l + 0] = r, y.data[l + 1] = o, y.data[l + 2] = a, y.data[l + 3] = s;
                    for (i = 0; i < d; i += 1)
                        for (_ = Math.floor(m), n = 0; n < u; n += 1) {
                            for (e = 0; e < _ + 1; e += 1) h = 4 * (c * i + e), r = y.data[h + 0], o = y.data[h + 1], a = y.data[h + 2], s = y.data[h + 3], l = 4 * (c * i + 2 * _ - e - 1), y.data[l + 0] = r, y.data[l + 1] = o, y.data[l + 2] = a, y.data[l + 3] = s;
                            _ *= 2
                        } ! function (t, e, i) {
                            var n, r, o, a, s, h, l = t.data,
                                c = e.data,
                                d = t.width,
                                u = t.height,
                                p = i.polarCenterX || d / 2,
                                f = i.polarCenterY || u / 2,
                                g = 0,
                                v = 0,
                                y = 0,
                                m = 0,
                                _ = Math.sqrt(p * p + f * f);
                            r = d - p, o = u - f, _ = (h = Math.sqrt(r * r + o * o)) > _ ? h : _;
                            var b, x, S, w = u,
                                C = d,
                                P = i.polarRotation || 0;
                            for (r = 0; r < d; r += 1)
                                for (o = 0; o < u; o += 1) a = r - p, s = o - f, b = Math.sqrt(a * a + s * s) * w / _, x = (x = (180 * Math.atan2(s, a) / Math.PI + 360 + P) % 360) * C / 360, S = Math.floor(x), g = l[(n = 4 * (Math.floor(b) * d + S)) + 0], v = l[n + 1], y = l[n + 2], m = l[n + 3], c[(n = 4 * (o * d + r)) + 0] = g, c[n + 1] = v, c[n + 2] = y, c[n + 3] = m
                        }(y, t, {
                            polarRotation: 0
                        })
                }
            },
            Mask: function (t) {
                var e = function (t, e) {
                    var i = le(t, 0, 0),
                        n = le(t, t.width - 1, 0),
                        r = le(t, 0, t.height - 1),
                        o = le(t, t.width - 1, t.height - 1),
                        a = e || 10;
                    if (ce(i, n) < a && ce(n, o) < a && ce(o, r) < a && ce(r, i) < a) {
                        for (var s = function (t) {
                            for (var e = [0, 0, 0], i = 0; i < t.length; i++) e[0] += t[i][0], e[1] += t[i][1], e[2] += t[i][2];
                            return e[0] /= t.length, e[1] /= t.length, e[2] /= t.length, e
                        }([n, i, o, r]), h = [], l = 0; l < t.width * t.height; l++) {
                            var c = ce(s, [t.data[4 * l], t.data[4 * l + 1], t.data[4 * l + 2]]);
                            h[l] = c < a ? 0 : 255
                        }
                        return h
                    }
                }(t, this.threshold());
                return e && function (t, e) {
                    for (var i = 0; i < t.width * t.height; i++) t.data[4 * i + 3] = e[i]
                }(t, e = function (t, e, i) {
                    for (var n = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9], r = Math.round(Math.sqrt(n.length)), o = Math.floor(r / 2), a = [], s = 0; s < i; s++)
                        for (var h = 0; h < e; h++) {
                            for (var l = s * e + h, c = 0, d = 0; d < r; d++)
                                for (var u = 0; u < r; u++) {
                                    var p = s + d - o,
                                        f = h + u - o;
                                    if (p >= 0 && p < i && f >= 0 && f < e) {
                                        var g = n[d * r + u];
                                        c += t[p * e + f] * g
                                    }
                                }
                            a[l] = c
                        }
                    return a
                }(e = function (t, e, i) {
                    for (var n = [1, 1, 1, 1, 1, 1, 1, 1, 1], r = Math.round(Math.sqrt(n.length)), o = Math.floor(r / 2), a = [], s = 0; s < i; s++)
                        for (var h = 0; h < e; h++) {
                            for (var l = s * e + h, c = 0, d = 0; d < r; d++)
                                for (var u = 0; u < r; u++) {
                                    var p = s + d - o,
                                        f = h + u - o;
                                    if (p >= 0 && p < i && f >= 0 && f < e) {
                                        var g = n[d * r + u];
                                        c += t[p * e + f] * g
                                    }
                                }
                            a[l] = c >= 1020 ? 255 : 0
                        }
                    return a
                }(e = function (t, e, i) {
                    for (var n = [1, 1, 1, 1, 0, 1, 1, 1, 1], r = Math.round(Math.sqrt(n.length)), o = Math.floor(r / 2), a = [], s = 0; s < i; s++)
                        for (var h = 0; h < e; h++) {
                            for (var l = s * e + h, c = 0, d = 0; d < r; d++)
                                for (var u = 0; u < r; u++) {
                                    var p = s + d - o,
                                        f = h + u - o;
                                    if (p >= 0 && p < i && f >= 0 && f < e) {
                                        var g = n[d * r + u];
                                        c += t[p * e + f] * g
                                    }
                                }
                            a[l] = 2040 === c ? 255 : 0
                        }
                    return a
                }(e, t.width, t.height), t.width, t.height), t.width, t.height)), t
            },
            Noise: function (t) {
                var e, i = 255 * this.noise(),
                    n = t.data,
                    r = n.length,
                    o = i / 2;
                for (e = 0; e < r; e += 4) n[e + 0] += o - 2 * o * Math.random(), n[e + 1] += o - 2 * o * Math.random(), n[e + 2] += o - 2 * o * Math.random()
            },
            Pixelate: function (t) {
                var e, i, n, r, o, a, s, h, l, c, d, u, p, g, v = Math.ceil(this.pixelSize()),
                    y = t.width,
                    m = t.height,
                    _ = Math.ceil(y / v),
                    b = Math.ceil(m / v),
                    x = t.data;
                if (v <= 0) f.error("pixelSize value can not be <= 0");
                else
                    for (u = 0; u < _; u += 1)
                        for (p = 0; p < b; p += 1) {
                            for (r = 0, o = 0, a = 0, s = 0, l = (h = u * v) + v, d = (c = p * v) + v, g = 0, e = h; e < l; e += 1)
                                if (!(e >= y))
                                    for (i = c; i < d; i += 1) i >= m || (r += x[(n = 4 * (y * i + e)) + 0], o += x[n + 1], a += x[n + 2], s += x[n + 3], g += 1);
                            for (r /= g, o /= g, a /= g, s /= g, e = h; e < l; e += 1)
                                if (!(e >= y))
                                    for (i = c; i < d; i += 1) i >= m || (x[(n = 4 * (y * i + e)) + 0] = r, x[n + 1] = o, x[n + 2] = a, x[n + 3] = s)
                        }
            },
            Posterize: function (t) {
                var e, i = Math.round(254 * this.levels()) + 1,
                    n = t.data,
                    r = n.length,
                    o = 255 / i;
                for (e = 0; e < r; e += 1) n[e] = Math.floor(n[e] / o) * o
            },
            RGB: function (t) {
                var e, i, n = t.data,
                    r = n.length,
                    o = this.red(),
                    a = this.green(),
                    s = this.blue();
                for (e = 0; e < r; e += 4) i = (.34 * n[e] + .5 * n[e + 1] + .16 * n[e + 2]) / 255, n[e] = i * o, n[e + 1] = i * a, n[e + 2] = i * s, n[e + 3] = n[e + 3]
            },
            RGBA: function (t) {
                var e, i, n = t.data,
                    r = n.length,
                    o = this.red(),
                    a = this.green(),
                    s = this.blue(),
                    h = this.alpha();
                for (e = 0; e < r; e += 4) i = 1 - h, n[e] = o * h + n[e] * i, n[e + 1] = a * h + n[e + 1] * i, n[e + 2] = s * h + n[e + 2] * i
            },
            Sepia: function (t) {
                var e, i, n, r, o = t.data,
                    a = o.length;
                for (e = 0; e < a; e += 4) i = o[e + 0], n = o[e + 1], r = o[e + 2], o[e + 0] = Math.min(255, .393 * i + .769 * n + .189 * r), o[e + 1] = Math.min(255, .349 * i + .686 * n + .168 * r), o[e + 2] = Math.min(255, .272 * i + .534 * n + .131 * r)
            },
            Solarize: function (t) {
                var e = t.data,
                    i = t.width,
                    n = 4 * i,
                    r = t.height;
                do {
                    var o = (r - 1) * n,
                        a = i;
                    do {
                        var s = o + 4 * (a - 1),
                            h = e[s],
                            l = e[s + 1],
                            c = e[s + 2];
                        h > 127 && (h = 255 - h), l > 127 && (l = 255 - l), c > 127 && (c = 255 - c), e[s] = h, e[s + 1] = l, e[s + 2] = c
                    } while (--a)
                } while (--r)
            },
            Threshold: function (t) {
                var e, i = 255 * this.threshold(),
                    n = t.data,
                    r = n.length;
                for (e = 0; e < r; e += 1) n[e] = n[e] < i ? 0 : 255
            }
        }
    })
}));