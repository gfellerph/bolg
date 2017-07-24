import moment from 'moment';
import Post from '@/models/Post';
import { database } from '@/config/firebase';
import { marked, description, excerpt } from '@/config/markdown';

export default (postToBeautify) => {
  if (!postToBeautify) throw new Error(`Post to beautify was ${postToBeautify}`);

  const post = new Post(postToBeautify);
  const postRef = database.ref(``)
  const publishRef = database.ref(`/published/${post.id}`);

  post.postUrl = post.url;
  post.postLiveUrl = post.liveUrl;
  post.postTitle = post.title;
  post.created = moment(post.created, 'x').format('DD.MM.YYYY');
  post.lastEdited = moment(post.lastEdited, 'x').format('DD.MM.YYYY');
  post.lastSaved = moment(Date.now(), 'x').format('DD.MM.YYYY');
  post.lastPublished = moment(Date.now(), 'x').format('DD.MM.YYYY');
  post.html = marked(post.markdown);
  post.description = description(post.markdown);
  post.excerpt = excerpt(post.markdown);

  return post;
}
