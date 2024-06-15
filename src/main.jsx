import React from 'react';
import ReactDOM from 'react-dom/client';
import { CSRFTokenProvider } from './context/CSRFTokenContext.jsx';
import App from './App.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CSRFTokenProvider>
      <App />
    </CSRFTokenProvider>
  </React.StrictMode>,
)
