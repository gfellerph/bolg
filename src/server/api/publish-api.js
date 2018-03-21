import * as Builder from 'src/server/modules/build';
import * as Queries from 'src/server/modules/queries';

export const publish = async (req, res, next) => {
  const post = await Queries.post(req.params.id);
  post.lastPublished = Date.now();
  post.publishedMarkdown = post.markdown;
  post.save()
    .then(Queries.publishedPosts)
    .then(Builder.rebuild)
    .then(() => res.send('OK'))
    .catch(err => next(err));
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
