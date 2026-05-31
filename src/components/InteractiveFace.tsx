import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Import the background-removed GenAI portrait centerpiece
import aryanGenAI from '../assets/Aryan_GenAI_nobg.png';

interface BinaryColumnProps {
  left?: string;
  right?: string;
  delay: number;
}

const BinaryColumn: React.FC<BinaryColumnProps> = ({ left, right, delay }) => {
  const binaryString = "101101001011001011010101001101";
  return (
    <div
      className="absolute top-[5%] bottom-[10%] flex flex-col justify-between font-mono text-[9px] text-purple-accent/15 select-none pointer-events-none z-0"
      style={{ left, right }}
    >
      {binaryString.split("").map((char, index) => (
        <motion.span
          key={index}
          animate={{
            opacity: [0.08, 0.35, 0.08],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: delay + index * 0.15,
            ease: "easeInOut"
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

export const InteractiveFace: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  // Normalized mouse coordinates (0 to 1) for smooth translation parallax
  const mousePctX = useMotionValue(0.5);
  const mousePctY = useMotionValue(0.5);

  // Springs for smooth, responsive movement
  const springConfig = { damping: 25, stiffness: 120, mass: 0.8 };
  const smoothPctX = useSpring(mousePctX, springConfig);
  const smoothPctY = useSpring(mousePctY, springConfig);

  // Opposite parallax shift for background glowing elements to create physical depth
  const bgParallaxX = useTransform(smoothPctX, [0, 1], [15, -15]);
  const bgParallaxY = useTransform(smoothPctY, [0, 1], [15, -15]);

  // Detect mobile viewports to adjust interactions
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Handle cursor coordinates and reveal logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;

    let rect = rectRef.current;
    if (!rect) {
      if (!containerRef.current) return;
      rect = containerRef.current.getBoundingClientRect();
      rectRef.current = rect;
    }

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set normalized coordinates (0 to 1) for parallax
    mousePctX.set(x / rect.width);
    mousePctY.set(y / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rectRef.current = null;
    if (!isMobile) {
      // Smoothly reset normalized coordinates to center
      mousePctX.set(0.5);
      mousePctY.set(0.5);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[3/4] max-w-[380px] md:max-w-[480px] lg:max-w-[580px] xl:max-w-[680px] flex items-center justify-center cursor-pointer select-none overflow-visible group"
      style={{ perspective: 1200 }}
    >
      {/* Symmetrical Scrolling Binary Backdrop Columns */}
      <BinaryColumn left="6%" delay={0} />
      <BinaryColumn right="6%" delay={2} />

      {/* Cinematic Glowing Background Aura */}
      <motion.div
        className="absolute top-[12%] left-[-15%] right-[-15%] bottom-[12%] rounded-full bg-radial from-purple-accent/15 via-cyan-500/5 to-transparent blur-[90px] pointer-events-none z-0"
        style={{ x: bgParallaxX, y: bgParallaxY }}
        animate={{
          scale: isHovered ? 1.15 : 1,
          opacity: isHovered ? 0.95 : 0.7,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Master SVG containing clear character cutout, gradient mask, lines, and HUD elements */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        viewBox="0 0 300 400"
      >
        <defs>
          {/* Native SVG Mask for transparent and clear fade-to-black bottom */}
          <mask id="fade-bottom-mask">
            <rect x="-100" y="-100" width="500" height="600" fill="url(#mask-gradient)" />
          </mask>
          <linearGradient id="mask-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="80%" stopColor="white" stopOpacity="1" />
            <stop offset="96%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Glowing connector paint */}
          <linearGradient id="purple-cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-purple-accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-blue-accent)" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer Group: Handles ONLY the slow vertical float to avoid controller fighting (shaking-free!) */}
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="origin-center"
        >
          {/* Inner Group: Parallax is disabled here to keep the portrait still and shake-free */}
          <g className="origin-center">
            {/* Character Cutout Image in SVG - Aspect Ratio Preserved exactly, 100% crisp and clear */}
            <image
              href={aryanGenAI}
              x="0"
              y="0"
              width="300"
              height="400"
              mask="url(#fade-bottom-mask)"
              preserveAspectRatio="xMidYMid meet"
              className="filter brightness-[0.9] contrast-[1.05] pointer-events-none select-none transition-[filter] duration-300 group-hover:brightness-[0.96]"
            />

            {/* Code Snippet 1 (model.fit) inside SVG - locked relative to portrait to prevent overlap */}
            <foreignObject x="-10" y="32" width="100" height="90" className="overflow-visible pointer-events-none select-none">
              <div className="font-mono text-[5.5px] leading-relaxed text-purple-accent/35 text-left">
                <span className="text-purple-300/50 font-semibold block">model.fit(</span>
                <span className="pl-2 block">train_data,</span>
                <span className="pl-2 block text-cyan-300/40">epochs=100,</span>
                <span className="pl-2 block">batch_size=32</span>
                <span className="text-purple-300/50 font-semibold">)</span>
              </div>
            </foreignObject>

            {/* Code Snippet 2 (build_model) inside SVG - shifted right to x=215 to completely clear the shoulder */}
            <foreignObject x="215" y="140" width="110" height="150" className="overflow-visible pointer-events-none select-none">
              <div className="font-mono text-[5px] leading-normal text-cyan-400/25 text-left">
                <span className="text-cyan-300/40 font-semibold">def</span> <span className="text-white/40">build_model():</span>
                <span className="pl-2 block text-purple-300/35">model = Sequential([</span>
                <span className="pl-4 block">Dense(128, activation='relu'),</span>
                <span className="pl-4 block">Dropout(0.3),</span>
                <span className="pl-4 block">Dense(64, activation='relu'),</span>
                <span className="pl-4 block">Dense(1, activation='sigmoid')</span>
                <span className="pl-2 block text-purple-300/35">])</span>
                <span className="pl-2 block"><span className="text-cyan-300/40">return</span> model</span>
              </div>
            </foreignObject>

            {/* Connector Line 1: Top Right Tag (246, 52) -> (210, 52) -> (175, 92) */}
            <motion.path
              d="M 246 52 L 210 52 L 175 92"
              stroke="url(#purple-cyan-glow)"
              strokeWidth="0.8"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
            <motion.circle
              cx="175"
              cy="92"
              r="2.2"
              fill="var(--color-purple-accent)"
              animate={{ r: [2.2, 3.8, 2.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Connector Line 2: Middle Left Tag (63, 200) -> (95, 200) -> (115, 236) */}
            <motion.path
              d="M 63 200 L 95 200 L 115 236"
              stroke="url(#purple-cyan-glow)"
              strokeWidth="0.8"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            />
            <motion.circle
              cx="115"
              cy="236"
              r="2.2"
              fill="var(--color-blue-accent)"
              animate={{ r: [2.2, 3.8, 2.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </g>
        </motion.g>
      </svg>

      {/* Holographic Text Labels - positioned outside the SVG */}
      {/* Tag 1: AI / ML ENGINEER */}
      <div className="absolute top-[12%] right-[2%] lg:right-[6%] flex flex-col pointer-events-none select-none z-30 scale-[0.85] sm:scale-100 origin-right">
        <div className="glass-panel px-3 py-1.5 rounded-lg border border-purple-accent/20 shadow-[0_0_15px_rgba(168,85,247,0.1)] text-left flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-accent animate-pulse" />
          <div className="font-mono text-[9px] font-bold text-white tracking-widest leading-tight">
            <div>AI / ML</div>
            <div className="text-purple-accent">ENGINEER</div>
          </div>
        </div>
      </div>

      {/* Tag 2: FULL STACK DEVELOPER */}
      <div className="absolute top-[50%] left-[2%] lg:left-[6%] flex flex-col pointer-events-none select-none z-30 scale-[0.85] sm:scale-100 origin-left">
        <div className="glass-panel px-3 py-1.5 rounded-lg border border-blue-accent/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] text-right flex items-center gap-2 flex-row-reverse">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-accent animate-pulse" />
          <div className="font-mono text-[9px] font-bold text-white tracking-widest leading-tight">
            <div className="text-blue-accent font-medium text-[8px] mb-0.5">&lt;/&gt;</div>
            <div>FULL STACK</div>
            <div>DEVELOPER</div>
          </div>
        </div>
      </div>
    </div>
  );
};
