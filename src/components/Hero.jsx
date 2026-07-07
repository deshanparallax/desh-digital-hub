import React from 'react';

export default function Hero() {
  return (
    <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center w-full mt-6">
      <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-white mb-6">
        DESH <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">Digital Hub</span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto mb-4">
        YOUR ONE-STOP DIGITAL SOLUTION. Fast, affordable, and reliable digital services & printing.
      </p>
    </div>
  );
}
