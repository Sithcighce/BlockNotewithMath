export interface MathInputDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (latex: string) => void;
    initialValue?: string;
}
export declare function MathInputDialog({ isOpen, onClose, onSubmit, initialValue }: MathInputDialogProps): import("react/jsx-runtime").JSX.Element | null;
