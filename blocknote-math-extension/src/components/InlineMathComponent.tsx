import React, { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface InlineMathComponentProps {
  latex: string;
  editor?: any;
  inlineContent?: any;
}

export function InlineMathComponent({ latex, editor, inlineContent }: InlineMathComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLatex, setEditLatex] = useState(latex);

  // 渲染 LaTeX 为 HTML
  const renderLatex = (latexString: string) => {
    try {
      return katex.renderToString(latexString, {
        displayMode: false, // 行内模式
        throwOnError: false,
        strict: false,
      });
    } catch (error) {
      console.error('KaTeX render error:', error);
      return `<span style="color: red;">Invalid LaTeX: ${latexString}</span>`;
    }
  };

  const handleClick = () => {
    setIsEditing(true);
    setEditLatex(latex);
  };

  const handleSave = () => {
    if (editor && inlineContent) {
      // 更新行内内容的 props
      try {
        editor.updateInlineContent(inlineContent, {
          type: "inlineMath",
          props: { latex: editLatex }
        });
      } catch (error) {
        console.error('Error updating inline math:', error);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditLatex(latex);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <span 
        style={{ 
          display: 'inline-block',
          padding: '2px 4px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #3b82f6',
          borderRadius: '3px',
          fontSize: '14px'
        }}
      >
        <input
          type="text"
          value={editLatex}
          onChange={(e) => setEditLatex(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontFamily: 'monospace',
            fontSize: '13px',
            minWidth: '100px'
          }}
          placeholder="Enter LaTeX..."
        />
      </span>
    );
  }

  return (
    <span
      onClick={handleClick}
      style={{
        display: 'inline-block',
        cursor: 'pointer',
        padding: '1px 3px',
        borderRadius: '3px',
        backgroundColor: '#f8fafc',
        border: '1px solid transparent',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f1f5f9';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#f8fafc';
        e.currentTarget.style.borderColor = 'transparent';
      }}
      dangerouslySetInnerHTML={{ __html: renderLatex(latex) }}
      title={`Click to edit: ${latex}`}
    />
  );
}