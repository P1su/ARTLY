import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import router from './router/Router';
import { UserProvider } from './store/UserProvider';
import { ToastProvider } from './store/ToastProvider';
import './styles/style.css';
import { RouterProvider } from 'react-router-dom';
import FallbackUI from './components/FallbackUI/FallbackUI';
import { AlertProvider } from './store/AlertProvider';

function App() {
  return (
    <ErrorBoundary fallback={<div>연결에 실패했습니다.</div>}>
      <Suspense fallback={<FallbackUI />}>
        <UserProvider>
          <AlertProvider>
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </AlertProvider>
        </UserProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
export default App;
