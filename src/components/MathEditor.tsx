"use client";

import { useCreateBlockNote } from "../hooks/useCreateBlockNote";
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from "@blocknote/core";
import { mathBlockSpec } from "../../blocknote-math-extension/src";
import { createReactInlineContentSpec } from "@blocknote/react";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

// 行内数学公式组件
const InlineMathComponent = ({ inlineContent, contentRef, updateInlineContent }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLatex, setEditLatex] = useState(inlineContent.props.latex);

  const renderLatex = (latexString: string) => {
    try {
      return katex.renderToString(latexString, {
        displayMode: false,
        throwOnError: false,
        strict: false,
      });
    } catch (error) {
      return `<span style="color: red;">Invalid: ${latexString}</span>`;
    }
  };

  const handleClick = () => {
    setIsEditing(true);
    setEditLatex(inlineContent.props.latex);
  };

  const handleSave = () => {
    updateInlineContent({ props: { latex: editLatex } });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditLatex(inlineContent.props.latex);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <span ref={contentRef} style={{ 
        display: 'inline-block',
        padding: '2px 4px',
        backgroundColor: '#f0f9ff',
        border: '1px solid #3b82f6',
        borderRadius: '3px'
      }}>
        <input
          type="text"
          value={editLatex}
          onChange={(e) => setEditLatex(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontFamily: 'monospace',
            fontSize: '13px',
            minWidth: '100px'
          }}
        />
      </span>
    );
  }

  return (
    <span
      ref={contentRef}
      onClick={handleClick}
      style={{
        display: 'inline-block',
        cursor: 'pointer',
        padding: '1px 3px',
        borderRadius: '3px',
        backgroundColor: '#f8fafc',
        border: '1px solid transparent',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f1f5f9';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#f8fafc';
        e.currentTarget.style.borderColor = 'transparent';
      }}
      dangerouslySetInnerHTML={{ __html: renderLatex(inlineContent.props.latex) }}
      title={`Click to edit: ${inlineContent.props.latex}`}
    />
  );
};

// 创建行内数学公式规范
const inlineMathSpec = createReactInlineContentSpec(
  {
    type: "inlineMath",
    propSchema: {
      latex: { default: "" },
    },
    content: "none",
  },
  {
    render: InlineMathComponent,
  }
);

// 创建完整的数学编辑器 Schema
const mathSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlockSpec(),
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    inlineMath: inlineMathSpec,
  },
});

const DynamicBlockNoteView = dynamic(
  () => import("@blocknote/mantine").then((mod) => mod.BlockNoteView),
  { 
    ssr: false,
    loading: () => <div>Loading Math Editor...</div>
  }
);

interface MathEditorProps {
  onChange?: (blocks: any[]) => void;
  initialContent?: any[];
  placeholder?: string;
}

export function MathEditor({ onChange, initialContent, placeholder = "Start writing with math support..." }: MathEditorProps) {
  const [showMathDialog, setShowMathDialog] = useState(false);
  const [showInlineMathDialog, setShowInlineMathDialog] = useState(false);
  const [mathLatex, setMathLatex] = useState("");
  const [inlineMathLatex, setInlineMathLatex] = useState("");

  const editor = useCreateBlockNote({
    schema: mathSchema,
    initialContent: initialContent || [
      {
        type: "paragraph",
        content: placeholder
      }
    ]
  });

  // 斜杠命令检测和处理
  useEffect(() => {
    if (!editor) return;

    let commandDetected = false;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        const activeElement = document.activeElement as HTMLElement;
        const text = activeElement?.textContent || '';
        
        const slashCommandMatch = text.match(/\/(\w+)$/);
        if (slashCommandMatch) {
          event.preventDefault();
          const command = slashCommandMatch[1].toLowerCase();
          
          // 立即清除斜杠命令文本
          if (activeElement && activeElement.textContent) {
            activeElement.textContent = activeElement.textContent.replace(/\/\w+$/, '');
          }
          
          // 执行命令
          if (command === 'math') {
            setMathLatex("");
            setShowMathDialog(true);
          } else if (command === 'eq' || command === 'gs') {
            setInlineMathLatex("");
            setShowInlineMathDialog(true);
          }
        }
      }
    };

    // 自动检测 $$公式$$ 语法
    const handleInput = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target || commandDetected) return;

      const text = target.textContent || '';
      
      // 检测双美元符号
      const doubleDollarMatch = text.match(/\$\$(.*?)\$\$/);
      if (doubleDollarMatch && doubleDollarMatch[1].trim()) {
        commandDetected = true;
        
        const latex = doubleDollarMatch[1].trim();
        const beforeText = text.substring(0, doubleDollarMatch.index);
        const afterText = text.substring((doubleDollarMatch.index || 0) + doubleDollarMatch[0].length);
        
        // 清除原文本并插入行内公式
        target.textContent = beforeText + afterText;
        
        try {
          if ((editor as any).insertInlineContent) {
            (editor as any).insertInlineContent([{
              type: "inlineMath",
              props: { latex: latex }
            }]);
          }
        } catch (error) {
          console.error('Error inserting inline math:', error);
        }
        
        setTimeout(() => { commandDetected = false; }, 100);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('input', handleInput);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('input', handleInput);
    };
  }, [editor]);

  // 数学块提交处理
  const handleMathBlockSubmit = () => {
    if (!editor || !mathLatex.trim()) return;

    try {
      const currentBlock = editor.getTextCursorPosition().block;
      (editor as any).updateBlock(currentBlock, {
        type: "math",
        props: { latex: mathLatex.trim() }
      } as any);
      
      setShowMathDialog(false);
      setMathLatex("");
    } catch (error) {
      console.error('Error inserting math block:', error);
    }
  };

  // 行内公式提交处理
  const handleInlineMathSubmit = () => {
    if (!editor || !inlineMathLatex.trim()) return;

    try {
      if ((editor as any).insertInlineContent) {
        (editor as any).insertInlineContent([{
          type: "inlineMath",
          props: { latex: inlineMathLatex.trim() }
        }]);
      }
      
      setShowInlineMathDialog(false);
      setInlineMathLatex("");
    } catch (error) {
      console.error('Error inserting inline math:', error);
    }
  };

  if (!editor) {
    return <div>Loading Math Editor...</div>;
  }

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <DynamicBlockNoteView 
        editor={editor as any} 
        theme={"light"}
        onChange={() => onChange && onChange(editor.document)}
      />

      {/* 数学块输入对话框 */}
      {showMathDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            minWidth: '400px',
            maxWidth: '600px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>Create Math Block</h3>
            <textarea
              value={mathLatex}
              onChange={(e) => setMathLatex(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleMathBlockSubmit();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setShowMathDialog(false);
                }
              }}
              placeholder="Enter LaTeX formula, e.g.: E = mc^2"
              style={{
                width: '100%',
                height: '100px',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'monospace',
                resize: 'vertical'
              }}
              autoFocus
            />
            {mathLatex && (
              <div style={{
                marginTop: '12px',
                padding: '8px',
                backgroundColor: '#f9fafb',
                borderRadius: '4px',
                border: '1px solid #e5e7eb'
              }}>
                <strong>Preview: </strong>
                <div dangerouslySetInnerHTML={{
                  __html: katex.renderToString(mathLatex, {
                    displayMode: true,
                    throwOnError: false,
                    strict: false,
                  })
                }} />
              </div>
            )}
            <div style={{ 
              marginTop: '16px', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '8px' 
            }}>
              <button
                onClick={() => setShowMathDialog(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleMathBlockSubmit}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 行内公式输入对话框 */}
      {showInlineMathDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            minWidth: '400px',
            maxWidth: '600px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>Create Inline Formula</h3>
            <textarea
              value={inlineMathLatex}
              onChange={(e) => setInlineMathLatex(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleInlineMathSubmit();
                }
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setShowInlineMathDialog(false);
                }
              }}
              placeholder="Enter LaTeX formula, e.g.: x^2 + y^2 = z^2"
              style={{
                width: '100%',
                height: '80px',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'monospace',
                resize: 'vertical'
              }}
              autoFocus
            />
            {inlineMathLatex && (
              <div style={{
                marginTop: '12px',
                padding: '8px',
                backgroundColor: '#f9fafb',
                borderRadius: '4px',
                border: '1px solid #e5e7eb'
              }}>
                <strong>Preview: </strong>
                <span dangerouslySetInnerHTML={{
                  __html: katex.renderToString(inlineMathLatex, {
                    displayMode: false,
                    throwOnError: false,
                    strict: false,
                  })
                }} />
              </div>
            )}
            <div style={{ 
              marginTop: '16px', 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '8px' 
            }}>
              <button
                onClick={() => setShowInlineMathDialog(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleInlineMathSubmit}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  borderRadius: '4px',
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