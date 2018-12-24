import mediumZoom from 'medium-zoom';
import drawing from 'src/modules/drawing';
import lqip from 'src/modules/lqip';
import { setBookmark } from 'src/modules/bookmark';

window.addEventListener('unload', () => {
  setBookmark();
});

window.addEventListener('DOMContentLoaded', () => {
  // Zoom every image but lqips
  mediumZoom();
  drawing();
  lqip({
    afterReplace: (placeholder, original) => {
      // Add zoom to original lqips
      mediumZoom(original);
    },
  })
});
