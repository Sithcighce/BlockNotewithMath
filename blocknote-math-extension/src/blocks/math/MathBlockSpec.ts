// 简化的块规范定义，避免导入冲突
export const mathBlockConfig = {
  type: "math" as const,
  propSchema: {
    latex: {
      default: "",
      type: "string" as const,
    },
  },
  content: "none" as const,
};

// 导出一个创建函数，由使用者调用
export function createMathBlockSpec() {
  // 这将在运行时由使用者的 BlockNote 版本来调用
  // 避免在库级别导入 BlockNote 依赖
  return mathBlockConfig;
}

export type MathBlockConfig = typeof mathBlockConfig;