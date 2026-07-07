import React from 'react';
import NoticeBar from './components/NoticeBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-600 selection:text-white flex flex-col relative">
      <NoticeBar />
      <Navbar />

      <main className="flex-grow">
        <section id="home" className="relative flex flex-col items-center pt-8 md:pt-12 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <Hero />
          <Services />
        </section>
        
        <About />
      </main>

      <Footer />
    </div>
  );
}
