// 核心组件和规范
export { MathBlock } from './blocks/math/MathBlock';
export { createMathBlockSpec, mathBlockConfig } from './blocks/math/MathBlockSpec';
export type { MathBlockProps } from './blocks/math/MathBlock';

// Slash菜单项
export { mathSlashMenuItems, createMathSlashMenuItems } from './menu-items/MathSlashMenuItems';
export type { MathSlashMenuItem } from './menu-items/MathSlashMenuItems';

// 一体化导出：块规范、菜单项、后续可扩展项
import { createReactBlockSpec } from "@blocknote/react";
import { MathBlock } from './blocks/math/MathBlock';
import { mathBlockConfig } from './blocks/math/MathBlockSpec';
import { mathSlashMenuItems } from './menu-items/MathSlashMenuItems';
import * as React from "react";

export const mathBlockSpec = createReactBlockSpec(
  mathBlockConfig,
  {
    render: (props: any) => React.createElement(MathBlock, { block: props.block, editor: props.editor }),
  }
);

export const mathBlocks = {
  math: mathBlockSpec,
};

export const createMathExtension = () => ({
  blockSpecs: mathBlocks,
  slashMenuItems: mathSlashMenuItems,
  // 可扩展：keyboardShortcuts, inlineMathParsers, formattingToolbar 等
});