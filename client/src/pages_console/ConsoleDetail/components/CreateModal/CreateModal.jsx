import styles from './CreateModal.module.css';
import { useState } from 'react';
import { FaX } from 'react-icons/fa6';
import InvitationGenerator from '../../../../pages/Category/Exhibition/ExhibitionDetail/components/InvitationGenerator/InvitationGenerator';
import ImageGenerator from '../../../../components/ImageGenerator/ImageGenerator';

export default function CreateModal({ onClose }) {
  const [selectedTab, setSelectedTab] = useState('포스터 생성');
  const tabs = ['포스터 생성', '초대장 생성'];

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaX />
        </button>
        <div className={styles.tabArea}>
          {tabs.map((tab) => (
            <button
              className={`${styles.tabButton} ${selectedTab === tab ? styles.active : ''}`}
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className={styles.generateContainer}>
          {selectedTab === '포스터 생성' ? (
            <ImageGenerator />
          ) : (
            <InvitationGenerator />
          )}
        </div>
      </div>
    </div>
  );
}
