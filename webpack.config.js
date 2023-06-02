const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'esperbook_bundle.js',
  },
  resolve: {
    fallback: {
      "crypto": false,
       "timers": false,
       os: false,
       async_hooks: false,
       http: false,
       zlib: false,
       "https": false,
       "constants": false 
    }
  },


  


};

const webpackConfig = {
  // Your existing Webpack configuration options...
  
  // Add the stats.errorDetails option
  stats: {
    errorDetails: true,
  },
};

webpack(webpackConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    // Handle errors here
    console.error(stats.toString());
  }
  // Handle successful compilation
  console.log(stats.toString());
});