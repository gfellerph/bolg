const webpack = require('webpack');
const chalk = require('chalk');
const nodemon = require('nodemon');
const frontConfig = require('../config/front.dev.config');
const serverConfig = require('../config/server.dev.config');
const dotenv = require('dotenv');
const rm = require('rimraf');
const paths = require('../config/paths');

dotenv.load();

process.env.NODE_ENV = 'development';

const rmPub = new Promise((resolve, reject) => {
  rm(paths.public, (err) => {
    if (err) return reject(err);
    resolve();
  });
});
const rmServer = new Promise((resolve, reject) => {
  rm(paths.server, (err) => {
    if (err) return reject(err);
    resolve();
  });
});

const startServer = function () {
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
  const wat = webpack(frontConfig, (err, stats) => {
    if (err) console.log(err);

    if (!frontBuilt) {
      frontBuilt = true;
      startServer();
    }
  });
})
.catch((err) => {
  console.log(err);
});
