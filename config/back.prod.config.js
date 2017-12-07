const fs = require('fs');
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJS = require('uglify-es');
const backConfig = require('./back.config');
const paths = require('./paths');
const utils = require('./utils');

const sw = UglifyJS.minify(fs.readFileSync(path.join(
  __dirname,
  './service-worker-prod.js',
), 'utf-8'));

const prodConfig = merge(backConfig, {
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
    new webpack.DefinePlugin({
      'process.env': '"production"',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'bolg.html',
      template: paths.backIndex,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
      testABC: 'test',
      serviceWorkerLoader: `<script>${sw.code}</script>`,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // any required modules inside node_modules are extracted to vendor
      minChunks: module => (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
      ),
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor'],
    }),
    // service worker caching
    new SWPrecacheWebpackPlugin({
      cacheId: 'bolg',
      filename: 'service-worker.js',
      staticFileGlobs: ['public/**/*.{js,html,css,png,PNG,svg,SVG}'],
      minify: true,
      stripPrefix: 'public/',
    }),
    // gzip compression
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(css|js)$'),
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  devtool: '#source-map',
});

if (process.env.npm_config_report) {
  prodConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = prodConfig;
