"use client";

import { TrueInlineMathEditor } from "../../components/TrueInlineMathEditor";

export default function TrueInlinePage() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 页面标题 */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#0f1419',
        color: 'white',
        borderBottom: '3px solid #00d4aa'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          🚧 Phase 1: Smart Text Conversion
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#cbd5e1', fontSize: '16px' }}>
          智能文本转换功能 - 类型安全的实现方式
        </p>
      </div>

      {/* 编辑器容器 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <TrueInlineMathEditor />
      </div>
    </div>
  );
}