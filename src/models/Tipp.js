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
   * Save a tipp to firebase
   */
  this.set = () => {
    return ref.set(JSON.parse(JSON.stringify(this)));
  };
}
