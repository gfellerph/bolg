import Post from 'src/models/PostModel';

export const getPost = (req, res, next) => {
  return Post.findOne({
    _id: req.params.id,
  })
    .then(post => res.json(post))
    .catch(err => next(err));
}

export const postPost = (req, res, next) => {
  const post = new Post(req.body);
  return post.save()
    .then(newPost => res.json(newPost))
    .catch(err => next(err));
}

export const putPost = (req, res, next) => {
  return Post.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  })
    .then(newPost => res.json(newPost))
    .catch(err => next(err));
}

export const deletePost = (req, res, next) => {
  return Post.remove({
    _id: req.params.id,
  })
    .then(() => res.send('OK'))
    .catch(err => next(err));
}

export const getPosts = (req, res, next) => {
  return Post.find({})
    .then(posts => res.json(posts))
    .catch(err => next(err));
}
