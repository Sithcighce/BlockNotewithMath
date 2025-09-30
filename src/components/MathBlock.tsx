"use client";

import React, { useRef, useEffect } from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";

export interface MathBlockProps {
  block: {
    props: {
      latex?: string;
    };
  };
  editor?: any;
}

export function MathBlock({ block, editor }: MathBlockProps) {
  const latex = (block.props?.latex as string) || "";
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && latex) {
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
          containerRef.current.innerHTML = `<span style="color: #ef4444; font-family: monospace;">Error: ${latex}</span>`;
        }
      }
    } else if (containerRef.current && !latex) {
      containerRef.current.innerHTML = '<span style="color: #9ca3af; font-style: italic;">Click to enter LaTeX formula...</span>';
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
        position: 'relative',
        transition: 'all 0.2s ease',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      className="math-block-container"
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