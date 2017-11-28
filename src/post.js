import mediumZoom from 'src/config/medium-zoom';
import drawing from 'src/modules/drawing';
import { setBookmark } from 'src/modules/bookmark';

if (window.location.href.indexOf('bolg.html') <= 0) {
  window.addEventListener('unload', () => {
    setBookmark();
  });
  window.addEventListener('DOMContentLoaded', () => {
    mediumZoom();
    drawing();
  });
}
