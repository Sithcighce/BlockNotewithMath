export declare const mathBlockConfig: {
    type: "math";
    propSchema: {
        latex: {
            default: string;
        };
    };
    content: "none";
};
export declare function createMathBlockSpec(createReactBlockSpec: any, MathBlock: any): any;
export type MathBlockConfig = typeof mathBlockConfig;
