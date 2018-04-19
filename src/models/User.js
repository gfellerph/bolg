import shortid from 'shortid';

export default function User(user = {}) {
  this.uid = user.uid || shortid.generate();
  this.name = user.name || '';
  this.email = user.email || '';

  this.normalize = () => JSON.parse(JSON.stringify(this));
}
