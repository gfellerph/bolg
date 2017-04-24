const marked = require('marked');
const hbsTemplates = require('./config/handlebars');
const firebase = require('./config/firebase');
const writefile = require('./writefile');
const Post = require('./models/Post');
const fs = require('fs');
const helpers = require('./helpers');
const webpackManifest = require('./config/webpack.manifest.json');

const slugger = helpers.slugger;
const logoURL = helpers.logoURL;
const publishedRef = firebase.database().ref('/published').orderByChild('created');

function buildIndex() {
  return new Promise((resolve) => {
    publishedRef.once('value', (snapshot) => {
      const val = snapshot.val();
      const filePath = 'public/index.html';
      if (!val) return resolve(new Error('There are no posts to build an overview with.'));
      let posts = Object.keys(val).map(post => new Post(val[post]));

      // Post transforms
      posts = posts.map(post => post.beautify());
      
      const html = hbsTemplates.index({
        posts,
        logoURL: logoURL(),
        webpack: webpackManifest,
      });
      writefile(filePath, html).then(resolve);
    });
  });
}

// Fetch post data from firebase and rebuild a single post
function publish(id) {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(`/published/${id}`)
      .once('value', (snapshot) => {
        const post = new Post(snapshot.val());
        if (!post) return reject(new Error(`Post with id ${id} not found, can't touch this.`));
        const filePath = `public/posts/${slugger(post.title)}.html`;

        const html = hbsTemplates.post({
          markdown: marked(post.markdown, {
            sanitize: true,
          }),
          logoURL: logoURL(),
          webpack: webpackManifest,
        });
        writefile(filePath, html).then(resolve);
      })
      .catch(reject);
  });
}

function publishAll() {
  const blogTasks = [];

  return new Promise((resolve, reject) => {
    publishedRef.once('value', (snapshot) => {
      const val = snapshot.val();
      if (!val) return new Error('There are no posts to build');
      const posts = Object.keys(val);

      for (let i = 0; i < posts.length; i += 1) {
        blogTasks.push(publish(posts[i]));
      }

      return Promise.all(blogTasks)
        .then(resolve)
        .catch(reject);
    });
  });
}

function unpublish(id) {
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

publishedRef.on('child_added', (snapshot) => {
  const post = snapshot.val();
  publish(post.id).then(buildIndex);
});

publishedRef.on('child_removed', (snapshot) => {
  const post = snapshot.val();
  unpublish(post.id).then(buildIndex);
});

publishedRef.on('child_changed', (snapshot) => {
  const post = snapshot.val();
  publish(post.id).then(buildIndex);
});

module.exports = {
  buildIndex,
  publishAll,
  publish,
  unpublish,
};
