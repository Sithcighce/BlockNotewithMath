import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import katex from 'katex';
export function MathInputDialog({ isOpen, onClose, onSubmit, initialValue = "" }) {
    const [latex, setLatex] = useState(initialValue);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const previewRef = useRef(null);
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
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Invalid LaTeX');
                if (previewRef.current) {
                    previewRef.current.innerHTML = `<span class="preview-error">Error: ${latex}</span>`;
                }
            }
        }
        else if (previewRef.current) {
            previewRef.current.innerHTML = '<span class="preview-placeholder">Preview will appear here</span>';
            setError('');
        }
    }, [latex]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (latex.trim()) {
            onSubmit(latex.trim());
            setLatex('');
            onClose();
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
        else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit(e);
        }
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "math-input-overlay", onClick: onClose, children: _jsxs("div", { className: "math-input-dialog", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "math-input-header", children: [_jsx("h3", { children: "Insert Math Formula" }), _jsx("button", { className: "close-button", onClick: onClose, children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "math-input-body", children: [_jsxs("div", { className: "input-section", children: [_jsx("label", { htmlFor: "latex-input", children: "LaTeX Formula:" }), _jsx("textarea", { ref: inputRef, id: "latex-input", value: latex, onChange: (e) => setLatex(e.target.value), onKeyDown: handleKeyDown, placeholder: "Enter LaTeX (e.g., \\frac{1}{2}, x^2, \\sqrt{x})", rows: 3 }), error && _jsx("div", { className: "error-message", children: error })] }), _jsxs("div", { className: "preview-section", children: [_jsx("label", { children: "Preview:" }), _jsx("div", { className: "preview-container", children: _jsx("div", { ref: previewRef, className: "preview-content" }) })] })] }), _jsxs("div", { className: "math-input-footer", children: [_jsx("button", { type: "button", onClick: onClose, className: "cancel-button", children: "Cancel" }), _jsx("button", { type: "submit", className: "submit-button", disabled: !latex.trim(), children: "Insert Formula" })] })] }), _jsxs("div", { className: "math-input-help", children: [_jsx("p", { children: _jsx("strong", { children: "Tips:" }) }), _jsxs("ul", { children: [_jsxs("li", { children: ["Use ", _jsxs("code", { children: ["\\frac", '{a}{b}'] }), " for fractions"] }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "x^2" }), " for superscripts, ", _jsx("code", { children: "x_1" }), " for subscripts"] }), _jsxs("li", { children: ["Use ", _jsxs("code", { children: ["\\sqrt", '{x}'] }), " for square roots"] }), _jsxs("li", { children: ["Press ", _jsx("strong", { children: "Ctrl+Enter" }), " to insert"] })] })] })] }) }));
}
