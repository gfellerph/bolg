import Tipp from 'src/models/TippModel';
import { database } from 'src/config/firebase-admin';

export const get = (req, res) => {
  const ref = database.ref('/tipps');
  ref.once('value', (val) => {
    const tipps = Object.values(val.val());
    const newTipps = tipps.map((tipp) => {
      delete tipp.id;
      const newTipp = new Tipp(Object.assign({}, tipp, {
        name: tipp.user.displayName,
        email: tipp.user.email,
      }));
      newTipp.save();
      return newTipp;
    });
    res.json(newTipps);
  })
}

export const post = (req, res) => {
  res.send('wat');
}
