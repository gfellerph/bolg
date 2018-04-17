import { database } from 'src/config/firebase-admin';
import Post from 'src/models/PostModel';

export default async function fixTitleImages(req, res) {
  const posts = database.ref('/posts');
  const mongoPosts = await Post.find();
  posts.once('value', (result) => {
    const firePosts = result.val();
    Object.values(firePosts).map(async (firePost) => {
      if (!firePost.titleImage) {
        console.log(firePost);
        return false;
      }
      return mongoPosts.map((mongoPost) => {
        const images = mongoPost.images.map((mongoPostImage) => {
          if (mongoPostImage.name === firePost.titleImage.id) {
            mongoPost.update({
              $set: {
                titleImage: {
                  shortid: mongoPostImage.shortid,
                  name: mongoPostImage.name,
                  url: mongoPostImage.url,
                  ratio: mongoPostImage.ratio,
                },
              },
            })
              .catch(console.log);
          }
          return mongoPostImage;
        })
        return images;
      })
    })
  })
  res.send('sosolala');
}
