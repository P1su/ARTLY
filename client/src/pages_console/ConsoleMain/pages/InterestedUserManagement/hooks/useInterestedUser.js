import { useState, useEffect } from 'react';
import { userInstance } from '../../../../../apis/instance';
import useDebounceSearch from '../../../hooks/useDebounceSearch';
import { useUser } from '../../../../../store/UserProvider.jsx';

export default function useInterestedUser({ galleryList = [], exhibitionList = [], artworkList = [] } = {}) {
  const { user } = useUser();
  const [interestedUserList, setInterestedUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // 필터링에 사용할 ID 목록 (숫자로 변환)
  const userGalleryIds = galleryList.map(g => Number(g.id));
  const userExhibitionIds = exhibitionList.map(e => Number(e.id));
  const userArtworkIds = artworkList.map(a => Number(a.id));


  // 관심유저 필터링 함수
  const filterByOwnership = (users, likedType) => {

    const filtered = users.filter(item => {
      if (likedType === 'gallery') {
        // 갤러리 좋아요: gallery.id가 갤러리 관리 목록에 있는지 확인
        const galleryId = Number(item.gallery?.id);
        const result = galleryId && userGalleryIds.includes(galleryId);
        return result;
      } else if (likedType === 'exhibition') {
        // 전시회 좋아요: exhibition.id가 전시회 관리 목록에 있는지 확인
        const exhibitionId = Number(item.exhibition?.id);
        const result = exhibitionId && userExhibitionIds.includes(exhibitionId);
        return result;
      } else if (likedType === 'art') {
        // 작품 좋아요: art.id가 작품 관리 목록에 있는지 확인
        const artId = Number(item.art?.id);
        const result = artId && userArtworkIds.includes(artId);
        return result;
      }
      return true;
    });

    return filtered;
  };

  // 관심유저 목록 로드
  const loadInterestedUsers = async (likedType = 'gallery', search = '') => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('ACCESS_TOKEN');
      const params = new URLSearchParams();
      params.append('liked_type', likedType);
      if (search) {
        params.append('search', search);
      }
      const response = await userInstance.get(
        `/api/users/console/likes?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 필터링 적용
      const filteredData = Array.isArray(response.data)
        ? filterByOwnership(response.data, likedType)
        : [];

      const users = filteredData.map((item) => ({
        id: item.id, // 좋아요(관심) 레코드 ID
        userId: item.user_id || item.user?.id, // 🔥 실제 대상 유저 ID
        name: item.user?.user_name || '사용자 정보 없음',
        category:
          item.gallery?.gallery_name ||
          item.exhibition?.exhibition_title ||
          item.art?.art_title ||
          '정보 없음',
        date: item.create_dtm
          ? new Date(item.create_dtm).toLocaleDateString('ko-KR')
          : '날짜 정보 없음',
        userName: item.user?.user_name || '사용자 정보 없음',
        galleryName: item.gallery?.gallery_name || '갤러리 정보 없음',
        exhibitionName: item.exhibition?.exhibition_title || '전시회 정보 없음',
        artworkName: item.art?.art_title || '작품 정보 없음',
        type: likedType,
      }));

      setInterestedUserList(users);
    } catch (err) {
      setError(err.message);
      console.error('관심유저 목록 로드 실패:', err);
      console.error('에러 상세:', err.response?.data);
      console.error('에러 상태:', err.response?.status);
      setInterestedUserList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 서버에서 이미 필터링된 데이터를 최신순으로 정렬
  const sortedUserList = [...interestedUserList].sort((a, b) => {
    const dateA = new Date(a.date.replace(/\./g, '-'));
    const dateB = new Date(b.date.replace(/\./g, '-'));
    return dateB - dateA; // 내림차순 (최신순)
  });

  // 탭 변경 핸들러
  const handleTabChange = async (tab) => {
    setActiveTab(tab);

    if (tab === 'all') {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('ACCESS_TOKEN');
        const [galleryResponse, exhibitionResponse, artResponse] = await Promise.all([
          userInstance.get('/api/users/console/likes?liked_type=gallery', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          userInstance.get('/api/users/console/likes?liked_type=exhibition', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          userInstance.get('/api/users/console/likes?liked_type=art', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // 각 타입별로 필터링 적용
        const filteredGalleryData = filterByOwnership(galleryResponse.data || [], 'gallery');
        const filteredExhibitionData = filterByOwnership(exhibitionResponse.data || [], 'exhibition');
        const filteredArtData = filterByOwnership(artResponse.data || [], 'art');

        const allUsers = [
          ...filteredGalleryData.map((item) => ({
            id: item.id,
            userId: item.user_id || item.user?.id,
            name: item.user?.user_name || '사용자 정보 없음',
            category: item.gallery?.gallery_name || '정보 없음',
            date: item.create_dtm
              ? new Date(item.create_dtm).toLocaleDateString('ko-KR')
              : '날짜 정보 없음',
            userName: item.user?.user_name || '사용자 정보 없음',
            galleryName: item.gallery?.gallery_name || '갤러리 정보 없음',
            exhibitionName: '전시회 정보 없음',
            artworkName: '작품 정보 없음',
            type: 'gallery',
          })),
          ...filteredExhibitionData.map((item) => ({
            id: item.id,
            userId: item.user_id || item.user?.id,
            name: item.user?.user_name || '사용자 정보 없음',
            category: item.exhibition?.exhibition_title || '정보 없음',
            date: item.create_dtm
              ? new Date(item.create_dtm).toLocaleDateString('ko-KR')
              : '날짜 정보 없음',
            userName: item.user?.user_name || '사용자 정보 없음',
            galleryName: '갤러리 정보 없음',
            exhibitionName: item.exhibition?.exhibition_title || '전시회 정보 없음',
            artworkName: '작품 정보 없음',
            type: 'exhibition',
          })),
          ...filteredArtData.map((item) => ({
            id: item.id,
            userId: item.user_id || item.user?.id,
            name: item.user?.user_name || '사용자 정보 없음',
            category: item.art?.art_title || '정보 없음',
            date: item.create_dtm
              ? new Date(item.create_dtm).toLocaleDateString('ko-KR')
              : '날짜 정보 없음',
            userName: item.user?.user_name || '사용자 정보 없음',
            galleryName: '갤러리 정보 없음',
            exhibitionName: '전시회 정보 없음',
            artworkName: item.art?.art_title || '작품 정보 없음',
            type: 'art',
          })),
        ];

        setInterestedUserList(allUsers);
      } catch (err) {
        setError(err.message);
        console.error('전체 관심유저 목록 로드 실패:', err);
        setInterestedUserList([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      await loadInterestedUsers(tab);
    }
  };

  // 실제 검색 실행 함수
  const performSearch = async (query) => {
    setIsSearching(true);

    if (activeTab === 'all') {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('ACCESS_TOKEN');

        // URLSearchParams를 사용하여 한국어 검색어 인코딩
        const galleryParams = new URLSearchParams();
        galleryParams.append('liked_type', 'gallery');
        galleryParams.append('search', query);

        const exhibitionParams = new URLSearchParams();
        exhibitionParams.append('liked_type', 'exhibition');
        exhibitionParams.append('search', query);

        const artParams = new URLSearchParams();
        artParams.append('liked_type', 'art');
        artParams.append('search', query);

        const [galleryResponse, exhibitionResponse, artResponse] = await Promise.all([
          userInstance.get(`/api/users/console/likes?${galleryParams.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          userInstance.get(`/api/users/console/likes?${exhibitionParams.toString()}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          userInstance.get(`/api/users/console/likes?${artParams.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // 각 타입별로 필터링 적용
        const filteredGalleryData = filterByOwnership(galleryResponse.data || [], 'gallery');
        const filteredExhibitionData = filterByOwnership(exhibitionResponse.data || [], 'exhibition');
        const filteredArtData = filterByOwnership(artResponse.data || [], 'art');

        const allUsers = [
          ...filteredGalleryData.map((item) => ({
            id: item.id,
            userId: item.user_id || item.user?.id,
            name: item.user?.user_name || '사용자 정보 없음',
            category: item.gallery?.gallery_name || '정보 없음',
            date: item.create_dtm
              ? new Date(item.create_dtm).toLocaleDateString('ko-KR')
              : '날짜 정보 없음',
            userName: item.user?.user_name || '사용자 정보 없음',
            galleryName: item.gallery?.gallery_name || '갤러리 정보 없음',
            exhibitionName: '전시회 정보 없음',
            artworkName: '작품 정보 없음',
            type: 'gallery',
          })),
          ...filteredExhibitionData.map((item) => ({
            id: item.id,
            userId: item.user_id || item.user?.id,
            name: item.user?.user_name || '사용자 정보 없음',
            category: item.exhibition?.exhibition_title || '정보 없음',
            date: item.create_dtm
              ? new Date(item.create_dtm).toLocaleDateString('ko-KR')
              : '날짜 정보 없음',
            userName: item.user?.user_name || '사용자 정보 없음',
            galleryName: '갤러리 정보 없음',
            exhibitionName: item.exhibition?.exhibition_title || '전시회 정보 없음',
            artworkName: '작품 정보 없음',
            type: 'exhibition',
          })),
          ...filteredArtData.map((item) => ({
            id: item.id,
            userId: item.user_id || item.user?.id,
            name: item.user?.user_name || '사용자 정보 없음',
            category: item.art?.art_title || '정보 없음',
            date: item.create_dtm
              ? new Date(item.create_dtm).toLocaleDateString('ko-KR')
              : '날짜 정보 없음',
            userName: item.user?.user_name || '사용자 정보 없음',
            galleryName: '갤러리 정보 없음',
            exhibitionName: '전시회 정보 없음',
            artworkName: item.art?.art_title || '작품 정보 없음',
            type: 'art',
          })),
        ];

        setInterestedUserList(allUsers);
      } catch (err) {
        setError(err.message);
        console.error('검색 실패:', err);
        setInterestedUserList([]);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    } else {
      try {
        setIsLoading(true);
        await loadInterestedUsers(activeTab, query);
      } finally {
        setIsSearching(false);
      }
    }
  };

  // 디바운스 검색 hook 사용
  const {
    searchValue: searchQuery,
    handleSearchChange,
    clearSearch,
  } = useDebounceSearch({
    onSearch: performSearch,
    onEmptySearch: () => handleTabChange(activeTab),
    onClearSearch: async () => {
      if (activeTab === 'all') {
        await handleTabChange('all');
      } else {
        await loadInterestedUsers(activeTab, '');
      }
    },
    minLength: 2,
    delay: 500,
  });

  // 갤러리/전시회/작품 목록이 로드된 후 관심유저 로드
  useEffect(() => {
    // 목록들이 로드되면 관심유저 데이터도 다시 로드
    if (galleryList.length > 0) {
      handleTabChange('all');
    }
  }, [galleryList.length, exhibitionList.length, artworkList.length]);

  return {
    interestedUserList: sortedUserList,
    setInterestedUserList,
    searchQuery,
    isLoading,
    isSearching,
    error,
    activeTab,
    loadInterestedUsers,
    handleSearchChange,
    clearSearch,
    handleTabChange,
  };
}
