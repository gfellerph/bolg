import shortid from 'shortid';
import { constructThumborUrl } from 'src/config/constants';

export default function Image(img = {}) {
  this._id = img._id || undefined;
  this.file = img.file || null;
  this.url = img.url || null;
  this.shortid = img.shortid || shortid.generate();
  this.state = img.state || 0;
  this.progress = img.progress || 0;
  this.ratio = img.ratio || undefined;

  // Methods
  this.getUrl = () => {
    const url = this.file
      ? window.URL.createObjectURL(this.file)
      : this.url || null;
    return url;
  };

  this.getBlobOrSmallestThumb = () => {
    if (this.file) return window.URL.createObjectURL(this.file);
    return this.getThumbnail(160);
  }

  this.getThumbnail = size => constructThumborUrl(this.url, { width: size });
  this.getBlurryThumb = () => constructThumborUrl(this.url, {
    width: 20,
    filters: {
      blur: 2,
    },
  });
}
