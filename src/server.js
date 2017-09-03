import express from 'express';
import path from 'path';
import compression from 'compression';
import favicon from 'serve-favicon';
import herokuSslRedirect from 'heroku-ssl-redirect';
import publishAllApi from '@/server/api/publish-all';
import publishApi from '@/server/api/publish';
import unpublishApi from '@/server/api/unpublish';
import unsubscribe from '@/server/api/unsubscribe';
import notifySubscribers from '@/server/api/notify-subscribers';

const app = express();

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
}));

// Routes
app.get('/publish', publishAllApi);
app.get('/publish/:id', publishApi);
app.get('/unpublish/:id', unpublishApi);
app.get('/unsubscribe/:id', unsubscribe);
app.get('/notifysubscribers/:id', notifySubscribers);

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

// Initially build all the files
// publishAll().then(buildIndex).then(buildGallery);

export default app;
