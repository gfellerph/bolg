const defaults = {
  selector: '[data-lqip]',
  root: null,
  rootMargin: '0px',
  treshold: 0.1,
}

const styles = `.lqip__wrapper {
  position: relative;
}

.lqip__original {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.7s;
}`;
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = styles;
document.head.appendChild(style);

let observer;

const loader = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target.cloneNode();
      img.setAttribute('srcset', entry.target.getAttribute('data-lqip'));
      img.classList.add('lqip__original');
      img.addEventListener('load', () => {
        img.style.opacity = 1;
      });
      entry.target.parentNode.insertBefore(img, entry.target);
      observer.unobserve(entry.target);
    }
  });
}

const lqip = (userOptions = defaults) => {
  // Compatability check
  if (
    !('querySelectorAll' in document) ||
    !('IntersectionObserver' in window) ||
    !('assign' in Object)
  ) {
    /* eslint no-console: 0 */
    console.log('The lqip module is not compatible with this browser.');
    return false;
  }

  /* eslint no-console: 0 */
  console.log('The lqip module is compatible');

  const options = Object.assign({}, defaults, userOptions);

  const images = document.querySelectorAll(options.selector);
  observer = new IntersectionObserver(loader, {
    root: options.root,
    rootMargin: options.rootMargin,
    treshold: options.treshold,
  });

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('lqip__wrapper');

  // const observe = event => observer.observe(event.target);

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    observer.observe(image);
    /* if (image.complete) {
    } else {
      image.addEventListener('load', observe);
    } */

    // Prepare markup
    const wrapper = wrapperDiv.cloneNode();
    image.parentNode.insertBefore(wrapper, image);
    wrapper.appendChild(image);
  }

  return observer;
}

export default lqip;
