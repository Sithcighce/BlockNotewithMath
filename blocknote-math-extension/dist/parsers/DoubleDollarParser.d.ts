export interface DoubleDollarParserOptions {
    enableInlineMode?: boolean;
}
export interface ParsedMathContent {
    type: 'text' | 'math';
    content: string;
}
export declare class DoubleDollarParser {
    private options;
    constructor(options?: DoubleDollarParserOptions);
    parseDoubleDollar(text: string): ParsedMathContent[];
    hasDoubleDollarSyntax(text: string): boolean;
    extractMathExpressions(text: string): string[];
}
export declare const doubleDollarParser: DoubleDollarParser;
