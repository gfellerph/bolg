import tinify from 'tinify';
import Image from 'src/models/Image';
import s3 from 'src/config/s3';
import { cdnPrefix, imageStates } from 'src/config/constants';
import mime from 'mime-types';
import sharp from 'sharp';
import imagemin from 'imagemin';
import mozJpeg from 'imagemin-mozjpeg';
import pngQuant from 'imagemin-pngquant';
import svgo from 'imagemin-svgo';
import gifsicle from 'imagemin-gifsicle';

tinify.key = process.env.TINYPNG_API_KEY;

const resize = buffer => sharp(buffer)
  .resize({
    width: 2560,
    height: 1440,
    fit: 'inside',
  })
  .rotate()
  .toBuffer();

const minify = buffer => imagemin.buffer(buffer, {
  plugins: [
    mozJpeg(),
    pngQuant(),
    svgo(),
    gifsicle(),
  ],
});

const getMetadata = buffer => sharp(buffer).metadata();

const uploadToS3 = (Key, Body, ContentType) => s3.putObject({
  Bucket: 'adie.bisnaer.ch',
  Key,
  Body,
  ContentType,
  CacheControl: 'public, max-age=31536000',
})
  .promise();

export const post = async (req, res) => {
  const img = new Image({ shortid: req.body.shortid });
  const key = `i/${req.body.shortid}.${mime.extension(req.file.mimetype)}`;

  try {
    const resizedBuffer = await resize(req.file.buffer);
    const minifiedBuffer = await minify(resizedBuffer);
    const metadata = await getMetadata(minifiedBuffer);
    await uploadToS3(key, minifiedBuffer, req.file.mimetype);

    img.ratio = metadata.height / metadata.width;
    img.url = cdnPrefix(key);
    img.state = imageStates.DONE;
    img.progress = 100;

    res.send(img);
  } catch (err) {
    res.next(err);
  }
}

export const getImage = (req, res) => {
  res.send('TODO: implement this');
};

export const remove = (req, res, next) => {
  const { url } = req.body;
  const Key = url.split('adie.bisnaer.ch/')[1];
  return s3.deleteObject({
    Bucket: 'adie.bisnaer.ch',
    Key,
  }).promise()
    .then(() => res.send('OK'))
    .catch(err => next(err));
}
