import cuid from 'cuid';
import { slugger } from '@/config/constants';

export default function Story(story = {}) {
  this.id = story.id || cuid();
  this.created = story.created || Date.now();
  this.lastEdited = story.lastEdited || null;
  this.lastSaved = story.lastSaved || null;
  this.lastPublished = story.lastPublished || null;
  this.author = story.author || null;
  this.pages = story.pages || [];
  this.images = story.images || [];

  this.normalize = () => JSON.parse(JSON.stringify(this));

  Object.defineProperty(this, 'url', {
    get() {
      const url = `/posts/${slugger(this.title)}.html`;
      return url || '';
    },
  });
}
