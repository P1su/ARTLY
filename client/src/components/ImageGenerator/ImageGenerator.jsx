import styles from './ImageGenerator.module.css';
import React, { useState } from 'react';
import { instance } from './../../apis/instance';

export default function ImageGenerator() {
  const [userPrompt, setUserPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const gpt_model_extraction = 'gpt-5-nano';

  const postImageGenerate = async () => {
    try {
      const response = await instance.post('/api/console/images/generate', {
        text: userPrompt,
      });

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  /*
  // 키워드 추출
  const extractKeywords = async (userText) => {
    console.log('Extracting keywords from userText:', userText);

    try {
      const extractPrompt = `
키워드 생성에 있어 다음과 같은 지침을 따르십시오.
1. 본 서비스는 사용자의 요구사항을 반영하여 전시회 포스터에 적합한 배경 이미지를 생성함을 목표로 합니다.
2. 이미지 탐색을 위해, 사용자가 입력한 요청사항에서 키워드를 추출하여 아래의 json 형식에 맞춰 반환하십시오.
3. keywords는 이미지 생성에 중요한 세부 요소들을 포함합니다.
4. keywords는 기본적으로 하나로만 구성합니다. 의미상 필요하다고 판단되는 경우에만 최대 2개의 키워드를 포함할 수 있습니다.
5. 적절한 키워드를 추출할 수 없는 경우에만, 이미지 생성에 있어 비슷한 맥락을 갖는 관련 키워드를 포함 가능합니다.
6. 각 키워드는 반드시 하나의 단어로만 구성되어야 하며, 영어로 작성되어야 합니다.
7. 키워드는 이미지 검색에 이용되므로, 포스터 배경 이미지에 포함되기에 부적절한 단어는 제외하십시오.

형식:
{
  "keywords": [키워드1, 키워드2(선택사항)],
}

요청사항: "${userText}"
`;

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: gpt_model_extraction,
            messages: [
              {
                role: 'system',
                content:
                  '당신은 사용자의 이미지 생성 요구사항에서 키워드를 추출하는 봇입니다.',
              },
              { role: 'user', content: extractPrompt },
            ],
          }),
        },
      );

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) throw new Error('키워드 추출 실패');

      const jsonText = content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(jsonText);
      const keywords = Array.isArray(parsed.keywords) ? parsed.keywords : [];
      const themes = Array.isArray(parsed.themes) ? parsed.themes : [];

      console.log('Extracted keywords:', { keywords });
      return { keywords, themes };
    } catch (e) {
      console.error('extractKeywords error:', e);
      return { keywords: [], themes: [] };
    }
  };

  // Pixabay 이미지 검색
  const fetchPixabayImages = async (query) => {
    const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=20`;

    console.log('Fetching Pixabay images with query:', query);

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.hits || data.hits.length === 0) return [];

      const n = 2;
      const shuffled = data.hits.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, n);
      return selected.map((item) => item.largeImageURL);
    } catch (err) {
      console.error('Pixabay fetch error:', err);
      return [];
    }
  };

  // URL → File 변환
  const urlToFile = async (url, index) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], `pixabay_${index}.jpg`, { type: blob.type });
  };

  // 이미지 편집 호출
  const callEdits = async (userPrompt, imageFiles) => {
    const prompt = `
이미지 생성에 있어 다음과 같은 지침을 따르십시오.
1. 본 서비스는 사용자의 요구사항을 반영하여 전시회 포스터에 적합한 배경 이미지를 생성함을 목표로 합니다.
2. 사용자가 제공한 스타일 요청사항을 정확하게 시각적으로 반영해야 합니다.
3. 생성된 이미지는 사용자 요구사항의 방향성에 맞는 분위기를 표현해야 합니다.
4. 포스터 디자인은 전문성이 돋보이도록, 시각적 균형과 조화를 고려하여 예술적으로 구성되어야 합니다.
5. 사용자가 요구하지 않은 요소는 지나치게 두드러져서는 안 됩니다.
6. 배경 이미지로 사용되어야 하므로 지나치게 많은 요소들이 산재한 이미지는 삼가십시오.
7. 이미지에 텍스트를 포함하지 마십시오.
8. 절대로 이미지에 텍스트가 포함되어서는 안됩니다.

요구사항: ${userPrompt}`;

    try {
      const formData = new FormData();
      formData.append('model', 'gpt-image-1');
      formData.append('prompt', prompt);

      imageFiles.forEach((file) => {
        formData.append('image[]', file, file.name);
      });

      formData.append('n', '1');
      formData.append('size', '1024x1536');
      formData.append('quality', 'low');

      const response = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },

        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('callEdits error:', data);
        alert('이미지 생성 요청에 실패했습니다.');
        return null;
      }

      if (data.data?.[0]?.b64_json) {
        return `data:image/png;base64,${data.data[0].b64_json}`;
      }

      alert('이미지 생성 결과를 받지 못했습니다.');
      return null;
    } catch (err) {
      console.error('callEdits 예외:', err);
      alert('이미지 생성 중 오류가 발생했습니다.');
      return null;
    }
  };

  // 메인 핸들러
  const handleSubmit = async () => {
    if (!userPrompt.trim()) {
      alert('이미지 요구사항을 입력해주세요!');
      return;
    }

    setLoading(true);
    setImageUrl(null);

    try {
      const { keywords } = await extractKeywords(userPrompt);
      if (keywords.length === 0) {
        alert('키워드 추출에 실패했습니다.');
        setLoading(false);
        return;
      }

      const query = keywords.join(' ');
      const imageUrls = await fetchPixabayImages(query);
      if (imageUrls.length === 0) {
        alert('관련 이미지를 찾지 못했습니다.');
        setLoading(false);
        return;
      }

      const imageFiles = await Promise.all(imageUrls.map(urlToFile));
      const bgImageUrl = await callEdits(userPrompt, imageFiles);

      if (!bgImageUrl) {
        setLoading(false);
        return;
      }

      setImageUrl(bgImageUrl);
    } catch (error) {
      console.error('handleSubmit error:', error);
      alert('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
*/

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>전시회 포스터 이미지 생성</h1>

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
            {loading ? '이미지 생성 중...' : '이미지 생성'}
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
