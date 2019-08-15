import global from 'global';
import querystringify from 'querystringify';
import extend from 'extend-shallow';

function getRequest(cors) {
  const nav = global.navigator /* istanbul ignore next */ || '';
  /* istanbul ignore next */
  if (cors && global.XDomainRequest && !/MSIE 1/.test(nav.userAgent)) {
    // ie8 && 9
    return new XDomainRequest
  }
  return new XMLHttpRequest
}

function parseResponseData(req) {
  if (req.responseType) {
    return req.response;
  }
  if ((req.getResponseHeader('content-type') /* istanbul ignore next */ || '').indexOf('application/json') !== -1) {
    return JSON.parse(req.responseText);
  }
  return req.responseText;
}

const defaults = {
  url: '',
  method: 'GET',
  cache: true
};

const optionalProperties = ['responseType', 'withCredentials', 'timeout', 'onprogress'];

export default function(opts) {
  return new Promise((resolve, reject) => {
    if (typeof opts === 'string') {
      opts = extend({}, defaults, { url: opts });
    }

    const options = extend({}, defaults, opts);
    const headers = extend({ 'X-RequestedWith': 'XMLHttpRequest' }, options.headers);
    const isGet = options.method.toLowerCase() === 'get';
    const cacheOption = {};
    let data;

    if (isGet) {
      if (!options.cache) {
        cacheOption._ = Date.now();
      }
      data = extend({}, options.data, cacheOption);
    } else {
      data = options.data
    }

    let url = options.url;

    const req = getRequest(options.cors);

    if (isGet && Object.keys(data).length) {
      // serialise data to query string
      const qs = querystringify.stringify(data);
      if (url.indexOf('?') === -1) {
        url = url + '?' + qs;
      } else {
        url = url + '&' + qs;
      }
    }

    req.open(options.method, url, true);

    optionalProperties.forEach(p => {
      if (typeof options[p] !== 'undefined') {
        req[p] = options[p];
      }
    });

    for (const field in headers) {
      req.setRequestHeader(field, headers[field]);
    }

    req.onload = () => {
      const outData = parseResponseData(req);
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
    }
    req.onerror = () => {
      reject({
        data: 'Error',
        status: req.statusText,
        xhr: req
      });
    }
    req.ontimeout = () => {
      reject({
        data: 'Timeout',
        status: req.statusText,
        xhr: req
      });
    }
    req.onabort = () => {
      reject({
        data: 'Abort',
        status: req.statusText,
        xhr: req
      });
    }

    req.send(data)
  });
}
