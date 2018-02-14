import Tipp from 'src/models/TippModel';

/**
 * Save a new tipp
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Callback for next middleware in route
 */
export const postTipp = (req, res, next) => {
  const tipp = new Tipp(req.body);

  return tipp.save()
    .then(res.json)
    .catch(next);
};

/**
 * Delete a tipp, needs authentication
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Function} next Callback for next middleware in route
 */
export const deleteTipp = (req, res, next) => {
  return Tipp.remove({
    _id: req.params.id,
  })
    .then(res.json)
    .catch(next);
};

/**
 * Update a tipp
 * @param {Objec} req
 * @param {Object} res
 * @param {Function} next Callback for next middleware in route
 */
export const putTipp = (req, res, next) => {
  return Tipp.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  })
    .then(res.json)
    .catch(next);
};

/**
 * Get a list of all tipps
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next Callback for next middleware in route
 */
export const listTipps = (req, res, next) => {
  return Tipp.find({})
    .then(res.json)
    .catch(next);
};

/**
 * Get one tipp
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next Callback for next middleware in route
 */
export const getTipp = (req, res, next) => {
  return Tipp.findOne({
    _id: req.params.id,
  })
    .then(res.json)
    .catch(next);
};
