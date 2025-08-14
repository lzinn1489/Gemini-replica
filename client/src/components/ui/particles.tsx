import React, { useCallback, useMemo } from 'react';

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
}

export default function Particles({
  className = '',
  quantity = 100,
  staticity = 50,
  ease = 50,
  refresh = false
}: ParticlesProps) {
  const particles = useMemo(() => {
    const particlesArray = [];
    for (let i = 0; i < quantity; i++) {
      particlesArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
      });
    }
    return particlesArray;
  }, [quantity, refresh]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg className="absolute inset-0 w-full h-full">
        {particles.map((particle) => (
          <circle
            key={particle.id}
            cx={`${particle.x}%`}
            cy={`${particle.y}%`}
            r={particle.size}
            fill="hsl(var(--primary))"
            opacity={particle.opacity}
            className="animate-float"
            style={{
              animationDelay: `${particle.id * 50}ms`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}