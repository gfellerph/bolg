import Post from 'src/models/PostModel';
import { buildPost, buildPosts } from 'src/server/modules/post';

export const getPost = (req, res, next) => Post.findOne({
  _id: req.params.id,
})
  .then(post => res.json(post))
  .catch(err => next(err));

export const postPost = (req, res, next) => new Post(req.body).save()
  .then(newPost => res.json(newPost))
  .catch(err => next(err));

export const putPost = (req, res, next) => Post.findByIdAndUpdate(req.params.id, {
  $set: req.body,
})
  .then(newPost => res.json(newPost))
  .catch(err => next(err));

export const deletePost = (req, res, next) => Post.remove({
  _id: req.params.id,
})
  .then(() => res.send('OK'))
  .catch(err => next(err));

export const getPosts = (req, res, next) => Post.find({})
  .then(posts => res.json(posts))
  .catch(err => next(err));

// Build a single post
export const build = async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.id })
    .catch(err => next(err));
  const nextPost = await Post.findOne({ postDate: { $gt: post.postDate } }).sort('postDate');

  return buildPost(post, nextPost)
    .then(() => res.send('OK'))
    .catch(err => next(err));
}

// Build all posts
export const buildAll = async (req, res, next) => {
  // Find all published posts
  const posts = await Post.find({
    publishedDate: { $ne: null },
    publishedMarkdown: { $ne: '' },
  })
    .sort('postDate');

  return buildPosts(posts)
    .then(() => res.send('OK'))
    .catch(err => next(err));
}
