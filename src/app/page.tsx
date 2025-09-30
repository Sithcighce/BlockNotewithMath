"use client";

import React from 'react';
import { NotesSidebar } from '../../agent-handoff/NotesSidebar';

export default function HomePage() {
  const handleChange = (blocks: any[]) => {
    console.log('Content changed:', blocks);
  };

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <h1>🧮 BlockNote Math Extension Test</h1>
      <p>这是我们开发的 BlockNote 数学扩展库的测试页面！</p>
      
      <div style={{ height: '500px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
        <NotesSidebar onChange={handleChange} />
      </div>
      
      <div style={{ padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
        <h3>📝 功能测试清单：</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4>✅ Slash 命令测试：</h4>
            <ul>
              <li>输入 <code>/math</code> 并按回车 → 插入数学公式块</li>
              <li>输入 <code>/eq</code> 并按回车 → 插入数学公式块</li>
              <li>输入 <code>/gs</code> 并按回车 → 插入数学公式块</li>
            </ul>
          </div>
          <div>
            <h4>🧮 LaTeX 公式示例：</h4>
            <ul>
              <li><code>\frac{'{1}{2}'}</code> - 分数</li>
              <li><code>x^2 + y^2 = z^2</code> - 上标</li>
              <li><code>\sqrt{'{x}'}</code> - 平方根</li>
              <li><code>\sum_{'{i=1}'}^n i</code> - 求和</li>
            </ul>
          </div>
        </div>
        <p><strong>🎯 目标：</strong>用户应该能够使用 slash 命令插入数学块，并在其中输入 LaTeX 公式看到实时渲染！</p>
      </div>
    </div>
  );
}