import fs from 'fs';

export default path => new Promise((resolve, reject) => {
  fs.unlink(path, (err) => {
    if (err && err.code === 'ENOENT') return resolve();
    if (err) reject(err);
    return resolve();
  });
});
