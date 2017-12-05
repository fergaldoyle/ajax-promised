(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ajax = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof commonjsGlobal !== "undefined") {
    win = commonjsGlobal;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

var window_1 = win;

var has = Object.prototype.hasOwnProperty;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String} The decoded string.
 * @api private
 */
function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  //
  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
  // the lastIndex property so we can continue executing this loop until we've
  // parsed all results.
  //
  for (;
    part = parser.exec(query);
    result[decode(part[1])] = decode(part[2])
  );

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
var stringify = querystringify;
var parse = querystring;

var querystringify_1 = {
	stringify: stringify,
	parse: parse
};

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

function isObjectObject(o) {
  return isobject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

var isPlainObject = function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

var isExtendable = function isExtendable(val) {
  return isPlainObject(val) || typeof val === 'function' || Array.isArray(val);
};

var extendShallow = Object.assign || function(obj/*, objects*/) {
  if (obj === null || typeof obj === 'undefined') {
    throw new TypeError('expected an object');
  }
  for (var i = 1; i < arguments.length; i++) {
    var val = arguments[i];
    if (isObject(val)) {
      assign(obj, val);
    }
  }
  return obj;
};

function assign(a, b) {
  for (var key in b) {
    if (hasOwn(b, key)) {
      a[key] = b[key];
    }
  }
}

function isObject(val) {
  return (val && typeof val === 'object') || isExtendable(val);
}

/**
 * Returns true if the given `key` is an own property of `obj`.
 */

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function getRequest(cors) {
  var nav = window_1.navigator /* istanbul ignore next */ || '';
  /* istanbul ignore next */
  if (cors && window_1.XDomainRequest && !/MSIE 1/.test(nav.userAgent)) {
    // ie8 && 9
    return new XDomainRequest();
  }
  return new XMLHttpRequest();
}

var defaults = {
  url: '',
  headers: {},
  data: {},
  method: 'GET',
  cache: true
};

var optionalProperties = ['responseType', 'withCredentials', 'timeout', 'onprogress'];

function parseResponseData(req) {
  if (req.responseType) {
    return req.response;
  }
  if ((req.getResponseHeader('content-type') /* istanbul ignore next */ || '').indexOf('application/json') !== -1) {
    return JSON.parse(req.responseText);
  }
  return req.responseText;
}

var ajax = function (opts) {
  return new Promise(function (resolve, reject) {
    if (typeof opts === 'string') {
      opts = extendShallow({}, defaults, { url: opts });
    }

    var options = extendShallow({}, defaults, opts);
    var headers = extendShallow({ 'X-RequestedWith': 'XMLHttpRequest' }, options.headers);
    var isGet = options.method.toLowerCase() === 'get';
    var cacheOption = {};
    var data = void 0;

    if (isGet) {
      if (!options.cache) {
        cacheOption._ = Date.now();
      }
      data = extendShallow({}, options.data, cacheOption);
    } else {
      data = options.data;
    }

    var url = options.url;

    var req = getRequest(options.cors);

    if (isGet && Object.keys(data).length) {
      // serialise data to query string
      var qs = querystringify_1.stringify(data);
      if (url.indexOf('?') === -1) {
        url = url + '?' + qs;
      } else {
        url = url + '&' + qs;
      }
    }

    req.open(options.method, url, true);

    for (var i = 0, len = optionalProperties.length; i < len; i++) {
      var field = optionalProperties[i];
      if (typeof options[field] !== 'undefined') {
        req[field] = options[field];
      }
    }

    for (var _field in headers) {
      req.setRequestHeader(_field, headers[_field]);
    }

    req.onload = function () {
      var outData = parseResponseData(req);
      if (req.status >= 200 && req.status < 300) {
        resolve({
          data: outData,
          status: 'Success',
          xhr: req
        });
      } else {
        reject({
          data: outData,
          status: req.statusText,
          xhr: req
        });
      }
    };
    req.onerror = function () {
      reject({
        data: 'Error',
        status: req.statusText,
        xhr: req
      });
    };
    req.ontimeout = function () {
      reject({
        data: 'Timeout',
        status: req.statusText,
        xhr: req
      });
    };
    req.onabort = function () {
      reject({
        data: 'Abort',
        status: req.statusText,
        xhr: req
      });
    };

    req.send(data);
  });
};

return ajax;

})));
