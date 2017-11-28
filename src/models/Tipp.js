import cuid from 'cuid';
import User from 'src/models/User';
import { database } from 'src/config/firebase';

export default function Tipp(tipp = {}) {
  // Properties
  this.id = tipp.id || cuid();
  this.created = tipp.created || Date.now();
  this.user = tipp.user || new User();
  this.country = tipp.country || '';
  this.text = tipp.text || '';
  this.lat = tipp.lat || null;
  this.lng = tipp.lng || null;
  this.approved = tipp.approved || false;

  const ref = database.ref(`/tipps/${this.id}`);

  /**
   * Normalize the post object, no functions, ready for setting to firebase
   * @returns {Object} Clean post object without functions
   */
  this.normalize = () => JSON.parse(JSON.stringify(this));

  /**
   * Save a tipp to firebase
   * @returns {Promise} Firebase promise
   */
  this.set = () => ref.set(this.normalize());

  /**
   * Remove the tipp from firebase
   * @returns {Promise} Firebase promise
   */
  this.remove = () => ref.remove();
}
