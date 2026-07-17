import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-950 border-t border-white/5">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 drop-shadow-md tracking-tight">About Us</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-600 to-blue-600 mx-auto rounded-full mb-8 shadow-[0_0_10px_rgba(8,145,178,0.6)]"></div>
          
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
            We are a trusted digital service center and print shop located in Melsiripura. 
            Our mission is to provide fast, affordable, and highly reliable services to our community. 
            Whether you need professional printing, urgent tech repairs, or quick online assistance, 
            we are fully equipped to handle all your requirements under one roof.
          </p>
        </div>
      </div>
    </section>
  );
}
