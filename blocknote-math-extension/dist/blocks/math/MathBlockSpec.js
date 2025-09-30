// 简化的块规范定义，由使用者集成时实现具体的 BlockNote API 调用
export const mathBlockConfig = {
    type: "math",
    propSchema: {
        latex: {
            default: "E = mc^2",
        },
    },
    content: "none",
};
// 导出创建函数，让使用者在其项目中调用
export function createMathBlockSpec(createReactBlockSpec, MathBlock) {
    return createReactBlockSpec(mathBlockConfig, {
        render: (props) => {
            return MathBlock({ block: props.block, editor: props.editor });
        },
    });
}
