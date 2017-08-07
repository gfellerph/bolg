import cuid from 'cuid';
import StoryPage from '@/models/StoryPage';
import { slugger, liveRootUrl } from '@/config/constants';

export default function Story(story = {}) {
  this.id = story.id || cuid();
  this.created = story.created || Date.now();
  this.lastEdited = story.lastEdited || null;
  this.lastSaved = story.lastSaved || null;
  this.lastPublished = story.lastPublished || null;
  this.author = story.author || null;
  this.pages = story.pages || [new StoryPage()];
  this.images = story.images || [];
  this.type = 'story';

  this.normalize = () => JSON.parse(JSON.stringify(this));

  Object.defineProperty(this, 'url', {
    get() {
      const url = `/posts/${slugger(this.title)}.html`;
      return url || '';
    },
  });

  Object.defineProperty(this, 'liveUrl', {
    get() {
      const url = `${liveRootUrl}${slugger(this.title)}.html`;
      return url || '';
    },
  });

  Object.defineProperty(this, 'editUrl', {
    get() {
      return `/editstory/${this.id}`;
    },
  });
}
