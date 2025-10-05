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

// 创建包含数学扩展的 schema
const schema = BlockNoteSchema.create({
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
    loading: () => <div>Loading Fixed Math Editor...</div>
  }
);

interface FixedMathEditorProps {
  onChange?: (blocks: any[]) => void;
  initialContent?: any[];
  placeholder?: string;
}

export function FixedMathEditor({ 
  onChange, 
  initialContent, 
  placeholder = "Try typing /math, /eq, /gs or use Ctrl+Shift+E..." 
}: FixedMathEditorProps) {
  const [showMathDialog, setShowMathDialog] = useState(false);
  const [showInlineMathDialog, setShowInlineMathDialog] = useState(false);
  const [mathLatex, setMathLatex] = useState("");
  const [inlineMathLatex, setInlineMathLatex] = useState("");

  const editor = useCreateBlockNote({
    schema,
    initialContent: initialContent || [
      {
        type: "paragraph",
        content: placeholder
      }
    ]
  });

  // 添加快捷键支持
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+E 快捷键
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        
        // 获取选中的文本
        const selection = window.getSelection();
        const selectedText = selection?.toString() || "";
        
        if (selectedText.trim()) {
          // 有选中文本，直接转换为行内公式
          try {
            if ((editor as any).insertInlineContent) {
              // 删除选中的文本
              document.execCommand('delete');
              
              // 插入行内公式
              (editor as any).insertInlineContent([{
                type: "inlineMath",
                props: { latex: selectedText.trim() }
              }]);
            }
          } catch (error) {
            console.error('Error creating inline math from selection:', error);
          }
        } else {
          // 没有选中文本，弹出输入对话框
          setInlineMathLatex("");
          setShowInlineMathDialog(true);
        }
      }
    };

    // 绑定快捷键事件
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor]);

  // 斜杠命令和自动检测
  useEffect(() => {
    if (!editor) return;

    let processingCommand = false;

    const handleEditorKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey && !processingCommand) {
        setTimeout(() => {
          const activeElement = document.activeElement as HTMLElement;
          if (!activeElement) return;

          const text = activeElement.textContent || '';
          console.log('检查文本:', text);

          // 检查斜杠命令
          const slashMatch = text.match(/\/(\w+)$/);
          if (slashMatch) {
            const command = slashMatch[1].toLowerCase();
            console.log('发现命令:', command);
            
            processingCommand = true;
            
            // 清除斜杠命令文本
            const newText = text.replace(/\/\w+$/, '');
            if (activeElement.textContent !== null) {
              activeElement.textContent = newText;
            }
            
            // 执行命令
            if (command === 'math') {
              setMathLatex("");
              setShowMathDialog(true);
            } else if (command === 'eq' || command === 'gs') {
              setInlineMathLatex("");  
              setShowInlineMathDialog(true);
            }
            
            setTimeout(() => { processingCommand = false; }, 100);
          }
        }, 10);
      }
    };

    const handleInput = (event: Event) => {
      if (processingCommand) return;
      
      const target = event.target as HTMLElement;
      if (!target) return;

      const text = target.textContent || '';
      
      // 检测 $$公式$$ 语法
      const doubleDollarMatch = text.match(/\$\$(.*?)\$\$/);
      if (doubleDollarMatch && doubleDollarMatch[1].trim()) {
        processingCommand = true;
        
        const latex = doubleDollarMatch[1].trim();
        const beforeText = text.substring(0, doubleDollarMatch.index || 0);
        const afterText = text.substring((doubleDollarMatch.index || 0) + doubleDollarMatch[0].length);
        
        // 清除原文本
        target.textContent = beforeText + afterText;
        
        // 插入行内公式
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
        
        setTimeout(() => { processingCommand = false; }, 100);
      }
    };

    // 绑定编辑器事件
    document.addEventListener('keydown', handleEditorKeyDown);
    document.addEventListener('input', handleInput);

    return () => {
      document.removeEventListener('keydown', handleEditorKeyDown);
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
    return <div>Loading Fixed Math Editor...</div>;
  }

  return (
    <div style={{ height: "100%", position: "relative" }}>
      {/* 功能说明 */}
      <div style={{ 
        padding: '12px', 
        backgroundColor: '#e8f4fd', 
        borderBottom: '2px solid #1d4ed8',
        fontSize: '14px',
        lineHeight: '1.4'
      }}>
        <strong>🔧 Fixed Math Editor - 所有功能已修复</strong><br/>
        ✅ Ctrl+Shift+E 快捷键 | ✅ /math /eq /gs 斜杠命令 | ✅ $$公式$$ 自动检测 | ✅ 点击编辑公式
      </div>

      <div style={{ height: "calc(100% - 60px)" }}>
        <DynamicBlockNoteView 
          editor={editor as any} 
          theme={"light"}
          onChange={() => onChange && onChange(editor.document)}
        />
      </div>

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
                Create Math Block
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
                Insert Inline Math
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}