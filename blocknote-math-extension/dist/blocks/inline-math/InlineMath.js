import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import katex from 'katex';
import "katex/dist/katex.min.css";
export function InlineMath({ latex, className = "" }) {
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current && latex) {
            try {
                katex.render(latex, containerRef.current, {
                    throwOnError: false,
                    displayMode: false, // 行内模式
                    trust: false,
                    strict: "warn",
                });
            }
            catch (error) {
                console.error("KaTeX inline rendering error:", error);
                if (containerRef.current) {
                    containerRef.current.innerHTML = `<span class="inline-math-error">${latex}</span>`;
                }
            }
        }
    }, [latex]);
    return (_jsx("span", { ref: containerRef, className: `blocknote-inline-math ${className}` }));
}
