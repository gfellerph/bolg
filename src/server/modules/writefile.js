const mkdirp = require('mkdirp');
const fs = require('fs');
const { dirname } = require('path');

/**
 * Writefile with auto folders and promises
 * @param {String} filePath Path to the file
 * @param {String} content File content (utf-8)
 * @returns {Promise}
 */
export default function (filePath, content) {
  return new Promise((resolve, reject) => {
    mkdirp(dirname(filePath), (err) => {
      if (err) reject(err);

      fs.writeFile(filePath, content, { encoding: 'utf-8' }, resolve);
    });
  });
}
