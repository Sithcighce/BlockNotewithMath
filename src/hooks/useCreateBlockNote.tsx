import { useCreateBlockNote as useOriginalCreateBlockNote } from "@blocknote/react";
import { useEffect } from "react";

export function useCreateBlockNote(options?: any) {
  const editor = useOriginalCreateBlockNote(options);

  useEffect(() => {
    // 修复SSR问题 - 仅在客户端执行
    if (typeof window !== 'undefined' && editor) {
      try {
        (window as any).ProseMirror = (editor as any)._tiptapEditor;
      } catch (error) {
        console.warn('Could not set ProseMirror on window:', error);
      }
    }
  }, [editor]);

  return editor;
}