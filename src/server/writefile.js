const mkdirp = require('mkdirp');
const fs = require('fs');
const dirname = require('path').dirname;

export default function (filePath, content) {
  return new Promise((resolve, reject) => {
    mkdirp(dirname(filePath), (err) => {
      if (err) reject(err);

      fs.writeFile(filePath, content, { encoding: 'utf-8' }, resolve);
    });
  });
}
