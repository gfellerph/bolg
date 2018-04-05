import shortid from 'shortid';

export default function Image(img = {}) {
  this.name = img.name || '';
  this.file = img.file || null;
  this.url = img.url || null;
  this.shortid = img.shortid || shortid.generate();
  this.state = img.state || 0;
  this.progress = img.progress || 0;

  // Methods
  this.getUrl = () => {
    const url = this.file
      ? window.URL.createObjectURL(this.file)
      : this.url || null;
    return url;
  };

  this.getSmallestThumbUrl = () => {
    if (this.thumbnails && Object.keys(this.thumbnails)) {
      return this.thumbnails[Math.min.apply(null, Object.keys(this.thumbnails))];
    }
    return this.getUrl();
  }

  this.getBiggestThumbUrl = () => {
    if (this.thumbnails && Object.keys(this.thumbnails)) {
      return this.thumbnails[Math.max.apply(null, Object.keys(this.thumbnails))];
    }
    return this.getUrl();
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
