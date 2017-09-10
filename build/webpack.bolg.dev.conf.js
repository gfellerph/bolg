let utils = require('./utils')
let webpack = require('webpack')
let config = require('../config')
let path = require('path')
let merge = require('webpack-merge')
let baseWebpackConfig = require('./webpack.base.conf')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
let HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
// add hot-reload related code to entry chunks
delete baseWebpackConfig.entry;

module.exports = merge(baseWebpackConfig, {
  entry: {
    'one-time-mailer': './src/server/templates/one-time-mailer.pug',
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
  },
  resolve: {
    extensions: ['.pug'],
    alias: {
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: ['file-loader?name=[name].html', 'extract-loader', 'html-loader', 'pug-html-loader'],
      },
    ],
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
  ],
  watch: true,
  target: 'web',
})
