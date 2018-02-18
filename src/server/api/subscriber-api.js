import SubscriberModel from 'src/models/SubscriberModel';

export const list = (req, res, next) => {
  return SubscriberModel.find({}, 'id name email')
    .then(res.json)
    .catch(next);
};

export const get = (req, res, next) => {
  return SubscriberModel.findOne({
    _id: req.params.id,
  })
    .then(res.json)
    .catch(next);
};

export const post = (req, res, next) => {
  const subscriber = new SubscriberModel(req.body);
  return subscriber.save()
    .then(res.json)
    .catch(next);
};

export const put = (req, res, next) => {
  return SubscriberModel.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  })
    .then(res.json)
    .catch(next);
};

export const remove = (req, res, next) => {
  return SubscriberModel.remove({
    _id: req.params.id,
  })
    .then(res.json)
    .catch(next);
};
