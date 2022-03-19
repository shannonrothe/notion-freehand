import React from 'react';
import ReactDOM from 'react-dom';
import { Toastful } from 'react-toastful';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Toastful defaultStyle={true} />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
