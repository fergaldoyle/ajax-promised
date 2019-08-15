const fakeXhr = sinon.useFakeXMLHttpRequest();
let response;
fakeXhr.onCreate = (xhr) => {
  setTimeout(() => {
    if (Array.isArray(response)) {
      xhr.respond(...response)
    } else {
      xhr[response.fn]();
    }
  }, 1);
}

describe('ajax', () => {

  it('should default to a GET request', async () => {
    response = [200, { 'Content-Type': 'text/plain' }, 'test'];
    const { data, xhr } = await ajax({
      url: '/path',
    });
    expect(data).to.be.equal('test');
    expect(xhr.method).to.be.equal('GET');
  });

  it('should perform a POST request', async () => {
    response = [200, { 'Content-Type': 'text/plain' }, 'test'];
    const { data, xhr } = await ajax({
      url: '/path',
      method: 'POST'
    });
    expect(data).to.be.equal('test');
    expect(xhr.method).to.be.equal('POST');
  });

  it('should default to a GET request if arg is a string', async () => {
    response = [200, { 'Content-Type': 'text/plain' }, 'test'];
    const { data } = await ajax('/path');
    expect(data).to.be.equal('test');
  });

  it('should automatically parse JSON response', async () => {
    response = [200, { 'Content-Type': 'application/json' }, '[{ "id": 12, "comment": "Hey there" }]'];
    const { data } = await ajax({
      url: '/path',
    });
    expect(typeof data).to.be.equal('object');
  });

  it('should handle responseType', async () => {
    response = [200, { 'Content-Type': 'text/plain' }, 'test'];
    const { data } = await ajax({
      url: '/path',
      responseType: 'arraybuffer'
    });
    expect(data instanceof ArrayBuffer).to.be.true;
  });

  it('should use timestamp when cache option is false', async () => {
    response = [200, { 'Content-Type': 'text/plain' }, 'test'];
    const { xhr } = await ajax({
      url: '/path',
      cache: false
    })
    expect(xhr.url.match(/\?_=\d*/)).to.be.ok;
  });

  it('should convert object to query string and handle existing query string', async () => {
    response = [200, { 'Content-Type': 'text/plain' }, 'test'];
    const { xhr } = await ajax({
      url: '/path',
      data: {
        key: 'value',
        key2: 'value2'
      }
    });
    expect(xhr.url).to.be.equal('/path?key=value&key2=value2');

    const { xhr: xhr2 } = await ajax({
      url: '/path?a=b',
      data: {
        key: 'value'
      }
    });
    expect(xhr2.url).to.be.equal('/path?a=b&key=value');
  });

  it('should handle none ok responses', async () => {
    response = [400, { 'Content-Type': 'text/plain' }, 'Bad request'];
    const { status } = await ajax({
      url: '/path',
    }).catch(d => d);
    expect(status).to.be.equal('Bad Request');
  });

  it('should handle onerror', async () => {
    response = { fn: 'error' };
    const { data } = await ajax({
      url: '/path',
    }).catch(d => d);
    expect(data).to.be.equal('Error');
  });

  it('should handle ontimeout', async () => {
    response = { fn: 'ontimeout' };
    const { data } = await ajax({
      url: '/path',
    }).catch(d => d);
    expect(data).to.be.equal('Timeout');
  });

  it('should handle onabort', async () => {
    response = { fn: 'onabort' };
    const { data } = await ajax({
      url: '/path',
    }).catch(d => d);
    expect(data).to.be.equal('Abort');
  });

  it('should handle public options', async () => {
    response = [200, { 'Content-Type': 'text/plain' }, 'test'];
    const { xhr } = await ajax({
      url: 'endpoint/path',
      headers: { 'accept': 'application/json;odata=verbose' },
      data: { key: 'value' },
      method: 'POST',
      responseType: 'blob',
      withCredentials: true,
      timeout: 100,
      onprogress() {}
    });

    expect(xhr.url).to.be.equal('endpoint/path');
    expect(xhr.requestHeaders.accept).to.be.equal('application/json;odata=verbose');
    expect(xhr.requestBody.key).to.be.equal('value');
    expect(xhr.method).to.be.equal('POST');
    expect(xhr.responseType).to.be.equal('blob');
    expect(xhr.withCredentials).to.be.true;
    expect(xhr.timeout).to.be.equal(100);
    expect(xhr.onprogress).to.be.ok;
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
