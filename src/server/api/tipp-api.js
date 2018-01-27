import Tipp from 'src/models/TippModel';

/**
 * Save a new tipp
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Callback for next middleware in route
 */
export const postTipp = (req, res, next) => {
  const tipp = new Tipp(req.body);

  tipp.save()
    .then(newTipp => res.json(newTipp))
    .catch(err => next(err));
};

/**
 * Delete a tipp, needs authentication
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Callback for next middleware in route
 */
export const deleteTipp = (req, res, next) => {
  Tipp.remove({
    _id: req.params.id,
  })
    .then(() => res.send('OK'))
    .catch(err => next(err));
};

/**
 * Update a tipp
 * @param {Objec} req
 * @param {Object} res
 * @param {Function} next Callback for next middleware in route
 */
export const putTipp = (req, res, next) => {
  Tipp.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  })
    .then(() => res.send('OK'))
    .catch(err => next(err));
};

/**
 * Get a list of all tipps
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next Callback for next middleware in route
 */
export const listTipps = (req, res, next) => {
  Tipp.find({})
    .then(tipps => res.json(tipps))
    .catch(err => next(err));
};

/**
 * Get one tipp
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next Callback for next middleware in route
 */
export const getTipp = (req, res, next) => {
  Tipp.findOne({
    _id: req.params.id,
  })
    .then(tipp => res.json(tipp))
    .catch(err => next(err));
};
