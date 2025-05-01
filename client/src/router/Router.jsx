import { createBrowserRouter } from 'react-router-dom';
import Main from '../pages/Main/Main';
import Test from '../pages/Test/Test';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  {
    path: '/test',
    element: <Test />,
  },
]);

export default router;
