const cuid = require('cuid');
const moment = require('moment');
const database = require('../config/firebase').database();

function Post(post = {}) {

  // Constants
  const ref = database.ref(`/posts/${this.id}`);

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

  // Methods

  /**
   * Save the post to firebase
   */
  this.set = () => {
    this.lastSaved = Date.now();
    return ref.set(JSON.parse(JSON.stringify(this))).then(snapshot => {
      return snapshot;
    });
  };

  this.beautify = () => {
    const p = this;
    p.url = `/posts/${slugger(post.title)}`;
    p.created = moment(post.created).format('DD.MM.YYYY');
    p.lastEdited = moment(post.lastEdited).format('DD.MM.YYYY');
    p.lastSaved = moment(post.lastSaved).format('DD.MM.YYYY');
    p.lastPublished = moment(post.lastPublished).format('DD.MM.YYYY');
    p.description = marked(`${post.markdown.replace(/#+.+\n/gm, '').split(' ').slice(0, 20).join(' ')}...`);
    return p;
  };

  // Getter / Setter properties

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

module.exports = Post;