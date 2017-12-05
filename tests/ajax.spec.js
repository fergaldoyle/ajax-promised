import ajax from '../src/ajax.js';

const fakeXhr = sinon.useFakeXMLHttpRequest();
const requests = [];
fakeXhr.onCreate = function(xhr) {
  requests.push(xhr);
}

function respond() {
  const request = requests.shift();
  request.respond(...arguments);
  return request;
}

describe('ajax', function() {

  it('should default to a GET request', function() {
    const p = ajax({
      url: '/path',
    }).then(({ data, status, xhr }) => {
      expect(data).to.be.equal('test');
      expect(xhr.method).to.be.equal('GET');
    });

    respond(200, { 'Content-Type': 'text/plain' }, 'test');

    return p;
  });

  it('should perform a POST request', function() {
    const p = ajax({
      url: '/path',
      method: 'POST'
    }).then(({ data, status, xhr }) => {
      expect(data).to.be.equal('test');
      expect(xhr.method).to.be.equal('POST');
    });

    respond(200, { 'Content-Type': 'text/plain' }, 'test');

    return p;
  });

  it('should default to a GET request if arg is a string', function() {
    const p = ajax('/path').then(({ data, status, xhr }) => {
      expect(data).to.be.equal('test');
    });

    respond(200, { 'Content-Type': 'text/plain' }, 'test');

    return p;
  });

  it('should automatically parse JSON response', function() {
    const p = ajax({
      url: '/path',
    }).then(({ data, status, xhr }) => {
      expect(typeof data).to.be.equal('object');
    });

    respond(200, { 'Content-Type': 'application/json' }, '[{ "id": 12, "comment": "Hey there" }]');

    return p;
  });


  it('should handle responseType', function() {
    const p = ajax({
      url: '/path',
      responseType: 'arraybuffer'
    }).then(({ data, status, xhr }) => {
      expect(data instanceof ArrayBuffer).to.be.true;
    });

    respond(200, { 'Content-Type': 'text/plain' }, 'test');

    return p;
  });

  it('should use timestamp when cache option is false', function() {
    const p = ajax({
      url: '/path',
      cache: false
    }).then(({ data, status, xhr }) => {
      expect(xhr.url.match(/\?_=\d*/)).to.be.ok;
    });

    respond(200, { 'Content-Type': 'text/plain' }, 'test');

    return p;
  });

  it('should convert object to query string and handle existing query string', function() {
    const p1 = ajax({
      url: '/path',
      data: {
        key: 'value',
        key2: 'value2'
      }
    }).then(({ data, status, xhr }) => {
      expect(xhr.url).to.be.equal('/path?key=value&key2=value2');
    });
    respond(200, { 'Content-Type': 'text/plain' }, 'test');

    const p2 = ajax({
      url: '/path?a=b',
      data: {
        key: 'value'
      }
    }).then(({ data, status, xhr }) => {
      expect(xhr.url).to.be.equal('/path?a=b&key=value');
    });
    respond(200, { 'Content-Type': 'text/plain' }, 'test');

    return Promise.all([p1, p2]);
  });


  it('should handle onerror', function() {
    const p = ajax({
      url: '/path',
    }).catch(({ data, status, xhr }) => {
      expect(data).to.be.equal('Error');
    });

    requests.shift().error();

    return p;
  });


  it('should handle none ok responses', function() {
    const p = ajax({
      url: '/path',
    }).catch(({ data, status, xhr }) => {
      expect(status).to.be.equal('Bad Request');
    });

    respond(400, { 'Content-Type': 'text/plain' }, 'Bad request');

    return p;
  });

  it('should handle ontimeout and onabort', function() {
    const p1 = ajax({
      url: '/path',
    }).catch(() => {});
    requests.shift().ontimeout();

    const p2 = ajax({
      url: '/path',
    }).catch(() => {});
    requests.shift().onabort();

    return Promise.all([p1, p2]);
  });

  it('should handle public options', function() {
    const p = ajax({
      url: 'endpoint/path',
      headers: { 'accept': 'application/json;odata=verbose' },
      data: { key: 'value' },
      method: 'POST',
      responseType: 'blob',
      withCredentials: true,
      timeout: 100,
      onprogress () { }
    }).then(({ data, status, xhr }) => {
      expect(xhr.url).to.be.equal('endpoint/path');
      expect(xhr.requestHeaders.accept).to.be.equal('application/json;odata=verbose');
      expect(xhr.requestBody.key).to.be.equal('value');
      expect(xhr.method).to.be.equal('POST');
      expect(xhr.responseType).to.be.equal('blob');
      expect(xhr.withCredentials).to.be.true;
      expect(xhr.timeout).to.be.equal(100);
      expect(xhr.onprogress).to.be.ok;
    });

    respond(200, { 'Content-Type': 'text/plain' }, 'test');

    return p;
  });

});

/*
{
  100: 'Continue',
  101: 'Switching Protocols',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  300: 'Multiple Choice',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Satisfiable',
  417: 'Expectation Failed',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported'
}
*/
