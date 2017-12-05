/* istanbul ignore next */
window.Promise = window.Promise || require('promise');

// require all tests
var tests = require.context('./', true, /spec\.js$/);
tests.keys().forEach(tests);

// require all src
var src = require.context('../src/', true, /\.js$/);
src.keys().forEach(src);
