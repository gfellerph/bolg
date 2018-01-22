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

const router = Router();

router.get('/subscribers', getSubscribers);
router.get('/subscriber/:id', getSubscriber);
router.post('/subscriber', postSubscriber);
router.put('/subscriber/:id', putSubscriber);
router.delete('/subscriber/:id', deleteSubscriber);
router.get('/unsubscribe/:id', deleteSubscriber);

router.get('/user', passport.authenticate('jwt', { session: false }), getUser);
router.post('/user/register', registerUser);
router.post('/user/authenticate', authenticateUser);

export default router;
