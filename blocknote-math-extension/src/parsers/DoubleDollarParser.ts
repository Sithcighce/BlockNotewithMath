export interface DoubleDollarParserOptions {
  enableInlineMode?: boolean;
}

export interface ParsedMathContent {
  type: 'text' | 'math';
  content: string;
}

export class DoubleDollarParser {
  private options: DoubleDollarParserOptions;

  constructor(options: DoubleDollarParserOptions = {}) {
    this.options = {
      enableInlineMode: true,
      ...options
    };
  }

  // 解析 $$...$$ 语法
  parseDoubleDollar(text: string): ParsedMathContent[] {
    if (!this.options.enableInlineMode) {
      return [{ type: 'text', content: text }];
    }

    const parts: ParsedMathContent[] = [];
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
  hasDoubleDollarSyntax(text: string): boolean {
    return /\$\$.*?\$\$/.test(text);
  }

  // 提取数学表达式
  extractMathExpressions(text: string): string[] {
    const matches = text.match(/\$\$(.*?)\$\$/g);
    if (!matches) return [];
    
    return matches.map(match => {
      const content = match.replace(/^\$\$|\$\$$/g, '');
      return content.trim();
    });
  }
}

export const doubleDollarParser = new DoubleDollarParser();