import styles from '../TiptapEditor.module.css';
import { useRef } from 'react';
import { uploadEditorImage } from '../utils/EditorUploader';
import { useAlert } from '../../../../store/AlertProvider';

export default function TiptapMenuBar({ editor }) {
  const fileInputRef = useRef(null);
  const { showAlert } = useAlert();

  if (!editor) return null;

  const handleFilesChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // 파일 input 리셋
    event.target.value = '';

    // 에디터 포커스 유지
    editor.chain().focus();

    for (const file of files) {
      // 🔥 1) 파일 서버 업로드 → URL 받아오기
      const imageUrl = await uploadEditorImage(file, showAlert);

      if (imageUrl) {
        // 🔥 2) 이미지 삽입 (여러 이미지 연속 삽입 가능)
        editor.chain().setImage({ src: imageUrl }).run();
      }
    }
  };

  return (
    <div className={styles.menuBar}>
      {/* Bold / Italic / Strike */}
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? styles.isActive : ''}
      >
        <b>B</b>
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? styles.isActive : ''}
      >
        <i>I</i>
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? styles.isActive : ''}
      >
        <s>S</s>
      </button>

      <div className={styles.divider} />

      {/* Heading */}
      {[1, 2, 3].map((level) => (
        <button
          key={level}
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          className={
            editor.isActive('heading', { level }) ? styles.isActive : ''
          }
        >
          H{level}
        </button>
      ))}

      <div className={styles.divider} />

      {/* Multi-upload */}
      <button type='button' onClick={() => fileInputRef.current.click()}>
        이미지 업로드
      </button>

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFilesChange}
        style={{ display: 'none' }}
        accept='image/*'
        multiple // 🔥 여러 장 업로드
      />
    </div>
  );
}
