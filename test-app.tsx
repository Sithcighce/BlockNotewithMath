import React from 'react';
import { NotesSidebar } from './agent-handoff/NotesSidebar';

function App() {
  const handleChange = (blocks: any[]) => {
    console.log('Content changed:', blocks);
  };

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <h1>BlockNote Math Extension Test</h1>
      <div style={{ height: '500px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <NotesSidebar onChange={handleChange} />
      </div>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>📝 测试说明：</h3>
        <ul>
          <li>输入 <code>/math</code> 并按回车，应该插入数学公式块</li>
          <li>输入 <code>/eq</code> 并按回车，应该插入数学公式块</li>
          <li>输入 <code>/gs</code> 并按回车，应该插入数学公式块</li>
          <li>在数学块中输入 LaTeX 公式，如：<code>\frac{'{1}{2}'}</code></li>
        </ul>
      </div>
    </div>
  );
}

export default App;