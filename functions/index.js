const functions = require('firebase-functions');
const storage = require('@google-cloud/storage')();
const mkdirp = require('mkdirp-promise');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const sharp = require('sharp');
const fs = require('mz/fs');
const sizeOf = require('image-size');
const imageSizeStream = require('image-size-stream');

function createThumbnailFileName(fileName, size) {
  const fragments = fileName.split('.');
  fragments.splice(fragments.length - 1, 0, `${size.width}x${size.height}`);
  return fragments.join('.');
}

// https://github.com/firebase/functions-samples/blob/master/generate-thumbnail/functions/index.js
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/v0.53.0/storage/file
// https://ericportis.com/posts/2014/srcset-sizes/
exports.createThumbnails = functions.storage.object().onChange((event) => {
  const object = event.data;
  const bucket = storage.bucket(object.bucket);
  const file = bucket.file(object.name);
  const tempFolder = '/tmp';
  const tempFileName = object.name.substring(object.name.lastIndexOf('/') + 1);
  const tempFile = `${tempFolder}/${tempFileName}`;
  const sizes = [
    {
      width: 2560,
      height: 1440,
    },
    {
      width: 1920,
      height: 1080,
    },
    {
      width: 1024,
      height: 576,
    },
    {
      width: 640,
      height: 360,
    },
  ];

  if (object.resourceState === 'not_exists') {
    return console.log('This file has been deleted');
  }

  if (!object.contentType.startsWith('image/')) {
    return console.log('This is not an image');
  }

  if (object.name.startsWith('thumbs/')) {
    return console.log('This is already a thumb');
  }

  imagemin(file.createReadStream(), {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({ quality: '65-80' }),
    ],
  })
  .then(stream => {
    imageSizeStream(stream)
      .on('size', (dimensions) => {

      })
  })

  return mkdirp(tempFolder)

    // Download the image in question
    .then(() => file.download({ destination: tempFile }))

    // Read the file as buffer from temp dir
    .then(() => fs.readFile(tempFile))

    // Minify image with imagemin
    .then(buffer => imagemin.buffer(buffer, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({ quality: '65-80' }),
      ],
    }))

    // Create thumbnails with sharp
    .then(buffer => Promise.all(sizes.filter((size) => {
      const imgSize = sizeOf(buffer);
      if (imgSize.width < size.width) return false;

      return sharp(buffer)
        .resize(size.width)
        .toFile(createThumbnailFileName(tempFile, size));
    })))

    // Upload thumbnails back to server
    .then((thumbnails) => Promise.all(sizes.map((dimension) => {
      console.log(thumbnails);
      return bucket.upload(createThumbnailFileName(tempFile, dimension), { destination: createThumbnailFileName(`thumbs/${tempFileName}`, dimension) })
    })))

    .then((val) => {
      console.log('Files uploaded', val);
    })

    .catch((err) => { throw err; });
});
