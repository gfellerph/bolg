import firebase from 'src/config/firebase-admin';

export default function getTipps(req, res) {
  firebase
    .database()
    .ref('/tipps')
    .once('value', (snapshot) => {
      const tipps = snapshot.val();

      if (!tipps) return res.error('Database error');

      return res.send(tipps);
    });
}
