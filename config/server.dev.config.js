const merge = require('webpack-merge');
const serverConfig = require('./server.config');

const serverDevConfig = merge(serverConfig, {
  watch: true,
  devtool: '#cheap-module-eval-source-map',
});

module.exports = serverDevConfig;
