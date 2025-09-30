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

// 行内数学公式组件 (继承 Phase 2 成功实现)
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
    loading: () => <div>Loading corrected slash math editor...</div>
  }
);

interface CorrectedSlashMathEditorProps {
  onChange?: (blocks: any[]) => void;
}

export function CorrectedSlashMathEditor({ onChange }: CorrectedSlashMathEditorProps) {
  const [showMathBlockDialog, setShowMathBlockDialog] = useState(false);
  const [showInlineMathDialog, setShowInlineMathDialog] = useState(false);
  const [mathLatex, setMathLatex] = useState("");
  const [inlineMathLatex, setInlineMathLatex] = useState("");

  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "🔄 Phase 4 修正版：正确的斜杠命令实现"
      },
      {
        type: "paragraph",
        content: "现在斜杠命令的正确行为："
      },
      {
        type: "paragraph",
        content: "• 输入 /math + Enter → 启动数学块编辑模式（弹出输入框）"
      },
      {
        type: "paragraph",
        content: "• 输入 /eq + Enter → 启动行内公式编辑模式"
      },
      {
        type: "paragraph",
        content: "• 输入 /gs + Enter → 启动行内公式编辑模式 (公式)"
      },
      {
        type: "paragraph",
        content: "✨ 演示行内公式："
      },
      {
        type: "paragraph",
        content: [
          "爱因斯坦的质能公式 ",
          {
            type: "inlineMath",
            props: { latex: "E = mc^2" }
          },
          " 和二次公式 ",
          {
            type: "inlineMath", 
            props: { latex: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" }
          },
          " 展示了数学的美妙。"
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
        content: "⚡ 试试输入 / 然后输入 math、eq 或 gs 启动编辑模式！"
      }
    ]
  });

  // Phase 4 修正版: 正确的斜杠命令实现
  useEffect(() => {
    if (!editor) return;

    let commandDetected = false;

    const handleInput = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const text = target.textContent || '';
      
      // 检测斜杠命令模式，避免重复触发
      if (!commandDetected) {
        const slashCommandMatch = text.match(/\/(\w+)\s*$/);
        if (slashCommandMatch) {
          const command = slashCommandMatch[1].toLowerCase();
          
          if (command === 'math') {
            commandDetected = true;
            handleSlashCommand('math');
            setTimeout(() => { commandDetected = false; }, 100);
          } else if (command === 'eq') {
            commandDetected = true;
            handleSlashCommand('eq');  
            setTimeout(() => { commandDetected = false; }, 100);
          } else if (command === 'gs') {
            commandDetected = true;
            handleSlashCommand('gs');
            setTimeout(() => { commandDetected = false; }, 100);
          }
        }
      }
    };

    const handleSlashCommand = (commandType: string) => {
      try {
        if (commandType === 'math') {
          // /math → 启动数学块编辑模式
          console.log('✅ 启动数学块编辑模式');
          setMathLatex("");
          setShowMathBlockDialog(true);
        } else if (commandType === 'eq' || commandType === 'gs') {
          // /eq 和 /gs → 启动行内公式编辑模式
          console.log(`✅ 启动行内公式编辑模式 (${commandType})`);
          setInlineMathLatex("");
          setShowInlineMathDialog(true);
        }
      } catch (error) {
        console.error('斜杠命令执行错误:', error);
      }
    };

    // 监听键盘事件，检测回车键确认命令
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        const activeElement = document.activeElement as HTMLElement;
        const text = activeElement?.textContent || '';
        
        const slashCommandMatch = text.match(/\/(\w+)$/);
        if (slashCommandMatch) {
          event.preventDefault();
          const command = slashCommandMatch[1].toLowerCase();
          
          // 清除斜杠命令文本
          if (activeElement) {
            activeElement.textContent = text.replace(/\/\w+$/, '');
          }
          
          // 执行命令
          if (command === 'math') {
            handleSlashCommand('math');
          } else if (command === 'eq') {
            handleSlashCommand('eq');
          } else if (command === 'gs') {
            handleSlashCommand('gs');
          }
        }
      }
    };

    document.addEventListener('input', handleInput);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('input', handleInput);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor]);

  // 数学块提交处理
  const handleMathBlockSubmit = () => {
    if (!editor || !mathLatex.trim()) return;

    try {
      const currentBlock = editor.getTextCursorPosition().block;
      (editor as any).insertBlocks([{
        type: "math",
        props: { latex: mathLatex.trim() }
      }], currentBlock, "after");
      
      setShowMathBlockDialog(false);
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
    return <div>Loading corrected slash math editor...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      {/* 修正说明 */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#fff3cd', 
        borderBottom: '2px solid #ffc107',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <strong>🔄 Phase 4 修正版：正确的斜杠命令</strong><br/>
        ✅ /math → 启动数学块编辑模式 (弹出输入框)<br/>
        ✅ /eq → 启动行内公式编辑模式<br/>
        ✅ /gs → 启动行内公式编辑模式 (公式)<br/>
        ✅ 继承 Phase 1-3 所有功能<br/>
        🎯 重点：启动编辑模式，而不是插入预设内容
      </div>

      {/* 编辑器 */}
      <div style={{ height: "calc(100% - 120px)", padding: "16px" }}>
        <DynamicBlockNoteView 
          editor={editor as any} 
          theme={"light"}
          onChange={() => onChange && onChange(editor.document)}
        />
      </div>

      {/* 数学块输入对话框 */}
      {showMathBlockDialog && (
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
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>创建数学公式块</h3>
            <textarea
              value={mathLatex}
              onChange={(e) => setMathLatex(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleMathBlockSubmit();
                }
              }}
              placeholder="输入 LaTeX 公式，例如: E = mc^2"
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
                <strong>预览: </strong>
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
                onClick={() => setShowMathBlockDialog(false)}
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
                创建公式块
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
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>创建行内公式</h3>
            <textarea
              value={inlineMathLatex}
              onChange={(e) => setInlineMathLatex(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleInlineMathSubmit();
                }
              }}
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
                插入行内公式
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}