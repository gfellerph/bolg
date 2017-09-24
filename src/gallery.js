import mediumZoom from '@/config/medium-zoom';

window.addEventListener('DOMContentLoaded', () => {
  const zoomer = mediumZoom();

  if (!zoomer) return;

  zoomer.addEventListeners('shown', (event) => {
    const img = event.currentTarget;

    if (!img.hasAttribute('data-hd')) return;

    img.setAttribute('data-lowres', img.getAttribute('src'));
    img.setAttribute('src', img.getAttribute('data-hd'));
  });

  zoomer.addEventListeners('hide', (event) => {
    const img = event.currentTarget;

    if (!img.hasAttribute('data-lowres')) return;

    img.setAttribute('src', img.getAttribute('data-lowres'));
  });
});
