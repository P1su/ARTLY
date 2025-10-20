import { useEffect, useState } from 'react';
import { instance } from '../../../../apis/instance.js';
import Pagination from '../../../../components/Pagination/Pagination.jsx';
import usePagination from '../../../../hooks/usePagination.jsx';
import styles from './News.module.css';
import ListHeader from '../../components/ListHeader/ListHeader';
import TotalCounts from '../../components/TotalCounts/TotalCounts';
import DropdownContainer from '../../components/DropdownContainer/DropdownContainer';
import { newsFilter } from '../../../../utils/filters/newsFilter.js';
import NewsCard from './components/NewsCard/NewsCard';

export default function News() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, setCurrentPage, pageItems } = usePagination(10, news);
  const [newsFilters, setNewsFilters] = useState({
    category: '',
    status: 'ongoing',
    sort: 'latest',
    liked_only: 0,
  });
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const getNews = async () => {
    try {
      setIsLoading(true);
      const updatedFilters = {
        ...newsFilters,
        search: query,
      };

      const response = await instance.get('/api/announcements', {
        params: updatedFilters,
      });

      setNews(response.data);
    } catch (error) {
      console.error('전시회 목록 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNews();
  }, [newsFilters]);

  return (
    <div className={styles.layout}>
      <ListHeader
        title='공고'
        placeholder='공고 검색'
        onEvent={getNews}
        onSearch={handleSearch}
        value={query}
        isNews
      />

      <DropdownContainer filterList={newsFilter} onSetFilter={setNewsFilters} />

      <TotalCounts num={news.length} label='뉴스' />

      {isLoading && <div>뉴스 데이터 조회 중..</div>}
      {news.length === 0 && <div>조회된 데이터가 없습니다.</div>}

      <section className={styles.newsListSection}>
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
