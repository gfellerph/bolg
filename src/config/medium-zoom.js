import mediumZoom from 'medium-zoom';

export default function (selector = '.container img:not([data-no-zoom])') {
  const zoom = mediumZoom(selector, {
    margin: 0,
    scrollOffset: 48,
  });

  return zoom;
}
