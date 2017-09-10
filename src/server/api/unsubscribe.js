import firebase from '@/config/firebase-admin';
import { logoURL } from '@/config/constants';
import { webpackManifest } from '@/server/index';

/**
 * Remove a subscriber from firebase
 * @param {Object} req The request object
 * @returns {Promise} Firebase promise
 */
export default function unsubscribe(req, res) {
  return firebase
    .database()
    .ref(`/subscribers/${req.params.id}`)
    .remove()
    .then(() => {
      res.render('unsubscribe', {
        logoURL: logoURL(),
        webpackManifest: webpackManifest(),
      });
    })
    .catch((error) => {
      throw error;
    });
}
