import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Function to update the theme based on the device's color scheme preference
const updateTheme = (event) => {
  if (event.matches) {
    document.body.classList.remove('--light-theme');
    document.body.classList.add('--dark-theme');
  } else {
    document.body.classList.remove('--dark-theme');
    document.body.classList.add('--light-theme');
  }
};

// Create a media query to track changes in the prefers-color-scheme
const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Initial theme update
updateTheme(colorSchemeQuery);

// Listen for changes in the prefers-color-scheme and update the theme
colorSchemeQuery.addEventListener('change', updateTheme);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
