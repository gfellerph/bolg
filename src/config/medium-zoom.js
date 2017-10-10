import mediumZoom from 'medium-zoom';

export default function () {
  return mediumZoom('.container img:not([data-no-zoom])', {
    margin: 24,
    scrollOffset: 120,
  });
}
