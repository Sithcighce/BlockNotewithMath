// 简化的块规范定义，由使用者集成时实现具体的 BlockNote API 调用
export const mathBlockConfig = {
  type: "math" as const,
  propSchema: {
    latex: {
      default: "E = mc^2",
    },
  },
  content: "none" as const,
};

// 导出创建函数，让使用者在其项目中调用
export function createMathBlockSpec(createReactBlockSpec: any, MathBlock: any) {
  return createReactBlockSpec(
    mathBlockConfig,
    {
      render: (props: any) => {
        return MathBlock({ block: props.block, editor: props.editor });
      },
    }
  );
}

export type MathBlockConfig = typeof mathBlockConfig;