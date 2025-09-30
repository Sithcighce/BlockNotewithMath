"use client";

import { useCreateBlockNote } from "../hooks/useCreateBlockNote";
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from "@blocknote/core";
import { mathBlockSpec } from "../../blocknote-math-extension/src";
import { createReactInlineContentSpec } from "@blocknote/react";
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback } from 'react';
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

// 创建包含行内公式的schema
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
    loading: () => <div>Loading true inline math editor...</div>
  }
);

interface TrueInlineMathV2EditorProps {
  onChange?: (blocks: any[]) => void;
}

export function TrueInlineMathV2Editor({ onChange }: TrueInlineMathV2EditorProps) {
  const [showInlineMathDialog, setShowInlineMathDialog] = useState(false);
  const [inlineMathLatex, setInlineMathLatex] = useState("");

  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "🎉 真正的行内公式编辑器 V2！"
      },
      {
        type: "paragraph",
        content: [
          "测试行内公式：爱因斯坦的著名公式 ",
          {
            type: "inlineMath",
            props: { latex: "E = mc^2" }
          },
          " 描述了质能关系。"
        ]
      },
      {
        type: "paragraph",
        content: [
          "更复杂的例子：二次公式 ",
          {
            type: "inlineMath", 
            props: { latex: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" }
          },
          " 用于求解二次方程。"
        ]
      },
      {
        type: "paragraph",
        content: [
          "数学常数：欧拉数 ",
          {
            type: "inlineMath",
            props: { latex: "e \\approx 2.718" }
          },
          " 和圆周率 ",
          {
            type: "inlineMath",
            props: { latex: "\\pi \\approx 3.14159" }
          },
          " 在数学中很重要。"
        ]
      },
      {
        type: "math",
        props: {
          latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"
        }
      },
      {
        type: "paragraph",
        content: "✅ 使用说明："
      },
      {
        type: "paragraph",
        content: "1. 点击任何行内公式进行编辑"
      },
      {
        type: "paragraph",
        content: "2. 选中文本后按 Ctrl+Shift+E 转换为行内公式"
      },
      {
        type: "paragraph",
        content: "3. 无选中文本时按 Ctrl+Shift+E 打开输入框"
      }
    ]
  });

  // 智能快捷键处理
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'e') {
      event.preventDefault();
      
      if (!editor) return;

      try {
        const selection = typeof window !== 'undefined' ? window.getSelection() : null;
        const selectedText = selection?.toString().trim();

        if (selectedText && selectedText.length > 0) {
          // 场景1: 转换选中文本为行内公式
          console.log('Converting selected text to inline math:', selectedText);
          convertSelectedTextToInlineMath(selectedText);
        } else {
          // 场景2: 打开行内公式输入
          console.log('Opening inline math input dialog');
          setInlineMathLatex("");
          setShowInlineMathDialog(true);
        }
      } catch (error) {
        console.error('Error in Ctrl+Shift+E handler:', error);
      }
    }
  }, [editor]);

  const convertSelectedTextToInlineMath = useCallback((selectedText: string) => {
    if (!editor) return;

    try {
      // 尝试插入行内内容
      if ((editor as any).insertInlineContent) {
        (editor as any).insertInlineContent([{
          type: "inlineMath",
          props: { latex: selectedText }
        }]);
        console.log('✅ 成功转换文本到行内公式:', selectedText);
      } else {
        // 回退方案：打开对话框
        setInlineMathLatex(selectedText);
        setShowInlineMathDialog(true);
      }
    } catch (error) {
      console.error('Error converting text to inline math:', error);
      setInlineMathLatex(selectedText);
      setShowInlineMathDialog(true);
    }
  }, [editor]);

  const handleInlineMathSubmit = () => {
    if (!editor || !inlineMathLatex.trim()) return;

    try {
      // 插入行内公式
      if ((editor as any).insertInlineContent) {
        (editor as any).insertInlineContent([{
          type: "inlineMath",
          props: { latex: inlineMathLatex.trim() }
        }]);
        console.log('✅ 成功插入行内公式:', inlineMathLatex.trim());
      } else {
        // 回退：插入数学块
        const textCursor = editor.getTextCursorPosition();
        const currentBlock = textCursor.block;
        (editor as any).insertBlocks([{
          type: "math",
          props: { latex: inlineMathLatex.trim() }
        }], currentBlock, "after");
      }
      
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
    return <div>Loading true inline math editor v2...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      {/* 功能说明 */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#d4edda', 
        borderBottom: '2px solid #28a745',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <strong>🎉 Phase 2: 真正的行内公式系统</strong><br/>
        ✅ 真正的行内公式渲染和编辑<br/>
        ✅ 智能快捷键：Ctrl+Shift+E (选中文本转换为行内公式 | 打开输入框)<br/>
        ✅ 点击行内公式即可编辑，支持实时预览<br/>
        ✅ 与段落文本无缝混排显示<br/>
        🔄 下一步：$$formula$$自动检测转换
      </div>

      {/* 编辑器 */}
      <div style={{ height: "calc(100% - 120px)", padding: "16px" }}>
        <DynamicBlockNoteView 
          editor={editor as any} 
          theme={"light"}
          onChange={() => onChange && onChange(editor.document)}
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
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>输入行内公式</h3>
            <textarea
              value={inlineMathLatex}
              onChange={(e) => setInlineMathLatex(e.target.value)}
              onKeyDown={handleInlineMathKeyDown}
              placeholder="输入 LaTeX 公式，例如: x^2 + y^2 = z^2"
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
                <strong>预览: </strong>
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
                取消
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
                插入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}