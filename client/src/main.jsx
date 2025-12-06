import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AlertProvider } from './store/AlertProvider.jsx';
import { ConfirmProvider } from './store/ConfirmProvider.jsx';

createRoot(document.getElementById('root')).render(
  <AlertProvider>
    <ConfirmProvider>
      <App />
    </ConfirmProvider>
  </AlertProvider>,
);
