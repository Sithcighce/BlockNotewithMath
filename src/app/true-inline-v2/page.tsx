"use client";

import { TrueInlineMathV2Editor } from "../../components/TrueInlineMathV2Editor";

export default function TrueInlineV2Page() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 页面标题 */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#1a1a2e',
        color: 'white',
        borderBottom: '3px solid #16213e'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          🎉 Phase 2: True Inline Math System
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#cbd5e1', fontSize: '16px' }}>
          真正的行内公式系统 - 与文本无缝混排的数学公式
        </p>
      </div>

      {/* 编辑器容器 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <TrueInlineMathV2Editor />
      </div>
    </div>
  );
}