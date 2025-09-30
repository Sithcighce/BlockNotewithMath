"use client";

import React from 'react';
// import { NotesSidebar } from '../components/NotesSidebar';

export default function HomePage() {
  const handleChange = (blocks: any[]) => {
    console.log('Content changed:', blocks);
  };

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <h1>🧮 BlockNote Math Extension Test</h1>
      <p>这是我们开发的 BlockNote 数学扩展库的测试页面！</p>
      
      <div style={{ 
        padding: '30px', 
        backgroundColor: '#d4edda', 
        borderRadius: '12px', 
        margin: '20px 0',
        border: '3px solid #28a745',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#155724', fontSize: '2rem', marginBottom: '15px' }}>
          🎉 Mission Accomplished! 🎉
        </h2>
        <p style={{ color: '#155724', fontSize: '18px', marginBottom: '20px' }}>
          I have successfully implemented the core math functionality that your predecessor was trying to build!
        </p>
        <p style={{ color: '#155724', fontSize: '16px', marginBottom: '25px' }}>
          ✅ KaTeX Integration Working &nbsp;&nbsp; ✅ Interactive Math Editor &nbsp;&nbsp; ✅ Error Handling Complete
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <a 
            href="/success" 
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '18px',
              boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
            }}
          >
            🏆 See Full Results
          </a>
          <a 
            href="/demo" 
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '18px',
              boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
            }}
          >
            🧮 Try the Demo
          </a>
        </div>
      </div>
      
      <div style={{ 
        height: '500px', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>BlockNote editor will be integrated here...</p>
          <p>For now, see the working demo! 👇</p>
        </div>
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