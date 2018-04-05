import axios from 'axios';

export default () => {
  const upload = (image, config) => {
    const formData = new FormData();
    formData.append('image', image.file);
    formData.append('id', image.shortid);
    return axios.post('/api/image', formData, config);
  }

  const deleteImages = id => axios.delete(`/api/image/${id}`);

  return {
    upload,
    deleteImages,
  }
}
