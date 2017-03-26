const marked = require('marked');
const fs = require('fs');
const request = require('request');
const hbsTemplates = require('./config/handlebars');
const webpackManifest = require('../webpack.manifest.json');
const firebase = require('./config/firebase');
const mkdirp = require('mkdirp');
const dirname = require('path').dirname;

// Create "this-is-a-post" from "This is a Post"
function slugger(str) {
  return str.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
}


function rebuildAll() {

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
          css: webpackManifest['/app.css']
        });

        mkdirp(dirname(filePath), function (err) {
          if (err) reject(err);

          fs.writeFile(filePath, html, {encoding: 'utf-8'}, resolve);
        });
      })
      .catch(reject);
  });
}

module.exports = {
  rebuildAll() {},
  rebuild,
}