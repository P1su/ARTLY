import { useState } from 'react';
import { userInstance } from '../../../apis/instance.js';

const getId = (item) => item.id || item.artist_id;

export const useEditSave = (type, id, isCreateMode, config, data, navigate) => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const validate = () => {
    if (type === 'artworks' && !data.art_title) return '작품명을 입력해주세요.';
    if (type === 'galleries' && !data.gallery_name)
      return '갤러리명을 입력해주세요.';
    if (type === 'exhibitions') {
      if (isCreateMode && !data.gallery_id) return '갤러리 정보가 없습니다.';
      if (!data.exhibition_title) return '전시회명을 입력해주세요.';
    }
    return null;
  };

  const createFormData = () => {
    const formData = new FormData();
    if (!isCreateMode) formData.append('_method', 'PATCH');

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (
        [
          'artists',
          'artworks',
          '_originalArtworks',
          '_originalArtists',
        ].includes(key)
      )
        return;

      if (key === 'gallery_sns' && Array.isArray(value)) {
        const validSns = value.filter((sns) => sns.type !== 'twitter');
        formData.append(key, JSON.stringify(validSns));
        return;
      }

      if (typeof value === 'object' && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    if (!formData.has('gallery_id')) {
      const galleryId = data.gallery_id || data.gallery?.id;
      if (galleryId) formData.append('gallery_id', galleryId);
    }

    if (selectedImageFile) {
      formData.append(config.formImageField, selectedImageFile);
    }

    return formData;
  };

  const handleExhibitionConnections = async (savedId) => {
    // A. 작품 (Artworks) 업데이트
    const currentArtworks = data.artworks || [];
    const originalArtworks = data._originalArtworks || [];

    const artsToAdd = currentArtworks.filter(
      (c) => !originalArtworks.some((o) => getId(o) === getId(c)),
    );
    const artsToDelete = originalArtworks.filter(
      (o) => !currentArtworks.some((c) => getId(c) === getId(o)),
    );

    const artPromises = [
      ...artsToAdd.map((art) =>
        userInstance.post(`/api/exhibitions/${savedId}/arts`, {
          art_id: getId(art),
          display_order: 0,
        }),
      ),
      ...artsToDelete.map((art) =>
        userInstance.delete(`/api/exhibitions/${savedId}/arts/${getId(art)}`),
      ),
    ];

    // B. 작가 (Artists) 업데이트
    const currentArtists = data.artists || [];
    const originalArtists = data._originalArtists || [];

    const artistsToAdd = currentArtists.filter(
      (c) => !originalArtists.some((o) => getId(o) === getId(c)),
    );
    const artistsToDelete = originalArtists.filter(
      (o) => !currentArtists.some((c) => getId(c) === getId(o)),
    );

    const newArtistIds = artistsToAdd.map((a) => getId(a)).filter(Boolean);

    // 작가 추가 (일괄)
    const artistAddPromise =
      newArtistIds.length > 0
        ? userInstance.post(`/api/exhibitions/${savedId}/artists`, {
            artist_ids: newArtistIds,
          })
        : Promise.resolve();

    // 작가 삭제 (개별)
    const artistDeletePromises = artistsToDelete.map((a) =>
      userInstance.delete(`/api/exhibitions/${savedId}/artists/${getId(a)}`),
    );

    try {
      await Promise.all([
        ...artPromises,
        artistAddPromise,
        ...artistDeletePromises,
      ]);
      console.log(
        `업데이트 완료: 작품(추가${artsToAdd.length}/삭제${artsToDelete.length}), 작가(추가${artistsToAdd.length}/삭제${artistsToDelete.length})`,
      );
    } catch (err) {
      console.error('연결 데이터 업데이트 실패:', err);
      alert('연결 데이터 저장 중 일부 오류가 발생했습니다.');
    }
  };

  const handleArtworkConnections = async (savedArtId) => {
    const selectedExhibitions = data.selected_exhibition_ids || [];
    if (selectedExhibitions.length > 0 && savedArtId) {
      const promises = selectedExhibitions.map((exId) =>
        userInstance.post(`/api/exhibitions/${exId}/arts`, {
          art_id: savedArtId,
          display_order: 0,
        }),
      );
      await Promise.all(promises);
    }
  };

  const handleSave = async () => {
    if (isSaving || !data) return;

    const errorMsg = validate();
    if (errorMsg) return alert(errorMsg);

    setIsSaving(true);

    try {
      // 1. 메인 데이터 저장
      const formData = createFormData();
      const response = await userInstance.post(config.apiUrl(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const savedId = isCreateMode
        ? response.data.data?.id || response.data.id
        : id;

      // 2. 관계 데이터 저장
      if (type === 'exhibitions' && savedId) {
        await handleExhibitionConnections(savedId);
      } else if (type === 'artworks') {
        await handleArtworkConnections(savedId);
      }

      alert(isCreateMode ? '등록되었습니다.' : '수정되었습니다.');

      // 저장 후 이동 로직
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
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return { handleSave, isSaving, setSelectedImageFile };
};
