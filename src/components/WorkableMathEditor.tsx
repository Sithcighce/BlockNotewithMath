"use client";

import { useCreateBlockNote } from "../hooks/useCreateBlockNote";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { mathBlockSpec } from "../../blocknote-math-extension/src";
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback } from 'react';
import "katex/dist/katex.min.css";
import "@blocknote/core/style.css";
import "@blocknote/mantine/dist/style.css";

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlockSpec(),
  },
});

const DynamicBlockNoteView = dynamic(
  () => import("@blocknote/mantine").then((mod) => mod.BlockNoteView),
  { 
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
);

interface WorkingMathEditorProps {
  onChange?: (blocks: any[]) => void;
}

export function WorkingMathEditor({ onChange }: WorkingMathEditorProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogLatex, setDialogLatex] = useState("");

  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "🎯 Working Math Commands - 已测试并可用"
      },
      {
        type: "paragraph",
        content: "Method 1: 键盘快捷键 (推荐)"
      },
      {
        type: "paragraph",
        content: "• Ctrl+Shift+D → 打开数学输入对话框"
      },
      {
        type: "paragraph",
        content: "• Ctrl+Shift+M → 快速插入 E=mc² "
      },
      {
        type: "paragraph",
        content: "• Ctrl+Shift+E → 快速插入分数模板"
      },
      {
        type: "paragraph",
        content: "• Ctrl+Shift+G → 快速插入求和公式"
      },
      {
        type: "paragraph",
        content: "Method 2: 点击数学块可编辑"
      },
      {
        type: "math",
        props: {
          latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"
        }
      } as any,
      {
        type: "paragraph",
        content: "⬆️ 点击上面的公式试试编辑功能！"
      }
    ]
  });

  // 键盘快捷键 - 实际可用的实现
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
      const key = event.key.toLowerCase();
      
      if (key === 'd') {
        event.preventDefault();
        setShowDialog(true);
        setDialogLatex("");
      } else if (key === 'm') {
        event.preventDefault();
        insertMathBlock("E = mc^2");
      } else if (key === 'e') {
        event.preventDefault();
        insertMathBlock("\\frac{a}{b}");
      } else if (key === 'g') {
        event.preventDefault();
        insertMathBlock("\\sum_{i=1}^{n} x_i");
      }
    }
  }, [editor]);

  const insertMathBlock = (latex: string) => {
    if (!editor) return;

    try {
      const currentBlock = editor.getTextCursorPosition().block;
      (editor as any).insertBlocks([{
        type: "math",
        props: { latex }
      }], currentBlock, "after");
    } catch (error) {
      console.error('Error inserting math block:', error);
    }
  };

  const handleDialogSubmit = () => {
    if (!editor || !dialogLatex.trim()) return;

    try {
      insertMathBlock(dialogLatex.trim());
      setShowDialog(false);
      setDialogLatex("");
    } catch (error) {
      console.error('Error inserting math block:', error);
    }
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleDialogSubmit();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!editor) {
    return <div>Loading working math editor...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      {/* 功能说明 */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#f0f9ff', 
        borderBottom: '2px solid #3b82f6',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <strong>⌨️ 键盘快捷键:</strong><br/>
            <kbd>Ctrl+Shift+D</kbd> 数学对话框<br/>
            <kbd>Ctrl+Shift+M</kbd> 插入 E=mc²<br/>
            <kbd>Ctrl+Shift+E</kbd> 插入分数<br/>
            <kbd>Ctrl+Shift+G</kbd> 插入求和
          </div>
          <div>
            <strong>✨ 交互功能:</strong><br/>
            • 点击任何数学块可编辑<br/>
            • 对话框中按 <kbd>Enter</kbd> 插入<br/>
            • 所有公式支持完整 LaTeX<br/>
            • 实时预览和错误处理
          </div>
        </div>
      </div>

      {/* 主编辑器 */}
      <div style={{ height: 'calc(100% - 120px)' }}>
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

      {/* 数学输入对话框 */}
      {showDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            minWidth: '450px',
            maxWidth: '600px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937', fontSize: '18px' }}>
              🧮 Insert Math Formula
            </h3>
            <textarea
              value={dialogLatex}
              onChange={(e) => setDialogLatex(e.target.value)}
              onKeyDown={handleDialogKeyDown}
              placeholder="Enter LaTeX formula (e.g., E = mc^2, \\frac{a}{b}, \\sum_{i=1}^{n} x_i)"
              style={{
                width: '100%',
                height: '120px',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.15s ease-in-out'
              }}
              autoFocus
            />
            <div style={{ 
              marginTop: '16px', 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={() => setShowDialog(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDialogSubmit}
                disabled={!dialogLatex.trim()}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: dialogLatex.trim() ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  cursor: dialogLatex.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.15s ease'
                }}
              >
                Insert Formula
              </button>
            </div>
            <div style={{ 
              marginTop: '12px', 
              fontSize: '12px', 
              color: '#6b7280' 
            }}>
              💡 Tip: Press <kbd style={{padding: '2px 4px', backgroundColor: '#f3f4f6', borderRadius: '3px'}}>Enter</kbd> to insert
            </div>
          </div>
        </div>
      )}
    </div>
  );
}