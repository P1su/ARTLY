import styles from './Artists.module.css';
import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import ListHeader from '../../components/List/ListHeader/ListHeader';
import DropdownContainer from '../../components/List/DropdownContainer/DropdownContainer';
import { artistFilter } from '../../utils/filters/artisFilter.js';
import TotalCounts from '../../components/List/TotalCounts/TotalCounts';
import Pagination from '../../components/Pagination/Pagination';
import usePagination from '../../hooks/usePagination';
import ArtistCard from './components/ArtistCard/ArtistCard';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, setCurrentPage, pageItems } = usePagination(10, artists);
  const [artistFilters, setArtistFilters] = useState({
    status: '',
    nation: '',
    birthDecade: '',
  });

  const handleFav = () => {
    setIsFav((prev) => !prev);
  };

  useEffect(() => {
    const getArtists = async () => {
      try {
        setIsLoading(true);

        const response = await instance.get('/api/artist', {
          params: artistFilters,
        });

        setArtists(response.data);
      } catch (error) {
        throw new Error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getArtists();
  }, [artistFilters]);

  return (
    <div className={styles.layout}>
      <ListHeader
        title='작가'
        placeholder='작가명 또는 국적 검색'
        isFav={isFav}
        onFav={handleFav}
      />
      <DropdownContainer
        filterList={artistFilter}
        onSetFilter={setArtistFilters}
      />
      <TotalCounts num={artists.length} label='작가' />

      {isLoading && <div>작가 데이터 조회 중..</div>}
      {artists.length === 0 && <div>조회된 데이터가 없습니다.</div>}

      <section className={styles.artistListSection}>
        {pageItems.map((item) => (
          <ArtistCard key={item.id} artistItem={item} />
        ))}
      </section>
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={artists.length}
      />
    </div>
  );
}
