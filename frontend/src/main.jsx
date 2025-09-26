
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // your App.jsx file is in src/
import './index.css';    // optional, for your styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
