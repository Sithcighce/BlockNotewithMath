export interface MathKeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: (editor: any) => boolean;
  description: string;
}

export const createMathKeyboardShortcuts = (): MathKeyboardShortcut[] => [
  {
    key: 'e',
    ctrlKey: true,
    shiftKey: true,
    handler: (editor) => {
      // 打开数学公式输入对话框
      openMathInputDialog(editor);
      return true;
    },
    description: 'Open math formula input dialog'
  },
  {
    key: 'e', 
    metaKey: true,
    shiftKey: true,
    handler: (editor) => {
      // 打开数学公式输入对话框 (Mac)
      openMathInputDialog(editor);
      return true;
    },
    description: 'Open math formula input dialog (Mac)'
  }
];

// 打开数学公式输入对话框的函数
function openMathInputDialog(editor: any) {
  // 这里需要实现一个对话框
  // 暂时使用简单的 prompt 作为占位符
  const latex = prompt('Enter LaTeX formula:');
  if (latex) {
    // 插入数学块
    editor.insertBlocks([{
      type: 'math',
      props: { latex }
    }]);
  }
}

export const mathKeyboardShortcuts = createMathKeyboardShortcuts();