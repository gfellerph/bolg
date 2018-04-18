import mediumZoom from 'src/config/medium-zoom';
import lqip from 'src/modules/lqip';

window.addEventListener('DOMContentLoaded', () => {
  // Run medium zoom
  // mediumZoom();
  lqip({
    afterReplace: (lqipImage, originalImage) => {
      if (lqipImage) lqipImage.remove();
      mediumZoom(originalImage);
    },
  });
});
