import cuid from 'cuid';
import User from '@/models/User';
import { database } from '@/config/firebase';

export default function Tipp(tipp = {}) {
  // Properties
  this.id = tipp.id || cuid();
  this.created = tipp.created || Date.now();
  this.user = tipp.user || new User();
  this.text = tipp.text || '';
  this.location = tipp.location || null;
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
}
