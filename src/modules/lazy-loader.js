import axios from 'axios';

export default function Loader(options = {}) {
  this.page = options.page || 0;
  this.limit = options.limit || 1;
  this.url = options.url || '';

  this.nextPage = () => {
    this.page += 1;
    return axios.get(this.url, {
      params: {
        page: this.page,
        limit: this.limit,
      },
      responseType: 'text',
    });
  };
}
