import moment from '@/config/moment';
import Post from '@/models/Post';
import { database } from '@/config/firebase';
import { marked, description, excerpt } from '@/config/markdown';

export const beautify = (postToBeautify) => {
  if (!postToBeautify) throw new Error(`Post to beautify was ${postToBeautify}`);

  const post = new Post(postToBeautify);

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

/**
 * Publish a post to the publish reference and save it in edit mode
 * @returns {Promise} Promise
 */
export const publish = (post) => {
  const postRef = database.ref(`/posts/${post.id}`);
  const publishRef = database.ref(`/published/${post.id}`);
  const postToPublish = new Post(post);

  postToPublish.lastSaved = Date.now();
  postToPublish.lastPublished = Date.now();

  return Promise.all([
    postRef.set(postToPublish.normalize()),
    publishRef.set(beautify(postToPublish).normalize()),
  ]);
}

/**
 * Unpublish a post. Delete the post from /published on firebase
 * @returns {Promise} Promise
 */
export const unpublish = (post) => {
  const postRef = database.ref(`/posts/${post.id}`);
  const publishRef = database.ref(`/published/${post.id}`);
  const postToUnpublish = new Post(post);

  postToUnpublish.lastPublished = null;

  return Promise.all([
    postToUnpublish.set(),
    publishRef.remove(),
  ]);
};

/**
 * Deletes a post for ever
 * @returns {Promise} Promise
 */
export const remove = (post) => {
  const postRef = database.ref(`/posts/${post.id}`);
  const publishRef = database.ref(`/published/${post.id}`);

  return Promise.all([
    publishRef.remove(),
    postRef.remove(),
  ]);
}
