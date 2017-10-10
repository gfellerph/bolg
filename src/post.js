import mediumZoom from '@/config/medium-zoom';

function initCanvas() {
  const canvas = document.querySelector('#drawing');
  const clearButton = document.querySelector('.drawing__clear');
  const ctx = canvas.getContext('2d');
  const mouse = { x: 0, y: 0 };

  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000000';

  function paint() {
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
  }

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function setPosition(event) {
    const rect = canvas.getBoundingClientRect(); // abs. size of element
    const scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
    const scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
    const clientX = event.clientX ? event.clientX : event.touches[0].clientX;
    const clientY = event.clientY ? event.clientY : event.touches[0].clientY;

    mouse.x = (clientX - rect.left) * scaleX;
    mouse.y = (clientY - rect.top) * scaleY;
  }

  canvas.addEventListener('mousemove', setPosition, false);
  canvas.addEventListener('touchmove', setPosition, false);

  canvas.addEventListener('mousedown', () => {
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);

    canvas.addEventListener('mousemove', paint, false);
  }, false);

  canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    setPosition(event);
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);

    canvas.addEventListener('touchmove', paint, false);
  });

  canvas.addEventListener('touchend', () => {
    canvas.removeEventListener('touchmove', paint, false);
  }, false);

  canvas.addEventListener('mouseup', () => {
    canvas.removeEventListener('mousemove', paint, false);
  }, false);

  canvas.addEventListener('mouseleave', () => {
    canvas.removeEventListener('mousemove', paint, false);
  }, false);

  clearButton.addEventListener('click', clear);
}

const documentHeight = () => Math.max(
  document.body.scrollHeight,
  document.body.offsetHeight,
  document.documentElement.clientHeight,
  document.documentElement.scrollHeight,
  document.documentElement.offsetHeight,
);

function setBookmark() {
  const html = document.documentElement;
  const height = documentHeight();
  const postMeta = document.querySelector('meta[property="id"]');
  const postId = postMeta ? postMeta.getAttribute('content') : null;
  const scrollPosition = window.pageYOffset || html.scrollTop;
  const scrollPercent = scrollPosition / height;

  if (!window.localStorage) return;

  window.localStorage.setItem('bookmark', JSON.stringify({
    scrollPercent,
    url: window.location.href,
    postId,
  }));
}

function restoreBookmark() {
  if (!window.localStorage) return;

  const bookmark = JSON.parse(window.localStorage.getItem('bookmark'));
  if (bookmark && window.location.href === bookmark.url && window.location.hash === 'bookmark') {
    const height = documentHeight();
    const offset = height * bookmark.scrollPercent;
    if (window.scrollTo) window.scrollTo(0, offset);
  }
}

if (window.location.href.indexOf('bolg.html') <= 0) {
  window.onbeforeunload = setBookmark;
  window.onunload = setBookmark;
  window.addEventListener('load', restoreBookmark);
  window.addEventListener('DOMContentLoaded', () => {
    mediumZoom();
    initCanvas();
  });
}
