import cuid from 'cuid';
import tinify from 'tinify';
import awsConfig from '@/config/tinify-aws';
import firebase from '@/config/firebase-admin';

tinify.key = process.env.TINYPNG_API_KEY;

export default function putImages(req, res) {
  const drawingId = cuid();
  const base64Data = req.body.source.split(',')[1].replace(/\s/g, '+');
  const imgBuffer = Buffer.from(base64Data, 'base64');
  const ref = firebase.database().ref(`/posts/${req.body.postid}/drawings/${drawingId}`);
  const publishedRef = firebase.database().ref(`/published/${req.body.postid}/drawings/${drawingId}`);

  tinify
    .fromBuffer(imgBuffer)
    .store(awsConfig(`bolg/drawings/${drawingId}.png`))
    .meta()
    .then((meta) => {
      ref.set(meta.location);
      publishedRef.set(meta.location);
      res.send('ok');
    })
    .catch((err) => {
      throw err;
    });
}
