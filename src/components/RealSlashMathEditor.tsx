"use client";

import { useCreateBlockNote } from "../hooks/useCreateBlockNote";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { createMathExtension, mathBlockSpec } from "../../blocknote-math-extension/src";
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useCallback } from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";

import "@blocknote/core/style.css";

// 一行代码集成所有数学功能
const mathExt = createMathExtension();
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlockSpec(),
  },
});

// Dynamic BlockNoteView import
const DynamicBlockNoteView = dynamic(
  () => import("@blocknote/mantine").then((mod) => mod.BlockNoteView),
  { ssr: false }
);

interface RealSlashMathEditorProps {
  onChange?: (blocks: any[]) => void;
}

export function RealSlashMathEditor({ onChange }: RealSlashMathEditorProps) {
  const [editor, setEditor] = useState<any>(null);

  // 键盘监听器用于 Ctrl+Shift+E
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
      event.preventDefault();
      if (editor) {
        const currentBlock = editor.getTextCursorPosition().block;
        (editor as any).insertBlocks([{
          type: "math",
          props: { latex: "\\text{Enter your LaTeX here}" }
        }], currentBlock, "after");
      }
    }
  }, [editor]);

  useEffect(() => {
    // 添加键盘监听器
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const createEditor = () => {
      try {
        const newEditor = useCreateBlockNote({
          schema,
          initialContent: [
            {
              type: "paragraph",
              content: "🧮 Real Slash Commands Math Editor!"
            },
            {
              type: "paragraph",
              content: "Type / to open slash menu, then:"
            },
            {
              type: "paragraph",
              content: "• Type 'math' + Enter → Insert E=mc²"
            },
            {
              type: "paragraph",
              content: "• Type 'eq' + Enter → Insert fraction"
            },
            {
              type: "paragraph",
              content: "• Type 'gs' + Enter → Insert sum formula"
            },
            {
              type: "paragraph",
              content: "• Press Ctrl+Shift+E → Insert blank math block"
            },
            {
              type: "math",
              props: {
                latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"
              }
            }
          ]
        });

        // 在编辑器实例化后，尝试扩展 slash 菜单
        if (newEditor) {
          // 保存原始的 getSlashMenuItems 方法
          const originalGetSlashMenuItems = (newEditor as any).getSlashMenuItems;
          
          // 扩展 slash 菜单项
          (newEditor as any).getSlashMenuItems = function(query: string) {
            const defaultItems = originalGetSlashMenuItems ? originalGetSlashMenuItems.call(this, query) : [];
            
            const mathItems = [
              {
                title: "Math Block",
                onItemClick: () => {
                  const currentBlock = this.getTextCursorPosition().block;
                  this.insertBlocks([{
                    type: "math",
                    props: { latex: "E = mc^2" }
                  }], currentBlock, "after");
                },
                aliases: ["math", "equation", "formula", "latex"],
                group: "Math",
              },
              {
                title: "Equation",
                onItemClick: () => {
                  const currentBlock = this.getTextCursorPosition().block;
                  this.insertBlocks([{
                    type: "math",
                    props: { latex: "\\frac{a}{b}" }
                  }], currentBlock, "after");
                },
                aliases: ["eq", "fraction", "frac"],
                group: "Math",
              },
              {
                title: "Formula",
                onItemClick: () => {
                  const currentBlock = this.getTextCursorPosition().block;
                  this.insertBlocks([{
                    type: "math",
                    props: { latex: "\\sum_{i=1}^{n} x_i" }
                  }], currentBlock, "after");
                },
                aliases: ["gs", "sum", "formula"],
                group: "Math",
              }
            ];

            // 过滤数学菜单项
            const filteredMathItems = mathItems.filter(item => {
              const searchTerm = query.toLowerCase();
              return (
                item.title.toLowerCase().includes(searchTerm) ||
                item.aliases.some(alias => alias.toLowerCase().includes(searchTerm))
              );
            });

            return [...defaultItems, ...filteredMathItems];
          };
        }

        return newEditor;
      } catch (error) {
        console.error('Error creating editor:', error);
        return null;
      }
    };

    const newEditor = createEditor();
    setEditor(newEditor);
  }, []);

  if (!editor) {
    return <div>Loading real slash commands math editor...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      {/* 功能说明 */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#f0f9ff', 
        borderBottom: '2px solid #3b82f6',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <strong>⌨️ Real Slash Commands:</strong><br/>
            • Type <kbd>/</kbd> to open slash menu<br/>
            • Type <kbd>math</kbd> then press Enter<br/>
            • Type <kbd>eq</kbd> for fraction<br/>
            • Type <kbd>gs</kbd> for sum formula
          </div>
          <div>
            <strong>🎯 Keyboard Shortcuts:</strong><br/>
            • <kbd>Ctrl+Shift+E</kbd> → Insert math block<br/>
            • Click any formula → Edit LaTeX<br/>
            • <kbd>Escape</kbd> → Exit editing mode
          </div>
        </div>
      </div>

      {/* 主编辑器 */}
      <div style={{ height: 'calc(100% - 100px)' }}>
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