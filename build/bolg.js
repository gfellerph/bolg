const webpack = require('webpack');
const chalk = require('chalk');
const config = require('./webpack.bolg.dev.conf');

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
