import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, ExternalLink, Shield, Cpu, RefreshCw, Layers } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import type { Project } from '../data/projectsData';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax Tilt values for the Laptop Mockup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring constants for luxurious Awwwards feeling
  const mouseSpringConfig = { damping: 25, stiffness: 120 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), mouseSpringConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), mouseSpringConfig);
  const glareX = useSpring(useTransform(x, [-0.5, 0.5], ['-10%', '110%']), mouseSpringConfig);

  const handleLaptopMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Normalize coordinates from -0.5 to 0.5
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleLaptopMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      lenis.start();
    }
  }, [project]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#050505] text-white min-h-screen relative overflow-hidden"
    >
      {/* Background Ambient Glow Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-accent/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-blue-accent/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-purple-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Glass Floating Back Nav */}
      <div className="sticky top-0 w-full z-50 px-6 py-4 bg-[#050505]/75 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
        <button
          onClick={onClose}
          className="group flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 hover:border-white/30 transition-all duration-300 bg-white/5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest font-mono font-medium text-white/80 group-hover:text-white">
            Back to Projects
          </span>
        </button>
        <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase hidden sm:block">
          Case Study // {project.category}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 flex flex-col gap-24 md:gap-32">
        {/* ================= HERO SECTION ================= */}
        <section className="flex flex-col gap-6 md:gap-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-3 py-1 rounded-full bg-purple-accent/10 border border-purple-accent/20 text-purple-accent text-xs font-mono tracking-wider uppercase inline-block mb-4">
              {project.category}
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black font-heading tracking-tight text-white uppercase leading-none">
              {project.title}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-light leading-relaxed max-w-3xl">
              {project.subtitle}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded bg-white/5 border border-white/10 text-white/80 text-xs font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ================= LAPTOP MOCKUP SHOWCASE ================= */}
        <section className="w-full flex justify-center items-center py-8">
          <div
            className="w-full max-w-5xl perspective-[1200px]"
            onMouseMove={handleLaptopMouseMove}
            onMouseLeave={handleLaptopMouseLeave}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full flex flex-col items-center select-none"
            >
              {/* Laptop Screen Bezel */}
              <div 
                className="relative w-[92%] aspect-[16/10] bg-[#0c0c0c] rounded-t-[2.2vw] p-[0.8%] border-t border-x border-white/20 shadow-[0_-15px_40px_-10px_rgba(255,255,255,0.05)] overflow-hidden"
                style={{
                  boxShadow: '0 40px 100px -30px rgba(0,0,0,0.9), 0 0 80px rgba(168,85,247,0.1)'
                }}
              >
                {/* Webcam Node & Ambient Sensor */}
                <div className="absolute top-[0.6%] left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-40">
                  <div className="w-[4px] h-[4px] rounded-full bg-[#111]" />
                  <div className="w-[5px] h-[5px] rounded-full bg-[#041108] border border-blue-900/30 flex items-center justify-center">
                    <div className="w-[2px] h-[2px] rounded-full bg-blue-400/40" />
                  </div>
                </div>

                {/* Inner Screen Content */}
                <div className="w-full h-full relative bg-black rounded-[1.2vw] overflow-hidden border border-black/80">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  {/* Dynamic Glass Glare Sweep */}
                  <motion.div
                    style={{ left: glareX }}
                    className="absolute inset-y-0 w-[40%] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] pointer-events-none z-30"
                  />
                  {/* Subtle Screen Ambient Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15 pointer-events-none z-20" />
                </div>
              </div>

              {/* Laptop Keyboard Base Hinge Joiner */}
              <div className="w-[92.4%] h-[1vw] bg-gradient-to-b from-[#101010] to-[#1a1a1a] border-t border-white/5 relative z-10" />

              {/* Laptop Keyboard Base Tray */}
              <div 
                className="w-full h-[3vw] bg-gradient-to-b from-[#222224] via-[#1a1a1c] to-[#0c0c0e] rounded-b-[2vw] border-t border-white/20 relative flex justify-center z-10"
                style={{
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 35px 70px -10px rgba(0,0,0,0.9)'
                }}
              >
                {/* Front Lip Display Opening Indentation Notch */}
                <div className="w-[15%] h-[28%] bg-black/60 rounded-b-[0.4vw] border-x border-b border-white/5 relative z-20" />
                
                {/* Metallic Beveled Edge Reflection */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= PROJECT OVERVIEW ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Main Copy (Column Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h2 className="text-xs uppercase font-mono tracking-[0.2em] text-purple-accent font-semibold">
                01 / The Concept
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold font-heading uppercase text-white tracking-tight">
                Problem & Solution Matrix
              </h3>
            </div>
            
            {/* Bento Style Content Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-heading font-semibold uppercase text-white">
                  The Problem
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  {project.problem}
                </p>
              </div>

              <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-heading font-semibold uppercase text-white">
                  The Solution
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Architecture Details */}
            <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-blue-accent" />
                <h4 className="text-lg font-heading font-semibold uppercase text-white">
                  System Architecture
                </h4>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {project.architecture}
              </p>
            </div>

            {/* Challenges & Overcoming details */}
            <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-purple-accent" />
                <h4 className="text-lg font-heading font-semibold uppercase text-white">
                  Engineering Challenges
                </h4>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {project.challenges}
              </p>
            </div>
          </div>

          {/* Key Capabilities Sidebar (Column Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs uppercase font-mono tracking-[0.2em] text-blue-accent font-semibold">
                02 / Spec Sheet
              </h2>
              <h3 className="text-2xl font-bold font-heading uppercase text-white tracking-tight">
                Key Features
              </h3>
            </div>
            
            <div className="flex flex-col gap-4">
              {project.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-start gap-4"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-accent/10 text-purple-accent flex items-center justify-center text-xs font-mono font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-gray-300 leading-relaxed font-medium">
                    {feat}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PROJECT GALLERY ================= */}
        <section className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-xs uppercase font-mono tracking-[0.2em] text-purple-accent font-semibold">
              03 / Gallery Showcase
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold font-heading uppercase text-white tracking-tight">
              Interface Exhibition
            </h3>
          </div>

          {/* Bento Grid Gallery Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 relative group cursor-pointer bg-white/5">
              <img
                src={project.gallery[0]}
                alt="UI screen 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-xs font-mono tracking-widest text-white uppercase">User Dashboard Flow</span>
              </div>
            </div>
            <div className="md:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 relative group cursor-pointer bg-white/5">
              <img
                src={project.gallery[1]}
                alt="UI screen 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-xs font-mono tracking-widest text-white uppercase">Neural Mapping Vector Graph</span>
              </div>
            </div>
            <div className="md:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 relative group cursor-pointer bg-white/5">
              <img
                src={project.gallery[2]}
                alt="UI screen 3"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-xs font-mono tracking-widest text-white uppercase">Realtime Analytics telemetry</span>
              </div>
            </div>
            <div className="md:col-span-7 aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 relative group cursor-pointer bg-white/5">
              <img
                src={project.gallery[3]}
                alt="UI screen 4"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-xs font-mono tracking-widest text-white uppercase">Responsive Interface Bezel layout</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TECH STACK pills section ================= */}
        <section className="flex flex-col gap-8 md:gap-10 border-t border-white/5 pt-16">
          <div className="flex flex-col gap-4 text-center items-center">
            <h2 className="text-xs uppercase font-mono tracking-[0.2em] text-blue-accent font-semibold">
              04 / Build Environment
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold font-heading uppercase text-white tracking-tight">
              Technologies Stacked
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {project.techStack.map((tech, idx) => (
              <div
                key={idx}
                className="px-6 py-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-accent/30 hover:bg-purple-accent/5 transition-all duration-300 text-center flex flex-col items-center gap-2 group cursor-default"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                <span className="text-sm font-semibold tracking-wider font-heading uppercase text-white group-hover:text-purple-accent transition-colors">
                  {tech}
                </span>
                <span className="text-[9px] font-mono uppercase text-white/30 tracking-widest">
                  Active Spec
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= LIVE LINKS SECTION ================= */}
        <section className="flex flex-col items-center gap-8 border-t border-white/5 pt-16 pb-12">
          <div className="flex flex-col gap-4 text-center items-center mb-4">
            <h2 className="text-xs uppercase font-mono tracking-[0.2em] text-purple-accent font-semibold">
              05 / Connect
            </h2>
            <h3 className="text-3xl sm:text-5xl font-black font-heading uppercase text-white tracking-tight">
              Ready to Explore?
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 rounded-full text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 flex items-center justify-center gap-2 text-white transition-all duration-300 cursor-pointer"
            >
              <SiGithub className="w-4 h-4" />
              Source GitHub
            </a>
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 rounded-full text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-transparent hover:text-white border border-white flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-none cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demonstration
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetail;
