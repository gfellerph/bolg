import cuid from 'cuid';

export default function User(user = {}) {
  this.uid = user.uid || cuid();
  this.displayName = user.displayName || '';
  this.email = user.email || '';
  this.isAnonymous = user.isAnonymous || false;
  this.emailVerified = user.emailVerified || false;
  this.photoURL = user.photoURL || null;
  this.refreshToken = user.refreshToken || null;

  this.normalize = () => JSON.parse(JSON.stringify(this));
}
