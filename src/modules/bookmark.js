const getBookmark = () => {
  if (!window.localStorage) return false;

  return JSON.parse(window.localStorage.getItem('bookmark'));
}

export function setBookmark() {
  const postMeta = document.querySelector('meta[property="id"]');
  const postId = postMeta ? postMeta.getAttribute('content') : null;

  if (!window.localStorage) return;

  window.localStorage.setItem('bookmark', JSON.stringify({
    postId,
  }));
}

export function setBookmarkFlag() {
  const bookmark = getBookmark();
  const template = '<div class="post__badge">witerläse</div>';
  const div = document.createElement('div');
  div.innerHTML = template;
  const badge = div.firstChild;
  let post = document.querySelector(`[data-id="${bookmark.postId}"]`);

  if (bookmark.scrollPercent > 90) {
    post = post.previousElementSibling;
  }

  if (post) {
    post.querySelector('a').append(badge);
  }
}
