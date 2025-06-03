import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layouts/Layout';
import AuthRoute from '../layouts/AuthRoute';
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
import Purchase from '../pages/Purchase/Purchase';
import News from '../pages/News/News';
import NewsDetail from '../pages/NewsDetail/NewsDetail';
import Artwork from '../pages/Artwork/Artwork';
import ArtworkList from '../pages/ArtworkList/ArtworkList';
import Catalog from '../pages/Catalog/Catalog';
import ReservationComplete from '../pages/ReservationComplete/ReservationComplete';
import QrScanner from '../pages/QrScanner/QrScanner';
import Nearby from '../pages/Nearby/Nearby';
import ArtworkDetail from '../pages/ArtworkDetail/ArtworkDetail';
import Test from '../pages/Test/Test';
import Find from '../pages/Find/Find';
import Announcement from '../pages/Announcement/Announcement';
import TermsPolicy from '../pages/TermsPolicy/TermsPolicy';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Main /> },
      { path: '/exhibitions', element: <Exhibitions /> },
      { path: '/galleries', element: <Galleries /> },
      { path: '/artists', element: <Artists /> },
      { path: '/artworks', element: <ArtworkList /> },
      { path: '/search', element: <Search /> },
      { path: '/notices', element: <News /> },
      { path: '/exhibitions/:exhibitionId', element: <ExhibitionDetail /> },
      { path: '/galleries/:galleryId', element: <GalleryDetail /> },
      { path: '/artists/:artistId', element: <ArtistDetail /> },
      { path: '/notices/:noticeId', element: <NewsDetail /> },
      { path: '/artworks/:artworkId', element: <ArtworkDetail /> },
      { path: '/art/:artId', element: <Artwork /> },
      { path: '/catalog/:catalogId', element: <Catalog /> },
      { path: '/nearby-galleries', element: <Nearby /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/test', element: <Test /> },
      { path: '/find', element: <Find /> },
      { path: '/announcement', element: <Announcement /> },
      { path: '/termspolicy', element: <TermsPolicy /> },
      {
        element: <AuthRoute />,
        children: [
          { path: '/mypage', element: <Mypage /> },
          { path: '/mypage/edit', element: <EditProfile /> },
          { path: '/purchase/:reservationId', element: <Purchase /> },
        ],
      },
    ],
  },
  {
    path: '/scan',
    element: <QrScanner />,
  },
  {
    path: '/scan/:id',
    element: <QrScanner />,
  },
]);

export default router;
