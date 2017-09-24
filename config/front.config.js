const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const baseConfig = require('./base.config.js');
const paths = require('./paths');

const devConfig = merge(baseConfig, {
  entry: {
    map: './src/map.js',
    bolg: './src/styles/post-index.scss',
    post: './src/post.js',
    gallery: './src/gallery.js',
  },
  output: {
    path: paths.public,
    filename: '[name].js',
    publicPath: paths.assets,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ use: 'css-loader?importLoaders=1' }),
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader',
        }),
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: paths.static,
        to: paths.public,
        ignore: ['.*'],
      },
    ]),
    new FriendlyErrorsPlugin(),
  ],
  target: 'web',
  stats: 'minimal',
});
module.exports = devConfig;
