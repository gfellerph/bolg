import tinify from 'tinify';
import Image from 'src/models/Image';
import s3 from 'src/config/s3';
import awsConfig from 'src/config/tinify-aws';
import { cloudFrontify, sizes } from 'src/config/constants';

export const postImage = (req, res) => {
  const source = tinify.fromBuffer(req.file.buffer);

  const original = source
    .store(awsConfig(`bolg/images/${req.body.id}`))
    .meta()
    .then((meta) => {
      const cloudFrontLink = cloudFrontify(meta.location.split('/bolg/')[1]);
      const img = new Image();
      delete img.id;
      img.downloadURL = cloudFrontLink;
      return img;
    })
    .catch((err) => {
      res.error(err);
    });

  const thumbs = Promise.all(sizes.map(size => source.resize({
    width: size.width,
  })
    .store(awsConfig(`bolg/thumbnails/${req.body.id}.${size.width}`))
    .meta()
    .then((thumbMeta) => {
      const thumbLocation = {};
      thumbLocation[size.width] = cloudFrontify(thumbMeta.location.split('/bolg/')[1]);
      return thumbLocation;
    })))
    .then(thumbsMeta => thumbsMeta.reduce((acc, thumbMeta) => Object.assign(acc, thumbMeta), {}));

  Promise.all([
    original,
    thumbs,
  ])
    .then((metas) => {
      const [image, thumbnails] = metas;
      image.thumbnails = thumbnails;
      res.send(image);
    })
    .catch((err) => {
      res.err(err);
    })
};

export const getImage = (req, res) => {
  res.send('TODO: implement this');
};

export const deleteImages = (req, res) => {
  const { id } = req.params;
  const objs = sizes.map(size => ({ Key: `thumbnails/${id}.${size.width}` }));
  objs.push({ Key: `images/${id}` });
  const deleter = s3.deleteObjects({
    Bucket: 'bolg',
    Delete: {
      Objects: objs,
    },
  });
  deleter.on('error', (err) => {
    throw err;
  });
  deleter.on('end', data => res.send(data));
}
