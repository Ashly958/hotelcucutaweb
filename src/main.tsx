import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { inicializarSeguridadNavegador } from '@/utils/seguridad';
import './index.css';

// Bloqueo y protección de consola del navegador (seguridad de JSONs y datos)
inicializarSeguridadNavegador();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

