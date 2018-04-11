import shortid from 'shortid';
import Post from 'src/models/PostModel';
import s3 from 'src/config/s3';
import { database } from 'src/config/firebase-admin';
import { getExtension, replaceAll, getImage, types } from 'src/server/migrations/migrate-images';

/* eslint no-console:0 */
export const get = (req, res, next) => {
  const ref = database.ref('/posts');
  ref.once('value', async (val) => {
    // Prepare for a clean migration
    await Post.collection.drop();

    // Loop through posts
    const posts = Object.values(val.val()).slice(1, 10);
    console.log(`Starting to migrate ${posts.length} posts`);
    const newPosts = await Promise.all(posts.map(async (post) => {
      delete post.id;
      delete post.author;

      post.postDate = post.created;

      // If post was published, set published markdown
      if (typeof new Date(post.lastPublished) === 'object') {
        post.publishedMarkdown = post.markdown;
      }

      // Convert images
      post.images = await Promise.all(post.images.map(async (image) => {
        delete image.thumbnails;

        // Keep track of the original id
        image.name = image.id;

        if (!image.downloadURL) return image;

        // Where does the image come from?
        if (image.downloadURL.indexOf('googleapis') >= 0) {
          // Image from google
          image.shortid = shortid.generate();
          const { headers, body } = await getImage(image.downloadURL);
          const extension = types[headers['content-type']];
          const Key = `i/${image.shortid}.${extension}`;
          const Url = `https://adie.bisnaer.ch/${Key}`;
          image.url = Url;
          await s3.putObject({
            Bucket: 'adie.bisnaer.ch',
            Key,
            Body: body,
            ContentType: headers['content-type'],
          }).promise();
        } else if (image.downloadURL.indexOf('cloudfront') >= 0) {
          // Image from s3
          // Image has already the right name but needs an extension and new location
          // getExtension -> rename & copy -> replace all occurences in markdown
          const extension = await getExtension(image.downloadURL);
          const Key = `i/${image.id}.${extension}`;
          const Url = `https://adie.bisnaer.ch/${Key}`;
          await s3.copyObject({
            Bucket: 'adie.bisnaer.ch',
            CopySource: `bolg/i/${image.id}`,
            Key,
            ContentType: types[extension],
          }).promise();
          image.url = Url;
          image.shortid = image.id;
          image.name = image.id;
        } else if (image.downloadURL.indexOf('adie.bisnaer.ch') >= 0) {
          // Already right?
          console.log(`WIERD: ${image.downloadURL}`);
          image.url = image.downloadURL;
        }

        post.markdown = replaceAll(post.markdown, image.downloadURL, image.url);
        return image;
      }));

      // Convert title image
      if (post.titleImage) {
        [post.titleImage] = post.images.filter(image => image.name === post.titleImage.id);
      } else {
        [post.titleImage] = post.images;
      }

      // Convert drawings
      if (post.drawings) {
        post.drawings = await Promise.all(Object.keys(post.drawings).map(async (name) => {
          // const [name] = drawing;
          const drawingShortId = shortid.generate();
          const Key = `d/${drawingShortId}.png`;
          const url = `https://adie.bisnaer.ch/${Key}`;
          await s3.copyObject({
            Bucket: 'adie.bisnaer.ch',
            CopySource: `bolg/drawings/${name}.png`,
            Key,
            ContentType: 'image/png',
          }).promise();
          return {
            shortid: drawingShortId,
            url,
            name,
          };
        }));
      }
      return new Post(post);
    }));

    Promise.all(newPosts.map(post => post.save().then(() => console.log(`Post ${post.title} migrated`))))
      .then(() => res.json(newPosts))
      .catch(err => next(err));
  });
}

export const post = (req, res) => {
  res.send('todo');
}
