export interface MathKeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    handler: (editor: any) => boolean;
    description: string;
}
export declare const createMathKeyboardShortcuts: () => MathKeyboardShortcut[];
export declare const mathKeyboardShortcuts: MathKeyboardShortcut[];
