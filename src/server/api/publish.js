const bolg = require('../../bolg');

/**
 * Publish a specific post. Needs a post id or 'index' to publish
 * the index only.
 * @param {Object} req Express request
 * @param {Object} res Express response
 */
function publish(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'localhost');

  const operation = req.params.id === 'index'
    ? bolg.buildIndex()
    : bolg.publish(req.params.id);

  operation
    .then(bolg.buildIndex)
    .then(() => res.send({ message: 'Rebuild complete.' }))
    .catch(err => res.status(500).send(err));
}

module.exports = publish;
