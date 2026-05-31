import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import aryanCard from '../assets/Aryan_card.jpeg';

interface FormData {
  name: string;
  email: string;
  organization: string;
  services: string;
  message: string;
}

const QUESTIONS = [
  {
    id: '01',
    label: "What's your name?",
    placeholder: 'John Doe',
    field: 'name' as keyof FormData,
    type: 'text',
  },
  {
    id: '02',
    label: "What's your email address?",
    placeholder: 'john@example.com',
    field: 'email' as keyof FormData,
    type: 'email',
  },
  {
    id: '03',
    label: "What's the name of your organization?",
    placeholder: 'Your Company / Startup / Personal',
    field: 'organization' as keyof FormData,
    type: 'text',
  },
  {
    id: '04',
    label: 'What services are you looking for?',
    placeholder: 'AI/ML Development, Full-Stack, Computer Vision, Research...',
    field: 'services' as keyof FormData,
    type: 'text',
  },
  {
    id: '05',
    label: 'Your message',
    placeholder: 'Tell me more about your project, timeline, and goals...',
    field: 'message' as keyof FormData,
    type: 'textarea',
  },
];

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    organization: '',
    services: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Advanced dynamic removal of the 'Built with Spline' logo/watermark
  useEffect(() => {
    let attempts = 0;
    const hideWatermark = () => {
      attempts++;

      const logos = [
        document.getElementById('logo'),
        document.querySelector('a[href*="spline.design"]'),
        document.querySelector('.spline-wrapper a'),
        ...Array.from(document.querySelectorAll('a')).filter(
          (a) => a.href && a.href.includes('spline')
        ),
      ];

      logos.forEach((logo) => {
        if (logo) {
          (logo as HTMLElement).style.setProperty('display', 'none', 'important');
          logo.remove();
        }
      });

      const viewers = document.querySelectorAll('spline-viewer');
      viewers.forEach((viewer) => {
        if (viewer && viewer.shadowRoot) {
          const shadowLogos = [
            viewer.shadowRoot.getElementById('logo'),
            viewer.shadowRoot.querySelector('#logo'),
            viewer.shadowRoot.querySelector('a'),
            viewer.shadowRoot.querySelector('a[href*="spline.design"]'),
            ...Array.from(viewer.shadowRoot.querySelectorAll('a')).filter(
              (a) => a.href && a.href.includes('spline')
            ),
          ];
          shadowLogos.forEach((logo) => {
            if (logo) {
              (logo as HTMLElement).style.setProperty('display', 'none', 'important');
              logo.remove();
            }
          });
        }
      });

      const splineWrapper = document.querySelector('.spline-wrapper');
      if (splineWrapper) {
        const elements = splineWrapper.querySelectorAll('div, a');
        elements.forEach((el) => {
          const content = el.textContent || '';
          if (content.includes('Built with') || content.includes('Spline')) {
            (el as HTMLElement).style.setProperty('display', 'none', 'important');
            el.remove();
          }
        });
      }

      if (attempts > 120) {
        clearInterval(interval);
      }
    };

    const interval = setInterval(hideWatermark, 150);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      try {
        const response = await fetch("https://formsubmit.co/ajax/aryankhandare2005@gmail.com", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            Name: formData.name,
            Email: formData.email,
            Organization: formData.organization || 'Not Specified',
            Services: formData.services || 'Not Specified',
            Message: formData.message
          })
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          alert("Oops! There was a problem submitting your form. Please try again.");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        alert("Oops! Something went wrong. Please check your internet connection and try again.");
      }
    }
  };

  const handleSplineLoad = (splineApp: any) => {
    if (splineApp && splineApp.scene) {
      splineApp.scene.traverse((obj: any) => {
        if (
          obj.name &&
          (obj.name.toLowerCase().includes('card') ||
            obj.name.toLowerCase().includes('background') ||
            obj.name.toLowerCase().includes('plate') ||
            obj.name.toLowerCase().includes('rectangle') ||
            obj.name.toLowerCase().includes('base'))
        ) {
          obj.visible = false;
        }
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-bg-dark text-white px-6 pt-24 pb-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 w-full border-b border-white/5 pb-16">
          <div className="flex flex-col">
            <div className="flex items-center gap-4 flex-wrap">
              <img
                src={aryanCard}
                alt="Aryan Khandare"
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              />
              <h2 className="text-4xl sm:text-7xl font-bold tracking-tight text-white font-sans">
                Let's create
              </h2>
            </div>
            <h2 className="text-4xl sm:text-7xl font-bold tracking-tight text-gray-500 font-sans mt-1">
              something real.
            </h2>
          </div>

          {/* 3D Spline Greeting Robot */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:mr-6 flex items-center justify-center spline-wrapper overflow-hidden">
            {/* Glow backdrop */}
            <div className="absolute w-[80%] h-[80%] rounded-full bg-purple-accent/10 blur-3xl pointer-events-none" />

            <Spline
              scene="https://prod.spline.design/J2LicIoetKnSLiK1/scene.splinecode"
              className="w-full h-full"
              onLoad={handleSplineLoad}
            />
          </div>
        </div>

        {/* Numbered Question-Style Contact Form */}
        <div className="max-w-4xl mx-auto mt-16 pb-8">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="flex flex-col"
              >
                {QUESTIONS.map((q, index) => {
                  const isFocused = focusedField === q.field;
                  const hasValue = formData[q.field].length > 0;

                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07, duration: 0.4 }}
                      className={`group flex items-start gap-5 py-6 border-b transition-colors duration-300 ${
                        isFocused ? 'border-white/30' : 'border-white/8'
                      }`}
                    >
                      {/* Question Number */}
                      <span
                        className={`text-xs font-mono mt-1 shrink-0 w-6 transition-colors duration-300 ${
                          isFocused || hasValue ? 'text-white/60' : 'text-white/20'
                        }`}
                      >
                        {q.id}
                      </span>

                      {/* Label + Input Stack */}
                      <div className="flex-1 flex flex-col gap-2">
                        <label
                          className={`text-base sm:text-lg font-medium transition-colors duration-300 ${
                            isFocused ? 'text-white' : hasValue ? 'text-white/80' : 'text-white/50'
                          }`}
                        >
                          {q.label}
                        </label>

                        {q.type === 'textarea' ? (
                          <textarea
                            required={q.field === 'message'}
                            rows={3}
                            value={formData[q.field]}
                            onChange={(e) =>
                              setFormData({ ...formData, [q.field]: e.target.value })
                            }
                            onFocus={() => setFocusedField(q.field)}
                            onBlur={() => setFocusedField(null)}
                            placeholder={q.placeholder}
                            className="w-full bg-transparent text-white/90 text-sm sm:text-base focus:outline-none resize-none placeholder:text-white/20 font-sans leading-relaxed"
                          />
                        ) : (
                          <input
                            type={q.type}
                            required={q.field === 'name' || q.field === 'email'}
                            value={formData[q.field]}
                            onChange={(e) =>
                              setFormData({ ...formData, [q.field]: e.target.value })
                            }
                            onFocus={() => setFocusedField(q.field)}
                            onBlur={() => setFocusedField(null)}
                            placeholder={q.placeholder}
                            className="w-full bg-transparent text-white/90 text-sm sm:text-base focus:outline-none placeholder:text-white/20 font-sans"
                          />
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Submit Button */}
                <motion.div
                  className="flex justify-start mt-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                >
                  <button
                    type="submit"
                    className="group flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 hover:border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-medium text-sm cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                  >
                    Send message
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                      <ArrowRight size={10} />
                    </span>
                  </button>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-center gap-4 py-16"
              >
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white">
                  <Check size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-sans text-white">Message Sent</h3>
                  <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFormData({ name: '', email: '', organization: '', services: '', message: '' });
                    setIsSubmitted(false);
                  }}
                  className="mt-4 px-5 py-2 rounded-full border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default Contact;
