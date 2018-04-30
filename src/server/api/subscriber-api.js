import SubscriberModel from 'src/models/SubscriberModel';

export const list = (req, res, next) => SubscriberModel.find({}, 'id name')
  .then(data => res.json(data))
  .catch(err => next(err));

export const get = (req, res, next) => SubscriberModel.findOne({
  _id: req.params.id,
})
  .then(data => res.json(data))
  .catch(err => next(err));

export const post = (req, res, next) => {
  const subscriber = new SubscriberModel(req.body);
  return subscriber.save()
    .then(data => res.json(data))
    .catch(err => next(err));
};

export const put = (req, res, next) => SubscriberModel.findByIdAndUpdate(req.params.id, {
  $set: req.body,
}, {
  new: true,
})
  .then(data => res.json(data))
  .catch(err => next(err));

export const remove = (req, res, next) => SubscriberModel.remove({
  _id: req.params.id,
})
  .then(data => res.json(data))
  .catch(err => next(err));
