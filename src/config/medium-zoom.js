import mediumZoom from 'medium-zoom';

export default function () {
  const zoom = mediumZoom('.container img:not([data-no-zoom])', {
    margin: 0,
    scrollOffset: 48,
  });

  return zoom;
}
