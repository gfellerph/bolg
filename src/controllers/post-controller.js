import Post from 'src/models/Post';
import { formatDate } from 'src/config/constants';
import { marked, excerpt, description } from 'src/config/markdown';

export default (database) => {
  const postRef = id => database.ref(`/posts/${id}`);
  const publishedRef = id => database.ref(`/published/${id}`);

  const beautify = (post) => {
    const postCopy = new Post(post);
    const images = post.images.reduce((acc, image) => {
      acc[image.id] = image.thumbnails;
      return acc;
    }, {});
    postCopy.postUrl = post.url;
    postCopy.postLiveUrl = post.liveUrl;
    postCopy.postTitle = post.title;
    postCopy.created = formatDate(post.created);
    postCopy.lastEdited = formatDate(post.lastEdited);
    postCopy.lastSaved = formatDate(post.lastSaved);
    postCopy.lastPublished = formatDate(post.lastPublished);
    postCopy.html = marked(post.markdown, { images });
    postCopy.description = description(post.markdown);
    postCopy.excerpt = excerpt(post.markdown);
    return postCopy;
  }

  const set = (post) => {
    const postData = post.normalize();
    postData.lastSaved = Date.now();
    return postRef(post.id).set(postData).then(() => postData);
  };

  const remove = post => Promise.all([
    publishedRef(post.id).remove(),
    postRef(post.id).remove(),
  ]);

  const publish = (post) => {
    const postCopy = new Post(post);

    postCopy.lastSaved = Date.now();
    postCopy.lastPublished = Date.now();

    const postData = postCopy.normalize();
    const publishData = beautify(postCopy).normalize();

    return Promise.all([
      postRef(post.id).set(postData),
      publishedRef(post.id).set(publishData),
    ]);
  };

  const unpublish = (post) => {
    const postData = post.normalize();
    postData.lastPublished = null;
    return Promise.all([
      set(post),
      publishedRef(post.id).remove(),
    ]);
  };

  return {
    set,
    remove,
    publish,
    unpublish,
    beautify,
  }
}
