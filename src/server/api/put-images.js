import cuid from 'cuid';
import Busboy from 'busboy';
import tinify from 'tinify';
import { sizes } from '@/config/constants';

tinify.key = process.env.TINYPNG_API_KEY;

export default function putImages(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  busboy.on('file', (fieldname, file) => {
    const accumulator = [];
    file.on('data', accumulator.push);
    file.on('end', () => {
      tinify
        .fromBuffer(Buffer.concat(accumulator))
        .toBuffer((tinifyErr, data) => {
          if (tinifyErr) throw tinifyErr;
          console.log(data.length);
        });
    });
  });

  busboy.on('finish', () => {
    console.log('Busboy has finished');
    res.send('ok');
  });

  return req.pipe(busboy);
}