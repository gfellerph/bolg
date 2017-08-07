import { auth } from '@/config/firebase';

// TODO: remove firebase from default user model
export default function User(user = {}) {
  this.uid = user.uid || null;
  this.displayName = user.displayName || '';
  this.email = user.email || '';
  this.isAnonymous = user.isAnonymous || false;
  this.emailVerified = user.emailVerified || false;
  this.photoURL = user.photoURL || null;
  this.refreshToken = user.refreshToken || null;

  this.login = (email, password) => auth
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
  this.logout = () => auth.signOut();
  this.getData = () => JSON.parse(JSON.stringify(this));
}
