import Post from 'src/models/PostModel';
import { database } from 'src/config/firebase-admin';

export const get = (req, res) => {
  const ref = database.ref('/posts');
  ref.once('value', (val) => {
    const posts = Object.values(val.val());
    const newPosts = posts.map((post) => {
      delete post.id;
      delete post.author;
      const postJson = JSON.stringify(post);
      const newPostJson = postJson.replace(/d3ieg3cxah9p4i\.cloudfront\.net/g, 'adie.bisnaer.ch');
      return new Post(JSON.parse(newPostJson));
    });
    res.json(newPosts);
  });
}

export const post = (req, res) => {
  res.send('todo');
}
