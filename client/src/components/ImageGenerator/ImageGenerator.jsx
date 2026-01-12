import styles from './ImageGenerator.module.css';
import React, { useState } from 'react';
import { instance } from './../../apis/instance';
import { FaSpinner } from 'react-icons/fa';

export default function ImageGenerator({ onApply, type = 'poster' }) {
  const [userPrompt, setUserPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const postImageGenerate = async () => {
    setLoading(true);

    try {
      // type에 따라 다른 프롬프트 구성
      const finalPrompt = type === 'poster'
        ? `전시회 포스터 배경용 이미지: ${userPrompt}. 텍스트가 들어갈 공간을 고려한 심플한 배경, 세로 비율`
        : `전시 소개용 삽입 이미지: ${userPrompt}. 작품이나 전시 분위기를 보여주는 상세한 이미지`;
  
      const response = await instance.post('/api/console/images/generate', {
        text: finalPrompt,
      });
      console.log(response);
      setImageUrl(response.data.image);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApply = () => {
    if (onApply && imageUrl) {
      onApply(imageUrl);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentBox}>
        <div className={styles.inputSection}>
          <label className={styles.label}>
            {type === 'image' ? '이미지 스타일 설명' : '배경 스타일 설명'}
          </label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder={type === 'image' 
              ? '예: 몽환적인 밤하늘과 별이 빛나는 풍경' 
              : '예: 시간과 예술을 주제로 한 몽환적인 전시회 포스터 배경'}
            className={styles.textarea}
          />
          <button
            onClick={postImageGenerate}
            className={styles.generateButton}
            disabled={loading}
          >
            {loading ? '이미지 생성 중...' : type === 'image' ? '이미지 생성' : '포스터 이미지 생성'}
          </button>
        </div>

        <div className={styles.resultSection}>
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt='생성된 이미지'
                className={styles.generatedImage}
              />
              <div className={styles.buttonGroup}>
                <button
                  className={styles.downloadButton}
                  onClick={handleDownload}
                >
                  다운로드
                </button>
                {onApply && (
                  <button
                    className={styles.applyButton}
                    onClick={handleApply}
                  >
                    바로 적용
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className={styles.imagePlaceholder}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <FaSpinner className={styles.spinner} />
                  <p>이미지를 생성 중입니다...</p>
                </div>
              ) : (
                type === 'image' 
                  ? '생성된 이미지가 여기에 표시됩니다.' 
                  : '생성된 포스터 이미지가 여기에 표시됩니다.'
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}