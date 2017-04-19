const express = require('express');
const bolg = require('../bolg');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// Serve the static files
// app.use(favicon('public', 'favicon.ico'));
app.use(express.static('public', { extensions: ['html'] }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// Listen for rebuild requests
app.get('/rebuild', require('./api/publish-all'));
app.get('/rebuild/:id', require('./api/publish'));
app.get('/unpublish/:id', require('./api/unpublish'));

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

module.exports = app;
