import enqueueNotifications from '@/server/mails';
import firebase from '@/config/firebase-admin';
import Post from '@/models/Post';

export default function notifySubscribers(req, res) {
  const ref = firebase.database().ref(`/posts/${req.params.id}`);
  ref.once('value', (snapshot) => {
    const value = snapshot.val();
    if (!value) {
      return res.status(404).send('Post to notify users about not found');
    }
    const post = new Post(value);
    console.log(post);
    enqueueNotifications(post).then(() => {
      res.send({ message: 'Notifications enqueued' });
    })
    .catch(error => res.status(500).send(JSON.stringify(error)));
  });
}
