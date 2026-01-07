import styles from './ConsoleEdit.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditData } from './hooks/useEditData';
import { useEditSave } from './hooks/useEditSave';

import GalleryEditForm from './forms/GalleryEditForm.jsx';
import ExhibitionEditForm from './forms/ExhibitionEditForm.jsx';
import ArtworkEditForm from './forms/ArtworkEditForm.jsx';
import ArtistEditForm from './forms/ArtistEditForm.jsx';
import AnnouncementEditForm from './forms/AnnouncementEditForm.jsx';
import { useConfirm } from '../../store/ConfirmProvider.jsx';
import { FaChevronLeft } from 'react-icons/fa6';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.jsx';

const EDIT_CONFIG = {
  galleries: {
    title: '갤러리 등록/수정',
    apiUrl: (id) => (id === 'new' ? '/api/galleries' : `/api/galleries/${id}`),
    formImageField: 'gallery_image_file',
  },
  exhibitions: {
    title: '전시회 등록/수정',
    apiUrl: (id) =>
      id === 'new' ? '/api/exhibitions' : `/api/exhibitions/${id}`,
    formImageField: 'exhibition_poster_file',
  },
  artworks: {
    title: '작품 등록/수정',
    apiUrl: (id) => (id === 'new' ? '/api/arts' : `/api/arts/${id}`),
    formImageField: 'image',
  },
  artists: {
    title: '작가 등록/수정',
    apiUrl: (id) => (id === 'new' ? '/api/artists' : `/api/artists/${id}`),
    formImageField: 'artist_image',
  },
  announcements: {
    title: '공고 등록/수정',
    apiUrl: (id) => (id === 'new' ? '/api/announcements' : `/api/announcements/${id}`),
    formImageField: 'announcement_poster_file',
  },
};

const FORM_COMPONENTS = {
  galleries: GalleryEditForm,
  exhibitions: ExhibitionEditForm,
  artworks: ArtworkEditForm,
  artists: ArtistEditForm,
  announcements: AnnouncementEditForm,
};

export default function ConsoleEdit({ type }) {
  const { id } = useParams();
  const { showConfirm } = useConfirm();
  const navigate = useNavigate();
  const isCreateMode = id === 'new';
  const config = EDIT_CONFIG[type];
  const FormComponent = FORM_COMPONENTS[type];

  // 1. 데이터 로딩 Hook
  const { data, setData, isLoading } = useEditData(
    type,
    id,
    isCreateMode,
    config,
  );

  // 2. 저장 로직 Hook
  const { handleSave, isSaving, setSelectedImageFile } = useEditSave(
    type,
    id,
    isCreateMode,
    config,
    data,
    navigate,
  );

  const handleCancel = async () => {
    const isConfirmed = await showConfirm('수정을 취소하시겠습니까?');

    if (isConfirmed) {
      const tabName =
        type === 'galleries'
          ? '갤러리관리'
          : type === 'exhibitions'
            ? '전시회관리'
            : type === 'artists'
              ? '작가관리'
              : type === 'announcements'
                ? '공고관리'
                : '작품관리';

      if (isCreateMode) {
        navigate('/console/main', { state: { activeTab: tabName } });
      } else {
        navigate(`/console/${type}/${id}`);
      }
    }
  };

  const handleFileChange = (file) => setSelectedImageFile(file);

  if (isLoading || !data) return <LoadingSpinner />;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleCancel}>
          <FaChevronLeft />
        </button>
        <h1 className={styles.title}>{config.title}</h1>
      </header>

      <main className={styles.formContainer}>
        {FormComponent && (
          <FormComponent
            data={data}
            setData={setData}
            onFileChange={handleFileChange}
          />
        )}
      </main>

      <div className={styles.bottomButtonContainer}>
        <button
          className={`${styles.button} ${styles.saveButton}`}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          onClick={handleCancel}
          disabled={isSaving}
        >
          취소
        </button>
      </div>
    </div>
  );
}
