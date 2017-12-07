import StoryPage from 'src/models/StoryPage';
import { database } from 'src/config/firebase-admin';
import { marked } from 'src/config/markdown';
import moment from 'src/config/moment';

const ref = (storyId, pageId) => database.ref(`/posts/${storyId}/pages/${pageId}`);

StoryPage.prototype.set = function set(storyId) {
  this.lastSaved = Date.now();
  return ref(storyId, this.id).set();
}

StoryPage.prototype.remove = function remove(storyId) {
  return ref(storyId, this.id).remove();
}

StoryPage.prototype.beautify = () => {
  this.html = marked(this.markdown);
  this.created = moment(this.created, 'x').format('DD.MM.YYYY');
  this.lastEdited = moment(this.lastEdited, 'x').format('DD.MM.YYYY hh:mm');
  this.lastSaved = moment(this.lastSaved, 'x').format('DD.MM.YYYY hh:mm');
}
