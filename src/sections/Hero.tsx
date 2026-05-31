import React from 'react';
import { motion } from 'framer-motion';
import ScrollVelocityMarquee from '../components/ScrollVelocityMarquee';
import aryanPortrait from '../assets/aryan_home_nobg.png';
import { ArrowDownRight } from 'lucide-react';
import lottie from 'lottie-web';
import globeAnimation from '../assets/6210a43c-116a-11ee-bcdf-fbbea3279ef0.json';

// Lightweight, React 19 compatible Lottie player wrapper using lottie-web directly
const LottiePlayer: React.FC<{ animationData: any; className?: string }> = ({ animationData, className }) => {
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!elementRef.current) return;

    const anim = lottie.loadAnimation({
      container: elementRef.current,
      renderer: 'canvas',
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        clearCanvas: true
      }
    });

    return () => {
      anim.destroy();
    };
  }, [animationData]);

  return <div ref={elementRef} className={className} />;
};

interface HeroProps {
  startAnimation?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ startAnimation = false }) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#999f9e] text-white pt-28 pb-4 md:pb-8"
    >
      {/* Studio Grey Background */}
      <div className="absolute inset-0 bg-[#999f9e]" />

      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_100%)] pointer-events-none" />

      {/*
        Portrait Image — GPU-composited from the start.
        - will-change: transform tells the browser to create a compositor layer immediately,
          so the slide-up animation never triggers layout or paint, only a cheap transform.
        - Reduced y from 450→120: less travel = spring settles faster with no mid-animation stutter.
        - translateZ(0) forces GPU rasterisation on browsers that ignore will-change alone.
        - fetchpriority="high" combined with the <link rel="preload"> in index.html ensures
          the PNG is already decoded before this element even mounts.
      */}
      <motion.div
        initial={{ opacity: 0, y: 120 }}
        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 120 }}
        transition={{ duration: 1.4, ease: [0.34, 1.15, 0.64, 1], delay: 0.1 }}
        style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[340px] md:max-w-[660px] lg:max-w-[800px] h-[65vh] md:h-[90vh] flex items-end justify-center z-10 pointer-events-none"
      >
        <img
          src={aryanPortrait}
          alt="Aryan Khandare Portrait"
          // @ts-ignore — fetchpriority is a valid HTML attribute, TS types lag behind the spec
          fetchpriority="high"
          decoding="sync"
          className="w-full h-full object-contain select-none scale-110 md:scale-115 origin-bottom"
          style={{ transform: 'translateZ(0)' }}
        />
      </motion.div>

      {/* Foreground Widgets */}
      <div className="relative z-20 flex-1 w-full h-full min-h-[60vh] md:min-h-[70vh]">


        {/* Left: Location widget */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute left-0 top-[18%] md:top-[42%] -translate-y-1/2 flex justify-start"
        >
          <div className="flex items-center gap-6 bg-[#1c1d20] pl-6 md:pl-8 pr-2.5 py-3 md:py-4 rounded-r-full rounded-l-none select-none shadow-[10px_10px_30px_rgba(0,0,0,0.15)] border-l-0 border border-white/5">
            <div className="flex flex-col text-white font-sans text-xs md:text-sm font-light leading-snug">
              <span>Located</span>
              <span>in India</span>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#999f9e] flex items-center justify-center border border-white/10 hover:bg-[#a3a9a8] transition-all duration-500 cursor-pointer group overflow-hidden">
              <span className="group-hover:scale-110 transition-transform duration-500 flex items-center justify-center w-8 h-8 md:w-10 md:h-10">
                <LottiePlayer
                  animationData={globeAnimation}
                  className="w-full h-full opacity-85 group-hover:opacity-100 transition-opacity"
                />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right: Title + arrow */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute left-6 right-6 md:left-auto md:right-24 lg:right-32 top-[68%] md:top-[35%] -translate-y-1/2 flex flex-col items-start justify-center text-left"
        >
          <div className="flex flex-col items-start gap-3 md:gap-5 max-w-xs md:max-w-md text-white select-none">
            <span className="text-white hover:translate-x-1 hover:translate-y-1 transition-transform duration-300">
              <ArrowDownRight size={36} strokeWidth={1.2} />
            </span>
            <h2 className="text-[28px] sm:text-4xl lg:text-[44px] font-heading font-medium tracking-tight leading-tight">
              AI / ML Engineer &<br />
              Backend Developer
            </h2>
          </div>
        </motion.div>

      </div>

      {/*
        Marquee — only mounted + its rAF started once startAnimation is true.
        Previously it ran its useAnimationFrame loop from page load, wasting CPU during preloader.
      */}
      {startAnimation && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute bottom-[6vh] left-0 w-full z-20 select-none pointer-events-none"
        >
          <ScrollVelocityMarquee text="Aryan Khandare — " baseVelocity={2.2} className="py-2" />
        </motion.div>
      )}
    </section>
  );
};

export default Hero;
