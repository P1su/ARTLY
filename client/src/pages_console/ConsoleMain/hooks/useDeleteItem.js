import { useState, useEffect, useCallback } from 'react';
import { instance } from '../../../apis/instance';

export default function useDeleteItem() {
  const [galleryList, setGalleryList] = useState([]);
  const [exhibitionList, setExhibitionList] = useState([]);
  const [artworkList, setArtworkList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 갤러리 목록 로드
  const loadGalleries = useCallback(async (search = '') => {
    try {
      setIsLoading(true);
      // 실제 API 호출 (방법 1 + /api/galleries 경로)
      const params = new URLSearchParams();
      if (search) {
        params.append('gallery_name', search); // 파라미터명 gallery_name으로 변경
      }
      const url = `/api/console/galleries${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await instance.get(url);
      
      // API 응답 데이터를 mock 데이터 형식에 맞게 변환
      const galleries = Array.isArray(response.data) ? response.data.map(item => ({
        id: item.id,
        name: item.gallery_name,
        address: item.gallery_address,
        closedDay: item.gallery_closed_day,
        time: `${item.gallery_start_time} - ${item.gallery_end_time}`,
        registered: item.exhibitions ? item.exhibitions.length : 0,
        liked: item.like_count,
        image: item.gallery_image
      })) : [];
      
      setGalleryList(galleries);
    } catch (err) {
      setError(err.message);
      console.error('갤러리 목록 로드 실패:', err);
      console.error('에러 상세:', err.response?.data);
      console.error('에러 상태:', err.response?.status);
      console.error('에러 헤더:', err.response?.headers);
      setGalleryList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 전시회 목록 로드
  const loadExhibitions = useCallback(async (galleryId = '') => {
    try {
      setIsLoading(true);
      // 실제 API 호출
      const urlBase = '/api/console/exhibitions';
      let url = urlBase;
      if (galleryId && galleryId !== '갤러리 전체') url += `?gallery_id=${galleryId}`;
      
      const response = await instance.get(url);
      
      // API 응답 데이터를 mock 데이터 형식에 맞게 변환
      const exhibitions = Array.isArray(response.data) ? response.data.map(item => ({
        id: item.id,
        title: item.exhibition_title,
        period: `${item.exhibition_start_date} - ${item.exhibition_end_date}`,
        image: item.exhibition_poster || null, // API에 없을 경우 null
        gallery_name: item.exhibition_organization?.name || '갤러리 정보 없음',
        gallery_id: item.exhibition_organization?.id || null, // 갤러리 ID 추가
        value: item.exhibition_organization?.name || '갤러리 정보 없음'
      })) : [];
      
      setExhibitionList(exhibitions);
    } catch (err) {
      setError(err.message);
      console.error('전시회 목록 로드 실패:', err);
      setExhibitionList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 작품 목록 로드
  const loadArtworks = useCallback(async (galleryId = '') => {
    try {
      setIsLoading(true);
      // 실제 API 호출
      const params = new URLSearchParams();
      if (galleryId && galleryId !== '갤러리 전체') {
        params.append('gallery_id', galleryId);
      }
      const url = `/api/console/arts${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await instance.get(url);
      
      // API 응답 데이터를 mock 데이터 형식에 맞게 변환
      const artworks = Array.isArray(response.data) ? response.data.map(item => {
        // galleries 배열에서 첫 번째 갤러리 정보 가져오기
        const firstGallery = item.galleries && item.galleries.length > 0 ? item.galleries[0] : null;
        const galleryName = firstGallery ? firstGallery.gallery_name : '갤러리 정보 없음';
        const galleryId = firstGallery ? firstGallery.id : null;
        
        return {
          id: item.id,
          title: item.art_title,
          artist: item.artist?.artist_name || '작가 정보 없음',
          image: item.art_image || null,
          gallery_name: galleryName,
          gallery_id: galleryId,
          value: galleryName
        };
      }) : [];
      
      setArtworkList(artworks);
    } catch (err) {
      setError(err.message);
      console.error('작품 목록 로드 실패:', err);
      setArtworkList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 갤러리 목록 로드
  useEffect(() => {
    loadGalleries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id, type) => {
    try {
      if (type === 'gallery') {
        await instance.delete(`/api/console/galleries/${id}`);
        setGalleryList(prev => prev.filter(item => item.id !== id));
      } else if (type === 'exhibition') {
        await instance.delete(`/api/console/exhibitions/${id}`);
        setExhibitionList(prev => prev.filter(item => item.id !== id));
      } else if (type === 'artwork') {
        await instance.delete(`/api/console/arts/${id}`);
        setArtworkList(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      setError(err.message);
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return {
    galleryList,
    exhibitionList,
    artworkList,
    handleDelete,
    loadGalleries,
    loadExhibitions,
    loadArtworks,
    isLoading,
    error
  };
}

