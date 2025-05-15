import { useParams } from 'react-router-dom';
import { mockNoticeDetail } from './mock/mockNoticeDetail';
import NoticeContentsSection from './components/NoticeContentsSection/NoticeContentsSection';

export default function NoticeDetail() {
  const { noticeId } = useParams();
  const notice = mockNoticeDetail.find((n) => String(n.id) === noticeId);

  if (!notice) {
    return <div>해당 공지가 존재하지 않습니다.</div>;
  }

  return <NoticeContentsSection notice={notice} />;
}
