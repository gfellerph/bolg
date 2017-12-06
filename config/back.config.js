const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./base.config.js');
const paths = require('./paths');

const backConfig = merge(baseConfig, {
  entry: {
    app: './src/main.js',
  },
  output: {
    path: paths.public,
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
  target: 'web',
  stats: 'minimal',
});
module.exports = backConfig;
