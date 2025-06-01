import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import Pagination from '../../components/Pagination/Pagination.jsx';
import usePagination from '../../hooks/usePagination.jsx';
import styles from './News.module.css';
import ListHeader from '../../components/List/ListHeader/ListHeader';
import TotalCounts from '../../components/List/TotalCounts/TotalCounts';
import DropdownContainer from '../../components/List/DropdownContainer/DropdownContainer';
import { newsFilter } from '../../utils/filters/newsFilter.js';
import NewsCard from './components/NewsCard/NewsCard';

export default function News() {
  const [news, setNews] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, setCurrentPage, pageItems } = usePagination(10, news);
  const [newsFilters, setNewsFilters] = useState({
    category: '공모',
    status: 'ongoing',
    sort: 'latest',
  });


  const handleFav = () => {
    setIsFav((prev) => !prev);
  };

  useEffect(() => {
    const getNews = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get('/api/announcements', {
          params: newsFilters, 
        });
        setNews(response.data);
      } catch (error) {
        console.error('전시회 목록 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getNews();
  }, [newsFilters]);

  return (
    <div className={styles.layout}>
      <ListHeader
        title="뉴스"
        placeholder="전시회명 또는 장소 검색"
        isFav={isFav}
        onFav={handleFav}
      />   

      <DropdownContainer
        filterList={newsFilter}
        onSetFilter={setNewsFilters}
      />

      <TotalCounts num={news.length} label="전시회" />

      {isLoading && <div>작가 데이터 조회 중..</div>}
      {news.length === 0 && <div>조회된 데이터가 없습니다.</div>}

      <section className={styles.exhibitionListSection}>
        {pageItems.map((item) => (
          <NewsCard key={item.id} newsItem={item} />
        ))}
      </section>

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={news.length}
      />
    </div>
  );
}