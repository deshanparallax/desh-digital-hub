import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ChevronRight } from 'lucide-react';
import logo from '../../assets/logo.webp';

export default function Login({ email, setEmail, password, setPassword, handleLogin }) {
  const [rememberMe, setRememberMe] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-900">
      
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"
        />
      </div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="backdrop-blur-2xl bg-white/95 p-8 sm:p-10 rounded-[2rem] border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
          
          {/* Subtle top glare */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center mb-10"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition duration-700"></div>
              <img src={logo} alt="DESH Digital Hub" className="h-20 sm:h-24 object-contain relative z-10 scale-110" />
            </div>
            <div className="mt-8 text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-wide">Welcome Back</h2>
              <p className="text-slate-500 text-sm font-medium">Enter your credentials to access the portal</p>
            </div>
          </motion.div>

          <form onSubmit={(e) => handleLogin(e, rememberMe)} className="space-y-6">
            
            {/* Input Fields */}
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-1.5"
              >
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                    placeholder="admin@desh.lk"
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-1.5"
              >
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400 tracking-widest"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Remember Me */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 bg-white focus:ring-emerald-500/30 focus:ring-offset-0 cursor-pointer appearance-none transition-all checked:bg-emerald-500 checked:border-emerald-500"
                  />
                  {rememberMe && <ShieldCheck className="w-3 h-3 text-white absolute pointer-events-none" />}
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors select-none">
                  Remember me
                </span>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button 
                type="submit" 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all overflow-hidden flex items-center justify-center gap-2 text-[15px] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 flex items-center justify-center w-full">
                  Secure Login
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ChevronRight className="w-5 h-5 ml-1 opacity-70" />
                  </motion.div>
                </span>
              </button>
            </motion.div>

          </form>
        </div>
        
        {/* Footer Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-xs font-medium text-slate-500 flex items-center justify-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
          Secured by DESH Authentication
        </motion.div>

      </motion.div>

      {/* Footer exactly like expense-tracker */}
      <footer className="absolute bottom-0 w-full flex items-center justify-center gap-3 py-8 border-t border-slate-800/30 text-slate-400 text-sm font-medium bg-slate-950/40 backdrop-blur-md z-20">
        <span className="tracking-wide">Developed By</span>
        <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800 shadow-inner">
          <img src={`${import.meta.env.BASE_URL}desh-logo.png`} alt="DEH Logo" className="h-6 w-auto object-contain drop-shadow-md" />
          <span className="text-slate-200 font-black tracking-widest uppercase">Desh</span>
        </div>
      </footer>
    </div>
  );
}
