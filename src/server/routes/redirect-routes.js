import { Router } from 'express';

const router = new Router();

router.get('/posts/:id', (req, res) => {
  res.redirect(301, `/gschichte/${req.params.id}`);
});

router.get('/galerie', (req, res) => {
  res.redirect(301, '/bilder');
});

export default router;
