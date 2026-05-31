import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Trophy, Flame } from 'lucide-react';

interface CountUpProp {
  end: number;
  suffix?: string;
  duration?: number;
}

const CountUp: React.FC<CountUpProp> = ({ end, suffix = '', duration = 1.5 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endVal = end;
    const totalFrames = Math.round(duration * 60);
    const increment = endVal / totalFrames;
    let frame = 0;

    const counter = () => {
      frame++;
      start += increment;
      if (frame >= totalFrames) {
        setCount(endVal);
      } else {
        setCount(Math.floor(start));
        requestAnimationFrame(counter);
      }
    };

    // Simple intersection observer triggers it or trigger directly
    const timer = setTimeout(() => {
      requestAnimationFrame(counter);
    }, 200);

    return () => clearTimeout(timer);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

export const Achievements: React.FC = () => {
  const highlightMetrics = [
    { value: 5, label: 'Hackathon Victories', suffix: '+', icon: <Trophy className="text-purple-accent" size={24} /> },
    { value: 500, label: 'LeetCode Solved', suffix: '+', icon: <CodeIcon className="text-blue-accent" /> },
    { value: 1500, label: 'GitHub Contributions', suffix: '+', icon: <Flame className="text-pink-accent" size={24} /> },
    { value: 2, label: 'Research Papers', suffix: '', icon: <Zap className="text-purple-accent" size={24} /> },
  ];

  const trophies = [
    {
      title: 'First Place - AI Hackathon',
      subtitle: 'Smart City Predictor',
      description: 'Awarded first place among 60 teams for developing an automated machine learning grid dispatcher.',
    },
    {
      title: 'Outstanding Student Researcher',
      subtitle: 'CSE Division Accolade',
      description: 'Honored by faculty board for publishing computer vision systems research and code bases.',
    },
    {
      title: 'Top 3% Global Hackers',
      subtitle: 'LeetCode Rating & Challenges',
      description: 'Maintained a top rank on competitive coding tracks by resolving algorithmic scenarios efficiently.',
    },
  ];

  return (
    <section
      id="achievements"
      className="relative w-full bg-bg-dark text-white px-6 pt-16 pb-20 lg:pt-20 lg:pb-24 overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-purple-accent font-heading text-xs font-semibold uppercase tracking-widest block mb-3">
            05 / ACCOLADES
          </span>
          <h2 className="section-heading">Achievements</h2>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {highlightMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col justify-center items-center text-center relative group"
            >
              <div className="p-3 bg-white/5 rounded-2xl mb-4 border border-white/10 group-hover:scale-110 transition-transform">
                {metric.icon}
              </div>
              <h3 className="text-4xl sm:text-5xl font-extrabold font-heading text-white">
                <CountUp end={metric.value} suffix={metric.suffix} />
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-2 font-medium">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Trophy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trophies.map((trophy, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-purple-accent/30 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-accent/5 rounded-full filter blur-xl group-hover:bg-purple-accent/10 transition-all" />
              
              <div className="w-10 h-10 rounded-xl bg-purple-accent/10 border border-purple-accent/25 flex items-center justify-center text-purple-accent">
                <Award size={20} />
              </div>

              <div>
                <h4 className="text-lg font-bold font-heading text-white group-hover:text-purple-accent transition-colors">
                  {trophy.title}
                </h4>
                <span className="text-xs font-semibold text-gray-500 block mt-0.5 uppercase tracking-wider">
                  {trophy.subtitle}
                </span>
                <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                  {trophy.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Simple helper icon
const CodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export default Achievements;
