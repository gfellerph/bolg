const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const baseConfig = require('./base.config.js');
const paths = require('./paths');

const devConfig = merge(baseConfig, {
  entry: {
    map: './src/map.js',
    galleryCss: './src/styles/gallery.scss',
    postCss: './src/styles/post.scss',
    overviewCss: './src/styles/overview.scss',
    indexCss: './src/styles/_index.scss',
    post: './src/post.js',
    gallery: './src/gallery.js',
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
  plugins: [
    new CopyWebpackPlugin([
      {
        from: paths.static,
        to: paths.public,
        ignore: ['.*'],
      },
    ]),
    new ManifestPlugin({
      fileName: paths.frontManifest,
      basePath: paths.assets,
    }),
  ],
  stats: 'minimal',
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
});
module.exports = devConfig;
