import axios from 'axios';

export default function initCanvas() {
  const canvas = document.querySelector('#drawing');
  const clearButton = document.querySelector('.drawing__clear');
  const saveButton = document.querySelector('.drawing__save');
  const errorMessage = document.querySelector('.drawing__error');
  const displayContainer = document.querySelector('.drawing__display');
  const ctx = canvas.getContext('2d');
  const mouse = { x: 0, y: 0 };

  // Canvas settings
  ctx.canvas.width = 300;
  ctx.canvas.height = 225;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000000';

  /**
   * Paint a line on the canvas, drawing in progress
   */
  function paint() {
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
  }

  /**
   * Clear the canvas
   */
  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Function to continually set the cursor position,
   * taking into account different pixel densities
   *
   * @param {any} event The touch or mousemove event
   */
  function setPosition(event) {
    const rect = canvas.getBoundingClientRect(); // abs. size of element
    const scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
    const scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
    const clientX = event.clientX ? event.clientX : event.touches[0].clientX;
    const clientY = event.clientY ? event.clientY : event.touches[0].clientY;

    mouse.x = (clientX - rect.left) * scaleX;
    mouse.y = (clientY - rect.top) * scaleY;
  }

  /**
   * Start a new path on the canvas
   *
   * @param {any} event Touchstart or mousemove event
   */
  function startPath(event) {
    canvas.classList.remove('blank', 'error', 'merci');
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
    const imageData = canvas.toDataURL();
    const newImg = document.createElement('img');

    // Clear canvas and say thanks
    clear();
    newImg.src = imageData;
    displayContainer.appendChild(newImg);
    errorMessage.classList.remove('show');
    canvas.classList.add('merci');
    sendButton.setAttribute('disabled', 'disabled');

    // Put the drawing
    axios.put('/api/drawing', `source=${imageData}&postid=${postId}`)
      .then(() => {
        canvas.classList.remove('merci');
        sendButton.removeAttribute('disabled');
      })
      .catch((error) => {
        errorMessage.innerHTML = error.message;
        errorMessage.classList.add('show');
        canvas.classList.add('error');
        sendButton.removeAttribute('disabled');
      });
  });
}
