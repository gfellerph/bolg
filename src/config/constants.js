import { URL } from 'url';

export const liveRootUrl = 'https://bolg-app.herokuapp.com/posts/';

export const states = {
  LOADING: 0,
  EDITING: 1,
  SAVED: 2,
  ERROR: 3,
  EDITING_OFFLINE: 4,
  SAVED_OFFLINE: 5,
  PUBLISHED: 6,
};

export const cdnPrefix = filename => `https://adie.bisnaer.ch/${filename}`;

// Random logo
export const logoURL = () => cdnPrefix(`s/img/bisnaer${Math.ceil(Math.random() * 30, 10) + 1}.PNG`);

export const mapsAPIKey = 'AIzaSyBADvjevyMmDkHb_xjjh3FOltkO2Oa8iAQ';

export const sizes = [
  {
    width: 1920,
    height: 1440,
  },
  {
    width: 1600,
    height: 1200,
  },
  {
    width: 1366,
    height: 768,
  },
  {
    width: 1080,
    height: 810,
  },
  {
    width: 640,
    height: 480,
  },
  {
    width: 320,
    height: 240,
  },
];

export const imageStates = {
  QUEUED: 0,
  UPLOADING: 1,
  PROCESSING: 2,
  DONE: 3,
  ERROR: 4,
}

export const slugger = str => str
  .toLowerCase()
  .replace(/ä/g, 'ae')
  .replace(/ö/g, 'oe')
  .replace(/ü/g, 'ue')
  .replace(/[^\w ]+/g, ' ')
  .trim()
  .replace(/ +/g, '-');

const imageExtDetector = /\.(jpe?g|png)$/i;

export const getThumbUrl = (imgUrl, size) => {
  const insertIndex = imgUrl.indexOf('/i/');
  // Filter self hosted images as well as jpgs and pngs, no gifs
  if (insertIndex < 0 && !imageExtDetector.test(imgUrl)) return imgUrl;
  const prependix = imgUrl.substring(0, insertIndex);
  const appendix = imgUrl.substring(insertIndex);
  return `${prependix}/${size}x${appendix}`;
}

export const constructThumborUrl = (imageUrl, options) => {
  const segments = new URL(imageUrl);
  let settings = '';
  if (options.width || options.height) settings += `/${options.width || ''}x${options.height || ''}`;
  if (options.filters) {
    settings += '/filters';
    if (options.filters.blur) settings += `:blur(${options.filters.blur})`;
    if (options.filters.quality) settings += `:quality(${options.filters.quality})`
  }
  return `${segments.origin}${settings}${segments.pathname}`;
}

export const getSrcset = imgUrl => sizes
  .map(size => `${getThumbUrl(imgUrl, size.width)} ${size.width}w`)
  .join(',');

export const formatDate = (dateInput = Date.now()) => {
  const date = new Date(dateInput);
  let days = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (days < 10) days = `0${days}`;
  if (month < 10) month = `0${month}`;

  return `${days}.${month}.${year}`;
}

// Removes all html tags with content from a string
export const removeAllHtml = source => source.replace(/<.* (>[\s\S]*?<\/.*>|\/>)/gi, '');
