import cuid from 'cuid';
import {database, auth} from '@/config/firebase';

export default function (post = {}) {

  // Properties
  this.id = post.id || cuid();
  this.title = post.title || '';
  this.created = post.created || Date.now();
  this.lastEdited = post.lastEdited || null;
  this.lastSaved = post.lastSaved || null;
  this.lastPublished = post.lastPublished || null;
  this.author = post.author || auth.currentUser.uid;
  this.published = post.published || false;
  this.markdown = post.markdown || '';

  const ref = database.ref(`/posts/${this.id}`);

  // Methods
  this.set = () => {
    this.lastSaved = Date.now();
    return ref.set(JSON.parse(JSON.stringify(this)));
  };
}