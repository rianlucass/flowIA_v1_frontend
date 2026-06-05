import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    // Required to bypass ngrok's browser warning interstitial (ERR_NGROK_6024)
    'ngrok-skip-browser-warning': 'true',
  },
});
