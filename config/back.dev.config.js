const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const backConfig = require('./back.config');

// add hot-reload related code to entry chunks
Object.keys(backConfig.entry).forEach(function (name) {
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
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      serviceWorkerLoader: `<script>${fs.readFileSync(path.join(__dirname,
        './service-worker-dev.js'), 'utf-8')}</script>`
    }),
  ],
  devtool: '#cheap-module-eval-source-map',
});

module.exports = devConfig;
