import { Router } from 'express';
import passport from 'passport';
import {
  getSubscribers,
  getSubscriber,
  postSubscriber,
  putSubscriber,
  deleteSubscriber,
} from 'src/server/api/subscriber';
import {
  getUser,
  registerUser,
  authenticateUser,
} from 'src/server/api/user-api';
import * as Tipps from 'src/server/api/tipp-api';
import * as Posts from 'src/server/api/post-api';

const router = Router();

router.get('/subscribers', getSubscribers);
router.get('/subscriber/:id', getSubscriber);
router.post('/subscriber', postSubscriber);
router.put('/subscriber/:id', putSubscriber);
router.delete('/subscriber/:id', deleteSubscriber);
router.get('/unsubscribe/:id', deleteSubscriber);

router.get('/user', passport.authenticate('jwt', { session: false }), getUser);
router.post('/user', registerUser);
router.post('/user/authenticate', authenticateUser);

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

export default router;
