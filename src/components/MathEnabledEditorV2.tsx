"use client";

import { useCreateBlockNote } from "../hooks/useCreateBlockNote";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { getDefaultReactSlashMenuItems } from "@blocknote/react";
import { createMathExtension, mathBlockSpec } from "../../blocknote-math-extension/src";
import dynamic from 'next/dynamic';
import React from 'react';
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

interface MathEnabledEditorV2Props {
  onChange?: (blocks: any[]) => void;
}

export function MathEnabledEditorV2({ onChange }: MathEnabledEditorV2Props) {
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "🧮 Math-Enabled BlockNote Editor V2! Try typing /math, /eq, or /gs"
      },
      {
        type: "paragraph",
        content: "Available commands:"
      },
      {
        type: "paragraph",
        content: "• /math - Insert a math block with E=mc²"
      },
      {
        type: "paragraph",
        content: "• /eq - Insert an equation block with a fraction"
      },
      {
        type: "paragraph",
        content: "• /gs - Insert a formula block with sum notation"
      },
      {
        type: "math",
        props: {
          latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"
        }
      },
      {
        type: "paragraph",
        content: "Click any formula to edit it!"
      },
      {
        type: "math",
        props: {
          latex: "E = mc^2"
        }
      },
      {
        type: "math",
        props: {
          latex: "\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
        }
      }
    ]
  });

  if (!editor) {
    return <div>Loading math-enabled editor...</div>;
  }

  return (
    <div style={{ height: "100%", backgroundColor: "#ffffff" }}>
      <DynamicBlockNoteView
        editor={editor as any}
        theme={"light"}
        slashMenu={{
          triggerCharacter: "/",
          getItems: async (query) => {
            // 获取默认菜单项
            const defaultItems = getDefaultReactSlashMenuItems(editor);
            
            // 创建自定义数学菜单项
            const mathItems = mathExt.slashMenuItems
              .filter((item: any) =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.aliases?.some((alias: string) => 
                  alias.toLowerCase().includes(query.toLowerCase())
                )
              )
              .map((item: any) => ({
                title: item.name,
                onItemClick: () => item.execute(editor),
                aliases: item.aliases,
                group: item.group,
                subtext: item.hint
              }));
            
            return [...defaultItems, ...mathItems];
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