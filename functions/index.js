const functions = require('firebase-functions');
const storage = require('@google-cloud/storage')();
const mkdirp = require('mkdirp-promise');
const spawn = require('child-process-promise').spawn;

function createThumbnailFileName(fileName, size) {
  const fragments = fileName.split('.');
  fragments.splice(fragments.length - 1, 0, `${size.width}x${size.height}`);
  return fragments.join('.');
}

// https://github.com/firebase/functions-samples/blob/master/generate-thumbnail/functions/index.js
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

  return mkdirp(tempFolder)
    .then(() => file.download({ destination: tempFile }))

    // Create a thumbnail for every size object in sizes, wait until
    // all of them are generated
    .then(() => Promise.all(sizes.map(dimension => spawn('convert', [
      tempFile,
      '-thumbnail',
      `${dimension.width}x${dimension.height}>`,
      createThumbnailFileName(tempFile, dimension),
    ]))))

    .then(() => Promise.all(sizes.map((dimension) => {
      return bucket.upload(createThumbnailFileName(tempFile, dimension), { destination: createThumbnailFileName('thumbs/' + tempFileName, dimension) });
    })))

    .then(() => {
      console.log('Files uploaded');
    })

    .catch((err) => { throw err; });
});
