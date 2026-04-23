import React, { useState, useCallback } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Play, MessageSquare, Trash2 } from 'lucide-react';
import { streamGroq } from '@/lib/streamGroq';
import RailwayBackground from '@/components/three/RailwayBackground';

const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'HTML/CSS', 'Linux Terminal', 'SQL'];

const CodeStation: React.FC = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('Python');
  const [running, setRunning] = useState(false);

  const handleRun = useCallback(async () => {
    if (!code.trim() || running) return;
    setRunning(true);
    setOutput('');
    let acc = '';
    const prompt = `You are a ${language} runtime simulator. Execute the following ${language} code mentally.\nReturn ONLY the terminal output — no markdown, no explanations.\nIf there are errors, show realistic runtime error messages exactly as a real ${language} interpreter would.\nCode:\n\n${code}`;
    try {
      await streamGroq(
        [{ role: 'user', content: prompt }],
        (token) => { acc += token; setOutput(acc); },
        () => setRunning(false)
      );
    } catch {
      setOutput('Error: Failed to simulate code execution.');
      setRunning(false);
    }
  }, [code, language, running]);

  const handleReview = useCallback(async () => {
    if (!code.trim() || running) return;
    setRunning(true);
    setOutput('');
    let acc = '';
    const prompt = `Review this ${language} code concisely. Cover:\n1. What the code does (2 sentences)\n2. Bugs or logical errors\n3. Performance / optimization suggestions\n4. Best practices violations\nBe technical and direct.\n\nCode:\n\n${code}`;
    try {
      await streamGroq(
        [{ role: 'user', content: prompt }],
        (token) => { acc += token; setOutput(acc); },
        () => setRunning(false)
      );
    } catch {
      setOutput('Error: Failed to review code.');
      setRunning(false);
    }
  }, [code, language, running]);

  return (
    <div className="flex h-screen bg-background relative">
      <RailwayBackground />
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
          <h1 className="text-lg font-heading font-bold text-foreground">Code Station</h1>
          <span className="px-2 py-0.5 text-[10px] font-station rounded bg-station-gold/20 text-station-gold">BETA</span>
          <div className="ml-auto flex items-center gap-2">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border bg-input text-foreground text-xs focus:outline-none">
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 flex divide-x divide-border overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/30">
              <span className="text-xs font-station text-muted-foreground">EDITOR</span>
              <div className="ml-auto flex gap-2">
                <button onClick={handleRun} disabled={running} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/90 disabled:opacity-50">
                  <Play size={12} /> Run
                </button>
                <button onClick={handleReview} disabled={running} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50">
                  <MessageSquare size={12} /> AI Review
                </button>
                <button onClick={() => { setCode(''); setOutput(''); }} className="flex items-center gap-1 px-3 py-1 rounded-lg border border-border text-muted-foreground text-xs hover:text-foreground">
                  <Trash2 size={12} /> Clear
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Enter your ${language} code here...`}
              spellCheck={false}
              className="flex-1 w-full resize-none p-4 font-mono text-sm bg-background text-foreground focus:outline-none scrollbar-thin"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex items-center px-4 py-2 border-b border-border bg-card/30">
              <span className="text-xs font-station text-muted-foreground">TERMINAL OUTPUT</span>
              {running && <span className="ml-2 text-xs text-accent animate-pulse">Running...</span>}
            </div>
            <div className="flex-1 p-4 overflow-y-auto scrollbar-thin" style={{ backgroundColor: '#0D0D0D' }}>
              <pre className="font-mono text-sm whitespace-pre-wrap" style={{ color: '#00FF88' }}>
                {output || 'Output will appear here...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeStation;