// 导出核心组件
export { MathBlock } from './blocks/math/MathBlock';
export { createMathBlockSpec, mathBlockConfig } from './blocks/math/MathBlockSpec';

// 导出菜单项
export { mathSlashMenuItems, createMathSlashMenuItems } from './menu-items/MathSlashMenuItems';

// 导出类型
export type { MathBlockProps } from './blocks/math/MathBlock';
export type { MathSlashMenuItem } from './menu-items/MathSlashMenuItems';

// 导入配置
import { mathBlockConfig } from './blocks/math/MathBlockSpec';
import { mathSlashMenuItems } from './menu-items/MathSlashMenuItems';

// 简化的主要导出
export const mathBlocks = {
  math: mathBlockConfig,
};

// 便捷的一体化配置函数
export const createMathExtension = () => {
  return {
    blockConfigs: mathBlocks,
    slashMenuItems: mathSlashMenuItems,
  };
};