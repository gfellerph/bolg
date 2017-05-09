const cuid = require('cuid');
const moment = require('moment');
const firebase = require('../config/firebase');
const slugger = require('../helpers').slugger;
const marked = require('marked');

const database = firebase.database();
const auth = firebase.auth();

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
    return ref.set(JSON.parse(JSON.stringify(this)));
  };

  this.beautify = () => {
    const p = this;
    const mdOptions = { gfm: true, smartypants: true };
    p.url = `/posts/${slugger(this.title)}`;
    p.created = moment(this.created, 'x').format('DD.MM.YYYY');
    p.lastEdited = moment(this.lastEdited, 'x').format('DD.MM.YYYY');
    p.lastSaved = moment(this.lastSaved, 'x').format('DD.MM.YYYY');
    p.lastPublished = moment(this.lastPublished, 'x').format('DD.MM.YYYY');
    p.html = marked(this.markdown, mdOptions);
    p.description = marked(`${this.markdown.replace(/#+.+\n/gm, '').split(' ').slice(0, 20).join(' ')}...`, mdOptions);
    p.excerpt = marked(this.markdown.split(' ').slice(0, 40).join(' ') + '...', mdOptions);
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
