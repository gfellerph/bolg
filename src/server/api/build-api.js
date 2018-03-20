import * as Builder from 'src/server/modules/build';
import * as Queries from 'src/server/modules/queries';

// Build the index page
export const buildIndex = async (req, res, next) => {
  const posts = await Queries.publishedPosts();

  return Builder.buildIndex(posts)
    .then(() => res.send('OK'))
    .catch(err => next(err));
}

// Build a single post
export const buildPost = async (req, res, next) => {
  const post = await Queries.post(req.params.id);
  const nextPost = await Queries.nextPost(post.postDate);

  return Builder.buildPost(post, nextPost)
    .then(() => res.send('OK'))
    .catch(err => next(err));
}

// Build all posts
export const buildPosts = async (req, res, next) => {
  // Find all published posts
  const posts = await Queries.publishedPosts();

  return Builder.buildPosts(posts)
    .then(() => res.send('OK'))
    .catch(err => next(err));
}
