import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.medway.com.br',
});

export default api;
