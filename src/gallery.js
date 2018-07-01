import mediumZoom from 'src/config/medium-zoom';
import lqip from 'src/modules/lqip';

window.addEventListener('DOMContentLoaded', () => {
  lqip({
    afterReplace: (lqipImage, originalImage) => {
      if (lqipImage) lqipImage.remove();
      mediumZoom(originalImage);
    },
  });
});
