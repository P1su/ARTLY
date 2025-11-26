import styles from './ConsoleEdit.module.css';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userInstance } from '../../apis/instance.js';

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
  const [searchParams] = useSearchParams();

  const [data, setData] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const isCreateMode = id === 'new';
  const config = EDIT_CONFIG[type];
  const FormComponent = FORM_COMPONENTS[type];

  const getTabNameByType = (type) => {
    switch (type) {
      case 'galleries':
        return '갤러리관리';
      case 'exhibitions':
        return '전시회관리';
      case 'artworks':
        return '작품관리';
      default:
        return '갤러리관리';
    }
  };

  const handleAfterAction = () => {
    if (isCreateMode) {
      navigate('/console/main', {
        state: { activeTab: getTabNameByType(type) },
      });
    } else {
      navigate(`/console/${type}/${id}`);
    }
  };

  useEffect(() => {
    const initData = async () => {
      if (isCreateMode) {
        // 1. 생성 모드: 빈 객체로 초기화 + 쿼리 파라미터 반영
        const initialData = {};

        // URL에서 전달받은 ID가 있다면 미리 넣어줌 (예: ?exhibition_id=1)
        const exhibitionId = searchParams.get('exhibition_id');
        const galleryId = searchParams.get('gallery_id');

        if (exhibitionId) initialData.exhibition_id = exhibitionId;
        if (galleryId) initialData.gallery_id = galleryId;

        setData(initialData);
        console.log(data);
      } else {
        // 2. 수정 모드: 서버에서 데이터 조회
        try {
          const response = await userInstance.get(config.apiUrl(id));
          const resData =
            typeof response.data === 'string'
              ? JSON.parse(response.data)
              : response.data;
          setData(resData);
        } catch (error) {
          console.error('데이터 로딩 실패:', error);
          alert('데이터를 불러오지 못했습니다.');
          navigate(`/console/${type}/${id}`);
        }
      }
    };

    if (config) initData();
  }, [id, config, isCreateMode, searchParams, navigate]);

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      handleAfterAction();
    }
  };

  const handleSave = async () => {
    if (isSaving || !data) return;

    if (type === 'artworks') {
      if (!data.artist_id) {
        alert('작가를 선택해주세요.');
        return;
      }
      if (!data.art_title) {
        alert('작품명을 입력해주세요.');
        return;
      }
      if (!selectedImageFile) {
        alert('작품 이미지를 등록해주세요.');
        return;
      }
    } else if (type === 'galleries') {
      if (!data.gallery_name) {
        alert('갤러리명을 입력해주세요.');
        return;
      }
    } /*if (type === 'exhibitions')*/ else {
      if (isCreateMode && !data.gallery_id) {
        alert('잘못된 접근입니다. 갤러리 정보가 없습니다.');
        return;
      }

      if (!data.exhibition_title) {
        alert('전시회명을 입력해주세요.');
        return;
      }
      if (!data.exhibition_start_date || !data.exhibition_end_date) {
        alert('전시기간을 입력해주세요.');
        return;
      }
      if (!data.exhibition_start_time || !data.exhibition_end_time) {
        alert('관람시간을 입력해주세요.');
        return;
      }
      if (!data.exhibition_organization) {
        alert('전시장소를 입력해주세요.');
        return;
      }
    }

    setIsSaving(true);

    const formData = new FormData();

    if (!isCreateMode) {
      formData.append('_method', 'PATCH');
    }

    const ignoredKeys = [
      'id',
      'created_at',
      'updated_at',
      'user_id',
      'artworks',
      'exhibitions',
      'reviews',
      'is_liked',
      'gallery',
      'artist_users',
      'artist', // artist 객체 자체는 보내지 않음 (artist_id만 필요)
    ];

    Object.entries(data).forEach(([key, value]) => {
      if (ignoredKeys.includes(key)) return;

      if (value === undefined || value === null) return;

      if (typeof value === 'object' && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    console.log('=== 전송 데이터 확인 ===');
    for (let [key, val] of formData.entries()) {
      console.log(`${key}:`, val);
    }
    if (selectedImageFile) {
      formData.append(config.formImageField, selectedImageFile);
    }

    try {
      const url = config.apiUrl(id);

      const response = await userInstance.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('저장 성공:', response.data);
      alert(isCreateMode ? '등록되었습니다.' : '수정되었습니다.');
      handleAfterAction();
    } catch (error) {
      console.error('저장 오류:', error);
      if (error.response) {
        console.log('서버 응답 메시지:', error.response.data);
        const msg =
          typeof error.response.data === 'object'
            ? error.response.data.message || JSON.stringify(error.response.data)
            : '서버 오류가 발생했습니다.';
        alert(`저장 실패: ${msg}`);
      } else {
        alert('저장 중 네트워크 오류가 발생했습니다.');
      }
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
