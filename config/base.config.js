const paths = require('./paths');
const utils = require('../build/utils');
const vueLoaderConfig = require('../build/vue-loader.conf');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const EsLintFriendlyFormatter = require('eslint-friendly-formatter');

module.exports = {
  resolve: {
    extensions: [
      '.js',
      '.vue',
      '.scss',
      '.json',
    ],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      src: paths.src,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: paths.src,
        options: {
          formatter: EsLintFriendlyFormatter,
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
    ],
  },
  plugins: [
    new FriendlyErrorsPlugin(),
  ],
  bail: true,
};
