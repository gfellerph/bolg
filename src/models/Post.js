import cuid from 'cuid';
import {database, auth} from '@/config/firebase';

export default function (post = {}) {
  console.log('new post created');

  // Properties
  this.id = post.id || cuid();
  this.title = post.title || '';
  this.created = new Date(post.created) || new Date();
  this.lastEdited = new Date(post.lastEdited) || new Date();
  this.lastSaved = new Date(post.lastSaved) || null;
  this.author = post.author || auth.currentUser.uid;
  this.published = post.published || false;
  this.markdown = post.markdown || '';

  const ref = database.ref(`/posts/${this.id}`);

  // Methods
  this.set = () => {
    this.lastSaved = new Date();
    ref.set(JSON.parse(JSON.stringify(this)))
  };
}