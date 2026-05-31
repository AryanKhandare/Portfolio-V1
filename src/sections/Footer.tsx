import React from 'react';

interface FooterLinkProps {
  onClick: () => void;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer text-left group"
    >
      <span className="relative py-0.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
        {children}
      </span>
      <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-xs text-white">
        →
      </span>
    </button>
  );
};

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    const lenis = (window as any).lenis;
    if (lenis) {
      const element = document.getElementById(id);
      if (element) lenis.scrollTo(element);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="w-full bg-bg-dark text-gray-500 pt-6 pb-12 px-6 relative z-10">
      
      {/* Footer Card Panel */}
      <div className="max-w-7xl mx-auto bg-[#0d0d0d] border border-white/5 rounded-[2rem] p-8 sm:p-12 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Mission Statement Column */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <h3 
              onClick={() => scrollTo('hero')}
              className="text-white text-3xl font-bold tracking-tight cursor-pointer font-sans w-fit hover:text-purple-accent transition-colors"
            >
              ARYAN
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mt-4 font-sans max-w-sm">
              Building digital experiences that matter, one line of code at a time. Crafting interfaces that feel alive, solving problems that make a difference, and turning ideas into reality. Every pixel has a purpose. Every interaction tells a story.
            </p>
          </div>

          {/* General Links Column */}
          <div className="lg:col-span-2 flex flex-col gap-4 font-sans">
            <span className="text-gray-300 text-sm font-semibold tracking-wide">General</span>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm">
              <li>
                <FooterLink onClick={() => scrollTo('hero')}>
                  Home
                </FooterLink>
              </li>
              <li>
                <FooterLink onClick={() => scrollTo('about')}>
                  About Me
                </FooterLink>
              </li>
              <li>
                <FooterLink onClick={() => scrollTo('skills')}>
                  Skills
                </FooterLink>
              </li>
              <li>
                <FooterLink onClick={() => scrollTo('experience')}>
                  Experience
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* About Links Column */}
          <div className="lg:col-span-2 flex flex-col gap-4 font-sans">
            <span className="text-gray-300 text-sm font-semibold tracking-wide">About</span>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm">
              <li>
                <FooterLink onClick={() => scrollTo('about')}>
                  About Me
                </FooterLink>
              </li>
              <li>
                <FooterLink onClick={() => scrollTo('projects')}>
                  Projects
                </FooterLink>
              </li>
              <li>
                <FooterLink onClick={() => scrollTo('contact')}>
                  Contact
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* Startup / Works Column */}
          <div className="lg:col-span-2 flex flex-col gap-4 font-sans">
            <span className="text-gray-300 text-sm font-semibold tracking-wide">Startup</span>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm">
              <li>
                <FooterLink onClick={() => scrollTo('projects')}>
                  JobMatchAI
                </FooterLink>
              </li>
              <li>
                <FooterLink onClick={() => scrollTo('projects')}>
                  MindVerse
                </FooterLink>
              </li>
              <li>
                <FooterLink onClick={() => scrollTo('projects')}>
                  NeuroLearn
                </FooterLink>
              </li>
              <li>
                <FooterLink onClick={() => scrollTo('projects')}>
                  CrimeDashboard
                </FooterLink>
              </li>
              <li>
                <FooterLink onClick={() => scrollTo('projects')}>
                  TrackPhone
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="lg:col-span-2 flex flex-col gap-4 font-sans">
            <span className="text-gray-300 text-sm font-semibold tracking-wide">Legal</span>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm">
              <li>
                <FooterLink onClick={() => alert('Privacy Policy details coming soon')}>
                  Privacy Policy
                </FooterLink>
              </li>
              <li>
                <FooterLink onClick={() => alert('Terms & Conditions coming soon')}>
                  Terms & Conditions
                </FooterLink>
              </li>
            </ul>

            {/* DMCA Badge */}
            <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2d2d2d] rounded py-1 px-1.5 w-fit mt-2 select-none">
              <span className="bg-[#b31b1b] text-white text-[8px] font-bold px-1 py-0.5 rounded-sm tracking-wide">DMCA</span>
              <span className="text-[#a0a0a0] text-[8px] font-semibold tracking-wider">PROTECTED</span>
            </div>
            <p className="text-[10px] text-gray-600 leading-normal">
              This site is protected. Read our <span className="underline hover:text-white cursor-pointer transition-all" onClick={() => alert('Privacy Policy details coming soon')}>Privacy Policy</span> & <span className="underline hover:text-white cursor-pointer transition-all" onClick={() => alert('Terms & Conditions coming soon')}>Terms</span>.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans tracking-wide">
        <div className="text-gray-600 text-center sm:text-left">
          &copy; {currentYear} ARYAN KHANDARE. ALL RIGHTS RESERVED.
        </div>
        
        {/* Social SVGs */}
        <div className="flex items-center gap-6 text-gray-500">
          <a href="https://github.com/aryankhandare" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="GitHub">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/aryan-khandare?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="LinkedIn">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
          <a href="https://x.com/aryankhandare" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="X (Twitter)">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="https://t.me/aryankhandare" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Telegram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.393c-.16.16-.295.293-.605.293l.213-3.053 5.56-5.022c.242-.214-.054-.334-.376-.12l-6.87 4.326-2.962-.924c-.643-.201-.657-.643.136-.953l11.57-4.458c.536-.196.997.12.798.981z" />
            </svg>
          </a>
          <a href="https://instagram.com/aryankhandare" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Instagram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
