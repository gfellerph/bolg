const merge = require('webpack-merge');
const serverConfig = require('./server.config');

const serverDevConfig = merge(serverConfig, {
  watch: true,
});

module.exports = serverDevConfig;
