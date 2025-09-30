"use client";

import { useCreateBlockNote } from "../hooks/useCreateBlockNote";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { createMathExtension, mathBlockSpec } from "../../blocknote-math-extension/src";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
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

interface WorkingMathEditorProps {
  onChange?: (blocks: any[]) => void;
}

export function WorkingMathEditor({ onChange }: WorkingMathEditorProps) {
  const [editor, setEditor] = useState<any>(null);

  const createEditor = () => {
    const newEditor = useCreateBlockNote({
      schema,
      initialContent: [
        {
          type: "paragraph",
          content: "🧮 Working Math Editor - Real slash commands!"
        },
        {
          type: "paragraph",
          content: "Try typing / to see the slash menu, then type 'math' to find math options."
        },
        {
          type: "math",
          props: {
            latex: "E = mc^2"
          }
        },
        {
          type: "paragraph",
          content: "This editor should support native slash commands integrated into BlockNote."
        }
      ],
      // 尝试不同的 slash 菜单配置方式
      slashMenuItems: [
        {
          name: "Math Block",
          execute: (editor: any) => {
            const currentBlock = editor.getTextCursorPosition().block;
            editor.insertBlocks([{
              type: "math",
              props: { latex: "E = mc^2" }
            }], currentBlock, "after");
          },
          aliases: ["math", "equation", "formula"],
          group: "Math",
          icon: "Math",
          hint: "Insert a math equation block"
        },
        {
          name: "Equation",
          execute: (editor: any) => {
            const currentBlock = editor.getTextCursorPosition().block;
            editor.insertBlocks([{
              type: "math",
              props: { latex: "\\frac{a}{b}" }
            }], currentBlock, "after");
          },
          aliases: ["eq", "fraction"],
          group: "Math",
          icon: "Eq",
          hint: "Insert a fraction equation"
        },
        {
          name: "Formula",
          execute: (editor: any) => {
            const currentBlock = editor.getTextCursorPosition().block;
            editor.insertBlocks([{
              type: "math",
              props: { latex: "\\sum_{i=1}^{n} x_i" }
            }], currentBlock, "after");
          },
          aliases: ["gs", "sum"],
          group: "Math",
          icon: "Sum",
          hint: "Insert a sum formula"
        }
      ]
    });
    
    return newEditor;
  };

  useEffect(() => {
    setEditor(createEditor());
  }, []);

  if (!editor) {
    return <div>Loading working math editor...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      {/* 说明 */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#e3f2fd', 
        borderBottom: '1px solid #2196f3',
        fontSize: '14px'
      }}>
        <strong>📝 How to use native slash commands:</strong><br/>
        1. Type <kbd>/</kbd> to open the slash menu<br/>
        2. Type <kbd>math</kbd>, <kbd>eq</kbd>, or <kbd>gs</kbd> to filter math options<br/>
        3. Press <kbd>Enter</kbd> or click to insert the math block<br/>
        4. Click any math block to edit its LaTeX formula
      </div>

      {/* 主编辑器 */}
      <div style={{ height: 'calc(100% - 80px)' }}>
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