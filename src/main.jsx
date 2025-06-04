import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ElFrontend from './ElFrontend.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ElFrontend />
  </StrictMode>,
);
