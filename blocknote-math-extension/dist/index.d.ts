import { DoubleDollarParser } from './parsers/DoubleDollarParser';
export { MathBlock } from './blocks/math/MathBlock';
export { createMathBlockSpec, mathBlockConfig } from './blocks/math/MathBlockSpec';
export { InlineMath } from './blocks/inline-math/InlineMath';
export { mathSlashMenuItems, createMathSlashMenuItems } from './menu-items/MathSlashMenuItems';
export { mathFormattingButton, createMathFormattingButton } from './menu-items/MathFormattingButton';
export { mathKeyboardShortcuts, createMathKeyboardShortcuts } from './shortcuts/MathKeyboardShortcuts';
export { DoubleDollarParser } from './parsers/DoubleDollarParser';
export { MathInputDialog } from './components/MathInputDialog';
export type { MathBlockProps } from './blocks/math/MathBlock';
export type { InlineMathProps } from './blocks/inline-math/InlineMath';
export type { MathSlashMenuItem } from './menu-items/MathSlashMenuItems';
export type { MathFormattingButton } from './menu-items/MathFormattingButton';
export type { MathKeyboardShortcut } from './shortcuts/MathKeyboardShortcuts';
export type { DoubleDollarParserOptions, ParsedMathContent } from './parsers/DoubleDollarParser';
export type { MathInputDialogProps } from './components/MathInputDialog';
export declare const mathBlockConfigs: {
    math: {
        type: "math";
        propSchema: {
            latex: {
                default: string;
                type: "string";
            };
        };
        content: "none";
    };
};
export declare const mathParsers: DoubleDollarParser[];
export declare const MATH_STYLES: {
    mathBlock: string;
    inlineMath: string;
    inputDialog: string;
};
export declare const createMathExtension: (options?: {
    enableSlashCommands?: boolean;
    enableKeyboardShortcuts?: boolean;
    enableFormattingButton?: boolean;
    enableInlineMath?: boolean;
}) => {
    blocks: {
        math: {
            type: "math";
            propSchema: {
                latex: {
                    default: string;
                    type: "string";
                };
            };
            content: "none";
        };
    };
    slashMenuItems: import("./menu-items/MathSlashMenuItems").MathSlashMenuItem[];
    keyboardShortcuts: import("./shortcuts/MathKeyboardShortcuts").MathKeyboardShortcut[];
    formattingButtons: import("./menu-items/MathFormattingButton").MathFormattingButton[];
    parsers: DoubleDollarParser[];
};
