import React, { useRef, useEffect } from 'react';
import { Block, useBlockNoteEditor } from "@blocknote/react";
import katex from 'katex';
import "katex/dist/katex.min.css"; // Import KaTeX CSS here for this component

interface CustomMathBlockProps {
  block: Block;
}

export function CustomMathBlock({ block }: CustomMathBlockProps) {
  const editor = useBlockNoteEditor();
  const latex = block.props.latex as string;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && latex) {
      try {
        katex.render(latex, containerRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<span style="color: red;">Error: ${latex}</span>`;
        }
      }
    } else if (containerRef.current && !latex) {
      containerRef.current.innerHTML = '';
    }
  }, [latex]);

  return (
    <div
      style={{
        padding: "8px",
        border: "1px solid #eee",
        borderRadius: "4px",
        margin: "8px 0",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      }}
    >
      {latex ? (
        <div ref={containerRef} />
      ) : (
        <p style={{ color: "#aaa" }}>Enter LaTeX here (e.g., \frac{1}{2})</p>
      )}
    </div>
  );
}