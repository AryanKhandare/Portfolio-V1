import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Award, BookOpen, Brain, Code, FileText } from 'lucide-react';
import BackgroundRibbon from '../components/BackgroundRibbon';
import { TimelineCard } from '../components/TimelineCard';

gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  id: number;
  type: 'edu' | 'exp' | 'ach';
  icon: React.ReactNode;
  date: string;
  title: string;
  subtitle: string;
  details: string[];
}

export const Experience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const timelineData: TimelineItem[] = [
    {
      id: 1,
      type: 'edu',
      icon: <Brain className="text-blue-accent" size={18} />,
      date: '2024 - PRESENT',
      title: 'CSE AI & ML Specialization',
      subtitle: 'Advanced Degree in Machine Learning Systems',
      details: [
        'Intensive research in Deep Learning architectures, Transformers, NLP, and Computer Vision.',
        'Developing and optimizing custom LLM fine-tuning pipelines and RAG database architectures.',
      ],
    },
    {
      id: 2,
      type: 'edu',
      icon: <BookOpen className="text-purple-accent" size={18} />,
      date: '2021 - 2024',
      title: 'Diploma in Computer Science & Engineering',
      subtitle: 'Core Foundation Engineering',
      details: [
        'Graduated with honors, focusing on Data Structures, Algorithms, OOP, Database Systems, and Operating Systems.',
        'Completed major project involving automated multi-thread tracking applications.',
      ],
    },
    {
      id: 3,
      type: 'ach',
      icon: <Award className="text-pink-accent" size={18} />,
      date: '2025',
      title: 'National & Regional Hackathons',
      subtitle: 'Rapid Prototype Engineering & AI Solutions',
      details: [
        'Won 1st Place in Local AI Innovation Challenge by building a working Computer Vision assistant in 36 hours.',
        'Spearheaded full-stack implementation and model deployments in multiple regional hackathons.',
      ],
    },
    {
      id: 4,
      type: 'exp',
      icon: <FileText className="text-blue-accent" size={18} />,
      date: '2025',
      title: 'Research Paper Presentations',
      subtitle: 'Deepfake & AI Pattern Classifiers Research',
      details: [
        'Published/presented work exploring automated classifier models and high-throughput vector storage databases.',
        'Collaborated on optimization paradigms for deploying complex neural nets onto edge devices.',
      ],
    },
    {
      id: 5,
      type: 'ach',
      icon: <Code className="text-purple-accent" size={18} />,
      date: 'CONTINUOUS',
      title: 'Professional Certifications',
      subtitle: 'Advanced AI & Full-Stack Credentials',
      details: [
        'TensorFlow Developer Certification, DeepLearning.AI Specializations.',
        'Completed production-grade backend, cloud deployments, and web security credentials.',
      ],
    },
  ];

  const getTheme = (id: number): 'purple' | 'cyan' | 'pink' => {
    if (id === 1) return 'cyan';
    if (id === 2) return 'purple';
    if (id === 3) return 'pink';
    if (id === 4) return 'cyan';
    return 'purple';
  };

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const rows = container.querySelectorAll('.timeline-row');
    const activeLine = container.querySelector('.active-line');
    const beamTip = container.querySelector('.beam-tip');

    if (!activeLine || !beamTip) return;

    // Refresh ScrollTrigger to capture correct layout offsets
    ScrollTrigger.refresh();

    // Coordinated scroll-driven timeline using GSAP ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 72%", // Starts drawing as container top enters 72% of viewport
        end: "bottom 78%", // Completes as container bottom reaches 78% of viewport
        scrub: 0.6,        // Smooth scrolling connection
      }
    });

    // 1. Initial State Setup (All cards hidden, line at 0 height)
    gsap.set(activeLine, { height: '0%' });
    gsap.set(beamTip, { top: '0%', opacity: 0 });

    rows.forEach((row) => {
      const dot = row.querySelector('.timeline-dot');
      const inner = row.querySelector('.dot-inner');
      const card = row.querySelector('.timeline-card');
      const date = row.querySelector('.timeline-date');

      gsap.set(dot, { 
        scale: 0.8, 
        borderColor: 'rgba(255, 255, 255, 0.1)', 
        boxShadow: 'none' 
      });
      gsap.set(inner, { 
        backgroundColor: 'rgba(255, 255, 255, 0.2)' 
      });
      const isMobileDevice = window.innerWidth < 768;
      gsap.set(card, { 
        opacity: 0, 
        x: isMobileDevice ? 30 : (row.classList.contains('even-row') ? 50 : -50), 
        scale: 0.94 
      });
      gsap.set(date, { 
        opacity: 0, 
        scale: 0.85 
      });
    });

    // 2. Sequential Animation of Segments
    const containerRect = container.getBoundingClientRect();
    const totalHeight = container.offsetHeight;

    rows.forEach((row, index) => {
      const dot = row.querySelector('.timeline-dot') as HTMLElement;
      const inner = row.querySelector('.dot-inner');
      const card = row.querySelector('.timeline-card');
      const date = row.querySelector('.timeline-date');

      if (!dot) return;

      // Calculate exact center position of the dot relative to container
      const dotRect = dot.getBoundingClientRect();
      const dotCenterY = dotRect.top + (dotRect.height / 2) - containerRect.top;
      // Convert to responsive percentage height
      const percentage = Math.min(100, Math.max(0, (dotCenterY / totalHeight) * 100));

      // Segment A: Draw the line and position the beam tip exactly to this dot
      tl.to(activeLine, {
        height: `${percentage}%`,
        duration: 1.2,
        ease: "none"
      }, index === 0 ? 0 : ">");

      tl.to(beamTip, {
        top: `${percentage}%`,
        opacity: 1,
        duration: 1.2,
        ease: "none"
      }, "<");

      // Segment B: Activate the node and reveal the card elements
      const theme = getTheme(itemThemeId(index));
      const colorHex = theme === 'cyan' 
        ? '#06b6d4' 
        : theme === 'purple' 
          ? '#a855f7' 
          : '#ec4899';

      // Dot lights up and glows
      tl.to(dot, {
        scale: 1.15,
        borderColor: colorHex,
        boxShadow: `0 0 15px ${colorHex}`,
        duration: 0.2,
        ease: "power2.out"
      }, ">");

      if (inner) {
        tl.to(inner, {
          backgroundColor: '#ffffff',
          duration: 0.2
        }, "<");
      }

      // Card fades and slides in exactly as the line meets the dot
      tl.to(card, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.4,
        ease: "power3.out"
      }, "<");

      // Date indicator appears
      tl.to(date, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power3.out"
      }, "<");
    });

    // Segment C: Animate active line and beam tip to the bottom of the container
    tl.to(activeLine, {
      height: '100%',
      duration: 0.6,
      ease: "none"
    }, ">");

    tl.to(beamTip, {
      top: '100%',
      opacity: 0, // fade out beam at the bottom
      duration: 0.6,
      ease: "none"
    }, "<");

  }, { scope: containerRef });

  // Helper function to resolve item theme ID safely
  const itemThemeId = (index: number) => {
    return timelineData[index]?.id || 1;
  };

  return (
    <section
      id="experience"
      className="relative w-full bg-bg-dark text-white px-6 pt-16 pb-20 lg:pt-20 lg:pb-24 overflow-hidden border-t border-white/5"
    >
      <style>{`
        @keyframes beamPulse {
          0%, 100% {
            filter: drop-shadow(0 0 4px var(--color-blue-accent)) drop-shadow(0 0 8px var(--color-purple-accent));
            opacity: 0.85;
          }
          50% {
            filter: drop-shadow(0 0 12px var(--color-blue-accent)) drop-shadow(0 0 20px var(--color-purple-accent)) drop-shadow(0 0 10px var(--color-pink-accent));
            opacity: 1;
          }
        }
        .active-line-pulse {
          animation: beamPulse 1.8s infinite ease-in-out;
        }
      `}</style>

      {/* Interactive Background Ribbon */}
      <BackgroundRibbon pathType="experience" />

      <div className="glow-blob w-[450px] h-[450px] bg-purple-accent/5 top-0 right-0" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-purple-accent font-heading text-xs font-semibold uppercase tracking-widest block mb-3">
            04 / TIMELINE
          </span>
          <h2 className="section-heading">Experience</h2>
        </div>

        {/* Timeline Layout */}
        <div ref={containerRef} className="relative min-h-[400px]">
          {/* Background Track Line */}
          <div className="absolute left-[10px] md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/5" />

          {/* Active Drawing Line */}
          <div className="active-line active-line-pulse absolute left-[10px] md:left-1/2 -translate-x-1/2 top-0 w-[2px] bg-gradient-to-b from-blue-accent via-purple-accent to-pink-accent z-10 origin-top" />

          {/* Beam Glowing Tip */}
          <div className="beam-tip absolute left-[10px] md:left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 z-20 pointer-events-none flex items-center justify-center">
            {/* Blinking energy core */}
            <div className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_15px_#ffffff,0_0_30px_#a855f7,0_0_45px_#06b6d4] animate-pulse" />
            {/* Outer blinking ring */}
            <div className="absolute w-6 h-6 rounded-full border border-purple-accent/60 animate-ping opacity-75" />
            <div className="absolute w-8 h-8 rounded-full border border-blue-accent/30 animate-pulse opacity-40" />
          </div>

          {/* Timeline Nodes */}
          <div className="flex flex-col gap-12">
            {timelineData.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const theme = getTheme(item.id);
              
              // Colors matching the design tokens
              const colorHex = theme === 'cyan' 
                ? 'var(--color-blue-accent)' 
                : theme === 'purple' 
                  ? 'var(--color-purple-accent)' 
                  : 'var(--color-pink-accent)';

              return (
                <div
                  key={item.id}
                  className={`timeline-row flex flex-col md:flex-row items-start relative ${
                    isEven ? 'md:flex-row-reverse even-row' : 'odd-row'
                  }`}
                >
                  {/* Timeline Dot Indicator */}
                  <div
                    className="timeline-dot absolute left-[10px] md:left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-bg-dark border-[3px] z-20 flex items-center justify-center"
                  >
                    <div className="dot-inner w-1.5 h-1.5 rounded-full" />
                  </div>

                  {/* Date Indicator (Mobile: above card, Desktop: opposite card) */}
                  <div className={`md:w-1/2 flex mb-2 md:mb-0 px-10 ${
                    isEven ? 'md:justify-start' : 'md:justify-end'
                  }`}>
                    <span
                      className="timeline-date text-xs font-bold font-heading tracking-widest px-3.5 py-1 rounded-full border select-none"
                      style={{
                        color: colorHex,
                        backgroundColor: `${colorHex}15`,
                        borderColor: `${colorHex}25`,
                      }}
                    >
                      {item.date}
                    </span>
                  </div>

                  {/* Experience Card */}
                  <div
                    className="timeline-card md:w-1/2 pl-10 pr-4 md:pl-0 md:px-10 w-full"
                  >
                    <TimelineCard
                      icon={item.icon}
                      title={item.title}
                      subtitle={item.subtitle}
                      details={item.details}
                      colorTheme={theme}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
