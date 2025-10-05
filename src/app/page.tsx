"use client";

import Link from "next/link";
import { MathEditor } from "../components/MathEditor";
import { useState } from "react";

export default function HomePage() {
  const [editorContent, setEditorContent] = useState<any[]>([]);

  const demoContent = [
    {
      type: "paragraph",
      content: "Welcome to BlockNote Math Extension! 🎯"
    },
    {
      type: "paragraph", 
      content: "Try these features:"
    },
    {
      type: "paragraph",
      content: "• Type /math and press Enter to create a math block"
    },
    {
      type: "paragraph",
      content: "• Type /eq or /gs and press Enter for inline formulas"
    },
    {
      type: "paragraph",
      content: "• Use $$E=mc^2$$ syntax for auto-detection"
    },
    {
      type: "paragraph",
      content: [
        "• Click existing formulas to edit, like ",
        {
          type: "inlineMath",
          props: { latex: "x^2 + y^2 = z^2" }
        },
        " (Pythagorean theorem)"
      ]
    },
    {
      type: "math",
      props: {
        latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}"
      }
    },
    {
      type: "paragraph",
      content: "Start editing below! 👇"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                📊 BlockNote Math Extension
              </h1>
              <p className="text-gray-600 mt-1">
                Complete math support for BlockNote editor - Ready to use!
              </p>
            </div>
            <div className="flex gap-3">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✅ Production Ready
              </span>
              <Link href="/docs" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                📚 Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Live Editor */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h2 className="text-lg font-semibold text-gray-800">🧮 Live Math Editor</h2>
              <p className="text-sm text-gray-600 mt-1">
                Try all features in this interactive editor
              </p>
            </div>
            <div className="h-[calc(100%-80px)]">
              <MathEditor 
                onChange={setEditorContent}
                initialContent={demoContent}
                placeholder="Start writing with full math support..."
              />
            </div>
          </div>

          {/* Feature Guide */}
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🚀 Quick Start Guide</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-800 mb-2">Slash Commands</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><code className="bg-blue-100 px-1 rounded">/math</code> → Create math block</p>
                  <p><code className="bg-blue-100 px-1 rounded">/eq</code> → Insert inline formula</p>
                  <p><code className="bg-blue-100 px-1 rounded">/gs</code> → Insert inline formula</p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800 mb-2">Auto-Detection</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p>Type <code className="bg-green-100 px-1 rounded">$$formula$$</code></p>
                  <p>Automatically converts to inline math</p>
                  <p>Example: <code className="bg-green-100 px-1 rounded">$$E=mc^2$$</code></p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-800 mb-2">Interactive Editing</h3>
                <div className="text-sm text-purple-700 space-y-1">
                  <p>Click any formula to edit</p>
                  <p>Press Enter to save</p>
                  <p>Press Escape to cancel</p>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-semibold text-orange-800 mb-2">LaTeX Support</h3>
                <div className="text-sm text-orange-700 space-y-1">
                  <p>Full KaTeX compatibility</p>
                  <p>Real-time preview</p>
                  <p>Error handling</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-800 mb-3">📖 Explore More</h3>
              <div className="space-y-2 text-sm">
                <Link href="/docs" className="block text-blue-600 hover:text-blue-800">
                  📚 Developer Documentation
                </Link>
                <Link href="/docs/integration" className="block text-blue-600 hover:text-blue-800">
                  🔧 Integration Guide
                </Link>
                <Link href="/docs/examples" className="block text-blue-600 hover:text-blue-800">
                  💡 Usage Examples
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}