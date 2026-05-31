import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';

interface BackgroundRibbonProps {
  pathType: 'hero' | 'about' | 'projects' | 'techstack' | 'experience';
  className?: string;
}

export const BackgroundRibbon: React.FC<BackgroundRibbonProps> = ({ 
  pathType,
  className = "absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  // Target mouse coordinates relative to container
  const targetX = useRef(dimensions.width / 2);
  const targetY = useRef(dimensions.height / 2);

  // Current interpolated coordinates (lerp)
  const currentX = useMotionValue(dimensions.width / 2);
  const currentY = useMotionValue(dimensions.height / 2);

  // Viewport Y progress for drawing progress (0 to 1)
  const mouseYProgress = useRef(0.5);

  // Tracking drawing progress (lerp-based pathLength)
  const ribbonPathLength = useMotionValue(0);

  // Track if mouse is active inside the section
  const isMouseActive = useRef(false);

  // Elapsed time for organic wave propagation
  const time = useMotionValue(0);

  // Dashoffset value for flowing pulses along the path
  const flowOffset = useMotionValue(0);

  // Path string motion value (single updates for ultra performance, zero lag)
  const pathD = useMotionValue("");

  // Section scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Track dimensions and bind listeners
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
        targetX.current = rect.width / 2;
        targetY.current = rect.height / 2;
        currentX.set(rect.width / 2);
        currentY.set(rect.height / 2);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const handleMouseMove = (e: MouseEvent) => {
      isMouseActive.current = true;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Mouse coordinate relative to container for wave displacement
        targetX.current = e.clientX - rect.left;
        targetY.current = e.clientY - rect.top;
        // Mouse coordinate relative to viewport height (0 to 1) for path length progress
        mouseYProgress.current = Math.max(0, Math.min(1, e.clientY / window.innerHeight));
      }
    };

    const handleMouseLeave = () => {
      isMouseActive.current = false;
      targetX.current = dimensions.width / 2;
      targetY.current = dimensions.height / 2;
    };

    const parent = containerRef.current?.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // High performance animation loop
    let animId: number;
    const tick = () => {
      const tx = targetX.current;
      const ty = targetY.current;
      const cx = currentX.get();
      const cy = currentY.get();

      // Lerp mouse coordinates
      const nextX = cx + (tx - cx) * 0.03;
      const nextY = cy + (ty - cy) * 0.03;
      currentX.set(nextX);
      currentY.set(nextY);

      // Programmatic pathLength drawing calculations
      let targetProgress = 0;
      const sProgress = scrollYProgress.get();

      // Winding curve entrance-exit scroll envelope
      let scrollLength = 0;
      if (sProgress < 0.35) {
        scrollLength = Math.max(0, Math.min(1, (sProgress - 0.08) / 0.27));
      } else if (sProgress >= 0.35 && sProgress <= 0.65) {
        scrollLength = 1;
      } else {
        scrollLength = Math.max(0, Math.min(1, 1 - (sProgress - 0.65) / 0.27));
      }

      if (isMouseActive.current) {
        targetProgress = mouseYProgress.current;
      } else {
        targetProgress = scrollLength;
      }

      // Smooth lerp interpolation for drawing progress
      const currentProgress = ribbonPathLength.get();
      ribbonPathLength.set(currentProgress + (targetProgress - currentProgress) * 0.05);

      // Increment wave time and flow offsets
      const nextTime = time.get() + 0.0035;
      time.set(nextTime);
      flowOffset.set(flowOffset.get() - 1.5);

      // Compute and update path D coordinates
      const { width, height } = dimensions;
      const innerIsMobile = width < 768;
      const innerIsTablet = width >= 768 && width < 1024;
      const mScale = innerIsMobile ? 0.25 : innerIsTablet ? 0.6 : 1.0;

      // Mouse displacement
      const dx = (nextX - width / 2) * 0.1 * mScale;
      const dy = (nextY - height / 2) * 0.1 * mScale;

      // Parallax offset
      const scrollVal = (sProgress * 300) - 150;
      const scrollYOffset = scrollVal * (innerIsMobile ? 0.25 : 0.5);

      // Waves
      const w1 = Math.sin(nextTime * 1.0) * 35 * mScale;
      const w2 = Math.cos(nextTime * 0.8) * 30 * mScale;
      const w3 = Math.sin(nextTime * 1.3) * 40 * mScale;

      let dString = "";

      if (pathType === 'experience') {
        const startY = height * 0.2 + scrollYOffset + w1;
        
        // 1st segment: Enter from left, curve up and down to form first half of loop
        const cp1x = width * 0.1 + dx;
        const cp1y = height * -0.1 + scrollYOffset + dy + w2;
        const cp2x = width * 0.25 + dx;
        const cp2y = height * 0.2 + scrollYOffset + dy - w3;
        const p1x = width * 0.18 + dx;
        const p1y = height * 0.45 + scrollYOffset + w3;

        // 2nd segment: Loop down, left, and back up-right to form second half of loop
        const cp3x = width * 0.12 + dx;
        const cp3y = height * 0.65 + scrollYOffset + dy + w1;
        const cp4x = width * 0.05 + dx;
        const cp4y = height * 0.5 + scrollYOffset + dy - w2;
        const p2x = width * 0.15 + dx;
        const p2y = height * 0.3 + scrollYOffset + w2;

        // 3rd segment: Curve down-right and cross the loop
        const cp5x = width * 0.22 + dx;
        const cp5y = height * 0.15 + scrollYOffset + dy + w3;
        const cp6x = width * 0.3 + dx;
        const cp6y = height * 0.4 + scrollYOffset + dy - w1;
        const p3x = width * 0.4 + dx;
        const p3y = height * 0.5 + scrollYOffset + w1;

        // 4th segment: Horizontal flow through the middle
        const cp7x = width * 0.55 + dx;
        const cp7y = height * 0.55 + scrollYOffset + dy + w2;
        const cp8x = width * 0.7 + dx;
        const cp8y = height * 0.45 + scrollYOffset + dy - w3;
        const p4x = width * 0.8 + dx;
        const p4y = height * 0.45 + scrollYOffset + w3;

        // 5th segment: Plunge down-right to the bottom right corner
        const cp9x = width * 0.9 + dx;
        const cp9y = height * 0.45 + scrollYOffset + dy + w1;
        const cp10x = width * 0.95 + dx + Math.cos(nextTime) * 15 * mScale;
        const cp10y = height * 0.7 + scrollYOffset + dy - w2;
        const endX = width + 120;
        const endY = height * 0.9 + scrollYOffset + w1;

        dString = `M -120 ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1x} ${p1y} ` +
                  `C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${p2x} ${p2y} ` +
                  `C ${cp5x} ${cp5y}, ${cp6x} ${cp6y}, ${p3x} ${p3y} ` +
                  `C ${cp7x} ${cp7y}, ${cp8x} ${cp8y}, ${p4x} ${p4y} ` +
                  `C ${cp9x} ${cp9y}, ${cp10x} ${cp10y}, ${endX} ${endY}`;
      } else if (pathType === 'hero') {
        const startY = height * (innerIsMobile ? 0.25 : 0.1) + scrollYOffset + w1;
        const endY = height * (innerIsMobile ? 0.65 : 0.6) + scrollYOffset + w2;
        const cp1x = width * 0.35 + dx + Math.cos(nextTime) * 15 * mScale;
        const cp1y = height * (innerIsMobile ? 0.15 : -0.15) + scrollYOffset + dy + w3;
        const cp2x = width * 0.65 + dx;
        const cp2y = height * (innerIsMobile ? 0.75 : 0.7) + scrollYOffset + dy;
        dString = `M -120 ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${width + 120} ${endY}`;
      } else if (pathType === 'about') {
        const startY = height * (innerIsMobile ? 0.15 : 0.05) + scrollYOffset + w1;
        const endY = height * (innerIsMobile ? 0.85 : 0.95) + scrollYOffset + w2;
        const cp1x = width * 0.15 + dx;
        const cp1y = height * 0.45 + scrollYOffset + dy + w3;
        const cp2x = width * 0.85 + dx + Math.sin(nextTime) * 20 * mScale;
        const cp2y = height * 0.55 + scrollYOffset + dy - w3;
        dString = `M -120 ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${width + 120} ${endY}`;
      } else if (pathType === 'projects') {
        const startY = height * 0.28 + scrollYOffset + w1;
        const endY = height * 0.72 + scrollYOffset + w2;
        const p2x = width * 0.42 + dx;
        const p2y = height * 0.48 + scrollYOffset + dy + w3;
        const cp1x = width * 0.22 + dx;
        const cp1y = height * (innerIsMobile ? 0.15 : -0.05) + scrollYOffset + dy;
        const cp2x = width * 0.35 + dx;
        const cp2y = height * 0.68 + scrollYOffset + dy;
        const cp3x = width * 0.62 + dx;
        const cp3y = height * 0.55 + scrollYOffset + dy - w3;
        const cp4x = width * 0.85 + dx + Math.cos(nextTime) * 15 * mScale;
        const cp4y = height * (innerIsMobile ? 0.85 : 0.95) + scrollYOffset + dy;
        dString = `M -120 ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2x} ${p2y} C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${width + 120} ${endY}`;
      } else {
        // Tech stack fallback
        const startY = height * (innerIsMobile ? 0.45 : 0.35) + scrollYOffset + w1;
        const endY = height * (innerIsMobile ? 0.55 : 0.65) + scrollYOffset + w2;
        const cp1x = width * 0.3 + dx;
        const cp1y = height * (innerIsMobile ? 0.25 : 0.05) + scrollYOffset + dy + w3;
        const cp2x = width * 0.7 + dx + Math.sin(nextTime) * 15 * mScale;
        const cp2y = height * (innerIsMobile ? 0.75 : 0.95) + scrollYOffset + dy - w3;
        dString = `M -120 ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${width + 120} ${endY}`;
      }

      pathD.set(dString);

      animId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animId);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [dimensions.width, dimensions.height]);

  // Compute responsive stroke widths based on current width
  const isMobile = dimensions.width < 768;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;

  const strokeWidthSolid = isMobile ? 18 : isTablet ? 28 : 38;
  const strokeWidthTrail = isMobile ? 5 : isTablet ? 7 : 9;

  // Derive opacity based on path drawing progress to avoid showing stubs
  const ribbonOpacity = useTransform(ribbonPathLength, [0, 0.04], [0, 1]);

  return (
    <div
      ref={containerRef}
      className={className}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Volumetric drop shadow and glow for depth & cinematic bloom */}
          <filter id="ribbon-effects" x="-30%" y="-30%" width="160%" height="160%">
            {/* Soft Ambient Glow */}
            <feGaussianBlur in="SourceGraphic" stdDeviation={isMobile ? 10 : 18} result="glow" />
            <feColorMatrix type="matrix" values="
              0 0 0 0 0.10
              0 0 0 0 0.18
              0 0 0 0 0.98
              0 0 0 0 0.45 0" in="glow" result="coloredGlow"/>
            
            {/* Shadow under the ribbon to separate from background */}
            <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#000000" floodOpacity="0.45" result="shadow" />
            
            {/* Merge the components: shadow first, then colored glow, then source graphic */}
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="coloredGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Primary Solid Ribbon + Unified Glow & Shadow Effects */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="var(--color-deep-space-blue, #1a2ffb)"
          strokeWidth={strokeWidthSolid}
          strokeLinecap="round"
          style={{
            pathLength: ribbonPathLength,
            opacity: ribbonOpacity,
            filter: 'url(#ribbon-effects)',
          }}
        />

        {/* 2. Faint motion trail (Dashed flowing energy highlight) */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="#60a5fa"
          strokeWidth={strokeWidthTrail}
          strokeLinecap="round"
          strokeDasharray="140, 560"
          style={{
            pathLength: ribbonPathLength,
            opacity: ribbonOpacity,
            strokeDashoffset: flowOffset,
            mixBlendMode: 'screen',
          }}
        />
      </svg>
    </div>
  );
};

export default BackgroundRibbon;
