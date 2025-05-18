import { instance } from '../../apis/instance.js';
import { useEffect, useState } from 'react';
import NoticeCategoryTabs from './components/NoticeCategoryTabs/NoticeCategoryTabs';
import NoticeListTable from './components/NoticeListTable/NoticeListTable';
import Pagination from './components/Pagination/Pagination';

export default function Notice() {
  const [activeTab, setActiveTab] = useState('공모');
  const [currentPage, setCurrentPage] = useState(1);
  const [notices, setNotices] = useState([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;

  const getNotices = async () => {
    try {
      const response = await instance.get('/api/announcements', {
        params: {
          category: activeTab,
        },
      });

      setNotices(response.data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getNotices();
  }, [activeTab]);

  return (
    <>
      <NoticeCategoryTabs
        activeTab={activeTab}
        setActiveTab={handleTabChange}
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
