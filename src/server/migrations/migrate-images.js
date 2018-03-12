/* eslint-disable */
import request from 'request';
import s3 from 'src/config/s3';
import Post from 'src/models/PostModel';

const types = {
  'image/gif': 'gif',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
}

async function queue(functions) {
  const values = [];
  await functions.reduce((prev, curr, i, arr) => {
    const thenable = i === 1 ? prev() : prev;
    return thenable.then(value => {
      values.push(value);
      return i === arr.length - 1 ? curr().then(value => values.push(value)) : curr();
    })
  })
}

async function getAllImages() {
  const posts = await Post.find({});
  const images = posts.reduce((images, post) => [...images, ...post.images]);
  return images;
}

async function getAllThumbnails() {
  const images = await getAllImages();
  return images.reduce((thumbnails, image) => [...thumbnails, ...image.thumbnails]);
}

function getImage(url) {
  return new Promise((resolve, reject) => {
    request({ uri: url, encoding: null }, (err, imgres, body) => {
      if (err) return reject(err);
      resolve({
        headers: imgres.headers,
        body,
      });
    });
  });
}

function putImage(body, name, contenttype) {
  return s3.putObject({
    Body: body,
    Bucket: 'adie.bisnaer.ch',
    Key: `google/${name}`,
    ContentType: contenttype,
  }).promise();
}

export const migratethumbs = (req, res, next) => {
  getAllThumbnails()
    .then((thumbnails) => {
      let uploadCount = 0;
      let totalCount = 0;
      if (!thumbnails) {
        return res.send(thumbnails);
      }
      const thumbFns = thumbnails
        .filter(thumb => thumb.url.indexOf('googleapis.com/download/storage/v1/b/bolg') >= 0)
        .map((thumb) => {
          return async () => {
            console.log('Starting download of ', thumb.url);
            const { body, headers } = await getImage(thumb.url);
            console.log('Download complete, starting upload');
            const putResult = await putImage(body, `${thumb.shortid}.${thumb.size}.${types[headers['content-type']]}`, headers['content-type']);
            uploadCount++;
            console.log(`Upload complete, ${totalCount - uploadCount} remaining`);
          }
        });

      totalCount = thumbFns.length;
      console.log(`Starting upload of ${thumbFns.length} images`);
      queue(thumbFns)
        .then(() => console.log('All images uploaded'))
        .catch(err => console.log(err));
    });
}

export const post = (req, res) => {
  res.send('TODO');
}
