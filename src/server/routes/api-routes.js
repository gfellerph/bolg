import { Router } from 'express';
import passport from 'passport';
import * as Subscribers from 'src/server/api/subscriber-api';
import * as Users from 'src/server/api/user-api';
import * as Tipps from 'src/server/api/tipp-api';
import * as Posts from 'src/server/api/post-api';
import * as Journeys from 'src/server/api/journey-api';

const router = Router();

router.get('/subscribers', Subscribers.list);
router.get('/subscriber/:id', Subscribers.get);
router.post('/subscriber', Subscribers.post);
router.put('/subscriber/:id', Subscribers.put);
router.delete('/subscriber/:id', Subscribers.remove);
router.get('/unsubscribe/:id', Subscribers.remove);

router.get('/user', passport.authenticate('jwt', { session: false }), Users.getUser);
router.post('/user', Users.registerUser);
router.post('/user/authenticate', Users.authenticateUser);

router.get('/tipps', Tipps.listTipps);
router.get('/tipp/:id', Tipps.getTipp);
router.post('/tipp', Tipps.postTipp);
router.put('/tipp/:id', passport.authenticate('jwt', { session: false }), Tipps.putTipp);
router.delete('/tipp/:id', passport.authenticate('jwt', { session: false }), Tipps.deleteTipp);

router.get('/posts', Posts.getPosts);
router.get('/post/:id', Posts.getPost);
router.post('/post', passport.authenticate('jwt', { session: false }), Posts.postPost);
router.put('/post/:id', passport.authenticate('jwt', { session: false }), Posts.putPost);
router.delete('/post/:id', passport.authenticate('jwt', { session: false }), Posts.deletePost);

router.get('/journeys', Journeys.list);
router.get('/journey/:id', Journeys.get);
router.post('/journey', passport.authenticate('jwt', { session: false }), Journeys.post);
router.put('/journey/:id', passport.authenticate('jwt', { session: false }), Journeys.put);
router.delete('/journey/:id', passport.authenticate('jwt', { session: false }), Journeys.remove);

router.use('/*', (err, req, res, next) => {
  if (err) res.json(err);
  if (!err) next();
});

export default router;
