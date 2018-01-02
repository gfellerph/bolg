import Busboy from 'busboy';
import tinify from 'tinify';

tinify.key = process.env.TINYPNG_API_KEY;

export default function putImages(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  busboy.on('file', (fieldname, file) => {
    const accumulator = [];
    file.on('data', accumulator.push);
    file.on('end', () => {
      tinify
        .fromBuffer(Buffer.concat(accumulator))
        .toBuffer((tinifyErr) => {
          if (tinifyErr) throw tinifyErr;
        });
    });
  });

  busboy.on('finish', () => {
    res.send('ok');
  });

  return req.pipe(busboy);
}
