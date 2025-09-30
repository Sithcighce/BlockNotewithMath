"use client";

import { useCreateBlockNote, createReactBlockSpec } from "@blocknote/react";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import dynamic from 'next/dynamic';
import React, { useRef, useEffect } from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";

import "@blocknote/core/style.css";

// Math Block Component
function MathBlockComponent({ block, editor }: any) {
  const latex = (block.props?.latex as string) || "E = mc^2";
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(latex, containerRef.current, {
          throwOnError: false,
          displayMode: true,
          trust: false,
          strict: "warn",
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<span style="color: #ef4444;">Error: ${latex}</span>`;
        }
      }
    }
  }, [latex]);

  return (
    <div 
      style={{
        padding: '16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        margin: '12px 0',
        backgroundColor: '#f9fafb',
        textAlign: 'center',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div ref={containerRef} style={{
        fontSize: '18px',
        lineHeight: '1.5',
        color: '#111827',
        width: '100%'
      }} />
    </div>
  );
}

// Create Math Block Spec - using the working factory function approach
const mathBlockSpec = createReactBlockSpec(
  {
    type: "math",
    propSchema: {
      latex: {
        default: "E = mc^2",
      },
    },
    content: "none",
  },
  {
    render: (props) => (
      <MathBlockComponent block={props.block} editor={props.editor} />
    ),
  }
);

// Create Schema with Math Block - calling the spec function to get the actual spec
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlockSpec(),  // Call the function to get the actual spec
  },
});

// Dynamic BlockNoteView import
const DynamicBlockNoteView = dynamic(
  () => import("@blocknote/mantine").then((mod) => mod.BlockNoteView),
  { ssr: false }
);

interface MathEnabledEditorProps {
  onChange?: (blocks: any[]) => void;
}

export function MathEnabledEditor({ onChange }: MathEnabledEditorProps) {
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "🧮 Math-Enabled BlockNote Editor! Try typing /math"
      },
      {
        type: "math",
        props: {
          latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"
        }
      },
      {
        type: "paragraph",
        content: "You can also create math blocks manually:"
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
        onChange={() => {
          if (onChange) {
            onChange(editor.document);
          }
        }}
      />
    </div>
  );
}