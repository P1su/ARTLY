import { Suspense } from 'react';
import router from './router/Router';
import { UserProdiver } from './store/UserProvider';
import './styles/style.css';
import { RouterProvider } from 'react-router-dom';
import FallbackUI from './components/FallbackUI/FallbackUI';

function App() {
  return (
    <Suspense fallback={FallbackUI}>
      <UserProdiver>
        <RouterProvider router={router} />
      </UserProdiver>
    </Suspense>
  );
}
export default App;
