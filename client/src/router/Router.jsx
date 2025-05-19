import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Main from '../pages/Main/Main';
import Exhibitions from '../pages/Exhibitions/Exhibitions';
import ExhibitionDetail from '../pages/ExhibitionDetail/ExhibitionDetail';
import Artists from '../pages/Artists/Artists';
import ArtistDetail from '../pages/ArtistDetail/ArtistDetail';
import Galleries from '../pages/Galleries/Galleries';
import GalleryDetail from '../pages/GalleryDetail/GalleryDetail';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Mypage from '../pages/MyPage/MyPage';
import EditProfile from '../pages/EditProfile/EditProfile';
import Search from '../pages/Search/Search';
import Reservation from '../pages/Reservation/Reservation';
import Purchase from '../pages/Purchase/Purchase';
import LayoutWithSearchbarFooter from '../layouts/LayoutWithSearchbarFooter';
import LayoutWithChatbot from '../layouts/LayoutWithChatbot';
import LayoutWithHeader from '../layouts/LayoutWithHeader';
import Notice from '../pages/Notice/Notice';
import NoticeDetail from '../pages/NoticeDetail/NoticeDetail';
import ReservationComplete from '../pages/ReservationComplete/ReservationComplete';
import ReservationDetail from '../pages/\bReservationDetail/ReservationDetail';
import QrScanner from '../pages/QrScanner/QrScanner';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <LayoutWithHeader />,
        children: [
          {
            element: <LayoutWithChatbot />,
            children: [
              {
                element: <LayoutWithSearchbarFooter />,
                children: [
                  { path: '/', element: <Main /> },
                  { path: '/exhibitions', element: <Exhibitions /> },
                  { path: '/galleries', element: <Galleries /> },
                  { path: '/artists', element: <Artists /> },
                  { path: '/search', element: <Search /> },
                  { path: '/notices', element: <Notice /> },
                ],
              },
              {
                path: '/exhibitions/:exhibitionId',
                element: <ExhibitionDetail />,
              },
              { path: '/galleries/:galleryId', element: <GalleryDetail /> },
              { path: '/artists/:artistId', element: <ArtistDetail /> },
              { path: '/notices/:noticeId', element: <NoticeDetail /> },
              { path: '/catalog', element: <div>도록 페이지</div> },
              {
                path: '/nearby-galleries',
                element: <div>주변 갤러리 페이지</div>,
              },
            ],
          },
          { path: '/login', element: <Login /> },
          { path: '/register', element: <Register /> },
          { path: '/mypage', element: <Mypage /> },
          { path: '/mypage/edit', element: <EditProfile /> },
          { path: '/reservation/:exhibitionId', element: <Reservation /> },
          { path: '/purchase/:reservationId', element: <Purchase /> },
          {
            path: '/reservation/complete/:reservationId',
            element: <ReservationComplete />,
          },
          {
            path: '/reservation/detail/:reservationId',
            element: <ReservationDetail />,
          },
          {
            path: '/scan',
            element: <QrScanner />,
          },
        ],
      },
    ],
  },
]);

export default router;
