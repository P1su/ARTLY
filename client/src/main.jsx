import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AlertProvider } from './store/AlertProvider.jsx';

createRoot(document.getElementById('root')).render(
  <AlertProvider>
    <App />
  </AlertProvider>,
);
