"use client";

import { useCreateBlockNote } from "../hooks/useCreateBlockNote";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { createMathExtension, mathBlockSpec } from "../../blocknote-math-extension/src";
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";

import "@blocknote/core/style.css";

// 一行代码集成所有数学功能
const mathExt = createMathExtension();
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlockSpec(),  // 调用函数获取规范
  },
});

// Dynamic BlockNoteView import
const DynamicBlockNoteView = dynamic(
  () => import("@blocknote/mantine").then((mod) => mod.BlockNoteView),
  { ssr: false }
);

interface MathEnabledEditorV3Props {
  onChange?: (blocks: any[]) => void;
}

export function MathEnabledEditorV3({ onChange }: MathEnabledEditorV3Props) {
  const [showSlashHelp, setShowSlashHelp] = useState(false);
  
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "🧮 Math-Enabled BlockNote Editor! Click the button below to see math slash commands:"
      },
      {
        type: "math",
        props: {
          latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"
        }
      },
      {
        type: "paragraph",
        content: "Click any formula to edit it, or use the math shortcuts below!"
      },
      {
        type: "math",
        props: {
          latex: "E = mc^2"
        }
      }
    ]
  });

  if (!editor) {
    return <div>Loading math-enabled editor...</div>;
  }

  const insertMathBlock = (latex: string) => {
    try {
      const currentBlock = editor.getTextCursorPosition().block;
      (editor as any).insertBlocks([{
        type: "math",
        props: { latex }
      }], currentBlock, "after");
      
      // 尝试聚焦到新插入的块
      setTimeout(() => {
        const blocks = editor.document;
        const newBlockId = blocks[blocks.length - 1]?.id;
        if (newBlockId) {
          (editor as any).setTextCursorPosition(newBlockId, "end");
        }
      }, 100);
    } catch (error) {
      console.error('Error inserting math block:', error);
    }
  };

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      {/* 数学快捷按钮工具栏 */}
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold', color: '#495057' }}>Math Commands:</span>
        
        <button 
          onClick={() => insertMathBlock("E = mc^2")}
          style={{
            padding: '4px 8px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Equivalent to /math command"
        >
          /math (E=mc²)
        </button>
        
        <button 
          onClick={() => insertMathBlock("\\frac{a}{b}")}
          style={{
            padding: '4px 8px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Equivalent to /eq command"
        >
          /eq (fraction)
        </button>
        
        <button 
          onClick={() => insertMathBlock("\\sum_{i=1}^{n} x_i")}
          style={{
            padding: '4px 8px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Equivalent to /gs command"
        >
          /gs (sum)
        </button>
        
        <button 
          onClick={() => insertMathBlock("\\int_{0}^{\\infty} f(x)dx")}
          style={{
            padding: '4px 8px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          integral
        </button>
        
        <button 
          onClick={() => insertMathBlock("\\sqrt{x^2 + y^2}")}
          style={{
            padding: '4px 8px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          √ root
        </button>
        
        <button 
          onClick={() => setShowSlashHelp(!showSlashHelp)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ? Help
        </button>
      </div>
      
      {/* 帮助信息 */}
      {showSlashHelp && (
        <div style={{
          padding: '10px',
          backgroundColor: '#d1ecf1',
          borderBottom: '1px solid #bee5eb',
          fontSize: '14px'
        }}>
          <strong>📝 How to use Math Commands:</strong><br/>
          <div style={{ marginTop: '5px' }}>
            • Click the buttons above to insert math formulas<br/>
            • Click any existing formula to edit its LaTeX code<br/>
            • These buttons simulate /math, /eq, /gs slash commands<br/>
            • Future version will support typing these commands directly!
          </div>
        </div>
      )}

      {/* 主编辑器 */}
      <div style={{ height: 'calc(100% - 60px)' }}>
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
    </div>
  );
}