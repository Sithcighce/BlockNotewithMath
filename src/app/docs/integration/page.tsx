import Link from "next/link";

export default function IntegrationPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/docs" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Documentation
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔧 Integration Guide
          </h1>
          <p className="text-xl text-gray-600">
            Complete guide to integrate math functionality into your BlockNote editor.
          </p>
        </div>

        {/* Step 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Install Dependencies</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <div># Core BlockNote and React support</div>
            <div>npm install @blocknote/core @blocknote/react @blocknote/mantine</div>
            <div className="mt-2"># Math rendering</div>
            <div>npm install katex</div>
            <div className="mt-2"># TypeScript support</div>
            <div>npm install --save-dev @types/katex</div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Import Required Styles</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <div>import "katex/dist/katex.min.css";</div>
            <div>import "@blocknote/core/style.css";</div>
            <div>import "@blocknote/mantine/style.css";</div>
          </div>
          <p className="text-gray-700">
            Make sure to include these CSS imports in your root component or layout file.
          </p>
        </section>

        {/* Step 3 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Copy Core Files</h2>
          <p className="text-gray-700 mb-4">
            Copy these files from the project into your source directory:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="font-mono text-sm space-y-1">
              <div>📁 src/components/</div>
              <div className="ml-4">📄 MathEditor.tsx <span className="text-gray-500">// Main component</span></div>
              <div className="ml-4">📄 useCreateBlockNote.tsx <span className="text-gray-500">// Hook for editor</span></div>
              <div className="mt-2">📁 blocknote-math-extension/</div>
              <div className="ml-4">📄 src/index.ts <span className="text-gray-500">// Math block specs</span></div>
            </div>
          </div>
        </section>

        {/* Step 4 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 4: Basic Usage</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <div>{"import { MathEditor } from './components/MathEditor';"}</div>
            <div className="mt-4">{"function App() {"}</div>
            <div className="ml-2">{"  const handleChange = (blocks) => {"}</div>
            <div className="ml-4">{"    console.log('Content changed:', blocks);"}</div>
            <div className="ml-2">{"  };"}</div>
            <div className="mt-2">{"  return ("}</div>
            <div className="ml-4">{"    <MathEditor onChange={handleChange} />"}</div>
            <div className="ml-2">{"  );"}</div>
            <div>{"}"}</div>
          </div>
        </section>

        {/* Step 5 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 5: Advanced Configuration</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <div>{"const initialContent = ["}</div>
            <div className="ml-2">{"  {"}</div>
            <div className="ml-4">{'    type: "paragraph",'}</div>
            <div className="ml-4">{'    content: "Welcome to math editor!"'}</div>
            <div className="ml-2">{"  },"}</div>
            <div className="ml-2">{"  {"}</div>
            <div className="ml-4">{'    type: "math",'}</div>
            <div className="ml-4">{'    props: { latex: "E = mc^2" }'}</div>
            <div className="ml-2">{"  }"}</div>
            <div>{"];"}</div>
            <div className="mt-4">{"<MathEditor"}</div>
            <div className="ml-2">{"  initialContent={initialContent}"}</div>
            <div className="ml-2">{'  placeholder="Start writing..."'}</div>
            <div className="ml-2">{"  onChange={handleChange}"}</div>
            <div>{"/>"}</div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Features</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">✨ Slash Commands</h3>
              <ul className="text-gray-700 space-y-1">
                <li><code className="bg-gray-100 px-2 py-1 rounded">/math</code> - Creates a math block with dialog input</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">/eq</code> - Creates inline formula with dialog input</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">/gs</code> - Creates inline formula with dialog input</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">🔍 Auto-Detection</h3>
              <p className="text-gray-700">
                Type <code className="bg-gray-100 px-2 py-1 rounded">$$LaTeX formula$$</code> and it automatically converts to inline math.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">✏️ Interactive Editing</h3>
              <p className="text-gray-700">
                Click any rendered formula to edit it. Press Enter to save or Escape to cancel.
              </p>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔧 Troubleshooting</h2>
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <h3 className="font-semibold text-yellow-800">SSR Issues</h3>
              <p className="text-yellow-700">
                If you encounter SSR issues, make sure to use dynamic imports for the BlockNoteView component.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <h3 className="font-semibold text-red-800">Type Errors</h3>
              <p className="text-red-700">
                Make sure to install @types/katex and use proper TypeScript configurations.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h3 className="font-semibold text-blue-800">Styling Issues</h3>
              <p className="text-blue-700">
                Ensure all required CSS files are imported and loaded before the component renders.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}