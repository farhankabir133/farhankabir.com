import React, { useEffect, useRef } from "react";

// Utility to generate random positions for nodes
function randomNodes(count: number, width: number, height: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    pulse: false,
  }));
}

const NODE_COUNT = 18;
const CONNECTIONS_PER_NODE = 3;
const WIDTH = 800;
const HEIGHT = 400;

const NeuralMeshBackground: React.FC<{ initials?: string }> = ({ initials }) => {
  const [nodes, setNodes] = React.useState(() => randomNodes(NODE_COUNT, WIDTH, HEIGHT));
  const [packets, setPackets] = React.useState<any[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate random connections
  const connections = React.useMemo(() => {
    const conns: { from: number; to: number }[] = [];
    nodes.forEach((node, i) => {
      const targets = new Set<number>();
      while (targets.size < CONNECTIONS_PER_NODE) {
        const t = Math.floor(Math.random() * NODE_COUNT);
        if (t !== i) targets.add(t);
      }
      targets.forEach((to) => conns.push({ from: i, to }));
    });
    return conns;
  }, [nodes]);

  // Animate packets (AI "thoughts")
  useEffect(() => {
    const interval = setInterval(() => {
      setPackets((prev) => {
        // Move existing packets
        const moved = prev
          .map((p) => ({ ...p, t: p.t + 0.03 }))
          .filter((p) => p.t < 1);
        // Occasionally add a new packet
        if (Math.random() < 0.25 && connections.length > 0) {
          const c = connections[Math.floor(Math.random() * connections.length)];
          moved.push({ ...c, t: 0 });
        }
        return moved;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [connections]);

  // Pulse nodes on scroll/click
  useEffect(() => {
    const pulse = () => {
      setNodes((nodes) =>
        nodes.map((n) => ({ ...n, pulse: Math.random() < 0.4 }))
      );
      setTimeout(() => {
        setNodes((nodes) => nodes.map((n) => ({ ...n, pulse: false })));
      }, 400);
    };
    window.addEventListener("scroll", pulse);
    window.addEventListener("click", pulse);
    return () => {
      window.removeEventListener("scroll", pulse);
      window.removeEventListener("click", pulse);
    };
  }, []);

  // Morph mesh to form initials or icon on load (simple morph to center for demo)
  useEffect(() => {
    setTimeout(() => {
      setNodes((nodes) =>
        nodes.map((n, i) =>
          i < 2 && initials
            ? { ...n, x: WIDTH / 2 + (i === 0 ? -30 : 30), y: HEIGHT / 2 }
            : n
        )
      );
    }, 1200);
  }, [initials]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {/* Connections (synapses) */}
      {connections.map((c, i) => {
        const from = nodes[c.from];
        const to = nodes[c.to];
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#00fff7"
            strokeWidth={1.5}
            opacity={0.18}
            className="neural-conn"
          />
        );
      })}
      {/* Data packets (AI thoughts) */}
      {packets.map((p, i) => {
        const from = nodes[p.from];
        const to = nodes[p.to];
        const x = from.x + (to.x - from.x) * p.t;
        const y = from.y + (to.y - from.y) * p.t;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={4}
            fill="#00fff7"
            opacity={0.7}
            filter="url(#glow)"
          />
        );
      })}
      {/* Nodes */}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.pulse ? 13 : 8}
          fill="#00fff7"
          opacity={n.pulse ? 0.7 : 0.4}
          filter="url(#glow)"
        />
      ))}
      {/* Glow filter */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Optionally, morph mesh to form initials or icon (simple demo above) */}
    </svg>
  );
};

export default NeuralMeshBackground;
