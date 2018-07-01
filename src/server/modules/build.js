import pug from 'pug';
import path from 'path';
import rimraf from 'rimraf';
import { slugger, logoURL } from 'src/config/constants';
import writefile from 'src/server/modules/writefile';
import deleteFile from 'src/server/modules/deleteFile';
import webpackManifest from 'src/server/modules/webpack-manifest';
import splitItems from 'src/modules/split-items';

const views = path.join(process.cwd(), 'src/server/views');

/**
 * Build a partial gallery post and return the compiled html
 * @param {Object} post A post object
 */
export const buildGalleryPost = (post) => {
  const images = splitItems(post.images);
  return pug.renderFile(`${views}/partials/gallery-post.pug`, {
    post,
    images,
  });
}

export const buildGallery = (posts) => {
  const filePath = 'public/bilder.html';

  // Split images in each post into two columns
  const orderedPosts = posts.map((post) => {
    const orderedImages = splitItems(post.images);
    return { ...post.toObject(), images: orderedImages };
  });

  const html = pug.renderFile(`${views}/gallery.pug`, {
    orderedPosts,
    logoURL: logoURL(),
    webpack: webpackManifest(),
  });

  return writefile(filePath, html);
}

/**
 * Build the index page
 * @param {array<Post>} posts Array of posts to be rendered
 * @returns {Promise} Resolves when index was written to disk
 */
export const buildIndex = (posts) => {
  const filePath = 'public/index.html';
  const html = pug.renderFile(`${views}/index.pug`, {
    posts,
    logoURL: logoURL(),
    webpack: webpackManifest(),
  });
  return writefile(filePath, html);
}

/**
 * Build a single post based on a post object
 * @param {Post} post - The current post
 * @param {Post} nextPost - Next post in line for the preview
 * @returns {Promise} Resolves when the file is written to disk
 */
export const buildPost = (post, nextPost) => {
  if (!post) return Promise.reject(Error('buildPost failed, no post to build.'));

  const filePath = `public/gschichte/${slugger(post.title)}.html`;
  const html = pug.renderFile(`${views}/post.pug`, {
    post,
    nextPost,
    logoURL: logoURL(),
    webpack: webpackManifest(),
  });

  return writefile(filePath, html);
}

/**
 * Delete post from published folder
 */
export const unbuildPost = (post) => {
  const filepath = `public/gschichte/${slugger(post.title)}.html`;
  return deleteFile(filepath);
}

/**
 * Builds all posts and saves them to disk
 * @param {array<Post>} posts Array of posts
 * @returns {Promise} Resolves when all posts are written
 */
export const buildPosts = (posts) => {
  if (!posts || posts.length === 0) return Promise.reject(Error(`buildAllPosts failed, parameter was ${posts}`));
  const fns = [];
  posts.reduce((nextPost, post) => {
    fns.push(buildPost(post, nextPost));
    return post;
  }, null);
  return Promise.all(fns);
}

/**
 * Build a single personalized email, ready to be sent
 * @param {Post} post The post to notify the subscriber about
 * @param {Subscriber} subscriber The subscriber object
 * @returns {String} Compiled HTML mail template
 */
export const buildNotificationMail = (post, subscriber) => {
  const html = pug.renderFile(`${views}/notification-mail.pug`, {
    post,
    subscriber,
    logoURL: logoURL(),
    webpack: webpackManifest(),
  });
  return html;
}

export const cleanAll = () => Promise.all([
  () => new Promise(resolve => rimraf('public/gschichte', resolve)),
  deleteFile('public/index.html'),
  deleteFile('public/bilder.html'),
]);

export const rebuild = posts => cleanAll()
  .then(() => Promise.all([
    buildGallery(posts),
    buildIndex(posts),
    buildPosts(posts),
  ]));
