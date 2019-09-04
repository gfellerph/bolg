import { Router } from 'express';
import webpackManifest from 'src/server/modules/webpack-manifest';
import { logoURL } from 'src/config/constants';

const router = new Router();
const webpack = webpackManifest();

router.get('/unsubscribe', (req, res) => res.render('unsubscribe', { webpack, logoURL: logoURL() }));

export default router;
