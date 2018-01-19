import SubscriberModel from 'src/models/SubscriberModel';

export const getSubscribers = (req, res) => {
  SubscriberModel.find({}, 'id displayName email')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const getSubscriber = (req, res) => {
  SubscriberModel.findOne({
    _id: req.params.id,
  })
    .then(result => res.json(result))
    .catch((error) => {
      res.status = 500;
      res.send(error.errmsg);
    });
};

export const postSubscriber = (req, res) => {
  const subscriber = new SubscriberModel(req.body);
  subscriber.save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500);
      res.json(error);
    });
};

export const putSubscriber = (req, res) => { res.send('TODO: put subscriber'); };

export const deleteSubscriber = (req, res) => { res.send('TODO: delete subscriber'); };
