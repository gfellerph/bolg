import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import publishAll from '@/server/api/publish-all';
import publish from '@/server/api/publish';
import unpublish from '@/server/api/unpublish';

const app = express();

// Serve the static files
// app.use(favicon('public', 'favicon.ico'));
app.use(express.static('public', { extensions: ['html'] }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// Listen for rebuild requests
app.get('/publish', publishAll);
app.get('/publish/:id', publish);
app.get('/unpublish/:id', unpublish);

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
