import * as Builder from 'src/server/modules/build';
import * as Queries from 'src/server/modules/queries';

export const publish = async (req, res, next) => {
  const post = await Queries.post(req.params.id);
  post.lastPublished = Date.now();
  post.publishedMarkdown = post.markdown;
  const newPost = await post.save()
    .catch(err => next(err));

  await Queries.publishedPosts()
    .then(Builder.rebuild)
    .catch(err => next(err));

  res.json(newPost);
}

export const unpublish = async (req, res, next) => {
  const post = await Queries.post(req.params.id);
  post.lastPublished = null;
  post.publishedMarkdown = '';
  post.save()
    .then(Queries.publishedPosts)
    .then(Builder.rebuild)
    .then(() => res.send('OK'))
    .catch(err => next(err));
}
