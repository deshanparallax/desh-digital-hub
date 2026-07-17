import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from "../../assets/logo.webp";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = {
    'මුල් පිටුව': '#home',
    'සේවාවන්': '#services',
    'අප ගැන': '#about',
    'අපව අමතන්න': '#contact'
  };

  const navItems = Object.entries(navLinks);

  return (
    <nav className="sticky w-full z-50 top-0 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Logo */}
          <a href="#" className="flex items-center h-10 md:h-12 z-50">
            <img src={logo} alt="DESH Digital Hub" className="h-full object-contain scale-125 md:scale-[1.7] origin-left transition-all" />
          </a>
          
          {/* Desktop Navigation & Buttons */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex space-x-8 items-center">
              {navItems.map(([label, href]) => (
                <a 
                  key={label}
                  href={href} 
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all"
                >
                  {label}
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://wa.me/94719989000" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center px-5 py-2.5 rounded-lg bg-[#25D366] text-white text-sm font-bold hover:bg-[#128C7E] transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                අපිට WhatsApp කරන්න
              </a>
              <Link
                to="/admin"
                className="flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-[0_0_10px_rgba(8,145,178,0.3)] hover:shadow-[0_0_20px_rgba(8,145,178,0.6)]"
              >
                පිවිසුම
              </Link>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center z-50">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-cyan-400 focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-[400px] py-4' : 'max-h-0 py-0 border-transparent'}`}
      >
        <div className="flex flex-col px-6 space-y-4">
          {navItems.map(([label, href]) => (
            <a 
              key={label}
              href={href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-300 hover:text-cyan-400 border-b border-white/5 pb-2 transition-all"
            >
              {label}
            </a>
          ))}
          
          <div className="pt-2 flex flex-col space-y-3">
            <a 
              href="https://wa.me/94719989000" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-[#25D366] text-white text-sm font-bold shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              WhatsApp
            </a>
            <Link
              to="/admin"
              className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold shadow-[0_0_10px_rgba(8,145,178,0.3)]"
            >
              පරිපාලක / විකුණුම්කරු පිවිසුම
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
