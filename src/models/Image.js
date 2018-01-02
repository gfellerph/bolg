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

  this.getBiggestThumbUrl = () => {
    if (this.thumbnails && Object.keys(this.thumbnails)) {
      return this.thumbnails[Math.max.apply(null, Object.keys(this.thumbnails))];
    }
    return this.url();
  }

  this.getSrcSetString = () => {
    if (!this.thumbnails || this.thumbnails.length === 0) return;
    /* eslint consistent-return:0 */
    return Object.keys(this.thumbnails).reduce((acc, thumbnailSize, index) => {
      const newAcc = `${acc}${!index ? '' : ', '}${this.thumbnails[thumbnailSize]} ${thumbnailSize}w`;
      return newAcc;
    }, '');
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
