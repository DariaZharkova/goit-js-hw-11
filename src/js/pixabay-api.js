import axios from 'axios';

export async function fetchGallery(query, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const queryParams = new URLSearchParams({
    key: '41307406-a71d6749c34589205bbec157b',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 40,
  });
  const response = await axios.get(`${BASE_URL}?${queryParams}`);
  return response.data;
}
