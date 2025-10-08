export const URL = window.location.href.includes('localhost')
  ? 'http://localhost:4444/api'
  : 'https://wearable-psi.vercel.app/api';