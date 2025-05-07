import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layouts/Layout';
import LayoutWithSearchbar from '../layouts/LayoutWithSearchbar';
import Main from '../pages/Main/Main';
import Exhibitions from '../pages/Exhibitions/Exhibitions';
import ExhibitionDetail from '../pages/ExhibitionDetail/ExhibitionDetail';
import Artists from '../pages/Artists/Artists';
import Test from '../pages/Test/Test';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <LayoutWithSearchbar />,
        children: [
          {
            path: '/',
            element: <Main />,
          },
          {
            path: '/exhibitions',
            element: <Exhibitions />,
          },
          {
            path: '/exhibitions/:exhibitionId',
            element: <ExhibitionDetail />,
          },
          {
            path: '/galleries',
            element: <div>갤러리 페이지</div>,
          },
          {
            path: '/artists',
            element: <Artists />,
          },
          {
            path: '/notices',
            element: <div>공고 페이지</div>,
          },
        ],
      },
      {
        path: '/test',
        element: <Test />,
      },
      {
        path: '/nearby-galleries',
        element: <div>주변 갤러리 페이지</div>,
      },
    ],
  },
]);

export default router;
