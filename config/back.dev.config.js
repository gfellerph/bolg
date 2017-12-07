const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const backConfig = require('./back.config');
const paths = require('./paths');

const devConfig = merge(backConfig, {
  output: {
    filename: 'js/[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': '"development"',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: paths.backIndex,
      inject: true,
    }),
  ],
  devtool: '#cheap-module-eval-source-map',
});

module.exports = devConfig;
