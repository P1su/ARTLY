import { useState } from 'react';
import { userInstance } from '../../apis/instance';
import styles from './InvitationGenerator.module.css';
import { useAlert } from '../../store/AlertProvider';

export default function InvitationGenerator() {
  const [theme, setTheme] = useState('');
  const [others, setOthers] = useState('');
  const [invitation, setInvitation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();

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

      // 해당 인덱스의 초대장 문구 업데이트
      setInvitation((prev) =>
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
      if (e.response?.status === 401) {
        showAlert('로그인이 필요합니다. 다시 로그인해주세요.');
      } else if (e.response?.status === 403) {
        showAlert('권한이 없습니다.');
      } else {
        showAlert('초대장 수정에 실패했습니다.', 'error');
      }
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>초대장 문구 생성</h1>

      <div className={styles.formArea}>
        <label className={styles.label}>행사 주제</label>
        <input
          type='text'
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder='예: 시간의 결, 색으로 그리다'
          className={styles.input}
        />

        <label className={styles.label}>요청사항</label>
        <textarea
          value={others}
          onChange={(e) => setOthers(e.target.value)}
          placeholder='예: 장애인의 날 기념, 문구 포함 등'
          className={styles.textarea}
        />
        {/*        <div className={styles.tagContainer}>
          {['#계절감', '#기념', '#감성', '#감사', '#초대', '#특별함'].map(
            (tag) => (
              <button
                key={tag}
                type='button'
                className={styles.tagButton}
                onClick={() =>
                  setOthers((prev) =>
                    prev.includes(tag) ? prev : prev ? `${prev}, ${tag}` : tag,
                  )
                }
              >
                {tag}
              </button>
            ),
          )}
        </div>*/}

        <button
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? '생성 중...' : '초대장 생성'}
        </button>
      </div>

      <div className={styles.resultArea}>
        {invitation.length > 0 ? (
          invitation.map((text, i) => (
            <div key={i} className={styles.resultCard}>
              <div className={styles.cardHeader}>
                <h3>초안 {i + 1}</h3>
                <button
                  className={styles.refineButton}
                  onClick={() => handleRefine(text, i)}
                >
                  수정하기
                </button>
              </div>
              <p>{text}</p>
            </div>
          ))
        ) : (
          <div className={styles.placeholder}>
            생성된 초대장 문구가 여기에 표시됩니다.
          </div>
        )}
      </div>
    </div>
  );
}
