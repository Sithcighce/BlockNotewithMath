export interface MathSlashMenuItem {
  name: string;
  execute: (editor: any) => void;
  aliases: string[];
  group: string;
  icon?: string;
  hint?: string;
}

export const createMathSlashMenuItems = (): any[] => [
  {
    name: "Math Block",
    execute: (editor: any) => {
      // 获取当前光标位置并插入数学块
      const currentBlock = editor.getTextCursorPosition().block;
      editor.insertBlocks([{
        type: "math",
        props: { latex: "E = mc^2" }  // 默认示例
      }], currentBlock, "after");
      
      // 聚焦到新插入的块
      editor.setTextCursorPosition(editor.getTextCursorPosition().block, "end");
    },
    aliases: ["math", "equation", "formula", "latex"],
    group: "Math",
    icon: "√",
    hint: "Insert a math equation block"
  },
  {
    name: "Equation",
    execute: (editor: any) => {
      const currentBlock = editor.getTextCursorPosition().block;
      editor.insertBlocks([{
        type: "math", 
        props: { latex: "\\frac{a}{b}" }  // 分数示例
      }], currentBlock, "after");
      editor.setTextCursorPosition(editor.getTextCursorPosition().block, "end");
    },
    aliases: ["eq", "eqn"],
    group: "Math",
    icon: "=",
    hint: "Insert an equation block"
  },
  {
    name: "Formula",
    execute: (editor: any) => {
      const currentBlock = editor.getTextCursorPosition().block;
      editor.insertBlocks([{
        type: "math",
        props: { latex: "\\sum_{i=1}^{n} x_i" }  // 求和示例
      }], currentBlock, "after");
      editor.setTextCursorPosition(editor.getTextCursorPosition().block, "end");
    },
    aliases: ["gs", "gongshi"],
    group: "Math", 
    icon: "∫",
    hint: "Insert a formula block"
  }
];

export const mathSlashMenuItems = createMathSlashMenuItems();