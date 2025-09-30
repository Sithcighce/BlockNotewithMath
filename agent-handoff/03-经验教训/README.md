# 03 - 经验教训

## 📖 经验教训总结

### 🎯 成功经验

#### 1. 稳定依赖选择的重要性
- ✅ **React 18.2.0** - 成熟稳定，生态完整
- ✅ **Next.js 14.2.0** - 与 BlockNote 兼容性好
- ✅ **BlockNote 0.39.1** - 固定版本，避免 API 变化
- ❌ **React 19/Next.js 15** - 过新版本导致兼容性问题

#### 2. 渐进式开发策略
- ✅ **先做核心功能** - MathBlock 组件优先
- ✅ **然后做集成** - BlockNote schema 集成
- ✅ **最后做扩展** - slash 命令、快捷键等
- ❌ **一开始就追求完美** - 过早优化导致复杂度爆炸

#### 3. SSR 兼容性的关键
```tsx
// ❌ 错误做法
if (window) {
  (window as any).ProseMirror = editor._tiptapEditor;
}

// ✅ 正确做法
useEffect(() => {
  if (typeof window !== 'undefined') {
    (window as any).ProseMirror = editor._tiptapEditor;
  }
}, [editor]);
```

#### 4. 一行集成 API 设计
```tsx
// ✅ 成功的设计 - 简单直接
const mathExt = createMathExtension();
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    ...mathExt.blockSpecs,
  },
});

// ❌ 复杂的设计
const mathConfig = new MathConfiguration({
  blocks: [...],
  menu: [...],
  shortcuts: [...]
});
```

### 🚫 失败教训

#### 1. 版本激进主义的代价
**问题**: 使用最新版本 React 19、Next.js 15
**后果**: 
- 类型定义不完整
- 生态库支持不足
- 意外的行为变化
- 调试困难

**教训**: 在企业级开发中，稳定性比新特性更重要

#### 2. 过早创建 npm 包
**问题**: 功能还未验证就开始打包发布
**后果**:
- 构建配置复杂化
- 调试周期变长
- 版本管理混乱
- 集成测试困难

**教训**: 先在主项目中完成功能，验证稳定后再提取

#### 3. CSS 处理策略失误
**问题**: 使用 CSS 模块和复杂的样式处理
**后果**:
- 样式文件无法正确导入
- 构建时出现路径问题
- 开发体验差

**教训**: 使用全局 CSS + CSS 变量更可靠

#### 4. 测试驱动开发缺失
**问题**: 没有在每个步骤进行充分验证
**后果**:
- 问题累积到后期
- 调试成本指数增长
- 无法确定问题根源

**教训**: 每完成一个功能就要在浏览器中测试

### 🛠️ 技术教训

#### 1. BlockNote API 的正确使用
```tsx
// ✅ 正确的 block specification
export const mathBlockConfig = createReactBlockSpec(
  {
    type: "math",
    propSchema: {
      formula: {
        default: "E = mc^2"
      }
    },
    content: "none"
  },
  {
    render: (props) => React.createElement(MathBlock, props)
  }
);

// ❌ 错误的格式
export const mathBlock = {
  type: "math",
  component: MathBlock,
  // 缺少正确的规范定义
};
```

#### 2. KaTeX 集成的最佳实践
```tsx
// ✅ 正确的错误处理
try {
  const rendered = katex.renderToString(formula, {
    displayMode: true,
    throwOnError: true
  });
  setRenderedMath(rendered);
  setError(null);
} catch (err) {
  setError(err.message);
  // 保持在编辑模式
}

// ❌ 没有错误处理
const rendered = katex.renderToString(formula);
// 语法错误会导致整个组件崩溃
```

#### 3. React 状态管理
```tsx
// ✅ 清晰的状态管理
const [isEditing, setIsEditing] = useState(false);
const [formula, setFormula] = useState(block.props.formula);
const [error, setError] = useState<string | null>(null);

// ❌ 混乱的状态管理
const [state, setState] = useState({
  editing: false,
  formula: '',
  error: null,
  // 其他各种状态混在一起
});
```

### 📋 开发流程教训

#### 1. 正确的开发顺序
```
1. 环境搭建（稳定版本）
2. 核心组件开发（MathBlock）
3. 本地功能验证（浏览器测试）
4. BlockNote 集成（schema）
5. 集成功能验证（编辑器中测试）
6. 高级功能添加（slash 命令等）
7. 完整性测试
8. 提取为独立包
9. 发布和文档
```

#### 2. 每个阶段的验证重点
- **组件开发**: 在独立环境中测试渲染
- **BlockNote 集成**: 确保能插入和编辑
- **高级功能**: 逐个验证每个特性
- **打包发布**: 在真实项目中测试集成

#### 3. 问题排查的系统方法
```
1. 确定问题范围（组件/集成/构建）
2. 查看错误堆栈和日志
3. 逐步简化到最小复现
4. 对照官方文档和示例
5. 在社区寻找类似问题
6. 记录解决方案以备后用
```

### 🎓 项目管理教训

#### 1. 需求理解的重要性
- **用户真正需要的**: 简单可用的数学编辑功能
- **开发者容易过度设计**: 复杂的插件架构
- **正确的平衡**: 功能完整但 API 简洁

#### 2. 文档的价值
- **边开发边记录**: 问题和解决方案
- **为后续开发者服务**: 清晰的交接文档
- **包含失败经验**: 让别人避免同样的坑

#### 3. 迭代开发的节奏
- **小步快跑**: 每天都有可验证的进展
- **及时调整**: 发现问题立即修正方向
- **保持动力**: 持续的小成功比大失败更有价值

### 💡 设计哲学教训

#### 1. 简单性原则
```tsx
// ✅ 简单即是美
<MathBlock formula="E = mc^2" />

// ❌ 复杂性带来的负担
<MathBlock 
  formula="E = mc^2"
  renderer="katex"
  theme="light"
  displayMode={true}
  errorHandling="graceful"
  // 太多配置选项
/>
```

#### 2. 约定优于配置
- **合理的默认值**: 大多数情况下无需配置
- **渐进式增强**: 需要时才暴露高级选项
- **标准化行为**: 遵循用户期望的交互模式

#### 3. 用户体验第一
- **响应迅速**: 实时预览和反馈
- **错误友好**: 清晰的错误提示
- **操作直观**: 符合用户习惯的交互

### 🔄 持续改进

#### 1. 代码质量
- **类型安全**: 完整的 TypeScript 类型定义
- **测试覆盖**: 单元测试和集成测试
- **代码规范**: 一致的代码风格和命名

#### 2. 性能优化
- **懒加载**: 按需加载 KaTeX 等大型依赖
- **缓存渲染**: 避免重复计算
- **防抖处理**: 减少频繁的重新渲染

#### 3. 开发体验
- **清晰的 API**: 自解释的函数和变量名
- **完整的文档**: 示例和最佳实践
- **工具支持**: IDE 智能提示和错误检查

---

## 📚 推荐阅读顺序

### 对于新接手的开发者
1. **技术问题分析.md** - 了解具体遇到的问题和解决方案
2. **工作报告.md** - 理解整个项目的发展过程
3. **历史教训.md** - 学习从之前失败中总结的经验

### 对于项目管理者
1. **工作报告.md** - 了解项目整体状况
2. **历史教训.md** - 理解项目风险和决策依据
3. **技术问题分析.md** - 评估技术债务和解决成本

### 对于学习者
1. **历史教训.md** - 了解一个典型项目的完整生命周期
2. **技术问题分析.md** - 学习具体技术问题的诊断和解决
3. **工作报告.md** - 理解如何进行项目分析和交接

---

## 🎯 核心启示

**最重要的三个教训**:

1. **稳定性胜过先进性** - 选择成熟稳定的技术栈
2. **简单性胜过完美性** - 先让基础功能工作，再考虑高级特性  
3. **验证胜过假设** - 每个步骤都要在真实环境中测试

这些经验教训不仅适用于这个项目，对任何复杂的前端集成开发都有重要参考价值。

**记住**: 失败是最好的老师，但更好的是从别人的失败中学习! 🚀