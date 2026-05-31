import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

interface PillButtonProps {
  href?: string;
  download?: boolean;
  onClick?: () => void;
  label: string;
  icon?: React.ReactNode;
  className?: string; // Tailwinds classes for padding, borders, typography, initial background, etc.
  
  // Custom colors for the hover effect
  circleBgColor?: string;   // Color of the expanding background circle (hex, rgb, or tailwind var)
  initialTextColor?: string; // Text color before hover
  hoverTextColor?: string;   // Text color during hover
  magneticPull?: boolean;    // Toggle magnetic pull interaction
}

export const PillButton: React.FC<PillButtonProps> = ({
  href,
  download,
  onClick,
  label,
  icon,
  className = '',
  circleBgColor = '#ffffff',
  initialTextColor = '#ffffff',
  hoverTextColor = '#000000',
  magneticPull = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const circleRef = useRef<HTMLSpanElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const hoverLabelRef = useRef<HTMLSpanElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Position state for magnetic pull
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const button = buttonRef.current;
    const circle = circleRef.current;
    const textLabel = labelRef.current;
    const hoverLabel = hoverLabelRef.current;

    if (!button || !circle) return;

    const layout = () => {
      const rect = button.getBoundingClientRect();
      const { width: w, height: h } = rect;
      
      // Geometric calculation to determine circle size and anchor origin
      // so it curves perfectly with the bottom edge and covers the button fully on scale
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        left: '50%',
        scale: 0,
        transformOrigin: `50% ${originY}px`
      });

      if (textLabel) gsap.set(textLabel, { y: 0 });
      if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

      // Recreate GSAP timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const tl = gsap.timeline({ paused: true });

      // Animate background circle scaling up
      tl.to(circle, { scale: 1.25, duration: 0.55, ease: 'power3.out' }, 0);

      // Slide original label up and fade out
      if (textLabel) {
        tl.to(textLabel, { y: -(h + 8), duration: 0.55, ease: 'power3.out' }, 0);
      }

      // Slide hover label up from bottom
      if (hoverLabel) {
        gsap.set(hoverLabel, { y: h + 16, opacity: 0 });
        tl.to(hoverLabel, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, 0);
      }

      timelineRef.current = tl;
    };

    layout();
    
    // Recalculate on window resize or font loaded to prevent incorrect geometry bounds
    window.addEventListener('resize', layout);
    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', layout);
    };
  }, [label, icon]);

  // Magnetic Pull Mouse tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magneticPull || !buttonRef.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // 90px activation radius
    const hoverRadius = 90;
    if (distance < hoverRadius) {
      const strength = 0.28; // pull strength factor
      setPosition({ x: distanceX * strength, y: distanceY * strength });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseEnter = () => {
    if (timelineRef.current) {
      timelineRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    if (timelineRef.current) {
      timelineRef.current.reverse();
    }
  };

  const buttonContent = (
    <>
      {/* Expanding background circle */}
      <span
        ref={circleRef}
        className="absolute rounded-full z-[1] pointer-events-none block"
        style={{
          backgroundColor: circleBgColor,
          willChange: 'transform',
        }}
      />
      
      {/* Label stack container */}
      <span className="relative flex items-center justify-center w-full h-full z-[2] pointer-events-none">
        {/* Original text + icon */}
        <span
          ref={labelRef}
          className="flex items-center justify-center gap-2 relative z-[2] whitespace-nowrap"
          style={{ color: initialTextColor, willChange: 'transform' }}
        >
          <span>{label}</span>
          {icon}
        </span>
        
        {/* Hovered text + icon */}
        <span
          ref={hoverLabelRef}
          className="absolute flex items-center justify-center gap-2 z-[3] pointer-events-none whitespace-nowrap"
          style={{ color: hoverTextColor, willChange: 'transform, opacity' }}
        >
          <span>{label}</span>
          {icon}
        </span>
      </span>
    </>
  );

  return (
    <div ref={containerRef} className="inline-block overflow-visible">
      {href ? (
        <motion.a
          ref={buttonRef as React.RefObject<HTMLAnchorElement>}
          href={href}
          download={download}
          onClick={onClick}
          animate={{ x: position.x, y: position.y }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`relative overflow-hidden select-none ${className}`}
          style={{
            transformStyle: 'preserve-3d' as const,
          }}
        >
          {buttonContent}
        </motion.a>
      ) : (
        <motion.button
          ref={buttonRef as React.RefObject<HTMLButtonElement>}
          onClick={onClick}
          animate={{ x: position.x, y: position.y }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`relative overflow-hidden select-none ${className}`}
          style={{
            transformStyle: 'preserve-3d' as const,
          }}
        >
          {buttonContent}
        </motion.button>
      )}
    </div>
  );
};

export default PillButton;
