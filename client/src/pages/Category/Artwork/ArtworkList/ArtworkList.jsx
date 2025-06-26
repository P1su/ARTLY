import styles from './ArtworkList.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../../../apis/instance.js';
import ArtworkCard from './components/ArtworkCard/ArtworkCard';
import TotalCounts from '../../../../components/List/TotalCounts/TotalCounts';
import Pagination from '../../../../components/Pagination/Pagination';
import usePagination from '../../../../hooks/usePagination';

export default function ArtworkList() {
  const [artworks, setArtworks] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, setCurrentPage, pageItems } = usePagination(
    10,
    artworks,
  );
  const navigate = useNavigate();
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

  const handleFav = () => {
    !localStorage.getItem('ACCESS_TOKEN') && navigate('/login');
    setIsFav((prev) => !prev);
  };

  return (
    <div className={styles.layout}>
      <h1 className={styles.listTitle}>작품</h1>

      <TotalCounts num={artworks.length} label='작품' />
      {isLoading && <div>작품 리스트 불러오는 중</div>}
      {pageItems.map((item) => (
        <ArtworkCard key={item.id} artworkItems={item} />
      ))}
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={artworks.length}
      />
    </div>
  );
}
