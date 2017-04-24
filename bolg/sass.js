const sass = require('node-sass');
const writefile = require('./writefile');
const crypto = require('crypto');
const manifest = require('./config/webpack.manifest.json');

module.exports = function compileSass() {
  return new Promise((resolve, reject) => {
    sass.render({
      file: 'src/styles/_post-index.scss',
      sourceMap: true,

    }, (err, result) => {
      if (err) reject(err);
      const r = result;
      r.hash = crypto.createHash('md5').update(result.css).digest('hex');
      r.webpath = `/css/bolg.${result.hash}.css`;
      manifest['/bolg.css'] = r.webpath;
      console.log(JSON.stringify(manifest));
      writefile('bolg/config/webpack.manifest.json', JSON.stringify(manifest));
      writefile(`public/css/bolg.${result.hash}.css`, result.css).then(() => {
        resolve(r);
      });
      if (result.map) writefile('public/css/bolg.css.map', result.map);
    });
  });
};
