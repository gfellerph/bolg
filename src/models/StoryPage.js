import cuid from 'cuid';

export default function StoryPage(page = {}) {
  this.id = page.id || cuid();
  this.created = page.created || Date.now();
  this.lastEdited = page.lastEdited || null;
  this.lastSaved = page.lastSaved || null;
  this.markdown = page.markdown || '';
  this.backgroundUrl = page.backgroundUrl || null;

  this.normalize = () => JSON.parse(JSON.stringify(this));
}
