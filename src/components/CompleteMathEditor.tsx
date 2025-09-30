"use client";

import { useCreateBlockNote } from "../hooks/useCreateBlockNote";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { createMathExtension, mathBlockSpec } from "../../blocknote-math-extension/src";
import { MathInputDialog } from "../../blocknote-math-extension/src/components/MathInputDialog";
import { InlineMath } from "../../blocknote-math-extension/src/blocks/inline-math/InlineMath";
import { doubleDollarParser } from "../../blocknote-math-extension/src/parsers/DoubleDollarParser";
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback } from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";
import "../../blocknote-math-extension/src/components/MathInputDialog.css";
import "../../blocknote-math-extension/src/blocks/inline-math/InlineMath.css";

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

interface CompleteMathEditorProps {
  onChange?: (blocks: any[]) => void;
}

export function CompleteMathEditor({ onChange }: CompleteMathEditorProps) {
  const [showSlashHelp, setShowSlashHelp] = useState(false);
  const [showMathDialog, setShowMathDialog] = useState(false);
  const [currentLatex, setCurrentLatex] = useState("");
  const [showInlineDemo, setShowInlineDemo] = useState(false);
  
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "🧮 Complete Math Editor with Inline Support!"
      },
      {
        type: "paragraph", 
        content: "Try typing: The formula $$E = mc^2$$ is Einstein's famous equation."
      },
      {
        type: "paragraph",
        content: "Or: The quadratic formula is $$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$ for solving equations."
      },
      {
        type: "math",
        props: {
          latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"
        }
      },
      {
        type: "paragraph",
        content: "Block formulas work perfectly too! Use all the features below."
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

  // 内联数学解析和渲染
  const processInlineMath = (text: string) => {
    const parts = doubleDollarParser.parseDoubleDollar(text);
    
    return parts.map((part, index) => {
      if (part.type === 'math') {
        return (
          <InlineMath 
            key={index} 
            latex={part.content}
            className="demo-inline-math"
          />
        );
      } else {
        return <span key={index}>{part.content}</span>;
      }
    });
  };

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
    return <div>Loading complete math editor...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      {/* 完整功能工具栏 */}
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
          <span style={{ fontWeight: 'bold', color: '#495057' }}>Block Math:</span>
          
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
            title="Insert E=mc² block"
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
            title="Insert fraction block"
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
            title="Insert sum block"
          >
            /gs
          </button>
        </div>
        
        <div style={{ width: '1px', height: '24px', backgroundColor: '#dee2e6' }}></div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#495057' }}>Templates:</span>
          
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
          
          <button 
            onClick={() => insertMathBlock("\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}")}
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
            [ ] matrix
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
            ⌨️ Dialog
          </button>
          
          <button 
            onClick={() => setShowInlineDemo(!showInlineDemo)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#e83e8c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            {showInlineDemo ? '🙈 Hide' : '💡 Inline'} Demo
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
            {showSlashHelp ? '🙈 Hide' : '📖 Help'}
          </button>
        </div>
      </div>
      
      {/* 内联数学演示 */}
      {showInlineDemo && (
        <div style={{
          padding: '16px',
          backgroundColor: '#fce4ec',
          borderBottom: '2px solid #f8bbd9',
          fontSize: '16px',
          lineHeight: '1.6'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <strong>🎯 Inline Math Demo (simulated):</strong>
          </div>
          <div style={{ marginBottom: '8px' }}>
            The energy-mass equation {processInlineMath("$$E = mc^2$$")} is fundamental in physics.
          </div>
          <div style={{ marginBottom: '8px' }}>
            The quadratic formula {processInlineMath("$$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$")} solves polynomial equations.
          </div>
          <div>
            Integration by parts: {processInlineMath("$$\\int u dv = uv - \\int v du$$")} is a useful technique.
          </div>
          <div style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
            <em>Note: This is a demonstration of how inline math would work. Future versions will support typing $$formula$$ directly in the editor!</em>
          </div>
        </div>
      )}
      
      {/* 帮助信息 */}
      {showSlashHelp && (
        <div style={{
          padding: '16px',
          backgroundColor: '#d1ecf1',
          borderBottom: '1px solid #bee5eb',
          fontSize: '14px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <strong>🎯 Block Math Commands:</strong><br/>
              <div style={{ marginTop: '8px', lineHeight: '1.5' }}>
                • <code>/math</code> → Insert E=mc²<br/>
                • <code>/eq</code> → Insert fraction<br/>
                • <code>/gs</code> → Insert sum<br/>
              </div>
            </div>
            <div>
              <strong>💡 Inline Math (Coming Soon):</strong><br/>
              <div style={{ marginTop: '8px', lineHeight: '1.5' }}>
                • Type <code>$$formula$$</code><br/>
                • Auto-converts to inline math<br/>
                • Real-time preview<br/>
              </div>
            </div>
            <div>
              <strong>⌨️ Keyboard Shortcuts:</strong><br/>
              <div style={{ marginTop: '8px', lineHeight: '1.5' }}>
                • <kbd>Ctrl+Shift+E</kbd> → Math dialog<br/>
                • <kbd>Ctrl+Enter</kbd> → Insert<br/>
                • <kbd>Esc</kbd> → Cancel<br/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主编辑器 */}
      <div style={{ 
        height: `calc(100% - ${70 + (showInlineDemo ? 140 : 0) + (showSlashHelp ? 100 : 0)}px)` 
      }}>
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