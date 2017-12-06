import enqueueNotifications from 'src/server/mails';
import { database } from 'src/config/firebase-admin';
import Post from 'src/models/Post';

export default function notifySubscribers(req, res) {
  const ref = database.ref(`/posts/${req.params.id}`);
  ref.once('value', (snapshot) => {
    const value = snapshot.val();
    if (!value) {
      return res.status(404).send('Post to notify users about not found');
    }
    const post = new Post(value);
    return enqueueNotifications(post)
      .then(() => {
        res.status(200).send({ message: 'Notifications enqueued' });
      })
      .catch(error => res.status(500).send(JSON.stringify(error)));
  });
}
