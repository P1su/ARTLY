import styles from './CreateModal.module.css';
import { useState } from 'react';
import { FaX } from 'react-icons/fa6';
import InvitationGenerator from '../../../../pages/Category/Exhibition/ExhibitionDetail/components/InvitationGenerator/InvitationGenerator';
import ImageGenerator from '../../../../components/ImageGenerator/ImageGenerator';

export default function CreateModal({ type, onClose, onApply, isGenerating, onGenerateStart, onGenerateComplete, generatedImage }) {
  const [selectedTab, setSelectedTab] = useState(type === 'poster' ? '포스터 생성' : '이미지 생성');
  const tabs = type === 'poster' 
    ? ['포스터 생성'] 
    : ['이미지 생성', '소개글 생성'];

  const handleDescriptionApply = (text) => {
    if (onApply) {
      onApply(text);
    }
  };

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
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
              {tab === '포스터 생성' && isGenerating.poster && <span className={styles.tabSpinner}></span>}
              {tab === '이미지 생성' && isGenerating.image && <span className={styles.tabSpinner}></span>}
              {tab === '소개글 생성' && isGenerating.description && <span className={styles.tabSpinner}></span>}
            </button>
          ))}
        </div>
        <div className={styles.generateContainer}>
          {selectedTab === '포스터 생성' && (
            <ImageGenerator 
              onApply={onApply} 
              type="poster" 
              isGenerating={isGenerating.poster}
              onGenerateStart={() => onGenerateStart('poster')}
              onGenerateComplete={(url) => onGenerateComplete('poster', url)}
              initialImage={generatedImage}
            />
          )}
          {selectedTab === '이미지 생성' && (
            <ImageGenerator 
              onApply={onApply} 
              type="image" 
              isGenerating={isGenerating.image}
              onGenerateStart={() => onGenerateStart('image')}
              onGenerateComplete={(url) => onGenerateComplete('image', url)}
              initialImage={generatedImage}
            />
          )}
          {selectedTab === '소개글 생성' && (
            <InvitationGenerator 
              onApply={handleDescriptionApply}
              isGenerating={isGenerating.description}
              onGenerateStart={() => onGenerateStart('description')}
              onGenerateComplete={() => onGenerateComplete('description')}
            />
          )}
        </div>
      </div>
    </div>
  );
}