export default function (str) {
  return str
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/[^\w ]+/g, ' ')
    .replace(/ +/g, '-');
}
