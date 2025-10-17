import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import styles from './TiptapEditor.module.css';
import TiptapMenuBar from './TiptapMenuBar/TiptapMenubar';
import { useEffect } from 'react';

export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
  });

  useEffect(() => {
    // editor가 준비되고, 부모로부터 받은 content가 있으며,
    // 현재 에디터의 내용과 다를 경우에만 실행합니다.
    if (editor && content && editor.getHTML() !== content) {
      // editor.commands.setContent()를 사용하여 에디터의 내용을 업데이트합니다.
      // false 옵션은 업데이트 후 커서가 맨 앞으로 이동하는 것을 방지합니다.
      editor.commands.setContent(content, false);
    }
    console.log(content);
  }, [content, editor]); // content나 editor 객체가 변경될 때마다 이 로직을 실행합니다.

  return (
    <div className={styles.editorWrapper}>
      <TiptapMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
