import { createReactInlineContentSpec } from "@blocknote/react";
import { InlineMathComponent } from "../components/InlineMathComponent";

// 行内数学公式的 Props 类型
export interface InlineMathProps {
  latex: string;
}

// 创建行内数学公式的 BlockNote 规范
export const inlineMathSpec = createReactInlineContentSpec(
  {
    type: "inlineMath" as const,
    propSchema: {
      latex: {
        default: "",
      },
    } as const,
    content: "none",
  },
  {
    render: ({ inlineContent, editor }) => {
      return (
        <InlineMathComponent
          latex={(inlineContent.props as any).latex}
          editor={editor}
          inlineContent={inlineContent}
        />
      );
    },
  }
);

export default inlineMathSpec;