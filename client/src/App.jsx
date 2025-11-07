import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import router from './router/Router';
import { UserProdiver } from './store/UserProvider';
import './styles/style.css';
import { RouterProvider } from 'react-router-dom';
import FallbackUI from './components/FallbackUI/FallbackUI';

function App() {
  return (
    <ErrorBoundary fallback={<div>으악</div>}>
      <Suspense fallback={<FallbackUI />}>
        <UserProdiver>
          <RouterProvider router={router} />
        </UserProdiver>
      </Suspense>
    </ErrorBoundary>
  );
}
export default App;
