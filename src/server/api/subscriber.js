import User from 'src/models/User';
import { database } from 'src/config/firebase-admin';
import SubscriberController from 'src/controllers/subscriber-controller';

const subscriberCtrl = SubscriberController(database);

export const getSubscriber = () => {};
export const postSubscriber = (req, res) => {
  const newSubscriber = new User(req.body);

  return subscriberCtrl
    .set(newSubscriber)
    .then(() => {
      res.send('ok');
    })
    .catch((err) => {
      res.error(err);
    });
};
