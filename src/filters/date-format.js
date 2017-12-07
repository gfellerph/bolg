import moment from 'src/config/moment';

export default function (value, format = 'DD.MM.YYYY') {
  if (value) {
    return moment(value).format(format);
  }

  return value;
}
