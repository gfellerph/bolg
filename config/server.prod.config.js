const webpack = require('webpack');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const serverConfig = require('./server.config');

const serverProdConfig = merge(serverConfig, {
  devtool: '#source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: true,
    }),
  ],
});

if (process.env.npm_config_report) {
  serverProdConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerPort: 8887,
  }));
}

module.exports = serverProdConfig;
