# BlockNote Math Extension Library 开发指南

## 🎯 项目目标

我们要开发一个 **BlockNote 数学公式扩展库**，让任何使用 BlockNote 编辑器的项目都能通过简单的 import 就获得完整的数学公式支持。

### 为什么要做这个库？

1. **市场空白**：目前没有现成的 BlockNote 数学公式扩展
2. **技术基础**：我们已经有了完整的 CustomMathBlock 实现
3. **实际需求**：教育、科研、技术文档等场景有大量需求
4. **简化集成**：让其他开发者无需重复开发数学公式功能

## 📋 当前项目状态分析

### 已完成的核心代码
- ✅ `src/components/CustomMathBlock.tsx` - 完整的数学块组件
- ✅ KaTeX 集成和错误处理
- ✅ 基础的渲染逻辑
- ✅ React 组件化架构

### 存在的问题
- ❌ 未与 BlockNote 编辑器集成（NotesSidebar.tsx 中未注册）
- ❌ 缺少完整的 BlockNote Schema 定义
- ❌ 没有用户友好的插入界面
- ❌ 样式硬编码，不支持主题

## 🏗️ 新库的架构设计

### 包名建议
```
@blocknote-community/math
或者
blocknote-math-extension
```

### 核心文件结构
```
src/
├── blocks/
│   └── math/
│       ├── MathBlock.tsx              # 主数学块组件（基于 CustomMathBlock）
│       ├── MathBlockSpec.ts           # BlockNote 块规范定义
│       └── InlineMath.tsx             # 内联数学公式组件
├── components/
│   ├── MathEditor.tsx                 # 公式编辑器界面
│   ├── MathToolbar.tsx                # 工具栏按钮
│   └── FormulaTemplates.tsx           # 常用公式模板
├── menu-items/
│   ├── MathSlashMenuItem.ts           # Slash 菜单项
│   └── MathToolbarItem.ts             # 工具栏项
├── styles/
│   ├── math-block.css                 # 数学块样式
│   └── themes.css                     # 主题支持
├── utils/
│   ├── katex-renderer.ts              # KaTeX 渲染工具
│   ├── latex-validator.ts             # LaTeX 语法验证
│   └── formula-templates.ts           # 公式模板数据
└── index.ts                           # 主导出文件
```

## 🎨 目标 API 设计

### 最简单使用方式
```tsx
import { mathBlocks, mathMenuItems } from 'blocknote-math-extension';
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';

// 1. 创建包含数学块的 schema
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    ...mathBlocks,  // 一键添加所有数学块
  },
});

// 2. 创建编辑器
const editor = useCreateBlockNote({ schema });

// 3. 添加菜单项（可选）
<BlockNoteView 
  editor={editor}
  slashMenu={{
    getItems: (query) => [
      ...getDefaultSlashMenuItems(editor),
      ...mathMenuItems,  // 一键添加数学相关菜单
    ]
  }}
/>
```

### 高级配置方式
```tsx
import { createMathBlock, createInlineMath } from 'blocknote-math-extension';

const mathBlock = createMathBlock({
  theme: 'light',
  displayMode: true,
  macros: {
    "\\RR": "\\mathbb{R}",
    "\\CC": "\\mathbb{C}",
  },
  errorColor: '#ff0000',
  templates: ['fraction', 'integral', 'matrix'],
});

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlock,
  },
});
```

## 📝 核心功能需求

### ⚠️ 重要更新：最终需求已确定
**详细需求请查看：`FINAL_REQUIREMENTS.md`**

### Phase 1 - 基础块级公式支持
- [x] 基础数学块渲染（基于现有 CustomMathBlock）
- [ ] BlockNote Schema 集成
- [ ] Slash 菜单项支持：`/math`、`/eq`、`/gs`
- [ ] 基础错误处理
- [ ] 简单的编辑界面

### Phase 2 - 行内公式支持
- [ ] 行内数学公式支持 `$$...$$` 语法
- [ ] 实时解析和转换功能
- [ ] 行内公式渲染组件

### Phase 3 - 快捷键和输入框
- [ ] 键盘快捷键 `Ctrl/Cmd + Shift + E`
- [ ] 公式输入对话框
- [ ] 输入框的实时预览

### Phase 4 - 格式化菜单集成
- [ ] 格式化工具栏 `√x` 按钮
- [ ] 选中文本转公式功能
- [ ] 快捷键与格式化菜单协调

### Phase 5 - 高级功能
- [ ] 公式语法高亮
- [ ] 主题支持（light/dark）
- [ ] 公式模板
- [ ] 无障碍支持

## 🔧 技术要求

### 依赖管理
```json
{
  "peerDependencies": {
    "@blocknote/core": "^0.39.0",
    "@blocknote/react": "^0.39.0",
    "@blocknote/mantine": "^0.39.0",
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "dependencies": {
    "katex": "^0.16.22"
  }
}
```

### 兼容性
- BlockNote 0.39+ （当前项目使用的版本）
- React 18+
- 现代浏览器支持

## 📁 从当前项目复制的文件

### 1. 核心组件
**源文件**: `src/components/CustomMathBlock.tsx`
**目标位置**: 新库的 `src/blocks/math/MathBlock.tsx`

**需要的改进**:
```tsx
// 当前的问题和改进方向
export function CustomMathBlock({ block }: CustomMathBlockProps) {
  // ❌ 样式硬编码
  // ✅ 改进：支持主题配置
  
  // ❌ 功能单一
  // ✅ 改进：添加编辑器界面
  
  // ❌ 缺少 BlockNote 集成
  // ✅ 改进：添加完整的 BlockSpec 定义
}
```

### 2. 样式提取
**当前问题**: 样式写在组件内部
**改进方案**: 
```css
/* src/styles/math-block.css */
.blocknote-math-block {
  padding: 8px;
  border: 1px solid var(--bn-colors-border);
  border-radius: 4px;
  margin: 8px 0;
  background-color: var(--bn-colors-background-secondary);
  text-align: center;
}

.blocknote-math-block[data-theme="dark"] {
  border-color: #374151;
  background-color: #1f2937;
}
```

### 3. Schema 定义
**新增文件**: `src/blocks/math/MathBlockSpec.ts`
```typescript
import { createReactBlockSpec } from "@blocknote/react";

export const createMathBlockSpec = (options = {}) => {
  return createReactBlockSpec({
    type: "math",
    propSchema: {
      latex: {
        default: "",
        type: "string",
      },
      displayMode: {
        default: true,
        type: "boolean",
      },
    },
    content: "none",
  }, {
    render: (props) => <MathBlock {...props} options={options} />,
    // ... 其他配置
  });
};
```

## 🎯 开发里程碑

### Week 1: 项目搭建
- [ ] 创建新的 npm 包项目
- [ ] 复制并改进 CustomMathBlock
- [ ] 创建基础的 BlockSpec
- [ ] 设置构建流程

### Week 2: 核心功能
- [ ] 实现完整的 BlockNote 集成
- [ ] 添加 Slash 菜单项
- [ ] 创建基础文档和示例
- [ ] 发布 0.1.0 版本

### Week 3: 增强功能
- [ ] 添加编辑器界面
- [ ] 实现公式模板
- [ ] 主题支持
- [ ] 发布 0.2.0 版本

## 🧪 测试策略

### 单元测试
- KaTeX 渲染功能
- LaTeX 语法验证
- 错误处理机制

### 集成测试
- BlockNote 编辑器集成
- 菜单项功能
- 主题切换

### 端到端测试
- 用户交互流程
- 复制粘贴功能
- 导入导出功能

## 📚 文档要求

### README.md
- 快速开始指南
- API 文档
- 使用示例
- 常见问题

### 高级文档
- 自定义主题指南
- 公式模板开发
- 扩展开发指南

## 🔄 集成回当前项目

库开发完成后，当前项目的集成将变得非常简单：

```tsx
// 替换现在的复杂配置
import { mathBlocks } from 'blocknote-math-extension';

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    ...mathBlocks,
  },
});

// 删除 CustomMathBlock.tsx（被库替代）
// 简化 NotesSidebar.tsx 配置
```

## ⚠️ 关键注意事项

### 1. 版本兼容性
- 必须与 BlockNote 0.39.x 兼容
- 考虑向后兼容性策略

### 2. 性能优化
- KaTeX 按需加载
- 大型公式的渲染优化
- 内存泄漏防护

### 3. 无障碍支持
- 公式的替代文本
- 键盘导航支持
- 屏幕阅读器兼容

### 4. 错误处理
- 优雅的 LaTeX 语法错误处理
- 网络加载失败回退
- 用户友好的错误信息

## 🚀 发布策略

### 0.1.0 - MVP
- 基础数学块功能
- 简单的 Slash 菜单集成

### 0.2.0 - 增强版
- 编辑器界面
- 公式模板

### 0.3.0 - 专业版
- 内联公式
- 高级主题支持

### 1.0.0 - 稳定版
- 完整功能集
- 完善文档
- 生产环境就绪

---

**重要提醒**: 这个库的成败关键在于 API 的简洁性。用户应该能够用最少的代码获得完整的数学公式功能。记住我们的目标：**让数学公式集成变得像安装一个 npm 包一样简单！**