import cuid from 'cuid';
import { storage, database } from '@/config/firebase';

const getFileExtension = str => str.substring(str.lastIndexOf('.'), str.length);

export default function Image(img = {}) {
  this.file = img.file || null;
  this.downloadURL = img.downloadURL || null;
  this.thumbnails = img.thumbnails || null;
  this.id = img.id || cuid();
  this.lastModified = img.file ? img.file.lastModified : Date.now();

  const imagesRef = database.ref(`/images/gallery/${this.id}`);

  // Methods
  this.url = () => {
    return this.file
      ? window.URL.createObjectURL(this.file)
      : this.downloadURL || null;
  };

  this.put = () => {
    if (!this.file) throw new Error('Can\'t upload image, no file specified');
    if (this.downloadURL) return Promise.resolve({ downloadURL: this.downloadURL });

    return storage
      .ref(`/gallery/${this.id}${getFileExtension(this.file.name)}`)
      .put(this.file, { customMetadata: { id: this.id } });
  };

  this.getThumbnail = (width) => {
    return new Promise((resolve) => {
      imagesRef.child(width).once('value', snapshot => resolve(snapshot.val()));
    });
  }
}
