import { buildIndex, publish } from '../index';

/**
 * Publish a specific post. Needs a post id or 'index' to publish
 * the index only.
 * @param {Object} req Express request
 * @param {Object} res Express response
 */
export default function publishAll(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'localhost');

  const operation = req.params.id === 'index'
    ? buildIndex()
    : publish(req.params.id);

  operation
    .then(buildIndex)
    .then(() => res.send({ message: 'Rebuild complete.' }))
    .catch(err => res.status(500).send(err));
}
