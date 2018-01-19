import { Router } from 'express';
import {
  getSubscribers,
  getSubscriber,
  postSubscriber,
  putSubscriber,
  deleteSubscriber,
} from 'src/server/api/subscriber';

const router = Router();

router.get('/subscribers', getSubscribers);
router.get('/subscriber/:id', getSubscriber);
router.post('/subscriber', postSubscriber);
router.put('/subscriber/:id', putSubscriber);
router.delete('/subscriber/:id', deleteSubscriber);
router.get('/unsubscribe/:id', deleteSubscriber);

export default router;
