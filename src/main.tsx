import { globalCss } from '@stitches/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Toastful } from 'react-toastful';
import App from './App';
import 'pollen-css';

const g = globalCss({
  '*': {
    boxSizing: 'border-box',
  },
});

ReactDOM.render(
  <React.StrictMode>
    {g()}
    <Toastful defaultStyle={true} />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
