import mediumZoom from 'src/config/medium-zoom';
import drawing from 'src/modules/drawing';
import 'babel-polyfill';
import { setBookmark } from 'src/modules/bookmark';

window.addEventListener('unload', () => {
  setBookmark();
});

window.addEventListener('DOMContentLoaded', () => {
  mediumZoom();
  drawing();
});
