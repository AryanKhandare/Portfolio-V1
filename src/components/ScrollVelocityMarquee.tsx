import React, { useRef, useEffect } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform
} from 'framer-motion';

interface ScrollVelocityMarqueeProps {
  text: string;
  baseVelocity?: number;
  className?: string;
}

export const ScrollVelocityMarquee: React.FC<ScrollVelocityMarqueeProps> = ({
  text,
  className = '',
}) => {
  const baseX = useMotionValue(0);

  // Slightly faster baseline crawl speed (percentage points per second)
  const defaultSpeed = 2.4; 
  
  // Track scroll-linked speed contribution
  const scrollContribution = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      // scroll down (deltaY > 0) -> subtracts speed (flows right-to-left)
      // scroll up (deltaY < 0) -> adds speed (flows left-to-right)
      // We clamp the influence to prevent extreme speeds on fast mouse-wheel/trackpad flicks
      scrollContribution.current = Math.max(
        -35,
        Math.min(35, scrollContribution.current - deltaY * 0.12)
      );
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Helper to wrap the percentage value between -25% and 0% for seamless looping
  const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
  };

  const x = useTransform(baseX, (v: number) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_time, delta) => {
    // Frame-rate independent exponential decay of scroll speed contribution back to 0
    // Math.exp(-6 * timeInSeconds) decays ~63% of the scroll input every 166ms
    const decayFactor = Math.exp(-6 * (delta / 1000));
    scrollContribution.current *= decayFactor;

    // Current speed is default baseline speed plus the active scroll influence
    const currentSpeed = defaultSpeed + scrollContribution.current;

    // Translate baseX by currentSpeed (percentage points per second)
    const moveBy = currentSpeed * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={`overflow-hidden whitespace-nowrap flex flex-nowrap w-full ${className}`}>
      <motion.div 
        className="flex whitespace-nowrap flex-nowrap font-dennis font-normal text-[12vw] tracking-tight leading-none text-white/95" 
        style={{ 
          x: x as any,
          willChange: 'transform'
        }}
      >
        <span className="inline-block mr-12">{text}</span>
        <span className="inline-block mr-12">{text}</span>
        <span className="inline-block mr-12">{text}</span>
        <span className="inline-block mr-12">{text}</span>
      </motion.div>
    </div>
  );
};

export default ScrollVelocityMarquee;
