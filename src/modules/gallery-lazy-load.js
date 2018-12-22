import Loader from 'src/modules/lazy-loader';

let observer;
let galleryContainer;

const loader = new Loader({
  url: '/api/gallery',
  page: 2,
  limit: 1,
});

function lastPost() {
  const posts = document.querySelectorAll('.gallery-post');
  return posts[posts.length - 1];
}

function observeLastPost() {
  if (!observer) return false;
  observer.observe(lastPost());
  return lastPost;
}

export default (options) => {
  galleryContainer = document.querySelector('.gallery-posts');

  const next = () => {
    loader.nextPage()
      .then(({ data: html }) => {
        galleryContainer.insertAdjacentHTML('beforeend', html);
        if (observer) observeLastPost();
        if (options.afterInsert && typeof options.afterInsert === 'function') {
          options.afterInsert(lastPost());
        }
      })
      .catch(() => {
        // No more posts
      });
  }

  const observerHandler = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (observer) observer.unobserve(entry.target);
        next();
      }
    });
  };

  if (!('IntersectionObserver' in window)) {
    // Alternative routine
    document.body.classList.add('no-intersection-observer');
    document
      .querySelector('button.compat-int-obs')
      .addEventListener('click', next);
  } else {
    // Modern browser
    observer = new IntersectionObserver(observerHandler, {
      threshold: 0,
    });
    observeLastPost();
  }
}
