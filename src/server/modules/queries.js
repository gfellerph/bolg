import Post from 'src/models/PostModel';

export const publishedPosts = () => Post.find({
  lastPublished: { $ne: null },
  publishedMarkdown: { $ne: '' },
})
  .sort('postDate');

export const post = id => Post.findOne({
  _id: id,
});

export const nextPost = postDate => Post.findOne({
  postDate: { $gt: postDate },
})
  .sort('postDate');
