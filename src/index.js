import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import sendVitals from './utils/vitals';
import './reset.css';
import './variables.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Measure and report Core Web Vitals.
// Development: logs to console. Production: sends to REACT_APP_VITALS_URL if set.
reportWebVitals(sendVitals);
