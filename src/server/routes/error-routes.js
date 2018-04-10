import { Router } from 'express';
import webpackManifest from 'src/server/modules/webpack-manifest';
import { logoURL } from 'src/config/constants';

const router = Router();

const stringifyError = (err, filter, space) => {
  const plainObject = {};
  Object.getOwnPropertyNames(err).forEach((key) => {
    plainObject[key] = err[key];
  });
  return JSON.stringify(plainObject, filter, space);
};

// catch 404 and forward to error handler
router.use((req, res, next) => {
  // No error so far, this is the last route,
  // so it must be a 404
  const err = new Error('Not Found');
  res.status = 404;

  // If html is acceptable, render a page
  if (req.accepts('html')) {
    res.render('404', { webpack: webpackManifest(), logoURL: logoURL() });
    return;
  }

  // Send json if accepted
  if (req.accepts('json')) {
    res.json(stringifyError(err, null, '\t'));
    return;
  }

  // Else send this error
  next(err);
});

// error handler
router.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') !== 'production' ? err : { message: err.message };
  res.status(err.status || 500);

  if (req.accepts('json')) {
    res.json(stringifyError(err, null, '\t'));
    return;
  }

  // render the error page
  res.render('error');
});

export default router;
