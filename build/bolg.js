const webpack = require('webpack');
const chalk = require('chalk');
const config = require('./webpack.dev.conf');

config.watch = true;
delete config.entry.app;

webpack(config, (err, stats) => {
  if (err) throw err;

  process.stdout.write(`${stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    hash: false,
    version: false,
  })}\n\n------------\n\n`);
});
