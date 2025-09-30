import "katex/dist/katex.min.css";
export interface MathBlockProps {
    block: {
        props: {
            latex?: string;
        };
    };
    editor?: any;
}
export declare function MathBlock({ block, editor }: MathBlockProps): import("react/jsx-runtime").JSX.Element;
