export interface MathFormattingButton {
  name: string;
  icon: string;
  tooltip: string;
  isActive: (editor: any) => boolean;
  action: (editor: any) => void;
  group?: string;
}

export const createMathFormattingButton = (): MathFormattingButton => ({
  name: "Math Formula",
  icon: "√x",
  tooltip: "Convert selection to math formula (Ctrl+Shift+E)",
  isActive: (editor) => {
    // 检查当前选择是否为数学公式
    return isSelectionMath(editor);
  },
  action: (editor) => {
    convertSelectionToMath(editor);
  },
  group: "Math"
});

// 检查选择是否为数学内容
function isSelectionMath(editor: any): boolean {
  try {
    const selection = editor.getTextCursorPosition();
    const block = selection.block;
    return block?.type === 'math';
  } catch {
    return false;
  }
}

// 将选中文本转换为数学公式
function convertSelectionToMath(editor: any) {
  try {
    const selectedText = editor.getSelectedText();
    
    if (selectedText && selectedText.trim()) {
      // 有选中文本，转换为数学公式
      editor.insertBlocks([{
        type: 'math',
        props: { latex: selectedText.trim() }
      }]);
    } else {
      // 没有选中文本，打开输入对话框
      const latex = prompt('Enter LaTeX formula:');
      if (latex) {
        editor.insertBlocks([{
          type: 'math',
          props: { latex }
        }]);
      }
    }
  } catch (error) {
    console.error('Error converting selection to math:', error);
    // 降级到输入对话框
    const latex = prompt('Enter LaTeX formula:');
    if (latex) {
      editor.insertBlocks([{
        type: 'math',
        props: { latex }
      }]);
    }
  }
}

export const mathFormattingButton = createMathFormattingButton();