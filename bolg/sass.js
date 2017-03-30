const sass = require('node-sass');
const writefile = require('./writefile');
const crypto = require('crypto');

export default new Promise(function (resolve, reject) {
  sass.render({
    file: 'src/styles/_post-index.scss',
    sourceMap: true,

  }, function (err, result) {
    if (err) reject(err);
    writefile('public/css/bolg.css', result.css).then(() => {
      resolve(result);
    });
    if (result.map) writefile('public/css/bolg.css.map', result.map);
  });
});