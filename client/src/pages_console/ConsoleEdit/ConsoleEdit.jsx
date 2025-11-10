import styles from './ConsoleEdit.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userInstance } from '../../apis/instance.js';
import GalleryEditForm from './forms/GalleryEditForm.jsx';
import ExhibitionEditForm from './forms/ExhibitionEditForm.jsx';
import ArtworkEditForm from './forms/ArtworkEditForm.jsx';

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
    apiUrl: (id) => `/api/arts/${id}`,
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
  const [data, setData] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const config = EDIT_CONFIG[type];
  const FormComponent = FORM_COMPONENTS[type];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userInstance.get(config.apiUrl(id));
        const resData =
          typeof response.data === 'string'
            ? JSON.parse(response.data)
            : response.data;
        setData(resData);
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

    // ✅ 타입별 이미지 필드명 매핑
    const imageFieldMap = {
      galleries: 'gallery_image',
      exhibitions: 'exhibition_poster',
      artworks: 'art_image',
    };
    const imageKey = imageFieldMap[type];

    // ✅ 모든 필드 포함한 formData 구성
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      // 값이 null 또는 undefined라도 필드 자체는 유지 (초기화 방지 목적)
      if (value === undefined) return;

      if (typeof value === 'object' && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value ?? '');
      }
    });

    // ✅ 선택된 새 이미지가 있을 경우에만 교체
    if (selectedImageFile) {
      formData.set(imageKey, selectedImageFile);
    } else if (data[imageKey]) {
      // 기존 이미지가 존재하면 다시 세팅해서 유지
      formData.set(imageKey, data[imageKey]);
    }

    try {
      const response = await userInstance.put(config.apiUrl(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('✅ 저장 성공:', response.data);
      alert('저장되었습니다.');
      navigate(`/console/${type}/${id}`);
    } catch (error) {
      console.error('❌ 데이터 저장 실패:', error);
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
