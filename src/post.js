import mediumZoom from 'src/config/medium-zoom';
import drawing from 'src/modules/drawing';
import arrayFrom from 'array.from/polyfill';
import { setBookmark } from 'src/modules/bookmark';

Array.from = arrayFrom();

window.addEventListener('unload', () => {
  setBookmark();
});

window.addEventListener('DOMContentLoaded', () => {
  mediumZoom();
  drawing();
});
