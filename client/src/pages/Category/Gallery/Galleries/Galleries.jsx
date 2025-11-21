import styles from './Galleries.module.css';
import { instance } from '../../../../apis/instance.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListHeader from '../../components/ListHeader/ListHeader';
import DropdownContainer from '../../components/DropdownContainer/DropdownContainer';
import { galleryFilter } from '../../../../utils/filters/galleryFilter.js';
import GalleryCard from '../../../Nearby/components/GalleryCard/GalleryCard';
import TotalCounts from '../../components/TotalCounts/TotalCounts';
import Pagination from '../../../../components/Pagination/Pagination';
import usePagination from '../../../../hooks/usePagination';
import { useUser } from '../../../../store/UserProvider.jsx';

export default function Galleries() {
  const { user } = useUser();
  const [galleries, setGalleries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, setCurrentPage, pageItems } = usePagination(
    12,
    galleries,
  );
  const [galleryFilters, setGalleryFilters] = useState({
    status: '',
    regions: '',
    type: '',
    liked_only: 0,
  });
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const handleFav = () => {
    !user && navigate('/login');
    setGalleryFilters((prev) => ({
      ...prev,
      liked_only: !prev.liked_only,
    }));
  };

  const getGalleies = async () => {
    try {
      setIsLoading(true);
      const updatedFilters = {
        ...galleryFilters,
        regions: galleryFilters.regions.replace(/\s+/g, ','),
        search: query,
      };
      const response = await instance.get('/api/galleries', {
        params: updatedFilters,
      });

      setGalleries(response.data);
    } catch (error) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGalleies();
  }, [galleryFilters]);

  return (
    <div className={styles.layout}>
      <ListHeader
        title='갤러리'
        placeholder='갤러리명 검색'
        isFav={galleryFilters.liked_only}
        onEvent={getGalleies}
        onFav={handleFav}
        onSearch={handleSearch}
        value={query}
      />
      <DropdownContainer
        filterList={galleryFilter}
        onSetFilter={setGalleryFilters}
      />

      <TotalCounts num={galleries.length} label='갤러리' />
      {galleries.length === 0 && <div>조회된 데이터가 없습니다.</div>}

      <div className={styles.gridContainer}>
        {pageItems.map((item) => (
          <GalleryCard key={item.id} galleryItem={item} onEvent={getGalleies} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={galleries.length}
      />
    </div>
  );
}
