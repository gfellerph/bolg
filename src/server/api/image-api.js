import tinify from 'tinify';
import Image from 'src/models/Image';
import s3 from 'src/config/s3';
import awsConfig from 'src/config/tinify-aws';
import app from 'src/server';
import { cdnPrefix, imageStates } from 'src/config/constants';
import mime from 'mime-types';
import sizeOf from 'image-size';

tinify.key = process.env.TINYPNG_API_KEY;

export const post = async (req, res) => {
  const img = new Image({ shortid: req.body.shortid });
  const key = `i/${req.body.shortid}.${mime.extension(req.file.mimetype)}`;
  const { width, height } = sizeOf(req.file.buffer);
  img.ratio = height / width;
  img.url = cdnPrefix(key);
  img.state = imageStates.PROCESSING;

  // Send an early response to mitigate heroku request timeout limits
  res.send(img);

  // Tinify and resize to max 2560w or 1440h
  tinify
    .fromBuffer(req.file.buffer)
    .resize({
      method: 'fit',
      width: 2560,
      height: 1440,
    })
    .store(awsConfig(`adie.bisnaer.ch/${key}`))
    .meta()
    .then(() => {
      app.io.emit('server:image-processing-finished', req.body.shortid);
    })
    .catch((err) => {
      app.io.emit('server:image-processing-error', {
        shortid: req.body.shortid,
        err,
      });
    });
};

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
