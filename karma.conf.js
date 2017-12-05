var webpack = {
  devtool: 'inline-source-map',
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }]
    }, {
      test: /\.js$|\.jsx$/,
      use: {
        loader: 'istanbul-instrumenter-loader',
        options: { esModules: true }
      },
      enforce: 'post',
      exclude: /node_modules|\.spec\.js$/,
    }]
  }
}

module.exports = function(config) {
  config.set({
    watch: true,
    frameworks: ['mocha', 'sinon-chai'],
    files: [
      'tests/context.js'
    ],
    preprocessors: {
      'tests/context.js': 'webpack',
    },
    webpack: webpack,
    reporters: ['progress', 'coverage-istanbul'],
    //browsers: ['PhantomJS'],
    browsers: ['Chrome'],
    client: {
    //  captureConsole: false
    },
    coverageIstanbulReporter: {
      dir: 'coverage',
      reports: ['html', 'text-summary'],
      fixWebpackSourcePaths: true
    }
  });
};
