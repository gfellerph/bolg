import 'es6-promise/auto';
import mediumZoom from 'medium-zoom';
import lqip from 'src/modules/lqip';

const afterReplace = (lqipImage, originalImage) => {
  if (lqipImage) lqipImage.remove();
  mediumZoom(originalImage);
};

lqip({
  afterReplace,
});

const initGallery = () => {
  // Navigation arrows
  const nav = document.querySelector('.gallery__post-navigation');
  const onscroll = (event) => {
    const el = event.target;
    if (el.scrollLeft > 0) {
      el.parentElement.classList.add('show-left-arrow');
    } else {
      el.parentElement.classList.remove('show-left-arrow');
    }

    if (el.offsetWidth + Math.ceil(el.scrollLeft) < el.scrollWidth) {
      el.parentElement.classList.add('show-right-arrow');
    } else {
      el.parentElement.classList.remove('show-right-arrow');
    }
  }

  nav.addEventListener('scroll', onscroll, { passive: true });
  // Initial call
  window.addEventListener('load', () => {
    onscroll({ target: nav });
  });

  const leftArrow = document.querySelector('.nav__arrow-left');
  const rightArrow = document.querySelector('.nav__arrow-right');
  const scrollLeft = () => {
    if (nav.scrollTo) {
      nav.scrollTo({
        left: nav.scrollLeft - 250,
        behavior: 'smooth',
      });
    } else {
      nav.scrollLeft -= 200;
    }
  }
  const scrollRight = () => {
    if (nav.scrollTo) {
      nav.scrollTo({
        left: nav.scrollLeft + 250,
        behavior: 'smooth',
      });
    } else {
      nav.scrollLeft += 200;
    }
  }
  leftArrow.addEventListener('click', scrollLeft);
  rightArrow.addEventListener('click', scrollRight);

  // Country selector
  const countrySelector = document.querySelector('.country-selector');
  const switchCountry = (event) => {
    window.location.href = event.target.value;
  }
  countrySelector.addEventListener('change', switchCountry);
}
initGallery();
