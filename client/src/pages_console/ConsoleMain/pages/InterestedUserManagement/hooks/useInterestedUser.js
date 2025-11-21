import { useState, useEffect } from 'react';
import { userInstance } from '../../../../../apis/instance';
import useDebounceSearch from '../../../hooks/useDebounceSearch';
import { useUser } from '../../../../../store/UserProvider.jsx';

export default function useInterestedUser() {
  const { user } = useUser();
  const [interestedUserList, setInterestedUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // 관심유저 목록 로드
  const loadInterestedUsers = async (likedType = 'gallery', search = '') => {
    try {
      setIsLoading(true);
      const token = user;
      const response = await userInstance.get(
        `/api/users/console/likes?liked_type=${likedType}${search ? `&search=${search}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('관심유저 API 응답:', response.data); // 디버깅용

      // API 응답 데이터를 mock 데이터 형식에 맞게 변환
      const users = Array.isArray(response.data)
        ? response.data.map((item) => ({
            id: item.id,
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
            exhibitionName:
              item.exhibition?.exhibition_title || '전시회 정보 없음',
            artworkName: item.art?.art_title || '작품 정보 없음',
            type: likedType, // 타입 정보 추가
          }))
        : [];

      console.log('변환된 관심유저 데이터:', users); // 디버깅용
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

  // 탭 변경 핸들러 (hook 사용 전에 정의 필요)
  const handleTabChange = async (tab) => {
    setActiveTab(tab);

    if (tab === 'all') {
      // 전체 탭: 모든 타입의 데이터를 합쳐서 로드
      try {
        setIsLoading(true);
        const [galleryResponse, exhibitionResponse, artResponse] =
          await Promise.all([
            userInstance.get('/api/users/console/likes?liked_type=gallery'),
            userInstance.get('/api/users/console/likes?liked_type=exhibition'),
            userInstance.get('/api/users/console/likes?liked_type=art'),
          ]);

        const allUsers = [
          ...(Array.isArray(galleryResponse.data)
            ? galleryResponse.data.map((item) => ({
                id: item.id,
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
              }))
            : []),
          ...(Array.isArray(exhibitionResponse.data)
            ? exhibitionResponse.data.map((item) => ({
                id: item.id,
                name: item.user?.user_name || '사용자 정보 없음',
                category: item.exhibition?.exhibition_title || '정보 없음',
                date: item.create_dtm
                  ? new Date(item.create_dtm).toLocaleDateString('ko-KR')
                  : '날짜 정보 없음',
                userName: item.user?.user_name || '사용자 정보 없음',
                galleryName: '갤러리 정보 없음',
                exhibitionName:
                  item.exhibition?.exhibition_title || '전시회 정보 없음',
                artworkName: '작품 정보 없음',
                type: 'exhibition',
              }))
            : []),
          ...(Array.isArray(artResponse.data)
            ? artResponse.data.map((item) => ({
                id: item.id,
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
              }))
            : []),
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
      // 특정 타입 탭: 해당 타입만 로드
      await loadInterestedUsers(tab);
    }
  };

  // 실제 검색 실행 함수
  const performSearch = async (query) => {
    setIsSearching(true);

    // 검색어가 변경되면 현재 활성 탭에 대해 API 재호출
    if (activeTab === 'all') {
      // 전체 탭의 경우 모든 타입에 대해 검색
      try {
        setIsLoading(true);
        const [galleryResponse, exhibitionResponse, artResponse] =
          await Promise.all([
            userInstance.get(
              `/api/users/console/likes?liked_type=gallery&search=${query}`,
            ),
            userInstance.get(
              `/api/users/console/likes?liked_type=exhibition&search=${query}`,
            ),
            userInstance.get(
              `/api/users/console/likes?liked_type=art&search=${query}`,
            ),
          ]);

        const allUsers = [
          ...(Array.isArray(galleryResponse.data)
            ? galleryResponse.data.map((item) => ({
                id: item.id,
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
              }))
            : []),
          ...(Array.isArray(exhibitionResponse.data)
            ? exhibitionResponse.data.map((item) => ({
                id: item.id,
                name: item.user?.user_name || '사용자 정보 없음',
                category: item.exhibition?.exhibition_title || '정보 없음',
                date: item.create_dtm
                  ? new Date(item.create_dtm).toLocaleDateString('ko-KR')
                  : '날짜 정보 없음',
                userName: item.user?.user_name || '사용자 정보 없음',
                galleryName: '갤러리 정보 없음',
                exhibitionName:
                  item.exhibition?.exhibition_title || '전시회 정보 없음',
                artworkName: '작품 정보 없음',
                type: 'exhibition',
              }))
            : []),
          ...(Array.isArray(artResponse.data)
            ? artResponse.data.map((item) => ({
                id: item.id,
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
              }))
            : []),
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
      // 특정 타입 탭의 경우 해당 타입만 검색
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
      // 검색어를 지우면 현재 활성 탭에 대해 API 재호출 (검색어 없이)
      if (activeTab === 'all') {
        await handleTabChange('all');
      } else {
        await loadInterestedUsers(activeTab, '');
      }
    },
    minLength: 2,
    delay: 500,
  });

  // 컴포넌트 마운트 시 전체 관심유저 로드
  useEffect(() => {
    handleTabChange('all');
  }, []);

  return {
    interestedUserList,
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
