const mkdirp = require('mkdirp');
const fs = require('fs');
const dirname = require('path').dirname;

// Create "this-is-a-post" from "This is a Post"
exports.slugger = str => str.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

// Random logo
exports.logoURL = () => `/img/bisnaer${parseInt(Math.random() * 31, 10)}.PNG`;

/**
 * Safely write a file to disk
 * @returns {Promise} File written promise
 */
exports.writefile = (filePath, content) => {
  const fileContent = (typeof content === 'object') ? JSON.stringify(content) : content;
  return new Promise((resolve, reject) => {
    mkdirp(dirname(filePath), (err) => {
      if (err) reject(err);

      fs.writeFile(filePath, fileContent, { encoding: 'utf-8' }, resolve);
    });
  });
};
