function setBookmark() {
  // var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
  const body = document.body;
  const html = document.documentElement;
  const documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  const scrollPosition = window.pageYOffset || html.scrollTop;
  const scrollPercent = scrollPosition / documentHeight;

  if (!window.localStorage) return;
  
  window.localStorage.setItem('bookmark', JSON.stringify({
    scrollPercent,
    url: window.location.href,
  }));
}
window.onload = function onLoad() {
  console.log('loaded');
  window.onbeforeunload = setBookmark;
  window.onunload = setBookmark;
}
