import pug from 'pug';
import path from 'path';
import { slugger, logoURL } from 'src/config/constants';
import writefile from 'src/server/modules/writefile';
import webpackManifest from 'src/server/modules/webpack-manifest';

/**
 * Build a single post based on a post object
 * @param {Post} post - The current post
 * @param {Post} nextPost - Next post in line for the preview
 * @returns {Promise} Resolves when the file is written to disk
 */
export const buildPost = (post, nextPost) => {
  if (!post) throw new Error(`Post with id ${post} not found, can't touch this.`);

  const filePath = `public/gschichte/${slugger(post.title)}.html`;
  const html = pug.renderFile(path.join(process.cwd(), 'src/server/views/post.pug'), {
    post,
    nextPost,
    logoURL: logoURL(),
    webpack: webpackManifest(),
  });

  return writefile(filePath, html);
}

/**
 * Buils all posts and saves them to disk
 *
 * @param {array<Post>} posts Array of posts
 * @returns {Promise} Resolves when all posts are written
 */
export const buildPosts = (posts) => {
  if (!posts || posts.length === 0) return Promise.reject(Error(`buildAllPosts failed, parameter was ${posts}`));
  const fns = [];
  posts.reduce((post, nextPost) => {
    fns.push(buildPost(post, nextPost));
    return nextPost;
  });
  return Promise.all(fns);
}
