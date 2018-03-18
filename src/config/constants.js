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

export const cloudFrontify = filename => `https://adie.bisnaer.ch/${filename}`;

// Random logo
export const logoURL = () => cloudFrontify(`s/img/bisnaer${Math.ceil(Math.random() * 30, 10) + 1}.PNG`);

export const mapsAPIKey = 'AIzaSyBADvjevyMmDkHb_xjjh3FOltkO2Oa8iAQ';

export const sizes = [
  {
    width: 1920,
    height: 1080,
  },
  {
    width: 1366,
    height: 768,
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

export const objectToArray = obj => Object.keys(obj).map(key => obj[key]);

export const slugger = str => str
  .toLowerCase()
  .replace(/ä/g, 'ae')
  .replace(/ö/g, 'oe')
  .replace(/ü/g, 'ue')
  .replace(/[^\w ]+/g, ' ')
  .trim()
  .replace(/ +/g, '-');

export const formatDate = (dateInput = Date.now()) => {
  const date = new Date(dateInput);
  let days = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (days < 10) days = `0${days}`;
  if (month < 10) month = `0${month}`;

  return `${days}.${month}.${year}`;
}
