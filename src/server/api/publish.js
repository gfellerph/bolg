import { buildIndex } from 'src/server/modules/build';
import { publishedPosts } from 'src/server/modules/queries';
import { publish } from '../index';

/**
 * Publish a specific post. Needs a post id or 'index' to publish
 * the index only.
 * @param {Object} req Express request
 * @param {Object} res Express response
 */
export default async function publishAll(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'localhost');
  const p = await publishedPosts();
  const operation = req.params.id === 'index'
    ? buildIndex(p)
    : publish(req.params.id);

  operation
    .then(() => buildIndex(p))
    .then(() => res.send({ message: 'Rebuild complete.' }))
    .catch(err => res.status(500).send(err));
}
