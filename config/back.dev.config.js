const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const backConfig = require('./back.config');
const paths = require('./paths');

// add hot-reload related code to entry chunks
Object.keys(backConfig.entry).forEach((name) => {
  backConfig.entry[name] = ['./build/dev-client'].concat(backConfig.entry[name])
});

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
      filename: 'bolg.html',
      template: paths.backIndex,
      inject: true,
      serviceWorkerLoader: `<script>${fs.readFileSync(paths.serviceWorkerDev, 'utf-8')}</script>`,
    }),
  ],
  devtool: '#cheap-module-eval-source-map',
});

module.exports = devConfig;
