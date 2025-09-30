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
    loading: () => <div>Loading correct shortcuts editor...</div>
  }
);

interface CorrectShortcutsEditorProps {
  onChange?: (blocks: any[]) => void;
}

export function CorrectShortcutsEditor({ onChange }: CorrectShortcutsEditorProps) {
  const [showInlineMathDialog, setShowInlineMathDialog] = useState(false);
  const [inlineMathLatex, setInlineMathLatex] = useState("");

  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "✅ 正确的快捷键逻辑实现"
      },
      {
        type: "paragraph",
        content: "测试场景 1: 选中文本转换"
      },
      {
        type: "paragraph",
        content: "1. 选中下面的文本: E = mc^2"
      },
      {
        type: "paragraph",
        content: "2. 按 Ctrl+Shift+E"
      },
      {
        type: "paragraph",
        content: "3. 应该转换为行内公式 (待实现)"
      },
      {
        type: "paragraph",
        content: "测试场景 2: 空白处插入"
      },
      {
        type: "paragraph",
        content: "1. 在空白处按 Ctrl+Shift+E"
      },
      {
        type: "paragraph",
        content: "2. 应该打开行内公式输入框"
      },
      {
        type: "paragraph",
        content: "测试场景 3: 自动检测"
      },
      {
        type: "paragraph",
        content: "输入: $$x^2 + y^2 = z^2$$ 应该自动转换 (待实现)"
      },
      {
        type: "math",
        props: {
          latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"
        }
      } as any
    ]
  });

  // 正确的快捷键逻辑
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'e') {
      event.preventDefault();
      
      if (!editor) return;

      try {
        // 获取当前选择
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim();

        if (selectedText && selectedText.length > 0) {
          // 场景 1: 有选中文本 → 转换为行内公式
          console.log('Converting selected text to inline math:', selectedText);
          
          // TODO: 实现文本替换为行内公式
          // 目前先显示对话框作为占位
          setInlineMathLatex(selectedText);
          setShowInlineMathDialog(true);
          
        } else {
          // 场景 2: 无选中文本 → 打开行内公式输入
          console.log('Opening inline math input dialog');
          setInlineMathLatex("");
          setShowInlineMathDialog(true);
        }
      } catch (error) {
        console.error('Error in Ctrl+Shift+E handler:', error);
      }
    }
  }, [editor]);

  const handleInlineMathSubmit = () => {
    if (!editor || !inlineMathLatex.trim()) return;

    try {
      // TODO: 实现真正的行内公式插入
      // 目前创建一个数学块作为演示
      const currentBlock = editor.getTextCursorPosition().block;
      (editor as any).insertBlocks([{
        type: "math",
        props: { latex: inlineMathLatex.trim() }
      }], currentBlock, "after");
      
      setShowInlineMathDialog(false);
      setInlineMathLatex("");
    } catch (error) {
      console.error('Error inserting inline math:', error);
    }
  };

  const handleInlineMathKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleInlineMathSubmit();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!editor) {
    return <div>Loading correct shortcuts editor...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      {/* 状态说明 */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#fef3c7', 
        borderBottom: '2px solid #f59e0b',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <strong>🎯 正确的快捷键逻辑:</strong><br/>
            <kbd>Ctrl+Shift+E</kbd> 智能行为:<br/>
            • 有选中文本 → 转换为公式<br/>
            • 无选中文本 → 打开输入框
          </div>
          <div>
            <strong>📋 测试步骤:</strong><br/>
            1. 选中任意文本按快捷键<br/>
            2. 空白处按快捷键<br/>
            3. 观察不同的行为反应
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

      {/* 行内公式输入对话框 */}
      {showInlineMathDialog && (
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
              ➕ Insert Inline Math Formula
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
              {inlineMathLatex ? '转换选中的文本为行内公式:' : '创建新的行内公式:'}
            </p>
            <textarea
              value={inlineMathLatex}
              onChange={(e) => setInlineMathLatex(e.target.value)}
              onKeyDown={handleInlineMathKeyDown}
              placeholder="Enter LaTeX formula (e.g., E = mc^2, \\frac{a}{b})"
              style={{
                width: '100%',
                height: '100px',
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
                onClick={() => setShowInlineMathDialog(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleInlineMathSubmit}
                disabled={!inlineMathLatex.trim()}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: inlineMathLatex.trim() ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  cursor: inlineMathLatex.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Insert as Inline Math
              </button>
            </div>
            <div style={{ 
              marginTop: '12px', 
              fontSize: '12px', 
              color: '#6b7280' 
            }}>
              💡 按 <kbd style={{padding: '2px 4px', backgroundColor: '#f3f4f6', borderRadius: '3px'}}>Enter</kbd> 快速插入
            </div>
          </div>
        </div>
      )}
    </div>
  );
}