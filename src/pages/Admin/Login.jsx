import React from 'react';
import logo from '../../assets/logo.webp';

export default function Login({ email, setEmail, password, setPassword, handleLogin, message }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-cyan-600 selection:text-white">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="DESH Digital Hub" className="h-24 md:h-28 object-contain scale-110" />
        </div>
        {message && <p className="text-red-600 text-sm mb-4 text-center font-medium bg-red-50 py-2 rounded-lg">{message}</p>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-700 text-sm mb-2 font-semibold">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 text-sm mb-2 font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              required
            />
          </div>
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.5)] transition-all transform hover:-translate-y-0.5 mt-4">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
}
