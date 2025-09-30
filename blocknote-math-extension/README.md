# BlockNote Math Extension

A comprehensive math extension for BlockNote editor with KaTeX support. This library provides seamless integration of mathematical formulas into your BlockNote editor with multiple input methods and rendering capabilities.

## ✨ Features

- **Block-level Math Equations**: Insert math blocks using `/math`, `/eq`, or `/gs` commands
- **Inline Math Support**: Use `$$formula$$` syntax for inline mathematical expressions  
- **Keyboard Shortcuts**: Quick access with `Ctrl/Cmd + Shift + E`
- **Formatting Toolbar**: Convert selected text to math formulas with √x button
- **Real-time Preview**: Live LaTeX rendering with error handling
- **Theme Support**: Automatic light/dark theme compatibility
- **TypeScript Support**: Full type definitions included

## 🚀 Quick Start

### Installation

```bash
npm install blocknote-math-extension
```

### Basic Usage

```tsx
import { useCreateBlockNote, BlockNoteView } from "@blocknote/react";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { mathBlocks } from "blocknote-math-extension";

// Create schema with math blocks
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    ...mathBlocks,  // 🎉 One line integration!
  },
});

function MyEditor() {
  const editor = useCreateBlockNote({ schema });

  return <BlockNoteView editor={editor} />;
}
```

### Full Feature Integration

```tsx
import { 
  mathBlocks, 
  mathSlashMenuItems, 
  mathFormattingButton,
  mathKeyboardShortcuts,
  createMathExtension 
} from "blocknote-math-extension";

// Option 1: Use individual components
const editor = useCreateBlockNote({
  schema: BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      ...mathBlocks,
    },
  }),
  // Add slash menu items for /math, /eq, /gs commands
  slashMenuItems: [
    ...getDefaultSlashMenuItems(editor),
    ...mathSlashMenuItems,
  ],
});

// Option 2: Use convenient configuration helper
const mathConfig = createMathExtension({
  enableSlashCommands: true,
  enableKeyboardShortcuts: true, 
  enableFormattingButton: true,
  enableInlineMath: false, // Coming soon!
});
```

## 📖 Usage Guide

### Slash Commands

Users can insert math blocks using any of these commands:

- `/math` + Enter → Insert math equation block
- `/eq` + Enter → Insert equation block  
- `/gs` + Enter → Insert formula block (公式)

### Keyboard Shortcuts

- `Ctrl + Shift + E` (Windows/Linux) or `Cmd + Shift + E` (Mac) → Open math input dialog

### Inline Math (Coming Soon)

- `$$E=mc^2$$` → Automatically converts to inline math formula

### Formatting Toolbar

- Select text and click the √x button to convert to math formula
- Or use the keyboard shortcut while text is selected

## 🛠 API Reference

### Core Exports

```tsx
// Block specifications
export const mathBlocks: { math: MathBlockSpec };

// Menu items
export const mathSlashMenuItems: MathSlashMenuItem[];
export const mathFormattingButton: MathFormattingButton;

// Components
export { MathBlock } from './blocks/math/MathBlock';
export { MathInputDialog } from './components/MathInputDialog';

// Utilities
export { DoubleDollarParser } from './parsers/DoubleDollarParser';
```

### Configuration Helper

```tsx
const mathConfig = createMathExtension({
  enableSlashCommands?: boolean;      // Default: true
  enableKeyboardShortcuts?: boolean;  // Default: true
  enableFormattingButton?: boolean;   // Default: true
  enableInlineMath?: boolean;        // Default: true
});
```

## 🎨 Styling

The extension includes CSS files that need to be imported:

```tsx
// Import required styles
import "katex/dist/katex.min.css";
import "blocknote-math-extension/dist/blocks/math/MathBlock.css";
import "blocknote-math-extension/dist/components/MathInputDialog.css";
```

Or import all styles at once:

```tsx
import "blocknote-math-extension/dist/styles.css";
```

## 🌙 Theme Support

The extension automatically adapts to your BlockNote theme:

```tsx
<BlockNoteView 
  editor={editor} 
  theme="dark"  // Math blocks will adapt automatically
/>
```

## 📝 LaTeX Examples

Here are some common LaTeX formulas you can use:

- **Fractions**: `\frac{a}{b}`
- **Superscripts**: `x^2`, `e^{i\pi}`
- **Subscripts**: `x_1`, `H_2O`
- **Square roots**: `\sqrt{x}`, `\sqrt[3]{x}`
- **Greek letters**: `\alpha`, `\beta`, `\gamma`
- **Integrals**: `\int_0^1 x dx`
- **Summations**: `\sum_{i=1}^n i`
- **Matrices**: `\begin{pmatrix} a & b \\ c & d \end{pmatrix}`

## 🔧 Development

### Prerequisites

- Node.js 16+
- TypeScript 5+
- React 18+
- BlockNote 0.39+

### Building from Source

```bash
git clone https://github.com/your-repo/blocknote-math-extension
cd blocknote-math-extension
npm install
npm run build
```

### Testing

```bash
npm test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [BlockNote](https://www.blocknotejs.org/) - The amazing rich text editor
- [KaTeX](https://katex.org/) - Fast math rendering for the web
- All contributors who helped make this project possible

## 📞 Support

- 📚 [Documentation](https://your-docs-site.com)
- 🐛 [Issue Tracker](https://github.com/your-repo/blocknote-math-extension/issues)
- 💬 [Discussions](https://github.com/your-repo/blocknote-math-extension/discussions)

---

Made with ❤️ for the BlockNote community