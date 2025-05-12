import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layouts/Layout';
import LayoutWithSearchbar from '../layouts/LayoutWithSearchbar';
import Main from '../pages/Main/Main';
import Exhibitions from '../pages/Exhibitions/Exhibitions';
import ExhibitionDetail from '../pages/ExhibitionDetail/ExhibitionDetail';
import Artists from '../pages/Artists/Artists';
import ArtistDetail from '../pages/ArtistDetail/ArtistDetail';
import Galleries from '../pages/Galleries/Galleries';
import GalleryDetail from '../pages/GalleryDetail/GalleryDetail';
import Test from '../pages/Test/Test';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Mypage from '../pages/MyPage/MyPage';
import EditProfile from '../pages/EditProfile/EditProfile';
import Reservation from '../pages/Reservation/Reservation';

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
            element: <Galleries />,
          },
          {
            path: '/galleries/:galleryId',
            element: <GalleryDetail />,
          },
          {
            path: '/artists',
            element: <Artists />,
          },
          {
            path: '/artists/:artistId',
            element: <ArtistDetail />,
          },
          {
            path: '/notices',
            element: <div>공고 페이지</div>,
          },
        ],
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
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
      { path: '/reservation/:exhibitionId', element: <Reservation /> },
    ],
  },
]);

export default router;
