import User from '@/models/User';
import { auth } from '@/config/firebase';

User.prototype.login = function login(email, password) {
  return auth
    .signInWithEmailAndPassword(email, password)
    .then((firebaseUser) => {
      this.uid = firebaseUser.uid;
      this.displayName = firebaseUser.displayName;
      this.email = firebaseUser.email;
      this.isAnonymous = firebaseUser.isAnonymous;
      this.emailVerified = firebaseUser.emailVerified;
      this.photoURL = firebaseUser.photoURL;
      this.refreshToken = firebaseUser.refreshToken;

      return this;
    });
}

User.prototype.logout = () => auth.signOut();

export default User;
