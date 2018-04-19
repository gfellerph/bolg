import { Router } from 'express';
import webpackManifest from 'src/server/modules/webpack-manifest';
import { logoURL } from 'src/config/constants';

const router = Router();

// catch 404 and forward to error handler
router.use((req, res) => {
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
  res.json({ message: err.message });
});

export default router;
