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
    loading: () => <div>Loading auto-detect math editor...</div>
  }
);

interface AutoDetectMathEditorProps {
  onChange?: (blocks: any[]) => void;
}

export function AutoDetectMathEditor({ onChange }: AutoDetectMathEditorProps) {
  const [showInlineMathDialog, setShowInlineMathDialog] = useState(false);
  const [inlineMathLatex, setInlineMathLatex] = useState("");

  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "🎉 Phase 3: 自动检测数学公式系统！"
      },
      {
        type: "paragraph",
        content: "✨ 新功能演示："
      },
      {
        type: "paragraph",
        content: "1. 输入 $$E = mc^2$$ 会自动转换为行内公式"
      },
      {
        type: "paragraph",
        content: "2. 输入 $$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$ 试试看"
      },
      {
        type: "paragraph",
        content: "3. 输入 $$\\int_{0}^{\\infty} e^{-x} dx = 1$$ 也会自动转换"
      },
      {
        type: "paragraph",
        content: [
          "已存在的行内公式: ",
          {
            type: "inlineMath",
            props: { latex: "\\pi \\approx 3.14159" }
          },
          " 仍然可以正常编辑。"
        ]
      },
      {
        type: "paragraph",
        content: "现在开始输入包含 $$...$$ 的文本，看看自动检测效果！"
      }
    ]
  });

  // 自动检测 $$formula$$ 的输入处理
  const handleTextInput = useCallback((event: any) => {
    if (!editor) return;

    // 监听输入事件
    const checkForDoubleDollar = () => {
      try {
        const currentBlock = editor.getTextCursorPosition().block;
        const blockContent = currentBlock.content;
        
        // 检测是否为段落块且包含文本
        if (currentBlock.type === 'paragraph' && Array.isArray(blockContent)) {
          let hasTextContent = false;
          let fullText = '';
          
          // 提取所有text内容
          blockContent.forEach((item: any) => {
            if (typeof item === 'string') {
              fullText += item;
              hasTextContent = true;
            } else if (item.type === 'text' || (typeof item === 'object' && item.text)) {
              fullText += item.text || item.content || '';
              hasTextContent = true;
            }
          });
          
          if (hasTextContent && fullText.includes('$$')) {
            // 检测双美元符号模式
            const doubleDollarRegex = /\$\$([^$]+)\$\$/g;
            const matches = Array.from(fullText.matchAll(doubleDollarRegex));
            
            if (matches.length > 0) {
              // 找到了双美元符号，进行转换
              console.log('🎯 检测到双美元符号:', matches);
              
              // 延迟执行转换，避免与正在进行的输入冲突
              setTimeout(() => {
                convertDoubleDollarToInlineMath(currentBlock, fullText, matches);
              }, 100);
            }
          }
        }
      } catch (error) {
        console.error('Error in double dollar detection:', error);
      }
    };

    // 延迟检测，确保输入完成
    setTimeout(checkForDoubleDollar, 50);
  }, [editor]);

  const convertDoubleDollarToInlineMath = useCallback((block: any, fullText: string, matches: RegExpMatchArray[]) => {
    if (!editor) return;

    try {
      console.log('🔄 开始转换双美元符号...');
      
      // 构建新的内容数组
      const newContent = [];
      let lastIndex = 0;
      
      matches.forEach((match) => {
        const startIndex = match.index!;
        const endIndex = startIndex + match[0].length;
        const formula = match[1].trim();
        
        // 添加前面的文本
        if (startIndex > lastIndex) {
          const beforeText = fullText.substring(lastIndex, startIndex);
          if (beforeText) {
            newContent.push(beforeText);
          }
        }
        
        // 添加行内公式
        newContent.push({
          type: "inlineMath",
          props: { latex: formula }
        });
        
        lastIndex = endIndex;
      });
      
      // 添加剩余的文本
      if (lastIndex < fullText.length) {
        const remainingText = fullText.substring(lastIndex);
        if (remainingText) {
          newContent.push(remainingText);
        }
      }
      
      // 更新块内容
      (editor as any).updateBlock(block, {
        type: "paragraph",
        content: newContent
      });
      
      console.log('✅ 双美元符号转换完成!', newContent);
      
    } catch (error) {
      console.error('Error converting double dollar to inline math:', error);
    }
  }, [editor]);

  // 智能快捷键处理 (保持Phase 2的功能)
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
      // 插入行内公式
      if ((editor as any).insertInlineContent) {
        (editor as any).insertInlineContent([{
          type: "inlineMath",
          props: { latex: selectedText }
        }]);
        console.log('✅ 成功转换文本到行内公式:', selectedText);
      } else {
        // 回退方案
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

  // 添加文本输入监听
  useEffect(() => {
    if (!editor) return;

    const handleDocumentInput = (event: Event) => {
      // 监听所有输入事件
      if (event.target && (event.target as HTMLElement).closest('.ProseMirror')) {
        handleTextInput(event);
      }
    };

    // 监听多种输入事件
    document.addEventListener('input', handleDocumentInput);
    document.addEventListener('keyup', handleDocumentInput);
    
    return () => {
      document.removeEventListener('input', handleDocumentInput);
      document.removeEventListener('keyup', handleDocumentInput);
    };
  }, [editor, handleTextInput]);

  if (!editor) {
    return <div>Loading auto-detect math editor...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      {/* 功能说明 */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#e8f5e8', 
        borderBottom: '2px solid #4caf50',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <strong>🎉 Phase 3: $$formula$$ 自动检测系统</strong><br/>
        ✅ 输入 $$LaTeX$$ 自动转换为行内公式<br/>
        ✅ 保持所有 Phase 2 功能 (点击编辑、快捷键等)<br/>
        ✅ 实时检测和智能转换<br/>
        🔄 试试输入: "这是一个公式 $$x^2 + y^2 = z^2$$ 很有用"
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