(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.ajax = factory());
}(this, function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

	var has = Object.prototype.hasOwnProperty
	  , undef;

	/**
	 * Decode a URI encoded string.
	 *
	 * @param {String} input The URI encoded string.
	 * @returns {String|Null} The decoded string.
	 * @api private
	 */
	function decode(input) {
	  try {
	    return decodeURIComponent(input.replace(/\+/g, ' '));
	  } catch (e) {
	    return null;
	  }
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

	  while (part = parser.exec(query)) {
	    var key = decode(part[1])
	      , value = decode(part[2]);

	    //
	    // Prevent overriding of existing properties. This ensures that build-in
	    // methods like `toString` or __proto__ are not overriden by malicious
	    // querystrings.
	    //
	    // In the case if failed decoding, we want to omit the key/value pairs
	    // from the result.
	    //
	    if (key === null || value === null || key in result) continue;
	    result[key] = value;
	  }

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

	  var pairs = []
	    , value
	    , key;

	  //
	  // Optionally prefix with a '?' if needed
	  //
	  if ('string' !== typeof prefix) prefix = '?';

	  for (key in obj) {
	    if (has.call(obj, key)) {
	      value = obj[key];

	      //
	      // Edge cases where we actually want to encode the value to an empty
	      // string instead of the stringified value.
	      //
	      if (!value && (value === null || value === undef || isNaN(value))) {
	        value = '';
	      }

	      key = encodeURIComponent(key);
	      value = encodeURIComponent(value);

	      //
	      // If we failed to encode the strings, we should bail out as we don't
	      // want to add invalid strings to the query.
	      //
	      if (key === null || value === null) continue;
	      pairs.push(key +'='+ value);
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

	/*!
	 * assign-symbols <https://github.com/jonschlinkert/assign-symbols>
	 *
	 * Copyright (c) 2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */

	var assignSymbols = function(receiver, objects) {
	  if (receiver === null || typeof receiver === 'undefined') {
	    throw new TypeError('expected first argument to be an object.');
	  }

	  if (typeof objects === 'undefined' || typeof Symbol === 'undefined') {
	    return receiver;
	  }

	  if (typeof Object.getOwnPropertySymbols !== 'function') {
	    return receiver;
	  }

	  var isEnumerable = Object.prototype.propertyIsEnumerable;
	  var target = Object(receiver);
	  var len = arguments.length, i = 0;

	  while (++i < len) {
	    var provider = Object(arguments[i]);
	    var names = Object.getOwnPropertySymbols(provider);

	    for (var j = 0; j < names.length; j++) {
	      var key = names[j];

	      if (isEnumerable.call(provider, key)) {
	        target[key] = provider[key];
	      }
	    }
	  }
	  return target;
	};

	var extendShallow = Object.assign || function(obj/*, objects*/) {
	  if (obj === null || typeof obj === 'undefined') {
	    throw new TypeError('Cannot convert undefined or null to object');
	  }
	  if (!isObject(obj)) {
	    obj = {};
	  }
	  for (var i = 1; i < arguments.length; i++) {
	    var val = arguments[i];
	    if (isString(val)) {
	      val = toObject(val);
	    }
	    if (isObject(val)) {
	      assign(obj, val);
	      assignSymbols(obj, val);
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

	function isString(val) {
	  return (val && typeof val === 'string');
	}

	function toObject(str) {
	  var obj = {};
	  for (var i in str) {
	    obj[i] = str[i];
	  }
	  return obj;
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
	  var nav = window_1.navigator
	  /* istanbul ignore next */
	  || '';
	  /* istanbul ignore next */

	  if (cors && window_1.XDomainRequest && !/MSIE 1/.test(nav.userAgent)) {
	    // ie8 && 9
	    return new XDomainRequest();
	  }

	  return new XMLHttpRequest();
	}

	function parseResponseData(req) {
	  if (req.responseType) {
	    return req.response;
	  }

	  if ((req.getResponseHeader('content-type')
	  /* istanbul ignore next */
	  || '').indexOf('application/json') !== -1) {
	    return JSON.parse(req.responseText);
	  }

	  return req.responseText;
	}

	var defaults = {
	  url: '',
	  method: 'GET',
	  cache: true
	};
	var optionalProperties = ['responseType', 'withCredentials', 'timeout', 'onprogress'];
	function ajax (opts) {
	  return new Promise(function (resolve, reject) {
	    if (typeof opts === 'string') {
	      opts = extendShallow({}, defaults, {
	        url: opts
	      });
	    }

	    var options = extendShallow({}, defaults, opts);
	    var headers = extendShallow({
	      'X-RequestedWith': 'XMLHttpRequest'
	    }, options.headers);
	    var isGet = options.method.toLowerCase() === 'get';
	    var cacheOption = {};
	    var data;

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
	    optionalProperties.forEach(function (p) {
	      if (typeof options[p] !== 'undefined') {
	        req[p] = options[p];
	      }
	    });

	    for (var field in headers) {
	      req.setRequestHeader(field, headers[field]);
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
	}

	return ajax;

}));
