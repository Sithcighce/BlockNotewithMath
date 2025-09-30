"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const MathEnabledEditorV3 = dynamic(
  () => import('../../components/MathEnabledEditorV3').then(mod => mod.MathEnabledEditorV3),
  { 
    ssr: false,
    loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading math-enabled editor V3...</div>
  }
);

export default function IntegratedDemoPage() {
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
          🚀 BlockNote Math Extension - Enhanced!
        </h1>
        
        <p style={{ 
          color: '#666', 
          fontSize: '18px',
          marginBottom: '30px' 
        }}>
          Math extension with simulated slash commands and enhanced functionality!
        </p>

        {/* 主编辑器区域 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: '600px',
          overflow: 'hidden'
        }}>
          <MathEnabledEditorV3 
            onChange={(blocks: any) => {
              console.log('Document changed:', blocks);
            }}
          />
        </div>

        {/* 功能说明 */}
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '30px'
        }}>
          <h3 style={{ color: '#155724', marginBottom: '16px' }}>
            🚀 Enhanced Math Features!
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#155724', marginBottom: '12px' }}>✅ Working Features:</h4>
              <ul style={{ color: '#155724', lineHeight: '1.6' }}>
                <li>✅ Math blocks render perfectly in BlockNote</li>
                <li>✅ KaTeX integration with error handling</li>
                <li>✅ Editable formula blocks (click to edit)</li>
                <li>✅ Math command buttons (/math, /eq, /gs)</li>
                <li>✅ Quick formula insertion toolbar</li>
                <li>✅ Custom BlockNote schema</li>
                <li>✅ No SSR issues</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ color: '#155724', marginBottom: '12px' }}>🎯 Enhanced Features:</h4>
              <ul style={{ color: '#155724', lineHeight: '1.6' }}>
                <li>🎯 Interactive math command buttons</li>
                <li>🎯 Pre-defined formula templates</li>
                <li>🎯 Help and guidance system</li>
                <li>🎯 Real-time formula insertion</li>
                <li>🎯 User-friendly math toolbar</li>
                <li>🎯 Future: Native slash command support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}