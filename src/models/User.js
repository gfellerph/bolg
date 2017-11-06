import cuid from 'cuid';

export default function User(user = {}) {
  this.uid = user.uid || cuid();
  this.displayName = user.displayName || '';
  this.email = user.email || '';

  this.normalize = () => JSON.parse(JSON.stringify(this));
}
