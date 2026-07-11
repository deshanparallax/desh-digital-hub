import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Services() {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      name: 'Printing & Scanning',
      colorClass: 'text-blue-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
      ),
      description: 'High-quality printing and document scanning services.',
      items: [
        { name: 'Printout / Photocopy [B/W]', price: '10.00 LKR' },
        { name: 'Printout / Photocopy [Color]', price: '20.00 LKR' },
        { name: 'Scan', price: '20.00 LKR' }
      ]
    },
    {
      name: 'Document Laminating',
      colorClass: 'text-emerald-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      ),
      description: 'Protect your valuable certificates, IDs, and documents with premium lamination.',
      items: [
        { name: 'Laminating [NIC Size]', price: '50.00 LKR' },
        { name: 'Laminating [A4]', price: '150.00 LKR' },
        { name: 'Laminating [Legal]', price: '200.00 LKR' },
        { name: 'Laminating [A3]', price: '250.00 LKR' }
      ]
    },
    {
      name: 'Book Binding',
      colorClass: 'text-orange-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
      ),
      description: 'Professional binding services for reports, assignments, and books.',
      items: [
        { name: 'Book Binding [pgs > 20]', price: '200.00 LKR' },
        { name: 'Book Binding [pgs > 50]', price: '300.00 LKR' },
        { name: 'Book Binding [pgs < 100]', price: '400.00 LKR' },
        { name: 'Book Binding - Tape Binding', price: '250.00 LKR' }
      ]
    },
    {
      name: 'Graphic & Editing',
      colorClass: 'text-pink-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
      ),
      description: 'Custom creative designs for businesses, events, and personal use.',
      items: [
        { name: 'CV [Without Photo]', price: '250.00 LKR' },
        { name: 'CV [With Photo]', price: '350.00 LKR' },
        { name: 'CV [Advanced + ATS Friendly]', price: '800.00 LKR' },
        { name: 'Name Tag', price: '120.00 LKR' },
        { name: 'Name Stickers [Color]', price: '100.00 LKR' },
        { name: 'Name Stickers [B/W]', price: '80.00 LKR' },
        { name: 'Book Cover Design', price: '200.00 LKR' }
      ]
    },
    {
      name: 'Online Services',
      colorClass: 'text-purple-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      ),
      description: 'Reliable help for submitting government applications, visa forms, and exams online.',
      items: [
        { name: 'Online Application [Per Page]', price: '150.00 LKR' },
        { name: 'Campus Application', price: '400.00 LKR' },
        { name: 'Email', price: '50.00 LKR' }
      ]
    },
    {
      name: 'Downloads & Media',
      colorClass: 'text-yellow-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      ),
      description: 'Fast downloads for the latest movies, PC games, and essential software.',
      items: [
        { name: 'Images', price: '5.00 LKR' },
        { name: 'Mp3 Songs', price: '1.00 LKR' },
        { name: 'Movies', price: '50.00 LKR' },
        { name: 'Video Songs', price: '20.00 LKR' },
        { name: 'Software [1GB]', price: '100.00 LKR' },
        { name: 'Games [1GB]', price: '100.00 LKR' },
        { name: 'Exam Result Sheet', price: '50.00 LKR' }
      ]
    },
    {
      name: 'PC & Laptop Repair',
      colorClass: 'text-red-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      ),
      description: 'Expert diagnostics and repairs for desktops and laptops.',
      items: [
        { name: 'Computer Formatting', price: '1500.00 LKR' },
        { name: 'Software Installation', price: '200.00 LKR' },
        { name: 'Driver Updating', price: '300.00 LKR' },
        { name: 'PC / Laptop Service', price: '500.00 LKR' }
      ]
    }
  ];

  return (
    <div id="services" className="w-full max-w-6xl mt-4 pt-8 border-t border-slate-700/50 container mx-auto px-4 z-10 relative">
      <h3 className="text-cyan-400 font-semibold mb-8 uppercase tracking-widest text-sm text-center">Our Core Services</h3>
      <p className="text-slate-400 text-sm mb-10 text-center">Click on any service tile to view details and prices</p>
      
      {/* 1. Single Row of Small Tiles */}
      <div className="flex overflow-x-auto md:justify-center gap-3 w-full -mt-8 pt-8 pb-8 snap-x snap-mandatory no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {services.map((service, idx) => {
          const isActive = activeService === idx;
          
          return (
            <motion.div 
              key={idx} 
              onClick={() => setActiveService(isActive ? null : idx)}
              className={`cursor-pointer overflow-hidden backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center group relative transition-all duration-300 flex-shrink-0 snap-center
                w-28 h-32 md:w-36 md:h-40 border p-3 md:p-4
                ${isActive 
                  ? 'border-cyan-400 bg-slate-800/80 shadow-[0_0_20px_rgba(8,145,178,0.4)] -translate-y-2' 
                  : 'border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/60 hover:border-cyan-400/50 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(8,145,178,0.2)]'}`}
            >
              {/* Internal Glowing Gradient */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              <div className={`transition-all duration-300 ${service.colorClass || 'text-cyan-400'} ${isActive ? 'scale-110 drop-shadow-[0_0_10px_currentColor]' : 'group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_currentColor]'}`}>
                <div className="mb-2 md:mb-3 flex justify-center">{service.icon}</div>
              </div>
              <span className={`font-medium transition-all duration-300 text-[10px] md:text-xs text-center leading-tight ${isActive ? 'text-white font-bold' : 'text-slate-300 group-hover:text-white'}`}>
                {service.name}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* 2. Details Pane Below */}
      <div className="min-h-[400px]"> {/* Prevents layout jumping when opening */}
        <AnimatePresence mode="wait">
          {activeService !== null && (
            <motion.div 
              key={activeService}
              initial={{ opacity: 0, height: 0, y: -20 }} 
              animate={{ opacity: 1, height: 'auto', y: 0 }} 
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full text-left overflow-hidden bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-10"
            >
              <div className="p-6 md:p-8 relative">
                {/* Close Button */}
                <button 
                  onClick={() => setActiveService(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-white p-2 bg-slate-900/50 hover:bg-slate-700 rounded-full transition-colors z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                
                <div className="flex flex-col md:flex-row md:items-center mb-8 gap-4 md:gap-6 pr-10">
                  <div className={`p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 self-start md:self-auto ${services[activeService].colorClass || 'text-cyan-400'}`}>
                    <div className="drop-shadow-[0_0_15px_currentColor] scale-125 md:scale-150 p-2">
                      {services[activeService].icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-3xl font-bold text-white tracking-tight mb-2">{services[activeService].name}</h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">
                      {services[activeService].description}
                    </p>
                  </div>
                </div>
                
                <h4 className="text-cyan-400 font-semibold mb-4 text-sm tracking-wide uppercase border-b border-slate-700 pb-2">Available Sub-Services & Prices</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {services[activeService].items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-colors shadow-inner group">
                      <span className="text-slate-200 text-sm font-medium group-hover:text-white transition-colors">{item.name}</span>
                      <span className="text-cyan-400 text-sm font-bold ml-4 text-right whitespace-nowrap bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-800/50">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
