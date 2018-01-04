import cuid from 'cuid';
import tinify from 'tinify';
import { database } from 'src/config/firebase-admin';
import { cloudFrontify } from 'src/config/constants';
import writefile from 'src/server/writefile';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import s3 from 'src/config/s3';

tinify.key = process.env.TINYPNG_API_KEY;

export default function putImages(req, res) {
  const drawingId = cuid();
  const base64Data = req.body.source.split(',')[1].replace(/\s/g, '+');
  const imgBuffer = Buffer.from(base64Data, 'base64');
  const ref = database.ref(`/posts/${req.body.postid}/drawings/${drawingId}`);
  const publishedRef = database.ref(`/published/${req.body.postid}/drawings/${drawingId}`);
  const awsLocation = `drawings/${drawingId}.png`;

  imagemin.buffer(imgBuffer, {
    pulugins: [
      imageminPngquant({ quality: '65-80' }),
    ],
  })
    /* eslint arrow-body-style:0 */
    .then((drawing) => {
      return new Promise((resolve, reject) => {
        s3.putobject({
          Bucket: 'bolg',
          Key: awsLocation,
          Body: drawing,
        }, (err, info) => {
          if (err) return reject(err);
          return resolve(info);
        });
      });
    })
    .then(() => {
      const cloudFront = cloudFrontify(awsLocation);
      ref.set(cloudFront);
      publishedRef.set(cloudFront);

      res.send('ok');
    })
    .catch((err) => {
      writefile(`temp/${req.body.postid}.${drawingId}.png`, imgBuffer);
      res.status(500);
      res.send(`Isch leider nid gange: ${err.message}`);
    })

  /* tinify
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
      writefile(`temp/${req.body.postid}.${drawingId}.png`, imgBuffer);
      res.error(`Isch leider nid gange: ${err.message}`);
    }); */
}
