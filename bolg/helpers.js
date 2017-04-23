
// Create "this-is-a-post" from "This is a Post"
exports.slugger = str => str.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');