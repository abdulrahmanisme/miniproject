import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

console.log('Main.jsx loaded');

const root = document.getElementById('root');
if (!root) {
  console.error('Root element not found!');
} else {
  console.log('Root element found, rendering app...');
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
  }
}
