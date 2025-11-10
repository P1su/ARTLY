import router from './router/Router';
import { UserProdiver } from './store/UserProvider';
import { ToastProvider } from './store/ToastProvider';
import './styles/style.css';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <UserProdiver>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </UserProdiver>
  );
}
export default App;
