const paths = require('./paths');
const utils = require('../build/utils');
const vueLoaderConfig = require('../build/vue-loader.conf');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.scss'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': paths.src,
    },
  },
  externals: {
    firebase: 'firebase',
  },
  module: {
    rules: [
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
};
