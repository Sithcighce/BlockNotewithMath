# BlockNote Math Extension - 文件清单

## 🎯 建议的新库结构
```
@your-name/blocknote-math/
├── src/
│   ├── blocks/
│   │   └── math/
│   │       ├── mathBlock.tsx          # 主要的数学块组件
│   │       ├── mathBlockSpec.ts       # BlockNote 块规范
│   │       └── mathRenderer.tsx       # KaTeX 渲染器
│   ├── components/
│   │   ├── MathEditor.tsx             # 数学公式编辑器
│   │   └── MathToolbar.tsx            # 工具栏组件
│   ├── styles/
│   │   └── math.css                   # 数学块样式
│   ├── utils/
│   │   └── katex-utils.ts             # KaTeX 工具函数
│   └── index.ts                       # 导出入口
├── package.json
├── README.md
└── examples/
    └── basic-usage.tsx
```

## 📋 需要从当前项目复制的文件

### 1. 核心组件文件
- **src/components/CustomMathBlock.tsx** → **src/blocks/math/mathBlock.tsx**
  - 重命名为更通用的名称
  - 添加更多配置选项
  - 改进编辑体验

### 2. 样式文件（需要创建）
- 提取 CustomMathBlock 中的内联样式到独立的 CSS 文件
- 添加主题支持（light/dark）

### 3. 依赖包配置
从 package.json 复制相关依赖：
```json
{
  "dependencies": {
    "@blocknote/core": "^0.39.1",
    "@blocknote/react": "^0.39.1", 
    "katex": "^0.16.22"
  },
  "peerDependencies": {
    "@blocknote/mantine": "^0.39.1",
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

## 🚀 建议的库功能特性

### 基础功能
- [x] KaTeX 渲染
- [x] 错误处理
- [ ] 内联数学公式支持
- [ ] 公式编辑器界面
- [ ] 常用公式模板

### 高级功能
- [ ] 公式语法高亮
- [ ] 实时预览
- [ ] 公式历史记录
- [ ] 导入/导出支持
- [ ] 主题适配

### 集成功能
- [ ] Slash 菜单项
- [ ] 工具栏按钮
- [ ] 键盘快捷键
- [ ] 拖拽支持

## 📖 API 设计建议

```tsx
// 简单使用
import { mathBlock } from '@your-name/blocknote-math';

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    math: mathBlock(),
  },
});

// 高级配置
const mathBlockWithOptions = mathBlock({
  theme: 'light',
  displayMode: true,
  macros: {
    "\\RR": "\\mathbb{R}"
  },
  shortcuts: true
});
```

## 🎨 包命名建议

- `@your-username/blocknote-math`
- `blocknote-katex-extension`
- `blocknote-math-blocks`
- `@blocknote-community/math` (如果做成社区项目)

## 📝 开发优先级

1. **Phase 1**: 基础数学块功能
2. **Phase 2**: 编辑器界面优化
3. **Phase 3**: 高级功能和主题
4. **Phase 4**: 社区推广和文档