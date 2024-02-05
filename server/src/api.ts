import axios from "axios";
import appConfig from './config/config.json';

const api = axios.create({
  baseURL: appConfig.runpod.baseUrl,
  timeout: appConfig.runpod.timeout, 
});

api.interceptors.request.use((config) => {
  config.headers.authorization = appConfig.runpod.apiKey;
  return config;
});

export default api;