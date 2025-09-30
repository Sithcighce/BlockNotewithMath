export class DoubleDollarParser {
    constructor(options = {}) {
        this.options = {
            enableInlineMode: true,
            ...options
        };
    }
    // 解析 $$...$$ 语法
    parseDoubleDollar(text) {
        if (!this.options.enableInlineMode) {
            return [{ type: 'text', content: text }];
        }
        const parts = [];
        const regex = /\$\$(.*?)\$\$/g;
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(text)) !== null) {
            // 添加前面的文本
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.slice(lastIndex, match.index)
                });
            }
            // 添加数学内容
            parts.push({
                type: 'math',
                content: match[1].trim()
            });
            lastIndex = regex.lastIndex;
        }
        // 添加剩余的文本
        if (lastIndex < text.length) {
            parts.push({
                type: 'text',
                content: text.slice(lastIndex)
            });
        }
        return parts;
    }
    // 检测文本中是否包含 $$...$$
    hasDoubleDollarSyntax(text) {
        return /\$\$.*?\$\$/.test(text);
    }
    // 提取数学表达式
    extractMathExpressions(text) {
        const matches = text.match(/\$\$(.*?)\$\$/g);
        if (!matches)
            return [];
        return matches.map(match => {
            const content = match.replace(/^\$\$|\$\$$/g, '');
            return content.trim();
        });
    }
}
export const doubleDollarParser = new DoubleDollarParser();
