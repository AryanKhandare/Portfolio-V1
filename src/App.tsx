import { useEffect, useState, useRef, useCallback } from 'react';
import Lenis from 'lenis';

// Import sections
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Achievements from './sections/Achievements';
import CodingStats from './sections/CodingStats';
import CurrentlyBuilding from './sections/CurrentlyBuilding';
import IdentityCard from './sections/IdentityCard';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

// Import custom components

import StaggeredMenu from './components/StaggeredMenu';
import Preloader from './components/Preloader';
import LogoLoop from './components/LogoLoop';
import ProjectTransitionPreloader from './components/ProjectTransitionPreloader';
import ProjectDetail from './sections/ProjectDetail';
import { projectsList, type Project } from './data/projectsData';
import DoubleRibbonMarquee from './components/DoubleRibbonMarquee';

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPython,
  SiTensorflow,
  SiFlutter,
  SiFastapi,
  SiFirebase,
  SiFigma,
  SiGithub,
  SiOpencv
} from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';

const techLogos = [
  { node: <SiReact className="text-gray-400 hover:text-[#61dafb] transition-colors duration-300" />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs className="text-gray-400 hover:text-white transition-colors duration-300" />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript className="text-gray-400 hover:text-[#3178c6] transition-colors duration-300" />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss className="text-gray-400 hover:text-[#38bdf8] transition-colors duration-300" />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiPython className="text-gray-400 hover:text-[#3776ab] transition-colors duration-300" />, title: "Python", href: "https://www.python.org" },
  { node: <SiTensorflow className="text-gray-400 hover:text-[#ff6f00] transition-colors duration-300" />, title: "TensorFlow", href: "https://www.tensorflow.org" },
  { node: <SiFlutter className="text-gray-400 hover:text-[#02569b] transition-colors duration-300" />, title: "Flutter", href: "https://flutter.dev" },
  { node: <SiFastapi className="text-gray-400 hover:text-[#009688] transition-colors duration-300" />, title: "FastAPI", href: "https://fastapi.tiangolo.com" },
  { node: <SiFirebase className="text-gray-400 hover:text-[#ffca28] transition-colors duration-300" />, title: "Firebase", href: "https://firebase.google.com" },
  { node: <SiFigma className="text-gray-400 hover:text-[#f24e1e] transition-colors duration-300" />, title: "Figma", href: "https://www.figma.com" },
  { node: <VscCode className="text-gray-400 hover:text-[#007acc] transition-colors duration-300" />, title: "VS Code", href: "https://code.visualstudio.com" },
  { node: <SiGithub className="text-gray-400 hover:text-white transition-colors duration-300" />, title: "GitHub", href: "https://github.com" },
  { node: <SiOpencv className="text-gray-400 hover:text-[#5c3ee8] transition-colors duration-300" />, title: "OpenCV", href: "https://opencv.org" },
];

function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [startHeroAnim, setStartHeroAnim] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [pendingProject, setPendingProject] = useState<Project | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'enter' | 'exit'>('enter');

  // Ref mirrors — keeps GSAP timeline callbacks from reading stale state
  const pendingProjectRef = useRef<Project | null>(null);
  const activeProjectRef = useRef<Project | null>(null);
  const transitionDirRef = useRef<'enter' | 'exit'>('enter');
  // Track whether we need to scroll back to #projects after exit transition
  const scrollToProjectsRef = useRef<boolean>(false);

  // Initialize Lenis Smooth Scrolling (runs once)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    (window as any).lenis = lenis;
    lenis.stop(); // Stopped until greeting preloader finishes

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Disable browser scroll restoration to prevent landing on another section on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    return () => {
      lenis.destroy();
      (window as any).lenis = null;
    };
  }, []);

  // Client-side Custom Router utilizing HTML5 History API
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/project\/([^/]+)$/);
      if (match) {
        const slug = match[1];
        const project = projectsList.find((p) => p.slug === slug);
        if (project) {
          setActiveProject(project);
          activeProjectRef.current = project;
        } else {
          setActiveProject(null);
          activeProjectRef.current = null;
          window.history.replaceState(null, '', '/');
        }
      } else {
        setActiveProject(null);
        activeProjectRef.current = null;
      }
    };

    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // When the greeting preloader finishes, start Lenis
  const handlePreloaderComplete = useCallback(() => {
    // Remove preloader from DOM in the next rAF so its unmount doesn't coincide
    // with the hero content mounting — avoids a heavy simultaneous re-render.
    requestAnimationFrame(() => {
      setShowPreloader(false);
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.start();
        lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
    });
  }, []);

  const navigateToProject = useCallback((project: Project) => {
    pendingProjectRef.current = project;
    transitionDirRef.current = 'enter';
    setPendingProject(project);
    setTransitionDirection('enter');
    setIsTransitioning(true);
  }, []);

  const navigateToHome = useCallback(() => {
    transitionDirRef.current = 'exit';
    setTransitionDirection('exit');
    setIsTransitioning(true);
  }, []);

  const handleTransitionHalfway = useCallback(() => {
    const lenis = (window as any).lenis;
    const dir = transitionDirRef.current;

    if (dir === 'enter' && pendingProjectRef.current) {
      const proj = pendingProjectRef.current;
      setActiveProject(proj);
      activeProjectRef.current = proj;
      window.history.pushState({ slug: proj.slug }, '', `/project/${proj.slug}`);
      scrollToProjectsRef.current = false;
      if (lenis) lenis.scrollTo(0, { immediate: true });
    } else if (dir === 'exit') {
      setActiveProject(null);
      activeProjectRef.current = null;
      window.history.pushState(null, '', '/');
      // Flag that we need to scroll to #projects once Lenis restarts
      scrollToProjectsRef.current = true;
      // Immediately reset scroll position to top so the main page mounts cleanly
      window.scrollTo(0, 0);
    }
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
    setPendingProject(null);
    pendingProjectRef.current = null;
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.start();
      // After exit transition, scroll back to the projects section
      if (scrollToProjectsRef.current) {
        scrollToProjectsRef.current = false;
        requestAnimationFrame(() => {
          const projSec = document.getElementById('projects');
          if (projSec && lenis) {
            lenis.scrollTo(projSec, { immediate: true });
          }
        });
      }
    }
  }, []);

  const menuItems = [
    { label: 'Home', ariaLabel: 'Scroll to Home', link: '#hero' },
    { label: 'About', ariaLabel: 'Scroll to About', link: '#about' },
    { label: 'Skills', ariaLabel: 'Scroll to Skills', link: '#skills' },
    { label: 'Achievements', ariaLabel: 'Scroll to Achievements', link: '#achievements' }
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://x.com/aryankhandare' },
    { label: 'GitHub', link: 'https://github.com/aryankhandare' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/in/aryan-khandare?utm_source=share_via&utm_content=profile&utm_medium=member_android' }
  ];

  return (
    <div className="bg-bg-dark text-white select-none relative overflow-x-hidden min-h-screen">
      {/* Multilingual Greeting Preloader */}
      {showPreloader && (
        <Preloader
          onComplete={handlePreloaderComplete}
          onExitStart={() => {
            // Delay hero animation start by 600ms after the curtain begins sweeping.
            // The GSAP sweep takes ~850ms total; firing at 600ms means the curtain is
            // ~70% off screen before framer-motion begins, eliminating GPU contention.
            setTimeout(() => setStartHeroAnim(true), 600);
          }}
        />
      )}


      {/* Fullscreen Animated Transition Preloader */}
      {isTransitioning && (
        <ProjectTransitionPreloader
          projectName={transitionDirection === 'enter' ? (pendingProject?.title || '') : (activeProject?.title || '')}
          direction={transitionDirection}
          onTransitionHalfway={handleTransitionHalfway}
          onTransitionComplete={handleTransitionComplete}
        />
      )}

      {activeProject ? (
        <ProjectDetail project={activeProject} onClose={navigateToHome} />
      ) : (
        <>
          {/* Floating Staggered Side Menu */}
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials
            displayItemNumbering={true}
            menuButtonColor="#ffffff"
            openMenuButtonColor="#000000"
            changeMenuColorOnOpen={true}
            colors={['#161b19', '#4c1d95', '#a855f7']}
            accentColor="#a855f7"
            isFixed={true}
            onMenuOpen={() => console.log('Menu opened')}
            onMenuClose={() => console.log('Menu closed')}
          />


          {/* Page Sections */}
          <Hero startAnimation={startHeroAnim} />
          <About />

          {/* Logo Loop moving Right */}
          <div className="py-8 bg-[#050505] border-y border-white/5 relative overflow-hidden z-20">
            <LogoLoop
              logos={techLogos}
              speed={60}
              direction="right"
              logoHeight={50}
              gap={80}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="#050505"
              ariaLabel="Technology partners right"
            />
          </div>

          <Skills />

          {/* Logo Loop moving Left */}
          <div className="py-8 bg-[#050505] border-y border-white/5 relative overflow-hidden z-20">
            <LogoLoop
              logos={techLogos}
              speed={60}
              direction="left"
              logoHeight={50}
              gap={80}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="#050505"
              ariaLabel="Technology partners left"
            />
          </div>

          <Projects onSelectProject={navigateToProject} />
          <Experience />
          <DoubleRibbonMarquee />
          <Achievements />
          <CodingStats />
          <CurrentlyBuilding />
          <IdentityCard />
          <Contact />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
