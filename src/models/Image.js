import shortid from 'shortid';

export default function Image(img = {}) {
  this.file = img.file || null;
  this.downloadURL = img.downloadURL || null;
  this.thumbnails = img.thumbnails || null;
  this.id = img.id || shortid.generate();
  this.lastModified = img.file ? img.file.lastModified : Date.now();
  this.state = img.state || 0;

  // Methods
  this.url = () => {
    const url = this.file
      ? window.URL.createObjectURL(this.file)
      : this.downloadURL || null;
    return url;
  };

  this.getSmallestThumbUrl = () => {
    if (!this.thumbnails && !this.downloadURL) return false;
    if (!Object.keys(this.thumbnails).length) return this.downloadURL;
    return this.thumbnails[Math.min.apply(null, Object.keys(this.thumbnails))];
  }
}
