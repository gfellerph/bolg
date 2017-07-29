import Story from '@/models/Story';
import { database, auth } from '@/config/firebase';
import moment from '@/config/moment';
import { slugger } from '@/config/constants';

const ref = id => database.ref(`/posts/${id}`);
const publishRef = id => database.ref(`/published/${id}`);

Story.prototype.set = () => {
  this.lastSaved = Date.now();
  return ref(this.id).set(this.normalize());
};

Story.prototype.remove = () => Promise.all([
  publishRef(this.id).remove(),
  ref(this.id).remove(),
]);

Story.prototype.publish = () => {
  this.lastSaved = Date.now();
  this.lastPublished = Date.now();
  const storyToPublish = new Story(this);
  storyToPublish.beautify();

  return Promise.all([
    ref(this.id).set(this.normalize()),
    publishRef(this.id).set(storyToPublish.normalize()),
  ]);
};

Story.prototype.unpublish = () => {
  this.lastPublished = null;
  return Promise.all([
    this.set(),
    publishRef(this).remove(),
  ]);
};

Story.prototype.beautify = () => {
  this.storyUrl = this.url;
  this.storyTitle = this.title;
  this.created = moment(this.created, 'x').format('DD.MM.YYYY');
  this.lastEdited = moment(this.lastEdited, 'x').format('DD.MM.YYYY');
  this.lastSaved = moment(this.lastSaved, 'x').format('DD.MM.YYYY');
  this.lastPublished = moment(this.lastPublished, 'x').format('DD.MM.YYYY');
  return this;
}

export default Story;
