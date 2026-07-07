import React from 'react';

export default function Navbar() {
  return (
    <nav className="sticky w-full z-50 top-0 glass-nav transition-all duration-300 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <img src="/logo.png" alt="DESH Digital Hub" className="h-10 md:h-12 object-contain" />
        </a>
        <div className="hidden md:flex space-x-8 items-center">
          <a href="#home" className="text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors">Home</a>
          <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors">Services</a>
          <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors">About</a>
          <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-cyan-600 transition-colors">Contact</a>
          <a 
            href="https://wa.me/94719989000" 
            target="_blank" 
            rel="noreferrer"
            className="px-5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </nav>
  );
}
