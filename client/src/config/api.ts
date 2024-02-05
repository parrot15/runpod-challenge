import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 1000,  // Requests timeout after 1 sec
});

export default api;