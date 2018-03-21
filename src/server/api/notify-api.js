import enqueueNotifications from 'src/server/modules/mail';
import * as Queries from 'src/server/modules/queries';

export default async (req, res, next) => {
  const post = await Queries.post(req.params.id);
  const subscribers = await Queries.subscribers();

  return enqueueNotifications(post, subscribers)
    .then(() => {
      res.send('OK');
    })
    .catch(err => next(err));
}
