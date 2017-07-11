/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);
/* harmony export (immutable) */ __webpack_exports__["buildIndex"] = buildIndex;
/* harmony export (immutable) */ __webpack_exports__["buildPost"] = buildPost;
/* harmony export (immutable) */ __webpack_exports__["publish"] = publish;
/* harmony export (immutable) */ __webpack_exports__["publishAll"] = publishAll;
/* harmony export (immutable) */ __webpack_exports__["unpublish"] = unpublish;


var hbsTemplates = __webpack_require__(16);
var firebase = __webpack_require__(4);
var writefile = __webpack_require__(18);
var Post = __webpack_require__(33);
var fs = __webpack_require__(0);
var helpers = __webpack_require__(5);
var webpackManifest = __webpack_require__(20);

var slugger = helpers.slugger;
var logoURL = helpers.logoURL;
var database = firebase.database();
var publishedRef = database.ref('/published').orderByChild('created');

function buildIndex() {
  return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    publishedRef.once('value', function (snapshot) {
      var val = snapshot.val();
      var filePath = 'public/index.html';
      if (!val) return reject(new Error('There are no posts to build an overview with.'));
      var posts = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default()(val).map(function (post) {
        return new Post(val[post]);
      });

      var html = hbsTemplates.index({
        posts: posts,
        logoURL: logoURL(),
        webpack: webpackManifest
      });
      writefile(filePath, html).then(resolve);
    });
  });
}

function buildPost(post, nextPost) {
  if (!post) throw new Error('Post with id ' + post + ' not found, can\'t touch this.');

  var filePath = 'public/posts/' + slugger(post.title) + '.html';
  var html = hbsTemplates.post({
    post: post,
    nextPost: nextPost,
    logoURL: logoURL(),
    webpack: webpackManifest
  });

  return writefile(filePath, html);
}

function publish(id) {
  return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (resolve) {
    publishedRef.once('value', function (snapshot) {
      var value = snapshot.val();
      var posts = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default()(value).map(function (post) {
        return value[post];
      });
      var post = null;
      var nextPost = null;
      var lastPost = null;

      for (var i = 0; i < posts.length; i += 1) {
        if (posts[i].id === id) {
          post = new Post(posts[i]);
          if (posts[i + 1]) nextPost = new Post(posts[i + 1]);
          if (posts[i - 1]) lastPost = new Post(posts[i - 1]);
        }
      }

      buildPost(post, nextPost).then(function () {
        return lastPost ? buildPost(lastPost, post) : true;
      }).then(resolve);
    });
  });
}

function publishAll() {
  var blogTasks = [];

  return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    publishedRef.once('value', function (snapshot) {
      var val = snapshot.val();
      if (!val) return new Error('There are no posts to build');
      var posts = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default()(val);

      for (var i = 0; i < posts.length; i += 1) {
        blogTasks.push(publish(posts[i]));
      }

      return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.all(blogTasks).then(resolve).catch(reject);
    });
  });
}

function unpublish(id) {
  return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    database.ref('/posts/' + id).once('value', function (snapshot) {
      var val = snapshot.val();
      if (!val) return new Error('This post is deleted or something');
      var post = new Post(val);
      var filepath = 'public/posts/' + slugger(post.title) + '.html';
      fs.unlink(filepath, function (err) {
        if (err && err.code === 'ENOENT') return resolve();
        if (err) reject(err);
        return resolve();
      });
    });
  });
}

publishedRef.on('child_added', function (snapshot) {
  var post = snapshot.val();
  publish(post.id).then(buildIndex);
});

publishedRef.on('child_removed', function (snapshot) {
  var post = snapshot.val();
  unpublish(post.id).then(buildIndex);
});

publishedRef.on('child_changed', function (snapshot) {
  var post = snapshot.val();
  publish(post.id).then(buildIndex);
});

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var admin = __webpack_require__(25);
var serviceAccount = __webpack_require__(21);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://bolg-d1098.firebaseio.com'
});

/* harmony default export */ __webpack_exports__["default"] = (admin);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_typeof__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_typeof___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_typeof__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slugger", function() { return slugger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logoURL", function() { return logoURL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writefile", function() { return writefile; });



var mkdirp = __webpack_require__(7);
var fs = __webpack_require__(0);
var dirname = __webpack_require__(8).dirname;

var slugger = function slugger(str) {
  return str.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/[^\w ]+/g, ' ').replace(/ +/g, '-');
};

var logoURL = function logoURL() {
  return '/img/bisnaer' + Math.ceil(Math.random() * 31, 10) + '.PNG';
};

var writefile = function writefile(filePath, content) {
  var fileContent = (typeof content === 'undefined' ? 'undefined' : __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_typeof___default()(content)) === 'object' ? __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default()(content) : content;
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    mkdirp(dirname(filePath), function (err) {
      if (err) reject(err);

      fs.writeFile(filePath, fileContent, { encoding: 'utf-8' }, resolve);
    });
  });
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("mkdirp");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var bolg = __webpack_require__(1);

function publishAll(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'localhost');

  bolg.publishAll().then(bolg.buildIndex).then(function () {
    return res.send({ message: 'Rebuild complete.' });
  }).catch(function (err) {
    return res.status(500).send(err);
  });
}

module.exports = publishAll;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var bolg = __webpack_require__(1);

function publish(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'localhost');

  var operation = req.params.id === 'index' ? bolg.buildIndex() : bolg.publish(req.params.id);

  operation.then(bolg.buildIndex).then(function () {
    return res.send({ message: 'Rebuild complete.' });
  }).catch(function (err) {
    return res.status(500).send(err);
  });
}

module.exports = publish;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var bolg = __webpack_require__(1);

function unpublish(req, res) {
  res.setHeader('Acces-Control-Allow-Origin', 'localhost');

  bolg.unpublish(req.params.id).then(bolg.buildIndex).then(function () {
    return res.send({ message: 'Unpublish complete.' });
  }).catch(function (err) {
    return res.status(500).send(err);
  });
}

module.exports = unpublish;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "index", function() { return index; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "post", function() { return post; });
var fs = __webpack_require__(0);
var handlebars = __webpack_require__(26);
var layouts = __webpack_require__(27);

var layout = fs.readFileSync('src/bolg/templates/_layout.hbs', 'utf-8');
var indexTemplate = fs.readFileSync('src/bolg/templates/index.hbs', 'utf-8');
var postTemplate = fs.readFileSync('src/bolg/templates/post.hbs', 'utf-8');

handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('layout', layout);

var index = handlebars.compile(indexTemplate);
var post = handlebars.compile(postTemplate);

/***/ }),
/* 17 */,
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);

var mkdirp = __webpack_require__(7);
var fs = __webpack_require__(0);
var dirname = __webpack_require__(8).dirname;

/* harmony default export */ __webpack_exports__["default"] = (function (filePath, content) {
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    mkdirp(dirname(filePath), function (err) {
      if (err) reject(err);

      fs.writeFile(filePath, content, { encoding: 'utf-8' }, resolve);
    });
  });
});

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var express = __webpack_require__(14);

var logger = __webpack_require__(15);
var cookieParser = __webpack_require__(13);
var bodyParser = __webpack_require__(12);

var app = express();

app.use(express.static('public', { extensions: ['html'] }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/publish', __webpack_require__(9));
app.get('/publish/:id', __webpack_require__(10));
app.get('/unpublish/:id', __webpack_require__(11));

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

/* harmony default export */ __webpack_exports__["default"] = (app);

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = {
	"/app.js": "/js/app.204ae7831d9fca92cf4b.js",
	"/app.js.map": "/js/app.204ae7831d9fca92cf4b.js.map",
	"/bolg.js": "/js/bolg.da212dd57b7cdcebbf1b.js",
	"/bolg.js.map": "/js/bolg.da212dd57b7cdcebbf1b.js.map",
	"/map.js": "/js/map.2ddcbdc4ef55050756f8.js",
	"/map.js.map": "/js/map.2ddcbdc4ef55050756f8.js.map",
	"/post.js": "/js/post.736fd0b0c8b9c9c22ad1.js",
	"/post.js.map": "/js/post.736fd0b0c8b9c9c22ad1.js.map"
};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = {
	"type": "service_account",
	"project_id": "bolg-d1098",
	"private_key_id": "d3bf23bbeeaa1cb5e0baa684015a7f31901de621",
	"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDha1WeIZoWm8cr\njNf2LkLwaAODAozOtDCZUEqruxxNioYEF8lQMbqXo3IMibSJ79OQEJ1VcYQkWr4z\nu3lUtIRyFup5QNQmK2w3wfphbBiFWp29ZslhlADn6Cr1QBOcO5rhJo4w0ak4+jn0\nfqkSiUyHlvW63MjvTiZSZrB8nPGxvPE7rAwyfCjUvmlu8F7HC6rEJQMY7AkYrFJ+\nqczpyNHFZQG1hDYYJQD+7Y95Eo4jW6s0yxnO0z9JvppwAEW6j/7qYUDc3wI15zl7\nXlnIZoaJp+jcGO0V7gP8snGasXOIc64CK9Gn3toL5OLRs6OI1jr6HTY2rG2xbeAB\n91kF4P4TAgMBAAECggEBAKxX3dvKoP6MF1jKlAraD7+yJo0xk+othcKRyqVFpzv5\nnsDeVsIDYz+wbO/9EJUtUTkiGshKw9bvsd/ng7opUeHQd3BBCnIsXM68deuqM40x\nXMyEG4+JErA7pyxe0x9tyto9GhVlFtZDKbAubqGHa4V2+2TkjJO50j7J2EFN1NQn\nyzcrCUI5Y8WZcMcRqiNt3wdE8htJBRCTQGxIYpsILbAaZPlhxSB2jJel+Y4rO+8u\ngyeOIWjy4dhROr6iEwjmP01+IYfgZJdCV0l2L/yHY+75pRwOh8ootffaFPJftCXa\nPRWigS6AXRBmni/iRpJLNwp8MCh7Pw/81ETCzSaTK/ECgYEA+qBuA3Hd1uxRDb95\n+h46a2m/x4Kjm93ecP+cPqVek6H1A48w3nvwFUTvf92LQN/ItaOBRHecdksI9YfO\nwitqUwPPSq0nlklSARsjrDLdqw6+bJj0xx7TNmWIOoXDHRnVQXop/9iwZnRCWXoH\nNAcOnaOmA7w7PWRQNx7Ic+jff/cCgYEA5kCNpKBwBUvGHNmpdVHpDcnQ+mSTPlmc\nY2okYQNhqnYqKlW+u/5yjWulQeljYkKxaH4p0HtAqYbNVcbjPj5DMPR4UZGmQJxD\nEnzAU5Zqo60I/5HF7QE1RJciTVXAuGXHK34BZX1i0ADIgTyc8TcyezsArn6s8qXP\nw5cNFTwRY8UCgYEAoI4l7A8GDqlVQ3lmqtSymB0mvqjyJuf7mGgnr/pAnFMkoyMY\nK286XmXLCB7lFqpF6hbUuQfnM+Dd3G0kBz/I3WWTZkOHGL/fyNWaBLaRSwQm+WsD\nZIxawn5IxzTpybrC4y9fuIcYeon/91I1Sx86PcKYl8v+J1YcDTOrNpX4mAECgYAF\nOlH8+ueQNzg4T3jZgRKZjYuBI+dz8vTqDO7mhP0isawjae76tbxEGb2W0YXAJWOB\ny9uHMEU3lCf1Wp6uOxurcOGKeJQdw26CbPKw8ylYrgUWSGkGCJD9DbFpsBjAFw9+\nnU3K0B3+OwZSaN3nXCl5Qs2xKI8ksz8UYcmaQdLjQQKBgGKpULNoQ6N+ZI5BeoWu\nNrGMyHHGR0ctk+BbxkcO0t+Rl4GJwbHNhOa3pmbCoWRUblss3qiANJb9lmDAUYCI\n6gCEprbuQag7r8pd2K9tJhlRmSR0oD7zIqq/AYN4fypI9ci2XSWznsPQOtt6Auqk\nqCTBXnCU2IYGq9MCXuofEtpy\n-----END PRIVATE KEY-----\n",
	"client_email": "firebase-adminsdk-gdl5q@bolg-d1098.iam.gserviceaccount.com",
	"client_id": "116513601220065783123",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://accounts.google.com/o/oauth2/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-gdl5q%40bolg-d1098.iam.gserviceaccount.com"
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/keys");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/typeof");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("cuid");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("firebase-admin");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("handlebars");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("handlebars-layouts");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("marked");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return liveRootUrl; });
/* unused harmony export states */
/* unused harmony export mapsAPIKey */
/* unused harmony export reverseGeocode */
/* unused harmony export sizes */


var liveRootUrl = 'https://bolg-app.herokuapp.com/posts/';

var states = {
  LOADING: 0,
  EDITING: 1,
  SAVED: 2,
  ERROR: 3,
  EDITING_OFFLINE: 4,
  SAVED_OFFLINE: 5,
  PUBLISHED: 6
};

var mapsAPIKey = 'AIzaSyBADvjevyMmDkHb_xjjh3FOltkO2Oa8iAQ';

function reverseGeocode(lat, lng) {
  return __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + mapsAPIKey);
}

var sizes = [{
  width: 2560,
  height: 1440
}, {
  width: 1920,
  height: 1080
}, {
  width: 1024,
  height: 576
}, {
  width: 640,
  height: 360
}];

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_firebase__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuefire__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuefire___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_vuefire__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return database; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return auth; });
/* unused harmony export storage */
/* unused harmony export GoogleProvider */
/* unused harmony export FacebookProvider */




var config = {
  apiKey: 'AIzaSyBi6qxewP2GsezDpNuYqkOJPyfR2GuHTYw',
  authDomain: 'bolg-d1098.firebaseapp.com',
  databaseURL: 'https://bolg-d1098.firebaseio.com',
  storageBucket: 'bolg-d1098.appspot.com',
  messagingSenderId: '206693873851'
};

if (__WEBPACK_IMPORTED_MODULE_0_firebase___default.a.apps.length === 0) __WEBPACK_IMPORTED_MODULE_0_firebase___default.a.initializeApp(config);

__WEBPACK_IMPORTED_MODULE_1_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_vuefire___default.a);

/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0_firebase___default.a);
var database = __WEBPACK_IMPORTED_MODULE_0_firebase___default.a.database ? __WEBPACK_IMPORTED_MODULE_0_firebase___default.a.database() : null;
var auth = __WEBPACK_IMPORTED_MODULE_0_firebase___default.a.auth ? __WEBPACK_IMPORTED_MODULE_0_firebase___default.a.auth() : null;
var storage = __WEBPACK_IMPORTED_MODULE_0_firebase___default.a.storage ? __WEBPACK_IMPORTED_MODULE_0_firebase___default.a.storage() : null;
var GoogleProvider = __WEBPACK_IMPORTED_MODULE_0_firebase___default.a.auth ? new __WEBPACK_IMPORTED_MODULE_0_firebase___default.a.auth.GoogleAuthProvider() : null;
var FacebookProvider = __WEBPACK_IMPORTED_MODULE_0_firebase___default.a.auth ? new __WEBPACK_IMPORTED_MODULE_0_firebase___default.a.auth.FacebookAuthProvider() : null;

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function (str) {
  return str.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/[^\w ]+/g, ' ').replace(/ +/g, '-');
});

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_cuid__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_cuid___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_cuid__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_marked__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_marked___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_marked__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__config_slugger__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__config_constants__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__config_firebase__ = __webpack_require__(31);
/* harmony export (immutable) */ __webpack_exports__["default"] = Post;









function Post() {
  var _this = this;

  var post = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this.id = post.id || __WEBPACK_IMPORTED_MODULE_2_cuid___default()();
  this.created = post.created || Date.now();
  this.lastEdited = post.lastEdited || null;
  this.lastSaved = post.lastSaved || null;
  this.lastPublished = post.lastPublished || null;
  this.author = post.author || __WEBPACK_IMPORTED_MODULE_7__config_firebase__["a" /* auth */].currentUser.uid;
  this.markdown = post.markdown || '';
  this.images = post.images || [];

  var ref = __WEBPACK_IMPORTED_MODULE_7__config_firebase__["b" /* database */].ref('/posts/' + this.id);
  var publishRef = __WEBPACK_IMPORTED_MODULE_7__config_firebase__["b" /* database */].ref('/published/' + this.id);

  this.normalize = function () {
    return JSON.parse(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default()(_this));
  };

  this.set = function () {
    _this.lastSaved = Date.now();
    return ref.set(_this.normalize());
  };

  this.remove = function () {
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a.all([publishRef.remove(), ref.remove()]);
  };

  this.publish = function () {
    _this.lastSaved = Date.now();
    _this.lastPublished = Date.now();
    var postToPublish = new Post(_this);
    postToPublish.beautify();

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a.all([ref.set(_this.normalize()), publishRef.set(postToPublish.normalize())]);
  };

  this.unpublish = function () {
    _this.lastPublished = null;
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a.all([_this.set(), publishRef.remove()]);
  };

  this.beautify = function () {
    var mdOptions = { gfm: true, smartypants: true };
    _this.postUrl = _this.url;
    _this.postTitle = _this.title;
    _this.created = __WEBPACK_IMPORTED_MODULE_4_moment___default()(_this.created, 'x').format('DD.MM.YYYY');
    _this.lastEdited = __WEBPACK_IMPORTED_MODULE_4_moment___default()(_this.lastEdited, 'x').format('DD.MM.YYYY');
    _this.lastSaved = __WEBPACK_IMPORTED_MODULE_4_moment___default()(_this.lastSaved, 'x').format('DD.MM.YYYY');
    _this.lastPublished = __WEBPACK_IMPORTED_MODULE_4_moment___default()(_this.lastPublished, 'x').format('DD.MM.YYYY');
    _this.html = __WEBPACK_IMPORTED_MODULE_3_marked___default()(_this.markdown, mdOptions);
    _this.description = __WEBPACK_IMPORTED_MODULE_3_marked___default()(_this.markdown.replace(/#+.+\n/gm, '').split(' ').slice(0, 20).join(' ') + '...', mdOptions);
    _this.excerpt = __WEBPACK_IMPORTED_MODULE_3_marked___default()(_this.markdown.split(' ').slice(0, 40).join(' ') + '...', mdOptions);
    return _this;
  };

  Object.defineProperty(this, 'title', {
    get: function get() {
      var title = this.markdown.match(/^# .+/gm);
      return title ? title[0].replace('# ', '') : '';
    }
  });

  Object.defineProperty(this, 'url', {
    get: function get() {
      var url = '' + __WEBPACK_IMPORTED_MODULE_6__config_constants__["a" /* liveRootUrl */] + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__config_slugger__["a" /* default */])(this.title) + '.html';
      return url || '';
    }
  });
}

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("firebase");

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("vuefire");

/***/ })
/******/ ]);