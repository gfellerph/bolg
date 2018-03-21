import mime from 'mime-types';

export default {
  extensions: 'html',
  setHeaders: (res, reqpath) => {
    const type = mime.lookup(reqpath);
    const oneweek = 1000 * 60 * 60 * 24 * 7;
    const oneyear = oneweek * 52;

    switch (type) {
      case 'image/png':
      case 'image/jpeg':
      case 'image/svg+xml':
      case 'image/webp':
      case 'image/gif':
        res.setHeader('Cache-Control', `public, max-age=${oneweek}`);
        break;
      case 'text/css':
      case 'text/javascript':
      case 'application/javascript':
        res.setHeader('Cache-Control', `public, max-age=${oneyear}`);
        break;
      default:
        break;
    }
  },
}
