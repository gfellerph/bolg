import mediumZoom from 'src/config/medium-zoom';
import drawing from 'src/modules/drawing';
// TODO: Remove babel-polyfill as soon as #34 on medium-zoom gets resolved!
import 'babel-polyfill';
import { setBookmark } from 'src/modules/bookmark';

window.addEventListener('unload', () => {
  setBookmark();
});

window.addEventListener('DOMContentLoaded', () => {
  mediumZoom();
  drawing();
});
