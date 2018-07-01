import Post from 'src/models/PostModel';

export default (req, res, next) => {
  console.log(req.query);
  Post.paginate({}, {
    page: req.query.page,
    limit: req.query.limit,
    sort: '-postDate',
    select: 'title images postDate',
  })
    .then((data) => {
      res.json(data.docs);
    })
    .catch(err => next(err));
}
