import shortid from 'shortid';

export default function Image(img = {}) {
  this.file = img.file || null;
  this.downloadURL = img.downloadURL || null;
  this.thumbnails = img.thumbnails || null;
  this.id = img.id || shortid.generate();
  this.lastModified = img.file ? img.file.lastModified : Date.now();
  this.state = img.state || 0;
  this.progress = img.progress || 0;

  // Methods
  this.url = () => {
    const url = this.file
      ? window.URL.createObjectURL(this.file)
      : this.downloadURL || null;
    return url;
  };

  this.getSmallestThumbUrl = () => {
    if (this.thumbnails && Object.keys(this.thumbnails)) {
      return this.thumbnails[Math.min.apply(null, Object.keys(this.thumbnails))];
    }
    return this.url();
  }

  this.getBlobOrSmallestThumb = () => {
    if (this.file) return URL.createObjectURL(this.file);
    return this.getSmallestThumbUrl();
  }

  this.getTitleImageUrl = () => {
    if (this.thumbnails && this.thumbnails[640]) {
      return this.thumbnails[640];
    }
    return this.getSmallestThumbUrl();
  }
}
