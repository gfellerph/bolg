import { buildIndex } from 'src/server/modules/build';
import { publishedPosts } from 'src/server/modules/queries';
import { unpublish } from '../index';

/**
 * Unpublish a previously published blog post, so
 * delete the corresponding file in /public
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 */
export default function unpublishApi(req, res) {
  res.setHeader('Acces-Control-Allow-Origin', 'localhost');

  unpublish(req.params.id)
    .then(publishedPosts)
    .then(p => buildIndex(p))
    .then(() => res.send({ message: 'Unpublish complete.' }))
    .catch(err => res.status(500).send(err));
}
