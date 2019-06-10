export default function () {
  const postMeta = document.querySelector('meta[property="id"]');
  return postMeta ? postMeta.getAttribute('content') : null;
}
