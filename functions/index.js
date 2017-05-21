const functions = require('firebase-functions');
const firebase = require('./firebase');
const storage = require('@google-cloud/storage')();
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozJpeg = require('imagemin-mozjpeg');
const sharp = require('sharp');
const sizeOf = require('image-size');

function createThumbnailFileName(fileName, size) {
  let newFileName = '';
  if (fileName.indexOf('.') >= 0) {
    const fragments = fileName.split('.');
    fragments.splice(fragments.length - 1, 0, `${size.width}x${size.height}`);
    newFileName = fragments.join('.');
  } else {
    newFileName = `${fileName}.${size.width}x${size.height}`;
  }
  return newFileName;
}

const slugger = str => str
  .toLowerCase()
  .replace(/ä/g, 'ae')
  .replace(/ö/g, 'oe')
  .replace(/ü/g, 'ue')
  .replace(/[^\w ]+/g, ' ')
  .replace(/ +/g, '-');

// https://github.com/firebase/functions-samples/blob/master/generate-thumbnail/functions/index.js
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/google-cloud/v0.53.0/storage/file
// https://ericportis.com/posts/2014/srcset-sizes/
exports.createThumbnails = functions.storage.object().onChange((event) => {
  const object = event.data;
  const bucket = storage.bucket(object.bucket);
  const file = bucket.file(object.name);
  const tempFileName = object.name.substring(object.name.lastIndexOf('/') + 1);

  const sizes = [
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
    {
      width: 320,
      height: 180,
    },
  ];

  if (object.resourceState === 'not_exists') {
    return console.log('This file has been deleted');
  }

  if (!object.contentType.startsWith('image/')) {
    return console.log('This is not an image', object);
  }

  if (object.name.startsWith('thumbs/') || object.name.indexOf('thumbs') >= 0) {
    return console.log('This is already a thumb');
  }

  if (object.metageneration > 1) {
    return console.log('This is only a meta update');
  }

  console.log('Starting download of ', object);

  // Download the image in question
  return file.download()

  // Minify image with imagemin
  .then(buffers => imagemin.buffer(Buffer.concat(buffers), {
    plugins: [
      imageminMozJpeg(),
      imageminPngquant({ quality: '65-80' }),
    ],
  }))

  .then((buffer) => {
    const imgSize = sizeOf(buffer);
    const thumbSizes = sizes.filter(size => imgSize.width > size.width || imgSize.height > size.height);

    const uploadPromises = thumbSizes.map((size) => {
      console.log('Resizing to ', size);
      return sharp(buffer)
        .resize(size.width)
        .toBuffer()
        .then(thumbBuffer => imagemin.buffer(thumbBuffer, {
          plugins: [
            imageminMozJpeg(),
            imageminPngquant({ quality: '65-80' }),
          ],
        }))
        .then((fileBuffer) => {
          const thumbFile = createThumbnailFileName(`thumbs/${tempFileName}`, size);
          const newBucketFile = bucket.file(thumbFile);
          console.log('Starting upload', thumbFile);
          return newBucketFile
            .save(fileBuffer, {
              metadata: {
                contentType: object.contentType,
              },
              public: true,
              private: false,
              resumable: false,
            })
            .then(() => ({ file: newBucketFile, size }));
        });
    });

    return Promise.all(uploadPromises);
  })

  .then((uploadedThumbnails) => {
    const thumbsObj = {};
    uploadedThumbnails.map((thumb) => {
      thumbsObj[thumb.size.width] = thumb.file.metadata.mediaLink;
    });
    console.log('Medialinks', thumbsObj, object, file);

    // Don't write to DB if the original file does not have an id
    if (!object.metadata.id) return Promise.resolve(true);

    // Save the image and use its name (without path or extension) as id for reference
    const path = object.name.substring(0, object.name.lastIndexOf('/'));
    return firebase.database().ref(`images/${path}/${object.metadata.id}`).set({
      id: object.metadata.id,
      downloadURL: file.metadata.mediaLink,
      thumbnails: thumbsObj,
      lastModified: object.metadata.lastModified,
    });
  })

  .catch((err) => { console.log(err); });
});
