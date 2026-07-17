import React from 'react';
import logo from "../../assets/logo.webp";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 py-10 md:py-16 border-t border-white/5 mt-auto relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <a href="#" className="inline-block mb-4">
              <img src={logo} alt="DESH Digital Hub" className="h-14 object-contain" />
            </a>
            <p className="text-sm text-slate-400">
              වේගවත්, දැරිය හැකි සහ විශ්වාසදායී සේවාවන් සපයන ඩිජිටල් සේවා මධ්‍යස්ථානය.
            </p>
            <div className="inline-block mt-4 px-4 py-1.5 rounded-lg bg-slate-900 border border-cyan-800/50 text-cyan-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(8,145,178,0.15)]">
              සතියේ දින 7 ම විවෘතයි
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white mb-4">අපව අමතන්න</h5>
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
            <h5 className="text-lg font-semibold text-white mb-4">අප පිහිටි ස්ථානය</h5>
            <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative group">
              <iframe 
                src="https://maps.google.com/maps?q=DESH+Digital+Hub,+Melsiripura&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                title="DESH Digital Hub Location"
              ></iframe>
              <a 
                href="https://maps.app.goo.gl/9vC3Xq2K7sKjX9n28" 
                target="_blank" 
                rel="noreferrer"
                className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm text-cyan-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-cyan-600 hover:text-white transition-colors"
              >
                අප සිටින ස්ථානය (Maps)
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white mb-4">අප හා එක්වන්න</h5>
            <div className="flex flex-wrap gap-3">
              {['FB', 'IG', 'YT', 'TT', 'X', 'IN', 'WA'].map((platform) => (
                <a 
                  key={platform}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-cyan-600 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(8,145,178,0.5)] transition-all hover:-translate-y-1"
                >
                  <span className="text-xs font-bold">{platform}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500 relative z-10">
          <p>&copy; {new Date().getFullYear()} DESH Digital Hub. සියලුම හිමිකම් ඇවිරිණි.</p>
        </div>
      </div>
    </footer>
  );
}
