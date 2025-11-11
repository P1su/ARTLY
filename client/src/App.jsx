import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import router from './router/Router';
import { UserProvider } from './store/UserProvider';
import { ToastProvider } from './store/ToastProvider';
import './styles/style.css';
import { RouterProvider } from 'react-router-dom';
import FallbackUI from './components/FallbackUI/FallbackUI';

function App() {
  return (
    <ErrorBoundary fallback={<div>으악</div>}>
      <Suspense fallback={<FallbackUI />}>
        <UserProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </UserProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
export default App;
