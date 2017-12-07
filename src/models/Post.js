import cuid from 'cuid';
import { slugger, liveRootUrl } from 'src/config/constants';

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
  this.author = post.author || null;
  this.markdown = post.markdown || '';
  this.images = post.images || [];
  this.html = post.html || null;
  this.notificationSent = post.notificationSent || false;
  this.excerpt = post.excerpt || null;
  this.description = post.description || null;
  this.titleImage = post.titleImage || null;
  this.type = 'post';
  this.drawings = post.drawings || [];

  if (!this.titleImage && this.images.length) {
    this.titleImage = this.images[0].thumbnails[640]
      ? { id: this.id, url: this.images[0].thumbnails[640] }
      : null;
  }

  /**
   * Normalize the post object, no functions, ready for setting to firebase
   * @returns {Object} Clean post object without functions
   */
  this.normalize = () => JSON.parse(JSON.stringify(this));

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

  Object.defineProperty(this, 'liveUrl', {
    get() {
      const url = `${liveRootUrl}${slugger(this.title)}`;
      return url || '';
    },
  });

  Object.defineProperty(this, 'url', {
    get() {
      const url = `/posts/${slugger(this.title)}`;
      return url || '';
    },
  });

  Object.defineProperty(this, 'heroImageUrl', {
    get() {
      const image = this.titleImage ? this.titleImage.url : this.images[0].thumbnails['640'];
      return image;
    },
  });

  Object.defineProperty(this, 'editUrl', {
    get() {
      return `/editpost/${this.id}`;
    },
  });
}
