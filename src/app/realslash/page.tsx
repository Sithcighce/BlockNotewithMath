"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const RealSlashMathEditor = dynamic(
  () => import('../../components/RealSlashMathEditor').then(mod => mod.RealSlashMathEditor),
  { 
    ssr: false,
    loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading real slash commands editor...</div>
  }
);

export default function RealSlashDemoPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            color: '#333',
            marginBottom: '8px',
            fontSize: '2.5rem'
          }}>
            ⚡ Real Slash Commands - Math Editor
          </h1>
          
          <p style={{ 
            color: '#666', 
            fontSize: '18px',
            marginBottom: '16px' 
          }}>
            Native slash commands integrated directly into BlockNote editor!
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '16px'
          }}>
            <span style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ✅ Real /math command
            </span>
            <span style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ✅ Real /eq command
            </span>
            <span style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ✅ Real /gs command
            </span>
            <span style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ✅ Ctrl+Shift+E
            </span>
          </div>
          
          <div style={{
            backgroundColor: '#ecfdf5',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #10b981',
            fontSize: '14px',
            color: '#065f46'
          }}>
            <strong>💡 Test Instructions:</strong><br/>
            1. Click in the editor below<br/>
            2. Type <kbd>/</kbd> to open the slash menu<br/>
            3. Type <kbd>math</kbd>, <kbd>eq</kbd>, or <kbd>gs</kbd><br/>
            4. Press Enter to insert the math block<br/>
            5. Try <kbd>Ctrl+Shift+E</kbd> for quick insertion
          </div>
        </div>

        {/* 主编辑器区域 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          height: '600px',
          overflow: 'hidden'
        }}>
          <RealSlashMathEditor 
            onChange={(blocks) => {
              console.log('Document changed:', blocks);
            }}
          />
        </div>

        {/* 故障排除信息 */}
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#92400e', marginBottom: '16px' }}>
            🔧 If slash commands don't work:
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#92400e', marginBottom: '8px' }}>Possible Issues:</h4>
              <ul style={{ color: '#92400e', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
                <li>BlockNote API may have changed</li>
                <li>Slash menu extension might need different approach</li>
                <li>Custom block registration could be incomplete</li>
                <li>Editor instance timing issues</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ color: '#92400e', marginBottom: '8px' }}>Alternative Tests:</h4>
              <ul style={{ color: '#92400e', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
                <li>Try <kbd>Ctrl+Shift+E</kbd> shortcut</li>
                <li>Look for math block type in existing menu</li>
                <li>Check browser console for errors</li>
                <li>Test with different BlockNote versions</li>
              </ul>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            backgroundColor: '#fbbf24', 
            borderRadius: '6px' 
          }}>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#92400e' }}>
              🚧 This is an experimental implementation of native slash commands. 
              If it doesn't work perfectly, we may need to explore different BlockNote API approaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}