const merge = require('webpack-merge');
const webpack = require('webpack');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const baseConfig = require('./base.config');
const frontConfig = require('./front.config');
const paths = require('./paths');

const devConfig = merge(baseConfig, frontConfig, {
  output: {
    filename: '[name].[chunkhash].js',
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '/css/[name].[chunkhash].css',
      allChunks: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
    }),
    new OptimizeCSSPlugin(),
    new ManifestPlugin({
      fileName: paths.manifest,
      basePath: paths.assets,
    }),
  ],
  devtool: '#source-map',
});

module.exports = devConfig;
