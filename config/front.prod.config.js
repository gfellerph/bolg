const merge = require('webpack-merge');
const webpack = require('webpack');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const frontConfig = require('./front.config');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const prodConfig = merge(frontConfig, {
  output: {
    filename: 'js/[name].[chunkhash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].[chunkhash].css',
      allChunks: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
      parallel: true,
    }),
    new OptimizeCSSPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
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
  prodConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerPort: 8889,
  }))
}

module.exports = prodConfig;
