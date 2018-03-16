import Post from 'src/models/PostModel';
import { database } from 'src/config/firebase-admin';

export const get = (req, res, next) => {
  const ref = database.ref('/posts');
  ref.once('value', (val) => {
    const posts = Object.values(val.val());
    const newPosts = posts.map((post) => {
      delete post.id;
      delete post.author;

      // Convert images
      post.images = post.images.map((image) => {
        if (image.downloadURL) image.url = image.downloadURL.replace(/d3ieg3cxah9p4i\.cloudfront\.net/g, 'adie.bisnaer.ch');
        image.name = image.id;

        // Convert image thumbnails
        image.thumbnails = Object.entries(image.thumbnails).map((thumbnail) => {
          const [key, url] = thumbnail;
          const newThumb = {};
          newThumb.name = image.name;
          newThumb.size = parseInt(key, 10);
          newThumb.url = url.replace(/d3ieg3cxah9p4i\.cloudfront\.net/g, 'adie.bisnaer.ch');
          return newThumb;
        });
        return image;
      });

      // Convert title image
      if (post.titleImage) {
        const idRegex = /\.([0-9]+)$|\.([0-9]+)\.[JjPp]|\.([0-9]+)x/g;
        const match = idRegex.exec(post.titleImage.url);
        const size = match ? match[1] || match[2] || match[3] : null;
        post.titleImage = {
          size,
          name: post.titleImage.id,
          url: post.titleImage.url.replace(/d3ieg3cxah9p4i\.cloudfront\.net/g, 'adie.bisnaer.ch'),
        }
      }

      // Convert drawings
      if (post.drawings) {
        post.drawings = Object.entries(post.drawings).map((drawing) => {
          const [name, url] = drawing;
          return {
            url: url.replace(/d3ieg3cxah9p4i\.cloudfront\.net/g, 'adie.bisnaer.ch'),
            name,
          };
        });
      }
      return new Post(post);
    });

    Promise.all(newPosts.map(post => post.save()))
      .then(() => res.json(newPosts))
      .catch(err => next(err));
  });
}

export const post = (req, res) => {
  res.send('todo');
}
