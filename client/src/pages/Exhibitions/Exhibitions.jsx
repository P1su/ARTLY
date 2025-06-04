import styles from './Exhibitions.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../apis/instance.js';
import ListHeader from '../../components/List/ListHeader/ListHeader';
import DropdownContainer from '../../components/List/DropdownContainer/DropdownContainer';
import { exhibitionFilter } from '../../utils/filters/exhibitionFilter.js';
import TotalCounts from '../../components/List/TotalCounts/TotalCounts';
import Pagination from '../../components/Pagination/Pagination';
import usePagination from '../../hooks/usePagination';
import ExhibitionCard from './components/ExhibitionCard/ExhibitionCard';

export default function Exhibitions() {
  const [exhibitions, setExhibitions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, setCurrentPage, pageItems } = usePagination(
    10,
    exhibitions,
  );
  const [exhibitionFilters, setExhibitionFilters] = useState({
    sort: 'latest',
    region: '',
    category: '',
    status: 'exhibited',
    liked_only: 0,
  });
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const handleFav = () => {
    !localStorage.getItem('ACCESS_TOKEN') && navigate('/login');
    setExhibitionFilters((prev) => ({
      ...prev,
      liked_only: !prev.liked_only,
    }));
  };

  const getExhibitions = async () => {
    try {
      setIsLoading(true);
      const updatedFilters = {
        ...exhibitionFilters,
        search: query,
      };

      const response = await instance.get('/api/exhibitions', {
        params: updatedFilters, // ✅ 키 일치 → 바로 사용 가능
      });
      setExhibitions(response.data);
    } catch (error) {
      console.error('전시회 목록 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getExhibitions();
  }, [exhibitionFilters]);

  return (
    <div className={styles.layout}>
      <ListHeader
        title='전시회'
        placeholder='전시회명 또는 장소 검색'
        isFav={exhibitionFilters.liked_only}
        onEvent={getExhibitions}
        onFav={handleFav}
        onSearch={handleSearch}
        value={query}
      />

      <DropdownContainer
        filterList={exhibitionFilter}
        onSetFilter={setExhibitionFilters}
      />

      <TotalCounts num={exhibitions.length} label='전시회' />

      {isLoading && <div>전시회 데이터 조회 중..</div>}
      {exhibitions.length === 0 && <div>조회된 데이터가 없습니다.</div>}

      {pageItems.map((item) => (
        <ExhibitionCard
          key={item.id}
          exhibitionItem={item}
          onEvent={getExhibitions}
        />
      ))}

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={exhibitions.length}
      />
    </div>
  );
}
