import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

var win = nw.Window.get();
win.resizeTo(1000, 800)
// win.maximize()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
