import StoryPage from 'src/models/StoryPage';
import { database } from 'src/config/firebase';
import { marked } from 'src/config/markdown';
import { formatDate } from 'src/config/constants';

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
  this.created = formatDate(this.created);
  this.lastEdited = formatDate(this.lastEdited);
  this.lastSaved = formatDate(this.lastSaved);
}
