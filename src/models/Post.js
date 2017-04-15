import cuid from 'cuid';
import {database, auth} from '@/config/firebase';

export default function (post = {}) {

  // Properties
  this.id = post.id || cuid();
  this.created = post.created || Date.now();
  this.lastEdited = post.lastEdited || null;
  this.lastSaved = post.lastSaved || null;
  this.lastPublished = post.lastPublished || null;
  this.author = post.author || auth.currentUser.uid;
  this.published = post.published || false;
  this.markdown = post.markdown || '';
  this.images = post.images || [];

  // Constants
  const ref = database.ref(`/posts/${this.id}`);

  /**
   * Save the post to firebase
   */
  this.set = () => {
    this.lastSaved = Date.now();
    return ref.set(JSON.parse(JSON.stringify(this))).then(snapshot => {
      return snapshot;
    });
  };

  /**
   * Get the post title, first line starting with a single #
   */
  Object.defineProperty(this, 'title', {
    get() {
      const title = this.markdown.match(/^# .+/gm);
      return title ? title[0].replace('# ', '') : '';
    },
  });
}