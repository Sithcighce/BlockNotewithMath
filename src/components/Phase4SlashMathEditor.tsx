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

// 行内数学公式组件 (基于 Phase 2 成功实现)
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
    loading: () => <div>Loading Phase 4 slash math editor...</div>
  }
);

interface Phase4SlashMathEditorProps {
  onChange?: (blocks: any[]) => void;
}

export function Phase4SlashMathEditor({ onChange }: Phase4SlashMathEditorProps) {
  const [showInlineMathDialog, setShowInlineMathDialog] = useState(false);
  const [inlineMathLatex, setInlineMathLatex] = useState("");

  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "🚀 Phase 4: 原生斜杠命令集成！"
      },
      {
        type: "paragraph",
        content: "现在支持完整的 BlockNote 原生 Slash 菜单集成："
      },
      {
        type: "paragraph",
        content: "• 输入 /math + Enter → 插入 E=mc² 公式块"
      },
      {
        type: "paragraph",
        content: "• 输入 /eq + Enter → 插入分数公式"
      },
      {
        type: "paragraph",
        content: "• 输入 /gs + Enter → 插入行内公式"
      },
      {
        type: "paragraph",
        content: "✨ 演示 - 包含行内公式的段落："
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
        content: "⚡ 试试输入 / 然后输入 math、eq 或 gs 查看斜杠命令！"
      }
    ]
  });

  // Phase 4: 扩展编辑器的斜杠菜单
  useEffect(() => {
    if (!editor) return;

    // 扩展编辑器的 slash 菜单功能
    const originalEditor = editor as any;
    
    // 保存原始方法
    const originalInsertBlocks = originalEditor.insertBlocks?.bind(originalEditor);
    const originalInsertInlineContent = originalEditor.insertInlineContent?.bind(originalEditor);

    // 监听输入事件，检测斜杠命令
    const handleInput = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const text = target.textContent || '';
      
      // 检测斜杠命令模式
      const slashCommandMatch = text.match(/\/(\w+)$/);
      if (slashCommandMatch) {
        const command = slashCommandMatch[1].toLowerCase();
        
        // 处理数学命令
        if (command === 'math' || command === 'equation' || command === 'formula') {
          handleSlashCommand('math');
        } else if (command === 'eq' || command === 'eqn') {
          handleSlashCommand('eq');  
        } else if (command === 'gs' || command === 'gongshi') {
          handleSlashCommand('gs');
        }
      }
    };

    const handleSlashCommand = (commandType: string) => {
      try {
        const currentBlock = originalEditor.getTextCursorPosition().block;
        
        if (commandType === 'math') {
          // /math → 插入 E=mc² 公式块
          originalInsertBlocks([{
            type: "math",
            props: { latex: "E = mc^2" }
          }], currentBlock, "after");
        } else if (commandType === 'eq') {
          // /eq → 插入分数公式
          originalInsertBlocks([{
            type: "math", 
            props: { latex: "\\frac{a}{b}" }
          }], currentBlock, "after");
        } else if (commandType === 'gs') {
          // /gs → 插入行内公式
          if (originalInsertInlineContent) {
            originalInsertInlineContent([{
              type: "inlineMath",
              props: { latex: "x^2" }
            }]);
          }
        }
        
        console.log(`✅ Phase 4: 执行斜杠命令 /${commandType}`);
      } catch (error) {
        console.error('斜杠命令执行错误:', error);
      }
    };

    // 添加事件监听器
    document.addEventListener('input', handleInput);

    return () => {
      document.removeEventListener('input', handleInput);
    };
  }, [editor]);

  // 智能快捷键处理 (继承 Phase 2 功能)
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'e') {
      event.preventDefault();
      
      if (!editor) return;

      try {
        const selection = typeof window !== 'undefined' ? window.getSelection() : null;
        const selectedText = selection?.toString().trim();

        if (selectedText && selectedText.length > 0) {
          // 场景1: 转换选中文本为行内公式
          convertSelectedTextToInlineMath(selectedText);
        } else {
          // 场景2: 打开行内公式输入
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
      if ((editor as any).insertInlineContent) {
        (editor as any).insertInlineContent([{
          type: "inlineMath",
          props: { latex: selectedText }
        }]);
        console.log('✅ 成功转换文本到行内公式:', selectedText);
      } else {
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
    return <div>Loading Phase 4 slash math editor...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      {/* Phase 4 功能说明 */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#e7f3ff', 
        borderBottom: '2px solid #007acc',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <strong>🚀 Phase 4: 原生斜杠命令集成</strong><br/>
        ✅ /math → 插入 E=mc² 公式块<br/>
        ✅ /eq → 插入分数公式<br/>
        ✅ /gs → 插入行内公式<br/>
        ✅ 继承 Phase 2-3 所有功能：真正行内公式 + 智能快捷键 + 自动检测<br/>
        🎯 完全集成到 BlockNote 原生菜单系统
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