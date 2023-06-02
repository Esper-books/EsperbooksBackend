const path = require('path');

module.exports = {
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'esperbook_bundle.js',
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
       "timers": require.resolve("timers-browserify"),
       os: false,
       async_hooks: require.resolve('async_hooks'),
       http: require.resolve('stream-http'),
       zlib: require.resolve('browserify-zlib'),
       "https": false,
       "constants": false 
    }
  },


  


};