"use client";

import { CorrectedSlashMathEditor } from "../../components/CorrectedSlashMathEditor";

export default function CorrectedSlashPage() {
  const handleEditorChange = (blocks: any[]) => {
    console.log('Editor content updated:', blocks);
  };

  return (
    <main style={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column",
      backgroundColor: "#f8fafc"
    }}>
      <div style={{ 
        padding: '20px',
        backgroundColor: '#1e40af',
        color: 'white',
        borderBottom: '3px solid #3b82f6'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          🔄 Phase 4 修正版 - 正确的斜杠命令实现
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '16px', opacity: 0.9 }}>
          基于用户反馈修正：斜杠命令应该启动编辑模式，而不是插入具体内容
        </p>
      </div>

      <div style={{ 
        flex: 1,
        padding: '20px',
        display: 'flex',
        gap: '20px'
      }}>
        {/* 左侧：编辑器 */}
        <div style={{ 
          flex: 2,
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <CorrectedSlashMathEditor onChange={handleEditorChange} />
        </div>

        {/* 右侧：说明和对比 */}
        <div style={{ 
          flex: 1,
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          height: 'fit-content'
        }}>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            color: '#1f2937',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            🎯 修正说明
          </h2>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              color: '#dc2626', 
              fontSize: '16px',
              margin: '0 0 12px 0',
              fontWeight: 'bold'
            }}>
              ❌ 之前的错误实现：
            </h3>
            <div style={{ 
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              • /math → 直接插入预设的积分公式<br/>
              • /eq → 直接插入 E=mc² 公式<br/>
              • /gs → 直接插入黄金比例公式<br/>
              <br/>
              <strong>问题：</strong> 用户无法自定义公式内容
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              color: '#059669', 
              fontSize: '16px',
              margin: '0 0 12px 0',
              fontWeight: 'bold'
            }}>
              ✅ 修正后的正确实现：
            </h3>
            <div style={{ 
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              • /math + Enter → 弹出数学块输入对话框<br/>
              • /eq + Enter → 弹出行内公式输入对话框<br/>
              • /gs + Enter → 弹出行内公式输入对话框<br/>
              <br/>
              <strong>优势：</strong> 用户可以自由输入任何 LaTeX 公式
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              color: '#1f2937', 
              fontSize: '16px',
              margin: '0 0 12px 0',
              fontWeight: 'bold'
            }}>
              🚀 使用方法：
            </h3>
            <div style={{ 
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              1. 在编辑器中输入 <code>/math</code><br/>
              2. 按 Enter 键确认<br/>
              3. 在弹出的对话框中输入 LaTeX 公式<br/>
              4. 点击"创建公式块"或按 Enter 确认<br/>
              <br/>
              同样适用于 <code>/eq</code> 和 <code>/gs</code>
            </div>
          </div>

          <div>
            <h3 style={{ 
              color: '#7c3aed', 
              fontSize: '16px',
              margin: '0 0 12px 0',
              fontWeight: 'bold'
            }}>
              💡 技术实现亮点：
            </h3>
            <div style={{ 
              backgroundColor: '#faf5ff',
              border: '1px solid #d8b4fe',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              • 事件监听检测斜杠命令<br/>
              • 模态对话框提供直观输入界面<br/>
              • 实时预览确保公式正确性<br/>
              • 继承所有 Phase 1-3 功能<br/>
              • 支持键盘快捷键操作
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}