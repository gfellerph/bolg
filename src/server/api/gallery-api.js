import Post from 'src/models/PostModel';
import { buildGalleryPost } from 'src/server/modules/build';

export default (req, res, next) => {
  let dataRequest;
  if (req.query.page) {
    dataRequest = Post.paginate({}, {
      page: req.query.page,
      limit: req.query.limit,
      sort: '-postDate',
      select: 'title images postDate',
    })
      .then(data => data.docs)
  } else {
    dataRequest = Post
      .find({})
      .sort('-postDate')
      .select('title images postDate')
      .lean();
  }
  dataRequest
    .then((data) => {
      const posts = data.map(post => buildGalleryPost(post));
      res.send(posts.join());
    })
    .catch(err => next(err));
}
