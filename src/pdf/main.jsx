import React from 'react';
import ReactDOM from 'react-dom/client';
// Même ordre que src/index.jsx : jetons de thème et animations, puis Bootstrap,
// puis la page.
import '../index.css';
import '../styles/animations.css';
import '../styles/bootstrap-custom.scss';
import './pdf.css';
import OutilPdf from './OutilPdf.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OutilPdf />
  </React.StrictMode>
);
