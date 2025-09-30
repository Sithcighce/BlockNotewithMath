"use client";

import { CorrectShortcutsEditor } from "../../components/CorrectShortcutsEditor";

export default function CorrectShortcutsPage() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 页面标题 */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#0f172a',
        color: 'white',
        borderBottom: '3px solid #f59e0b'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          🎯 Correct Shortcuts Implementation
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#cbd5e1', fontSize: '16px' }}>
          基于用户反馈的正确快捷键逻辑 - 文本转换而非便捷插入
        </p>
      </div>

      {/* 编辑器容器 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <CorrectShortcutsEditor />
      </div>
    </div>
  );
}