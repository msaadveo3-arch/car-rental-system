import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Theme initialization - must run before React renders
const savedTheme = localStorage.getItem('theme') || 'corporate';
document.documentElement.setAttribute('data-theme', savedTheme);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);