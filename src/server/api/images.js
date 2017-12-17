import tinify from 'tinify';
import sharp from 'sharp';
import Image from 'src/models/Image';
import s3 from 'src/config/s3';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozJpeg from 'imagemin-mozjpeg';
import sizeOf from 'image-size';
import awsConfig from 'src/config/tinify-aws';
import { cloudFrontify, sizes } from 'src/config/constants';

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
    .meta()
    .then(() => `i/${req.body.id}`)
    .catch((err) => { throw err; });

  // Store tinified original as buffer
  const thumbnailUploader = source.toBuffer()
    .then((buffer) => {
      // Get resolution of the image
      const filteredSizes = filterSizes(sizeOf(buffer));
      const sharpBuffer = sharp(buffer);
      return filteredSizes.map(thumbnailSize => resizer(sharpBuffer, thumbnailSize)
        .then(thumbnail => minifier(thumbnail))
        .then(thumbnail => uploader(thumbnail, `i/${req.body.id}.${thumbnailSize.width}`))
        .then(() => ({
          width: thumbnailSize.width,
          path: `i/${req.body.id}.${thumbnailSize.width}`,
        }))
        .catch((err) => { throw err; }))
    })
    .then(promises => Promise.all(promises))
    .catch((err) => { throw err; })

  // Wait for all uploads to finish
  return Promise.all([
    originalUploader,
    thumbnailUploader,
  ])
    .then((paths) => {
      const img = new Image({ id: req.body.id });
      const [downloadUrl, thumbnails] = paths;
      img.downloadURL = cloudFrontify(downloadUrl);
      img.thumbnails = thumbnails.reduce((acc, thumbnail) => {
        acc[thumbnail.width] = cloudFrontify(thumbnail.path);
        return acc;
      }, {});
      res.send(img);
    })
    .catch((err) => {
      throw new Error(err);
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
