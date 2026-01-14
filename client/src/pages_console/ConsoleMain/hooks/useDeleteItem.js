// useDeleteItem.js - 수정된 전체 코드

import { useState, useEffect, useCallback } from 'react';
import { userInstance } from '../../../apis/instance';
import { useUser } from '../../../store/UserProvider';
import { useAlert } from '../../../store/AlertProvider';

export default function useDeleteItem() {
  const { showAlert } = useAlert();

  const { user } = useUser();
  const [galleryList, setGalleryList] = useState([]);
  const [exhibitionList, setExhibitionList] = useState([]);
  const [artworkList, setArtworkList] = useState([]);
  const [artistList, setArtistList] = useState([]);  // 추가
  const [announcementList, setAnnouncementList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  // 갤러리 목록 로드
  const loadGalleries = useCallback(
    async (search = '') => {
      try {
        setIsLoading(true);
        if (search.trim()) {
          setIsSearching(true);
        }

        const params = new URLSearchParams();
        if (search) {
          params.append('search', search);
        }
        params.append('is_console', true);
        const url = `/api/galleries${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await userInstance.get(url);

        const galleries = Array.isArray(response.data)
          ? response.data.map((item) => ({
            id: item.id,
            name: item.gallery_name,
            address: item.gallery_address,
            closedDay: item.gallery_closed_day,
            time: `${item.gallery_start_time} - ${item.gallery_end_time}`,
            registered: item.exhibitions ? item.exhibitions.length : 0,
            liked: item.like_count,
            image: item.gallery_image,
          }))
          : [];

        setGalleryList(galleries);
      } catch (err) {
        setError(err.message);
        console.error('갤러리 목록 로드 실패:', err);
        setGalleryList([]);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    },
    [],
  );

  // 전시회 목록 로드
  const loadExhibitions = useCallback(
    async (galleryName = '') => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (galleryName && galleryName !== '갤러리 전체') {
          params.append('gallery_name', galleryName);
        }
        const url = `/api/exhibitions${params.toString() ? `?${params.toString()}` : ''}`;

        const response = await userInstance.get(url);

        const userGalleryIds = galleryList.map((g) => g.id);
        const exhibitions = Array.isArray(response.data)
          ? response.data
            .filter((item) => userGalleryIds.includes(item.gallery_id))
            .map((item) => ({
              id: item.id,
              title: item.exhibition_title,
              period: `${item.exhibition_start_date} - ${item.exhibition_end_date}`,
              image: item.exhibition_poster || null,
              gallery_name: item.exhibition_organization?.name || '갤러리 정보 없음',
              gallery_id: item.gallery_id || null,
              value: item.exhibition_organization?.name || '갤러리 정보 없음',
            }))
          : [];

        setExhibitionList(exhibitions);
      } catch (err) {
        setError(err.message);
        console.error('전시회 목록 로드 실패:', err);
        setExhibitionList([]);
      } finally {
        setIsLoading(false);
      }
    },
    [galleryList],
  );

  // 작가 목록 로드 (추가)
  const loadArtists = useCallback(
    async (galleryId = null) => {
      try {
        setIsLoading(true);

        let targetGalleryIds = [];
        if (!galleryId || galleryId === 'all') {
          targetGalleryIds = galleryList.map((g) => g.id);
        } else {
          targetGalleryIds = [galleryId];
        }

        if (targetGalleryIds.length === 0) {
          setArtistList([]);
          return;
        }

        const promises = targetGalleryIds.map((gid) =>
          userInstance.get(`/api/artists/by-gallery/${gid}`).catch(() => ({ data: [] }))
        );
        const results = await Promise.all(promises);

        const artistMap = new Map();
        results.forEach((res) => {
          (res.data || []).forEach((artist) => {
            if (!artistMap.has(artist.id)) {
              artistMap.set(artist.id, {
                id: artist.id,
                artist_name: artist.artist_name,
                artist_image: artist.artist_image,
                artist_category: artist.artist_category,
                artist_nation: artist.artist_nation,
                exhibitions: artist.exhibitions,
              });
            }
          });
        });

        setArtistList(Array.from(artistMap.values()));
      } catch (err) {
        setError(err.message);
        console.error('작가 목록 로드 실패:', err);
        setArtistList([]);
      } finally {
        setIsLoading(false);
      }
    },
    [galleryList],
  );

  // 작품 목록 로드 (수정)
  const loadArtworks = useCallback(
    async (search = '', galleryId = null) => {
      try {
        setIsLoading(true);

        let targetGalleryIds = [];
        if (!galleryId || galleryId === 'all') {
          targetGalleryIds = galleryList.map((g) => g.id);
        } else {
          targetGalleryIds = [galleryId];
        }

        if (targetGalleryIds.length === 0) {
          setArtworkList([]);
          return;
        }

        const promises = targetGalleryIds.map((gid) =>
          userInstance.get(`/api/arts/by-gallery/${gid}`).catch(() => ({ data: [] }))
        );
        const results = await Promise.all(promises);

        const artworkMap = new Map();
        results.forEach((res) => {
          const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
          list.forEach((item) => {
            if (!artworkMap.has(item.id)) {
              artworkMap.set(item.id, {
                id: item.id,
                title: item.art_title,
                artist: item.artist?.artist_name || item.artist_name || '작가 미상',
                image: item.art_image,
                exhibition_title: item.exhibitions?.[0]?.exhibition_title || '',
              });
            }
          });
        });

        setArtworkList(Array.from(artworkMap.values()));
      } catch (err) {
        setError(err.message);
        console.error('작품 목록 로드 실패:', err);
        setArtworkList([]);
      } finally {
        setIsLoading(false);
      }
    },
    [galleryList],
  );

  // 공고 목록 로드
  const loadAnnouncements = useCallback(
    async (search = '') => {
      try {
        setIsLoading(true);
        if (search.trim()) {
          setIsSearching(true);
        }

        const params = new URLSearchParams();
        if (search) {
          params.append('search', search);
        }
        if (user?.id) {
          params.append('user_id', user.id);
        }

        const url = `/api/announcements${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await userInstance.get(url);

        const announcements = Array.isArray(response.data)
          ? response.data.map((item) => ({
              id: item.id,
              title: item.announcement_title,
              category: item.announcement_category,
              status: item.announcement_status,
              startDate: item.announcement_start_datetime,
              endDate: item.announcement_end_datetime,
              organizer: item.announcement_organizer,
              image: item.announcement_poster,
            }))
          : [];

        setAnnouncementList(announcements);
      } catch (err) {
        setError(err.message);
        console.error('공고 목록 로드 실패:', err);
        setAnnouncementList([]);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    },
    [user?.id],
  );

  useEffect(() => {
    if (user?.id) {
      loadGalleries();
      loadAnnouncements();
    }
  }, [user?.id]);

  useEffect(() => {
    if (galleryList.length > 0) {
      loadExhibitions('갤러리 전체');
      loadArtists();   // 추가
      loadArtworks();  // 추가
    }
  }, [galleryList.length]);

  const handleDelete = async (id, type, galleryId = null) => {
    try {
      if (type === 'gallery') {
        setGalleryList((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'exhibition') {
        setExhibitionList((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'artwork') {
        setArtworkList((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'artist') {
        setArtistList((prev) => prev.filter((item) => item.id !== id));
      } else if (type === 'announcement') {
        setAnnouncementList((prev) => prev.filter((item) => item.id !== id));
      }

      let response;
      if (type === 'gallery') {
        response = await userInstance.delete(`/api/galleries/${id}`);
      } else if (type === 'exhibition') {
        response = await userInstance.delete(`/api/exhibitions/${id}`);
      } else if (type === 'artwork') {
        response = await userInstance.delete(`/api/arts/${id}`);
      } else if (type === 'gallery_art') {
        response = await userInstance.delete(`/api/arts/${id}/galleries/${galleryId}`);
      } else if (type === 'gallery_artist') {
        response = await userInstance.delete(`/api/artists/${id}/galleries/${galleryId}`);
      } else if (type === 'artist') {
        response = await userInstance.delete(`/api/artists/${id}`);
      } else if (type === 'announcement') {
        response = await userInstance.delete(`/api/announcements/${id}`);
      }

      if (
        typeof response.data === 'string' &&
        (response.data.includes('Fatal error') ||
          response.data.includes('Integrity constraint violation'))
      ) {
        throw new Error('FOREIGN_KEY_ERROR');
      }

      const typeLabel = {
        gallery: '갤러리',
        exhibition: '전시회',
        artwork: '작품',
        gallery_art: '작품',
        gallery_artist: '작가', 
        artist: '작가',
        announcement: '공고',
      };
      const isUnlink = type === 'gallery_art' || type === 'gallery_artist';
      showAlert(`${typeLabel[type]} ${isUnlink ? '해제' : '삭제'}를 완료하였습니다.`);
    } catch (err) {
      console.error('삭제 실패:', err);
    
      // 409 에러 (하위 데이터 존재)
      if (err.response?.status === 409) {
        showAlert(err.response.data?.message || '하위 데이터를 먼저 삭제해주세요.', 'error');
      } else if (err.message === 'FOREIGN_KEY_ERROR') {
        showAlert('삭제할 수 없습니다.\n하위 데이터를 먼저 삭제해주세요.', 'error');
      } else {
        showAlert('삭제 중 오류가 발생했습니다.', 'error');
      }
    
      // 복구
      if (type === 'gallery') loadGalleries();
      else if (type === 'exhibition') loadExhibitions('갤러리 전체');
      else if (type === 'artwork' || type === 'gallery_art') loadArtworks();
      else if (type === 'artist' || type === 'gallery_artist') loadArtists();
      else if (type === 'announcement') loadAnnouncements();
    }
  };

  return {
    galleryList,
    exhibitionList,
    artworkList,
    artistList,  // 추가
    announcementList,
    handleDelete,
    loadGalleries,
    loadExhibitions,
    loadArtworks,
    loadArtists,  // 추가
    loadAnnouncements,
    isLoading,
    isSearching,
    error,
  };
}