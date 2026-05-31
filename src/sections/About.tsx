import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  Brain, 
  Cpu, 
  Terminal, 
  Download, 
  ArrowRight
} from 'lucide-react';
import { InteractiveFace } from '../components/InteractiveFace';
import RotatingText from '../components/RotatingText';
import SplitText from '../components/SplitText';
import { AboutCard } from '../components/AboutCard';
import { PillButton } from '../components/PillButton';

// Animation variants for staggered scroll reveal
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] as const }
  }
};

const scribbleVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      delay: 0.8
    }
  }
};

export const About: React.FC = () => {
  const [activeWordIdx, setActiveWordIdx] = React.useState(0);


  const cards = [
    {
      icon: <Brain className="text-purple-accent" size={20} />,
      title: 'AI/ML Specialization',
      description: 'Developing high-performance deep learning models, natural language pipelines, and computer vision systems.',
      colorTheme: 'purple' as const
    },
    {
      icon: <Cpu className="text-blue-accent" size={20} />,
      title: 'Human-Centered AI',
      description: 'Creating AI-powered experiences that balance technical excellence with intuitive user interaction and product usability.',
      colorTheme: 'cyan' as const
    },
    {
      icon: <Terminal className="text-pink-accent" size={20} />,
      title: 'Tech Philosophy',
      description: 'Believing in clean code, automated workflows, mathematical modeling, and human-centric UI/UX design.',
      colorTheme: 'pink' as const
    },
  ];

  return (
    <section
      id="about"
      className="relative w-full bg-bg-dark text-white px-6 md:px-12 pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-t border-white/5"
    >
      {/* Background Animated Grid & Glow Blobs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.08] pointer-events-none z-0" />
      <div className="glow-blob w-[450px] h-[450px] bg-purple-accent/8 top-1/4 left-1/4 -translate-x-1/2" />
      <div className="glow-blob w-[400px] h-[400px] bg-blue-accent/5 bottom-1/4 right-1/4 translate-x-1/2" />

      {/* Floating Particles backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        {[...Array(6)].map((_, i) => {
          const size = 3 + (i % 2) * 2;
          const left = `${10 + (i * 18) % 80}%`;
          const top = `${15 + (i * 15) % 70}%`;
          const delay = i * 0.9;
          const duration = 15 + (i % 3) * 5;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                left,
                top,
                background: i % 2 === 0 ? 'var(--color-purple-accent)' : 'var(--color-blue-accent)',
                filter: 'blur(1px)',
              }}
              animate={{
                y: [0, -35, 0],
                x: [0, 15, 0],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="section-heading">About Me</h2>
        
        {/* Editorial 3-Column Symmetrical Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center lg:items-start relative"
        >
          {/* Neural Connector Lines Overlay */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible hidden lg:block"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Top Purple Connection */}
            <path d="M 61 22 L 67 18 L 75 18" stroke="rgba(168, 85, 247, 0.08)" strokeWidth="0.3" fill="none" />
            <motion.path
              d="M 61 22 L 67 18 L 75 18"
              stroke="#a855f7"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeDasharray="1.5, 12"
              fill="none"
              animate={{ strokeDashoffset: [-24, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Middle Cyan Connection */}
            <path d="M 64 48 L 70 50 L 75 50" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="0.3" fill="none" />
            <motion.path
              d="M 64 48 L 70 50 L 75 50"
              stroke="#06b6d4"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeDasharray="1.5, 12"
              fill="none"
              animate={{ strokeDashoffset: [-24, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
            />

            {/* Bottom Pink Connection */}
            <path d="M 61 74 L 67 82 L 75 82" stroke="rgba(236, 72, 153, 0.08)" strokeWidth="0.3" fill="none" />
            <motion.path
              d="M 61 74 L 67 82 L 75 82"
              stroke="#ec4899"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeDasharray="1.5, 12"
              fill="none"
              animate={{ strokeDashoffset: [-24, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          </svg>
          
          {/* ==========================================
              LEFT COLUMN: Main Heading, Bio, CTAs, Stats
             ========================================== */}
          <motion.div
            variants={itemVariants}
            className="col-span-12 lg:col-span-4 flex flex-col items-start text-left gap-8"
          >
            {/* Top Minimal Label */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-purple-accent font-bold uppercase drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                • ABOUT ME
              </span>
            </div>

            {/* Cinematic Heading */}
            <h2 className="text-[26px] sm:text-4xl xl:text-5xl font-bold font-heading tracking-tight text-white leading-[1.1] flex flex-col gap-1.5">
              <span>Pioneering the</span>
              <span>next era of</span>
              <span className="relative inline-block pb-3">
                <RotatingText
                  texts={['Intelligent Products', 'Neural Networks', 'Predictive Models', 'AI Experiences']}
                  onNext={setActiveWordIdx}
                  mainClassName={`font-semibold overflow-hidden py-0.5 justify-start inline-flex transition-colors duration-500 ${
                    activeWordIdx === 0 || activeWordIdx === 3
                      ? 'text-purple-accent drop-shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                      : activeWordIdx === 1
                      ? 'text-blue-accent drop-shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                      : 'text-pink-accent drop-shadow-[0_0_12px_rgba(236,72,153,0.35)]'
                  }`}
                  staggerFrom="last"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-120%", opacity: 0 }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2500}
                  splitBy="characters"
                  auto
                  loop
                />
                {/* SVG Underline Scribble Effect */}
                <svg
                  className={`absolute bottom-0 left-0 w-full h-[10px] transition-colors duration-500 ${
                    activeWordIdx === 0 || activeWordIdx === 3
                      ? 'text-purple-accent/70'
                      : activeWordIdx === 1
                      ? 'text-blue-accent/70'
                      : 'text-pink-accent/70'
                  }`}
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M2,5 Q30,1 55,5 T98,5 Q80,9 50,7 T3,8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    variants={scribbleVariants}
                  />
                </svg>
              </span>
            </h2>

            {/* Editorial Bio Paragraphs */}
            <div className="flex flex-col gap-4 text-sm text-gray-400 leading-relaxed font-light font-sans max-w-lg lg:max-w-none">
              <SplitText
                tag="p"
                textAlign="left"
                delay={20}
                duration={0.8}
                ease="power3.out"
                splitType="words"
                from={{ opacity: 0, y: 15 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-50px"
              >
                I’m <span className="text-purple-accent font-semibold">Aryan Khandare</span>, a product-focused AI & ML Engineer and Full Stack Developer.
              </SplitText>
              <SplitText
                tag="p"
                textAlign="left"
                delay={15}
                duration={0.8}
                ease="power3.out"
                splitType="words"
                from={{ opacity: 0, y: 15 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-50px"
              >
                I build systems that bridge the gap between machine intelligence and immersive, pixel-perfect user experiences.
              </SplitText>
              <SplitText
                tag="p"
                textAlign="left"
                delay={8}
                duration={0.8}
                ease="power3.out"
                splitType="words"
                from={{ opacity: 0, y: 15 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-50px"
              >
                My expertise spans modern neural network architectures, custom large language model integrations, and high-performance full-stack engineering. By combining advanced math with clean engineering, I create products that solve real-world problems.
              </SplitText>
            </div>

            {/* Pill CTA Buttons */}
            <div className="flex items-center gap-6 flex-wrap mt-2">
              {/* Primary Download CV Button */}
              <PillButton
                href="/resume/Aryan_Resume.pdf"
                download
                label="Download CV"
                icon={<Download size={14} />}
                className="text-white font-mono text-[11px] font-bold tracking-wider px-7 py-3.5 rounded-full flex items-center gap-2 bg-gradient-to-r from-purple-accent to-pink-accent drop-shadow-[0_4px_15px_rgba(168,85,247,0.3)] cursor-pointer"
                circleBgColor="#ffffff"
                initialTextColor="#ffffff"
                hoverTextColor="#000000"
              />

              {/* Secondary Contact Button */}
              <PillButton
                href="#contact"
                label="Get In Touch"
                icon={<ArrowRight size={14} />}
                className="text-white font-mono text-[11px] font-bold tracking-wider px-7 py-3.5 rounded-full flex items-center gap-2 bg-transparent border border-white/10 cursor-pointer"
                circleBgColor="var(--color-purple-accent)"
                initialTextColor="#ffffff"
                hoverTextColor="#ffffff"
              />
            </div>


          </motion.div>

          {/* ==========================================
              CENTER COLUMN: Big Portrait Centerpiece
             ========================================== */}
          <motion.div
            variants={itemVariants}
            className="col-span-12 lg:col-span-5 flex justify-center items-center py-6 lg:py-0 overflow-visible"
          >
            <InteractiveFace />
          </motion.div>

          {/* ==========================================
              RIGHT COLUMN: 3 Glassmorphism Feature Cards
             ========================================== */}
          <motion.div
            variants={itemVariants}
            className="col-span-12 lg:col-span-3 flex flex-col gap-6 items-center lg:items-start text-left w-full"
          >
            <div className="flex flex-col gap-5 w-full">
              {cards.map((card, idx) => (
                <AboutCard
                  key={idx}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  colorTheme={card.colorTheme}
                />
              ))}
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};

export default About;
