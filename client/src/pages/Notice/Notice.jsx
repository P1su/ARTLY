import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; 
import { instance } from '../../apis/instance.js';
import NoticeCategoryTabs from './components/NoticeCategoryTabs/NoticeCategoryTabs';
import NoticeListTable from './components/NoticeListTable/NoticeListTable';
import Pagination from '../../components/Pagination/Pagination';
import usePagination from '../../hooks/usePagination';

export default function Notice() {
  const [searchParams, setSearchParams] = useSearchParams(); 
  const initialCategory = searchParams.get('category') || '공모'; 
  const [filterOption, setFilterOption] = useState(initialCategory); 

  const [notices, setNotices] = useState([]);
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

  return (
    <>
      <NoticeCategoryTabs
        filterOption={filterOption}
        setFilterOption={handleFilterChange} 
      />
      <NoticeListTable data={notices} currentPage={currentPage} />
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={notices.length}
      />
    </>
  );
}
