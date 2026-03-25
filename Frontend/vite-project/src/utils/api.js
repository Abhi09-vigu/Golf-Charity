import axios from 'axios';

// Vite exposes environment variables via import.meta.env
// In production (Vercel), you would set VITE_API_URL to your Render/Heroku backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('🔗 Connecting to Backend API:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Necessary if using JWT stored in HttpOnly cookies
});

export default api;
