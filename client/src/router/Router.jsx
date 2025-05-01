import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Main from '../pages/Main/Main';
import Test from '../pages/Test/Test';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Main />,
      },
      {
        path: '/test',
        element: <Test />,
      },
      {
        path: '/exhibitions',
        element: <div>전시회 페이지</div>,
      },
      {
        path: '/galleries',
        element: <div>갤러리 페이지</div>,
      },
      {
        path: '/artists',
        element: <div>작가 페이지</div>,
      },
      {
        path: '/nearby-galleries',
        element: <div>주변 갤러리 페이지</div>,
      },
      {
        path: '/notices',
        element: <div>공고 페이지</div>,
      },
    ],
  },
]);

export default router;
