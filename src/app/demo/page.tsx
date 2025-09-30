"use client";

import React, { useState } from 'react';
import { EditableMathBlock } from '../../components/EditableMathBlock';
// import { NotesSidebar } from '../../components/NotesSidebar';

export default function MathDemoPage() {
  const [formulas, setFormulas] = useState([
    "E = mc^2",
    "\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}",
    "\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}"
  ]);

  const addNewFormula = () => {
    setFormulas([...formulas, "x^2 + y^2 = z^2"]);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          color: '#333',
          marginBottom: '8px',
          fontSize: '2.5rem'
        }}>
          🧮 BlockNote Math Extension - Demo
        </h1>
        
        <p style={{ 
          color: '#666', 
          fontSize: '18px',
          marginBottom: '30px' 
        }}>
          This is our working math extension! Click any formula to edit it.
        </p>

        {/* 功能展示区域 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '40px'
        }}>
          
          {/* 左侧：独立数学块演示 */}
          <div>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>
              ✅ Standalone Math Blocks
            </h2>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {formulas.map((formula, index) => (
                <EditableMathBlock
                  key={index}
                  initialLatex={formula}
                  onLatexChange={(newLatex: string) => {
                    const newFormulas = [...formulas];
                    newFormulas[index] = newLatex;
                    setFormulas(newFormulas);
                  }}
                />
              ))}
              
              <button
                onClick={addNewFormula}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginTop: '16px'
                }}
              >
                ➕ Add New Formula
              </button>
            </div>
          </div>

          {/* 右侧：BlockNote 编辑器演示 */}
          <div>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>
              🔄 BlockNote Editor Integration (WIP)
            </h2>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '400px'
            }}>
              <div style={{ 
                padding: '20px', 
                textAlign: 'center',
                color: '#666'
              }}>
                BlockNote integration will be completed next...
              </div>
            </div>
          </div>
        </div>

        {/* 状态汇报 */}
        <div style={{
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#0c5460', marginBottom: '16px' }}>
            📊 Current Project Status
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#0c5460', marginBottom: '12px' }}>✅ Completed Features:</h4>
              <ul style={{ color: '#0c5460', lineHeight: '1.6' }}>
                <li>✅ KaTeX rendering engine integration</li>
                <li>✅ Editable math block component</li>
                <li>✅ Error handling and validation</li>
                <li>✅ Interactive edit/save interface</li>
                <li>✅ LaTeX syntax highlighting</li>
                <li>✅ Keyboard shortcuts (Ctrl+Enter, Esc)</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ color: '#856404', marginBottom: '12px' }}>🔄 Next Steps:</h4>
              <ul style={{ color: '#856404', lineHeight: '1.6' }}>
                <li>🔄 BlockNote schema integration</li>
                <li>🔄 Slash commands (/math, /eq, /gs)</li>
                <li>🔄 Inline math support ($$...$$)</li>
                <li>🔄 Keyboard shortcuts (Ctrl+Shift+E)</li>
                <li>🔄 Formatting toolbar button (√x)</li>
                <li>🔄 NPM package publication</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 技术说明 */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h3 style={{ color: '#856404', marginBottom: '16px' }}>
            🎯 Technical Achievement
          </h3>
          <p style={{ color: '#856404', lineHeight: '1.6', marginBottom: '12px' }}>
            <strong>Major Progress!</strong> We've successfully fixed the core issues from the previous attempt:
          </p>
          <ul style={{ color: '#856404', lineHeight: '1.6' }}>
            <li>✅ <strong>SSR Issues Fixed:</strong> Proper client-side rendering with Next.js</li>
            <li>✅ <strong>KaTeX Integration Working:</strong> Math formulas render perfectly</li>
            <li>✅ <strong>User Interface Complete:</strong> Click-to-edit functionality</li>
            <li>✅ <strong>Error Handling Robust:</strong> Invalid LaTeX shows helpful errors</li>
          </ul>
          <p style={{ color: '#856404', lineHeight: '1.6', marginTop: '12px' }}>
            <strong>This proves the concept works!</strong> Now we can proceed with BlockNote integration.
          </p>
        </div>
      </div>
    </div>
  );
}