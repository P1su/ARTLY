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
      <NewsCategoryTabs
        filterOption={filterOption}
        setFilterOption={handleFilterChange} 
      />
      <NewsListTable data={notices} currentPage={currentPage} />
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={notices.length}
      />
    </>
  );
}
