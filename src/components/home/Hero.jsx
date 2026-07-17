import React from 'react';

export default function Hero() {
  return (
    <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center w-full mt-6 mb-16">
      <h1 className="text-6xl md:text-8xl font-extrabold leading-tight tracking-tighter text-white mb-6 drop-shadow-2xl">
        DESH <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient-x">Digital Hub</span>
      </h1>
      
      <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-3xl mx-auto mb-10 drop-shadow-lg">
        YOUR ONE-STOP DIGITAL SOLUTION. Fast, affordable, and reliable digital services & printing.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a href="#services" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg hover:from-cyan-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] hover:-translate-y-1">
          Explore Services
        </a>
        <a href="#contact" className="px-8 py-3.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-slate-200 font-bold text-lg hover:bg-slate-700 hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          Contact Us
        </a>
      </div>
    </div>
  );
}
