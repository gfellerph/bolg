function setBookmark() {
  const body = document.body;
  const html = document.documentElement;
  const documentHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight,
  );
  const postMeta = document.querySelector('meta[property="id"]');
  const postId = postMeta ? postMeta.getAttribute('content') : null;
  const scrollPosition = window.pageYOffset || html.scrollTop;
  const scrollPercent = scrollPosition / documentHeight;

  if (!window.localStorage) return;

  window.localStorage.setItem('bookmark', JSON.stringify({
    scrollPercent,
    url: window.location.href,
    postId,
  }));
}

window.onbeforeunload = setBookmark;
window.onunload = setBookmark;
