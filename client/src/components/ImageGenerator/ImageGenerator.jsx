import styles from './ImageGenerator.module.css';
import React, { useState } from 'react';
import { instance } from './../../apis/instance';

export default function ImageGenerator() {
  const [userPrompt, setUserPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const postImageGenerate = async () => {
    setLoading(true);

    try {
      const response = await instance.post('/api/console/images/generate', {
        text: userPrompt,
      });
      console.log(response);
      setImageUrl(response.data.image);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentBox}>
        <div className={styles.inputSection}>
          <label className={styles.label}>배경 스타일 설명</label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder='예: 시간과 예술을 주제로 한 몽환적인 전시회 포스터 배경'
            className={styles.textarea}
          />
          <button
            onClick={postImageGenerate}
            className={styles.generateButton}
            disabled={loading}
          >
            {loading ? '이미지 생성 중...' : '포스터 이미지 생성'}
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
              <button
                className={styles.downloadButton}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = imageUrl;
                  link.download = 'generated-image.png';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                이미지 다운로드
              </button>
            </>
          ) : (
            <div className={styles.imagePlaceholder}>
              {loading
                ? '이미지를 생성 중입니다...'
                : '생성된 이미지가 여기에 표시됩니다.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
