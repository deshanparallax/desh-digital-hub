import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Services() {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      name: 'මුද්‍රණ සහ ස්කෑන් සේවා',
      colorClass: 'text-blue-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
      ),
      description: 'උසස් තත්ත්වයේ මුද්‍රණ (Printing) සහ ලිපිලේඛන ස්කෑන් කිරීමේ සේවාවන්.',
      items: [
        { name: 'Printout / Photocopy [B/W]', price: '10.00 LKR' },
        { name: 'Printout / Photocopy [Color]', price: '20.00 LKR' },
        { name: 'Scan', price: '20.00 LKR' },
        { name: 'Budget Print', price: '5.00 LKR' }
      ]
    },
    {
      name: 'ලැමිනේටින් සේවා',
      colorClass: 'text-emerald-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      ),
      description: 'ඔබේ වටිනා සහතිකපත් සහ හැඳුනුම්පත් ආරක්ෂා කරගැනීමට උසස් ලැමිනේටින් සේවාව.',
      items: [
        { name: 'Laminating [NIC Size]', price: '50.00 LKR' },
        { name: 'Laminating [A4]', price: '150.00 LKR' },
        { name: 'Laminating [Legal]', price: '200.00 LKR' },
        { name: 'Laminating [A3]', price: '250.00 LKR' }
      ]
    },
    {
      name: 'පොත් බඳින සේවා (Book Binding)',
      colorClass: 'text-orange-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
      ),
      description: 'වාර්තා, පැවරුම් (Assignments) සහ පොත් සඳහා වෘත්තීය මට්ටමේ බයින්ඩිං සේවාවන්.',
      items: [
        { name: 'Book Binding [pgs > 20]', price: '200.00 LKR' },
        { name: 'Book Binding [pgs > 50]', price: '300.00 LKR' },
        { name: 'Book Binding [pgs < 100]', price: '400.00 LKR' },
        { name: 'Book Binding - Tape Binding', price: '250.00 LKR' }
      ]
    },
    {
      name: 'ග්‍රැෆික් නිර්මාණ (Graphic Design)',
      colorClass: 'text-pink-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
      ),
      description: 'ඔබගේ ව්‍යාපාරයට, උත්සව වලට සහ පුද්ගලික අවශ්‍යතා සඳහා නිර්මාණාත්මක ග්‍රැෆික් නිර්මාණ.',
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
      name: 'මාර්ගගත සේවා (Online Services)',
      colorClass: 'text-purple-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      ),
      description: 'රජයේ අයදුම්පත්, වීසා පෝරම සහ විභාග අයදුම්පත් මාර්ගගතව (Online) යැවීම සඳහා විශ්වාසදායී සේවාව.',
      items: [
        { name: 'Online Application [Per Page]', price: '150.00 LKR' },
        { name: 'Campus Application', price: '400.00 LKR' },
        { name: 'Email', price: '50.00 LKR' },
        { name: 'Vehicle Licence renewal', price: '150.00 LKR' }
      ]
    },
    {
      name: 'ඩවුන්ලෝඩ් සේවා',
      colorClass: 'text-yellow-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      ),
      description: 'නවීන චිත්‍රපට, පරිගණක ක්‍රීඩා සහ මෘදුකාංග (Software) ඉක්මනින් ඩවුන්ලෝඩ් කරගැනීමේ පහසුකම.',
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
      name: 'පරිගණක අලුත්වැඩියාව',
      colorClass: 'text-red-400',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      ),
      description: 'පරිගණක සහ ලැප්ටොප් දෝෂ පරික්ෂා කිරීම සහ අලුත්වැඩියාව.',
      items: [
        { name: 'Computer Formatting', price: '1500.00 LKR' },
        { name: 'Software Installation', price: '500.00 LKR' },
        { name: 'Driver Updating', price: '500.00 LKR' },
        { name: 'PC / Laptop Service', price: '500.00 LKR' }
      ]
    }
  ];

  return (
    <div id="services" className="w-full max-w-6xl mt-4 pt-8 border-t border-white/5 container mx-auto px-4 z-10 relative">
      <h3 className="text-cyan-400 font-bold mb-4 md:mb-8 uppercase tracking-widest text-sm text-center drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">අපගේ ප්‍රධාන සේවාවන්</h3>
      <p className="text-slate-400 text-sm mb-6 md:mb-10 text-center font-medium">වැඩි විස්තර සහ මිල ගණන් දැනගැනීමට අදාළ සේවාව මත ක්ලික් කරන්න</p>
      {/* 1. Wrapped Category Tiles */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full pb-8">
        {services.map((service, idx) => {
          const isActive = activeService === idx;
          
          return (
            <motion.div 
              key={idx} 
              onClick={() => setActiveService(isActive ? null : idx)}
              className={`cursor-pointer overflow-hidden backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center group relative transition-all duration-300 flex-shrink-0
                w-[105px] h-32 sm:w-28 sm:h-32 md:w-36 md:h-40 border p-2 md:p-4
                ${isActive 
                  ? 'border-cyan-400 bg-slate-900/80 shadow-[0_0_25px_rgba(8,145,178,0.4)] -translate-y-2' 
                  : 'border-white/10 bg-slate-900/40 hover:bg-slate-800/60 hover:border-cyan-400/50 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(8,145,178,0.2)]'}`}
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
      <div className="w-full relative">
        <AnimatePresence mode="wait">
          {activeService !== null && (
            <motion.div 
              key={activeService}
              initial={{ opacity: 0, height: 0, y: -20 }} 
              animate={{ opacity: 1, height: 'auto', y: 0 }} 
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full text-left overflow-hidden bg-slate-950/70 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-10 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>
              <div className="p-6 md:p-8 relative z-10">
                {/* Close Button */}
                <button 
                  onClick={() => setActiveService(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-white p-2 bg-slate-900/80 border border-white/10 hover:bg-slate-800 rounded-full transition-all shadow-lg z-20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                
                <div className="flex flex-col md:flex-row md:items-center mb-8 gap-4 md:gap-6 pr-10">
                  <div className={`p-4 rounded-2xl bg-slate-900/60 border border-white/10 shadow-inner self-start md:self-auto ${services[activeService].colorClass || 'text-cyan-400'}`}>
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
                
                <h4 className="text-cyan-400 font-semibold mb-4 text-sm tracking-widest uppercase border-b border-white/10 pb-2 drop-shadow-md">සේවාවන් සහ මිල ගණන්</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {services[activeService].items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all shadow-md hover:shadow-lg group">
                      <span className="text-slate-300 text-sm font-semibold group-hover:text-white transition-colors">{item.name}</span>
                      <span className="text-cyan-400 text-sm font-black ml-4 text-right whitespace-nowrap bg-cyan-950/50 px-3 py-1 rounded-lg border border-cyan-800/50 shadow-inner">{item.price}</span>
                    </div>
                  ))}
                </div>

                {services[activeService].name === 'පරිගණක අලුත්වැඩියාව' && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between bg-slate-900/40 p-4 md:p-6 rounded-2xl border border-white/10">
                    <div className="mb-4 sm:mb-0 text-center sm:text-left">
                      <h5 className="text-white font-bold text-lg mb-1">වෙනත් අලුත්වැඩියා කටයුතු සඳහා</h5>
                      <p className="text-slate-400 text-sm">ඕනෑම පරිගණක දෝෂයක් සඳහා අපව අමතන්න</p>
                    </div>
                    <a 
                      href="https://wa.me/94719989000?text=Hello%20DESH%20Digital%20Hub,%20I%20need%20a%20computer%20repair%20service."
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      Contact via WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
