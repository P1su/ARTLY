import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'; // 이미지 확장 기능 import
import styles from './TiptapEditor.module.css';
import { useCallback } from 'react';

// 에디터 상단의 메뉴바
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // 이미지 추가 핸들러
  const addImage = useCallback(() => {
    const url = window.prompt('이미지 URL을 입력하세요');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <div className={styles.menuBar}>
      {/* 기본 스타일 버튼 */}
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

      {/* 헤딩 버튼 */}
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

      {/* 이미지 추가 버튼 */}
      <button type='button' onClick={addImage}>
        이미지
      </button>
    </div>
  );
};

// 메인 에디터 컴포넌트
export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // heading 레벨을 1, 2, 3만 사용하도록 설정
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image, // 이미지 확장 기능 추가
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
  });

  return (
    <div className={styles.editorWrapper}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
