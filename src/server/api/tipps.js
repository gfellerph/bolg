import firebase from '@/config/firebase-admin';
import Tipp from '@/models/TippAdmin';

const ref = firebase.database().ref('/tipps');

export const getTipps = (req, res) => {
  ref.once('value', (snapshot) => {
    const tipps = snapshot.val();

    if (!tipps) return res.error('Database error');

    // Send tipps as array
    return res.send(Object.keys(tipps).map(tipp => tipps[tipp]));
  });
}

export const postTipp = (req, res) => {
  const tipp = new Tipp(req.body);
  return tipp.set()
    .then(() => {
      res.send('ok');
    })
    .catch((err) => {
      res.error(err);
    });
};
