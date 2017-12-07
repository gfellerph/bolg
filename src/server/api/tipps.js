import { database } from 'src/config/firebase-admin';
import Tipp from 'src/models/TippAdmin';

const ref = database.ref('/tipps');

export const getTipps = (req, res) => {
  ref.once('value', (snapshot) => {
    const tippsSnapshot = snapshot.val();

    if (!tippsSnapshot) return res.error('Database error');

    const tipps = Object.keys(tippsSnapshot).map((key) => {
      const tipp = tippsSnapshot[key];
      delete tipp.id;
      delete tipp.created;
      delete tipp.approved;
      delete tipp.country;
      delete tipp.user.uid;
      delete tipp.user.email;
      delete tipp.user.emailVerified;
      delete tipp.user.isAnonymous;
      return tipp;
    });

    // Send tipps as array
    return res.send(tipps);
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
