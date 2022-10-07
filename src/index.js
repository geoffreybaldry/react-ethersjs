import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css';
import App from './App';
//import Metamask from './Metamask';
import reportWebVitals from './reportWebVitals';

// A way of declaring a global react variable
//window.contractAddress = "0xec2e1cce689396ac63beca34a12fb8236fa2d495"
window.contractAddress = "0x72f9B8F9f60b64d1E862d8dc792B1348E1E4677a"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/*root.render(
  <App />
);*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
