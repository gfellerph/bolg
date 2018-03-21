import tinify from 'tinify';
import sharp from 'sharp';
import Image from 'src/models/Image';
import s3 from 'src/config/s3';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozJpeg from 'imagemin-mozjpeg';
import sizeOf from 'image-size';
import awsConfig from 'src/config/tinify-aws';
import app from 'src/server';
import { cdnPrefix, sizes, imageStates } from 'src/config/constants';

// Function to resize an image based on a sharp object and a size
const resizer = (sharpImage, size) => sharpImage
  .resize(size.width, size.height)
  .min()
  .toBuffer()
  .catch((err) => { throw err; })

// Minify an image based on a buffer
const minifier = buffer => imagemin.buffer(buffer, {
  plugins: [
    imageminMozJpeg(),
    imageminPngquant({ quality: '65-80' }),
  ],
});

// Filter the sizes collection based on image size
const filterSizes = imageSize => sizes
  .filter(size => imageSize.width > size.width || imageSize.height > size.height);

// Promise wrapper for s3 upload to bolg bucket
const uploader = (Body, Key) => new Promise((resolve, reject) => {
  s3.putObject({
    Bucket: 'bolg',
    Key,
    Body,
  }, (err, info) => {
    if (err) return reject(err);
    return resolve(info);
  });
});

export const postImage = (req, res) => {
  const originalSize = sizeOf(req.file.buffer);
  const desiredSize = {
    width: Math.min(originalSize.width, 2560),
    height: Math.min(originalSize.height, 1440),
  };
  const filteredSizes = filterSizes(desiredSize);
  const img = new Image({ id: req.body.id });

  img.downloadURL = cdnPrefix(`i/${req.body.id}`);
  img.thumbnails = filteredSizes.reduce((acc, size) => {
    acc[size.width] = cdnPrefix(`i/${req.body.id}.${size.width}`);
    return acc;
  }, {});
  img.state = imageStates.PROCESSING;

  // Send an early response to mitigate heroku request timeout limits
  res.send(img);

  // Tinify and resize to max 2560w or 1440h
  const source = tinify
    .fromBuffer(req.file.buffer)
    .resize({
      method: 'fit',
      width: 2560,
      height: 1440,
    });

  // Upload original to s3
  const originalUploader = source
    .store(awsConfig(`bolg/i/${req.body.id}`))
    .meta();

  // Store tinified original as buffer
  const thumbnailUploader = source.toBuffer()
    .then((buffer) => {
      const sharpBuffer = sharp(buffer);
      return filteredSizes.map(thumbnailSize => resizer(sharpBuffer, thumbnailSize)
        .then(thumbnail => minifier(thumbnail))
        .then(thumbnail => uploader(thumbnail, `i/${req.body.id}.${thumbnailSize.width}`)))
    })
    .then(promises => Promise.all(promises))

  // Wait for all uploads to finish
  return Promise.all([
    originalUploader,
    thumbnailUploader,
  ])
    .then(() => {
      app.io.emit('server:image-processing-finished', req.body.id);
    })
    .catch((err) => {
      app.io.emit('server:image-processing-error', {
        id: req.body.id,
        err,
      });
    });
};

export const getImage = (req, res) => {
  res.send('TODO: implement this');
};

export const deleteImages = (req, res) => {
  const { id } = req.params;
  const objs = sizes.map(size => ({ Key: `i/${id}.${size.width}` }));
  objs.push({ Key: `i/${id}` });
  s3.deleteObjects({
    Bucket: 'bolg',
    Delete: {
      Objects: objs,
    },
  }, (err, data) => {
    if (err) throw err;
    res.send(data);
  });
}
