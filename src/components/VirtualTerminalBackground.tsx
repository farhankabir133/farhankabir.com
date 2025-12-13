import React, { useEffect, useRef, useState } from 'react';

const TERMINAL_COMMANDS = [
  'npm run build',
  'yarn dev',
  'git status',
  'pnpm install',
  'echo "Hello, World!"',
  'ls -la',
  'cat skills.txt',
  'compiling...',
  'build complete!',
  'npm test',
  'exit',
];

const EASTER_EGGS = {
  'hello': '👋 Hi there! You found an easter egg!',
  'sudo': 'Permission denied: You are not root 😅',
  'skills': 'Expert in React, TypeScript, Node.js, and more!'
};

function getRandomCommand() {
  return TERMINAL_COMMANDS[Math.floor(Math.random() * TERMINAL_COMMANDS.length)];
}

const VirtualTerminalWindow: React.FC<{
  style?: React.CSSProperties;
  zIndex?: number;
  userInput?: boolean;
}> = ({ style, zIndex = 1, userInput = false }) => {
  const [lines, setLines] = useState<string[]>([getRandomCommand()]);
  const [input, setInput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 500);
    return () => clearInterval(interval);
  }, []);

  // Simulate terminal output
  useEffect(() => {
    if (!userInput) {
      const interval = setInterval(() => {
        if (Math.random() < 0.2) {
          setIsCompiling(true);
          setLines(l => [...l, 'compiling...']);
          setTimeout(() => {
            setLines(l => [...l, 'build complete!']);
            setIsCompiling(false);
          }, 1200);
        } else {
          setLines(l => [...l, getRandomCommand()]);
        }
        if (lines.length > 8) setLines(l => l.slice(-8));
      }, 2500 + Math.random() * 2000);
      return () => clearInterval(interval);
    }
  }, [userInput, lines.length]);

  // Handle user input for easter eggs
  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = input.trim();
      const lowerVal = val.toLowerCase();
      setLines(l => [
        ...l,
        `> ${val}`,
        Object.prototype.hasOwnProperty.call(EASTER_EGGS, lowerVal)
          ? EASTER_EGGS[lowerVal as keyof typeof EASTER_EGGS]
          : 'command not found'
      ]);
      setInput('');
    }
  };

  // autofocus intentionally disabled to avoid any scroll jumps on mount

  return (
    <div
      className="absolute bg-slate-900/80 dark:bg-black/70 border border-slate-600 dark:border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-fade-in w-80 h-44"
      style={{ ...style, zIndex }}
    >
      <div className="flex items-center px-3 py-1 bg-slate-700 dark:bg-slate-800 border-b border-slate-600 dark:border-slate-700">
        <span className="w-2 h-2 bg-red-500 rounded-full mr-1" />
        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1" />
        <span className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="ml-3 text-xs text-slate-300 dark:text-slate-400">virtual-terminal</span>
      </div>
      <div className="p-3 text-xs font-mono h-[120px] overflow-y-auto">
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={
              line.includes('compiling') || line.includes('build') 
                ? 'text-yellow-400 dark:text-yellow-300 animate-pulse' 
                : i % 2 === 0 
                  ? 'text-white' 
                  : 'text-yellow-400 dark:text-yellow-300'
            }
          >
            {line}
          </div>
        ))}
        {userInput && (
          <div className="flex items-center">
            <span>&gt; </span>
            <input
              ref={inputRef}
              className="bg-transparent outline-none border-none text-white flex-1"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInput}
              maxLength={32}
              spellCheck={false}
              style={{ width: 120 }}
            />
            <span className="ml-1">{cursorVisible ? '|' : ' '}</span>
          </div>
        )}
        {!userInput && (
          <span className="ml-1">{cursorVisible ? '▮' : ' '}</span>
        )}
      </div>
      <div className="px-3 py-1 bg-slate-800 dark:bg-slate-900 text-right text-xs text-slate-300 dark:text-slate-500">
        {isCompiling ? 'Compiling...' : 'Ready'}
      </div>
    </div>
  );
};

const VirtualTerminalBackground: React.FC = () => {
  // Positioned at edges and corners to avoid overlapping central content
  // Top-left, top-right, bottom-left, bottom-right, and side positions
  const positions = [
    { top: '5%', left: '2%', z: 1 },      // Top-left corner
    { top: '8%', right: '3%', z: 2 },     // Top-right corner
    { bottom: '15%', left: '1%', z: 1 },  // Bottom-left
    { bottom: '20%', right: '2%', z: 2 }, // Bottom-right
    { top: '45%', left: '1%', z: 1 },     // Middle-left edge
  ];
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
      {positions.map((pos, i) => (
        <VirtualTerminalWindow
          key={i}
          style={pos}
          zIndex={pos.z}
          userInput={i === 0}
        />
      ))}
    </div>
  );
};

export default VirtualTerminalBackground;
