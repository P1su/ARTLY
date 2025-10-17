import styles from '../TiptapEditor.module.css';
import { useCallback, useRef } from 'react';

export default function TiptapMenuBar({ editor }) {
  const fileInputRef = useRef(null); // 숨겨진 file input을 위한 ref

  if (!editor) {
    return null;
  }

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target.result;
          editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
      }
      // 같은 파일을 다시 선택할 수 있도록 input 값을 초기화
      event.target.value = '';
    },
    [editor],
  );

  return (
    <div className={styles.menuBar}>
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

      <div className={styles.divider}></div>

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive('heading', { level: 1 }) ? styles.isActive : ''
        }
      >
        H1
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive('heading', { level: 2 }) ? styles.isActive : ''
        }
      >
        H2
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive('heading', { level: 3 }) ? styles.isActive : ''
        }
      >
        H3
      </button>

      <div className={styles.divider}></div>

      <button type='button' onClick={() => fileInputRef.current.click()}>
        이미지
      </button>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept='image/*'
      />
    </div>
  );
}
