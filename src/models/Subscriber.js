import User from '@/models/User';
import { database } from '@/config/firebase';

const ref = uid => database.ref(`/subscribers/${uid}`);

/**
 * Normalize the post object, no functions, ready for setting to firebase
 * @returns {Object} Clean post object without functions
 */
User.prototype.normalize = function normalize() { return JSON.parse(JSON.stringify(this)); }

/**
 * Save a tipp to firebase
 * @returns {Promise} Firebase promise
 */
User.prototype.set = function set() { return ref(this.uid).set(this.normalize()); }

/**
 * Remove the tipp from firebase
 * @returns {Promise} Firebase promise
 */
User.prototype.remove = function remove() { return ref(this.uid).remove(); }

export default User;
