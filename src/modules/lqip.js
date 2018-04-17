const defaults = {
  selector: '[data-lqip-src],[data-lqip-srcset]',
  root: null,
  rootMargin: '0px',
  treshold: 0.1,
  afterReplace: null,
}

const styles = `
.lqip__wrapper {
  position: relative;
  overflow: hidden;
}

.lqip__original {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  will-change: opacity;
}
.lqip__loading {
  transition: opacity 0.7s;
}
.lqip__loaded {
  opacity: 1;
}
`;

const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = styles;
document.head.appendChild(style);

let observer;

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

  const options = Object.assign({}, defaults, userOptions);

  const transitionend = (event) => {
    event.target.classList.remove('lqip__loading');
    event.target.removeEventListener('transitionend', transitionend);
    options.afterReplace(event.target.previousElementSibling, event.target);
  }

  const onload = (event) => {
    const { target } = event;
    window.setTimeout(() => {
      target.classList.add('lqip__loaded');
    }, 1);
  }

  const loader = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = document.createElement('img');
        if (options && typeof options.afterReplace === 'function') {
          img.addEventListener('transitionend', transitionend, false);
        }
        const srcset = entry.target.getAttribute('data-lqip-srcset');
        const src = entry.target.getAttribute('data-lqip-src');
        img.classList.add('lqip__original', 'lqip__loading');
        img.alt = entry.target.alt;
        if (src) {
          img.removeAttribute('data-lqip-src');
          img.src = src;
        }
        if (srcset) {
          img.removeAttribute('data-lqip-srcset');
          img.setAttribute('srcset', srcset);
          img.setAttribute('sizes', entry.target.getAttribute('sizes'));
        }
        entry.target.parentNode.appendChild(img);
        observer.unobserve(entry.target);
        img.addEventListener('load', onload, false);
      }
    });
  }

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

    // Prepare markup
    if (image.parentElement.children.length > 1) {
      const wrapper = wrapperDiv.cloneNode();
      image.parentNode.insertBefore(wrapper, image);
      wrapper.appendChild(image);
    } else if (!image.parentElement.classList.contains('lqip__wrapper')) {
      image.parentElement.classList.add('lqip__wrapper');
    }
  }

  return observer;
}

export default lqip;
