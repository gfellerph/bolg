const merge = require('webpack-merge');
const webpack = require('webpack');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const backConfig = require('./back.config');
const utils = require('../build/utils');

const devConfig = merge(backConfig, {
  output: {
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[id].[chunkhash].js',
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: '#source-map',
      extract: true,
    }),
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].[chunkhash].css',
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
      },
    }),
  ],
  devtool: '#source-map',
  chunksSortMode: 'dependency',
});

module.exports = devConfig;
