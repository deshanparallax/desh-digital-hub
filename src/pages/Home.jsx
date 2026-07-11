import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import About from '../components/home/About';

export default function Home() {
  return (
    <MainLayout>
      <section id="home" className="relative flex flex-col items-center pt-8 md:pt-12 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <Hero />
        <Services />
      </section>
      
      <About />
    </MainLayout>
  );
}
