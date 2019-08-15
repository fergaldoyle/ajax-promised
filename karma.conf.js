module.exports = function(config) {
  config.set({
    watch: true,
    frameworks: ['mocha', 'sinon-chai'],
    files: [
      'tests/ajax-promised-bundled.js',
      'tests/ajax.spec.js'
    ],
    reporters: ['progress', 'coverage-istanbul'],
    browsers: ['Chrome'],
    client: {
      // captureConsole: false
    },
    coverageIstanbulReporter: {
      dir: 'coverage',
      reports: ['html', 'text-summary']
    }
  });
};
