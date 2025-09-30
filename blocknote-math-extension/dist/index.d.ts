export { MathBlock } from './blocks/math/MathBlock';
export { createMathBlockSpec, mathBlockConfig } from './blocks/math/MathBlockSpec';
export { mathSlashMenuItems, createMathSlashMenuItems } from './menu-items/MathSlashMenuItems';
export type { MathBlockProps } from './blocks/math/MathBlock';
export type { MathSlashMenuItem } from './menu-items/MathSlashMenuItems';
export declare const mathBlocks: {
    math: {
        type: "math";
        propSchema: {
            latex: {
                default: string;
            };
        };
        content: "none";
    };
};
export declare const createMathExtension: () => {
    blockConfigs: {
        math: {
            type: "math";
            propSchema: {
                latex: {
                    default: string;
                };
            };
            content: "none";
        };
    };
    slashMenuItems: import("./menu-items/MathSlashMenuItems").MathSlashMenuItem[];
};
