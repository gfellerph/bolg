import Post from '@/models/Post';
import { database } from '@/config/firebase';

export default Object.defineProperty(Post, 'postRef', {
  get() {
    return database.ref(`/posts/${this.id}`);
  },
});

Object.defineProperty(Post, 'publishRef', {
  get() {
    return database.ref(`/published/${this.id}`);
  },
});
