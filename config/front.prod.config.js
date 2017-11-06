const merge = require('webpack-merge');
const webpack = require('webpack');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const frontConfig = require('./front.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devConfig = merge(frontConfig, {
  output: {
    filename: 'js/[name].[chunkhash].js',
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].[chunkhash].css',
      allChunks: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
    }),
    new OptimizeCSSPlugin(),
  ],
  devtool: '#source-map',
});

if (process.env.npm_config_report) {
  devConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerPort: 8889,
  }))
}

module.exports = devConfig;
