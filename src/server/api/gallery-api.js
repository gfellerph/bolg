import Post from 'src/models/PostModel';
import { buildGalleryPost } from 'src/server/modules/build';

export default (req, res, next) => {
  Post.paginate({}, {
    page: req.query.page,
    limit: req.query.limit,
    sort: '-postDate',
    select: 'title images postDate',
  })
    .then((data) => {
      const posts = data.docs.map(post => buildGalleryPost(post));
      res.send(posts.join());
    })
    .catch(err => next(err));
}
