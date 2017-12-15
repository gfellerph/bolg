import cuid from 'cuid';

export default function Image(img = {}) {
  this.file = img.file || null;
  this.downloadURL = img.downloadURL || null;
  this.thumbnails = img.thumbnails || null;
  this.id = img.id || cuid();
  this.lastModified = img.file ? img.file.lastModified : Date.now();

  // Methods
  this.url = () => {
    const url = this.file
      ? window.URL.createObjectURL(this.file)
      : this.downloadURL || null;
    return url;
  };

  this.getSmallestThumbUrl = () => {
    if (!this.thumbnails && !this.downloadURL) return false;
    if (!this.thumbnails) return this.downloadURL;
    return this.thumbnails[Math.min.apply(null, Object.keys(this.thumbnails))];
  }
}
