import Post from 'src/models/PostModel';
import buildPost from 'src/server/modules/post';

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

/**
 * Build a single post
 *
 * @param {any} req Request object
 * @param {any} res Response object
 * @param {function} next Next function
 */
export const build = async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.id })
    .catch(err => next(err));
  const nextPost = await Post.findOne({ postDate: { $gt: post.postDate } }).sort('postDate');
  await buildPost(post, nextPost).catch(err => next(err));
  res.send('OK');
}

export const buildallpublished = async (req, res, next) => {
  // Find all published posts
  const posts = await Post.findOne({
    publishedDate: { $ne: null },
    publishedMarkdown: { $ne: '' },
  })
    .sort('postDate');

  // Wait for all posts to be biult
  const fns = [];
  posts.reduce((post, nextPost) => {
    fns.push(buildPost(post, nextPost));
    return nextPost;
  });

  await Promise.all(fns)
    .catch(err => next(err));

  res.send('OK');
}
