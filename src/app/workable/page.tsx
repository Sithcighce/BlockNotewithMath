"use client";

import { WorkingMathEditor } from "../../components/WorkableMathEditor";

export default function WorkablePage() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 页面标题 */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#1e293b',
        color: 'white',
        borderBottom: '3px solid #3b82f6'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          🚀 Workable Math Editor - 实际可用版本
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#cbd5e1', fontSize: '16px' }}>
          真正可用的数学公式编辑器 - 已解决之前的问题
        </p>
      </div>

      {/* 编辑器容器 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <WorkingMathEditor />
      </div>
    </div>
  );
}