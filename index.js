const marked = require('marked');
const fs = require('fs');
const request = require('request');

const readme = fs.readFileSync('README.md', 'utf-8');
const html = marked(readme, {sanitize: true});
fs.writeFileSync('public/readme.html', html, {encoding: 'utf-8'});