import Story from 'src/models/Story';
import { database } from 'src/config/firebase';
import { formatDate } from 'src/config/constants';

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
  this.created = formatDate(this.created);
  this.lastEdited = formatDate(this.lastEdited);
  this.lastSaved = formatDate(this.lastSaved);
  this.lastPublished = formatDate(this.lastPublished);
  return this;
}

export default Story;
