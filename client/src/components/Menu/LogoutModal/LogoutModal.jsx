import styles from './LogoutModal.module.css';

export default function LogoutModal({ onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
      >
        <div className={styles.messageBox}>
          {/* 체크 아이콘 SVG (선택사항) */}
          <svg
            width='48'
            height='48'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            style={{ marginBottom: '1rem' }}
          >
            <circle cx='12' cy='12' r='12' fill='#E8F3FF' />
            <path
              d='M7 12L10.5 15.5L17 9'
              stroke='#3665F3'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>

          <h2 className={styles.title}>로그아웃 완료</h2>
          <p className={styles.desc}>성공적으로 로그아웃 되었습니다.</p>
        </div>

        <button className={styles.closeButton} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}
