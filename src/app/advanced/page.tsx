"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const AdvancedMathEditor = dynamic(
  () => import('../../components/AdvancedMathEditor').then(mod => mod.AdvancedMathEditor),
  { 
    ssr: false,
    loading: () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading advanced math editor...</div>
  }
);

export default function AdvancedDemoPage() {
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
          🚀 Advanced Math Editor - All Features!
        </h1>
        
        <p style={{ 
          color: '#666', 
          fontSize: '18px',
          marginBottom: '30px' 
        }}>
          Complete math extension with keyboard shortcuts, dialogs, and enhanced UI!
        </p>

        {/* 主编辑器区域 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          height: '650px',
          overflow: 'hidden'
        }}>
          <AdvancedMathEditor 
            onChange={(blocks) => {
              console.log('Document changed:', blocks);
            }}
          />
        </div>

        {/* 功能说明 */}
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '12px',
          padding: '24px',
          marginTop: '30px'
        }}>
          <h3 style={{ color: '#155724', marginBottom: '20px', fontSize: '24px' }}>
            🎉 All Features Implemented!
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            <div>
              <h4 style={{ color: '#155724', marginBottom: '12px' }}>✅ Core Features:</h4>
              <ul style={{ color: '#155724', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
                <li>Math blocks render perfectly</li>
                <li>KaTeX integration & error handling</li>
                <li>Click to edit LaTeX formulas</li>
                <li>Custom BlockNote schema</li>
                <li>SSR compatible</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ color: '#155724', marginBottom: '12px' }}>🎯 Enhanced Features:</h4>
              <ul style={{ color: '#155724', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
                <li>Math command buttons (/math, /eq, /gs)</li>
                <li>Quick formula insertion toolbar</li>
                <li>Professional math input dialog</li>
                <li>Real-time LaTeX preview</li>
                <li>Help system & guidance</li>
              </ul>
            </div>
            
            <div>  
              <h4 style={{ color: '#155724', marginBottom: '12px' }}>⌨️ Keyboard Features:</h4>
              <ul style={{ color: '#155724', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
                <li><kbd>Ctrl+Shift+E</kbd> opens math dialog</li>
                <li><kbd>Ctrl+Enter</kbd> in dialog to insert</li>
                <li><kbd>Esc</kbd> to cancel/close</li>
                <li>Global keyboard shortcut support</li>
                <li>Focus management</li>
              </ul>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '24px', 
            padding: '16px', 
            backgroundColor: '#c3e6cb', 
            borderRadius: '8px' 
          }}>
            <h4 style={{ color: '#155724', marginBottom: '12px' }}>🧪 Try These Features:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong>Command Buttons:</strong><br/>
                <small>Click any button in the toolbar to insert formulas</small>
              </div>
              <div>
                <strong>Keyboard Shortcut:</strong><br/>
                <small>Press <kbd>Ctrl+Shift+E</kbd> anywhere to open math dialog</small>
              </div>
              <div>
                <strong>Formula Editing:</strong><br/>
                <small>Click any existing formula to edit its LaTeX code</small>
              </div>
              <div>
                <strong>Help System:</strong><br/>
                <small>Click "Show Help" to see all available features</small>
              </div>
            </div>
          </div>
        </div>

        {/* 下一步指引 */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '12px',
          padding: '24px',
          marginTop: '30px'
        }}>
          <h3 style={{ color: '#856404', marginBottom: '16px' }}>
            🚧 Coming Next: Full Slash Commands & Inline Math
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#856404', marginBottom: '12px' }}>🔄 In Development:</h4>
              <ul style={{ color: '#856404', lineHeight: '1.6' }}>
                <li>Native BlockNote slash command integration</li>
                <li>Inline math parsing for $$formula$$</li>
                <li>Formatting toolbar √x button</li>
                <li>Advanced formula templates</li>
                <li>Math library with common formulas</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ color: '#856404', marginBottom: '12px' }}>📦 Ready for Production:</h4>
              <ul style={{ color: '#856404', lineHeight: '1.6' }}>
                <li>NPM package publication</li>
                <li>TypeScript definitions</li>
                <li>Documentation website</li>
                <li>Example projects</li>
                <li>Community adoption</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}