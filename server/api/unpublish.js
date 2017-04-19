const bolg = require('../../bolg');

/**
 * Unpublish a previously published blog post, so
 * delete the corresponding file in /public
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 */
function unpublish(req, res) {
  res.setHeader('Acces-Control-Allow-Origin', 'localhost');

  bolg.unPublish(req.params.id)
    .then(() => res.send({ message: 'Unpublish complete.' }))
    .catch(err => res.status(500).send(err));
}

module.exports = unpublish;
