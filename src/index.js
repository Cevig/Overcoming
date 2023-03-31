import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from "./reportWebVitals";

const style = {
  display: 'flex',
  justifyContent: 'center'
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div id="game-body">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </div>
);

reportWebVitals();
