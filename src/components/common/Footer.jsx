import React from 'react';
import logo from "../../assets/logo.webp";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 py-16 border-t-[6px] border-cyan-600 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <a href="#" className="inline-block mb-4">
              <img src={logo} alt="DESH Digital Hub" className="h-14 object-contain" />
            </a>
            <p className="text-sm text-slate-400">
              A trusted digital service center and print shop in Melsiripura offering fast, affordable, and reliable services.
            </p>
            <div className="inline-block mt-4 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-400 text-sm font-semibold">
              Open 7 Days a Week
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white mb-4">Contact Us</h5>
            <div className="flex items-start space-x-3 text-sm">
              <svg className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span>204/1, Pitapahamuna, Hiriyala,<br />Lenawa, Melsiripura,<br />60540, LK</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <svg className="w-5 h-5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <a href="tel:0719989000" className="hover:text-cyan-400 transition-colors">071 998 9000</a>
            </div>
          </div>

          {/* Our Location Map */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white mb-4">Our Location</h5>
            <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden border border-slate-700 shadow-lg relative group">
              <iframe 
                src="https://maps.google.com/maps?q=DESH+Digital+Hub,+Melsiripura&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="DESH Digital Hub Location"
                className="grayscale group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
              <a 
                href="https://maps.app.goo.gl/nwVsN7aH5cPCbgxJ9" 
                target="_blank" 
                rel="noreferrer"
                className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm text-cyan-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-cyan-600 hover:text-white transition-colors"
              >
                Open Maps
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white mb-4">Follow Us</h5>
            <div className="flex flex-wrap gap-3">
              {['FB', 'IG', 'YT', 'TT', 'X', 'IN', 'WA'].map((platform) => (
                <a 
                  key={platform}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold hover:bg-cyan-600 hover:text-white transition-colors"
                  title={platform}
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>

        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} DESH Digital Hub. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for Melsiripura</p>
        </div>
      </div>
    </footer>
  );
}
