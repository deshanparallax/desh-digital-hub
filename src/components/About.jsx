import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">About Us</h2>
        <div className="h-1 w-20 bg-cyan-600 mx-auto rounded-full mb-8"></div>
        <p className="text-lg text-slate-600 leading-relaxed">
          We are a trusted digital service center and print shop located in Melsiripura. 
          Our mission is to provide fast, affordable, and highly reliable services to our community. 
          Whether you need professional printing, urgent tech repairs, or quick online assistance, 
          we are fully equipped to handle all your requirements under one roof.
        </p>
      </div>
    </section>
  );
}
