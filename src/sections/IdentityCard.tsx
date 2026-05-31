import React, { useRef } from 'react';
import Lanyard from '../components/Lanyard';

export const IdentityCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const text = "Let's create something extraordinary together! •";

  return (
    <section
      ref={containerRef}
      id="identity-card"
      className="relative w-full h-screen bg-[#000000] overflow-hidden border-t border-white/5 flex items-center justify-center"
    >
      <style>{`
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent, white 8%, white 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 8%, white 92%, transparent);
        }
        @keyframes marquee-drift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-25%, 0, 0);
          }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-drift 8s linear infinite;
        }
      `}</style>

      {/* 1. Oversized Animated Typography Section (Cinematic Heading Transition, aligned to the top start of the visible lanyard) */}
      <div className="absolute top-[8%] left-0 right-0 w-full overflow-hidden pointer-events-none select-none z-20 mask-gradient">
        <div className="marquee-track flex whitespace-nowrap flex-nowrap font-dennis font-normal text-5xl sm:text-7xl md:text-8xl tracking-tight leading-none text-white/95">
          <span className="inline-block mr-12">{text}</span>
          <span className="inline-block mr-12">{text}</span>
          <span className="inline-block mr-12">{text}</span>
          <span className="inline-block mr-12">{text}</span>
        </div>
      </div>

      {/* 2. Full screen Lanyard Canvas (z-10, lanyard anchor at [0, 4.0, 0], camera at z = 18 to match reference scale and allow card to swing fully) */}
      <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center">
        <Lanyard position={[0, 0, 18]} gravity={[0, -40, 0]} anchorPosition={[0, 4.0, 0]} />
      </div>
    </section>
  );
};

export default IdentityCard;
