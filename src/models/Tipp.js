import cuid from 'cuid';

export default function Tipp(tipp = {}) {
  // Properties
  this.id = tipp.id || cuid();
  this.created = tipp.created || Date.now();
  this.name = tipp.name || '';
  this.email = tipp.email || '';
  this.text = tipp.text || '';
  this.lat = tipp.lat || null;
  this.lng = tipp.lng || null;

  /**
   * Normalize the post object, no functions, ready for setting to firebase
   * @returns {Object} Clean post object without functions
   */
  this.normalize = () => JSON.parse(JSON.stringify(this));

  this.title = () => `${this.name}s Tipp: ${this.text.substring(0, 22)}${this.text.length > 22 ? '...' : ''}`;
}
