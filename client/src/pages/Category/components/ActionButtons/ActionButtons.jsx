import { FaLocationDot } from 'react-icons/fa6';
import styles from './ActionButtons.module.css';
import {
  FaHeart,
  FaShare,
  FaCalendar,
  FaQrcode,
  FaCheck,
} from 'react-icons/fa';

export default function ActionButtons({ type, data, handlers }) {
  const { handleLike, handleShowMap, handleShare } = handlers;

  const isGallery = type === 'galleries';
  const isExhibition = type === 'exhibitions';

  const buttons = isGallery
    ? [
        {
          label: '관심있어요',
          icon: (
            <FaHeart
              className={`${styles.actionIcon} ${data.is_liked && styles.isClicked}`}
            />
          ),
          action: handleLike,
        },
        {
          label: '위치보기',
          icon: <FaLocationDot className={styles.actionIcon} />,
          action: handleShowMap,
        },
        {
          label: '공유하기',
          icon: <FaShare className={styles.actionIcon} />,
          action: handleShare,
        },
      ]
    : isExhibition
      ? [
          {
            label: '관심있어요',
            icon: (
              <FaHeart
                className={`${styles.actionIcon} ${data.is_liked && styles.isClicked}`}
              />
            ),
            action: handleLike,
          },
          {
            label: '도슨트',
            icon: <FaQrcode className={styles.actionIcon} />,
            action: () => alert('도슨트'),
          },
          {
            label: '관람예약',
            icon: <FaCalendar className={styles.actionIcon} />,
            action: () => alert('관람예약'),
          },
          {
            label: '공유하기',
            icon: <FaShare className={styles.actionIcon} />,
            action: handleShare,
          },
        ]
      : [
          // isArtwork
          {
            label: '좋아요',
            icon: (
              <FaHeart
                className={`${styles.actionIcon} ${data.is_liked && styles.isClicked}`}
              />
            ),
            action: handleLike,
          },
          {
            label: '구매문의',
            icon: <FaCheck className={styles.actionIcon} />,
            action: () => alert('구매문의'),
          },
          {
            label: '공유하기',
            icon: <FaShare className={styles.actionIcon} />,
            action: handleShare,
          },
        ];

  return (
    <div className={styles.actionButtonContainer}>
      {buttons.map(({ label, icon, action }) => (
        <button className={styles.actionButton} key={label} onClick={action}>
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}
