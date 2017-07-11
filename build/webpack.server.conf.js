const path = require('path');
const config = require('../config/server.env');
const nodeExternals = require('webpack-node-externals');

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
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': resolve('src'),
      handlebars: 'handlebars/runtime.js',
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
