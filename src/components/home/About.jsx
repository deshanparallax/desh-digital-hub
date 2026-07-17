import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 relative overflow-hidden bg-slate-950 border-t border-white/5">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 drop-shadow-md tracking-tight">අප ගැන</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-600 to-blue-600 mx-auto rounded-full mb-6 md:mb-8 shadow-[0_0_10px_rgba(8,145,178,0.6)]"></div>
          
          <p className="text-base md:text-xl text-slate-300 leading-relaxed font-medium">
            අපි විශ්වාසදායී ඩිජිටල් සේවා මධ්‍යස්ථානයක් සහ මුද්‍රණාලයක් වෙමු. 
            අපගේ අරමුණ වන්නේ වේගවත්, දැරිය හැකි සහ විශ්වාසදායී සේවාවන් අපගේ ගනුදෙනුකරුවන්ට ලබා දීමයි. 
            ඔබට අවශ්‍ය සියලුම මුද්‍රණ කටයුතු, හදිසි පරිගණක අලුත්වැඩියාවන් මෙන්ම අන්තර්ජාල සේවාවන් 
            එකම වහලක් යටින් විශ්වාසවන්තව ලබාගත හැක.
          </p>
        </div>
      </div>
    </section>
  );
}
