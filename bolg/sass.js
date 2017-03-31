const sass = require('node-sass');
const writefile = require('./writefile');
const crypto = require('crypto');

module.exports = function () {
  return new Promise(function (resolve, reject) {
    sass.render({
      file: 'src/styles/_post-index.scss',
      sourceMap: true,

    }, function (err, result) {
      if (err) reject(err);
      result.hash = crypto.createHash('md5').update(result.css).digest('hex');
      result.webpath = `/css/bolg.${result.hash}.css`;
      writefile(`public/css/bolg.${result.hash}.css`, result.css).then(() => {
        console.log(result.hash);
        resolve(result);
      });
      if (result.map) writefile('public/css/bolg.css.map', result.map);
    });
  });
};