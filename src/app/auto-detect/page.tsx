"use client";

import { AutoDetectMathEditor } from "../../components/AutoDetectMathEditor";

export default function AutoDetectPage() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 页面标题 */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#1a472a',
        color: 'white',
        borderBottom: '3px solid #4caf50'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          🎯 Phase 3: Auto-Detect Math System
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#cbd5e1', fontSize: '16px' }}>
          $$formula$$ 自动检测转换系统 - 输入即转换
        </p>
      </div>

      {/* 编辑器容器 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <AutoDetectMathEditor />
      </div>
    </div>
  );
}