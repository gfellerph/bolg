const functions = require('firebase-functions');
const storage = require('@google-cloud/storage')();
const mkdirp = require('mkdirp-promise');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const sharp = require('sharp');
const sizeOf = require('image-size');
const stream = require('stream');
const imageminMozJpeg = require('imagemin-mozjpeg');

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

  if (object.metageneration > 1) {
    return console.log('This is only a meta update');
  }

  const fileBuffer = [];
  file.createReadStream()
    .on('data', chunk => fileBuffer.push(chunk))
    .on('end', () => {
      imagemin.buffer(Buffer.concat(fileBuffer), {
        plugins: [
          mozjpeg(),
        ]
      })
      .then(minifiedBuffer => {
        const fileSize = sizeOf(minifiedBuffer);
        const thumbSizes = sizes.filter(size => {
          if (fileSize.width >= fileSize.height) {
            size.orientation = 'landscape';
            return fileSize.width < size.width;
          } else {
            size.orientation = 'portrait';
            return fileSize.height < size.height;
          }
        });

        thumbSizes.map(thumbSize => {
          sharp(minifiedBuffer)
            .resize
        })
      })
    });

  return mkdirp(tempFolder)

    // Download the image in question
    .then(() => file.download())

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

      const thumbFile = createThumbnailFileName(`thumbs/${tempFileName}`, size);
      const fileBuffer = sharp(buffer).resize(size.width).toBuffer();
      return bucket.upload(fileBuffer, { destination: thumbFile });
    })))

    .then((val) => {
      console.log('Files uploaded', val);
    })

    .catch((err) => { throw err; });
});
