import cuid from 'cuid';
import tinify from 'tinify';
import awsConfig from 'src/config/tinify-aws';
import firebase from 'src/config/firebase-admin';

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
      const cloudFront = `https://d3ieg3cxah9p4i.cloudfront.net/${meta.location.split('/bolg/')[1]}`;
      ref.set(cloudFront);
      publishedRef.set(cloudFront);

      res.send('ok');
    })
    .catch((err) => {
      res.error(err);
    });
}
