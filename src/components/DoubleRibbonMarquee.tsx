import React from 'react';

export const DoubleRibbonMarquee: React.FC = () => {
  const words = [
    "IMMERSIVE",
    "PROTECTED",
    "DEPENDABLE",
    "CAPTIVATING",
    "USER-FRIENDLY",
    "ADAPTIVE",
    "FLUID"
  ];
  
  // Create a clean repeating string of the words separated by the diamond star
  const textString = words.join("  ✦  ") + "  ✦  ";
  
  // Repeat the string to cover the viewport width with buffer
  const repeatedText = Array(4).fill(textString).join(" ");

  return (
    <div className="relative w-full h-0 z-30 pointer-events-none bg-transparent">
      {/* Inline styles for keyframe marquee and gradient flow animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-left {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes move-gradient-left {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: -200% 50%;
          }
        }
        .animate-marquee-left-slow {
          animation: marquee-left 60s linear infinite;
        }
        .animate-gradient-slow {
          background-size: 200% 100%;
          animation: move-gradient-left 25s linear infinite;
        }
      `}} />

      {/* Overflow wrapper to clip horizontal ribbon ends without causing scrollbars, centered vertically on the boundary line */}
      <div className="absolute top-1/2 left-0 right-0 h-[140px] sm:h-[180px] -translate-y-1/2 overflow-hidden bg-transparent">
        {/* Ribbon 1: Tilted slightly downwards (e.g. -2.2deg), scrolls left slowly */}
        <div 
          className="absolute w-[130vw] left-[-15vw] top-[40px] sm:top-[55px] h-[50px] sm:h-[60px] bg-gradient-to-r from-red-600 via-red-700 to-red-600 border-y border-white/20 flex items-center shadow-[0_10px_25px_rgba(0,0,0,0.6)] transform -rotate-[2.2deg] z-10 origin-center"
        >
          <div className="whitespace-nowrap flex select-none overflow-hidden w-full">
            <div className="animate-marquee-left-slow flex whitespace-nowrap text-white text-sm sm:text-base font-bold tracking-[0.2em] font-dennis uppercase leading-none items-center">
              <span className="inline-block pr-2">{repeatedText}</span>
              <span className="inline-block pr-2">{repeatedText}</span>
            </div>
          </div>
        </div>

        {/* Ribbon 2: Tilted slightly upwards (e.g. 2.2deg), no text, slow moving gradient highlight for depth */}
        <div 
          className="absolute w-[130vw] left-[-15vw] top-[40px] sm:top-[55px] h-[50px] sm:h-[60px] bg-gradient-to-r from-red-950 via-red-750 to-red-950 border-y border-white/20 shadow-[0_15px_30px_rgba(0,0,0,0.7)] transform rotate-[2.2deg] z-0 origin-center animate-gradient-slow"
        />
      </div>
    </div>
  );
};

export default DoubleRibbonMarquee;
