import { useState } from 'react';
import { userInstance } from '../../apis/instance';
import styles from './InvitationGenerator.module.css';
import { useAlert } from '../../store/AlertProvider';

export default function InvitationGenerator({ onApply, isGenerating, onGenerateStart, onGenerateComplete }) {
  const [theme, setTheme] = useState('');
  const [others, setOthers] = useState('');
  const [result, setResult] = useState([]);
  const { showAlert } = useAlert();

  const handleSubmit = async () => {
    if (!theme.trim()) {
      showAlert('전시 주제를 입력해주세요.');
      return;
    }

    if (onGenerateStart) {
      onGenerateStart();
    }

    setResult([]);

    try {
      const response = await userInstance.post(
        '/api/console/invitation/create',
        {
          eventTopic: theme,
          userRequirements: others || '',
        },
      );

      const { data } = response;

      if (data && typeof data === 'string') {
        setResult([data]);
      } else if (Array.isArray(data)) {
        setResult(data);
      } else if (data.invitations && Array.isArray(data.invitations)) {
        setResult(data.invitations);
      } else {
        setResult(['소개글이 생성되었습니다.']);
      }
    } catch (e) {
      console.error('API 호출 실패:', e);
      if (e.response?.status === 401) {
        showAlert('로그인이 필요합니다.');
      } else if (e.response?.status === 403) {
        showAlert('권한이 없습니다.');
      } else {
        showAlert('소개글 생성에 실패했습니다.');
      }
    } finally {
      if (onGenerateComplete) {
        onGenerateComplete();
      }
    }
  };

  const handleRefine = async (text, index) => {
    if (!text.trim()) return;

    try {
      const response = await userInstance.post(
        '/api/console/invitation/refine',
        {
          selectedInvitation: text,
          eventTopic: theme,
          userRequirements: '더 세련되게 다시 작성해주세요',
        },
      );

      const refinedData = response.data;

      setResult((prev) =>
        prev.map((item, i) =>
          i === index
            ? typeof refinedData === 'string'
              ? refinedData
              : item
            : item,
        ),
      );
    } catch (e) {
      console.error('수정 API 호출 실패:', e);
      showAlert('소개글 수정에 실패했습니다.');
    }
  };

  const handleApply = (text) => {
    if (onApply) {
      onApply(text);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>전시 소개글 생성</h1>

      <div className={styles.formArea}>
        <label className={styles.label}>전시 주제</label>
        <input
          type='text'
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder='예: 자연 곁에서, 빛과 그림자'
          className={styles.input}
          disabled={isGenerating}
        />

        <label className={styles.label}>요청사항</label>
        <textarea
          value={others}
          onChange={(e) => setOthers(e.target.value)}
          placeholder='예: 자연을 주제로 한 전시, 감성적인 톤'
          className={styles.textarea}
          disabled={isGenerating}
        />

        <button
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={isGenerating}
        >
          {isGenerating ? '생성 중...' : '소개글 생성'}
        </button>
      </div>

      <div className={styles.resultArea}>
        {isGenerating ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>
              소개글 생성 중...<br />
              잠시만 기다려주세요
            </p>
          </div>
        ) : result.length > 0 ? (
          result.map((text, i) => (
            <div key={i} className={styles.resultCard}>
              <div className={styles.cardHeader}>
                <h3>초안 {i + 1}</h3>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.refineButton}
                    onClick={() => handleRefine(text, i)}
                  >
                    수정하기
                  </button>
                  {onApply && (
                    <button
                      className={styles.applyButton}
                      onClick={() => handleApply(text)}
                    >
                      적용하기
                    </button>
                  )}
                </div>
              </div>
              <p>{text}</p>
            </div>
          ))
        ) : (
          <div className={styles.placeholder}>
            생성된 소개글이 여기에 표시됩니다.
          </div>
        )}
      </div>
    </div>
  );
}