import Tipp from 'src/models/TippModel';

/**
 * Save a new tipp
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Callback for next middleware in route
 */
export const postTipp = (req, res, next) => new Tipp(req.body).save()
  .then(data => res.json(data))
  .catch(err => next(err));

/**
 * Delete a tipp, needs authentication
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Callback for next middleware in route
 */
export const deleteTipp = (req, res, next) => Tipp.remove({
  _id: req.params.id,
})
  .then(data => res.json(data))
  .catch(err => next(err));

/**
 * Update a tipp
 * @param {Objec} req
 * @param {Object} res
 * @param {Function} next Callback for next middleware in route
 */
export const putTipp = (req, res, next) => Tipp.findByIdAndUpdate(req.params.id, {
  $set: req.body,
}, {
  new: true,
})
  .then(data => res.json(data))
  .catch(err => next(err));

/**
 * Get a list of all tipps
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next Callback for next middleware in route
 */
export const listTipps = (req, res, next) => Tipp
  .find({}, '-email')
  .sort('-created')
  .then(data => res.json(data))
  .catch(err => next(err));

/**
 * Get one tipp
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next Callback for next middleware in route
 */
export const getTipp = (req, res, next) => Tipp.findOne({
  _id: req.params.id,
})
  .then(data => res.json(data))
  .catch(err => next(err));
