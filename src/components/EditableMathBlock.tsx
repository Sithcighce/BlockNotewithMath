"use client";

import React, { useState, useRef, useEffect } from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";

interface EditableMathBlockProps {
  initialLatex?: string;
  onLatexChange?: (latex: string) => void;
}

export function EditableMathBlock({ initialLatex = "E = mc^2", onLatexChange }: EditableMathBlockProps) {
  const [latex, setLatex] = useState(initialLatex);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mathRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 渲染数学公式
  useEffect(() => {
    if (mathRef.current && !isEditing) {
      try {
        katex.render(latex, mathRef.current, {
          displayMode: true,
          throwOnError: false,
          errorColor: '#dc3545',
          strict: false,
          trust: false,
        });
        setError(null);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        setError(errorMessage);
        if (mathRef.current) {
          mathRef.current.innerHTML = `<span style="color: #dc3545;">LaTeX Error: ${errorMessage}</span>`;
        }
      }
    }
  }, [latex, isEditing]);

  // 聚焦到输入框
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onLatexChange?.(latex);
  };

  const handleCancel = () => {
    setLatex(initialLatex);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div style={{
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      backgroundColor: isEditing ? '#fff' : '#f8f9fa',
      position: 'relative',
      minHeight: '80px',
      transition: 'all 0.2s ease',
      cursor: isEditing ? 'text' : 'pointer'
    }}>
      {/* 编辑按钮 */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        display: 'flex',
        gap: '8px'
      }}>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleEdit}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: 0.7
            }}
          >
            Edit
          </button>
        )}
      </div>

      {/* 内容区域 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '48px',
        textAlign: 'center'
      }}>
        {isEditing ? (
          <div style={{ width: '100%', paddingRight: '100px' }}>
            <textarea
              ref={inputRef}
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter LaTeX formula..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                resize: 'vertical'
              }}
            />
            <div style={{
              fontSize: '12px',
              color: '#6c757d', 
              marginTop: '4px',
              textAlign: 'left'
            }}>
              Press Ctrl+Enter to save, Esc to cancel
            </div>
          </div>
        ) : (
          <div 
            ref={mathRef}
            onClick={handleEdit}
            style={{
              fontSize: '20px',
              lineHeight: '1.4',
              width: '100%',
              paddingRight: '60px'
            }}
          />
        )}
      </div>

      {/* 错误提示 */}
      {error && !isEditing && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
          fontSize: '14px'
        }}>
          <strong>LaTeX Error:</strong> {error}
        </div>
      )}
    </div>
  );
}