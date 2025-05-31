import styles from './Exhibitions.module.css';
import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import FilterSection from './components/FilterSection/FilterSection';
import ListSection from './components/ListSection/ListSection';

export default function Exhibitions() {
  const [exhibitionData, setExhibitionData] = useState([]);
  const [likedExhibitions, setLikedExhibitions] = useState([]);
  const [filters, setFilters] = useState({
    sort: '최신순',
    region: '지역전체',
    genre: '장르전체',
    status: '현재전시',
    likedOnly: false,
  });

  const toggleLike = async (id) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const isLiked = likedExhibitions.includes(id);
    const likeData = {
      liked_id: id,
      liked_type: 'exhibition',
    };

    // 💡 프론트 상태만 먼저 반영
    setLikedExhibitions((prev) =>
      isLiked ? prev.filter((likedId) => likedId !== id) : [...prev, id]
    );

    try {
      if (isLiked) {
        await instance.delete('/api/likes', {
          data: likeData,
        });
      } else {
        await instance.post('/api/likes', likeData);
      }
      // ❌ 서버 재조회 X
    } catch (error) {
      console.error('좋아요 요청 실패 - 롤백합니다.', error);
      // 실패 시 원상복구
      setLikedExhibitions((prev) =>
        isLiked ? [...prev, id] : prev.filter((likedId) => likedId !== id)
      );
    }
  };

  const getExhibitionList = async () => {
    const statusMap = {
      '현재전시': 'exhibited',
      '종료전시': 'ended',
      '예정전시': 'scheduled',
    };

    const sortMap = {
      '최신순': 'latest',
      '오래된순': 'ending',
      '인기순': 'popular',
    };

    const region = filters.region === '지역전체' ? '' : filters.region;
    const category = filters.genre === '장르전체' ? '' : filters.genre;
    const status = statusMap[filters.status];
    const sort = sortMap[filters.sort];
    const token = localStorage.getItem('ACCESS_TOKEN');

    try {
      const response = await instance.get('/api/exhibitions', {
        params: {
          region,
          category,
          status,
          sort,
        },
      });

      const fetchedData = response.data;

      // ❌ 서버 응답의 is_liked 무시
      // const likedIds = fetchedData
      //   .filter((item) => item.is_liked === '1')
      //   .map((item) => item.id);
      // setLikedExhibitions(likedIds); ← ❌ 깜박임 원인

      const filteredByLike =
        filters.likedOnly && token
          ? fetchedData.filter((item) => likedExhibitions.includes(item.id))
          : fetchedData;

      setExhibitionData(filteredByLike);
    } catch (error) {
      console.error('전시회 목록 불러오기 실패', error);
    }
  };

  useEffect(() => {
    getExhibitionList();
  }, [filters]);

  return (
    <div className={styles.layout}>
      <FilterSection filters={filters} setFilters={setFilters} />
      <ListSection
        exhibitionData={exhibitionData}
        likedExhibitions={likedExhibitions}
        toggleLike={toggleLike}
      />
    </div>
  );
}
