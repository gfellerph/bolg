const marked = require('marked');
const hbsTemplates = require('./config/handlebars');
const firebase = require('./config/firebase');
const moment = require('moment');
const writefile = require('./writefile');
const Post = require('./models/Post');
const fs = require('fs');
const slugger = require('./helpers').slugger;
const webpackManifest = require('./config/webpack.manifest.json');
const renderSass = () => Promise.resolve();

function logoURL() {
  return `/img/bisnaer${parseInt(Math.random() * 31, 10)}.png`;
}

function rebuildIndex() {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref('/published')
      .once('value', (snapshot) => {
        const val = snapshot.val();
        const filePath = 'public/index.html';
        if (!val) return resolve(new Error('There are no posts to build an overview with.'));
        let posts = Object.keys(val).map(post => new Post(val[post]));

        // Post transforms
        posts = posts.map(post => post.beautify());

        return renderSass()
          .then(result => hbsTemplates.index({
            posts,
            logoURL: logoURL(),
            webpack: webpackManifest,
          }))
          .then(html => writefile(filePath, html))
          .then(resolve);
      });
  });
}

// Fetch post data from firebase and rebuild a single post
function rebuild(id) {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(`/published/${id}`)
      .once('value', (snapshot) => {
        const post = new Post(snapshot.val());
        if (!post) return reject(new Error(`Post with id ${id} not found, can't touch this.`));
        const filePath = `public/posts/${slugger(post.title)}.html`;

        return renderSass()
          .then(result => hbsTemplates.post({
            markdown: marked(post.markdown, {
              sanitize: false,
            }),
            logoURL: logoURL(),
            webpack: webpackManifest,
          }))
          .then(html => writefile(filePath, html))
          .then(resolve);
      })
      .catch(reject);
  });
}

function rebuildAll() {
  const blogTasks = [];

  firebase
  .database()
  .ref('/published')
  .once('value', (snapshot) => {
    const val = snapshot.val();
    if (!val) return new Error('There are no posts to build');
    const posts = Object.keys(val);

    for (let i = 0; i < posts.length; i += 1) {
      blogTasks.push(rebuild(posts[i]));
    }
  });

  return Promise.all(blogTasks);
}

function unPublish(id) {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(`/posts/${id}`)
      .once('value', (snapshot) => {
        const val = snapshot.val();
        if (!val) return new Error('This post is deleted or something');
        const post = new Post(val);
        const filepath = `public/posts/${slugger(post.title)}.html`;
        fs.unlink(filepath, (err) => {
          if (err && err.code === 'ENOENT') return resolve();
          if (err) reject(err);
          return resolve();
        });
      });
  });
}

module.exports = {
  rebuildIndex,
  rebuildAll,
  rebuild,
  unPublish,
};
