import styles from './Artists.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../../../apis/instance.js';
import ListHeader from '../../components/ListHeader/ListHeader';
import DropdownContainer from '../../components/DropdownContainer/DropdownContainer';
import { artistFilter } from '../../../../utils/filters/artisFilter.js';
import TotalCounts from '../../components/TotalCounts/TotalCounts';
import Pagination from '../../../../components/Pagination/Pagination';
import usePagination from '../../../../hooks/usePagination';
import ArtistCard from './components/ArtistCard/ArtistCard';
import { useUser } from '../../../../store/UserProvider.jsx';

export default function Artists() {
  const { user } = useUser();
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, setCurrentPage, pageItems } = usePagination(12, artists);
  const [artistFilters, setArtistFilters] = useState({
    category: '',
    nation: '',
    birthDecade: '',
    liked_only: 0,
  });
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleFav = () => {
    !user && navigate('/login');
    setArtistFilters((prev) => ({
      ...prev,
      liked_only: !prev.liked_only,
    }));
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const getArtists = async () => {
    const params = {
      ...artistFilters,
      search: query,
    };
    try {
      setIsLoading(true);

      const response = await instance.get('/api/artist', {
        params: params,
      });

      setArtists(response.data);
    } catch (error) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getArtists();
  }, [artistFilters]);

  return (
    <div className={styles.layout}>
      <ListHeader
        title='작가'
        placeholder='작가명 또는 국적 검색'
        isFav={artistFilters.liked_only}
        onEvent={getArtists}
        onFav={handleFav}
        onSearch={handleSearch}
        value={query}
      />
      <DropdownContainer
        filterList={artistFilter}
        onSetFilter={setArtistFilters}
      />
      <TotalCounts num={artists.length} label='작가' />

      {isLoading && <div>작가 데이터 조회 중..</div>}
      {artists.length === 0 && <div>조회된 데이터가 없습니다.</div>}

      <div className={styles.gridContainer}>
        {pageItems.map((item) => (
          <ArtistCard key={item.id} artistItem={item} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={artists.length}
      />
    </div>
  );
}
