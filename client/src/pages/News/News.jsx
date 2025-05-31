import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { instance } from '../../apis/instance.js';
import NewsCategoryTabs from './components/NewsCategoryTabs/NewsCategoryTabs.jsx';
import NewsListTable from './components/NewsListTable/NewsListTable.jsx';
import Pagination from '../../components/Pagination/Pagination.jsx';
import usePagination from '../../hooks/usePagination.jsx';

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '공모';
  const [filterOption, setFilterOption] = useState(initialCategory);

  const [notices, setNotices] = useState([]);
  const [sortOption, setSortOption] = useState('최신순');
  const [filterStatus, setFilterStatus] = useState('진행중');

  const { currentPage, setCurrentPage } = usePagination(10, notices);

  const getNotices = async () => {
    try {
      const response = await instance.get('/api/announcements', {
        params: {
          category: filterOption,
        },
      });
      setNotices(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getNotices();
    setCurrentPage(1);
  }, [filterOption]);

  const handleFilterChange = (value) => {
    setFilterOption(value);
    setSearchParams({ category: value });
  };

  const getStatusByDate = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (now < startDate) return '예정';
    if (now > endDate) return '종료';
    return '진행중';
  };

  const filteredNotices = notices
    .filter((notice) => {
      return getStatusByDate(notice.start_datetime, notice.end_datetime) === filterStatus;
    })
    .sort((a, b) => {
      const dateA =
        filterStatus === '종료'
          ? new Date(a.end_datetime)
          : new Date(a.start_datetime);
      const dateB =
        filterStatus === '종료'
          ? new Date(b.end_datetime)
          : new Date(b.start_datetime);

      return sortOption === '최신순' ? dateB - dateA : dateA - dateB;
    });

  return (
    <>
      <NewsCategoryTabs
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <NewsListTable data={filteredNotices} currentPage={currentPage} />
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={filteredNotices.length}
      />
    </>
  );
}
