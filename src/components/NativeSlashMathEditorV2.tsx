"use client";

import { useCreateBlockNote } from "../hooks/useCreateBlockNote";
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs } from "@blocknote/core";
import { getDefaultReactSlashMenuItems } from "@blocknote/react";
import dynamic from 'next/dynamic';
import React from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";

// BlockNote inline content spec
import { createReactInlineContentSpec } from "@blocknote/react";

import "@blocknote/core/style.css";

// Math Block Spec (基于 Phase 2 的成功实现)
import { createReactBlockSpec } from "@blocknote/react";

// Inline Math Component (基于 Phase 2 的成功实现)
const InlineMathComponent: React.FC<{ latex: string; onClick: () => void }> = ({ latex, onClick }) => (
  <span 
    onClick={onClick}
    style={{
      backgroundColor: '#f0f0f0',
      padding: '2px 4px',
      borderRadius: '3px',
      cursor: 'pointer',
      display: 'inline-block',
      fontFamily: 'KaTeX_Main',
      border: '1px solid #e0e0e0'
    }}
    dangerouslySetInnerHTML={{
      __html: (() => {
        try {
          return katex.renderToString(latex, { displayMode: false, throwOnError: false });
        } catch (e) {
          return `<span style="color: red;">Error: ${latex}</span>`;
        }
      })()
    }}
  />
);

// Math Block Component (基于现有成功实现)
const MathBlock: React.FC<{ block: any; editor: any }> = ({ block, editor }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [latex, setLatex] = React.useState(block.props.latex || '');
  const [error, setError] = React.useState<string | null>(null);

  const handleSave = () => {
    try {
      katex.renderToString(latex, { displayMode: true, throwOnError: true });
      editor.updateBlock(block, { props: { latex } });
      setError(null);
      setIsEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid LaTeX');
    }
  };

  const handleCancel = () => {
    setLatex(block.props.latex || '');
    setError(null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div style={{ margin: '10px 0', padding: '10px', border: '2px solid #007acc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            placeholder="Enter LaTeX formula (e.g., E = mc^2)"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '3px',
              fontSize: '14px'
            }}
            autoFocus
          />
        </div>
        
        {error && (
          <div style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>
            Error: {error}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleSave}
            style={{
              padding: '6px 12px',
              backgroundColor: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Save (Enter)
          </button>
          <button 
            onClick={handleCancel}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Cancel (Esc)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      style={{
        margin: '10px 0',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div dangerouslySetInnerHTML={{
        __html: (() => {
          try {
            return katex.renderToString(block.props.latex || 'Click to edit', { 
              displayMode: true, 
              throwOnError: false 
            });
          } catch (e) {
            return `<span style="color: red;">Error: ${block.props.latex}</span>`;
          }
        })()
      }} />
    </div>
  );
};

// Block and Inline Content Specs
const mathBlockSpec = createReactBlockSpec(
  {
    type: "math",
    propSchema: {
      latex: { default: "" }
    },
    content: "none"
  },
  {
    render: (props: any) => <MathBlock block={props.block} editor={props.editor} />
  }
);

const inlineMathSpec = createReactInlineContentSpec(
  {
    type: "inlineMath",
    propSchema: {
      latex: { default: "" }
    },
    content: "none"
  },
  {
    render: (props: any) => {
      const openEditor = () => {
        const newLatex = prompt("Edit formula:", props.inline.props.latex);
        if (newLatex !== null) {
          props.editor.updateInlineContent(props.inline, { 
            props: { latex: newLatex } 
          });
        }
      };

      return (
        <InlineMathComponent 
          latex={props.inline.props.latex} 
          onClick={openEditor}
        />
      );
    }
  }
);

// Schema with both math blocks and inline math
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlockSpec,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    inlineMath: inlineMathSpec,
  }
});

// Dynamic BlockNoteView import
const DynamicBlockNoteView = dynamic(
  () => import("@blocknote/mantine").then((mod) => mod.BlockNoteView),
  { ssr: false }
);

interface NativeSlashMathEditorProps {
  onChange?: (blocks: any[]) => void;
}

export function NativeSlashMathEditor({ onChange }: NativeSlashMathEditorProps) {
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: [
          "🚀 Phase 4: 原生斜杠命令集成完成！"
        ]
      },
      {
        type: "paragraph", 
        content: [
          "现在支持完整的 BlockNote 原生 Slash 菜单集成："
        ]
      },
      {
        type: "paragraph",
        content: [
          "• 输入 /math + Enter → 插入 E=mc² 公式块"
        ]
      },
      {
        type: "paragraph",
        content: [
          "• 输入 /eq + Enter → 插入分数公式"
        ]
      },
      {
        type: "paragraph",
        content: [
          "• 输入 /gs + Enter → 插入行内公式"
        ]
      },
      {
        type: "paragraph",
        content: [
          "✨ 演示公式："
        ]
      },
      {
        type: "math",
        props: {
          latex: "E = mc^2"
        }
      },
      {
        type: "paragraph",
        content: [
          "包含行内公式的段落：质能方程 ",
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
      }
    ]
  });

  if (!editor) {
    return <div>Loading native slash math editor...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      <DynamicBlockNoteView
        editor={editor as any}
        theme={"light"}
        slashMenu={{
          triggerCharacter: "/",
          getItems: async (query: string) => {
            // 获取默认菜单项
            const defaultItems = getDefaultReactSlashMenuItems(editor as any);
            
            // Phase 4: 原生斜杠命令 - 完整集成到 BlockNote 菜单系统
            const mathSlashItems = [
              {
                title: "Math Block",
                onItemClick: () => {
                  const currentBlock = editor.getTextCursorPosition().block;
                  editor.insertBlocks([{
                    type: "math",
                    props: { latex: "E = mc^2" }
                  }], currentBlock, "after");
                },
                aliases: ["math", "equation", "formula", "latex"],
                group: "Math",
                icon: "√",
                subtext: "Insert a math equation block"
              },
              {
                title: "Equation",
                onItemClick: () => {
                  const currentBlock = editor.getTextCursorPosition().block;
                  editor.insertBlocks([{
                    type: "math", 
                    props: { latex: "\\frac{a}{b}" }
                  }], currentBlock, "after");
                },
                aliases: ["eq", "eqn", "fraction"],
                group: "Math",
                icon: "=",
                subtext: "Insert an equation with fraction"
              },
              {
                title: "Inline Formula",  
                onItemClick: () => {
                  // gs 命令现在插入行内公式
                  editor.insertInlineContent([{
                    type: "inlineMath",
                    props: { latex: "x^2" }
                  }]);
                },
                aliases: ["gs", "gongshi", "inline", "formula"],
                group: "Math",
                icon: "∫",
                subtext: "Insert an inline math formula"
              }
            ];

            // 过滤数学菜单项
            const filteredMathItems = mathSlashItems.filter(item => {
              const searchTerm = query.toLowerCase();
              return (
                item.title.toLowerCase().includes(searchTerm) ||
                item.aliases.some(alias => alias.toLowerCase().includes(searchTerm)) ||
                item.subtext?.toLowerCase().includes(searchTerm)
              );
            });
            
            return [...defaultItems, ...filteredMathItems];
          }
        }}
        onChange={() => {
          if (onChange) {
            onChange(editor.document);
          }
        }}
      />
    </div>
  );
}