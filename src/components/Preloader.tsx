import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
  onExitStart?: () => void;
}

const greetings = [
  "Hello",       // English
  "Bonjour",     // French
  "Hola",        // Spanish
  "Ciao",        // Italian
  "Hallo",       // German
  "こんにちは",   // Japanese
  "你好",         // Chinese
  "नमस्ते",       // Hindi
  "नमस्कार",      // Marathi
  "안녕하세요",   // Korean
  "Olá",         // Portuguese
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, onExitStart }) => {
  const overlayRef  = useRef<HTMLDivElement | null>(null);
  const wordRef     = useRef<HTMLSpanElement | null>(null);
  const dotRef      = useRef<HTMLSpanElement | null>(null);
  const curveRef    = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';
    const lenis = (window as any).lenis;
    if (lenis) lenis.stop();

    const master = gsap.timeline({ onComplete: handleExit });

    // ── initial entrance: snap in quickly ────────────────
    master.fromTo(
      [dotRef.current, wordRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.18, ease: 'power2.out', stagger: 0.03 }
    );

    // hold first word so it's clearly visible before cycling
    master.to({}, { duration: 0.25 });

    // ── cycle words ───────────────────────────────────────
    for (let i = 1; i < greetings.length; i++) {
      // fade out fast
      master.to([dotRef.current, wordRef.current], {
        opacity: 0,
        y: -10,
        duration: 0.10,
        ease: 'power2.in',
        delay: 0.11,          // how long each word stays visible
        stagger: 0.01,
      });

      // swap text mid-transition via direct DOM manipulation to bypass React render overhead
      master.add(() => {
        if (wordRef.current) {
          wordRef.current.textContent = greetings[i];
        }
      });

      // fade in fast
      master.fromTo(
        [dotRef.current, wordRef.current],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.12, ease: 'power3.out', stagger: 0.01 }
      );
    }

    // hold last word briefly
    master.to({}, { duration: 0.25 });

    return () => { master.kill(); };
  }, []);

  // ── exit: curtain sweep up ────────────────────────────
  const handleExit = () => {
    if (onExitStart) onExitStart();
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        const lenis = (window as any).lenis;
        if (lenis) lenis.start();
        onComplete();
      },
    });

    // fade text out quickly
    tl.to([dotRef.current, wordRef.current], {
      opacity: 0,
      y: -20,
      duration: 0.20,
      ease: 'power2.in',
    });

    // bulge the SVG curve downwards
    if (curveRef.current) {
      tl.to(curveRef.current, {
        attr: { d: 'M0 0 C25 0, 25 100, 50 100 C75 100, 75 0, 100 0 Z' },
        duration: 0.35,
        ease: 'power2.out',
      }, 0.1);
    }

    // sweep the overlay up (130vh to fully clear the 30vh SVG curve)
    tl.to(overlayRef.current, {
      yPercent: -130,
      duration: 0.85,
      ease: 'power3.inOut',
    }, 0.15);

    // flatten the curve back to 0 as it exits the screen
    if (curveRef.current) {
      tl.to(curveRef.current, {
        attr: { d: 'M0 0 C25 0, 25 0, 50 0 C75 0, 75 0, 100 0 Z' },
        duration: 0.35,
        ease: 'power2.in',
      }, '>-0.45');
    }
  };

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        overflow: 'hidden',
        willChange: 'transform',
      }}
    >
      {/* Dot + Word row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span
          ref={dotRef}
          style={{
            display: 'block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#ffffff',
            flexShrink: 0,
            marginTop: '4px',
          }}
        />
        <span
          ref={wordRef}
          style={{
            color: '#ffffff',
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 500,
            fontFamily: "'Inter', 'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            letterSpacing: '0.01em',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {greetings[0]}
        </span>
      </div>

      {/* Liquid SVG edge for exit sweep */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '30vh',
          transform: 'translateY(100%)',
          pointerEvents: 'none',
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={curveRef}
          d="M0 0 C25 0, 25 0, 50 0 C75 0, 75 0, 100 0 Z"
          fill="#0a0a0a"
        />
      </svg>
    </div>
  );
};

export default Preloader;
