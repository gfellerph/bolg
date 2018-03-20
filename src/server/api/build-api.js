import Post from 'src/models/PostModel';
import * as Builder from 'src/server/modules/build';

// Build the index page
export const buildIndex = async (req, res, next) => {
  const posts = await Post.find({
    lastPublished: { $ne: null },
    publishedMarkdown: { $ne: '' },
  })
    .sort('postDate');

  return Builder.buildIndex(posts)
    .then(() => res.send('OK'))
    .catch(err => next(err));
}

// Build a single post
export const buildPost = async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.id })
    .catch(err => next(err));
  const nextPost = await Post.findOne({ postDate: { $gt: post.postDate } }).sort('postDate');

  return Builder.buildPost(post, nextPost)
    .then(() => res.send('OK'))
    .catch(err => next(err));
}

// Build all posts
export const buildPosts = async (req, res, next) => {
  // Find all published posts
  const posts = await Post.find({
    lastPublished: { $ne: null },
    publishedMarkdown: { $ne: '' },
  })
    .sort('postDate');

  return Builder.buildPosts(posts)
    .then(() => res.send('OK'))
    .catch(err => next(err));
}
