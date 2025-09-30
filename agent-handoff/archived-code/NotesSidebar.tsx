"use client";

import { useCreateBlockNote } from "@blocknote/react";
import dynamic from 'next/dynamic';

import "@blocknote/core/style.css";
import "katex/dist/katex.min.css";

// Dynamically import BlockNoteView to ensure it's only rendered on the client
const DynamicBlockNoteView = dynamic(
  () => import("@blocknote/mantine").then((mod) => mod.BlockNoteView),
  { ssr: false }
);

interface NotesSidebarProps {
  initialContent?: any[];
  onChange: (blocks: any[]) => void;
}

export function NotesSidebar({ initialContent, onChange }: NotesSidebarProps) {
  const editor = useCreateBlockNote({
    // 不传递 initialContent，让 BlockNote 使用默认值
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
          onChange={(editor) => {
            onChange(editor.document);
          }}
        />
      </div>
    </div>
  );
}

export default NotesSidebar;