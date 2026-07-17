import React from 'react';

export default function Hero() {
  return (
    <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center w-full mt-6 md:mt-10 mb-12 md:mb-16">
      <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold leading-tight tracking-tighter text-white mb-4 md:mb-6 drop-shadow-2xl">
        DESH <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient-x block md:inline mt-2 md:mt-0">Digital Hub</span>
      </h1>
      
      <p className="text-lg sm:text-xl md:text-3xl text-cyan-400 font-bold tracking-wider max-w-4xl mx-auto mb-6 drop-shadow-lg uppercase px-2">
        ඔබේ සියලුම ඩිජිටල් අවශ්‍යතා එකම තැනකින්
      </p>

      <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 max-w-4xl mx-auto">
        <span className="px-4 py-2 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full text-slate-300 text-sm md:text-base font-medium flex items-center gap-2 shadow-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-cyan-500/50 transition-all hover:-translate-y-1 cursor-default animate-pulse-slow">
          <span className="text-yellow-400 text-lg">⚡</span> වේගවත්
        </span>
        <span className="px-4 py-2 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full text-slate-300 text-sm md:text-base font-medium flex items-center gap-2 shadow-lg hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:border-emerald-500/50 transition-all hover:-translate-y-1 cursor-default animate-pulse-slow" style={{ animationDelay: '0.2s' }}>
          <span className="text-emerald-400 text-lg">💸</span> සාධාරණ මිල
        </span>
        <span className="px-4 py-2 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full text-slate-300 text-sm md:text-base font-medium flex items-center gap-2 shadow-lg hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:border-blue-500/50 transition-all hover:-translate-y-1 cursor-default animate-pulse-slow" style={{ animationDelay: '0.4s' }}>
          <span className="text-blue-400 text-lg">🛡️</span> විශ්වාසදායී
        </span>
        <span className="px-4 py-2 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full text-slate-300 text-sm md:text-base font-medium flex items-center gap-2 shadow-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:border-purple-500/50 transition-all hover:-translate-y-1 cursor-default animate-pulse-slow" style={{ animationDelay: '0.6s' }}>
          <span className="text-purple-400 text-lg">🖨️</span> ඩිජිටල් සේවා සහ මුද්‍රණ
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center w-full max-w-md md:max-w-none mx-auto px-4 md:px-0">
        <a href="#services" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-base md:text-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] hover:-translate-y-1">
          සේවාවන් බලන්න
        </a>
        <a href="#contact" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-slate-200 font-bold text-base md:text-lg hover:bg-slate-700 hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          අපව අමතන්න
        </a>
      </div>
    </div>
  );
}
