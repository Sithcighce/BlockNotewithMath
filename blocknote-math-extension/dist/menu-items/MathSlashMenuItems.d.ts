export interface MathSlashMenuItem {
    name: string;
    execute: (editor: any) => void;
    aliases: string[];
    group: string;
    icon?: string;
    hint?: string;
}
export declare const createMathSlashMenuItems: () => MathSlashMenuItem[];
export declare const mathSlashMenuItems: MathSlashMenuItem[];
