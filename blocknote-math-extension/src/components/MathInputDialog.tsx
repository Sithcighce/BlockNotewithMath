import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';

export interface MathInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (latex: string) => void;
  initialValue?: string;
}

export function MathInputDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialValue = "" 
}: MathInputDialogProps) {
  const [latex, setLatex] = useState(initialValue);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  useEffect(() => {
    if (latex && previewRef.current) {
      try {
        katex.render(latex, previewRef.current, {
          throwOnError: false,
          displayMode: true,
          trust: false,
          strict: "warn",
        });
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid LaTeX');
        if (previewRef.current) {
          previewRef.current.innerHTML = `<span class="preview-error">Error: ${latex}</span>`;
        }
      }
    } else if (previewRef.current) {
      previewRef.current.innerHTML = '<span class="preview-placeholder">Preview will appear here</span>';
      setError('');
    }
  }, [latex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (latex.trim()) {
      onSubmit(latex.trim());
      setLatex('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="math-input-overlay" onClick={onClose}>
      <div className="math-input-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="math-input-header">
          <h3>Insert Math Formula</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="math-input-body">
            <div className="input-section">
              <label htmlFor="latex-input">LaTeX Formula:</label>
              <textarea
                ref={inputRef}
                id="latex-input"
                value={latex}
                onChange={(e) => setLatex(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter LaTeX (e.g., \frac{1}{2}, x^2, \sqrt{x})"
                rows={3}
              />
              {error && <div className="error-message">{error}</div>}
            </div>
            
            <div className="preview-section">
              <label>Preview:</label>
              <div className="preview-container">
                <div ref={previewRef} className="preview-content" />
              </div>
            </div>
          </div>
          
          <div className="math-input-footer">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={!latex.trim()}>
              Insert Formula
            </button>
          </div>
        </form>
        
        <div className="math-input-help">
          <p><strong>Tips:</strong></p>
          <ul>
            <li>Use <code>\frac{'{a}{b}'}</code> for fractions</li>
            <li>Use <code>x^2</code> for superscripts, <code>x_1</code> for subscripts</li>
            <li>Use <code>\sqrt{'{x}'}</code> for square roots</li>
            <li>Press <strong>Ctrl+Enter</strong> to insert</li>
          </ul>
        </div>
      </div>
    </div>
  );
}