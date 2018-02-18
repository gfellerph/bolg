import Journey from 'src/models/JourneyModel';

export const list = (req, res, next) => Journey.find({}, 'lat lng description')
  .then(data => res.json(data))
  .catch(err => next(err));

export const get = (req, res, next) => Journey.findById(req.params.id)
  .then(data => res.json(data))
  .catch(err => next(err));

export const post = (req, res, next) => new Journey(req.body)
  .save()
  .then(data => res.json(data))
  .catch(err => next(err));

export const put = (req, res, next) => Journey.findByIdAndUpdate(req.params.id, {
  $set: req.body,
}, {
  new: true,
})
  .then(data => res.json(data))
  .catch(err => next(err));

export const remove = (req, res, next) => Journey.remove({
  _id: req.params.id,
})
  .then(data => res.json(data))
  .catch(err => next(err));
