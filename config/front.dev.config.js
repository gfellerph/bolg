const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./base.config');
const frontConfig = require('./front.config');

const devConfig = merge(baseConfig, frontConfig, {
  output: {
    filename: '[name].js',
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '/css/[name].css',
      allChunks: true,
    }),
  ],
  watch: true,
  devtool: '#cheap-module-eval-source-map',
});

module.exports = devConfig;
