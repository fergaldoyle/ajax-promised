# ajax-promised

Simple ajax utility which returns a Promise. Automatically parses JSON response if response is `application/json`. Serializes an Object of key/value pairs for easy query string creation in GET requests. 
Checks HTTP status codes and `rejects` unsuccessful requests for easy error handling. 

Both `resolve` and `reject` recieve an Object containing:
```javascript
{ 
  data, // The response data. Could be a String, Object, ArrayBuffer, Blob, Document
  status, // statusText, e.g. 'Success'
  xhr // XMLHttpRequest object
}
```

Example usage:
```javascript
import ajax from 'ajax-promised';

// simple GET
ajax({
  url: '/api/users'
}).then(({ data, status, xhr }) => {
  console.log('data', data);
  console.log('status', status);
  console.log('xhr', xhr);
});



// When function argument is a string, it will act like the above GET
ajax('/api/users').then(({ data }) => {
  // use data
});



// *** The below examples use async/await syntax and assume each snippets is inside an async function ***

// POST JSON to an API
const { data } = await ajax({
  url: '/api/users',
  method: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  data: JSON.stringify({
    name: 'morpheus',
    job: 'leader'
  })
});
// const data will be: { name: 'morpheus', job: 'leader', id: 517, createdAt: '2019-08-15T18:41:22.185Z' }



// DELETE
const { status } = await ajax({
  url: '/api/users/2',
  method: 'DELETE'
});
// const status will be: 'Success'



// in a GET request, the data object will be serialized into a query string
ajax({
  url: '/path',
  data: {
    key: 'value',
    key2: 'value2'
  }
});
// requested url will be '/path?key=value&key2=value2'



// Binary
const { data } = await ajax({
  url: '/path',
  responseType: 'arraybuffer'
});
// (data instanceof ArrayBuffer) === true



// All options (and defaults) that can be passed into the ajax function
{
  url: '',
  method: 'GET',
  cache: true, // if set to false, a cache busting timestamp will be added to the request url
  
  // below options have no default values
  headers, // Object - e.g. { 'accept': 'application/json;odata=verbose' }
  data, // POST data or GET query string object
  responseType, // String - e.g. 'blob', 'arraybuffer', etc. see MDN XMLHttpRequest.responseType
  withCredentials, // see MDN XMLHttpRequest.withCredentials
  timeout, // see MDN XMLHttpRequest.timeout
  onprogress // see MDN XMLHttpRequestEventTarget.onprogress
}
```
