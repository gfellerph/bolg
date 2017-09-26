const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const frontConfig = require('./front.config');

const devConfig = merge(frontConfig, {
  output: {
    filename: 'js/[name].js',
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      allChunks: true,
    }),
  ],
  watch: true,
});

module.exports = devConfig;
