import { buildIndex, publishAll, buildGallery } from '../index';

/**
 * Build all posts, then the index
 * @param {Object} req Express request
 * @param {Object} res Express response
 */
export default function publishAllApi(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'localhost');

  publishAll()
    .then(buildIndex)
    .then(buildGallery)
    .then(() => res.send({ message: 'Rebuild complete.' }))
    .catch(err => res.status(500).send(err));
}
