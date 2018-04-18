const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./base.config.js');
const paths = require('./paths');

const serverConfig = merge(baseConfig, {
  entry: {
    server: './src/server.js',
  },
  output: {
    path: paths.server,
    filename: '[name].js',
    publicPath: paths.assets,
    libraryTarget: 'commonjs',
    library: '',
  },
  externals: [nodeExternals()],
  plugins: [
    new CopyWebpackPlugin([
      {
        from: paths.views,
        to: paths.viewsDestination,
        ignore: ['.*'],
      },
    ]),
  ],
  target: 'node',
  stats: 'minimal',
});
module.exports = serverConfig;
