import styles from './ConsoleEdit.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userInstance } from '../../../apis/instance.js';
import GalleryEditForm from './forms/GalleryEditForm.jsx';

const EDIT_CONFIG = {
  galleries: {
    title: '갤러리 수정',
    apiUrl: (id) => `/api/galleries/${id}`,
  },
  exhibitions: {
    title: '전시회 수정',
    apiUrl: (id) => `/api/exhibitions/${id}`,
  },
  artworks: {
    title: '작품 수정',
    apiUrl: (id) => `/api/artworks/${id}`,
  },
};

const FORM_COMPONENTS = {
  galleries: GalleryEditForm,
  // exhibitions: ExhibitionEditForm, // 추후 분리 후 추가
  // artworks: ArtworkEditForm,
};

export default function ConsoleEdit({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const config = EDIT_CONFIG[type];
  const FormComponent = FORM_COMPONENTS[type];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userInstance.get(config.apiUrl(id));
        setData(response.data);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        setData({});
      }
    };
    if (config) fetchData();
  }, [id, config]);

  const handleCancel = () => {
    if (
      window.confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')
    ) {
      navigate(`/console/${type}/${id}`);
    }
  };

  const handleSave = async () => {
    if (isSaving || !data) return;
    setIsSaving(true);

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // 객체나 배열은 JSON 문자열로 변환
        if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    if (selectedImageFile) {
      formData.set('gallery_image', selectedImageFile);
    }

    try {
      await userInstance.put(config.apiUrl(id), formData);
      alert('저장되었습니다.');
      navigate(`/console/${type}/${id}`);
    } catch (error) {
      console.error('데이터 저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (file) => {
    setSelectedImageFile(file);
  };

  if (!data) return <div>데이터 로딩 중...</div>;

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
        >
          저장
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
