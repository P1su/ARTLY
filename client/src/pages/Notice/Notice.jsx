import { useEffect, useState } from 'react';
import { instance } from '../../apis/instance.js';
import NoticeCategoryTabs from './components/NoticeCategoryTabs/NoticeCategoryTabs';
import NoticeListTable from './components/NoticeListTable/NoticeListTable';
import Pagination from './components/Pagination/Pagination';

export default function Notice() {
  const [filterOption, setFilterOption] = useState('공모');
  const [currentPage, setCurrentPage] = useState(1);
  const [notices, setNotices] = useState([]);

  const itemsPerPage = 10;

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

  return (
    <>
      <NoticeCategoryTabs
        filterOption={filterOption}
        setFilterOption={setFilterOption}
      />
      <NoticeListTable
        data={notices}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={notices.length}
        itemsPerPage={itemsPerPage}
      />
    </>
  );
}
