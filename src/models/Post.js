import cuid from 'cuid';

/**
 * A blog post
 * @export
 * @param {Object} [post={}] Pass existing post data or leave empty to create a new post
 * @returns Post class object
 */
export default function Post(post = {}) {
  // Properties
  this.markdown = post.markdown || `# Post ${cuid()}`;
}
