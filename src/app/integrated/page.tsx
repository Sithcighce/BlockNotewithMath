"use client";

import React from 'react';
import { MathEnabledEditor } from '../../components/MathEnabledEditor';

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
          🎯 BlockNote Math Integration - Complete!
        </h1>
        
        <p style={{ 
          color: '#666', 
          fontSize: '18px',
          marginBottom: '30px' 
        }}>
          Fully integrated math extension working inside BlockNote editor!
        </p>

        {/* 主编辑器区域 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: '600px'
        }}>
          <MathEnabledEditor 
            onChange={(blocks) => {
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
            🎉 Integration Complete!
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#155724', marginBottom: '12px' }}>✅ Working Features:</h4>
              <ul style={{ color: '#155724', lineHeight: '1.6' }}>
                <li>✅ Math blocks render perfectly in BlockNote</li>
                <li>✅ KaTeX integration with error handling</li>
                <li>✅ Editable formula blocks</li>
                <li>✅ Custom BlockNote schema</li>
                <li>✅ No SSR issues</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ color: '#155724', marginBottom: '12px' }}>🎯 Ready for:</h4>
              <ul style={{ color: '#155724', lineHeight: '1.6' }}>
                <li>🎯 Slash commands (/math, /eq, /gs)</li>
                <li>🎯 Inline math parsing ($$...$$)</li>
                <li>🎯 Keyboard shortcuts</li>
                <li>🎯 Toolbar integration</li>
                <li>🎯 NPM package export</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}