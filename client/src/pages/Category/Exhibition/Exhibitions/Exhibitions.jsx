import styles from './Exhibitions.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userInstance } from '../../../../apis/instance.js';
import ListHeader from '../../components/ListHeader/ListHeader';
import DropdownContainer from '../../components/DropdownContainer/DropdownContainer';
import { exhibitionFilter } from '../../../../utils/filters/exhibitionFilter.js';
import TotalCounts from '../../components/TotalCounts/TotalCounts';
import Pagination from '../../../../components/Pagination/Pagination';
import usePagination from '../../../../hooks/usePagination';
import ExhibitionCard from './components/ExhibitionCard/ExhibitionCard';
import { useUser } from '../../../../store/UserProvider.jsx';

export default function Exhibitions() {
  const { user } = useUser();
  const [exhibitions, setExhibitions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, setCurrentPage, pageItems } = usePagination(
    12,
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
    !user && navigate('/login');
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

      const response = await userInstance.get('/api/exhibitions', {
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

  const labelList = ['정렬', '지역', '분야', '전시상태'];

  return (
    <div className={styles.layout}>
      <ListHeader
        title='전시회'
        isFav={exhibitionFilters.liked_only}
        onEvent={getExhibitions}
        onFav={handleFav}
        onSearch={handleSearch}
        value={query}
      />

      <DropdownContainer
        labels={labelList}
        filterList={exhibitionFilter}
        onSetFilter={setExhibitionFilters}
      />

      <TotalCounts num={exhibitions.length} label='전시회' />

      {exhibitions.length === 0 && (
        <div className={styles.nonDataText}>조회된 전시회가 없습니다.</div>
      )}

      <div className={styles.gridContainer}>
        {pageItems.map((item) => (
          <ExhibitionCard
            key={item.id}
            exhibitionItem={item}
            onEvent={getExhibitions}
          />
        ))}
      </div>

      {exhibitions.length > 0 && (
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalItems={exhibitions.length}
        />
      )}
    </div>
  );
}
