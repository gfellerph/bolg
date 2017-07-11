const path = require('path');
const config = require('../config/server.env');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  entry: {
    server: './src/server.js',
  },
  output: {
    path: config.server.assetsRoot,
    filename: '[name].js',
    publicPath: config.server.assetsPublicPath,
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
      },
    ],
  },
  target: 'node',
};
