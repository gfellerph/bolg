import cuid from 'cuid';
import tinify from 'tinify';
import awsConfig from 'src/config/tinify-aws';
import { database } from 'src/config/firebase-admin';
import { cloudFrontify } from 'src/config/constants';

tinify.key = process.env.TINYPNG_API_KEY;

export default function putImages(req, res) {
  const drawingId = cuid();
  const base64Data = req.body.source.split(',')[1].replace(/\s/g, '+');
  const imgBuffer = Buffer.from(base64Data, 'base64');
  const ref = database.ref(`/posts/${req.body.postid}/drawings/${drawingId}`);
  const publishedRef = database.ref(`/published/${req.body.postid}/drawings/${drawingId}`);

  tinify
    .fromBuffer(imgBuffer)
    .store(awsConfig(`bolg/drawings/${drawingId}.png`))
    .meta()
    .then((meta) => {
      const cloudFront = cloudFrontify(meta.location.split('/bolg/')[1]);
      ref.set(cloudFront);
      publishedRef.set(cloudFront);

      res.send('ok');
    })
    .catch((err) => {
      res.error(err);
    });
}
