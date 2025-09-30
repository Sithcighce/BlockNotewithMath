"use client";

import { useCreateBlockNote } from "../hooks/useCreateBlockNote";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { createMathExtension, mathBlockSpec } from "../../blocknote-math-extension/src";
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback } from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";

import "@blocknote/core/style.css";

// 一行代码集成所有数学功能
const mathExt = createMathExtension();
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlockSpec(),
  },
});

// Dynamic BlockNoteView import
const DynamicBlockNoteView = dynamic(
  () => import("@blocknote/mantine").then((mod) => mod.BlockNoteView),
  { ssr: false }
);

interface TrueSlashMathEditorProps {
  onChange?: (blocks: any[]) => void;
}

export function TrueSlashMathEditor({ onChange }: TrueSlashMathEditorProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogLatex, setDialogLatex] = useState("");

  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "🧮 Math Editor with Text-Based Commands"
      },
      {
        type: "paragraph",
        content: "Since native slash commands are complex, try these alternatives:"
      },
      {
        type: "paragraph",
        content: "• Type 'MATH' then press Ctrl+Shift+M to convert to math block"
      },
      {
        type: "paragraph",
        content: "• Type 'EQ' then press Ctrl+Shift+E to convert to equation"
      },
      {
        type: "paragraph",
        content: "• Type 'GS' then press Ctrl+Shift+G to convert to formula"
      },
      {
        type: "paragraph",
        content: "• Press Ctrl+Shift+D to open math dialog"
      },
      {
        type: "math",
        props: {
          latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"
        }
      }
    ]
  });

  // 键盘快捷键处理
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
      const key = event.key.toLowerCase();
      
      if (key === 'd') {
        // Ctrl+Shift+D - 打开数学对话框
        event.preventDefault();
        setShowDialog(true);
        setDialogLatex("");
      } else if (key === 'm' || key === 'e' || key === 'g') {
        // 处理文本转换命令
        event.preventDefault();
        handleTextConversion(key);
      }
    }
  }, [editor]);

  const handleTextConversion = (commandKey: string) => {
    if (!editor) return;

    try {
      const currentBlock = editor.getTextCursorPosition().block;
      const blockContent = currentBlock.content;
      
      let shouldConvert = false;
      let latex = "";
      
      if (commandKey === 'm' && blockContent && blockContent.length > 0) {
        const text = blockContent[0]?.text?.toUpperCase();
        if (text === 'MATH') {
          shouldConvert = true;
          latex = "E = mc^2";
        }
      } else if (commandKey === 'e' && blockContent && blockContent.length > 0) {
        const text = blockContent[0]?.text?.toUpperCase();
        if (text === 'EQ') {
          shouldConvert = true;
          latex = "\\frac{a}{b}";
        }
      } else if (commandKey === 'g' && blockContent && blockContent.length > 0) {
        const text = blockContent[0]?.text?.toUpperCase();
        if (text === 'GS') {
          shouldConvert = true;
          latex = "\\sum_{i=1}^{n} x_i";
        }
      }

      if (shouldConvert) {
        // 替换当前块为数学块
        editor.updateBlock(currentBlock, {
          type: "math",
          props: { latex }
        });
      }
    } catch (error) {
      console.error('Error in text conversion:', error);
    }
  };

  const handleDialogSubmit = () => {
    if (!editor || !dialogLatex.trim()) return;

    try {
      const currentBlock = editor.getTextCursorPosition().block;
      (editor as any).insertBlocks([{
        type: "math",
        props: { latex: dialogLatex.trim() }
      }], currentBlock, "after");
      
      setShowDialog(false);
      setDialogLatex("");
    } catch (error) {
      console.error('Error inserting math block:', error);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!editor) {
    return <div>Loading text-based commands editor...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      {/* 功能说明 */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#f0fdf4', 
        borderBottom: '2px solid #22c55e',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <strong>📝 Text-Based Commands:</strong><br/>
            • Type <kbd>MATH</kbd> then <kbd>Ctrl+Shift+M</kbd><br/>
            • Type <kbd>EQ</kbd> then <kbd>Ctrl+Shift+E</kbd><br/>
            • Type <kbd>GS</kbd> then <kbd>Ctrl+Shift+G</kbd>
          </div>
          <div>
            <strong>⌨️ Quick Shortcuts:</strong><br/>
            • <kbd>Ctrl+Shift+D</kbd> → Math dialog<br/>
            • Click any formula → Edit LaTeX<br/>
            • Dialog: <kbd>Enter</kbd> to insert
          </div>
        </div>
      </div>

      {/* 主编辑器 */}
      <div style={{ height: 'calc(100% - 100px)' }}>
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

      {/* 简单的数学输入对话框 */}
      {showDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            minWidth: '400px',
            maxWidth: '500px'
          }}>
            <h3 style={{ marginTop: 0 }}>Insert Math Formula</h3>
            <textarea
              value={dialogLatex}
              onChange={(e) => setDialogLatex(e.target.value)}
              placeholder="Enter LaTeX formula (e.g., E = mc^2)"
              style={{
                width: '100%',
                height: '100px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}
              autoFocus
            />
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDialog(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDialogSubmit}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}