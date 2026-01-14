import { useState, useEffect, useRef } from 'react';
import { userInstance } from '../../../../../../apis/instance';
import styles from './InvitationGenerator.module.css';
import html2canvas from 'html2canvas';
import { useAlert } from '../../../../../../store/AlertProvider';

export default function InvitationGenerator({
  initialTheme = '',
  initialOthers = '',
  showTitle = true,
}) {
  const [theme, setTheme] = useState(initialTheme);
  const [others, setOthers] = useState(initialOthers);
  const [invitation, setInvitation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const textRefs = useRef([]);
  const { showAlert } = useAlert();

  // initialTheme이나 initialOthers가 변경되면 state 업데이트
  useEffect(() => {
    if (initialTheme) setTheme(initialTheme);
    if (initialOthers !== undefined) setOthers(initialOthers);
  }, [initialTheme, initialOthers]);

  const date = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSubmit = async () => {
    setInvitation([]);
    setIsLoading(true);

    if (!theme.trim()) {
      setInvitation(['행사 주제를 입력해주세요.']);
      setIsLoading(false);
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

      // API 응답 구조에 따라 수정 필요할 수 있음
      if (data && typeof data === 'string') {
        // 단일 문자열 응답인 경우
        setInvitation([data]);
      } else if (Array.isArray(data)) {
        // 배열 응답인 경우
        setInvitation(data);
      } else if (data.invitations && Array.isArray(data.invitations)) {
        // invitations 속성이 있는 경우
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
    }
  };

  // 초대장 수정 함수 (refine API 사용)
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

      // 🔧 수정: 배열이면 첫 번째 요소, 문자열이면 그대로
      const refinedText = Array.isArray(refinedData)
        ? refinedData[0]
        : refinedData;

      // 해당 인덱스의 초대장 문구 업데이트
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

  // 복사 기능
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showAlert('클립보드에 복사되었습니다!');
    } catch (e) {
      console.error('복사 실패:', e);
      // fallback for older browsers
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

  // 캡처 기능 - 텍스트만 캡처
  const handleCapture = async (index) => {
    const textElement = textRefs.current[index];
    if (!textElement) return;

    try {
      const canvas = await html2canvas(textElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });

      // 다운로드 링크 생성
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
        />

        <label className={styles.label}>요구사항</label>
        <textarea
          value={others}
          onChange={(e) => setOthers(e.target.value)}
          placeholder='예: #감사함, #전시, #초대 등'
          className={styles.textarea}
        />

        <button
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? '생성 중...' : '소개글 생성'}
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
