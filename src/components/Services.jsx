import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Services() {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      name: 'Computer Repairs & Services',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      ),
      description: 'Expert diagnostics and repairs for desktops and laptops. Hardware upgrades and software troubleshooting.',
      items: [
        { name: 'PC / Laptop Service', price: '500.00 LKR' },
        { name: 'Computer Formatting', price: '1500.00 LKR' },
        { name: 'Software Installation', price: '200.00 LKR' },
        { name: 'Driver Updating', price: '300.00 LKR' }
      ]
    },
    {
      name: 'Printouts & Photocopies',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
      ),
      description: 'High-quality color and black & white printing/copying for all document sizes.',
      items: [
        { name: 'Printout / Photocopy [B/W]', price: '10.00 LKR' },
        { name: 'Printout / Photocopy [Color]', price: '20.00 LKR' },
        { name: 'Exam Result Sheet', price: '50.00 LKR' }
      ]
    },
    {
      name: 'Document Laminating',
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
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
      ),
      description: 'Professional binding services for reports, assignments, and books.',
      items: [
        { name: 'Book Binding [> 20]', price: '150.00 LKR' },
        { name: 'Book Binding [> 50]', price: '200.00 LKR' },
        { name: 'Book Binding [< 100]', price: '300.00 LKR' }
      ]
    },
    {
      name: 'Scanning Services',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
      ),
      description: 'High-resolution digital scanning for photos, documents, and books.',
      items: [
        { name: 'Scan', price: '20.00 LKR' }
      ]
    },
    {
      name: 'Email Services',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      ),
      description: 'Assistance with sending, receiving, typing, and formatting emails securely.',
      items: [
        { name: 'Email', price: '50.00 LKR' }
      ]
    },
    {
      name: 'Online Form Filling',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
      ),
      description: 'Reliable help for submitting government applications, visa forms, and exams online.',
      items: [
        { name: 'Online Application [Per Page]', price: '100.00 LKR' },
        { name: 'Campus Application', price: '500.00 LKR' }
      ]
    },
    {
      name: 'Movies, Games & Software',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      ),
      description: 'Fast downloads for the latest movies, PC games, and essential software.',
      items: [
        { name: 'Movies', price: '50.00 LKR' },
        { name: 'Video Songs', price: '10.00 LKR' },
        { name: 'Mp3 Songs', price: '1.00 LKR' },
        { name: 'Games [1GB]', price: '100.00 LKR' },
        { name: 'Software [1GB]', price: '100.00 LKR' }
      ]
    },
    {
      name: 'Graphic Designing',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
      ),
      description: 'Custom creative designs for businesses, events, and personal use.',
      items: [
        { name: 'CV [Advanced]', price: '500.00 LKR' },
        { name: 'CV [Normal]', price: '350.00 LKR' },
        { name: 'CV [Without Photo]', price: '300.00 LKR' },
        { name: 'Name Tag', price: '100.00 LKR' },
        { name: 'Name Stickers [Color]', price: '80.00 LKR' },
        { name: 'Name Stickers [B/W]', price: '60.00 LKR' },
        { name: 'Music Creation [Per Song]', price: '100.00 LKR' },
        { name: 'Fuel QR', price: '100.00 LKR' }
      ]
    },
    {
      name: 'Mobile Reloads & Data',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
      ),
      description: 'Instant mobile reloads, data activations, and bill payments for all networks.',
      items: [
        { name: 'Dialog / Mobitel Reloads', price: 'Any Amount' },
        { name: 'Airtel / Hutch Reloads', price: 'Any Amount' },
        { name: 'Data Card / Package Activation', price: 'Network Rates' },
        { name: 'Postpaid Bill Settlements', price: 'Standard Fee' }
      ]
    },
    {
      name: 'Electricity Bill Payments',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      ),
      description: 'Convenient and secure utility bill payments to save your time.',
      items: [
        { name: 'Elecricity Bill Payment', price: '50.00 LKR' }
      ]
    }
  ];

  return (
    <div id="services" className="w-full max-w-6xl mt-4 pt-8 border-t border-slate-700/50 container mx-auto px-4 z-10 relative">
      <h3 className="text-cyan-400 font-semibold mb-8 uppercase tracking-widest text-sm text-center">Our Core Services</h3>
      <p className="text-slate-400 text-sm mb-10 text-center">Click on any service tile to view details and prices</p>
      
      <div className="flex flex-wrap justify-center gap-4 w-full pb-20">
        {services.map((service, idx) => {
          const isActive = activeService === idx;
          
          return (
            <motion.div 
              layout
              key={idx} 
              onClick={() => setActiveService(isActive ? null : idx)}
              className={`cursor-pointer overflow-hidden backdrop-blur-xl rounded-3xl flex flex-col group relative transition-all duration-500
                ${isActive 
                  ? 'w-full p-6 md:p-8 border border-cyan-400 bg-slate-900/80 shadow-[0_0_40px_rgba(8,145,178,0.4)]' 
                  : 'w-[calc(50%-0.5rem)] sm:w-[calc(33.33%-0.67rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(16.66%-0.84rem)] items-center justify-center p-4 h-40 md:h-44 border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/80 hover:border-cyan-400/80 hover:shadow-[0_15px_30px_rgba(8,145,178,0.3)] hover:-translate-y-3'}`}
            >
              {/* Internal Glowing Gradient */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              <motion.div layout="position" className={`flex flex-grow relative z-10 ${isActive ? 'flex-row items-center justify-start w-full mb-6' : 'flex-col items-center justify-center h-full w-full'}`}>
                <motion.div layout="position" className={`text-cyan-400 transition-all duration-500 ${isActive ? 'mr-5 scale-[1.3] drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'mb-3 group-hover:scale-125 group-hover:text-cyan-300 group-hover:-translate-y-1 group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]'}`}>
                  {service.icon}
                </motion.div>
                <motion.span layout="position" className={`text-slate-200 font-medium transition-all duration-500 ${isActive ? 'text-xl md:text-3xl text-white font-bold tracking-tight' : 'text-xs md:text-sm text-center leading-tight group-hover:text-white group-hover:-translate-y-1'}`}>
                  {service.name}
                </motion.span>
              </motion.div>
              
              <AnimatePresence>
                {!isActive && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bottom-3 w-full flex flex-col items-center opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[9px] text-cyan-300 font-bold uppercase tracking-[0.2em] hidden group-hover:block transition-all mb-1 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">View Info</span>
                    <svg className="w-4 h-4 text-cyan-400 animate-bounce drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full text-left overflow-hidden border-t border-slate-700/50"
                  >
                    <div className="pt-6">
                      <p className="text-slate-300 mb-8 text-sm md:text-base leading-relaxed">
                        {service.description}
                      </p>
                      
                      <h4 className="text-cyan-400 font-semibold mb-4 text-sm tracking-wide uppercase">Available Sub-Services & Prices</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                            <span className="text-slate-200 text-sm font-medium">{item.name}</span>
                            <span className="text-cyan-300 text-sm font-bold ml-4 text-right whitespace-nowrap">{item.price}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 pt-6 flex justify-end">
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             setActiveService(null);
                           }}
                           className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                         >
                           Close Details
                         </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
