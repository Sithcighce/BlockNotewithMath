import "katex/dist/katex.min.css";
export interface InlineMathProps {
    latex: string;
    className?: string;
}
export declare function InlineMath({ latex, className }: InlineMathProps): import("react/jsx-runtime").JSX.Element;
