import admin from '@/config/firebase-admin';
import Subscriber from '@/models/Subscriber';

export default function collectEmails(req, res) {
  const ref = admin.database().ref(`/tipps`)
    .once('value', (snapshot) => {
      const val = snapshot.val();
      const users = Object.keys(val).map(key => val[key].user);
      const usersByEmail = {};
      users.map((user) => {
        if (!user.email) return;
        usersByEmail[user.email.toLowerCase()] = user;
      });
      const promises = [];
      Object.keys(usersByEmail).map((key) => {
        const subscriber = new Subscriber(usersByEmail[key]);
        promises.push(subscriber.set());
      });
      Promise.all(promises).then(() => {
        res.send(usersByEmail);
      });
    });
}
