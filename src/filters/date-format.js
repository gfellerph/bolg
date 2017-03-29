import moment from 'moment';

export default function (value, format) {
  if (!format) format = 'DD.MM.YYYY';
  if (value) {
    return moment(value).format(format);
  }

  return value;
}