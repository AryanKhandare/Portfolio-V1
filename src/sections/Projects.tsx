import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import FlowingMenu from '../components/FlowingMenu';
import MagneticButton from '../components/MagneticButton';
import { projectsList, type Project } from '../data/projectsData';

interface ProjectsProps {
  onSelectProject: (project: Project) => void;
}

const slideVariants = {
  initial: (direction: 'up' | 'down') => ({
    y: direction === 'down' ? '105%' : '-105%',
    opacity: 0,
  }),
  animate: {
    y: '0%',
    opacity: 1,
  },
  exit: (direction: 'up' | 'down') => ({
    y: direction === 'down' ? '-105%' : '105%',
    opacity: 0,
  }),
};

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  const [expanded, setExpanded] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState<'up' | 'down'>('down');

  // Slice project list based on expanded state
  const visibleProjects = expanded ? projectsList : projectsList.slice(0, 5);

  // Mouse movement tracking for cursor-following preview card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cursor follow (damping / stiffness tuned for luxury feel)
  const springConfig = { damping: 30, stiffness: 220, mass: 0.5 };
  const floatX = useSpring(mouseX, springConfig);
  const floatY = useSpring(mouseY, springConfig);

  // Velocity based rotation (jelly tilt effect)
  const lastX = useRef(0);
  const rotateVal = useMotionValue(0);
  const rotateSpring = useSpring(rotateVal, { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const diffX = e.clientX - lastX.current;
    lastX.current = e.clientX;

    // Apply rotation based on mouse speed, clamped to a premium range
    const rotationAmt = Math.min(Math.max(diffX * 0.22, -12), 12);
    rotateVal.set(rotationAmt);

    // Center the card offset (card width: 440px / 2 = 220px, height: 280px / 2 = 140px)
    mouseX.set(e.clientX - 220);
    mouseY.set(e.clientY - 140);
  };

  const handleMouseEnterRow = (idx: number, e: React.MouseEvent) => {
    if (hoveredIdx === null) {
      mouseX.set(e.clientX - 220);
      mouseY.set(e.clientY - 140);
      setDirection('down');
    } else {
      if (idx > hoveredIdx) {
        setDirection('down');
      } else if (idx < hoveredIdx) {
        setDirection('up');
      }
    }
    setHoveredIdx(idx);
  };

  const handleMouseLeaveList = () => {
    setHoveredIdx(null);
    rotateVal.set(0);
  };

  // Map projects to FlowingMenu compatible format
  const flowingItems = visibleProjects.map((project, idx) => ({
    id: project.id,
    text: project.title,
    image: project.image,
    category: project.category,
    onClick: () => onSelectProject(project),
    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => handleMouseEnterRow(idx, e),
    onMouseLeave: () => handleMouseLeaveList()
  }));

  return (
    <section
      id="projects"
      className="relative w-full bg-[#030303] text-white px-6 pt-16 pb-20 lg:pt-20 lg:pb-24 overflow-hidden border-t border-white/5"
      onMouseMove={handleMouseMove}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-purple-accent font-heading text-xs font-semibold uppercase tracking-widest block mb-3">
            03 / Selected Works
          </span>
          <h2 className="section-heading">Projects</h2>
          <p className="text-gray-400 text-sm font-medium leading-relaxed font-sans max-w-lg">
            Hover to preview work in realtime. Click to inspect complete problem matrices, stack analysis, and live environments.
          </p>
        </div>

        {/* Project horizontal flowing menu rows container */}
        <div className="relative flex flex-col border-t border-white/10 mt-10">
          <FlowingMenu
            items={flowingItems}
            speed={15}
            textColor="#ffffff"
            bgColor="transparent"
            marqueeBgColor="var(--color-deep-space-blue, #1a2ffb)"
            marqueeTextColor="#ffffff"
            borderColor="rgba(255, 255, 255, 0.1)"
          />
        </div>

        {/* Premium Magnetic "More Works" Button - only show if there are projects beyond the initial 5 */}
        {projectsList.length > 5 && (
          <div className="flex justify-center mt-16">
            <MagneticButton
              onClick={() => setExpanded(!expanded)}
              className="px-8 py-4 rounded-full border border-white/10 bg-white/5 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:border-purple-accent/40 font-mono shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer"
              glowColor="rgba(168, 85, 247, 0.2)"
            >
              <span className="relative z-10 flex items-center gap-2">
                {expanded ? 'Show Less Works' : 'More Works'}
              </span>
            </MagneticButton>
          </div>
        )}
      </div>

      {/* Floating Screenshot Portal - Desktop Only */}
      <div className="hidden md:block">
        <AnimatePresence>
          {hoveredIdx !== null && visibleProjects[hoveredIdx] && (
            <motion.div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                x: floatX,
                y: floatY,
                rotate: rotateSpring,
                width: 440,
                height: 280,
                pointerEvents: 'none',
                zIndex: 40,
              }}
              initial={{ opacity: 0, scale: 0.85, filter: 'blur(15px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.85, filter: 'blur(15px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(168,85,247,0.15)] relative bg-[#121212]/90 backdrop-blur-md">
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.img
                    key={hoveredIdx}
                    custom={direction}
                    src={visibleProjects[hoveredIdx].image}
                    alt={visibleProjects[hoveredIdx].title}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{
                      y: { type: 'spring', damping: 26, stiffness: 170, mass: 0.6 },
                      opacity: { duration: 0.25 }
                    }}
                  />
                </AnimatePresence>
                {/* Floating "View" badge overlay */}
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.05, duration: 0.3, ease: 'easeOut' }}
                    className="w-16 h-16 rounded-full bg-purple-accent flex items-center justify-center shadow-[0_0_25px_#a855f7]"
                  >
                    <span className="text-white text-xs font-bold uppercase tracking-widest font-heading">
                      View
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
