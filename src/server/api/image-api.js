import tinify from 'tinify';
import Image from 'src/models/Image';
import s3 from 'src/config/s3';
import awsConfig from 'src/config/tinify-aws';
import app from 'src/server';
import { cdnPrefix, sizes, imageStates } from 'src/config/constants';

tinify.key = process.env.TINYPNG_API_KEY;

export const post = async (req, res) => {
  const img = new Image({ id: req.body.id });

  img.url = cdnPrefix(`i/${req.body.id}`);
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
  await source
    .store(awsConfig(`adie.bisnaer.ch/i/${req.body.id}`))
    .meta()
    .catch((err) => {
      app.io.emit('server:image-processing-error', {
        id: req.body.id,
        err,
      });
    });

  app.io.emit('server:image-processing-finished', req.body.id);
};

export const getImage = (req, res) => {
  res.send('TODO: implement this');
};

export const remove = (req, res, next) => {
  const { id } = req.params;
  const objs = sizes.map(size => ({ Key: `i/${id}.${size.width}` }));
  objs.push({ Key: `i/${id}` });
  s3.deleteObjects({
    Bucket: 'adie.bisnaer.ch',
    Delete: {
      Objects: objs,
    },
  }, (err, data) => {
    if (err) return next(err);
    return res.send(data);
  });
}
