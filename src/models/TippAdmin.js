import Tipp from '@/models/Tipp';
import { database } from '@/config/firebase';

const ref = id => database.ref(`/tipps/${id}`);

/**
 * Save a tipp to firebase
 * @returns {Promise} Firebase promise
 */
Tipp.prototype.set = function set() { return ref(this.id).set(this.normalize()); }

/**
 * Remove the tipp from firebase
 * @returns {Promise} Firebase promise
 */
Tipp.prototype.remove = function remove() { return ref(this.id).remove(); }

export default Tipp;
