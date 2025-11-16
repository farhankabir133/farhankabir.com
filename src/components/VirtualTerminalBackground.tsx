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
      className="absolute bg-black bg-opacity-70 border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-fade-in w-80 h-44"
      style={{ ...style, zIndex }}
    >
      <div className="flex items-center px-3 py-1 bg-slate-800 border-b border-slate-700">
        <span className="w-2 h-2 bg-red-500 rounded-full mr-1" />
        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1" />
        <span className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="ml-3 text-xs text-slate-400">virtual-terminal</span>
      </div>
      <div className="p-3 text-xs font-mono text-green-400 h-[120px] overflow-y-auto">
        {lines.map((line, i) => (
          <div key={i} className={line.includes('compiling') ? 'text-yellow-400 animate-pulse' : ''}>
            {line}
          </div>
        ))}
        {userInput && (
          <div className="flex items-center">
            <span>&gt; </span>
            <input
              ref={inputRef}
              className="bg-transparent outline-none border-none text-green-400 flex-1"
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
      <div className="px-3 py-1 bg-slate-900 text-right text-xs text-slate-500">
        {isCompiling ? 'Compiling...' : 'Ready'}
      </div>
    </div>
  );
};

const VirtualTerminalBackground: React.FC = () => {
  // More random positions for additional terminals
  const positions = [
    { top: 10, left: 30, z: 1 },
    { top: 90, left: 220, z: 2 },
    { top: 160, left: 100, z: 3 },
    { top: 60, left: 400, z: 2 },
    { top: 120, left: 350, z: 1 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0">
      {positions.map((pos, i) => (
        <VirtualTerminalWindow
          key={i}
          style={{ top: pos.top, left: pos.left }}
          zIndex={pos.z}
          userInput={i === 0}
        />
      ))}
    </div>
  );
};

export default VirtualTerminalBackground;
