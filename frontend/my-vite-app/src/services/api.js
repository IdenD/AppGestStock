import axios from 'axios';

const api = axios.create({
  baseURL: 'https://app-gest-stock-api.vercel.app/api',
  headers: {
    'x-auth-token': localStorage.getItem('token'),
  },
});

export default api;
