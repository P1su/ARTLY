import router from './router/Router';
import { UserProvider } from './store/UserProvider';
import { ToastProvider } from './store/ToastProvider';
import './styles/style.css';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </UserProvider>
  );
}
export default App;
