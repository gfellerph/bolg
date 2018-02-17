import express from 'express';
import path from 'path';
import compression from 'compression';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import herokuSslRedirect from 'heroku-ssl-redirect';
import multer from 'multer';
import io from 'socket.io';
import mime from 'mime-types';
import publishAllApi from 'src/server/api/publish-all';
import publishApi from 'src/server/api/publish';
import unpublishApi from 'src/server/api/unpublish';
import unsubscribe from 'src/server/api/unsubscribe';
import notifySubscribers from 'src/server/api/notify-subscribers';
import { getTipps, postTipp } from 'src/server/api/tipps';
import putDrawing from 'src/server/api/put-drawing';
import { postSubscriber } from 'src/server/api/subscriber';
import { postImage, deleteImages } from 'src/server/api/images';
import { postSpamReport } from 'src/server/api/spamreport';

const app = express();
const uploader = multer();

// Attach socket io for initialization in bin/www
app.io = io();

// View engine settings
app.set('views', './src/server/views');
app.set('view engine', 'pug');

// Redirect to https
app.use(herokuSslRedirect());

// Gzip all the things
app.use(compression());

// Serve the static files
app.use(favicon(path.resolve('public/favicon.ico')));
app.use(express.static('public', {
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
}));
app.use(bodyParser.json());
// app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/publish', publishAllApi);
app.get('/publish/:id', publishApi);
app.get('/unpublish/:id', unpublishApi);
app.get('/unsubscribe/:id', unsubscribe);
app.get('/notifysubscribers/:id', notifySubscribers);
app.get('/api/tipps', getTipps);
app.post('/api/tipp', postTipp);
app.put('/api/drawing', putDrawing);
app.post('/api/subscriber', postSubscriber);
app.post('/api/images', uploader.single('image'), postImage);
app.post('/api/spamreport', postSpamReport);
app.delete('/api/images/:id', deleteImages);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
