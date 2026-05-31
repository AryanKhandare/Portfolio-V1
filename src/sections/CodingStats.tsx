import React, { useState, useEffect } from 'react';
import { Code, ShieldCheck, TrendingUp } from 'lucide-react';
import { GitHubCalendar } from 'react-github-calendar';
import { motion } from 'framer-motion';
import AICoreCanvas from '../components/AICoreCanvas';

interface GitHubStats {
  publicRepos: number;
  totalStars: number;
  prsCount: number;
  contributionsCount: number;
  followers: number;
}

const CACHE_KEY = 'github_stats_cache_aryankhandare_v2';
const CACHE_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours

const fetchStats = async (): Promise<GitHubStats> => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
        return parsed.data;
      }
    } catch (e) {
      console.warn("Failed to parse cached github stats, fetching fresh data...");
    }
  }

  // Fallbacks in case GitHub API fails or rate limit is hit
  const stats: GitHubStats = {
    publicRepos: 45,
    totalStars: 82,
    prsCount: 152,
    contributionsCount: 1054,
    followers: 24,
  };

  try {
    const username = 'AryanKhandare';
    
    // Fetch profile for repository count & followers
    const profilePromise = fetch(`https://api.github.com/users/${username}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          if (typeof data.public_repos === 'number') stats.publicRepos = data.public_repos;
          if (typeof data.followers === 'number') stats.followers = data.followers;
        }
      });

    // Fetch repositories for total star count
    const starsPromise = fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
      .then(res => res.ok ? res.json() : null)
      .then(repos => {
        if (Array.isArray(repos)) {
          stats.totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
        }
      });

    // Fetch PRs count via Search API
    const prsPromise = fetch(`https://api.github.com/search/issues?q=type:pr+author:${username}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data.total_count === 'number') {
          stats.prsCount = data.total_count;
        }
      });

    // Fetch contribution calendar summary count
    const contributionsPromise = fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.total && typeof data.total.last === 'number') {
          stats.contributionsCount = data.total.last;
        }
      });

    await Promise.allSettled([profilePromise, starsPromise, prsPromise, contributionsPromise]);

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: stats
    }));
  } catch (err) {
    console.error("Error fetching GitHub statistics:", err);
  }

  return stats;
};

// SVG Circular Progress Component for LeetCode
const LeetCodeCircularProgress: React.FC<{ solved: number; total: number }> = ({ solved, total }) => {
  const percentage = Math.min(100, Math.round((solved / total) * 100)) || 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
      {/* Outer rotating HUD ring */}
      <div className="absolute inset-0 border border-dashed border-purple-accent/15 rounded-full animate-hud-spin-cw" />
      <div className="absolute inset-2 border border-dotted border-blue-accent/10 rounded-full animate-hud-spin-ccw" />
      
      <svg className="w-32 h-32 transform -rotate-90">
        {/* Track ring */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.02)"
          strokeWidth="6"
        />
        {/* Progress path with neon gradient glow */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="transparent"
          stroke="url(#leetcode-neon-gradient)"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out filter drop-shadow-[0_0_6px_#a855f7]"
        />
        <defs>
          <linearGradient id="leetcode-neon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center Ratio */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-heading text-white tracking-tight">{solved}</span>
        <span className="text-[9px] text-gray-500 font-mono tracking-wider uppercase">Solved</span>
      </div>
    </div>
  );
};

// Symmetrical progress bar for LeetCode categories
const ProgressLine: React.FC<{ label: string; current: number; total: number; colorClass: string; glowColor: string }> = ({ label, current, total, colorClass, glowColor }) => {
  const percentage = Math.round((current / total) * 100) || 0;
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400 font-medium font-sans">{label}</span>
        <span className="font-mono text-white/90 font-bold">{current} <span className="text-gray-600">/</span> {total}</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
        <div 
          className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`} 
          style={{ 
            width: `${percentage}%`,
            boxShadow: `0 0 8px ${glowColor}`
          }} 
        />
      </div>
    </div>
  );
};

export const CodingStats: React.FC = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  // Frame container animations
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  const badgeData = {
    name: "Azure Data Fundamentals",
    description: "DP-900 Certified",
    image: "/badges/microsoft-certified-azure-data-fundamentals.png",
    color: "rgba(59,130,246,0.06)",
    borderColor: "rgba(59,130,246,0.15)"
  };

  return (
    <section
      id="coding-stats"
      className="relative w-full bg-bg-dark text-white px-6 pt-16 pb-20 lg:pt-20 lg:pb-24 overflow-hidden border-t border-white/5"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-purple-accent font-heading text-xs font-semibold uppercase tracking-widest block mb-2">
            06 / TELEMETRY
          </span>
          <h2 className="section-heading">Coding Stats</h2>
        </div>

        {/* 3-Zone Cybernetic Dashboard Grid */}
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          
          {/* ZONE 1: LEFT SIDE - Developer Activity Center (5/12 Grid) */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Engineering Consistency Card (GitHub Calendar) */}
            <div className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col gap-5 relative overflow-hidden group hover:border-purple-accent/20 transition-all duration-300 flex-1">
              {/* Subtle top laser scanline */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-accent/40 to-transparent pointer-events-none" />
              
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <TrendingUp className="w-4.5 h-4.5 text-purple-accent" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-heading text-white tracking-wide">GITHUB CONTRIBUTION ACTIVITY</h3>
                    <span className="text-[10px] text-gray-500 font-mono">SYSTEM LOG: ACTIVE_MONITOR</span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-green-400 font-mono flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  SYNCED LIVE
                </span>
              </div>

              {/* Heatmap Grid */}
              <div className="flex flex-col gap-2 w-full overflow-hidden">
                <div className="flex justify-start items-center overflow-x-auto py-2 pr-2 scrollbar-none w-full select-none">
                  <div className="min-w-[620px] sm:min-w-0 w-full text-white/95 filter brightness-105">
                    <GitHubCalendar
                      username="AryanKhandare"
                      colorScheme="dark"
                      theme={{
                        dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
                      }}
                      showColorLegend={true}
                      showMonthLabels={true}
                      showTotalCount={true}
                      labels={{
                        totalCount: '{{count}} kernels compiled in the past cycle',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-auto pt-4 border-t border-white/5 text-center">
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-accent/20 transition-colors">
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider block font-mono">Repos</span>
                  <span className="text-lg font-bold font-heading text-white mt-0.5 block">
                    {loading ? <span className="inline-block w-6 h-5 bg-white/10 rounded animate-pulse" /> : stats?.publicRepos}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-accent/20 transition-colors">
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider block font-mono">PRs</span>
                  <span className="text-lg font-bold font-heading text-white mt-0.5 block">
                    {loading ? <span className="inline-block w-6 h-5 bg-white/10 rounded animate-pulse" /> : stats?.prsCount}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-accent/20 transition-colors">
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider block font-mono">Stars</span>
                  <span className="text-lg font-bold font-heading text-white mt-0.5 block">
                    {loading ? <span className="inline-block w-6 h-5 bg-white/10 rounded animate-pulse" /> : stats?.totalStars}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-accent/20 transition-colors col-span-1">
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider block font-mono">Commits</span>
                  <span className="text-lg font-bold font-heading text-white mt-0.5 block">
                    {loading ? <span className="inline-block w-8 h-5 bg-white/10 rounded animate-pulse" /> : stats?.contributionsCount}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-accent/20 transition-colors col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider block font-mono">Followers</span>
                  <span className="text-lg font-bold font-heading text-white mt-0.5 block">
                    {loading ? <span className="inline-block w-6 h-5 bg-white/10 rounded animate-pulse" /> : stats?.followers}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ZONE 2: CENTER - AI Core Centerpiece (3/12 Grid) */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-3 flex flex-col gap-6"
          >
            <div className="glass-panel p-5 rounded-3xl border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-cyan-accent/20 transition-all duration-300 flex-1">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-accent animate-pulse" />
                  <h3 className="text-sm font-bold font-heading text-white tracking-wide">NEURAL CORE</h3>
                </div>
                <span className="text-[8px] text-cyan-accent font-mono uppercase tracking-wider">AI_ENGINE_ONLINE</span>
              </div>

              {/* Three.js AI Core Centerpiece */}
              <div className="relative flex-1 min-h-[300px]">
                <AICoreCanvas />
                
                {/* Embedded Floating HUD stats telemetry details overlay */}
                <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1 pointer-events-none text-left">
                  <span className="text-[8px] text-gray-500 font-mono leading-none">CLK_FREQ: 4.8 GHZ</span>
                  <span className="text-[8px] text-gray-500 font-mono leading-none">NEURAL_NODES: 2,048</span>
                  <span className="text-[8px] text-gray-500 font-mono leading-none">MODEL_WEIGHTS: 16B FP8</span>
                </div>
                <div className="absolute top-4 right-4 z-20 pointer-events-none text-right">
                  <span className="text-[8px] text-cyan-accent font-mono leading-none tracking-widest animate-pulse">PROCESSING</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ZONE 3: RIGHT SIDE - Performance Metrics & Knowledge (4/12 Grid) */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* Problem Solving Engine (LeetCode) */}
            <div className="glass-panel p-5 rounded-3xl border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-purple-accent/20 transition-all duration-300">
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-2">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <Code className="w-4 h-4 text-blue-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-white tracking-wide">PROBLEM SOLVING ENGINE</h3>
                  <span className="text-[10px] text-gray-500 font-mono">METRICS: LEETCODE</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 my-1">
                {/* SVG Progress Ring */}
                <LeetCodeCircularProgress solved={500} total={720} />

                {/* Progress bars split */}
                <div className="flex flex-col gap-2.5 w-full">
                  <ProgressLine label="Easy" current={180} total={220} colorClass="bg-emerald-500" glowColor="rgba(16,185,129,0.3)" />
                  <ProgressLine label="Medium" current={280} total={400} colorClass="bg-amber-500" glowColor="rgba(245,158,11,0.3)" />
                  <ProgressLine label="Hard" current={40} total={100} colorClass="bg-rose-500" glowColor="rgba(244,63,94,0.3)" />
                </div>
              </div>

              {/* Telemetry sub-stats */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center font-mono">
                <div>
                  <span className="text-[8px] text-gray-500 block uppercase">Global Rank</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">Top 6.8%</span>
                </div>
                <div>
                  <span className="text-[8px] text-gray-500 block uppercase">Rating</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">1,842</span>
                </div>
                <div>
                  <span className="text-[8px] text-gray-500 block uppercase">Streak</span>
                  <span className="text-xs font-bold text-cyan-accent mt-0.5 block">24 Days</span>
                </div>
              </div>
            </div>

            {/* Verified Knowledge Vault (Certifications) */}
            <div className="glass-panel p-5 rounded-3xl border-white/5 flex flex-col gap-4 relative overflow-hidden group/vault hover:border-blue-accent/30 transition-all duration-300 flex-1 justify-between">
              {/* Laser sweep animation scanner lines bar */}
              <div className="absolute inset-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-blue-accent to-transparent opacity-0 group-hover/vault:opacity-100 animate-laser-sweep pointer-events-none z-10" />

              <div className="flex items-center gap-2.5 border-b border-white/5 pb-2">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-blue-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading text-white tracking-wide">VERIFIED KNOWLEDGE VAULT</h3>
                  <span className="text-[10px] text-gray-500 font-mono">SYSTEM LOG: DP-900_CERT</span>
                </div>
              </div>

              {/* Holographic Azure Credentials Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-white/[0.01] to-blue-accent/[0.03] border border-white/5 relative overflow-hidden group/badge flex-1">
                {/* Cyber HUD Corner Brackets */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-blue-accent/20 pointer-events-none" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-blue-accent/20 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-blue-accent/20 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-blue-accent/20 pointer-events-none" />

                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center p-2 border bg-black/40 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover/badge:scale-105 group-hover/badge:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 shrink-0"
                  style={{ 
                    backgroundColor: badgeData.color,
                    borderColor: badgeData.borderColor 
                  }}
                >
                  <img
                    src={badgeData.image}
                    alt={badgeData.name}
                    className="w-full h-full object-contain filter brightness-110 drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-white leading-tight font-heading group-hover/badge:text-blue-accent transition-colors duration-300">
                    {badgeData.name}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-wider">
                    {badgeData.description}
                  </span>
                  <span className="inline-flex items-center gap-1 mt-2.5 text-[8px] font-bold text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                    Verified Active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>



      </div>
    </section>
  );
};

export default CodingStats;
