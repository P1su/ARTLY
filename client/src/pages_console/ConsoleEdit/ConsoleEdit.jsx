import styles from './ConsoleEdit.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditData } from './hooks/useEditData';
import { useEditSave } from './hooks/useEditSave';

import GalleryEditForm from './forms/GalleryEditForm.jsx';
import ExhibitionEditForm from './forms/ExhibitionEditForm.jsx';
import ArtworkEditForm from './forms/ArtworkEditForm.jsx';

const EDIT_CONFIG = {
  galleries: {
    title: '갤러리 수정',
    apiUrl: (id) => (id === 'new' ? '/api/galleries' : `/api/galleries/${id}`),
    formImageField: 'gallery_image_file',
  },
  exhibitions: {
    title: '전시회 수정',
    apiUrl: (id) =>
      id === 'new' ? '/api/exhibitions' : `/api/exhibitions/${id}`,
    formImageField: 'exhibition_poster_file',
  },
  artworks: {
    title: '작품 수정',
    apiUrl: (id) => (id === 'new' ? '/api/arts' : `/api/arts/${id}`),
    formImageField: 'image',
  },
};

const FORM_COMPONENTS = {
  galleries: GalleryEditForm,
  exhibitions: ExhibitionEditForm,
  artworks: ArtworkEditForm,
};

export default function ConsoleEdit({ type }) {
  const { id } = useParams();
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

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      const tabName =
        type === 'galleries'
          ? '갤러리관리'
          : type === 'exhibitions'
            ? '전시회관리'
            : '작품관리';
      if (isCreateMode) {
        navigate('/console/main', { state: { activeTab: tabName } });
      } else {
        navigate(`/console/${type}/${id}`);
      }
    }
  };

  const handleFileChange = (file) => setSelectedImageFile(file);

  if (isLoading || !data) return <div>데이터 로딩 중...</div>;

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleCancel}>
          {'<'}
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
