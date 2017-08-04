const mkdirp = require('mkdirp');
const fs = require('fs');
const dirname = require('path').dirname;

// Create "this-is-a-post" from "This is a Post"
export const slugger = str => str
  .toLowerCase()
  .replace(/ä/g, 'ae')
  .replace(/ö/g, 'oe')
  .replace(/ü/g, 'ue')
  .replace(/[^\w ]+/g, ' ')
  .replace(/ +/g, '-');

// Random logo
export const logoURL = () => `/img/bisnaer${Math.ceil(Math.random() * 30, 10) + 1}.PNG`;

/**
 * Safely write a file to disk
 * @returns {Promise} File written promise
 */
export const writefile = (filePath, content) => {
  const fileContent = (typeof content === 'object') ? JSON.stringify(content) : content;
  return new Promise((resolve, reject) => {
    mkdirp(dirname(filePath), (err) => {
      if (err) reject(err);

      fs.writeFile(filePath, fileContent, { encoding: 'utf-8' }, resolve);
    });
  });
};
