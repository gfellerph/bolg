/**
 * Split an array in two arrays [[0, 2, 4...], [1, 3, 5...]]
 * @param {Array} items Array of items
 * @returns {Array} Array containing two arrays with the splitted items
 */
export default items => items.reduce((itemAccu, item, index) => {
  itemAccu[index % 2].push(item);
  return itemAccu;
}, [
  [],
  [],
]);
