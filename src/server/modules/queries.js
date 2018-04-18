import Post from 'src/models/PostModel';
import Subscriber from 'src/models/SubscriberModel';

export const publishedPosts = () => Post.find({
  lastPublished: { $ne: null },
  publishedMarkdown: { $ne: '' },
})
  .sort('-postDate');

export const post = id => Post.findOne({
  _id: id,
});

export const subscribers = () => Subscriber.find({});

export const nextPost = postDate => Post.findOne({
  postDate: { $gt: postDate },
})
  .sort('postDate');
