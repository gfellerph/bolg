import axios from 'axios';

function Loader(options = {}) {
  this.page = options.page || 0;
  this.limit = options.limit || 1;
  this.url = options.url || '';

  this.nextPage = () => {
    this.page += 1;
    return axios.get(this.url, {
      params: {
        page: this.page,
        limit: this.limit,
      },
      responseType: 'text',
    });
  };
}

function observeLastPost(observer) {
  const posts = document.querySelectorAll('.gallery-post');
  const lastPost = posts[posts.length - 1];
  observer.observe(lastPost);
  return lastPost;
}

export default (options) => {
  let observer;
  const galleryContainer = document.querySelector('.gallery-posts');
  const loader = new Loader({
    url: '/api/gallery',
    page: 2,
    limit: 1,
  });

  const handler = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        loader.nextPage()
          .then(({ data: postHtml }) => {
            galleryContainer.insertAdjacentHTML('beforeend', postHtml);
            const lastPost = observeLastPost(observer);
            if (options.afterInsert && typeof options.afterInsert === 'function') {
              options.afterInsert(lastPost);
            }
          }).catch(() => {
            // No more posts
          });
      }
    });
  };

  observer = new IntersectionObserver(handler, {
    threshold: 0,
  });

  observeLastPost(observer);
}
