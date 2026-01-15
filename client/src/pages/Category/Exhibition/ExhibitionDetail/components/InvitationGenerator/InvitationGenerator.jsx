import { useState, useEffect, useRef } from 'react';
import { userInstance } from '../../../../../../apis/instance';
import styles from './InvitationGenerator.module.css';
import html2canvas from 'html2canvas';
import { useAlert } from '../../../../../../store/AlertProvider';

export default function InvitationGenerator({
  initialTheme = '',
  initialOthers = '',
  showTitle = true,
  onApply,  // 추가
  isGenerating,  // 추가
  onGenerateStart,  // 추가
  onGenerateComplete,  // 추가
}) {
  const [theme, setTheme] = useState(initialTheme);
  const [others, setOthers] = useState(initialOthers);
  const [invitation, setInvitation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const textRefs = useRef([]);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (initialTheme) setTheme(initialTheme);
    if (initialOthers !== undefined) setOthers(initialOthers);
  }, [initialTheme, initialOthers]);

  const handleSubmit = async () => {
    setInvitation([]);
    setIsLoading(true);
    
    if (onGenerateStart) onGenerateStart();  // 추가

    if (!theme.trim()) {
      setInvitation(['행사 주제를 입력해주세요.']);
      setIsLoading(false);
      if (onGenerateComplete) onGenerateComplete();  // 추가
      return;
    }

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
        setInvitation([data]);
      } else if (Array.isArray(data)) {
        setInvitation(data);
      } else if (data.invitations && Array.isArray(data.invitations)) {
        setInvitation(data.invitations);
      } else {
        setInvitation(['초대장이 생성되었습니다.']);
      }
    } catch (e) {
      console.error('API 호출 실패:', e);
      if (e.response?.status === 401) {
        setInvitation(['로그인이 필요합니다. 다시 로그인해주세요.']);
      } else if (e.response?.status === 403) {
        setInvitation(['권한이 없습니다.']);
      } else {
        setInvitation([`API 호출 오류: ${e.message}`]);
      }
    } finally {
      setIsLoading(false);
      if (onGenerateComplete) onGenerateComplete();  // 추가
    }
  };

  const handleRefine = async (invitationText, index) => {
    if (!invitationText.trim()) return;

    try {
      const response = await userInstance.post(
        '/api/console/invitation/refine',
        {
          selectedInvitation: invitationText,
          eventTopic: theme,
          userRequirements: '더 세련되게 다시 작성해주세요',
        },
      );

      const refinedData = response.data;
      const refinedText = Array.isArray(refinedData)
        ? refinedData[0]
        : refinedData;

      setInvitation((prev) =>
        prev.map((item, i) => (i === index ? refinedText : item)),
      );
    } catch (e) {
      console.error('수정 API 호출 실패:', e);
      if (e.response?.status === 401) {
        showAlert('로그인이 필요합니다. 다시 로그인해주세요.');
      } else if (e.response?.status === 403) {
        showAlert('권한이 없습니다.');
      } else {
        showAlert('초대장 수정에 실패했습니다.', 'error');
      }
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showAlert('클립보드에 복사되었습니다!');
    } catch (e) {
      console.error('복사 실패:', e);
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showAlert('클립보드에 복사되었습니다!');
      } catch (err) {
        showAlert('복사에 실패했습니다.', 'error');
      }
      document.body.removeChild(textarea);
    }
  };

  const handleCapture = async (index) => {
    const textElement = textRefs.current[index];
    if (!textElement) return;

    try {
      const canvas = await html2canvas(textElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `초대장_${index + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showAlert('이미지가 저장되었습니다!');
    } catch (e) {
      console.error('캡처 실패:', e);
      showAlert('이미지 캡처에 실패했습니다.', 'error');
    }
  };

  // 추가: 적용하기 핸들러
  const handleApply = (text) => {
    if (onApply) {
      onApply(text);
    }
  };

  // isGenerating prop이 있으면 그거 쓰고, 없으면 내부 isLoading 사용
  const loading = isGenerating !== undefined ? isGenerating : isLoading;

  return (
    <div className={styles.page}>
      <div className={styles.formArea}>
        <label className={styles.label}>전시회 주제</label>
        <input
          type='text'
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder='예: 시간의 결, 색으로 그리다'
          className={styles.input}
          disabled={loading}
        />

        <label className={styles.label}>요구사항</label>
        <textarea
          value={others}
          onChange={(e) => setOthers(e.target.value)}
          placeholder='예: #감사함, #전시, #초대 등'
          className={styles.textarea}
          disabled={loading}
        />

        <button
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? '생성 중...' : '소개글 생성'}
        </button>
      </div>

      <div className={styles.resultArea}>
        {invitation.length > 0 ? (
          invitation.map((text, i) => (
            <div key={i} className={styles.resultCard}>
              <div className={styles.cardHeader}>
                <h3>초안 {i + 1}</h3>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.copyButton}
                    onClick={() => handleCopy(text)}
                    title='복사하기'
                  >
                    📋 복사
                  </button>
                  <button
                    className={styles.captureButton}
                    onClick={() => handleCapture(i)}
                    title='이미지 저장'
                  >
                    📷 캡처
                  </button>
                  <button
                    className={styles.refineButton}
                    onClick={() => handleRefine(text, i)}
                  >
                    문구 다듬기
                  </button>
                  {/* 추가: 적용하기 버튼 */}
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
              <div
                className={styles.textContent}
                ref={(el) => (textRefs.current[i] = el)}
              >
                <p>{text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.placeholder}>
            생성된 소개글 문구가 여기에 표시됩니다.
          </div>
        )}
      </div>
    </div>
  );
}