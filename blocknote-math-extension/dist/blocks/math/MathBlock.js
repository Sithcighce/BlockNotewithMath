import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";
export function MathBlock({ block, editor }) {
    const latex = block.props?.latex || "";
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current && latex) {
            try {
                katex.render(latex, containerRef.current, {
                    throwOnError: false,
                    displayMode: true,
                    trust: false,
                    strict: "warn",
                });
            }
            catch (error) {
                console.error("KaTeX rendering error:", error);
                if (containerRef.current) {
                    containerRef.current.innerHTML = `<span style="color: #ef4444; font-family: monospace;">Error: ${latex}</span>`;
                }
            }
        }
        else if (containerRef.current && !latex) {
            containerRef.current.innerHTML = '';
        }
    }, [latex]);
    return (_jsx("div", { style: {
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            margin: '12px 0',
            backgroundColor: '#f9fafb',
            textAlign: 'center',
            position: 'relative',
            transition: 'all 0.2s ease'
        }, children: latex ? (_jsx("div", { ref: containerRef, style: {
                fontSize: '16px',
                lineHeight: '1.5',
                color: '#111827'
            } })) : (_jsxs("p", { style: {
                color: '#6b7280',
                fontStyle: 'italic',
                margin: 0,
                fontSize: '14px'
            }, children: ["Enter LaTeX here (e.g., \\frac", '{1}{2}', ")"] })) }));
}
