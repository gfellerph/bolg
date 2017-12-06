import Subscriber from 'src/models/SubscriberAdmin';

export const getSubscriber = () => {};
export const postSubscriber = (req, res) => {
  const newSubscriber = new Subscriber(req.body);

  return newSubscriber
    .set()
    .then(() => {
      res.send('ok');
    })
    .catch((err) => {
      res.error(err);
    });
};
