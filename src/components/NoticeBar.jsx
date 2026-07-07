import React from 'react';

export default function NoticeBar() {
  return (
    <div className="bg-slate-900 text-cyan-400 py-2 border-b border-cyan-600/30 overflow-hidden flex items-center relative z-50">
      <div className="animate-marquee whitespace-nowrap text-xs md:text-sm font-semibold tracking-wider">
        <span className="mx-8">🔥 Special Offer: Fast & Secure CV Designs starting at 300 LKR!</span>
        <span className="mx-8">⭐ New Service: Register your Fuel QR for just 100 LKR!</span>
        <span className="mx-8">🚀 Quick Document Scanning & Emailing Available!</span>
        <span className="mx-8">💻 Professional PC / Laptop Formatting & Repairs!</span>
        <span className="mx-8">🔥 Special Offer: Fast & Secure CV Designs starting at 300 LKR!</span>
      </div>
    </div>
  );
}
