import * as Builder from 'src/server/modules/build';
import Post from 'src/models/PostModel';
import * as Queries from 'src/server/modules/queries';

export const publish = async (req, res, next) => {
  const post = await Queries.post(req.params.id);
  const newPost = await Post
    .findOneAndUpdate({
      _id: req.params.id,
    }, {
      $set: {
        lastPublished: Date.now(),
        publishedMarkdown: post.markdown,
      },
    }, {
      new: true,
      runValidators: true,
    })
    .catch(err => next(err));

  await Queries.publishedPosts()
    .then(Builder.rebuild)
    .catch(err => next(err));

  res.json(newPost);
}

export const unpublish = (req, res, next) => {
  Post.update(
    {
      _id: req.params.id,
    },
    {
      $set: {
        lastPublished: null,
        publishedMarkdown: '',
      },
    }, {
      runValidators: true,
    },
  )
    .then(Queries.publishedPosts)
    .then(Builder.rebuild)
    .then(() => res.send('OK'))
    .catch(err => next(err));
}
