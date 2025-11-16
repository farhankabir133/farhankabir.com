import React from "react";


const CircuitBackground: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    viewBox="0 0 800 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    {/* Main circuit grid */}
    <g>
      {/* Horizontal traces */}
      <polyline points="60,60 740,60" className="circuit-trace" />
      <polyline points="60,340 740,340" className="circuit-trace" />
      <polyline points="60,200 740,200" className="circuit-trace" />
      {/* Vertical traces */}
      <polyline points="100,40 100,360" className="circuit-trace" />
      <polyline points="400,40 400,360" className="circuit-trace" />
      <polyline points="700,40 700,360" className="circuit-trace" />
      {/* Diagonal and custom traces */}
      <polyline points="100,60 400,200 700,340" className="circuit-trace pulse" />
      <polyline points="700,60 400,200 100,340" className="circuit-trace pulse" />
      {/* Nodes (connection points) */}
      <circle cx="100" cy="60" r="7" className="circuit-node" />
      <circle cx="400" cy="200" r="10" className="circuit-node pulse" />
      <circle cx="700" cy="340" r="7" className="circuit-node" />
      <circle cx="700" cy="60" r="7" className="circuit-node" />
      <circle cx="100" cy="340" r="7" className="circuit-node" />
      {/* Microchip-like rectangles */}
      <rect x="370" y="170" width="60" height="60" rx="10" className="chip" />
      <rect x="80" y="320" width="40" height="20" rx="4" className="chip-small" />
      <rect x="680" y="40" width="30" height="20" rx="4" className="chip-small" />
    </g>
    <style>{`
      .circuit-trace {
        stroke: #00fff7;
        stroke-width: 2.5;
        opacity: 0.18;
        filter: drop-shadow(0 0 8px #00fff7);
        stroke-dasharray: 24 12;
        stroke-dashoffset: 0;
        animation: circuit-flow 6s linear infinite;
      }
      .circuit-trace.pulse {
        opacity: 0.35;
        stroke-width: 3.5;
        animation: circuit-flow 3s linear infinite, circuit-pulse 2s ease-in-out infinite alternate;
      }
      .circuit-node {
        fill: #00fff7;
        opacity: 0.7;
        filter: drop-shadow(0 0 12px #00fff7) drop-shadow(0 0 24px #00fff7);
        animation: node-glow 2.5s ease-in-out infinite alternate;
      }
      .circuit-node.pulse {
        opacity: 1;
        animation: node-glow 1.2s ease-in-out infinite alternate, node-pulse 1.5s linear infinite;
      }
      .chip {
        fill: #0f172a;
        stroke: #00fff7;
        stroke-width: 2.5;
        opacity: 0.7;
        filter: drop-shadow(0 0 16px #00fff7);
      }
      .chip-small {
        fill: #1e293b;
        stroke: #00fff7;
        stroke-width: 1.5;
        opacity: 0.5;
        filter: drop-shadow(0 0 8px #00fff7);
      }
      @keyframes circuit-flow {
        to {
          stroke-dashoffset: -72;
        }
      }
      @keyframes circuit-pulse {
        0% { opacity: 0.35; }
        100% { opacity: 0.7; }
      }
      @keyframes node-glow {
        0% { filter: drop-shadow(0 0 12px #00fff7) drop-shadow(0 0 24px #00fff7); }
        100% { filter: drop-shadow(0 0 32px #00fff7) drop-shadow(0 0 48px #00fff7); }
      }
      @keyframes node-pulse {
        0% { r: 10; }
        100% { r: 14; }
      }
    `}</style>
  </svg>
);

export default CircuitBackground;
