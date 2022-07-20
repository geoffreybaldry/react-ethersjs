import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css';
import App from './App';
//import Metamask from './Metamask';
import reportWebVitals from './reportWebVitals';

// A way of declaring a global react variable
window.contractAddress = "0x7d63464EBc9dA9A90D283D22c33cE24cC6864d56";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
