import Post from 'src/models/PostModel';
import { buildGalleryPost } from 'src/server/modules/build';

export default (req, res, next) => {
  Post.paginate({
    lastPublished: { $ne: null },
    publishedMarkdown: { $ne: '' },
  }, {
    page: req.query.page || 0,
    limit: req.query.page ? req.query.limit : Number.MAX_SAFE_INTEGER,
    sort: '-postDate',
    select: 'title images postDate',
  })
    .then((data) => {
      if (data.results === 0 || data.docs.length === 0) {
        res.status(404).send('Not found');
      } else {
        const posts = data.docs.map(post => buildGalleryPost(post));
        res.send(posts.join());
      }
    })
    .catch(err => next(err));
}
