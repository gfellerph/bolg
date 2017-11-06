import mediumZoom from '@/config/medium-zoom';
import drawing from '@/modules/drawing';
import { setBookmark } from '@/modules/bookmark';

if (window.location.href.indexOf('bolg.html') <= 0) {
  window.addEventListener('unload', () => {
    console.log('unload');
    setBookmark();
  });
  window.addEventListener('DOMContentLoaded', () => {
    mediumZoom();
    drawing();
  });
}
