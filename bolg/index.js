const fs = require('fs');
const marked = require('marked');
const hbsTemplates = require('./config/handlebars');
const webpackManifest = require('../webpack.manifest.json');
const firebase = require('./config/firebase');
const dirname = require('path').dirname;
const moment = require('moment');
const writefile = require('./writefile');
const renderSass = require('./sass');

// Create "this-is-a-post" from "This is a Post"
function slugger(str) {
  return str.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
}

function logoURL() {
  return `/img/logo${parseInt(Math.random() * 13)}.png`;
}

function rebuildIndex() {
  return new Promise(function (resolve, reject) {
    firebase
      .database()
      .ref('/posts')
      .once('value', function (snapshot) {
        const val = snapshot.val();
        let posts = Object.keys(val).map(post => val[post]);

        if (posts.length == 0) return reject(new Error('There are no posts to build an overview with.'));

        // Post transforms
        posts = posts.map(post => {
          post.url = `/posts/${slugger(post.title)}`;
          post.created = moment(post.created).format('DD.MM.YYYY');
          post.lastEdited = moment(post.lastEdited).format('DD.MM.YYYY');
          post.lastSaved = moment(post.lastSaved).format('DD.MM.YYYY');
          post.lastPublished = moment(post.lastPublished).format('DD.MM.YYYY');
          post.description = marked(post.markdown.replace(/#+.+\n/gm, '').split(' ').slice(0, 20).join(' ') + '...');
          return post;
        });

        
        const filePath = 'public/posts/index.html';
        const html = hbsTemplates.index({
          posts,
          css: webpackManifest['/app.css']
        });

        writefile(filePath, html).then(resolve);
      });
  });
}

function rebuildAll() {
  let blogTasks = [];

  firebase
    .database()
    .ref('/posts')
    .once('value', function (snapshot) {
      const val = snapshot.val();
      const posts = Object.keys(val);

      for (index in posts) {
        blogTasks.push(rebuild(posts[index]));
      }
    });

    return Promise.all(blogTasks);
}

// Fetch post data from firebase and rebuild a single post
function rebuild(id) {
  return new Promise(function (resolve, reject) {
    firebase
      .database()
      .ref(`/posts/${id}`)
      .once('value', function (snapshot) {
        const post = snapshot.val();
        if (!post) return reject(new Error(`Post with id ${id} not found, can\'t touch this.`));

        const filePath = `public/posts/${slugger(post.title)}.html`;
        const html = hbsTemplates.post({
          markdown: marked(post.markdown, {sanitize: true}),
          logoURL: logoURL(),
          css: webpackManifest['/app.css']
        });

        writefile(filePath, html).then(resolve);
      })
      .catch(reject);
  });
}

module.exports = {
  rebuildIndex,
  rebuildAll,
  rebuild,
}