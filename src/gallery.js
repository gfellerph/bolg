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

// Navigation arrows
const nav = document.querySelector('.gallery__post-navigation');
const onscroll = (event) => {
  const el = event.target;
  el.parentElement.classList.toggle('show-left-arrow', el.scrollLeft > 0);
  el.parentElement.classList.toggle('show-right-arrow', el.offsetWidth + Math.ceil(el.scrollLeft) < el.scrollWidth);
}
nav.addEventListener('scroll', onscroll, { passive: true });
// Initial call
window.addEventListener('load', () => {
  onscroll({ target: nav });
});

const leftArrow = document.querySelector('.nav__arrow-left');
const rightArrow = document.querySelector('.nav__arrow-right');
const scrollLeft = () => {
  nav.scrollLeft -= 60;
}
const scrollRight = () => {
  nav.scrollLeft += 60;
}
leftArrow.addEventListener('click', scrollLeft);
rightArrow.addEventListener('click', scrollRight);

// Country selector
const countrySelector = document.querySelector('.country-selector');
const switchCountry = (event) => {
  window.location.href = event.target.value;
}
countrySelector.addEventListener('change', switchCountry);
