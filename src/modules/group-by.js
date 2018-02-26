export default function groupBy(array, f) {
  // const groups = {};
  const groups = array.reduce((g, o) => {
    const group = JSON.stringify(f(o));
    g[group] = g[group] || [];
    g[group].push(o);
    return g;
  }, {});
  /* array.forEach(function (o) {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  }); */
  return Object.keys(groups).map(key => groups[key]);
}

export const unique = function unique(array, f) {
  const groups = array.reduce((g, o) => {
    const group = JSON.stringify(f(o));
    g[group] = o;
    return g;
  });
  return Object.values(groups);
}
