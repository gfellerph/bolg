import Subscriber from 'src/models/SubscriberModel';
import { database } from 'src/config/firebase-admin';

export const get = (req, res, next) => {
  const ref = database.ref('/subscribers');
  ref.once('value', (values) => {
    const subscribers = Object.values(values.val());
    const newSubscribers = subscribers.map((subscriber) => {
      const newSubscriber = new Subscriber({
        name: subscriber.displayName,
        email: subscriber.email,
      });
      return newSubscriber;
    });

    Promise.all(newSubscribers.map(subscriber => subscriber.save()))
      .then(() => {
        res.json(newSubscribers);
      })
      .catch(err => next(err));
  })
};

export const post = (req, res) => {
  res.send('TODO');
}
