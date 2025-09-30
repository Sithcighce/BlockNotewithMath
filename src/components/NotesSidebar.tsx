"use client";

import { useCreateBlockNote } from "@blocknote/react";
import dynamic from 'next/dynamic';

import "@blocknote/core/style.css";
import "katex/dist/katex.min.css";

// 动态导入 BlockNoteView 避免 SSR 问题
const DynamicBlockNoteView = dynamic(
  () => import("@blocknote/mantine").then((mod) => mod.BlockNoteView),
  { ssr: false }
);

interface NotesSidebarProps {
  initialContent?: any[];
  onChange?: (blocks: any[]) => void;
}

export function NotesSidebar({ initialContent, onChange }: NotesSidebarProps) {
  const editor = useCreateBlockNote({
    initialContent: initialContent || [
      {
        type: "paragraph",
        content: "Welcome to the math-enabled editor! 🧮"
      },
      {
        type: "paragraph", 
        content: "This is a basic BlockNote editor. We'll add math support step by step."
      },
      {
        type: "paragraph",
        content: "For now, this shows that the editor works properly!"
      }
    ]
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>
      <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        <DynamicBlockNoteView
          editor={editor as any}
          theme={"light"}
          onChange={() => {
            if (onChange) {
              onChange(editor.document);
            }
          }}
        />
      </div>
    </div>
  );
}

export default NotesSidebar;