import React from 'react';

interface Experiment {
  title: string;
  tag: string;
  status: 'active' | 'alpha' | 'research';
  statusText: string;
  description: string;
  codeSnippet: string;
}

export const CurrentlyBuilding: React.FC = () => {
  const experimentsList: Experiment[] = [
    {
      title: 'AetherVoice AI',
      tag: 'VOICE SYNTHESIS',
      status: 'active',
      statusText: 'TRAINING MODEL',
      description: 'Developing high-fidelity, low-latency conversational speech synthesis cloning, utilizing WebRTC and PyTorch backends.',
      codeSnippet: 'import voice_cloner as vc\nmodel = vc.load("aethervoice-v2")\nmodel.synthesize(text, voice_reference)',
    },
    {
      title: 'Deepfake Classifier',
      tag: 'COMPUTER VISION',
      status: 'alpha',
      statusText: 'TESTING SYSTEM',
      description: 'Building deep neural network classification tools detecting minor facial compression and warp artifacts in spatial-temporal domains.',
      codeSnippet: 'def detect_deepfake(frame):\n  face = crop_face(frame)\n  return classifier.predict(face)',
    },
    {
      title: 'AutoRAG Multi-Agent',
      tag: 'LLM & AGENTS',
      status: 'research',
      statusText: 'PROTOTYPING',
      description: 'An autonomous agent network routing semantic knowledge queries dynamically across separate vector stores depending on target confidence.',
      codeSnippet: 'agent = AutoRAGAgent(stores=[pincone_db, chroma_db])\nresponse = agent.route(query)',
    },
  ];

  return (
    <section
      id="currently-building"
      className="relative w-full bg-bg-dark text-white px-6 pt-16 pb-20 lg:pt-20 lg:pb-24 overflow-hidden border-t border-white/5"
    >
      <div className="glow-blob w-[400px] h-[400px] bg-purple-accent/5 top-0 left-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-purple-accent font-heading text-xs font-semibold uppercase tracking-widest block mb-3">
            07 / LAB LOGS
          </span>
          <h2 className="section-heading">Currently Building</h2>
          <p className="text-gray-400 text-sm max-w-lg mt-4">
            A sneak peek into my local workspace. Active neural network training runs, product ideas, and design system drafts.
          </p>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experimentsList.map((exp, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col justify-between gap-6 relative overflow-hidden group hover:border-purple-accent/30 transition-all duration-300"
            >
              {/* Dynamic Status Tag */}
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold font-heading uppercase text-purple-accent bg-purple-accent/10 border border-purple-accent/20 px-2.5 py-1 rounded-md">
                  {exp.tag}
                </span>
                
                <span className={`text-[10px] font-mono font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
                  exp.status === 'active' 
                    ? 'text-green-400 bg-green-500/10 border border-green-500/20' 
                    : exp.status === 'alpha'
                    ? 'text-blue-accent bg-blue-accent/10 border border-blue-accent/20'
                    : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    exp.status === 'active' 
                      ? 'bg-green-400 animate-pulse' 
                      : exp.status === 'alpha'
                      ? 'bg-blue-accent'
                      : 'bg-amber-400'
                  }`} />
                  {exp.statusText}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2 mb-2 group-hover:text-purple-accent transition-colors">
                  {exp.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {exp.description}
                </p>
              </div>

              {/* Simulated Code Panel */}
              <div className="bg-black/50 border border-white/5 p-4 rounded-2xl font-mono text-[11px] text-gray-400 relative overflow-hidden flex flex-col gap-2">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-[10px] text-gray-500">
                  <span>TERMINAL LOG</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed select-none">
                  {exp.codeSnippet}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurrentlyBuilding;
