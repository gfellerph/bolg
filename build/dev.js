const webpack = require('webpack');
const chalk = require('chalk');
const nodemon = require('nodemon');
const frontConfig = require('../config/front.dev.config');
const serverConfig = require('../config/server.dev.config');
const backConfig = require('../config/back.dev.config');
const dotenv = require('dotenv');
const rm = require('rimraf');
const paths = require('../config/paths');

/* eslint no-console: 0 */

dotenv.load();
process.env.NODE_ENV = 'development';

const rmPub = new Promise((resolve, reject) => {
  rm(paths.public, (err) => {
    if (err) return reject(err);
    return resolve();
  });
});
const rmServer = new Promise((resolve, reject) => {
  rm(paths.server, (err) => {
    if (err) return reject(err);
    return resolve();
  });
});

const startServer = () => {
  let serverBuilt = false;
  webpack(serverConfig, (err) => {
    if (err) console.error(err);

    if (serverBuilt) {
      nodemon.emit('restart');
    } else {
      serverBuilt = true;

      nodemon({
        script: 'bin/www',
        ext: 'hbs',
        watch: ['src/server/templates'],
        ignore: ['node_modules/**', '*.js'],
      });

      nodemon.on('restart', () => {
        console.log(`${chalk.cyan('Express server restarted')}\n\n------------\n`);
      });
    }
  });
}

rmPub
  .then(rmServer)
  .then(() => {
    let frontBuilt = false;
    webpack(frontConfig, (err) => {
      if (err) console.log(err);

      if (!frontBuilt) {
        frontBuilt = true;
        startServer();
      }
    });
    webpack(backConfig, (err) => {
      if (err) console.log(err);
    });
  })
  .catch((err) => {
    console.log(err);
  });
