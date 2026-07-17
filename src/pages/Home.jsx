import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import About from '../components/home/About';

export default function Home() {
  return (
    <MainLayout>
      <section id="home" className="relative flex flex-col items-center pt-16 md:pt-24 pb-16 min-h-[90vh] overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Tech Mesh Overlay */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <Hero />
        <Services />
      </section>
      
      <About />
    </MainLayout>
  );
}
