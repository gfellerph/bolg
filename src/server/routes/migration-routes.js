import { Router } from 'express';
import passport from 'passport';
import * as tipps from 'src/server/migrations/migrate-tipps';
import * as posts from 'src/server/migrations/migrate-posts';
import * as subscribers from 'src/server/migrations/migrate-subscribers';
import * as images from 'src/server/migrations/migrate-images';

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));
router.get('/tipps', tipps.get);
router.get('/posts', posts.get);
router.get('/subscribers', subscribers.get);
router.get('/images/thumbs', images.migratethumbs);
router.get('/images/origs', images.migrateorigs);

export default router;
