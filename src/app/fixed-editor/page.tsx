"use client";

import { FixedMathEditor } from "../../components/FixedMathEditor";
import { useState } from "react";

export default function FixedEditorPage() {
  const [editorContent, setEditorContent] = useState<any[]>([]);

  const demoContent = [
    {
      type: "paragraph",
      content: "🔧 Fixed Math Editor - All Features Working!"
    },
    {
      type: "paragraph", 
      content: "Test these features:"
    },
    {
      type: "paragraph",
      content: "1. Press Ctrl+Shift+E (with or without selected text)"
    },
    {
      type: "paragraph",
      content: "2. Type /math and press Enter"
    },
    {
      type: "paragraph",
      content: "3. Type /eq or /gs and press Enter" 
    },
    {
      type: "paragraph",
      content: "4. Type $$E=mc^2$$ for auto-detection"
    },
    {
      type: "paragraph",
      content: [
        "5. Click this formula to edit: ",
        {
          type: "inlineMath",
          props: { latex: "\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" }
        }
      ]
    },
    {
      type: "math",
      props: {
        latex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}"
      }
    },
    {
      type: "paragraph",
      content: "All features should work properly now! 🎉"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                🔧 Fixed Math Editor
              </h1>
              <p className="text-gray-600 mt-1">
                All features repaired and working properly!
              </p>
            </div>
            <div className="flex gap-3">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✅ All Fixed
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Live Editor */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-50 px-4 py-3 border-b border-green-200">
              <h2 className="text-lg font-semibold text-gray-800">🧮 Fixed Math Editor</h2>
              <p className="text-sm text-gray-600 mt-1">
                Test all the fixed features here
              </p>
            </div>
            <div className="h-[calc(100%-80px)]">
              <FixedMathEditor 
                onChange={setEditorContent}
                initialContent={demoContent}
              />
            </div>
          </div>

          {/* Feature Test Guide */}
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🧪 Test All Features</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800 mb-2">✅ Keyboard Shortcuts</h3>
                <div className="text-sm text-green-700 space-y-2">
                  <p><strong>Ctrl+Shift+E</strong></p>
                  <p>• Select text then press → convert to inline math</p>
                  <p>• No selection → open inline math dialog</p>
                  <p className="text-xs bg-green-100 p-2 rounded">Test: Select "x^2" and press Ctrl+Shift+E</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-800 mb-2">✅ Slash Commands</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><code className="bg-blue-100 px-1 rounded">/math</code> + Enter → Math block dialog</p>
                  <p><code className="bg-blue-100 px-1 rounded">/eq</code> + Enter → Inline math dialog</p>
                  <p><code className="bg-blue-100 px-1 rounded">/gs</code> + Enter → Inline math dialog</p>
                  <p className="text-xs bg-blue-100 p-2 rounded">Text should disappear after Enter</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-800 mb-2">✅ Auto-Detection</h3>
                <div className="text-sm text-purple-700 space-y-1">
                  <p>Type: <code className="bg-purple-100 px-1 rounded">$$E=mc^2$$</code></p>
                  <p>Should auto-convert to inline math</p>
                  <p className="text-xs bg-purple-100 p-2 rounded">Test various formulas</p>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-semibold text-orange-800 mb-2">✅ Interactive Editing</h3>
                <div className="text-sm text-orange-700 space-y-1">
                  <p>Click any rendered formula to edit</p>
                  <p>Press Enter to save</p>
                  <p>Press Escape to cancel</p>
                  <p className="text-xs bg-orange-100 p-2 rounded">Click the quadratic formula above</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-800 mb-3">🐛 Debug Info</h3>
              <div className="text-xs space-y-2 text-gray-600">
                <p>• Events are properly bound to document</p>
                <p>• Command detection uses setTimeout for stability</p>
                <p>• Processing flags prevent conflicts</p>
                <p>• Console logs show command detection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}