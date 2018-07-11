import mediumZoom from 'src/config/medium-zoom';
import lqip from 'src/modules/lqip';
import galleryLoader from 'src/modules/gallery-lazy-load';

window.addEventListener('DOMContentLoaded', () => {
  galleryLoader({
    afterInsert(lastPost) {
      lqip({
        selectorRoot: lastPost,
        afterReplace: (lqipImage, originalImage) => {
          if (lqipImage) lqipImage.remove();
          mediumZoom(originalImage);
        },
      })
    },
  });
  lqip({
    afterReplace: (lqipImage, originalImage) => {
      if (lqipImage) lqipImage.remove();
      mediumZoom(originalImage);
    },
  });
});
