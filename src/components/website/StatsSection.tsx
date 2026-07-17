'use client';

import { useEffect, useState } from 'react';
import { useScrollAnimation } from './useScrollAnimation';

const stats = [
  { value: 10, suffix: '+', label: 'Business Modules' },
  { value: 50, suffix: '+', label: 'API Endpoints' },
  { value: 99.9, suffix: '%', label: 'Uptime SLA' },
  { value: 24, suffix: '/7', label: 'Support Available' },
];

function AnimatedCounter({
  value,
  suffix,
  isVisible,
}: {
  value: number;
  suffix: string;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const totalSteps = 60;
    const stepDuration = duration / totalSteps;
    const increment = value / totalSteps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCount(Math.min(value, increment * step));
      if (step >= totalSteps) {
        clearInterval(timer);
        setCount(value);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  const display = Number.isInteger(value)
    ? Math.round(count)
    : count.toFixed(1);

  return (
    <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
      {display}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const { ref, isVisible } = useScrollAnimation(0.3);

  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/30 via-slate-950 to-violet-950/30" />
      <div className="absolute inset-0 border-y border-white/5" />

      <div
        ref={ref}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
              }}
            >
              <div className="text-4xl sm:text-5xl font-bold mb-2">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
              </div>
              <p className="text-sm text-slate-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
