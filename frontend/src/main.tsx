import React from 'react';
import ReactDOM from 'react-dom/client';
import { IdentityKitProvider } from "@nfid/identitykit/react";
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <IdentityKitProvider>
      <App />
    </IdentityKitProvider>
  </React.StrictMode>
);
