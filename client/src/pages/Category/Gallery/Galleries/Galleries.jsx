import styles from './Galleries.module.css';
import { userInstance } from '../../../../apis/instance.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListHeader from '../../components/ListHeader/ListHeader';
import DropdownContainer from '../../components/DropdownContainer/DropdownContainer';
import { galleryFilter } from '../../../../utils/filters/galleryFilter.js';
import GalleryCard from '../../../Nearby/components/GalleryCard/GalleryCard';
import TotalCounts from '../../components/TotalCounts/TotalCounts';
import Pagination from '../../../../components/Pagination/Pagination';
import usePagination from '../../../../hooks/usePagination';
import useModal from './../../../../hooks/useModal';
import GalleryMapModal from './components/GalleryMapModal/GalleryMapModal.jsx';
import { useUser } from '../../../../store/UserProvider.jsx';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner.jsx';
import FavButton from '../../components/FavButton/FavButton.jsx';

export default function Galleries() {
  const { user } = useUser();
  const [galleries, setGalleries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const { isOpen, handleOpenModal } = useModal();

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
      const response = await userInstance.get('/api/galleries', {
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
      {isOpen && <GalleryMapModal onOpen={handleOpenModal} />}
      <ListHeader
        title='갤러리'
        isFav={galleryFilters.liked_only}
        onEvent={getGalleies}
        onFav={handleFav}
        onSearch={handleSearch}
        value={query}
      />
      <div className={styles.dropboxContainer}>
        <DropdownContainer
          filterList={galleryFilter}
          onSetFilter={setGalleryFilters}
        />
        <div className={styles.dropBoxButtonSection}>
          <button className={styles.mapButton} onClick={handleOpenModal}>
            지도
          </button>
          <FavButton onFav={handleFav} isFav={galleryFilters.liked_only} />
        </div>
      </div>

      <TotalCounts num={galleries.length} label='갤러리' />
      {isLoading && <LoadingSpinner />}

      {!isLoading && galleries.length === 0 && (
        <div className={styles.nonDataText}>조회된 갤러리가 없습니다.</div>
      )}

      <div className={styles.gridContainer}>
        {pageItems.map((item) => (
          <GalleryCard key={item.id} galleryItem={item} onEvent={getGalleies} />
        ))}
      </div>

      {galleries.length > 0 && (
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalItems={galleries.length}
        />
      )}
    </div>
  );
}
