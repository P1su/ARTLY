import styles from './ConsoleEdit.module.css';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
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

  const originalArtworksRef = useRef([]);
  const originalArtistsRef = useRef([]);

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
      try {
        let initialData = {};
        let targetGalleryId = null;

        if (isCreateMode) {
          const exhibitionId = searchParams.get('exhibition_id');
          const galleryId = searchParams.get('gallery_id');

          if (exhibitionId) initialData.exhibition_id = exhibitionId;
          if (galleryId) initialData.gallery_id = galleryId;

          targetGalleryId = galleryId;
        } else {
          const response = await userInstance.get(config.apiUrl(id));
          initialData =
            typeof response.data === 'string'
              ? JSON.parse(response.data)
              : response.data;

          targetGalleryId = initialData.gallery_id;
        }

        if (type === 'exhibitions' && !isCreateMode) {
          const loadedArtworks = initialData.artworks || [];
          originalArtworksRef.current = loadedArtworks;

          const loadedArtists = initialData.artists || [];
          originalArtistsRef.current = loadedArtists;
          console.log(
            `초기 로딩: 작품 ${loadedArtworks.length}개, 작가 ${loadedArtists.length}명`,
          );
        }

        if (type === 'artworks' && targetGalleryId) {
          try {
            console.log(
              `전시회 목록 로딩 시작 (Gallery ID: ${targetGalleryId})`,
            );

            const exhResponse = await userInstance.get(
              `/api/exhibitions?gallery_id=${targetGalleryId}`,
            );

            initialData.exhibitions = Array.isArray(exhResponse.data)
              ? exhResponse.data
              : [];

            console.log('불러온 전시회 개수:', initialData.exhibitions.length);

            if (!isCreateMode && initialData.exhibitions_connected) {
              initialData.selected_exhibition_ids =
                initialData.exhibitions_connected.map((ex) => ex.id);
            }
          } catch (exhError) {
            console.error('전시회 목록 로딩 실패:', exhError);
            initialData.exhibitions = [];
          }
        }

        setData(initialData);
      } catch (error) {
        console.error('데이터 초기화 실패:', error);
        alert('데이터를 불러오지 못했습니다.');
        navigate(`/console/${type}`);
      }
    };

    if (config) initData();
  }, [id, config, isCreateMode, searchParams, navigate, type]);

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      handleAfterAction();
    }
  };

  const handleSave = async () => {
    if (isSaving || !data) return;

    if (type === 'artworks') {
      if (!data.art_title) {
        alert('작품명을 입력해주세요.');
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
    }

    setIsSaving(true);

    try {
      const formData = new FormData();

      if (!isCreateMode) {
        formData.append('_method', 'PATCH');
      }

      // 데이터 순회하며 FormData 구성
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        // SNS 배열 처리
        if (key === 'gallery_sns' && Array.isArray(value)) {
          const validSns = value.filter((sns) => sns.type !== 'twitter');
          formData.append(key, JSON.stringify(validSns));
          return;
        }

        // 객체나 배열은 문자열로 변환, 파일이 아닌 경우만
        if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      if (!formData.has('gallery_id')) {
        const galleryId = data.gallery_id || data.gallery?.id;
        if (galleryId) {
          formData.append('gallery_id', galleryId);
        } else {
          console.error(
            '⚠️ 경고: gallery_id를 찾을 수 없습니다. 저장 시 권한 오류가 발생할 수 있습니다.',
          );
        }
      }

      // 이미지 파일이 선택되었다면 추가
      if (selectedImageFile) {
        formData.append(config.formImageField, selectedImageFile);
      }

      // 1. 메인 저장 API 호출 (작품/전시회/갤러리 생성 또는 수정)
      const url = config.apiUrl(id);
      const response = await userInstance.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const savedId = isCreateMode
        ? response.data.data?.id || response.data.id
        : id;

      if (type === 'exhibitions' && savedId) {
        const currentArtworks = data.artworks || [];
        const originalArtworks = originalArtworksRef.current || [];

        // 추가된 작품: 현재 목록에는 있는데 원본엔 없는 것
        const artsToAdd = currentArtworks.filter(
          (curr) => !originalArtworks.some((orig) => orig.id === curr.id),
        );
        // 삭제된 작품: 원본엔 있는데 현재 목록엔 없는 것
        const artsToDelete = originalArtworks.filter(
          (orig) => !currentArtworks.some((curr) => curr.id === orig.id),
        );

        try {
          // [API] 작품 추가
          const addPromises = artsToAdd.map((art) =>
            userInstance.post(`/api/exhibitions/${savedId}/arts`, {
              art_id: art.id,
              display_order: 0,
            }),
          );

          // [API] 작품 삭제 (DELETE /api/exhibitions/{id}/arts/{art_id})
          const deletePromises = artsToDelete.map((art) =>
            userInstance.delete(`/api/exhibitions/${savedId}/arts/${art.id}`),
          );

          await Promise.all([...addPromises, ...deletePromises]);
          console.log(
            `작품 처리결과: 추가 ${artsToAdd.length}, 삭제 ${artsToDelete.length}`,
          );
        } catch (err) {
          console.error('작품 업데이트 중 오류:', err);
        }

        const currentArtists = data.artists || [];
        const originalArtists = originalArtistsRef.current || [];

        // 비교를 위해 ID 추출 함수 (artist_id 혹은 id)
        const getArtistId = (a) => a.artist_id || a.id;

        // 추가된 작가
        const artistsToAdd = currentArtists.filter(
          (curr) =>
            !originalArtists.some(
              (orig) => getArtistId(orig) === getArtistId(curr),
            ),
        );
        // 삭제된 작가
        const artistsToDelete = originalArtists.filter(
          (orig) =>
            !currentArtists.some(
              (curr) => getArtistId(curr) === getArtistId(orig),
            ),
        );

        try {
          const newArtistIds = artistsToAdd
            .map((a) => getArtistId(a))
            .filter((id) => id);

          if (newArtistIds.length > 0) {
            await userInstance.post(`/api/exhibitions/${savedId}/artists`, {
              artist_ids: newArtistIds,
            });
          }

          const deleteArtistPromises = artistsToDelete.map((artist) => {
            const artistId = getArtistId(artist);
            return userInstance.delete(
              `/api/exhibitions/${savedId}/artists/${artistId}`,
            );
          });

          await Promise.all(deleteArtistPromises);
          console.log(
            `작가 처리결과: 추가 ${artistsToAdd.length}, 삭제 ${artistsToDelete.length}`,
          );
        } catch (err) {
          console.error('작가 업데이트 중 오류:', err);
          alert('작가 목록 업데이트 중 일부 오류가 발생했습니다.');
        }
      }

      if (type === 'artworks') {
        const savedArtId = isCreateMode
          ? response.data.data?.id || response.data.id
          : id;
        const selectedExhibitions = data.selected_exhibition_ids || [];

        if (selectedExhibitions.length > 0 && savedArtId) {
          const connectPromises = selectedExhibitions.map((exhibitionId) => {
            return userInstance.post(`/api/exhibitions/${exhibitionId}/arts`, {
              art_id: savedArtId,
              display_order: 0,
            });
          });

          await Promise.all(connectPromises);
          console.log(`2단계 전시회 ${selectedExhibitions.length}곳 연결 완료`);
        }
      }

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
