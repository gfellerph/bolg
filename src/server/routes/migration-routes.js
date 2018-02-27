import { Router } from 'express';
import * as tipps from 'src/server/migrations/migrate-tipps';

const router = Router();

router.get('/tipps', tipps.get);

export default router;
