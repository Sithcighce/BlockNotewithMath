import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Editor
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 BlockNote Math Extension Documentation
          </h1>
          <p className="text-xl text-gray-600">
            Complete guide for developers and users to integrate and use math functionality in BlockNote.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Quick Start</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">For Developers</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
              <div>npm install @blocknote/core @blocknote/react katex</div>
              <div className="mt-2">npm install --save-dev @types/katex</div>
            </div>
            <p className="text-gray-700">
              Import the MathEditor component and use it directly in your React application.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">For End Users</h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <code className="bg-blue-100 px-2 py-1 rounded">/math</code> → Create math block
              </p>
              <p className="text-gray-700">
                <code className="bg-blue-100 px-2 py-1 rounded">/eq</code> or <code className="bg-blue-100 px-2 py-1 rounded">/gs</code> → Insert inline formula
              </p>
              <p className="text-gray-700">
                <code className="bg-blue-100 px-2 py-1 rounded">$$formula$$</code> → Auto-convert to inline math
              </p>
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="text-blue-600 text-2xl mb-3">🔧</div>
            <h3 className="text-xl font-semibold mb-2">Integration Guide</h3>
            <p className="text-gray-600 mb-4">
              Step-by-step instructions for integrating the math extension into your BlockNote editor.
            </p>
            <Link href="/docs/integration" className="text-blue-600 hover:text-blue-800 font-medium">
              Read Integration Guide →
            </Link>
          </div>

          <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="text-green-600 text-2xl mb-3">💡</div>
            <h3 className="text-xl font-semibold mb-2">Usage Examples</h3>
            <p className="text-gray-600 mb-4">
              Common use cases and LaTeX formula examples for mathematical notation.
            </p>
            <Link href="/docs/examples" className="text-blue-600 hover:text-blue-800 font-medium">
              View Examples →
            </Link>
          </div>

          <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="text-purple-600 text-2xl mb-3">📖</div>
            <h3 className="text-xl font-semibold mb-2">API Reference</h3>
            <p className="text-gray-600 mb-4">
              Complete API documentation for the MathEditor component and its props.
            </p>
            <Link href="/docs/api" className="text-blue-600 hover:text-blue-800 font-medium">
              API Reference →
            </Link>
          </div>

          <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="text-orange-600 text-2xl mb-3">🏗️</div>
            <h3 className="text-xl font-semibold mb-2">Architecture</h3>
            <p className="text-gray-600 mb-4">
              Technical architecture, design patterns, and implementation details.
            </p>
            <Link href="/docs/architecture" className="text-blue-600 hover:text-blue-800 font-medium">
              Learn Architecture →
            </Link>
          </div>
        </section>

        {/* Features Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Features Overview</h2>
          <div className="grid gap-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <h3 className="font-semibold text-gray-900">Slash Commands</h3>
                <p className="text-gray-600">Type /math, /eq, or /gs to insert math content</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <h3 className="font-semibent text-gray-900">Auto-Detection</h3>
                <p className="text-gray-600">Automatically converts $$formula$$ syntax to inline math</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <h3 className="font-semibold text-gray-900">Interactive Editing</h3>
                <p className="text-gray-600">Click any formula to edit with real-time preview</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <h3 className="font-semibold text-gray-900">Full LaTeX Support</h3>
                <p className="text-gray-600">KaTeX-powered rendering with error handling</p>
              </div>
            </div>
          </div>
        </section>

        {/* Support */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🆘 Support & Contributing</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              This extension is built on top of BlockNote 0.39.1 and KaTeX for reliable math rendering.
              For issues or contributions, please refer to the project documentation.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/TypeCellOS/BlockNote" className="text-blue-600 hover:text-blue-800">
                BlockNote GitHub →
              </Link>
              <Link href="https://katex.org/" className="text-blue-600 hover:text-blue-800">
                KaTeX Documentation →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}