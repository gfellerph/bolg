import Story from 'src/models/Story';
import { database } from 'src/config/firebase-admin';
import moment from 'src/config/moment';

const ref = id => database.ref(`/stories/${id}`);
const publishRef = id => database.ref(`/publishedstories/${id}`);

Story.prototype.set = function set() {
  this.lastSaved = Date.now();
  return ref(this.id).set(this.normalize());
};

Story.prototype.remove = function remove() {
  return Promise.all([
    publishRef(this.id).remove(),
    ref(this.id).remove(),
  ]);
}

Story.prototype.publish = function publish() {
  this.lastSaved = Date.now();
  this.lastPublished = Date.now();
  const storyToPublish = new Story(this);
  storyToPublish.beautify();

  return Promise.all([
    ref(this.id).set(this.normalize()),
    publishRef(this.id).set(storyToPublish.normalize()),
  ]);
};

Story.prototype.unpublish = function unpublish() {
  this.lastPublished = null;
  return Promise.all([
    this.set(),
    publishRef(this).remove(),
  ]);
};

Story.prototype.beautify = function beautify() {
  this.storyUrl = this.url;
  this.storyTitle = this.title;
  this.created = moment(this.created, 'x').format('DD.MM.YYYY');
  this.lastEdited = moment(this.lastEdited, 'x').format('DD.MM.YYYY');
  this.lastSaved = moment(this.lastSaved, 'x').format('DD.MM.YYYY');
  this.lastPublished = moment(this.lastPublished, 'x').format('DD.MM.YYYY');
  return this;
}

export default Story;
