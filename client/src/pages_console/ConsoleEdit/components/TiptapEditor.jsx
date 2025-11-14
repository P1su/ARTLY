import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEffect, useRef } from 'react';

import styles from './TiptapEditor.module.css';
import TiptapMenuBar from './TiptapMenuBar/TiptapMenubar';

export default function TiptapEditor({ content, onChange }) {
  const isInit = useRef(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      if (isInit.current) return;
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (isInit.current) {
      isInit.current = false;
    }

    if (!content || editor.getHTML() === content) return;

    editor.commands.setContent(content, { emitUpdate: false });
  }, [content, editor]);

  return (
    <div className={styles.editorWrapper}>
      <TiptapMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
