import cuid from 'cuid';
import { database } from 'src/config/firebase-admin';

export const postSpamReport = (req, res) => {
  const ref = database.ref(`/spamreports/${cuid()}`);
  ref.set({ ...req.body, created: Date.now() }).then(() => {
    res.send('OK');
  });
}

export const getSpamReport = (req, res) => {
  res.send('Not implemented yet');
}
