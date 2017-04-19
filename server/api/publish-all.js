const bolg = require('../../bolg');

/**
 * Build all posts, then the index
 * @param {Object} req Express request
 * @param {Object} res Express response
 */
function publishAll(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'localhost');

  bolg
    .rebuildAll()
    .then(bolg.rebuildIndex)
    .then(() => res.send({ message: 'Rebuild complete.' }))
    .catch(err => res.status(500).send(err));
}

module.exports = publishAll;
