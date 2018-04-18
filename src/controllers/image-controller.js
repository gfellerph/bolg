import axios from 'axios';

export default () => {
  const upload = (image, config) => {
    const formData = new FormData();
    formData.append('image', image.file);
    formData.append('shortid', image.shortid);
    return axios.post('/api/image', formData, config);
  }

  const deleteImages = (id, url) => axios.delete(`/api/image/${id}`, { data: { url } });

  return {
    upload,
    deleteImages,
  }
}
