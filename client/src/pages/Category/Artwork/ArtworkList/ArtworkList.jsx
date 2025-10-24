import styles from './ArtworkList.module.css';
import { useState, useEffect } from 'react';
import { instance } from '../../../../apis/instance.js';
import ArtworkCard from './components/ArtworkCard/ArtworkCard';
import TotalCounts from '../../components/TotalCounts/TotalCounts';
import Pagination from '../../../../components/Pagination/Pagination';
import usePagination from '../../../../hooks/usePagination';
import ListHeader from './../../components/ListHeader/ListHeader';

export default function ArtworkList() {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, setCurrentPage, pageItems } = usePagination(
    10,
    artworks,
  );
  const [artworkFilters, setArtworkFilters] = useState({
    type: '',
  });

  useEffect(() => {
    const getGalleies = async () => {
      try {
        setIsLoading(true);
        const response = await instance.get('/api/arts');

        setArtworks(response.data);
      } catch (error) {
        throw new Error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getGalleies();
  }, [artworkFilters]);

  return (
    <div className={styles.layout}>
      <ListHeader title='작품' isArtworks />

      <TotalCounts num={artworks.length} label='작품' />
      {isLoading && <div>작품 리스트 불러오는 중</div>}
      <div className={styles.gridContainer}>
        {pageItems.map((item) => (
          <ArtworkCard key={item.id} artworkItems={item} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={artworks.length}
      />
    </div>
  );
}
