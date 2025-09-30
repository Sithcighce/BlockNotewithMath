export declare const mathBlockConfig: {
    type: "math";
    propSchema: {
        latex: {
            default: string;
            type: "string";
        };
    };
    content: "none";
};
export declare function createMathBlockSpec(): {
    type: "math";
    propSchema: {
        latex: {
            default: string;
            type: "string";
        };
    };
    content: "none";
};
export type MathBlockConfig = typeof mathBlockConfig;
