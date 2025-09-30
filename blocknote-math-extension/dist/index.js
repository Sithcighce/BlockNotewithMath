// 导入所有需要的模块  
import { mathBlockConfig } from './blocks/math/MathBlockSpec';
import { mathSlashMenuItems } from './menu-items/MathSlashMenuItems';
import { mathFormattingButton } from './menu-items/MathFormattingButton';
import { mathKeyboardShortcuts } from './shortcuts/MathKeyboardShortcuts';
import { DoubleDollarParser } from './parsers/DoubleDollarParser';
// 导出核心组件
export { MathBlock } from './blocks/math/MathBlock';
export { createMathBlockSpec, mathBlockConfig } from './blocks/math/MathBlockSpec';
export { InlineMath } from './blocks/inline-math/InlineMath';
// 导出菜单项
export { mathSlashMenuItems, createMathSlashMenuItems } from './menu-items/MathSlashMenuItems';
export { mathFormattingButton, createMathFormattingButton } from './menu-items/MathFormattingButton';
// 导出快捷键
export { mathKeyboardShortcuts, createMathKeyboardShortcuts } from './shortcuts/MathKeyboardShortcuts';
// 导出解析器
export { DoubleDollarParser } from './parsers/DoubleDollarParser';
// 导出对话框组件
export { MathInputDialog } from './components/MathInputDialog';
// 主要导出：数学块配置
export const mathBlockConfigs = {
    math: mathBlockConfig,
};
// 导出所有解析器
const doubleDollarParser = new DoubleDollarParser();
export const mathParsers = [
    doubleDollarParser,
];
// 导出样式文件路径（用户需要手动导入）
export const MATH_STYLES = {
    mathBlock: './dist/blocks/math/MathBlock.css',
    inlineMath: './dist/blocks/inline-math/InlineMath.css',
    inputDialog: './dist/components/MathInputDialog.css',
};
// 便捷的一体化配置
export const createMathExtension = (options = {}) => {
    const { enableSlashCommands = true, enableKeyboardShortcuts = true, enableFormattingButton = true, enableInlineMath = true, } = options;
    return {
        blocks: mathBlockConfigs,
        slashMenuItems: enableSlashCommands ? mathSlashMenuItems : [],
        keyboardShortcuts: enableKeyboardShortcuts ? mathKeyboardShortcuts : [],
        formattingButtons: enableFormattingButton ? [mathFormattingButton] : [],
        parsers: enableInlineMath ? mathParsers : [],
    };
};
