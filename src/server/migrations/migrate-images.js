/* eslint-disale */
import request from 'request';
import s3 from 'src/config/s3';
import Post from 'src/models/PostModel';

/* eslint no-extend-native:0 */
String.prototype.replaceAll = function replaceAll(search, replacement) {
  const target = this;
  return target.split(search).join(replacement);
};

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
    return thenable.then((value) => {
      values.push(value);
      return i === arr.length - 1 ? curr().then(v => values.push(v)) : curr();
    })
  })
}

async function getAllImages() {
  const posts = await Post.find({});
  const images = posts.reduce((imgs, post) => [...imgs, ...post.images]);
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
      return resolve({
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
    Key: `googleoriginals/${name}`,
    ContentType: contenttype,
  }).promise();
}

export const renameImagesOnS3 = async (req, res, next) => {
  const images = await getAllImages();
  const copyFns = images
    .filter(image => image.url.indexOf('googleapis') >= 0)
    .map((image) => {
      const fns = image.thumbnails
        .filter(thumb => thumb.url.indexOf('googleapis') >= 0)
        .map((thumbnail) => {
          const fn = async () => {
            const { headers } = await getImage(image.url);
            const contentType = headers['content-type'];
            const extension = types[contentType];
            const newKey = `i/${image.shortid}.${thumbnail.size}.${extension}`;
            const newUrl = `https://adie.bisnaer.ch/${newKey}`;
            console.log(newKey);
            thumbnail.url = newUrl;
            const newThumb = thumbnail.save();
            const copyPromise = s3.copyObject({
              Bucket: 'adie.bisnaer.ch',
              CopySource: `adie.bisnaer.ch/google/${thumbnail.shortid}.${thumbnail.size}.${extension}`,
              Key: newKey,
            }).promise();

            return Promise.all([newThumb, copyPromise]);
          }
          return fn;
        })

      fns.push(async () => {
        const { headers } = await getImage(image.url);
        const contentType = headers['content-type'];
        const extension = types[contentType];
        const newKey = `i/${image.shortid}.${extension}`;
        const newUrl = `https://adie.bisnaer.ch/${newKey}`;
        console.log(newKey);
        image.url = newUrl;
        const newImg = image.save();
        const copyPromise = s3.copyObject({
          Bucket: 'adie.bisnaer.ch',
          CopySource: `adie.bisnaer.ch/googleoriginals/${image.shortid}.${extension}`,
          Key: newKey,
        }).promise();

        return Promise.all([newImg, copyPromise]);
      });
      return fns;
    })
    .reduce((acc, curr) => [...acc, ...curr], []);

  console.log('Starting queue', copyFns.length);
  queue(copyFns).then(() => console.log('Finished processing')).then(() => res.send('OK')).catch(err => next(err));
}

/* export const renameimagesintext = async (req, res) => {
  const posts = await Post.find({});
  const newPosts = posts.map(async (post) => {
    for(let i = 0; i < post.images.length; i++) {
      const image = post.images[i];
      const { headers } = await getImage(image.url);
      const newUrl = `https://adie.bisnaer.ch/i/${image.shortid}.${types[headers['content-type']]}`;
    }
  })
} */

export const renametitleimages = (req, res) => {
  Post.find({})
    .then((posts) => {
      const newPosts = posts
        .map((post) => {
          if (!post.titleImage) return post;
          const thumbs = post.images
            .reduce((acc, image) => [...acc, ...image.thumbnails], [])
            .filter(thumb => thumb.name === post.titleImage.name
              && thumb.size === post.titleImage.size);

          if (thumbs.length !== 1) return post;
          [post.titleImage] = thumbs;
          return post;
        })

      res.json(newPosts);
    })
}

export const migrateorigs = (req, res, next) => {
  getAllImages()
    .then((images) => {
      let uploadCount = 0;
      let totalCount = 0;
      if (!images) {
        return next(new Error('Kener Biuder'));
      }
      const imgFns = images
        .filter(image => image.url.indexOf('googleapis.com/v0/b/bolg') >= 0)
        .map((image) => {
          const fn = async () => {
            console.log('Starting download of ', image.url);
            const { body, headers } = await getImage(image.url);
            console.log('Download complete, starting upload');
            await putImage(body, `${image.shortid}.${types[headers['content-type']]}`, headers['content-type']);
            uploadCount++;
            console.log(`Upload complete, ${totalCount - uploadCount} remaining`);
          }
          return fn;
        });

      totalCount = imgFns.length;
      console.log(`Starting upload of ${imgFns.length} images`);
      return queue(imgFns)
        .then(() => console.log('All images uploaded'))
        .catch(err => console.log(err));
    })
}

export const migratethumbs = (req, res) => {
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
          const fn = async () => {
            console.log('Starting download of ', thumb.url);
            const { body, headers } = await getImage(thumb.url);
            console.log('Download complete, starting upload');
            await putImage(body, `${thumb.shortid}.${thumb.size}.${types[headers['content-type']]}`, headers['content-type']);
            uploadCount++;
            console.log(`Upload complete, ${totalCount - uploadCount} remaining`);
          }
          return fn;
        });

      totalCount = thumbFns.length;
      console.log(`Starting upload of ${thumbFns.length} images`);
      return queue(thumbFns)
        .then(() => console.log('All images uploaded'))
        .catch(err => console.log(err));
    });
}

export const post = (req, res) => {
  res.send('TODO');
}
