import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // penting jika pakai Sanctum
});

axios.post('/api/login', {
  email: 'user@example.com',
  password: 'password',
}).then(response => {
  localStorage.setItem('token', response.data.token);
});
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

export default api;
