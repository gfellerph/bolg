import { Router } from 'express';
import passport from 'passport';
import * as tipps from 'src/server/migrations/migrate-tipps';
import * as posts from 'src/server/migrations/migrate-posts';

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));
router.get('/tipps', tipps.get);
router.get('/posts', posts.get);

export default router;
