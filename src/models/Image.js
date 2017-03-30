import cuid from 'cuid';
import {storage} from '@/config/firebase';

export default function Image(img = {}) {
  this.file = img.file || null;
  this.downloadURL = img.downloadURL || null;
  this.id = img.id || cuid();

  // Methods
  this.url = function () {
    return this.file 
      ? window.URL.createObjectURL(this.file)
      : this.downloadURL || null;
  };
  this.put = function () {
    if (!this.file) throw new Error('Can\'t upload image, no file specified');
    if (this.downloadURL) return new Promise((resolve, reject) => resolve({downloadURL: this.downloadURL}));
    
    return storage
      .ref(`/gallery/${this.id}`)
      .put(this.file);
  };
}