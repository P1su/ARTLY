import { useState } from 'react';
import { mockNotice } from './mock/mockNotice';
import NoticeCategoryTabs from './components/NoticeCategoryTabs/NoticeCategoryTabs';
import NoticeListTable from './components/NoticeListTable/NoticeListTable';
import Pagination from './components/Pagination/Pagination';

export default function Notice() {
  const [activeTab, setActiveTab] = useState('공모');
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const itemsPerPage = 10;
  const filtered = mockNotice.filter((item) => item.category === activeTab);

  return (
    <>
      <NoticeCategoryTabs activeTab={activeTab} setActiveTab={handleTabChange} />
      <NoticeListTable
        data={filtered}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
      />
    </>
  );
}
