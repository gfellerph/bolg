import Country from 'src/models/CountryModel';

export const list = (req, res, next) => Country
  .find({})
  .sort('-created')
  .then(data => res.json(data))
  .catch(err => next(err));

export const get = (req, res, next) => Country.findById(req.params.id)
  .then(data => res.json(data))
  .catch(err => next(err));

export const post = (req, res, next) => new Country(req.body)
  .save()
  .then(data => res.json(data))
  .catch(err => next(err));

export const put = (req, res, next) => Country
  .findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, {
    new: true,
  })
  .then(data => res.json(data))
  .catch(err => next(err));

export const remove = (req, res, next) => Country
  .remove({
    _id: req.params.id,
  })
  .then(data => res.json(data))
  .catch(err => next(err));
