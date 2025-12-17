import { useState, useEffect } from 'react';
import { userInstance } from '../../../../../apis/instance';
import useDebounceSearch from '../../../hooks/useDebounceSearch';

export default function useInterestedUser() {
  const [interestedUserList, setInterestedUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // 관심유저 목록 로드
  const loadInterestedUsers = async (likedType = 'gallery', search = '') => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('liked_type', likedType);
      if (search) {
        params.append('search', search);
      }
      // userInstance가 interceptor를 통해 자동으로 Authorization 헤더 추가
      const response = await userInstance.get(
        `/api/users/console/likes?${params.toString()}`
      );

      const data = Array.isArray(response.data) ? response.data : [];

      const users = data.map((item) => ({
        id: item.id,
        userId: item.user_id || item.user?.id,
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

  // 서버에서 받은 데이터를 최신순으로 정렬
  const sortedUserList = [...interestedUserList].sort((a, b) => {
    const dateA = new Date(a.date.replace(/\./g, '-'));
    const dateB = new Date(b.date.replace(/\./g, '-'));
    return dateB - dateA;
  });

  // 탭 변경 핸들러
  const handleTabChange = async (tab, currentSearchQuery = '') => {
    setActiveTab(tab);

    if (currentSearchQuery && currentSearchQuery.length >= 2) {
      if (tab === 'all') {
        try {
          setIsLoading(true);

          const galleryParams = new URLSearchParams();
          galleryParams.append('liked_type', 'gallery');
          galleryParams.append('search', currentSearchQuery);

          const exhibitionParams = new URLSearchParams();
          exhibitionParams.append('liked_type', 'exhibition');
          exhibitionParams.append('search', currentSearchQuery);

          const artParams = new URLSearchParams();
          artParams.append('liked_type', 'art');
          artParams.append('search', currentSearchQuery);

          const [galleryResponse, exhibitionResponse, artResponse] = await Promise.all([
            userInstance.get(`/api/users/console/likes?${galleryParams.toString()}`),
            userInstance.get(`/api/users/console/likes?${exhibitionParams.toString()}`),
            userInstance.get(`/api/users/console/likes?${artParams.toString()}`),
          ]);

          const galleryData = galleryResponse.data || [];
          const exhibitionData = exhibitionResponse.data || [];
          const artData = artResponse.data || [];

          const allUsers = [
            ...galleryData.map((item) => ({
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
            ...exhibitionData.map((item) => ({
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
            ...artData.map((item) => ({
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
          console.error('검색+탭전환 실패:', err);
          setInterestedUserList([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        await loadInterestedUsers(tab, currentSearchQuery);
      }
    } else {
      if (tab === 'all') {
        try {
          setIsLoading(true);
          const [galleryResponse, exhibitionResponse, artResponse] = await Promise.all([
            userInstance.get('/api/users/console/likes?liked_type=gallery'),
            userInstance.get('/api/users/console/likes?liked_type=exhibition'),
            userInstance.get('/api/users/console/likes?liked_type=art'),
          ]);

          const galleryData = galleryResponse.data || [];
          const exhibitionData = exhibitionResponse.data || [];
          const artData = artResponse.data || [];

          const allUsers = [
            ...galleryData.map((item) => ({
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
            ...exhibitionData.map((item) => ({
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
            ...artData.map((item) => ({
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
    }
  };

  // 실제 검색 실행 함수
  const performSearch = async (query) => {
    setIsSearching(true);

    if (activeTab === 'all') {
      try {
        setIsLoading(true);

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
          userInstance.get(`/api/users/console/likes?${galleryParams.toString()}`),
          userInstance.get(`/api/users/console/likes?${exhibitionParams.toString()}`),
          userInstance.get(`/api/users/console/likes?${artParams.toString()}`),
        ]);

        const galleryData = galleryResponse.data || [];
        const exhibitionData = exhibitionResponse.data || [];
        const artData = artResponse.data || [];

        const allUsers = [
          ...galleryData.map((item) => ({
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
          ...exhibitionData.map((item) => ({
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
          ...artData.map((item) => ({
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

  // 컴포넌트 마운트 시 관심유저 로드
  useEffect(() => {
    handleTabChange('all');
  }, []);

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
