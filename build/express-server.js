const webpack = require('webpack');
const nodemon = require('nodemon');
const config = require('./webpack.server.conf');
const chalk = require('chalk');

nodemon({
  script: 'bin/www',
  ext: 'hbs',
  watch: ['src/server/templates'],
  ignore: ['node_modules/**', '*.js'],
});

nodemon.on('restart', () => {
  console.log(`${chalk.cyan('Express server restarted')}\n\n------------\n`);
})

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
