"use client";

import { useCreateBlockNote } from "../hooks/useCreateBlockNote";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { createMathExtension, mathBlockSpec } from "../../blocknote-math-extension/src";
import { MathInputDialog } from "../../blocknote-math-extension/src/components/MathInputDialog";
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback } from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";
import "../../blocknote-math-extension/src/components/MathInputDialog.css";

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

interface AdvancedMathEditorProps {
  onChange?: (blocks: any[]) => void;
}

export function AdvancedMathEditor({ onChange }: AdvancedMathEditorProps) {
  const [showSlashHelp, setShowSlashHelp] = useState(false);
  const [showMathDialog, setShowMathDialog] = useState(false);
  const [currentLatex, setCurrentLatex] = useState("");
  
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "🧮 Advanced Math Editor! Press Ctrl+Shift+E to open math dialog, or use the buttons below:"
      },
      {
        type: "math",
        props: {
          latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"
        }
      },
      {
        type: "paragraph",
        content: "Click any formula to edit it, use keyboard shortcuts, or try the buttons!"
      },
      {
        type: "math",
        props: {
          latex: "E = mc^2"
        }
      }
    ]
  });

  // 键盘快捷键处理
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ctrl+Shift+E 或 Cmd+Shift+E
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
      event.preventDefault();
      setShowMathDialog(true);
      setCurrentLatex(""); // 重置为空白
    }
  }, []);

  useEffect(() => {
    // 添加全局键盘监听器
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

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

  const handleMathSubmit = (latex: string) => {
    insertMathBlock(latex);
    setShowMathDialog(false);
    setCurrentLatex("");
  };

  if (!editor) {
    return <div>Loading advanced math editor...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      {/* 高级工具栏 */}
      <div style={{ 
        padding: '12px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '2px solid #dee2e6',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#495057' }}>Math Commands:</span>
          
          <button 
            onClick={() => insertMathBlock("E = mc^2")}
            style={{
              padding: '6px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
            title="Equivalent to /math command"
          >
            /math
          </button>
          
          <button 
            onClick={() => insertMathBlock("\\frac{a}{b}")}
            style={{
              padding: '6px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
            title="Equivalent to /eq command"
          >
            /eq
          </button>
          
          <button 
            onClick={() => insertMathBlock("\\sum_{i=1}^{n} x_i")}
            style={{
              padding: '6px 12px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
            title="Equivalent to /gs command"
          >
            /gs
          </button>
        </div>
        
        <div style={{ width: '1px', height: '24px', backgroundColor: '#dee2e6' }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#495057' }}>Quick Insert:</span>
          
          <button 
            onClick={() => insertMathBlock("\\int_{0}^{\\infty} f(x)dx")}
            style={{
              padding: '6px 12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            ∫ integral
          </button>
          
          <button 
            onClick={() => insertMathBlock("\\sqrt{x^2 + y^2}")}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            √ root
          </button>
          
          <button 
            onClick={() => insertMathBlock("\\lim_{x \\to \\infty} f(x)")}
            style={{
              padding: '6px 12px',
              backgroundColor: '#fd7e14',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            lim
          </button>
        </div>
        
        <div style={{ width: '1px', height: '24px', backgroundColor: '#dee2e6' }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setShowMathDialog(true)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Press Ctrl+Shift+E"
          >
            ⌨️ Dialog (Ctrl+Shift+E)
          </button>
          
          <button 
            onClick={() => setShowSlashHelp(!showSlashHelp)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            {showSlashHelp ? '🙈 Hide Help' : '💡 Show Help'}
          </button>
        </div>
      </div>
      
      {/* 帮助信息 */}
      {showSlashHelp && (
        <div style={{
          padding: '16px',
          backgroundColor: '#d1ecf1',
          borderBottom: '1px solid #bee5eb',
          fontSize: '14px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <strong>🎯 Math Commands:</strong><br/>
              <div style={{ marginTop: '8px', lineHeight: '1.5' }}>
                • <code>/math</code> → Insert E=mc² formula<br/>
                • <code>/eq</code> → Insert fraction a/b<br/>
                • <code>/gs</code> → Insert sum notation<br/>
              </div>
            </div>
            <div>
              <strong>⌨️ Keyboard Shortcuts:</strong><br/>
              <div style={{ marginTop: '8px', lineHeight: '1.5' }}>
                • <kbd>Ctrl+Shift+E</kbd> → Open math dialog<br/>
                • Click any formula → Edit LaTeX code<br/>
                • Use buttons above for quick insertion<br/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主编辑器 */}
      <div style={{ height: showSlashHelp ? 'calc(100% - 140px)' : 'calc(100% - 70px)' }}>
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
      <MathInputDialog
        isOpen={showMathDialog}
        onClose={() => setShowMathDialog(false)}
        onSubmit={handleMathSubmit}
        initialValue={currentLatex}
      />
    </div>
  );
}