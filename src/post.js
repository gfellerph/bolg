const documentHeight = () => Math.max(
  document.body.scrollHeight,
  document.body.offsetHeight,
  document.documentElement.clientHeight,
  document.documentElement.scrollHeight,
  document.documentElement.offsetHeight,
);

function setBookmark() {
  const html = document.documentElement;
  const height = documentHeight();
  const postMeta = document.querySelector('meta[property="id"]');
  const postId = postMeta ? postMeta.getAttribute('content') : null;
  const scrollPosition = window.pageYOffset || html.scrollTop;
  const scrollPercent = scrollPosition / height;

  if (!window.localStorage) return;

  window.localStorage.setItem('bookmark', JSON.stringify({
    scrollPercent,
    url: window.location.href,
    postId,
  }));
}

function restoreBookmark() {
  if (!window.localStorage) return;

  const bookmark = JSON.parse(window.localStorage.getItem('bookmark'));
  if (window.location.href === bookmark.url && window.location.hash === 'bookmark') {
    const height = documentHeight();
    const offset = height * bookmark.scrollPercent;
    if (window.scrollTo) window.scrollTo(0, offset);
  }
}

if (window.location.href.indexOf('bolg.html') <= 0) {
  window.onbeforeunload = setBookmark;
  window.onunload = setBookmark;
  window.onload = restoreBookmark;
}
