import styles from './Galleries.module.css';
import { instance } from '../../apis/instance.js';
import { useEffect, useState } from 'react';
import ListHeader from '../../components/List/ListHeader/ListHeader';
import DropdownContainer from '../../components/List/DropdownContainer/DropdownContainer';
import { galleryFilter } from '../../utils/filters/galleryFilter.js';
import GalleryCard from '../Nearby/components/GalleryCard/GalleryCard';
import TotalCounts from '../../components/List/TotalCounts/TotalCounts';
import Pagination from '../../components/Pagination/Pagination';
import usePagination from '../../hooks/usePagination';

export default function Galleries() {
  const [galleries, setGalleries] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, setCurrentPage, pageItems } = usePagination(
    10,
    galleries,
  );
  const [galleryFilters, setGalleryFilters] = useState({
    status: '',
    regions: '',
    type: '',
  });

  const handleFav = () => {
    setIsFav((prev) => !prev);
  };

  useEffect(() => {
    const getGalleies = async () => {
      try {
        setIsLoading(true);
        const response = await instance.get('/api/galleries', {
          params: galleryFilters,
        });

        setGalleries(response.data);
      } catch (error) {
        throw new Error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getGalleies();
  }, [galleryFilters]);

  return (
    <div className={styles.layout}>
      <ListHeader
        title='갤러리'
        placeholder='갤러리명 검색'
        isFav={isFav}
        onFav={handleFav}
      />
      <DropdownContainer
        filterList={galleryFilter}
        onSetFilter={setGalleryFilters}
      />
      <TotalCounts num={galleries.length} label='갤러리' />
      {isLoading && <div>갤러리 데이터 조회 중..</div>}
      {pageItems.map((item) => (
        <GalleryCard key={item.id} galleryItem={item} />
      ))}
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={galleries.length}
      />
    </div>
  );
}
