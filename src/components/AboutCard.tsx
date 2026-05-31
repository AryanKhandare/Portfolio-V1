import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Custom hook to track dynamic element size using ResizeObserver
const useElementSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
};

interface AboutCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorTheme: 'purple' | 'cyan' | 'pink';
}

export const AboutCard: React.FC<AboutCardProps> = ({ icon, title, description, colorTheme }) => {
  const [cardRef, size] = useElementSize();
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for 3D tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth springs for tilt
  const springConfig = { damping: 22, stiffness: 140 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  // Mouse position inside card for spotlight tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (size.width === 0 || size.height === 0 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Calculate rotation angles based on mouse position relative to card center
    const xRotation = -((clientY - height / 2) / (height / 2)) * 6; // max 6 degrees
    const yRotation = ((clientX - width / 2) / (width / 2)) * 6;

    rotateX.set(xRotation);
    rotateY.set(yRotation);

    // Set absolute mouse coordinates for the spotlight gradient
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Resolve color variables based on theme
  const themeColors = {
    purple: {
      borderGlow: 'rgba(168, 85, 247, 0.4)',
      spotlight: 'rgba(168, 85, 247, 0.08)',
      iconBg: 'bg-purple-accent/5 border-purple-accent/30 text-purple-accent',
      shadow: 'shadow-[0_0_40px_rgba(168,85,247,0.18)]',
      textGlow: 'group-hover:text-purple-accent',
      bracketColor: '#a855f7',
      laser: '#a855f7',
      systemCode: '[SYS_CORE_01]',
      refCode: 'AI_ML_SPEC'
    },
    cyan: {
      borderGlow: 'rgba(6, 182, 212, 0.4)',
      spotlight: 'rgba(6, 182, 212, 0.08)',
      iconBg: 'bg-blue-accent/5 border-blue-accent/30 text-blue-accent',
      shadow: 'shadow-[0_0_40px_rgba(6,182,212,0.18)]',
      textGlow: 'group-hover:text-blue-accent',
      bracketColor: '#06b6d4',
      laser: '#06b6d4',
      systemCode: '[SYS_MOD_02]',
      refCode: 'PROD_ENG'
    },
    pink: {
      borderGlow: 'rgba(236, 72, 153, 0.4)',
      spotlight: 'rgba(236, 72, 153, 0.08)',
      iconBg: 'bg-pink-accent/5 border-pink-accent/30 text-pink-accent',
      shadow: 'shadow-[0_0_40px_rgba(236,72,153,0.18)]',
      textGlow: 'group-hover:text-pink-accent',
      bracketColor: '#ec4899',
      laser: '#ec4899',
      systemCode: '[SYS_PHIL_03]',
      refCode: 'TECH_PHIL'
    }
  };

  const colors = themeColors[colorTheme];

  // Convert MotionValues to templates for CSS radial gradients
  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(250px circle at ${x}px ${y}px, ${colors.spotlight}, transparent 80%)`
  );

  const borderSpotlight = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(150px circle at ${x}px ${y}px, ${colors.borderGlow}, transparent 70%)`
  );

  // Common polygon clip-path style for asymmetrical cyberpunk cut corners
  const bevel = 16;
  const clipPathStyle = {
    clipPath: `polygon(${bevel}px 0px, 100% 0px, 100% calc(100% - ${bevel}px), calc(100% - ${bevel}px) 100%, 0px 100%, 0px ${bevel}px)`
  };

  const W = size.width;
  const H = size.height;

  // Pre-calculate SVG path coordinates based on ResizeObserver W and H
  const outerPath = `M ${bevel} 0 L ${W - bevel} 0 L ${W} ${bevel} L ${W} ${H - bevel} L ${W - bevel} ${H} L ${bevel} ${H} L 0 ${H - bevel} L 0 ${bevel} Z`;
  const innerPath = `M ${bevel + 3} 3 L ${W - bevel - 3} 3 L ${W - 3} ${bevel + 3} L ${W - 3} ${H - bevel - 3} L ${W - bevel - 3} ${H - 3} L ${bevel + 3} ${H - 3} L 3 ${H - bevel - 3} L 3 ${bevel + 3} Z`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className={`relative w-full cursor-pointer group transition-all duration-300 rounded-[18px] ${
        isHovered ? colors.shadow : ''
      }`}
      animate={{
        scale: isHovered ? 1.025 : 1
      }}
      transition={{ duration: 0.2 }}
    >
      {/* 1. Outer Beveled Border Wrapper (Spotlight Layer) */}
      <div 
        className="relative p-[1.2px] bg-white/[0.03] transition-all duration-500 overflow-hidden w-full"
        style={clipPathStyle}
      >
        {/* Dynamic Border Spotlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: borderSpotlight }}
        />

        {/* 2. Inner Beveled Content Container */}
        <div
          style={{ ...clipPathStyle, transform: 'translateZ(18px)' }}
          className="relative bg-[#070708]/90 backdrop-blur-md rounded-[15px] p-6 flex flex-col gap-4 overflow-hidden z-10 w-full text-left"
        >
          {/* Dynamic Background Spotlight */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: spotlightBg }}
          />

          {/* Glowing Vertical Cybernetic Scanline */}
          <motion.div
            initial={{ top: "0%" }}
            animate={isHovered ? { top: ["0%", "100%", "0%"] } : { top: "0%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-[1px] pointer-events-none z-10 opacity-0 group-hover:opacity-35 transition-opacity duration-300"
            style={{
              background: `linear-gradient(to right, transparent, ${colors.laser}, transparent)`
            }}
          />

          {/* Dynamic Vector HUD Borders & Corner Brackets */}
          {W > 0 && H > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              {/* Outer faint beveled outline */}
              <path
                d={outerPath}
                stroke={`${colors.bracketColor}25`}
                strokeWidth="1.2"
                fill="none"
              />
              
              {/* Inner even fainter beveled outline */}
              <path
                d={innerPath}
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="0.8"
                fill="none"
              />

              {/* Glowing Beveled Corner Brackets */}
              <path
                d={`M 0 ${bevel + 8} L 0 ${bevel} L ${bevel} 0 L ${bevel + 8} 0`}
                stroke={colors.bracketColor}
                strokeWidth="2"
                fill="none"
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
              <path
                d={`M ${W - bevel - 8} 0 L ${W - bevel} 0 L ${W} ${bevel} L ${W} ${bevel + 8}`}
                stroke={colors.bracketColor}
                strokeWidth="2"
                fill="none"
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
              <path
                d={`M ${W} ${H - bevel - 8} L ${W} ${H - bevel} L ${W - bevel} ${H} L ${W - bevel - 8} ${H}`}
                stroke={colors.bracketColor}
                strokeWidth="2"
                fill="none"
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
              <path
                d={`M ${bevel + 8} ${H} L ${bevel} ${H} L 0 ${H - bevel} L 0 ${H - bevel - 8}`}
                stroke={colors.bracketColor}
                strokeWidth="2"
                fill="none"
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />

              {/* Symmetrical Dashed Vertical HUD Grid indicators */}
              <line
                x1="0"
                y1={H * 0.4}
                x2="0"
                y2={H * 0.6}
                stroke={colors.bracketColor}
                strokeWidth="1.2"
                strokeDasharray="3 3"
                className="opacity-30 group-hover:opacity-80 transition-opacity duration-300"
              />
              <line
                x1={W}
                y1={H * 0.4}
                x2={W}
                y2={H * 0.6}
                stroke={colors.bracketColor}
                strokeWidth="1.2"
                strokeDasharray="3 3"
                className="opacity-30 group-hover:opacity-80 transition-opacity duration-300"
              />
            </svg>
          )}

          {/* Faint HUD Background Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.01] group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none z-0">
            <pattern id={`card-grid-hud-${title.replace(/\s+/g, '-')}`} width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M 14 0 L 0 0 0 14" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#card-grid-hud-${title.replace(/\s+/g, '-')})`} />
          </svg>

          {/* HUD Corner Tech Text Indicators */}
          <div className="absolute top-2.5 right-6 font-mono text-[5.5px] text-white/20 select-none pointer-events-none tracking-widest">
            {colors.systemCode}
          </div>
          <div className="absolute bottom-2.5 left-6 font-mono text-[5.5px] text-white/20 select-none pointer-events-none tracking-widest">
            REF:_{colors.refCode}
          </div>

          {/* Symmetrical Sidebar Layout: Left Icon Module, Right Info Block */}
          <div className="flex flex-row gap-5 items-start w-full relative z-10 py-1">
            {/* Concentric Animated HUD Circles containing Icon centerpiece */}
            <div className="relative w-[72px] h-[72px] flex items-center justify-center shrink-0">
              <div className="absolute inset-0">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
                  {/* Outer Segmented rotating ring */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="44"
                    stroke={colors.bracketColor}
                    strokeWidth="2.5"
                    strokeDasharray="45 20 10 25"
                    fill="none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: '50px 50px' }}
                  />
                  {/* Middle counter-rotating dashed ring */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke={`${colors.bracketColor}40`}
                    strokeWidth="1.2"
                    strokeDasharray="4 6"
                    fill="none"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: '50px 50px' }}
                  />
                  {/* Inner solid glowing ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r="27"
                    stroke={`${colors.bracketColor}70`}
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Glowing Icon in the absolute center */}
              <motion.div
                animate={{
                  scale: isHovered ? 1.08 : 1
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-300 text-white`}
              >
                {/* Soft pulse glow backdrop */}
                <div 
                  className="absolute inset-0 rounded-full animate-pulse blur-[8px] opacity-25 pointer-events-none" 
                  style={{ backgroundColor: colors.bracketColor }}
                />
                <span className="relative z-10">{icon}</span>
              </motion.div>
            </div>

            {/* Info Block: Title & Description */}
            <div className="flex flex-col gap-2 flex-grow text-left">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-bold font-heading text-white tracking-wide transition-all duration-300 group-hover:tracking-wider">
                  {title}
                </h3>
                {/* Scanning status line */}
                <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-90 transition-opacity duration-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: colors.bracketColor }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: colors.bracketColor }} />
                  </span>
                  <span className="font-mono text-[6.5px] tracking-widest text-white/40 uppercase">
                    SYS_LOAD_ACTIVE
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed font-light transition-colors duration-300 group-hover:text-gray-300">
                {description}
              </p>


            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
