import Post from 'src/models/PostModel';

export default function (req, res) {
  Post.find({})
    .then((posts) => {
      const images = posts.reduce((imgAcc, post) => imgAcc.concat(post.images), []);
      const imgsWithoutRatio = images.filter(img => img.ratio === undefined);
      console.log(imgsWithoutRatio.length, Object.keys(imgsWithoutRatio[0]))
      return Promise.all(imgsWithoutRatio.map(async (img) => {
        const ratio = await img.getRatio();
        img.set({ ratio });
        return img.__parent.save();
      }));
    })
    .then((imgs) => {
      res.send(imgs);
    })
}
