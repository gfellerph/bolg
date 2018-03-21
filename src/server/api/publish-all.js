import { publishedPosts } from 'src/server/modules/queries';
import { buildIndex } from 'src/server/modules/build';
import { publishAll, buildGallery } from '../index';

/**
 * Build all posts, then the index
 * @param {Object} req Express request
 * @param {Object} res Express response
 */
export default function publishAllApi(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'localhost');

  publishAll()
    .then(publishedPosts)
    .then(p => buildIndex(p))
    .then(buildGallery)
    .then(() => res.send({ message: 'Rebuild complete.' }))
    .catch(err => res.status(500).send(err));
}
