import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layouts/Layout';
import LayoutWithSearchbar from '../layouts/LayoutWithSearchbar';
import Main from '../pages/Main/Main';
import Test from '../pages/Test/Test';
import Mypage from '../pages/MyPage/MyPage';
import EditProfile from '../pages/EditProfile/EditProfile';

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
      {
        path: '/mypage',
        element: <Mypage />,
      },
      {
        path: '/mypage/edit',
        element: <EditProfile />,
      },
      {
        path: '/catalog',
        element: <div>도록 페이지</div>,
      },
    ],
  },
]);

export default router;
