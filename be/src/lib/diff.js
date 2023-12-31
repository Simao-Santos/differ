/* eslint-disable */

const lib = {
    defaultJunkFunction: function (d) {
        return {
            " ": !0,
            "\t": !0,
            "\n": !0,
            "\f": !0,
            "\r": !0
        }.hasOwnProperty(d)
    },
    stripLinebreaks: function (d) {
        return d.replace(/^[\n\r]*|[\n\r]*$/g, "")
    },
    stringAsLines: function (d) {
        for (var f = d.indexOf("\n"), g = d.indexOf("\r"), h = -1 < f && -1 < g || 0 > g ? "\n" : "\r", l = d.split(h), m = 0; m < l.length; m++) l[m] = lib.stripLinebreaks(l[m]);
        return l
    },
    __reduce: function (d, f, g) {
        if (null != g) var h = g,
            l = 0;
        else if (f) var h = f[0],
            l = 1;
        else return null;
        for (; l < f.length; l++) h = d(h, f[l]);
        return h
    },
    __ntuplecomp: function (d, f) {
        for (var g = Math.max(d.length, f.length), h = 0; h < g; h++) {
            if (d[h] < f[h]) return -1;
            if (d[h] > f[h]) return 1
        }
        return d.length == f.length ? 0 : d.length < f.length ? -1 : 1
    },
    __isindict: function (d) {
        return function (f) {
            return d.hasOwnProperty(f)
        }
    },
    __dictget: function (d, f, g) {
        return d.hasOwnProperty(f) ? d[f] : g
    },
    SequenceMatcher: function (d, f, g) {
        this.set_seqs = function (h, l) {
            this.set_seq1(h), this.set_seq2(l)
        }, this.set_seq1 = function (h) {
            h == this.a || (this.a = h, this.matching_blocks = this.opcodes = null)
        }, this.set_seq2 = function (h) {
            h == this.b || (this.b = h, this.matching_blocks = this.opcodes = this.fullbcount = null, this.__chain_b())
        }, this.__chain_b = function () {
            for (var q, h = this.b, l = h.length, m = this.b2j = {}, o = {}, p = 0; p < h.length; p++)
                if (q = h[p], m.hasOwnProperty(q)) {
                    var r = m[q];
                    200 <= l && 100 * r.length > l ? (o[q] = 1, delete m[q]) : r.push(p)
                } else m[q] = [p];
            for (var q in o) o.hasOwnProperty(q) && delete m[q];
            var s = this.isjunk,
                t = {};
            if (s) {
                for (var q in o) o.hasOwnProperty(q) && s(q) && (t[q] = 1, delete o[q]);
                for (var q in m) m.hasOwnProperty(q) && s(q) && (t[q] = 1, delete m[q])
            }
            this.isbjunk = lib.__isindict(t), this.isbpopular = lib.__isindict(o)
        }, this.find_longest_match = function (h, l, m, o) {
            for (var p = this.a, q = this.b, r = this.b2j, s = this.isbjunk, t = h, u = m, v = 0, w = null, y = {}, z = [], A = h; A < l; A++) {
                var B = {},
                    C = lib.__dictget(r, p[A], z);
                for (var D in C)
                    if (C.hasOwnProperty(D)) {
                        if (w = C[D], w < m) continue;
                        if (w >= o) break;
                        B[w] = k = lib.__dictget(y, w - 1, 0) + 1, k > v && (t = A - k + 1, u = w - k + 1, v = k)
                    } y = B
            }
            for (; t > h && u > m && !s(q[u - 1]) && p[t - 1] == q[u - 1];) t--, u--, v++;
            for (; t + v < l && u + v < o && !s(q[u + v]) && p[t + v] == q[u + v];) v++;
            for (; t > h && u > m && s(q[u - 1]) && p[t - 1] == q[u - 1];) t--, u--, v++;
            for (; t + v < l && u + v < o && s(q[u + v]) && p[t + v] == q[u + v];) v++;
            return [t, u, v]
        }, this.get_matching_blocks = function () {
            if (null != this.matching_blocks) return this.matching_blocks;
            for (var p, q, r, s, t, u, v, w, y, h = this.a.length, l = this.b.length, m = [
                [0, h, 0, l]
            ], o = []; m.length;) t = m.pop(), p = t[0], q = t[1], r = t[2], s = t[3], y = this.find_longest_match(p, q, r, s), u = y[0], v = y[1], w = y[2], w && (o.push(y), p < u && r < v && m.push([p, u, r, v]), u + w < q && v + w < s && m.push([u + w, q, v + w, s]));
            o.sort(lib.__ntuplecomp);
            var z = j1 = k1 = block = 0,
                A = [];
            for (var B in o) o.hasOwnProperty(B) && (block = o[B], i2 = block[0], j2 = block[1], k2 = block[2], z + k1 == i2 && j1 + k1 == j2 ? k1 += k2 : (k1 && A.push([z, j1, k1]), z = i2, j1 = j2, k1 = k2));
            return k1 && A.push([z, j1, k1]), A.push([h, l, 0]), this.matching_blocks = A, this.matching_blocks
        }, this.get_opcodes = function () {
            if (null != this.opcodes) return this.opcodes;
            var h = 0,
                l = 0,
                m = [];
            this.opcodes = m;
            var o, p, q, r, s, t = this.get_matching_blocks();
            for (var u in t) t.hasOwnProperty(u) && (o = t[u], p = o[0], q = o[1], r = o[2], s = "", h < p && l < q ? s = "replace" : h < p ? s = "delete" : l < q && (s = "insert"), s && m.push([s, h, p, l, q]), h = p + r, l = q + r, r && m.push(["equal", p, h, q, l]));
            return m
        }, this.get_grouped_opcodes = function (h) {
            h || (h = 3);
            var l = this.get_opcodes();
            l || (l = [
                ["equal", 0, 1, 0, 1]
            ]);
            var m, o, p, q, r, s;
            "equal" == l[0][0] && (m = l[0], o = m[0], p = m[1], q = m[2], r = m[3], s = m[4], l[0] = [o, Math.max(p, q - h), q, Math.max(r, s - h), s]), "equal" == l[l.length - 1][0] && (m = l[l.length - 1], o = m[0], p = m[1], q = m[2], r = m[3], s = m[4], l[l.length - 1] = [o, p, Math.min(q, p + h), r, Math.min(s, r + h)]);
            var t = h + h,
                u = [],
                v = [];
            for (var w in l) l.hasOwnProperty(w) && (m = l[w], o = m[0], p = m[1], q = m[2], r = m[3], s = m[4], "equal" == o && q - p > t && (u.push([o, p, Math.min(q, p + h), r, Math.min(s, r + h)]), v.push(u), u = [], p = Math.max(p, q - h), r = Math.max(r, s - h)), u.push([o, p, q, r, s]));
            return u && (1 != u.length || "equal" != u[0][0]) && v.push(u), v
        }, this.isjunk = g ? g : lib.defaultJunkFunction, this.a = this.b = null, this.set_seqs(d, f)
    }
},
    view = {
        buildView: function (d) {
            function f(K, L) {
                var M = document.createElement(K);
                return M.className = L, M
            }

            function g(K, L, M) {
                var N = document.createElement(K);
                return N.className = M, N.appendChild(document.createTextNode(L)), N
            }

            function h(K, L, M) {
                var N = document.createElement(K);
                return N.className = L, N.appendChild(document.createTextNode(M)), N
            }

            function l(K, L, M, N, O) {
                return L < M ? (K.appendChild(g("th", (L + 1).toString(), O)), K.appendChild(h("td", O, N[L].replace(/\t/g, "\xA0\xA0\xA0\xA0"))), L + 1) : (K.appendChild(document.createElement("th")), K.appendChild(f("td", "empty")), L)
            }

            function m(K, L, M, N, O) {
                K.appendChild(g("th", null == L ? "" : (L + 1).toString(), O)), K.appendChild(g("th", null == M ? "" : (M + 1).toString(), O)), K.appendChild(h("td", O, N[null == L ? M : L].replace(/\t/g, "\xA0\xA0\xA0\xA0")))
            }
            var o = d.baseTextLines,
                p = d.newTextLines,
                q = d.opcodes,
                r = d.baseTextName ? d.baseTextName : "Base Text",
                s = d.newTextName ? d.newTextName : "New Text",
                t = d.contextSize,
                u = 0 == d.viewType || 1 == d.viewType ? d.viewType : 0;
            if (null == o) throw "Cannot build diff view; baseTextLines is not defined.";
            if (null == p) throw "Cannot build diff view; newTextLines is not defined.";
            if (!q) throw "Cannot build diff view; opcodes is not defined.";
            var v = document.createElement("thead"),
                w = document.createElement("tr");
            v.appendChild(w), u ? (w.appendChild(document.createElement("th")), w.appendChild(document.createElement("th")), w.appendChild(h("th", "texttitle", r + " vs. " + s))) : (w.appendChild(document.createElement("th")), w.appendChild(h("th", "texttitle", r)), w.appendChild(document.createElement("th")), w.appendChild(h("th", "texttitle", s))), v = [v];
            for (var z, y = [], A = 0; A < q.length; A++) {
                code = q[A], change = code[0];
                for (var B = code[1], C = code[2], D = code[3], E = code[4], F = Math.max(C - B, E - D), G = [], H = [], I = 0; I < F; I++) {
                    if (t && 1 < q.length && (0 < A && I == t || 0 == A && 0 == I) && "equal" == change) {
                        var J = F - (0 == A ? 1 : 2) * t;
                        if (1 < J)
                            if (G.push(w = document.createElement("tr")), B += J, D += J, I += J - 1, w.appendChild(g("th", "...", change)), u || w.appendChild(h("td", "skip", "")), w.appendChild(g("th", "...", change)), w.appendChild(h("td", "skip", "")), A + 1 == q.length) break;
                            else continue
                    }
                    G.push(w = document.createElement("tr")), u ? "insert" == change ? m(w, null, D++, p, change) : "replace" == change ? (H.push(z = document.createElement("tr")), B < C && m(w, B++, null, o, "delete"), D < E && m(z, null, D++, p, "insert")) : "delete" == change ? m(w, B++, null, o, change) : m(w, B++, D++, o, change) : (B = l(w, B, C, o, change), D = l(w, D, E, p, change))
                }
                for (var I = 0; I < G.length; I++) y.push(G[I]);
                for (var I = 0; I < H.length; I++) y.push(H[I])
            }
            for (var A in v.push(w = document.createElement("tbody")), y) y.hasOwnProperty(A) && w.appendChild(y[A]);
            for (var A in w = f("table", "diff" + (u ? " inlinediff" : "")), v) v.hasOwnProperty(A) && w.appendChild(v[A]);
            return w
        }
    };
module.exports = {
    lib,
    view
};