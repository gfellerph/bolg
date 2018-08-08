import s3 from 'src/config/s3';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import Post from 'src/models/PostModel';
import Image from 'src/models/ImageModel';
import { cdnPrefix } from 'src/config/constants';
import { nextPost } from 'src/server/modules/queries';
import { buildPost } from 'src/server/modules/build';

export const get = (req, res, next) => {
  next(new Error('TODO'));
}

export const post = async (req, res, next) => {
  const { buffer } = req.file;
  const drawing = new Image();
  const Key = `d/${drawing.shortid}.png`;
  drawing.url = cdnPrefix(Key);
  drawing.name = drawing.shortid;

  // Minify the new drawing
  const tinyBuffer = await imagemin.buffer(buffer, {
    pulugins: [
      imageminPngquant({ quality: '30-50' }),
    ],
  });

  // Store it on s3
  const upload = s3.putObject({
    Bucket: 'adie.bisnaer.ch',
    Key,
    Body: tinyBuffer,
    ContentType: 'image/png',
    CacheControl: 'public, max-age=31536000',
  }).promise();

  // Update the post
  const update = Post.findOneAndUpdate({
    _id: req.body.postid,
  }, {
    $push: {
      drawings: drawing,
    },
  }, {
    new: true,
  });

  // When upload complete and saved to db, send response
  const [, updatedPost] = await Promise.all([upload, update])
    .catch(err => next(err));
  res.json(updatedPost);

  // Rebuild post after sending response
  buildPost(updatedPost, await nextPost(updatedPost.postDate))
    /* eslint no-console: 0 */
    .catch(err => console.log(`buildPost err: ${err}`))
}

export const remove = async (req, res, next) => {
  const { postid, drawingshortid } = req.params;
  const Key = `d/${drawingshortid}.png`;

  const deleteDrawing = s3.deleteObject({
    Bucket: 'adie.bisnaer.ch',
    Key,
  }).promise();

  const updatePost = Post.findOneAndUpdate({
    _id: postid,
  }, {
    $pull: {
      drawings: { shortid: drawingshortid },
    },
  }, {
    new: true,
  });

  const [, updatedPost] = await Promise.all([deleteDrawing, updatePost])
    .catch(err => next(err));
  res.json(updatedPost);

  buildPost(updatedPost, await nextPost(updatedPost.postDate));
}
