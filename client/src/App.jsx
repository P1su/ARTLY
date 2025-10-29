import router from './router/Router';
import { UserProdiver } from './store/UserProvider';
import './styles/style.css';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <UserProdiver>
      <RouterProvider router={router} />
    </UserProdiver>
  );
}
export default App;
