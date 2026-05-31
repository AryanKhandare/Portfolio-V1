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

interface TimelineCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  details: string[];
  colorTheme: 'purple' | 'cyan' | 'pink';
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  icon,
  title,
  subtitle,
  details,
  colorTheme,
}) => {
  const [cardRef, size] = useElementSize();
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for 3D tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth springs for tilt
  const springConfig = { damping: 20, stiffness: 130 };
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

    // Calculate rotation angles relative to card center (max 5 degrees)
    const xRotation = -((clientY - height / 2) / (height / 2)) * 5;
    const yRotation = ((clientX - width / 2) / (width / 2)) * 5;

    rotateX.set(xRotation);
    rotateY.set(yRotation);

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

  // Color schemes matching the cyberpunk design system
  const themeColors = {
    purple: {
      borderGlow: 'rgba(168, 85, 247, 0.35)',
      spotlight: 'rgba(168, 85, 247, 0.05)',
      shadow: 'shadow-[0_0_35px_rgba(168,85,247,0.15)]',
      accentColor: '#a855f7',
      systemCode: '[DB_MOD_AI.04]',
      refCode: 'NEURAL_STCK'
    },
    cyan: {
      borderGlow: 'rgba(6, 182, 212, 0.35)',
      spotlight: 'rgba(6, 182, 212, 0.05)',
      shadow: 'shadow-[0_0_35px_rgba(6,182,212,0.15)]',
      accentColor: '#06b6d4',
      systemCode: '[CORE_SYS_01]',
      refCode: 'SYS_STACK'
    },
    pink: {
      borderGlow: 'rgba(236, 72, 153, 0.35)',
      spotlight: 'rgba(236, 72, 153, 0.05)',
      shadow: 'shadow-[0_0_35px_rgba(236,72,153,0.15)]',
      accentColor: '#ec4899',
      systemCode: '[SYS_CRE_03]',
      refCode: 'ACHIEV_LOG'
    }
  };

  const colors = themeColors[colorTheme];

  // Radial gradients computed from MouseCoordinates
  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(280px circle at ${x}px ${y}px, ${colors.spotlight}, transparent 80%)`
  );

  const borderSpotlight = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(160px circle at ${x}px ${y}px, ${colors.borderGlow}, transparent 70%)`
  );

  // Bevel cut corners styling
  const bevel = 15;
  const clipPathStyle = {
    clipPath: `polygon(${bevel}px 0px, 100% 0px, 100% calc(100% - ${bevel}px), calc(100% - ${bevel}px) 100%, 0px 100%, 0px ${bevel}px)`
  };

  const W = size.width;
  const H = size.height;

  // Outer/inner polygon coordinates for SVG outlines
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
      className={`relative w-full group transition-all duration-300 rounded-[18px] ${
        isHovered ? colors.shadow : ''
      }`}
      animate={{
        scale: isHovered ? 1.015 : 1
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Outer Clip wrapper (spotlight outline) */}
      <div
        className="relative p-[1.2px] bg-white/[0.03] transition-all duration-500 overflow-hidden w-full"
        style={clipPathStyle}
      >
        {/* Dynamic Border Spotlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: borderSpotlight }}
        />

        {/* Inner Content Module */}
        <div
          style={{ ...clipPathStyle, transform: 'translateZ(15px)' }}
          className="relative bg-[#070708]/92 backdrop-blur-md rounded-[15px] p-6 flex flex-col gap-4 overflow-hidden z-10 w-full text-left"
        >
          {/* Spotlight Background */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: spotlightBg }}
          />

          {/* Laser Scanning Line */}
          <motion.div
            initial={{ top: "0%" }}
            animate={isHovered ? { top: ["0%", "100%", "0%"] } : { top: "0%" }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-[1px] pointer-events-none z-10 opacity-0 group-hover:opacity-25 transition-opacity duration-300"
            style={{
              background: `linear-gradient(to right, transparent, ${colors.accentColor}, transparent)`
            }}
          />

          {/* Symmetrical SVG brackets and HUD borders */}
          {W > 0 && H > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              {/* Outer light line */}
              <path
                d={outerPath}
                stroke={`${colors.accentColor}20`}
                strokeWidth="1.2"
                fill="none"
              />
              {/* Inner outline */}
              <path
                d={innerPath}
                stroke="rgba(255,255,255,0.02)"
                strokeWidth="0.8"
                fill="none"
              />

              {/* Glowing Corner Accents */}
              <path
                d={`M 0 ${bevel + 6} L 0 ${bevel} L ${bevel} 0 L ${bevel + 6} 0`}
                stroke={colors.accentColor}
                strokeWidth="2"
                fill="none"
                className="opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              />
              <path
                d={`M ${W - bevel - 6} 0 L ${W - bevel} 0 L ${W} ${bevel} L ${W} ${bevel + 6}`}
                stroke={colors.accentColor}
                strokeWidth="2"
                fill="none"
                className="opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              />
              <path
                d={`M ${W} ${H - bevel - 6} L ${W} ${H - bevel} L ${W - bevel} ${H} L ${W - bevel - 6} ${H}`}
                stroke={colors.accentColor}
                strokeWidth="2"
                fill="none"
                className="opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              />
              <path
                d={`M ${bevel + 6} ${H} L ${bevel} ${H} L 0 ${H - bevel} L 0 ${H - bevel - 6}`}
                stroke={colors.accentColor}
                strokeWidth="2"
                fill="none"
                className="opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              />
            </svg>
          )}

          {/* Faint Grid Backdrop */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.01] group-hover:opacity-[0.02] transition-opacity duration-500 pointer-events-none z-0">
            <pattern id={`timeline-grid-${title.replace(/\s+/g, '-')}`} width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#timeline-grid-${title.replace(/\s+/g, '-')})`} />
          </svg>

          {/* Tiny Tech Labels */}
          <div className="absolute top-2.5 right-5 font-mono text-[5px] text-white/20 select-none tracking-widest">
            {colors.systemCode}
          </div>
          <div className="absolute bottom-2.5 right-5 font-mono text-[5px] text-white/20 select-none tracking-widest">
            REF_{colors.refCode}
          </div>

          {/* Main Card Header Info */}
          <div className="flex items-center gap-3.5 relative z-10 pb-2 border-b border-white/5">
            <div 
              className="p-2.5 bg-white/5 border border-white/10 rounded-lg shrink-0 text-white transition-all duration-300 group-hover:bg-white/10"
              style={{ color: colors.accentColor }}
            >
              {icon}
            </div>
            <div className="flex-grow">
              <h3 className="text-base font-bold font-heading text-white tracking-wide transition-all duration-300 group-hover:text-white">
                {title}
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                {subtitle}
              </span>
            </div>
          </div>

          {/* Bullet Point details */}
          <ul className="flex flex-col gap-2.5 mt-2 relative z-10">
            {details.map((detail, idx) => (
              <li 
                key={idx} 
                className="text-sm text-gray-400 leading-relaxed flex items-start gap-2.5 transition-colors duration-300 group-hover:text-gray-300"
              >
                <span 
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 animate-pulse" 
                  style={{ backgroundColor: colors.accentColor, boxShadow: `0 0 6px ${colors.accentColor}` }}
                />
                <span className="flex-grow">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineCard;
