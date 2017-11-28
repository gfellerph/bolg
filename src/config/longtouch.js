
export default function registerDispatcher(element) {
  let lastTime;
  const lastPosition = { x: 0, y: 0 };

  element.addEventListener('touchstart', (e) => {
    lastPosition.x = e.changedTouches[0].clientX;
    lastPosition.y = e.changedTouches[0].clientY;
    lastTime = Date.now();
  });
  element.addEventListener('touchend', (e) => {
    const currentPos = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
    const currentTime = Date.now();
    if (
      Math.abs(lastPosition.x - currentPos.x) < 10
      &&
      Math.abs(lastPosition.y - currentPos.y) < 10
      &&
      currentTime - lastTime > 500
    ) {
      const longTouchEvent = new CustomEvent('longtouch', { detail: e });
      e.currentTarget.dispatchEvent(longTouchEvent);
    }
  });
}
