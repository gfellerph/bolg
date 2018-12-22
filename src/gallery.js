import 'es6-promise/auto';
import mediumZoom from 'src/config/medium-zoom';
import lqip from 'src/modules/lqip';
import galleryLoader from 'src/modules/gallery-lazy-load';

const afterReplace = (lqipImage, originalImage) => {
  if (lqipImage) lqipImage.remove();
  mediumZoom(originalImage);
};

window.addEventListener('DOMContentLoaded', () => {
  galleryLoader({
    afterInsert(lastPost) {
      lqip({
        selectorRoot: lastPost,
        rootMargin: '0px',
        afterReplace,
      })
    },
  });
  lqip({
    afterReplace,
  });
});
