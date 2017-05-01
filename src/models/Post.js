import cuid from 'cuid';
import { database, auth } from '@/config/firebase';

/**
 * A blog post
 * @export
 * @param {Object} [post={}] Pass existing post data or leave empty to create a new post
 * @returns Post class object
 */
export default function Post(post = {}) {
  // Properties
  this.id = post.id || cuid();
  this.created = post.created || Date.now();
  this.lastEdited = post.lastEdited || null;
  this.lastSaved = post.lastSaved || null;
  this.lastPublished = post.lastPublished || null;
  this.author = post.author || auth.currentUser.uid;
  this.markdown = post.markdown || '';
  this.images = post.images || [];

  // Constants
  const ref = database.ref(`/posts/${this.id}`);
  const publishRef = database.ref(`/published/${this.id}`);

  /**
   * Normalize the post object, no functions, ready for setting to firebase
   * @returns {Object} Clean post object without functions
   */
  this.normalize = () => JSON.parse(JSON.stringify(this));

  /**
   * Save the post to firebase
   * @returns {Promise} Firebase promise
   */
  this.set = () => {
    this.lastSaved = Date.now();
    return ref.set(this.normalize());
  };

  /**
   * Deletes a post for ever
   * @returns {Promise} Promise
   */
  this.remove = () => Promise.all([
    publishRef.remove(),
    ref.remove(),
  ]);

  /**
   * Publish a post to the publish reference and save it in edit mode
   * @returns {Promise} Promise
   */
  this.publish = () => {
    this.lastSaved = Date.now();
    this.lastPublished = Date.now();
    const payload = this.normalize();

    return Promise.all([
      ref.set(payload),
      publishRef.set(payload),
    ]);
  };

  /**
   * Unpublish a post. Delete the post from /published on firebase
   * @returns {Promise} Promise
   */
  this.unpublish = () => {
    this.lastPublished = null;
    return Promise.all([
      this.set(),
      publishRef.remove(),
    ]);
  };

  /**
   * Get the post title, first line starting with a single #
   * @returns {String} Post title extracted from post markdown or empty string
   */
  Object.defineProperty(this, 'title', {
    get() {
      const title = this.markdown.match(/^# .+/gm);
      return title ? title[0].replace('# ', '') : '';
    },
  });

  Object.defineProperty(this, 'url', {
    get() {
      return this.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    },
  })
}
