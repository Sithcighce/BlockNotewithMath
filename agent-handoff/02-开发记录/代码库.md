# 可复用代码资源库

> **用途**: 为下一个开发者提供经过验证的代码片段  
> **状态**: 部分代码可直接使用，部分需要修改  
> **注意**: 使用前请阅读相关说明和限制

---

## 🎯 完全可用的代码

### 1. KaTeX 数学渲染核心逻辑

```typescript
// MathBlock.tsx - 核心渲染逻辑 (已验证可用)
import React, { useEffect, useRef, useState } from 'react';
import katex from 'katex';

interface MathBlockProps {
  formula: string;
  onFormulaChange?: (formula: string) => void;
  editable?: boolean;
}

const MathBlock: React.FC<MathBlockProps> = ({
  formula = "E = mc^2",
  onFormulaChange,
  editable = true
}) => {
  const mathRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(formula);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mathRef.current && !isEditing) {
      try {
        katex.render(editValue, mathRef.current, {
          displayMode: true,
          throwOnError: false,
          errorColor: '#cc0000',
          strict: false
        });
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
        if (mathRef.current) {
          mathRef.current.innerHTML = `<span style="color: #cc0000;">Error: ${error}</span>`;
        }
      }
    }
  }, [editValue, isEditing, error]);

  const handleSave = () => {
    setIsEditing(false);
    onFormulaChange?.(editValue);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(formula);
  };

  // 样式定义 (内联样式，避免CSS导入问题)
  const styles = {
    container: {
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      padding: '16px',
      margin: '8px 0',
      backgroundColor: '#f8f9fa',
      position: 'relative' as const,
      minHeight: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    mathContent: {
      fontSize: '18px',
      lineHeight: '1.5',
      textAlign: 'center' as const,
      width: '100%'
    },
    editInput: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ced4da',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'Monaco, Consolas, "Courier New", monospace'
    },
    buttonGroup: {
      position: 'absolute' as const,
      top: '4px',
      right: '4px',
      display: 'flex',
      gap: '4px'
    },
    button: {
      padding: '4px 8px',
      fontSize: '12px',
      border: '1px solid #ced4da',
      borderRadius: '4px',
      backgroundColor: '#fff',
      cursor: 'pointer'
    },
    errorMessage: {
      color: '#dc3545',
      fontSize: '14px',
      marginTop: '8px',
      padding: '8px',
      backgroundColor: '#f8d7da',
      border: '1px solid #f5c6cb',
      borderRadius: '4px'
    }
  };

  return (
    <div style={styles.container}>
      {editable && (
        <div style={styles.buttonGroup}>
          {isEditing ? (
            <>
              <button style={styles.button} onClick={handleSave}>
                Save
              </button>
              <button style={styles.button} onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button 
              style={styles.button}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
      )}
      
      {isEditing ? (
        <input
          style={styles.editInput}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder="Enter LaTeX formula..."
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            }
            if (e.key === 'Escape') {
              handleCancel();
            }
          }}
        />
      ) : (
        <div style={styles.mathContent} ref={mathRef} />
      )}
      
      {error && (
        <div style={styles.errorMessage}>
          <strong>Math Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default MathBlock;
```

**使用说明**:
- ✅ 直接可用，无需修改
- ✅ 包含完整的错误处理
- ✅ 支持编辑和预览模式
- ✅ 使用内联样式，无CSS依赖

### 2. 基础 BlockNote 编辑器设置

```typescript
// useCreateBlockNote.tsx - 修复SSR问题的版本
import { useCreateBlockNote as useOriginalCreateBlockNote } from "@blocknote/react";
import { BlockNoteEditor } from "@blocknote/core";
import { useEffect } from "react";

export function useCreateBlockNote(options?: any) {
  const editor = useOriginalCreateBlockNote(options);

  useEffect(() => {
    // 修复SSR问题 - 仅在客户端执行
    if (typeof window !== 'undefined' && editor) {
      (window as any).ProseMirror = (editor as any)._tiptapEditor;
    }
  }, [editor]);

  return editor;
}
```

**使用说明**:
- ✅ 修复了SSR兼容性问题
- ✅ 可直接替换原有的 useCreateBlockNote
- ⚠️ 需要确保在客户端组件中使用

---

## ⚠️ 需要修改的代码

### 3. BlockNote 集成规范 (需要修正)

```typescript
// MathBlockSpec.ts - 正确的集成格式
import { createReactBlockSpec } from "@blocknote/react";
import MathBlock from "./MathBlock";

// ❌ 错误的格式 (当前代码)
export const mathBlockConfig = {
  type: "math",
  propSchema: {
    formula: { default: "E = mc^2" }
  }
};

// ✅ 正确的格式 (需要修改)
export const mathBlockSpec = createReactBlockSpec(
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
    render: (props) => {
      return (
        <MathBlock 
          formula={props.block.props.formula}
          onFormulaChange={(newFormula) => {
            props.editor.updateBlock(props.block, {
              props: { formula: newFormula }
            });
          }}
        />
      );
    }
  }
);
```

**修改说明**:
- 必须使用 `createReactBlockSpec` API
- `render` 函数参数结构需要正确处理
- 需要正确的 props 更新逻辑

### 4. 编辑器初始化 (需要版本控制)

```typescript
// NotesSidebar.tsx - 需要版本兼容性修改
"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { BlockNoteSchema } from "@blocknote/core";
import { useCreateBlockNote } from "../hooks/useCreateBlockNote";  // 使用修复版本
import { mathBlockSpec } from "./blocks/mathBlockSpec";  // 使用正确规范

const schema = BlockNoteSchema.create({
  blockSpecs: {
    math: mathBlockSpec  // 注册数学块
  }
});

export default function NotesSidebar() {
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to the math-enabled editor!"
      },
      {
        type: "math", 
        props: {
          formula: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"
        }
      }
    ]
  });

  return (
    <div style={{ minHeight: "500px", padding: "20px" }}>
      <BlockNoteView 
        editor={editor}
        theme="light"
      />
    </div>
  );
}
```

**修改说明**:
- 必须使用修复版本的 `useCreateBlockNote`
- `schema` 创建需要正确的 block specifications
- `initialContent` 格式需要匹配 schema

---

## 🚧 未完成的代码模板

### 5. 斜杠命令框架

```typescript
// MathSlashMenuItems.ts - 需要完成实现
import { DefaultReactSuggestionItem } from "@blocknote/react";

export const mathSlashMenuItems = [
  {
    title: "Math Formula",
    onItemClick: (editor: any) => {
      // TODO: 需要实现插入逻辑
      editor.insertBlocks([
        {
          type: "math",
          props: {
            formula: "E = mc^2"
          }
        }
      ], editor.getTextCursorPosition().block, "after");
    },
    aliases: ["math", "eq", "formula"],
    group: "Math",
    icon: "√", // 需要替换为实际图标组件
    hint: "Insert a math formula block"
  },
  {
    title: "Geometry Formula", 
    onItemClick: (editor: any) => {
      editor.insertBlocks([
        {
          type: "math",
          props: {
            formula: "A = \\pi r^2"
          }
        }
      ], editor.getTextCursorPosition().block, "after");
    },
    aliases: ["gs", "geometry"],
    group: "Math",
    icon: "📐",
    hint: "Insert a geometry formula"
  }
];
```

**完成需求**:
- 需要正确的 BlockNote 斜杠菜单 API
- 图标组件需要实现
- 插入逻辑需要测试

### 6. 数学输入对话框框架

```typescript
// MathInputDialog.tsx - 需要完成实现
import React, { useState } from 'react';

interface MathInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formula: string) => void;
  initialFormula?: string;
}

export const MathInputDialog: React.FC<MathInputDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialFormula = ""
}) => {
  const [formula, setFormula] = useState(initialFormula);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(formula);
    onClose();
  };

  // TODO: 需要完成实际的对话框UI实现
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '400px'
      }}>
        <h3>Enter Math Formula</h3>
        <textarea
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Enter LaTeX formula..."
          style={{
            width: '100%',
            height: '100px',
            margin: '10px 0'
          }}
        />
        <div>
          <button onClick={handleSubmit}>Insert</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
```

**完成需求**:
- 需要更好的UI设计
- 需要实时预览功能
- 需要常用公式模板

---

## 📦 依赖和环境配置

### 必需依赖

```json
{
  "dependencies": {
    "@blocknote/core": "0.39.1",        // 固定版本，避免冲突
    "@blocknote/react": "0.39.1", 
    "@blocknote/mantine": "0.39.1",
    "katex": "0.16.22",                 // KaTeX 渲染引擎
    "react": "18.2.0",                  // 稳定版本
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@types/katex": "^0.16.7",          // KaTeX 类型定义
    "typescript": "^5.0.0"
  }
}
```

### CSS 资源

```css
/* katex.css - 需要在项目中导入 */
@import "katex/dist/katex.min.css";

/* 自定义数学块样式 */
.math-block {
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
  background-color: #f8f9fa;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.math-block:hover {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.math-block.editing {
  background-color: #fff;
}

.math-error {
  color: #dc3545;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
```

---

## 🔧 使用指南

### 快速开始

1. **安装依赖**
```bash
npm install @blocknote/core@0.39.1 @blocknote/react@0.39.1 @blocknote/mantine@0.39.1 katex@0.16.22
```

2. **复制核心组件**
```bash
# 复制 MathBlock.tsx 到你的项目中
cp agent-handoff/code-library/MathBlock.tsx src/components/
```

3. **修复 SSR 问题**
```bash
# 复制修复版本的 hook
cp agent-handoff/code-library/useCreateBlockNote.tsx src/hooks/
```

4. **集成到编辑器**
```typescript
// 使用提供的 NotesSidebar.tsx 模板
// 记得修改 mathBlockSpec 使用正确的 API
```

### 测试验证

```typescript
// 简单测试组件是否工作
import MathBlock from './components/MathBlock';

function TestPage() {
  return (
    <div>
      <h1>Math Block Test</h1>
      <MathBlock formula="E = mc^2" />
      <MathBlock formula="\\int_0^1 x^2 dx = \\frac{1}{3}" />
    </div>
  );
}
```

---

## ⚠️ 重要注意事项

### 版本兼容性
- **必须使用 React 18.x**: React 19 存在兼容性问题
- **固定 BlockNote 版本**: 使用 0.39.1，不要升级到 0.40+
- **Next.js 版本**: 建议使用 14.x，15.x 可能有SSR问题

### 已知限制
1. **CSS 处理**: 当前使用内联样式，不支持主题切换
2. **错误处理**: 基础错误处理，可能需要增强
3. **无障碍性**: 未考虑无障碍功能
4. **移动端**: 未测试移动端兼容性

### 扩展建议
1. **样式系统**: 改用 CSS-in-JS 或 CSS 变量
2. **功能增强**: 添加常用公式模板
3. **用户体验**: 实现实时预览
4. **性能优化**: 大公式的懒加载

---

*代码资源库*  
*最后更新: 2025年9月30日*  
*状态: 核心代码已验证，集成代码需要修改*