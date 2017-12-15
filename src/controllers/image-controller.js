import axios from 'axios';

export default () => {
  const upload = (image, config) => {
    const formData = new FormData();
    formData.append('image', image.file);
    formData.append('id', image.id);
    return axios.post('/api/images', formData, config);
  }

  const deleteImages = id => axios.delete(`/api/images/${id}`);

  return {
    upload,
    deleteImages,
  }
}
