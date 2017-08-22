import firebase from '@/config/firebase-admin';

/**
 * Remove a subscriber from firebase
 * @param {Object} req The request object
 * @returns {Promise} Firebase promise
 */
export default function unsubscribe(req) {
  return firebase.database.ref(`/subscribers/${req.params.id}`).remove();
}
