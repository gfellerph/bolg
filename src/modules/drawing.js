import axios from 'axios';

export default function initCanvas() {
  const canvas = document.querySelector('#drawing');
  const clearButton = document.querySelector('.drawing__clear');
  const saveButton = document.querySelector('.drawing__save');
  const resultImage = document.querySelector('.drawing__result');
  const ctx = canvas.getContext('2d');
  const mouse = { x: 0, y: 0 };

  ctx.canvas.width = 300;
  ctx.canvas.height = 225;
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

  function startPath(event) {
    setPosition(event);
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    paint();
  }

  canvas.addEventListener('mousemove', setPosition, false);
  canvas.addEventListener('touchmove', setPosition, false);

  canvas.addEventListener('mousedown', (event) => {
    startPath(event);

    canvas.addEventListener('mousemove', paint, false);
  }, false);

  canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    startPath(event);

    canvas.addEventListener('touchmove', paint, false);
  });

  canvas.addEventListener('touchend', () => {
    canvas.removeEventListener('touchmove', paint, false);
  }, false);

  document.documentElement.addEventListener('mouseup', () => {
    canvas.removeEventListener('mousemove', paint, false);
  }, false);

  canvas.addEventListener('mouseenter', (event) => {
    if (event.which !== 1) return;
    startPath(event);
    canvas.addEventListener('mousemove', paint, false);
  });

  canvas.addEventListener('mouseleave', () => {
    canvas.removeEventListener('mousemove', paint, false);
  }, false);

  clearButton.addEventListener('click', clear);

  saveButton.addEventListener('click', () => {
    const postMeta = document.querySelector('meta[property="id"]');
    const postId = postMeta ? postMeta.getAttribute('content') : null;
    const sendButton = document.querySelector('.drawing__save');
    resultImage.src = canvas.toDataURL();

    sendButton.setAttribute('disabled', 'disabled');
    axios.put('/api/drawing', `source=${canvas.toDataURL()}&postid=${postId}`)
      .then(() => {
        sendButton.removeAttribute('disabled');
        clear();
      })
      .catch((error) => {
        console.error(error);
        sendButton.removeAttribute('disabled');
      });
  });
}
