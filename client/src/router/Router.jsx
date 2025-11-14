import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layouts/Layout';
import AuthRoute from '../layouts/AuthRoute';
import Main from '../pages/Main/Main';
import Exhibitions from '../pages/Category/Exhibition/Exhibitions/Exhibitions';
import Artists from '../pages/Category/Artist/Artists/Artists';
import Galleries from '../pages/Category/Gallery/Galleries/Galleries';
import Register from '../pages/Auth/Register/Register';
import Mypage from '../pages/Auth/MyPage/MyPage';
import EditProfile from '../pages/Auth/EditProfile/EditProfile';
import Search from '../pages/Search/Search';
import Purchase from '../pages/Purchase/Purchase';
import News from '../pages/Category/News/News/News';
import NewsDetail from '../pages/Category/News/NewsDetail/NewsDetail';
import Artwork from '../pages/Artwork/Artwork';
import ArtworkList from '../pages/Category/Artwork/ArtworkList/ArtworkList';
import Catalog from '../pages/Catalog/Catalog';
import QrScanner from '../pages/QrScanner/QrScanner';
import Nearby from '../pages/Nearby/Nearby';
import ArtworkDetail from '../pages/Category/Artwork/ArtworkDetail/ArtworkDetail';
import Find from '../pages/Auth/Find/Find';
import Announcement from '../pages/Announcement/Announcement';
import TermsPolicy from '../pages/TermsPolicy/TermsPolicy';
import ReservationConfirm from '../pages/ReservationConfirm/ReservationConfirm';
import Reservation from '../pages/Reservation/Reservation';
import ConsoleMain from '../pages_console/ConsoleMain/ConsoleMain';
import LayoutConsole from '../layouts/LayoutConsole';
import ConsoleDetail from '../pages_console/ConsoleDetail/ConsoleDetail';
import ExhibitionDetail from '../pages/Category/Exhibition/ExhibitionDetail/ExhibitionDetail';
import GalleryDetail from '../pages/Category/Gallery/GalleryDetail/GalleryDetail';
import ArtistDetail from '../pages/Category/Artist/ArtistDetail/ArtistDetail';
import LoginDetail from './../pages/Auth/LoginDetail/LoginDetail';
import Login from './../pages/Auth/Login/Login';
import ConsoleEdit from '../pages_console/ConsoleEdit/ConsoleEdit';
import Leaflet from '../pages_console/Leaflet/Leaflet';
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
      { path: '/login-detail', element: <LoginDetail /> },
      { path: '/register', element: <Register /> },
      { path: '/find', element: <Find /> },
      { path: '/announcement', element: <Announcement /> },
      { path: '/termspolicy', element: <TermsPolicy /> },
      { path: '/reservation/:exhibitionId', element: <Reservation /> },
      {
        path: '/reservationconfirm/:reservationId',
        element: <ReservationConfirm />,
      },
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
    path: '/console',
    element: <LayoutConsole />,
    children: [
      { path: '/console/main', element: <ConsoleMain /> },
      { path: '/console/leaflet/:id', element: <Leaflet /> },
      {
        path: '/console/exhibitions/:id',
        element: <ConsoleDetail type='exhibitions' />,
      },
      {
        path: '/console/galleries/:id',
        element: <ConsoleDetail type='galleries' />,
      },
      {
        path: '/console/artworks/:id',
        element: <ConsoleDetail type='artworks' />,
      },
      {
        path: '/console/galleries/edit/:id',
        element: <ConsoleEdit type='galleries' />,
      },
      {
        path: '/console/exhibitions/edit/:id',
        element: <ConsoleEdit type='exhibitions' />,
      },
      {
        path: '/console/artworks/edit/:id',
        element: <ConsoleEdit type='artworks' />,
      },
    ],
  },

  {
    path: '/scan/:id?',
    element: <QrScanner />,
  },
]);

export default router;
