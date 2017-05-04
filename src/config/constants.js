import axios from 'axios';

export const states = {
  LOADING: 0,
  EDITING: 1,
  SAVED: 2,
  ERROR: 3,
  EDITING_OFFLINE: 4,
  SAVED_OFFLINE: 5,
  PUBLISHED: 6,
};

export const mapsAPIKey = 'AIzaSyBADvjevyMmDkHb_xjjh3FOltkO2Oa8iAQ';

export function reverseGeocode(lat, lng) {
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapsAPIKey}`);
}

export const sizes = [
  {
    width: 2560,
    height: 1440,
  },
  {
    width: 1920,
    height: 1080,
  },
  {
    width: 1024,
    height: 576,
  },
  {
    width: 640,
    height: 360,
  },
]
