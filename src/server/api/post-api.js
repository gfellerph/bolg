import Post from 'src/models/PostModel';
import { removeAllHtml } from 'src/config/constants';

const extractTitle = (markdown) => {
  const match = markdown.match(/^# .+/gm);
  const title = match
    ? removeAllHtml(match[0].replace('# ', '').replace(/\*.+\*/g, ''))
    : '';
  return title;
}

export const getPost = (req, res, next) => Post.findOne({
  _id: req.params.id,
})
  .then(post => res.json(post))
  .catch(err => next(err));

export const postPost = (req, res, next) => {
  if (req.body.markdown) req.body.title = extractTitle(req.body.markdown);
  new Post(req.body).save()
    .then(newPost => res.json(newPost))
    .catch(err => next(err));
}

export const putPost = (req, res, next) => {
  if (req.body.markdown) req.body.title = extractTitle(req.body.markdown);

  Post
    .findByIdAndUpdate(req.params.id, {
      $set: req.body,
    }, {
      new: true,
      runValidators: true,
    })
    .then(newPost => res.json(newPost))
    .catch(err => next(err));
}

export const deletePost = (req, res, next) => Post.remove({
  _id: req.params.id,
})
  .then(() => res.send('OK'))
  .catch(err => next(err));

export const getPosts = (req, res, next) => Post.find({})
  .sort('-postDate')
  .then(posts => res.json(posts))
  .catch(err => next(err));
