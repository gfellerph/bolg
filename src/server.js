import express from 'express';
import logger from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import publishAllApi from '@/server/api/publish-all';
import publishApi from '@/server/api/publish';
import unpublishApi from '@/server/api/unpublish';
import { publishAll, buildIndex, buildGallery } from '@/server/index';

const app = express();

// Serve the static files
// app.use(favicon('public', 'favicon.ico'));
app.use(express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// Listen for rebuild requests
app.get('/publish', publishAllApi);
app.get('/publish/:id', publishApi);
app.get('/unpublish/:id', unpublishApi);

// Custom routes
app.get('/galerie', (req, res) => res.sendFile('/public/gallery.html', { root: process.cwd() }));
app.get('/bolg', (req, res) => res.sendFile('/public/bolg.html', { root: process.cwd() }));

// catch 404 and forward to error handler
// TODO: Find a way to manage errors
/* app.use((req, res, next) => {
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
}); */
publishAll().then(buildIndex).then(buildGallery);

export default app;
