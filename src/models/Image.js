import cuid from 'cuid';
import {storage} from '@/config/firebase';

export default function Image(img = {}) {
  this.file = img.file || null;
  this.downloadURL = img.downloadURL || null;
  this.id = img.id || cuid();

  // Methods
  this.dataURL = function () {
    if (!this.file) throw new Error('Can\'t create dataURL, no file specified');
    return window.URL.createObjectURL(this.file);
  };
  this.put = function () {
    if (!this.file) throw new Error('Can\'t upload image, no file specified');

    return storage
      .ref(`/gallery/${this.id}`)
      .put(this.file);
  };
}