import React from 'react';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] w-full">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin absolute top-3 left-3 flex items-center justify-center" style={{ animationDirection: 'reverse' }}></div>
      </div>
      <p className="mt-4 text-slate-400 font-semibold tracking-widest uppercase text-sm animate-pulse">
        Loading...
      </p>
    </div>
  );
}
