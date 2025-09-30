# Agent 接手指南 - BlockNote Math Extension

## 👋 欢迎，新 Agent！

你好！我是之前负责这个项目的 Agent。现在我把这个超酷的项目交给你了。这是一个**非常有价值**的开源项目，请认真对待！

## 🎯 项目概述

**我们要做什么**：创建一个 BlockNote 数学公式扩展库，让任何项目都能一键集成数学公式功能。

**为什么值得做**：
- ✅ 市场上没有现成的解决方案（我们调研过了）
- ✅ BlockNote 是热门的富文本编辑器，但缺少数学支持
- ✅ 教育、科研、技术文档等领域需求巨大
- ✅ 我们已经有了完整的技术基础

## 📁 当前项目状态

### 已经完成的核心代码 ✅
```
src/components/CustomMathBlock.tsx  <- 这是我们的宝贝！
```
这个文件包含：
- ✅ 完整的 KaTeX 集成
- ✅ 错误处理机制  
- ✅ React 组件架构
- ✅ 基础渲染逻辑

### 存在的问题 ❌
- 没有与 BlockNote 编辑器集成（NotesSidebar.tsx 中未注册）
- 缺少完整的 BlockNote Schema 定义
- 样式硬编码，不支持主题
- 没有用户友好的插入界面

## 🎯 你的任务

### Phase 1: 创建独立的 npm 包 
1. **创建新项目**
   ```bash
   mkdir blocknote-math-extension
   cd blocknote-math-extension
   npm init -y
   ```

2. **复制核心文件**
   - 把 `CustomMathBlock.tsx` 复制过去并重命名为 `MathBlock.tsx`
   - 复制相关的依赖配置

3. **创建 BlockNote 集成**
   ```typescript
   // 你需要创建这个文件：src/blocks/MathBlockSpec.ts
   import { createReactBlockSpec } from "@blocknote/react";
   
   export const mathBlockSpec = createReactBlockSpec({
     type: "math",
     propSchema: {
       latex: { default: "", type: "string" }
     },
     content: "none",
   }, {
     render: (props) => <MathBlock {...props} />,
   });
   ```

4. **创建简单的 API**
   ```typescript
   // src/index.ts
   export const mathBlocks = {
     math: mathBlockSpec,
   };
   
   export const mathMenuItems = [
     // Slash 菜单项配置
   ];
   ```

### Phase 2: 让当前项目能用这个库
集成完成后，NotesSidebar.tsx 应该支持：
- `/math`、`/eq`、`/gs` 命令插入公式块
- `$$公式$$` 自动转换为行内公式
- `Ctrl/Cmd + Shift + E` 打开公式编辑器
- 选中文本后点击 `√x` 按钮转为公式

```tsx
import { 
  mathBlocks, 
  mathSlashMenuItems, 
  mathFormattingButtons,
  mathKeyboardShortcuts,
  mathParsers 
} from 'blocknote-math-extension';

const editor = useCreateBlockNote({
  schema: BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      ...mathBlocks,  // 包含块级和行内公式
    },
  }),
  // 其他集成配置...
});
```

## 📋 详细的开发指南

我已经为你准备了超级详细的开发文档：
- `FINAL_REQUIREMENTS.md` - **🎯 最终需求文档（必读）**
- `MATH_LIBRARY_DEVELOPMENT_GUIDE.md` - 完整的开发指南
- `library-files-to-copy.md` - 需要复制的文件清单

**请务必先读完 FINAL_REQUIREMENTS.md 了解最新需求！**

## 🎨 API 设计目标

用户应该这样使用我们的库：
```tsx
// 最简单的使用方式 - 这是我们的目标！
import { mathBlocks } from 'blocknote-math-extension';

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    ...mathBlocks,
  },
});
```

## 🔧 技术栈
- BlockNote 0.39.x
- React 18+
- KaTeX 0.16.x
- TypeScript

## 📁 关键文件位置

### 当前项目中的宝贝文件
```
src/components/CustomMathBlock.tsx  <- 核心组件，必须复制
package.json                        <- 依赖配置参考
src/app/layout.tsx                  <- 样式导入参考
```

### 新库中需要创建的文件
```
src/
├── blocks/
│   └── math/
│       ├── MathBlock.tsx          <- 基于 CustomMathBlock 改进
│       └── MathBlockSpec.ts       <- BlockNote 集成
├── menu-items/
│   └── MathSlashMenuItem.ts       <- Slash 菜单项
├── styles/
│   └── math-block.css             <- 提取样式
└── index.ts                       <- 主导出
```

## ⚠️ 重要提醒

### 必须做的事情 ✅
1. **保持 API 简洁** - 用户用一行代码就能集成
2. **测试集成** - 确保新库能在当前项目中正常工作
3. **文档完整** - README 必须有清晰的使用示例
4. **版本兼容** - 必须与 BlockNote 0.39.x 兼容

### 绝对不能做的事情 ❌
1. 不要改变 CustomMathBlock 的核心渲染逻辑（它已经很完美了）
2. 不要让 API 变得复杂
3. 不要忘记错误处理
4. 不要忽略主题支持

## 🚀 成功标准

当你完成时，应该能够：
1. ✅ 发布到 npm 的独立包
2. ✅ 在当前项目中用一行代码集成
3. ✅ 支持 `/math` Slash 菜单命令
4. ✅ 完整的 TypeScript 类型支持
5. ✅ 清晰的文档和示例

## 💡 额外建议

1. **先做 MVP** - 不要想着一次做完所有功能
2. **早点测试** - 每个功能都要在当前项目中测试
3. **参考官方** - BlockNote 官方文档很详细，多看看
4. **保持沟通** - 遇到问题就问，不要自己猜

## 📞 如果你遇到问题

1. 检查 BlockNote 官方文档：https://www.blocknotejs.org/docs/features/custom-schemas/custom-blocks
2. 参考当前项目的工作代码
3. 查看我准备的详细开发指南

**记住：我们不是在重新发明轮子，而是在打造一个超级好用的轮子！这个项目会帮助成千上万的开发者，所以请认真对待！**

Good luck! 🚀