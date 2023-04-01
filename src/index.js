import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div id="game-body">
    <React.StrictMode>
      <BrowserRouter>
        <App playerID="0" />
      </BrowserRouter>
    </React.StrictMode>
  </div>
);
