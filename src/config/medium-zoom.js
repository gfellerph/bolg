import mediumZoom from 'medium-zoom';

export default function () {
  return mediumZoom('.container img', {
    margin: 24,
    scrollOffset: 120,
  });
}
