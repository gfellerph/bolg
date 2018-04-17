/* eslint-disable */
/*
 * medium-zoom v0.3.0
 * Medium zoom on your images in vanilla JavaScript
 * Copyright 2018 Francois Chalifour
 * https://github.com/francoischalifour/medium-zoom
 * MIT License
 */function __$styleInject(a, b) { if ('undefined' == typeof document) return b; a = a || ''; var c = document.head || document.getElementsByTagName('head')[0], d = document.createElement('style'); return d.type = 'text/css', c.appendChild(d), d.styleSheet ? d.styleSheet.cssText = a : d.appendChild(document.createTextNode(a)), b } var _extends = Object.assign || function (a) { for (var b, c = 1; c < arguments.length; c++)for (var d in b = arguments[c], b) Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]); return a }, SUPPORTED_FORMATS = ['IMG'], KEY_ESC = 27, KEY_Q = 81, CANCEL_KEYS = [KEY_ESC, KEY_Q], isSupported = function (a) { return -1 < SUPPORTED_FORMATS.indexOf(a.tagName) }, isScaled = function (a) { return a.naturalWidth !== a.width }, isListOrCollection = function (a) { return NodeList.prototype.isPrototypeOf(a) || HTMLCollection.prototype.isPrototypeOf(a) }, isNode = function (a) { return a && 1 === a.nodeType }, mediumZoom = function (a) { var b = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}, c = b.margin, d = void 0 === c ? 0 : c, e = b.background, f = void 0 === e ? '#fff' : e, g = b.scrollOffset, h = void 0 === g ? 48 : g, i = b.metaClick, j = b.container, k = b.template, l = function (a) { var b = a.getBoundingClientRect(), c = b.top, d = b.left, e = b.width, f = b.height, g = a.cloneNode(), h = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0, i = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0; return g.removeAttribute('id'), g.style.position = 'absolute', g.style.top = c + h + 'px', g.style.left = d + i + 'px', g.style.width = e + 'px', g.style.height = f + 'px', g.style.transform = '', g }, m = function (a) { var b = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : { bubbles: !1, cancelable: !1, detail: void 0 }; if ('function' == typeof window.CustomEvent) return new CustomEvent(a, b); var c = document.createEvent('CustomEvent'); return c.initCustomEvent(a, b.bubbles, b.cancelable, b.detail), c }, n = function () { if (z.original) { if (z.original.dispatchEvent(m('show')), A = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0, B = !0, z.zoomed = l(z.original), document.body.appendChild(y), w.template) { var a = isNode(w.template) ? w.template : document.querySelector(w.template); z.template = document.createElement('div'), z.template.appendChild(a.content.cloneNode(!0)), document.body.appendChild(z.template) } if (document.body.appendChild(z.zoomed), requestAnimationFrame(function () { document.body.classList.add('medium-zoom--open') }), z.original.style.visibility = 'hidden', z.zoomed.classList.add('medium-zoom-image--open'), z.zoomed.addEventListener('click', o), z.zoomed.addEventListener('transitionend', r), z.original.getAttribute('data-zoom-target')) { z.zoomedHd = z.zoomed.cloneNode(), z.zoomedHd.setAttribute('srcset', ''), z.zoomedHd.setAttribute('sizes', ''), z.zoomedHd.src = z.zoomed.getAttribute('data-zoom-target'), z.zoomedHd.onerror = function () { clearInterval(b), console.error('Unable to reach the zoom image target ' + z.zoomedHd.src), z.zoomedHd = null, v() }; var b = setInterval(function () { z.zoomedHd.naturalWidth && (clearInterval(b), z.zoomedHd.classList.add('medium-zoom-image--open'), z.zoomedHd.addEventListener('click', o), document.body.appendChild(z.zoomedHd), v()) }, 10) } else if (z.original.hasAttribute('srcset')) { z.zoomedHd = z.zoomed.cloneNode(), z.zoomedHd.setAttribute('sizes', ''); var c = z.zoomedHd.addEventListener('load', function () { z.zoomedHd.removeEventListener('load', c), z.zoomedHd.classList.add('medium-zoom-image--open'), z.zoomedHd.addEventListener('click', o), document.body.appendChild(z.zoomedHd), v() }) } else v() } }, o = function a() { var b = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0, c = function () { B || !z.original || (z.original.dispatchEvent(m('hide')), B = !0, document.body.classList.remove('medium-zoom--open'), z.zoomed.style.transform = '', z.zoomedHd && (z.zoomedHd.style.transform = '', z.zoomedHd.removeEventListener('click', a)), z.template && (z.template.style.transition = 'opacity 150ms', z.template.style.opacity = 0), z.zoomed.removeEventListener('click', a), z.zoomed.addEventListener('transitionend', s)) }; 0 < b ? setTimeout(c, b) : c() }, p = function (a) { a && a.target ? (z.original = a.target, n()) : z.original ? o() : (z.original = x[0], n()) }, q = function (a) { return (a.metaKey || a.ctrlKey) && w.metaClick ? window.open(a.target.getAttribute('data-original') || a.target.parentNode.href || a.target.src, '_blank') : void (a.preventDefault(), p(a)) }, r = function a() { B = !1, z.zoomed.removeEventListener('transitionend', a), z.original.dispatchEvent(m('shown')) }, s = function a() { z.original && (z.original.style.visibility = '', document.body.removeChild(z.zoomed), z.zoomedHd && document.body.removeChild(z.zoomedHd), document.body.removeChild(y), z.zoomed.classList.remove('medium-zoom-image--open'), z.template && document.body.removeChild(z.template), B = !1, z.zoomed.removeEventListener('transitionend', a), z.original.dispatchEvent(m('hidden')), z.original = null, z.zoomed = null, z.zoomedHd = null, z.template = null) }, t = function () { if (!B && z.original) { var a = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0; Math.abs(A - a) > w.scrollOffset && o(150) } }, u = function (a) { -1 < CANCEL_KEYS.indexOf(a.keyCode || a.which) && o() }, v = function () { var a = Math.min; if (z.original) { var b, c, d = { width: window.innerWidth, height: window.innerHeight, left: 0, top: 0, right: 0, bottom: 0 }; if (w.container) if (w.container instanceof Object) _extends(d, w.container), b = d.width - d.left - d.right - 2 * w.margin, c = d.height - d.top - d.bottom - 2 * w.margin; else { var e = isNode(w.container) ? w.container : document.querySelector(w.container), f = e.getBoundingClientRect(), g = f.width, h = f.height, i = f.left, j = f.top; _extends(d, { width: g, height: h, left: i, top: j }) } b = b || d.width - 2 * w.margin, c = c || d.height - 2 * w.margin; var k = z.zoomedHd || z.original, l = k.naturalWidth, m = void 0 === l ? b : l, n = k.naturalHeight, o = void 0 === n ? c : n, p = k.getBoundingClientRect(), q = p.top, r = p.left, s = p.width, t = p.height, u = a(m, b) / s, v = a(o, c) / t, x = a(u, v) || 1, y = (-r + (b - s) / 2 + w.margin + d.left) / x, A = (-q + (c - t) / 2 + w.margin + d.top) / x, B = 'scale(' + x + ') translate3d(' + y + 'px, ' + A + 'px, 0)'; z.zoomed.style.transform = B, z.zoomedHd && (z.zoomedHd.style.transform = B) } }, w = { margin: d, background: f, scrollOffset: h, metaClick: void 0 === i || i, container: j, template: k }; a instanceof Object && _extends(w, a); var x = function (a) { try { return Array.isArray(a) ? a.filter(isSupported) : isListOrCollection(a) ? Array.apply(null, a).filter(isSupported) : isNode(a) ? [a].filter(isSupported) : 'string' == typeof a ? Array.apply(null, document.querySelectorAll(a)).filter(isSupported) : Array.apply(null, document.querySelectorAll(SUPPORTED_FORMATS.map(function (a) { return a.toLowerCase() }).join(','))).filter(isScaled) } catch (a) { throw new TypeError('The provided selector is invalid.\nExpects a CSS selector, a Node element, a NodeList, an HTMLCollection or an array.\nSee: https://github.com/francoischalifour/medium-zoom') } }(a), y = function (a) { var b = document.createElement('div'); return b.classList.add('medium-zoom-overlay'), b.style.backgroundColor = a, b }(w.background), z = { original: null, zoomed: null, zoomedHd: null, template: null }, A = 0, B = !1; return x.forEach(function (a) { a.classList.add('medium-zoom-image'), a.addEventListener('click', q) }), y.addEventListener('click', o), document.addEventListener('scroll', t), document.addEventListener('keyup', u), window.addEventListener('resize', o), { show: p, hide: o, toggle: p, update: function () { var a = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}; return a.background && (y.style.backgroundColor = a.background), a.container && a.container instanceof Object && (a.container = _extends({}, w.container, a.container)), _extends(w, a) }, addEventListeners: function (a, b) { x.forEach(function (c) { c.addEventListener(a, b) }) }, detach: function () { z.zoomed && o(); var a = m('detach'); x.forEach(function (b) { b.classList.remove('medium-zoom-image'), b.removeEventListener('click', q), b.dispatchEvent(a) }), x.splice(0, x.length), y.removeEventListener('click', o), document.removeEventListener('scroll', t), document.removeEventListener('keyup', u), window.removeEventListener('resize', o) }, images: x, options: w } }, mediumZoom$2 = Object.freeze({ default: mediumZoom }); __$styleInject('.medium-zoom-overlay{position:fixed;top:0;right:0;bottom:0;left:0;opacity:0;transition:opacity .3s;will-change:opacity}.medium-zoom--open .medium-zoom-overlay{cursor:pointer;cursor:zoom-out;opacity:1}.medium-zoom-image{cursor:pointer;cursor:zoom-in;transition:transform .3s}.medium-zoom-image--open{position:relative;cursor:pointer;cursor:zoom-out;will-change:transform}', void 0); var mediumZoom$4 = mediumZoom$2 && mediumZoom || mediumZoom$2, src = mediumZoom$4; export default src;