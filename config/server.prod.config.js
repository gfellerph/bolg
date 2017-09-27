const webpack = require('webpack');
const merge = require('webpack-merge');
const serverConfig = require('./server.config');

const serverDevConfig = merge(serverConfig, {
  devtool: '#source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
    }),
  ],
});

module.exports = serverDevConfig;
