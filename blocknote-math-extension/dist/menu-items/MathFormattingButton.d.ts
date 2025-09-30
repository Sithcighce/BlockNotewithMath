export interface MathFormattingButton {
    name: string;
    icon: string;
    tooltip: string;
    isActive: (editor: any) => boolean;
    action: (editor: any) => void;
    group?: string;
}
export declare const createMathFormattingButton: () => MathFormattingButton;
export declare const mathFormattingButton: MathFormattingButton;
