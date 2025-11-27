import styles from './EditForm.module.css';
import { useEffect, useRef, useState } from 'react';
import TiptapEditor from '../components/TiptapEditor.jsx';

export default function ExhibitionEditForm({ data, setData, onFileChange }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  // const [artistInput, setArtistInput] = useState('');
  // const [artistIdInput, setArtistIdInput] = useState('');
  // const [artistRoleInput, setArtistRoleInput] = useState('');

  // useEffect(() => {
  //   if (Array.isArray(data.artists)) {
  //     setArtistInput(data.artists.join(', '));
  //   } else if (typeof data.artists === 'string') {
  //     setArtistInput(data.artists);
  //   }
  // }, [data.artists]);

  useEffect(() => {
    if (data.exhibition_poster && typeof data.exhibition_poster === 'string') {
      setImagePreviewUrl(data.exhibition_poster);
    }
  }, [data.exhibition_poster]);

  const handleRemoveImage = (e) => {
    e.stopPropagation(); // 부모의 클릭 이벤트(파일 열기) 전파 방지
    setImagePreviewUrl(null);
    onFileChange(null); // 부모 컴포넌트의 선택된 파일 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (html) => {
    setData((prev) => ({ ...prev, exhibition_description: html }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileChange(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
    event.target.value = '';
  };

  const daysOfWeek = [
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
    '일요일',
  ];

  const handleCheckboxChange = (e) => {
    const { value: day, checked } = e.target;

    const currentClosedDays = data.exhibition_closed_day
      ? data.exhibition_closed_day.split(',').map((d) => d.trim())
      : [];

    let newClosedDays;
    if (checked) {
      newClosedDays = [...new Set([...currentClosedDays, day])];
    } else {
      newClosedDays = currentClosedDays.filter((d) => d !== day);
    }

    const daysOrder = daysOfWeek;
    newClosedDays.sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));

    setData((prev) => ({
      ...prev,
      exhibition_closed_day: newClosedDays.join(', '),
    }));
  };

  // // [추가] 입력 중일 때는 문자열만 업데이트
  // const handleArtistChange = (e) => {
  //   setArtistInput(e.target.value);
  // };

  // // [추가] 입력창에서 나갈 때(포커스 해제) 배열로 변환하여 원본 data 업데이트
  // const handleArtistBlur = () => {
  //   // 콤마(,)를 기준으로 자르고 앞뒤 공백 제거
  //   const artistArray = artistInput
  //     .split(',')
  //     .map((name) => name.trim())
  //     .filter((name) => name !== ''); // 빈 문자열 제거

  //   setData((prev) => ({ ...prev, artists: artistArray }));
  // };
  // // [핵심 기능] 작가 개별 등록 함수 (메인 저장과 별개로 동작)
  // const handleAddArtist = async () => {
  //   if (!artistIdInput) {
  //     alert('작가 ID를 입력해주세요.');
  //     return;
  //   }

  //   // API 명세에 맞춘 payload
  //   const payload = {
  //     artist_id: parseInt(artistIdInput, 10), // 정수로 변환
  //     role: artistRoleInput || 'Artist', // 역할이 없으면 기본값
  //   };

  //   try {
  //     // 전시회 ID는 data.id에 있다고 가정
  //     await userInstance.post(`/api/exhibitions/${data.id}/artworks`, payload);

  //     alert('작가가 성공적으로 등록되었습니다.');

  //     // 입력창 초기화
  //     setArtistIdInput('');
  //     setArtistRoleInput('');

  //     // (선택사항) 목록 갱신이 필요하다면 부모 컴포넌트에서 재조회 함수를 받아서 호출해야 함
  //     // 임시로 화면에 반영하는 로직 (실제 데이터 구조에 맞춰 수정 필요)
  //     // setData(prev => ({
  //     //   ...prev,
  //     //   artists: [...(prev.artists || []), `ID:${payload.artist_id}`]
  //     // }));
  //   } catch (error) {
  //     console.error('작가 등록 실패:', error);
  //     alert('작가 등록에 실패했습니다. ID를 확인해주세요.');
  //   }
  // };

  return (
    <>
      <div className={styles.card}>
        <input
          className={`${styles.input} ${styles.galleryNameInput}`}
          name='exhibition_title'
          value={data.exhibition_title || ''}
          onChange={handleInputChange}
          placeholder='전시회 제목'
        />

        <input
          type='file'
          ref={fileInputRef}
          onChange={handleImageChange}
          accept='image/*'
          style={{ display: 'none' }}
        />

        <div
          className={styles.imageUploadBox}
          onClick={() => fileInputRef.current.click()}
        >
          {imagePreviewUrl ? (
            <>
              <img
                src={imagePreviewUrl}
                alt='전시 포스터 미리보기'
                className={styles.previewImage}
              />
              <button
                type='button'
                onClick={handleRemoveImage}
                className={styles.imageDelBtn}
                title='이미지 삭제'
              >
                ✕
              </button>
            </>
          ) : (
            <p className={styles.previewImageDesc}>
              + 전시 포스터를 업로드 해주세요
            </p>
          )}
        </div>

        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>전시기간</label>
            <div className={styles.timeInputContainer}>
              <input
                type='date'
                className={styles.timeInput}
                name='exhibition_start_date'
                value={data.exhibition_start_date || ''}
                onChange={handleInputChange}
              />
              <span>~</span>
              <input
                type='date'
                className={styles.timeInput}
                name='exhibition_end_date'
                value={data.exhibition_end_date || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>관람시간</label>
            <div className={styles.timeInputContainer}>
              <input
                type='time'
                className={styles.timeInput}
                name='exhibition_start_time'
                value={data.exhibition_start_time?.slice(0, 5) || ''}
                onChange={handleInputChange}
              />
              <span>~</span>
              <input
                type='time'
                className={styles.timeInput}
                name='exhibition_end_time'
                value={data.exhibition_end_time?.slice(0, 5) || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>휴관일</label>
            <div className={styles.checkboxGroup}>
              {daysOfWeek.map((day) => (
                <label key={day}>
                  <input
                    type='checkbox'
                    name='closedDays'
                    value={day}
                    checked={data.exhibition_closed_day?.includes(day)}
                    onChange={handleCheckboxChange}
                  />{' '}
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>전시장소</label>
            <input
              className={styles.input}
              name='exhibition_organization'
              value={data.exhibition_organization || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>주소</label>
            <input
              className={styles.input}
              name='exhibition_location'
              value={data.exhibition_location || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>입장료</label>
            <input
              className={styles.input}
              name='exhibition_price'
              value={data.exhibition_price || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>전화번호</label>
            <input
              className={styles.input}
              name='exhibition_phone'
              value={data.exhibition_phone || ''}
              onChange={handleInputChange}
            />
          </div>

          {/* 작가 수정 부분 교체
          <div className={styles.inputGroup}>
            <label className={styles.label}>참여 작가 (쉼표로 구분)</label>
            <input
              className={styles.input}
              name='artists'
              value={artistInput} // data.artists 대신 artistInput 사용
              onChange={handleArtistChange} // 입력 핸들러 교체
              onBlur={handleArtistBlur} // 저장 핸들러 추가
              placeholder='예: 홍길동, 김철수, 이영희'
            />
          </div> */}

          {/* <div className={styles.inputGroup}>
            <label className={styles.label}>참여 작가 등록</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type='number'
                className={styles.input}
                placeholder='작가 ID (숫자)'
                value={artistIdInput}
                onChange={(e) => setArtistIdInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <input
                type='text'
                className={styles.input}
                placeholder='역할 (예: Main Artist)'
                value={artistRoleInput}
                onChange={(e) => setArtistRoleInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type='button'
                onClick={handleAddArtist}
                style={{
                  padding: '0 2rem',
                  backgroundColor: '#4a5bba',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1.4rem',
                }}
              >
                등록
              </button>
            </div>
            <div
              style={{ marginTop: '1rem', fontSize: '1.4rem', color: '#666' }}
            >
              현재 등록된 작가:{' '}
              {Array.isArray(data.artists)
                ? data.artists.join(', ')
                : typeof data.artists === 'string'
                  ? data.artists
                  : '없음'}
            </div>
          </div> */}

          <div className={styles.inputGroup}>
            <label className={styles.label}>홈페이지</label>
            <input
              className={styles.input}
              type='url'
              name='exhibition_homepage'
              value={data.exhibition_homepage || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.tiptap}`}>
        <label className={styles.label}>전시 소개</label>
        <TiptapEditor
          content={data.exhibition_description || ''}
          onChange={handleDescriptionChange}
        />
      </div>
    </>
  );
}
