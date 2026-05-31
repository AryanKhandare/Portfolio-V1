import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ProjectTransitionPreloaderProps {
  projectName: string;
  direction: 'enter' | 'exit';
  onTransitionHalfway: () => void;
  onTransitionComplete: () => void;
}

export const ProjectTransitionPreloader: React.FC<ProjectTransitionPreloaderProps> = ({
  projectName,
  direction,
  onTransitionHalfway,
  onTransitionComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLDivElement>(null);

  // Store latest callbacks in refs to avoid stale closures inside GSAP timelines
  const halfwayRef = useRef(onTransitionHalfway);
  const completeRef = useRef(onTransitionComplete);
  halfwayRef.current = onTransitionHalfway;
  completeRef.current = onTransitionComplete;

  useEffect(() => {
    if (!containerRef.current) return;

    const lenis = (window as any).lenis;
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';

    const container = containerRef.current;
    const letters = textRef.current?.querySelectorAll('.letter');

    // Phase 1 — Enter timeline
    const enterTl = gsap.timeline({
      onComplete: () => {
        // Fire halfway callback (swap underlying content)
        halfwayRef.current();

        // Phase 2 — Exit timeline (separate from enter context)
        const exitTl = gsap.timeline({
          onComplete: () => {
            completeRef.current();
          },
        });

        exitTl
          .to(container, {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            duration: 0.85,
            ease: 'power4.inOut',
          })
          .to(
            container,
            {
              opacity: 0,
              filter: 'blur(30px)',
              scale: 1.05,
              duration: 0.7,
              ease: 'power3.inOut',
            },
            '-=0.7'
          );
      },
    });

    // Initial state (fully clipped – invisible)
    enterTl.set(container, {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    });

    // Expand curtain to fill viewport
    enterTl.to(container, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 0.85,
      ease: 'power4.inOut',
    });

    // Stagger in the title letters
    if (letters && letters.length > 0) {
      enterTl.fromTo(
        letters,
        { y: 60, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: 0.03,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      );
    }

    // Numeric percentage counter
    const progressObj = { value: 0 };
    enterTl.to(
      progressObj,
      {
        value: 100,
        duration: 1.0,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (progressTextRef.current) {
            progressTextRef.current.innerText = `${Math.floor(progressObj.value)}%`;
          }
        },
      },
      '-=0.3'
    );

    // Progress bar fill (runs in parallel with the counter)
    enterTl.to(
      progressBarRef.current,
      {
        width: '100%',
        duration: 1.0,
        ease: 'power2.inOut',
      },
      '<' // same start time as previous tween
    );

    // Small hold before exit
    enterTl.to({}, { duration: 0.25 });

    return () => {
      enterTl.kill();
    };
  }, [projectName]);

  const displayText = direction === 'exit' ? 'Back to Projects' : `Opening ${projectName}`;
  const subtitleText = direction === 'exit'
    ? 'Returning to project showcase. Please wait...'
    : 'Initializing luxury product environment. Please wait...';
  const words = displayText.split(' ');

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-[#030303] z-[9999] flex flex-col justify-between p-12 md:p-24 pointer-events-auto"
      style={{
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      }}
    >
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Decorative Top Label */}
      <div className="flex justify-between items-center relative z-10">
        <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">
          Digital Exhibition // System Load
        </span>
        <span
          ref={progressTextRef}
          className="text-xs font-mono font-semibold text-purple-accent text-glow-purple tracking-widest"
        >
          0%
        </span>
      </div>

      {/* Main Cinematic Heading */}
      <div className="my-auto relative z-10 overflow-hidden py-4">
        <div
          ref={textRef}
          className="flex flex-wrap gap-x-6 text-4xl sm:text-6xl md:text-8xl font-black font-heading tracking-tight text-white uppercase"
        >
          {words.map((word, wIdx) => (
            <span key={wIdx} className="inline-block whitespace-nowrap overflow-hidden py-2">
              {word.split('').map((char, cIdx) => (
                <span
                  key={cIdx}
                  className="letter inline-block transform origin-bottom text-white"
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>
        <p className="text-gray-400 font-medium text-sm md:text-base tracking-wider mt-4 opacity-50 font-sans uppercase">
          {subtitleText}
        </p>
      </div>

      {/* Loading Progress Bar */}
      <div className="relative z-10 w-full flex flex-col gap-4">
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full w-0 bg-gradient-to-r from-purple-accent via-blue-accent to-purple-accent shadow-[0_0_12px_#a855f7]"
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-white/30 uppercase tracking-widest">
          <span>Environment Syncing</span>
          <span>Awwwards Portfolio ©2026</span>
        </div>
      </div>

      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-accent/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-accent/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};

export default ProjectTransitionPreloader;
