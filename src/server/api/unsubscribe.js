import { database } from 'src/config/firebase-admin';
import { logoURL } from 'src/config/constants';
import { webpackManifest } from 'src/server/index';

/**
 * Remove a subscriber from firebase
 * @param {Object} req The request object
 * @returns {Promise} Firebase promise
 */
export default function unsubscribe(req, res) {
  return database
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
